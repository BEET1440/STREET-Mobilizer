// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AccessControlManager
 * @dev Implements role-based permissions for the Street Mobilization system.
 * Uses OpenZeppelin AccessControl to manage ADMIN, SOCIAL_WORKER, NGO, and GOVERNMENT roles.
 */
contract AccessControlManager is AccessControl {
    
    // --- Role Definitions ---

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SOCIAL_WORKER_ROLE = keccak256("SOCIAL_WORKER_ROLE");
    bytes32 public constant NGO_ROLE = keccak256("NGO_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");

    // --- State Variables ---

    // Tracks authorized field devices (e.g., biometric scanners, tablets)
    mapping(address => bool) public isAuthorizedDevice;

    // --- Events ---

    event DeviceAuthorized(address indexed deviceAddress, string deviceName);
    event DeviceDeauthorized(address indexed deviceAddress);
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    // --- Constructor ---

    constructor(address defaultAdmin) {
        // Grant the contract deployer the default admin role
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ADMIN_ROLE, defaultAdmin);
        
        // Set ADMIN_ROLE as the admin for all other roles
        _setRoleAdmin(SOCIAL_WORKER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(NGO_ROLE, ADMIN_ROLE);
        _setRoleAdmin(GOVERNMENT_ROLE, ADMIN_ROLE);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
    }

    // --- Admin Functions ---

    /**
     * @notice Adds a new administrator.
     * @param account Address to be granted the ADMIN_ROLE.
     */
    function addAdmin(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
        emit RoleGranted(ADMIN_ROLE, account, msg.sender);
    }

    /**
     * @notice Adds a social worker.
     * @param account Address to be granted the SOCIAL_WORKER_ROLE.
     */
    function addSocialWorker(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(SOCIAL_WORKER_ROLE, account);
        emit RoleGranted(SOCIAL_WORKER_ROLE, account, msg.sender);
    }

    /**
     * @notice Adds an NGO partner.
     * @param account Address to be granted the NGO_ROLE.
     */
    function addNGO(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(NGO_ROLE, account);
        emit RoleGranted(NGO_ROLE, account, msg.sender);
    }

    /**
     * @notice Adds a government official.
     * @param account Address to be granted the GOVERNMENT_ROLE.
     */
    function addGovernment(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(GOVERNMENT_ROLE, account);
        emit RoleGranted(GOVERNMENT_ROLE, account, msg.sender);
    }

    /**
     * @notice Revokes a role from an account.
     * @param role The bytes32 role identifier.
     * @param account The address to revoke from.
     */
    function revokeRoleFromAccount(bytes32 role, address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(role, account);
        emit RoleRevoked(role, account, msg.sender);
    }

    /**
     * @notice Registers an authorized hardware device for field work.
     * @param deviceAddress Address of the device (typically a unique hardware-bound wallet).
     * @param deviceName Human-readable name/ID of the device.
     */
    function registerAuthorizedDevice(address deviceAddress, string calldata deviceName) external onlyRole(ADMIN_ROLE) {
        require(deviceAddress != address(0), "Invalid device address");
        isAuthorizedDevice[deviceAddress] = true;
        emit DeviceAuthorized(deviceAddress, deviceName);
    }

    /**
     * @notice Deauthorizes a device.
     * @param deviceAddress Address to be removed.
     */
    function deauthorizeDevice(address deviceAddress) external onlyRole(ADMIN_ROLE) {
        isAuthorizedDevice[deviceAddress] = false;
        emit DeviceDeauthorized(deviceAddress);
    }

    // --- Internal Helpers ---

    /**
     * @dev Overriding grantRole to emit our custom event alongside default events.
     */
    function grantRole(bytes32 role, address account) public override onlyRole(getRoleAdmin(role)) {
        super.grantRole(role, account);
    }
}
