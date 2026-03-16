const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Street Mobilizer Contracts", function () {
  let AccessControlManager, accessControl;
  let StreetMobilizationRegistry, registry;
  let InterventionTracker, tracker;
  let AidDistributionLedger, aidLedger;
  let ChildIdentityToken, identityToken;
  let DeviceRegistry, deviceRegistry;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy AccessControlManager
    AccessControlManager = await ethers.getContractFactory("AccessControlManager");
    accessControl = await AccessControlManager.deploy(owner.address);
    await accessControl.waitForDeployment();

    // Deploy StreetMobilizationRegistry
    StreetMobilizationRegistry = await ethers.getContractFactory("StreetMobilizationRegistry");
    registry = await StreetMobilizationRegistry.deploy();
    await registry.waitForDeployment();

    // Deploy InterventionTracker
    InterventionTracker = await ethers.getContractFactory("InterventionTracker");
    tracker = await InterventionTracker.deploy(await registry.getAddress());
    await tracker.waitForDeployment();

    // Deploy AidDistributionLedger
    AidDistributionLedger = await ethers.getContractFactory("AidDistributionLedger");
    aidLedger = await AidDistributionLedger.deploy();
    await aidLedger.waitForDeployment();

    // Deploy ChildIdentityToken
    ChildIdentityToken = await ethers.getContractFactory("ChildIdentityToken");
    identityToken = await ChildIdentityToken.deploy(owner.address);
    await identityToken.waitForDeployment();

    // Deploy DeviceRegistry
    DeviceRegistry = await ethers.getContractFactory("DeviceRegistry");
    deviceRegistry = await DeviceRegistry.deploy();
    await deviceRegistry.waitForDeployment();
  });

  describe("StreetMobilizationRegistry", function () {
    it("Should register a child and prevent duplicate biometrics", async function () {
      const childId = "SM-KE-2026-001";
      const bioHash = ethers.keccak256(ethers.toUtf8Bytes("biometric_data_1"));
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("ipfs_cid_1"));

      await registry.registerChild(childId, bioHash, dataHash);
      
      const record = await registry.getChildRecord(childId);
      expect(record.childId).to.equal(childId);
      expect(record.biometricHash).to.equal(bioHash);
      expect(await registry.isBiometricRegistered(bioHash)).to.be.true;

      // Attempt to register same biometric again
      await expect(
        registry.registerChild("SM-KE-2026-002", bioHash, dataHash)
      ).to.be.revertedWith("StreetRegistry: Biometric data already registered");
    });
  });

  describe("InterventionTracker", function () {
    it("Should record intervention only for registered children", async function () {
      const childId = "SM-KE-2026-001";
      const bioHash = ethers.keccak256(ethers.toUtf8Bytes("biometric_data_1"));
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes("ipfs_cid_1"));

      // Try recording intervention before registration
      await expect(
        tracker.addIntervention(childId, "Medical", "Red Cross", dataHash)
      ).to.be.revertedWith("InterventionTracker: Child not registered in system");

      // Register child
      await registry.registerChild(childId, bioHash, dataHash);

      // Now record intervention
      await tracker.addIntervention(childId, "Medical", "Red Cross", dataHash);
      
      const interventions = await tracker.getChildInterventions(childId);
      expect(interventions.length).to.equal(1);
      expect(interventions[0].interventionType).to.equal("Medical");
    });
  });

  describe("ChildIdentityToken", function () {
    it("Should mint non-transferable identity tokens", async function () {
      const childId = "SM-KE-2026-001";
      
      await identityToken.mintIdentityToken(addr1.address, childId);
      
      expect(await identityToken.ownerOf(1)).to.equal(addr1.address);
      expect(await identityToken.getChildIdByToken(1)).to.equal(childId);

      // Attempt transfer (should fail)
      await expect(
        identityToken.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.revertedWith("ChildIdentityToken: Transfers are disabled for identity tokens");
    });
  });

  describe("AccessControlManager", function () {
    it("Should manage roles correctly", async function () {
      const SOCIAL_WORKER_ROLE = await accessControl.SOCIAL_WORKER_ROLE();
      
      await accessControl.addSocialWorker(addr1.address);
      expect(await accessControl.hasRole(SOCIAL_WORKER_ROLE, addr1.address)).to.be.true;

      await accessControl.revokeRoleFromAccount(SOCIAL_WORKER_ROLE, addr1.address);
      expect(await accessControl.hasRole(SOCIAL_WORKER_ROLE, addr1.address)).to.be.false;
    });
  });

  describe("AidDistributionLedger", function () {
    it("Should record aid distribution and history", async function () {
      const childId = "SM-KE-2026-001";
      const aidType = 0; // FOOD enum
      
      await aidLedger.recordAidDistribution(childId, aidType, "UNICEF", "10kg Rice");
      
      const history = await aidLedger.getAidHistory(childId);
      expect(history.length).to.equal(1);
      expect(history[0].organization).to.equal("UNICEF");
      expect(history[0].quantity).to.equal("10kg Rice");
    });
  });

  describe("DeviceRegistry", function () {
    it("Should register and remove devices", async function () {
      await deviceRegistry.registerDevice(addr1.address);
      expect(await deviceRegistry.isAuthorizedDevice(addr1.address)).to.be.true;

      await deviceRegistry.removeDevice(addr1.address);
      expect(await deviceRegistry.isAuthorizedDevice(addr1.address)).to.be.false;
    });
  });
});
