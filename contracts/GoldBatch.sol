// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MinerRegistry.sol";

/**
 * @title GoldBatch (ERC-721)
 * @dev Unique Non-Fungible Token representing an auditable, certified gold batch from extraction to vault.
 *      Enforces whitelisted miner minting, cryptographic duplicate detection to prevent double-counting,
 *      and provides on-chain immutable provenance metadata for refinery and consumer verification.
 * @author GoldChain Protocol Team
 */
contract GoldBatch {
    // =========================================================================
    // Custom Errors
    // =========================================================================
    error OnlyOwner();
    error ZeroAddressNotAllowed();
    error UnauthorizedMiner(address caller);
    error InvalidWeight();
    error EmptyLocation();
    error EmptyCompanyName();
    error InvalidExtractionDate();
    error DuplicateBatchDetected(bytes32 fingerprint);
    error BatchNotFound(uint256 tokenId);
    error NotTokenOwnerOrApproved();
    error TransferToZeroAddress();

    // =========================================================================
    // ERC-721 Interface & State
    // =========================================================================
    string public constant name = "GoldChain Certified Batch NFT";
    string public constant symbol = "GLDBATCH";

    address public owner;
    MinerRegistry public immutable minerRegistry;
    uint256 private _nextTokenId;

    struct BatchMetadata {
        uint256 tokenId;
        string location;              // e.g. "Obuasi Concession, Block 4, Ashanti Region, Ghana (6.20°N, 1.68°W)"
        uint256 weightGrams;           // Gold weight in grams (e.g. 50,000 = 50kg)
        uint256 purityPermille;        // e.g. 999 for 99.9% (24K), 916 for 22K
        uint256 extractionDate;        // Timestamp of excavation / assay
        string companyName;            // Entity name of the miner
        string licenseNumber;          // EPA / Mining Concession Permit ID
        string environmentalStatus;    // e.g. "EPA Ghana Certified - Mercury-Free Gravity Separation - Reforestation Escrow Active"
        address minerAddress;          // Originating miner wallet address
        uint256 registrationTimestamp; // Timestamp of on-chain minting
        bytes32 batchFingerprint;      // Cryptographic hash for collision prevention
        string ipfsAssayReport;        // IPFS CID of laboratory spectrographic assay certificate
    }

    /// @dev Mapping tokenId => BatchMetadata
    mapping(uint256 => BatchMetadata) private _batches;

    /// @dev Mapping cryptographic batchFingerprint => bool (True if already registered)
    mapping(bytes32 => bool) private _registeredFingerprints;

    /// @dev Mapping tokenId => token owner address
    mapping(uint256 => address) private _owners;

    /// @dev Mapping owner address => token count
    mapping(address => uint256) private _balances;

    /// @dev Mapping tokenId => approved address
    mapping(uint256 => address) private _tokenApprovals;

    /// @dev Mapping owner => operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    /// @dev Array of all active tokenIds for on-chain enumeration
    uint256[] private _allTokens;

    // =========================================================================
    // Events
    // =========================================================================
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    event BatchRegistered(
        uint256 indexed tokenId,
        address indexed miner,
        string companyName,
        uint256 weightGrams,
        string location,
        bytes32 indexed batchFingerprint,
        uint256 timestamp
    );

    event DuplicateDetected(
        bytes32 indexed batchFingerprint,
        address indexed miner,
        uint256 timestamp
    );

    event EnvironmentalStatusUpdated(
        uint256 indexed tokenId,
        string newStatus,
        uint256 timestamp
    );

    // =========================================================================
    // Modifiers
    // =========================================================================
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    // =========================================================================
    // Constructor
    // =========================================================================
    /**
     * @param _minerRegistryAddress Address of the deployed MinerRegistry contract.
     */
    constructor(address _minerRegistryAddress) {
        if (_minerRegistryAddress == address(0)) revert ZeroAddressNotAllowed();
        owner = msg.sender;
        minerRegistry = MinerRegistry(_minerRegistryAddress);
        _nextTokenId = 1001; // Start token IDs at 1001 for clean enterprise display
    }

    // =========================================================================
    // Minting & Registration
    // =========================================================================

    /**
     * @notice Computes deterministic fingerprint from physical batch properties to prevent double-counting.
     * @param location Geological/concession site descriptor.
     * @param extractionDate Timestamp of extraction.
     * @param miner Address of miner.
     */
    function computeFingerprint(
        string memory location,
        uint256 extractionDate,
        address miner
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(location, extractionDate, miner));
    }

    /**
     * @notice Mints a new GoldBatch NFT. Callable strictly by whitelisted miners.
     * @param location Concession location & GPS coordinates.
     * @param weightGrams Gross gold weight in grams (> 0).
     * @param purityPermille Purity level (e.g. 999 for 99.9%, 916 for 22K).
     * @param extractionDate Timestamp of batch extraction.
     * @param companyName Legal mining company name.
     * @param licenseNumber Mining license / concession identifier.
     * @param environmentalStatus Certified environmental compliance description.
     * @param ipfsAssayReport IPFS hash of third-party assay certificate.
     * @return tokenId The newly minted NFT token ID.
     */
    function mintBatch(
        string calldata location,
        uint256 weightGrams,
        uint256 purityPermille,
        uint256 extractionDate,
        string calldata companyName,
        string calldata licenseNumber,
        string calldata environmentalStatus,
        string calldata ipfsAssayReport
    ) external returns (uint256) {
        // 1. Authorization check via MinerRegistry
        if (!minerRegistry.isAuthorizedMiner(msg.sender)) {
            revert UnauthorizedMiner(msg.sender);
        }

        // 2. Input validation
        if (weightGrams == 0) revert InvalidWeight();
        if (bytes(location).length == 0) revert EmptyLocation();
        if (bytes(companyName).length == 0) revert EmptyCompanyName();
        if (extractionDate == 0 || extractionDate > block.timestamp + 1 days) {
            revert InvalidExtractionDate();
        }

        // 3. Duplicate detection fingerprint
        bytes32 fingerprint = computeFingerprint(location, extractionDate, msg.sender);
        if (_registeredFingerprints[fingerprint]) {
            emit DuplicateDetected(fingerprint, msg.sender, block.timestamp);
            revert DuplicateBatchDetected(fingerprint);
        }

        // 4. Mark fingerprint as registered
        _registeredFingerprints[fingerprint] = true;

        // 5. Mint token ID
        uint256 tokenId = _nextTokenId++;
        _owners[tokenId] = msg.sender;
        _balances[msg.sender] += 1;
        _allTokens.push(tokenId);

        // 6. Record metadata
        _batches[tokenId] = BatchMetadata({
            tokenId: tokenId,
            location: location,
            weightGrams: weightGrams,
            purityPermille: purityPermille > 0 ? purityPermille : 999,
            extractionDate: extractionDate,
            companyName: companyName,
            licenseNumber: licenseNumber,
            environmentalStatus: environmentalStatus,
            minerAddress: msg.sender,
            registrationTimestamp: block.timestamp,
            batchFingerprint: fingerprint,
            ipfsAssayReport: ipfsAssayReport
        });

        // 7. Update miner stats
        minerRegistry.incrementBatchCount(msg.sender);

        emit Transfer(address(0), msg.sender, tokenId);
        emit BatchRegistered(
            tokenId,
            msg.sender,
            companyName,
            weightGrams,
            location,
            fingerprint,
            block.timestamp
        );

        return tokenId;
    }

    // =========================================================================
    // View Functions
    // =========================================================================

    /**
     * @notice Returns full immutable metadata for a specified gold batch token ID.
     * @param tokenId The NFT identifier.
     */
    function getBatchDetails(uint256 tokenId)
        external
        view
        returns (BatchMetadata memory)
    {
        if (_owners[tokenId] == address(0)) revert BatchNotFound(tokenId);
        return _batches[tokenId];
    }

    /**
     * @notice Checks if a batch fingerprint has already been registered.
     */
    function isFingerprintRegistered(bytes32 fingerprint) external view returns (bool) {
        return _registeredFingerprints[fingerprint];
    }

    /**
     * @notice Total number of gold batch NFTs minted.
     */
    function totalSupply() external view returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @notice Returns all active token IDs in the system.
     */
    function getAllTokenIds() external view returns (uint256[] memory) {
        return _allTokens;
    }

    /**
     * @notice Returns batch ID by index for enumeration.
     */
    function tokenByIndex(uint256 index) external view returns (uint256) {
        require(index < _allTokens.length, "Index out of bounds");
        return _allTokens[index];
    }

    // =========================================================================
    // Standard ERC-721 Logic
    // =========================================================================
    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "Zero address query");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        if (tokenOwner == address(0)) revert BatchNotFound(tokenId);
        return tokenOwner;
    }

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner || isApprovedForAll(tokenOwner, msg.sender), "Not authorized");
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        if (_owners[tokenId] == address(0)) revert BatchNotFound(tokenId);
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(operator != msg.sender, "Approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address tokenOwner, address operator) public view returns (bool) {
        return _operatorApprovals[tokenOwner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        if (to == address(0)) revert TransferToZeroAddress();
        address tokenOwner = ownerOf(tokenId);
        if (from != tokenOwner) revert NotTokenOwnerOrApproved();

        bool isAllowed = (msg.sender == tokenOwner ||
            _tokenApprovals[tokenId] == msg.sender ||
            isApprovedForAll(tokenOwner, msg.sender));

        if (!isAllowed) revert NotTokenOwnerOrApproved();

        // Clear approval
        delete _tokenApprovals[tokenId];

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @notice Regulatory authority can update compliance audit status (e.g., periodic lab re-test).
     */
    function updateEnvironmentalAudit(uint256 tokenId, string calldata newStatus) external onlyOwner {
        if (_owners[tokenId] == address(0)) revert BatchNotFound(tokenId);
        _batches[tokenId].environmentalStatus = newStatus;
        emit EnvironmentalStatusUpdated(tokenId, newStatus, block.timestamp);
    }
}
