// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChildIdentityToken
 * @dev A non-transferable (Soulbound) ERC721 token representing a permanent digital identity for street children.
 * Tokens are linked to a unique childId and cannot be traded, sold, or moved once issued.
 */
contract ChildIdentityToken is ERC721, Ownable {
    
    // --- State Variables ---

    uint256 private _nextTokenId;
    
    // Mapping from childId (system ID) to the issued tokenId
    mapping(string => uint256) private _childIdToTokenId;
    
    // Mapping from tokenId to the system childId
    mapping(uint256 => string) private _tokenIdToChildId;

    // --- Events ---

    event IdentityTokenIssued(address indexed to, uint256 indexed tokenId, string childId);

    // --- Constructor ---

    constructor(address initialOwner) ERC721("Street Mobilizer Identity", "SMID") Ownable(initialOwner) {
        _nextTokenId = 1; // Start IDs at 1
    }

    // --- Core Functions ---

    /**
     * @notice Mints a permanent identity token for a registered child.
     * @dev Only the contract owner (ADMIN) can issue identity tokens.
     * @param to The address that will hold the identity (e.g., a secure hardware device or child's digital wallet).
     * @param childId The unique system identifier for the child (e.g., SM-KE-2026-001).
     * @return tokenId The unique ID of the minted token.
     */
    function mintIdentityToken(address to, string calldata childId) external onlyOwner returns (uint256) {
        require(bytes(childId).length > 0, "ChildIdentityToken: childId cannot be empty");
        require(_childIdToTokenId[childId] == 0, "ChildIdentityToken: Identity already issued for this childId");

        uint256 tokenId = _nextTokenId++;
        
        _childIdToTokenId[childId] = tokenId;
        _tokenIdToChildId[tokenId] = childId;

        _safeMint(to, tokenId);

        emit IdentityTokenIssued(to, tokenId, childId);
        
        return tokenId;
    }

    /**
     * @notice Retrieves the tokenId associated with a specific childId.
     * @param childId The unique system ID.
     * @return The tokenId of the identity token.
     */
    function getChildToken(string calldata childId) external view returns (uint256) {
        uint256 tokenId = _childIdToTokenId[childId];
        require(tokenId != 0, "ChildIdentityToken: No token found for this childId");
        return tokenId;
    }

    /**
     * @notice Retrieves the childId associated with a specific tokenId.
     * @param tokenId The unique ERC721 token ID.
     * @return The system childId.
     */
    function getChildIdByToken(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ChildIdentityToken: Token does not exist");
        return _tokenIdToChildId[tokenId];
    }

    // --- Transfer Overrides (Non-Transferability Logic) ---

    /**
     * @dev Overriding the internal _update function to disable transfers.
     * In OpenZeppelin 5.0+, _update handles minting, burning, and transfers.
     * 
     * RATIONALE FOR NON-TRANSFERABILITY:
     * An identity token represents a unique human being. If these tokens were transferable, 
     * they could be stolen, sold, or manipulated, facilitating child trafficking or identity theft. 
     * Making the token "Soulbound" ensures that the digital identity remains permanently 
     * attached to the authorized recipient.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from is address(0))
        // Disallow all other transfers (from is NOT address(0))
        if (from != address(0)) {
            revert("ChildIdentityToken: Transfers are disabled for identity tokens");
        }

        return super._update(to, tokenId, auth);
    }
}
