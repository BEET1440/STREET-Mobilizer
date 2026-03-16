// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AidDistributionLedger
 * @dev A production-ready smart contract to track aid distribution to street children.
 * Ensures transparency and accountability in humanitarian assistance (Food, Medical, etc.).
 */
contract AidDistributionLedger {

    // --- Data Structures ---

    enum AidType { FOOD, MEDICAL, CLOTHING, EDUCATION }

    struct AidRecord {
        string childId;       // Unique identifier for the child (SM-ID)
        AidType aidType;      // Category of aid (FOOD, MEDICAL, etc.)
        string organization;  // NGO or agency distributing aid
        string quantity;      // Amount or quantity (e.g., "5kg", "1 kit")
        uint256 timestamp;    // Block timestamp of distribution
    }

    // --- State Variables ---

    address public owner;
    
    // Mapping from childId to their history of aid distributions
    mapping(string => AidRecord[]) private aidHistory;

    // Authorized organizations allowed to record aid
    mapping(address => bool) public isAuthorizedOrg;

    // --- Events ---

    event AidDistributed(
        string indexed childId, 
        AidType aidType, 
        string organization, 
        string quantity, 
        uint256 timestamp
    );
    event OrgAuthorized(address indexed org);
    event OrgDeauthorized(address indexed org);

    // --- Modifiers ---

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(isAuthorizedOrg[msg.sender] || msg.sender == owner, "Not authorized to record aid");
        _;
    }

    // --- Constructor ---

    constructor() {
        owner = msg.sender;
        isAuthorizedOrg[msg.sender] = true; // Owner is authorized by default
    }

    // --- Administrative Functions ---

    /**
     * @dev Authorize an organization to record aid distributions.
     * @param org Address of the NGO or support agency.
     */
    function authorizeOrg(address org) external onlyOwner {
        isAuthorizedOrg[org] = true;
        emit OrgAuthorized(org);
    }

    /**
     * @dev Deauthorize an organization.
     * @param org Address to be removed.
     */
    function deauthorizeOrg(address org) external onlyOwner {
        isAuthorizedOrg[org] = false;
        emit OrgDeauthorized(org);
    }

    // --- Core Functions ---

    /**
     * @notice Records a new aid distribution for a specific child.
     * @param _childId Unique identifier for the child (SM-ID).
     * @param _aidType Category of the aid distributed.
     * @param _organization Name of the entity providing the aid.
     * @param _quantity Amount or description of the aid.
     */
    function recordAidDistribution(
        string calldata _childId,
        AidType _aidType,
        string calldata _organization,
        string calldata _quantity
    ) external onlyAuthorized {
        require(bytes(_childId).length > 0, "Child ID cannot be empty");
        require(bytes(_organization).length > 0, "Organization name required");
        require(bytes(_quantity).length > 0, "Quantity required");

        AidRecord memory newRecord = AidRecord({
            childId: _childId,
            aidType: _aidType,
            organization: _organization,
            quantity: _quantity,
            timestamp: block.timestamp
        });

        aidHistory[_childId].push(newRecord);

        emit AidDistributed(
            _childId, 
            _aidType, 
            _organization, 
            _quantity, 
            block.timestamp
        );
    }

    /**
     * @notice Retrieves the full aid distribution history for a specific child.
     * @param _childId The unique ID of the child.
     * @return An array of AidRecord structs.
     */
    function getAidHistory(string calldata _childId) 
        external 
        view 
        returns (AidRecord[] memory) 
    {
        return aidHistory[_childId];
    }

    /**
     * @notice Returns the total number of aid distributions for a specific child.
     * @param _childId The unique ID of the child.
     */
    function getAidDistributionCount(string calldata _childId) 
        external 
        view 
        returns (uint256) 
    {
        return aidHistory[_childId].length;
    }
}
