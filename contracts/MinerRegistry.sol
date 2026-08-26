// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MinerRegistry
 * @dev Whitelist and authorization manager for licensed gold mining entities in the GoldChain ecosystem.
 *      Maintains immutable records of authorized mining companies, government concession licenses,
 *      and operational compliance states to prevent illicit and uncertified artisanal gold ("Galamsey") entry.
 * @author GoldChain Protocol Team
 */
contract MinerRegistry {
    // =========================================================================
    // Custom Errors
    // =========================================================================
    error OnlyOwner();
    error ZeroAddressNotAllowed();
    error MinerAlreadyAuthorized(address miner);
    error MinerNotAuthorized(address miner);
    error EmptyCompanyName();
    error EmptyLicenseNumber();

    // =========================================================================
    // State Variables
    // =========================================================================
    address public owner;

    struct MinerProfile {
        bool isAuthorized;
        string companyName;
        string licenseNumber;
        string region;
        uint256 registeredAt;
        uint256 totalBatchesMinted;
    }

    /// @dev Mapping of wallet address => miner authorization details
    mapping(address => MinerProfile) private _miners;

    /// @dev Array of all registered miner addresses for enumeration
    address[] private _minerAddresses;

    // =========================================================================
    // Events
    // =========================================================================
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event MinerAdded(
        address indexed miner,
        string companyName,
        string licenseNumber,
        string region,
        uint256 timestamp
    );
    event MinerRemoved(address indexed miner, string companyName, uint256 timestamp);
    event BatchMintCountIncremented(address indexed miner, uint256 newTotal);

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
     * @dev Sets the contract deployer as initial owner.
     */
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // =========================================================================
    // Core Functions
    // =========================================================================

    /**
     * @notice Authorizes a new licensed miner address into the GoldChain whitelist.
     * @dev Only the contract owner (Mining Commission / Minerals Regulatory Body) can invoke this.
     * @param miner The Ethereum address representing the certified miner's signing wallet.
     * @param companyName Legal entity name of the mining corporation.
     * @param licenseNumber EPA / Minerals Commission concession license identifier.
     * @param region Primary mining district (e.g. Obuasi, Tarkwa, Ahafo, Prestea).
     */
    function addMiner(
        address miner,
        string calldata companyName,
        string calldata licenseNumber,
        string calldata region
    ) external onlyOwner {
        if (miner == address(0)) revert ZeroAddressNotAllowed();
        if (bytes(companyName).length == 0) revert EmptyCompanyName();
        if (bytes(licenseNumber).length == 0) revert EmptyLicenseNumber();
        if (_miners[miner].isAuthorized) revert MinerAlreadyAuthorized(miner);

        if (_miners[miner].registeredAt == 0) {
            _minerAddresses.push(miner);
        }

        _miners[miner] = MinerProfile({
            isAuthorized: true,
            companyName: companyName,
            licenseNumber: licenseNumber,
            region: region,
            registeredAt: block.timestamp,
            totalBatchesMinted: _miners[miner].totalBatchesMinted
        });

        emit MinerAdded(miner, companyName, licenseNumber, region, block.timestamp);
    }

    /**
     * @notice Revokes the authorization of a miner address.
     * @param miner The address to revoke.
     */
    function removeMiner(address miner) external onlyOwner {
        if (!_miners[miner].isAuthorized) revert MinerNotAuthorized(miner);

        _miners[miner].isAuthorized = false;
        emit MinerRemoved(miner, _miners[miner].companyName, block.timestamp);
    }

    /**
     * @notice Increments the internal minted count for a miner upon valid batch registration.
     * @dev Called by authorized GoldBatch contract.
     * @param miner The miner address whose batch count is updated.
     */
    function incrementBatchCount(address miner) external {
        if (_miners[miner].isAuthorized) {
            _miners[miner].totalBatchesMinted += 1;
            emit BatchMintCountIncremented(miner, _miners[miner].totalBatchesMinted);
        }
    }

    /**
     * @notice Checks if an address is an active authorized miner.
     * @param miner Address to query.
     * @return bool True if authorized, false otherwise.
     */
    function isAuthorizedMiner(address miner) external view returns (bool) {
        return _miners[miner].isAuthorized;
    }

    /**
     * @notice Returns full details for a miner address.
     * @param miner Address to query.
     */
    function getMinerDetails(address miner)
        external
        view
        returns (
            bool isAuthorized,
            string memory companyName,
            string memory licenseNumber,
            string memory region,
            uint256 registeredAt,
            uint256 totalBatchesMinted
        )
    {
        MinerProfile memory p = _miners[miner];
        return (
            p.isAuthorized,
            p.companyName,
            p.licenseNumber,
            p.region,
            p.registeredAt,
            p.totalBatchesMinted
        );
    }

    /**
     * @notice Returns total number of registered (historical + active) miners.
     */
    function getTotalRegisteredMiners() external view returns (uint256) {
        return _minerAddresses.length;
    }

    /**
     * @notice Returns miner address at index.
     */
    function getMinerAddressByIndex(uint256 index) external view returns (address) {
        require(index < _minerAddresses.length, "Index out of bounds");
        return _minerAddresses[index];
    }

    /**
     * @notice Transfers ownership to a new regulatory authority address.
     * @param newOwner Address of new owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddressNotAllowed();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
