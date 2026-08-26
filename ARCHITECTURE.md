# 🏗️ GoldChain Architecture & System Design

> **Scope Notice**: GoldChain is an educational prototype and portfolio showcase demonstrating modular smart contract design, ERC-721 tokenization, role-based authorization, and verification portals on Ethereum.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph "Actors"
        A[🏛️ Minerals Commission / Regulator]
        B[⛏️ Authorized Mining Company]
        C[🔍 Refinery / Bullion Buyer / Public]
    end

    subgraph "Smart Contract Layer (Ethereum Sepolia)"
        MR[MinerRegistry.sol<br/>• Owner: Regulator<br/>• Whitelist of Licensed Miners<br/>• EPA Permit Identifiers]
        GB[GoldBatch.sol (ERC-721)<br/>• ERC-721 Token Minting<br/>• Collision Detection: keccak256<br/>• Batch Storage & Transfer]
        VS[VerificationSystem.sol<br/>• Read-only Public Gateway<br/>• Hash Integrity Checking<br/>• Composite Status Aggregator]
    end

    subgraph "Application Client Layer (React 19 + ethers.js)"
        FE_REG[Register Batch Page<br/>• MetaMask Signing<br/>• Whitelist Validation<br/>• QR Code Generation]
        FE_VER[Verify Batch Page<br/>• Instant Audit Display<br/>• QR Scanner / Direct URL<br/>• Certificate Print Engine]
        FE_DASH[Protocol Dashboard<br/>• Real-time Statistics<br/>• Environmental Metrics]
    end

    %% Actor to Contracts
    A -->|1. addMiner / removeMiner| MR
    B -->|2. mintBatch| GB
    C -->|3. verifyBatch / isValid| VS

    %% Inter-contract Calls
    GB -->|Check isAuthorizedMiner| MR
    VS -->|Read getBatchDetails / ownerOf| GB
    VS -->|Check isAuthorizedMiner| MR

    %% Frontend to Contract
    FE_REG -.->|Web3 Write Transaction| GB
    FE_VER -.->|Web3 Read-only Query| VS
    FE_DASH -.->|Aggregate Read-only State| GB
```

---

## 2. Smart Contract Dependency Graph

```
┌────────────────────────────────────────────────────────┐
│                   MinerRegistry.sol                    │
│   • Whitelist mapping (address => MinerProfile)        │
│   • Admin functions: addMiner, removeMiner             │
│   • View: isAuthorizedMiner, getMinerDetails           │
└───────────────────────────▲────────────────────────────┘
                            │
              Queried by    │    Queried by
              GoldBatch     │    VerificationSystem
                            │
┌───────────────────────────┴────────────────────────────┐
│                    GoldBatch.sol                       │
│   • ERC-721 Implementation                             │
│   • keccak256 Fingerprint Collision Prevention         │
│   • Struct: BatchMetadata                              │
│   • Functions: mintBatch, transferFrom, ownerOf        │
└───────────────────────────▲────────────────────────────┘
                            │
              Queried by    │
              Verification  │
              System        │
┌───────────────────────────┴────────────────────────────┐
│                 VerificationSystem.sol                 │
│   • Aggregated query: verifyBatch(tokenId)             │
│   • Integrity check: isValid(tokenId)                  │
│   • Audit event: recordOnChainVerification(tokenId)    │
└────────────────────────────────────────────────────────┘
```

---

## 3. Data Models & Struct Specifications

### `MinerProfile` (inside `MinerRegistry.sol`)
```solidity
struct MinerProfile {
    bool isAuthorized;           // True if currently permitted to mint
    string companyName;          // Registered corporate name
    string licenseNumber;        // EPA / Minerals Commission permit ID
    string region;               // Primary mining basin / district
    uint256 registeredAt;        // Unix timestamp of initial authorization
    uint256 totalBatchesMinted;  // Cumulative batch count
}
```

### `BatchMetadata` (inside `GoldBatch.sol`)
```solidity
struct BatchMetadata {
    uint256 tokenId;              // Sequential NFT token ID (starts at 1001)
    string location;              // Geological site descriptor + GPS coordinates
    uint256 weightGrams;          // Gross gold weight in grams
    uint256 purityPermille;       // Purity in parts per thousand (e.g. 999 = 99.9%)
    uint256 extractionDate;       // Unix timestamp of extraction
    string companyName;           // Entity name of mining corporation
    string licenseNumber;         // Concession permit ID
    string environmentalStatus;   // Environmental compliance attestation
    address minerAddress;         // Originating miner wallet address
    uint256 registrationTimestamp;// Timestamp of on-chain minting
    bytes32 batchFingerprint;     // keccak256 collision hash
    string ipfsAssayReport;       // IPFS CID of laboratory assay certificate
}
```

### `VerificationResult` (inside `VerificationSystem.sol`)
```solidity
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
```

---

## 4. State Transition & Event Flow

```
1. REGISTRATION PHASE:
   Regulator ──[ addMiner(0xABC, "AngloGold", "EPA-001", "Obuasi") ]──► MinerRegistry
   Emit: MinerAdded(0xABC, "AngloGold", "EPA-001", "Obuasi", timestamp)

2. MINTING PHASE:
   Miner 0xABC ──[ mintBatch("Shaft 3", 50000, 999, timestamp, "AngloGold", ...) ]──► GoldBatch
   GoldBatch checks MinerRegistry.isAuthorizedMiner(0xABC) == true
   GoldBatch calculates fingerprint = keccak256("Shaft 3", timestamp, 0xABC)
   GoldBatch checks _registeredFingerprints[fingerprint] == false
   GoldBatch mints Token #1001 to 0xABC
   Emit: Transfer(0x0, 0xABC, 1001)
   Emit: BatchRegistered(1001, 0xABC, "AngloGold", 50000, "Shaft 3", fingerprint, timestamp)

3. COLLISION REJECTION (Security Invariant):
   Miner 0xABC (or attacker) ──[ mintBatch("Shaft 3", 50000, 999, timestamp, ...) ]──► GoldBatch
   Fingerprint collision matches!
   Emit: DuplicateDetected(fingerprint, 0xABC, timestamp)
   REVERT with DuplicateBatchDetected(fingerprint)

4. VERIFICATION PHASE:
   Refinery ──[ verifyBatch(1001) ]──► VerificationSystem
   VerificationSystem pulls batch data, re-computes fingerprint, checks miner whitelist.
   Returns: VerificationResult { isValid: true, isFingerprintIntact: true, ... }
```

---

## 5. Frontend & Web3 Architecture

- **React 19 + TypeScript**: Modular components separated by page concerns (`HomePage`, `RegisterPage`, `VerifyPage`, `DashboardPage`, `ContractsTestPage`).
- **Web3 Context**: Provides centralized MetaMask connection, simulated test account personas (Owner, Authorized Miner, Galamsey/Unauthorized Actor), and fallback RPC providers.
- **QR Code Engine**: Deterministically encodes verification URL pointers (`/verify/<tokenId>`) with zero private metadata leakage.
- **Printable Certificate Engine**: Custom CSS `@media print` styles format high-fidelity Certificate of Provenance sheets with cryptographic hashes, QR codes, and assay specs.
