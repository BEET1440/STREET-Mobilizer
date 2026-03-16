// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InterventionTracker
 * @dev A production-ready smart contract to track and manage interventions performed on registered street children.
 * This contract provides an immutable log of support activities (Medical, Shelter, Food, etc.) for cross-organization coordination.
 */
contract InterventionTracker {

    // --- Data Structures ---

    struct Intervention {
        string childId;             // Unique identifier of the child (matches SM-ID)
        string interventionType;    // Type of intervention (e.g., "Medical", "Shelter", "Food")
        string organization;        // Name of the NGO or agency performing the intervention
        bytes32 metadataHash;       // Hash referencing off-chain documentation (IPFS/Database)
        uint256 timestamp;          // Block timestamp of the recording
    }

    // --- State Variables ---

    address public owner;
    
    // Mapping from childId to an array of their interventions
    mapping(string => Intervention[]) private childInterventions;

    // Authorized organizations allowed to record interventions
    mapping(address => bool) public isAuthorizedOrg;

    // --- Events ---

    event InterventionRecorded(
        string indexed childId, 
        string interventionType, 
        string organization, 
        bytes32 metadataHash, 
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
        require(isAuthorizedOrg[msg.sender] || msg.sender == owner, "Not authorized to record interventions");
        _;
    }

    // --- Constructor ---

    constructor() {
        owner = msg.sender;
        isAuthorizedOrg[msg.sender] = true; // Owner is authorized by default
    }

    // --- Administrative Functions ---

    /**
     * @dev Authorize an organization to record interventions.
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
     * @notice Records a new intervention for a specific child.
     * @dev Stores the intervention in a persistent array linked to the child's ID.
     * @param _childId Unique identifier for the child (SM-ID).
     * @param _interventionType The category of support provided.
     * @param _organization Name of the entity providing support.
     * @param _metadataHash Hash referencing detailed off-chain records.
     */
    function addIntervention(
        string calldata _childId,
        string calldata _interventionType,
        string calldata _organization,
        bytes32 _metadataHash
    ) external onlyAuthorized {
        require(bytes(_childId).length > 0, "Child ID cannot be empty");
        require(bytes(_interventionType).length > 0, "Intervention type required");
        require(bytes(_organization).length > 0, "Organization name required");
        require(_metadataHash != bytes32(0), "Metadata hash required");

        Intervention memory newIntervention = Intervention({
            childId: _childId,
            interventionType: _interventionType,
            organization: _organization,
            metadataHash: _metadataHash,
            timestamp: block.timestamp
        });

        childInterventions[_childId].push(newIntervention);

        emit InterventionRecorded(
            _childId, 
            _interventionType, 
            _organization, 
            _metadataHash, 
            block.timestamp
        );
    }

    /**
     * @notice Retrieves all interventions recorded for a specific child.
     * @param _childId The unique ID of the child.
     * @return An array of Intervention structs containing the full history.
     */
    function getChildInterventions(string calldata _childId) 
        external 
        view 
        returns (Intervention[] memory) 
    {
        return childInterventions[_childId];
    }

    /**
     * @notice Returns the total count of interventions for a child.
     * @param _childId The unique ID of the child.
     */
    function getInterventionCount(string calldata _childId) 
        external 
        view 
        returns (uint256) 
    {
        return childInterventions[_childId].length;
    }
}
