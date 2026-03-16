const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy AccessControlManager
  console.log("Deploying AccessControlManager...");
  const AccessControlManager = await hre.ethers.getContractFactory("AccessControlManager");
  const accessControl = await AccessControlManager.deploy(deployer.address);
  await accessControl.waitForDeployment();
  console.log("AccessControlManager deployed to:", await accessControl.getAddress());

  // 2. Deploy StreetMobilizationRegistry
  console.log("Deploying StreetMobilizationRegistry...");
  const StreetMobilizationRegistry = await hre.ethers.getContractFactory("StreetMobilizationRegistry");
  const registry = await StreetMobilizationRegistry.deploy();
  await registry.waitForDeployment();
  console.log("StreetMobilizationRegistry deployed to:", await registry.getAddress());

  // 3. Deploy InterventionTracker
  console.log("Deploying InterventionTracker...");
  const InterventionTracker = await hre.ethers.getContractFactory("InterventionTracker");
  const tracker = await InterventionTracker.deploy(await registry.getAddress());
  await tracker.waitForDeployment();
  console.log("InterventionTracker deployed to:", await tracker.getAddress());

  // 4. Deploy AidDistributionLedger
  console.log("Deploying AidDistributionLedger...");
  const AidDistributionLedger = await hre.ethers.getContractFactory("AidDistributionLedger");
  const aidLedger = await AidDistributionLedger.deploy();
  await aidLedger.waitForDeployment();
  console.log("AidDistributionLedger deployed to:", await aidLedger.getAddress());

  // 5. Deploy ChildIdentityToken
  console.log("Deploying ChildIdentityToken...");
  const ChildIdentityToken = await hre.ethers.getContractFactory("ChildIdentityToken");
  const identityToken = await ChildIdentityToken.deploy(deployer.address);
  await identityToken.waitForDeployment();
  console.log("ChildIdentityToken deployed to:", await identityToken.getAddress());

  // 6. Deploy DeviceRegistry
  console.log("Deploying DeviceRegistry...");
  const DeviceRegistry = await hre.ethers.getContractFactory("DeviceRegistry");
  const deviceRegistry = await DeviceRegistry.deploy();
  await deviceRegistry.waitForDeployment();
  console.log("DeviceRegistry deployed to:", await deviceRegistry.getAddress());

  console.log("\n--- Deployment Summary ---");
  console.log("All contracts deployed successfully to the local network.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
