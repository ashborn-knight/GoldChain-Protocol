// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./GoldBatch.sol";
import "./MinerRegistry.sol";

/**
 * @title VerificationSystem
 * @dev Public audit and provenance verification portal for the GoldChain ecosystem.
 *      Enables refineries, jewelry houses, bullion vaults, central banks, and consumers
 *      to verify the authentic origin, weight, environmental credentials, and ownership
 *      chain of any registered gold batch on Ethereum Sepolia.
 * @author GoldChain Protocol Team
 */
contract VerificationSystem {
    // =========================================================================
    // Custom Errors
    // =========================================================================
    error ZeroAddressNotAllowed();
    error InvalidTokenId(uint256 tokenId);

    // =========================================================================
    // State Variables
    // =========================================================================
    GoldBatch public immutable goldBatch;
    MinerRegistry public immutable minerRegistry;

    struct VerificationResult {
        uint256 tokenId;
        bool isValid;
        address currentOwner;
        address originatingMiner;
        string companyName;
        string licenseNumber;
        string location;
        uint256 weightGrams;
        uint256 purityPermille;
        uint256 extractionDate;
        uint256 registrationTimestamp;
        string environmentalStatus;
        bytes32 batchFingerprint;
        string ipfsAssayReport;
        bool isMinerCurrentlyAuthorized;
        bool isFingerprintIntact;
    }

    // =========================================================================
    // Events
    // =========================================================================
    event BatchVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        bool isValid,
        uint256 timestamp
    );

    // =========================================================================
    // Constructor
    // =========================================================================
    constructor(address _goldBatchAddress, address _minerRegistryAddress) {
        if (_goldBatchAddress == address(0) || _minerRegistryAddress == address(0)) {
            revert ZeroAddressNotAllowed();
        }
        goldBatch = GoldBatch(_goldBatchAddress);
        minerRegistry = MinerRegistry(_minerRegistryAddress);
    }

    // =========================================================================
    // Verification Queries
    // =========================================================================

    /**
     * @notice Performs a comprehensive integrity audit on a gold batch NFT.
     * @param tokenId The batch NFT token identifier.
     * @return result Full structured verification analysis.
     */
    function verifyBatch(uint256 tokenId)
        external
        view
        returns (VerificationResult memory result)
    {
        // 1. Fetch batch metadata from GoldBatch contract
        GoldBatch.BatchMetadata memory batch = goldBatch.getBatchDetails(tokenId);
        address currentOwner = goldBatch.ownerOf(tokenId);

        // 2. Check if originating miner is currently in good standing
        bool minerAuthorized = minerRegistry.isAuthorizedMiner(batch.minerAddress);

        // 3. Recalculate and verify cryptographic batch fingerprint
        bytes32 recomputedHash = goldBatch.computeFingerprint(
            batch.location,
            batch.extractionDate,
            batch.minerAddress
        );
        bool fingerprintIntact = (recomputedHash == batch.batchFingerprint);

        // 4. Batch is valid if owned, has positive weight, and fingerprint matches
        bool valid = (currentOwner != address(0) && batch.weightGrams > 0 && fingerprintIntact);

        result = VerificationResult({
            tokenId: tokenId,
            isValid: valid,
            currentOwner: currentOwner,
            originatingMiner: batch.minerAddress,
            companyName: batch.companyName,
            licenseNumber: batch.licenseNumber,
            location: batch.location,
            weightGrams: batch.weightGrams,
            purityPermille: batch.purityPermille,
            extractionDate: batch.extractionDate,
            registrationTimestamp: batch.registrationTimestamp,
            environmentalStatus: batch.environmentalStatus,
            batchFingerprint: batch.batchFingerprint,
            ipfsAssayReport: batch.ipfsAssayReport,
            isMinerCurrentlyAuthorized: minerAuthorized,
            isFingerprintIntact: fingerprintIntact
        });

        return result;
    }

    /**
     * @notice Quick boolean check whether a token ID exists and holds valid cryptographic integrity.
     * @param tokenId The batch identifier.
     * @return bool True if valid, false otherwise.
     */
    function isValid(uint256 tokenId) external view returns (bool) {
        try goldBatch.getBatchDetails(tokenId) returns (GoldBatch.BatchMetadata memory batch) {
            bytes32 recomputedHash = goldBatch.computeFingerprint(
                batch.location,
                batch.extractionDate,
                batch.minerAddress
            );
            return (batch.weightGrams > 0 && recomputedHash == batch.batchFingerprint);
        } catch {
            return false;
        }
    }

    /**
     * @notice Emits audit event when an entity formally verifies a batch on-chain.
     * @param tokenId The batch identifier.
     */
    function recordOnChainVerification(uint256 tokenId) external returns (bool) {
        bool valid = this.isValid(tokenId);
        emit BatchVerified(tokenId, msg.sender, valid, block.timestamp);
        return valid;
    }
}
