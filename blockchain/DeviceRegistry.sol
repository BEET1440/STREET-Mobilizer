// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DeviceRegistry
 * @dev Ensures only approved biometric devices (scanners, secure tablets) can interact with the Street Mobilization system.
 * This contract provides a hardware-level security layer to prevent unauthorized data entry.
 */
contract DeviceRegistry {

    // --- State Variables ---

    address public admin;
    
    // Mapping of approved biometric device addresses
    mapping(address => bool) private approvedDevices;

    // --- Events ---

    event DeviceRegistered(address indexed deviceAddress, address indexed authorizedBy);
    event DeviceRemoved(address indexed deviceAddress, address indexed removedBy);

    // --- Modifiers ---

    /**
     * @dev Throws if called by any account other than the admin.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "DeviceRegistry: Only ADMIN can perform this action");
        _;
    }

    // --- Constructor ---

    constructor() {
        admin = msg.sender;
    }

    // --- Core Functions ---

    /**
     * @notice Registers a new biometric device as approved.
     * @param _deviceAddress The blockchain address assigned to the hardware device.
     */
    function registerDevice(address _deviceAddress) external onlyAdmin {
        require(_deviceAddress != address(0), "DeviceRegistry: Invalid device address");
        require(!approvedDevices[_deviceAddress], "DeviceRegistry: Device already approved");

        approvedDevices[_deviceAddress] = true;
        
        emit DeviceRegistered(_deviceAddress, msg.sender);
    }

    /**
     * @notice Removes a device from the approved list.
     * @param _deviceAddress The address of the device to be deauthorized.
     */
    function removeDevice(address _deviceAddress) external onlyAdmin {
        require(approvedDevices[_deviceAddress], "DeviceRegistry: Device not currently approved");

        approvedDevices[_deviceAddress] = false;
        
        emit DeviceRemoved(_deviceAddress, msg.sender);
    }

    /**
     * @notice Checks if a specific device address is authorized.
     * @param _deviceAddress The address to check.
     * @return true if the device is approved, false otherwise.
     */
    function isAuthorizedDevice(address _deviceAddress) external view returns (bool) {
        return approvedDevices[_deviceAddress];
    }

    /**
     * @notice Allows the current admin to transfer administrative rights.
     * @param _newAdmin The address of the new administrator.
     */
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "DeviceRegistry: New admin cannot be zero address");
        admin = _newAdmin;
    }
}
