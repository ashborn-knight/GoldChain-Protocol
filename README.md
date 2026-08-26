# 🏅 GoldChain — Cryptographic Gold Provenance Protocol (MVP)

[![Network: Ethereum Sepolia](https://img.shields.io/badge/Network-Ethereum%20Sepolia%20(11155111)-627EEA?style=flat&logo=ethereum&logoColor=white)](https://sepolia.etherscan.io)
[![Solidity: ^0.8.19](https://img.shields.io/badge/Solidity-%5E0.8.19-363636?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org)
[![Framework: Hardhat](https://img.shields.io/badge/Framework-Hardhat-FFF100?style=flat&logo=hardhat&logoColor=black)](https://hardhat.org)
[![ERC: 721 Certified](https://img.shields.io/badge/Standard-ERC--721%20Gold%20NFT-gold?style=flat)](https://eips.ethereum.org/EIPS/eip-721)
[![Tests: 22 Passing](https://img.shields.io/badge/Tests-22%2F22%20Passing-success)](https://github.com)

> 🎓 **Educational & Learning Project Disclaimer**:
> This project is built as an **educational prototype and portfolio MVP** for early-stage blockchain and smart-contract developers. It demonstrates clean Solidity patterns, ERC-721 non-fungible tokenization, role-based access control, cryptographic duplicate detection, and ethers.js frontend integration. It is **not** a production-ready governmental land titling, mining licensing, or sovereign legal enforcement system.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [Features](#4-features)
5. [Architecture](#5-architecture)
6. [Smart Contracts](#6-smart-contracts)
7. [Contract Responsibilities](#7-contract-responsibilities)
8. [Access-Control Model](#8-access-control-model)
9. [Data Model](#9-data-model)
10. [User Workflow](#10-user-workflow)
11. [Technology Stack](#11-technology-stack)
12. [Local Setup](#12-local-setup)
13. [Environment Variables](#13-environment-variables)
14. [Running Tests](#14-running-tests)
15. [Deploying to Sepolia](#15-deploying-to-sepolia)
16. [Frontend Setup](#16-frontend-setup)
17. [Security Considerations](#17-security-considerations)
18. [Limitations](#18-limitations)
19. [Future Improvements](#19-future-improvements)
20. [License](#20-license)

---

## 1. Project Overview

**GoldChain** is a decentralized gold provenance and supply chain verification protocol developed on Ethereum Sepolia. The protocol assigns each physical gold extraction batch a non-fungible on-chain identity (ERC-721 NFT), allowing authorized mining entities to register verifiable batches and allowing refineries, bullion vaults, jewelers, and consumers to inspect their ethical origin and cryptographic authenticity.

---

## 2. Problem Statement

In artisanal and industrial gold supply chains, raw doré bars often pass through multiple intermediaries before reaching wholesale refineries. This opacity creates severe risks:
- **Supply Chain Laundering**: Uncertified gold mined outside legal frameworks or without environmental permits is blended into standard bullion bars.
- **Environmental Degradation (Contextual Background)**: In major gold-producing regions like Ghana and West Africa, illegal artisanal mining (locally known as *"Galamsey"*) causes severe mercury and heavy metal contamination in major river basins (*Sources: Minerals Commission of Ghana; UNEP Minamata Convention on Mercury, 2017; OECD Due Diligence Guidance for Responsible Supply Chains of Minerals*).
- **Paper Certificate Forgery**: Traditional paper assay and concession certificates can be falsified, duplicated, or reassigned to illicit batches.

---

## 3. Solution

GoldChain addresses supply chain opacity through three cryptographic principles:
1. **On-Chain Whitelisting**: Only mining addresses authorized by a regulatory body can mint gold batch tokens.
2. **Deterministic Duplicate Prevention**: Every batch registration enforces a `keccak256(location, extractionDate, minerAddress)` collision check, mathematically preventing the double-registration of physical batches.
3. **Transparent Public Verification**: Anyone can scan a batch QR code to query Ethereum smart contracts directly, verifying ownership history, location, weight, and environmental status with zero intermediary reliance.

---

## 4. Features

- 🛡️ **Role-Based Access Control**: Strict segregation between Regulatory Administrators, Authorized Miners, and Public Verifiers.
- 🪙 **ERC-721 Provenance Tokens**: Standardized non-fungible tokens representing unique physical gold batches.
- 🔒 **Cryptographic Hash Collision Detection**: Prevents double-counting and illicit batch re-registration.
- 📱 **QR-Code Verification**: Generates privacy-preserving verification URLs (`/verify/<tokenId>`) linking directly to on-chain state.
- 🧪 **Interactive Test Suite & Hardhat Tests**: 22 comprehensive unit tests covering authorization, reverts, duplicates, and edge cases.
- 📄 **Printable Certificate of Provenance**: Generates high-fidelity audit sheets for physical bullion vaulting.
- 🌓 **Dark & Light Mode UI**: Fully responsive interface crafted with Tailwind CSS and Plus Jakarta Sans.

---

## 5. Architecture

```mermaid
graph TD
    subgraph "Actors"
        A[🏛️ Minerals Commission / Regulator]
        B[⛏️ Authorized Mining Company]
        C[🔍 Refinery / Bullion Buyer / Public]
    end

    subgraph "Smart Contract Layer (Ethereum Sepolia)"
        MR[MinerRegistry.sol<br/>• Whitelist of Licensed Miners<br/>• Concession Permit Management]
        GB[GoldBatch.sol (ERC-721)<br/>• Non-Fungible Batch Minting<br/>• keccak256 Duplicate Detection]
        VS[VerificationSystem.sol<br/>• Read-only Public Gateway<br/>• Composite Integrity Audit]
    end

    subgraph "Frontend Client (React 19 + ethers.js)"
        FE_REG[Register Batch Page]
        FE_VER[Verify Batch Page & QR]
        FE_DASH[Protocol Dashboard]
    end

    A -->|addMiner / removeMiner| MR
    B -->|mintBatch| GB
    C -->|verifyBatch / isValid| VS

    GB -->|Check Authorization| MR
    VS -->|Read Metadata & Ownership| GB
    VS -->|Check Whitelist Status| MR

    FE_REG -.->|Sign Transaction via MetaMask| GB
    FE_VER -.->|Read On-Chain Query| VS
    FE_DASH -.->|Read Statistics| GB
```

---

## 6. Smart Contracts

| Contract Name | Standard | Purpose |
| :--- | :--- | :--- |
| **`MinerRegistry.sol`** | Custom Ownable | Whitelist manager for licensed mining wallet addresses. |
| **`GoldBatch.sol`** | ERC-721 | Mints unique gold batch NFTs with deterministic collision prevention. |
| **`VerificationSystem.sol`** | Read-Only Interface | Public gateway providing structured audit results and validity checks. |

---

## 7. Contract Responsibilities

- **`MinerRegistry.sol`**:
  - Maintained by contract owner (Regulator).
  - Exposes `addMiner(address, string, string, string)`, `removeMiner(address)`, and `isAuthorizedMiner(address)`.
  - Emits `MinerAdded` and `MinerRemoved`.
  - Rejects zero addresses and duplicate registrations with custom errors (`OnlyOwner`, `ZeroAddressNotAllowed`, `MinerAlreadyAuthorized`).

- **`GoldBatch.sol`**:
  - Inherits standard ERC-721 ownership logic.
  - Exposes `mintBatch(...)`, validating that `msg.sender` is authorized in `MinerRegistry`.
  - Computes `keccak256(abi.encodePacked(location, extractionDate, minerAddress))`.
  - Stores `BatchMetadata` linked to `tokenId`.
  - Supports standard ERC-721 custody transfers (`transferFrom`).
  - Allows the regulator to update environmental audit records (`updateEnvironmentalAudit`).

- **`VerificationSystem.sol`**:
  - Stateless query layer.
  - Exposes `verifyBatch(uint256 tokenId)` returning complete provenance data and boolean flags (`isValid`, `isFingerprintIntact`, `isMinerCurrentlyAuthorized`).
  - Exposes `isValid(uint256 tokenId)` for zero-gas sanity checks.
  - Emits `BatchVerified` events when formal on-chain verification receipts are requested.

---

## 8. Access-Control Model

```
┌─────────────────────────┬────────────────────────────┬────────────────────────────┐
│ Role                    │ Allowed Actions            │ Access Enforcement         │
├─────────────────────────┼────────────────────────────┼────────────────────────────┤
│ Administrator (Owner)   │ • Authorize/Revoke Miners  │ onlyOwner modifier         │
│                         │ • Update Environmental Audit│ on MinerRegistry/GoldBatch │
├─────────────────────────┼────────────────────────────┼────────────────────────────┤
│ Authorized Miner        │ • Mint new Gold Batch NFTs │ isAuthorizedMiner check in │
│                         │ • Transfer own batches     │ GoldBatch.mintBatch        │
├─────────────────────────┼────────────────────────────┼────────────────────────────┤
│ Public Verifier         │ • Query verifyBatch        │ Open read-only view calls  │
│                         │ • Scan QR codes            │ (No gas required)          │
└─────────────────────────┴────────────────────────────┴────────────────────────────┘
```

---

## 9. Data Model

```solidity
struct BatchMetadata {
    uint256 tokenId;              // Unique NFT identifier (starts at 1001)
    string location;              // Concession GPS coordinates & district
    uint256 weightGrams;          // Gross gold weight in grams (> 0)
    uint256 purityPermille;       // Fineness (e.g., 999 = 99.9% 24K)
    uint256 extractionDate;       // Excavation timestamp
    string companyName;           // Licensed mining corporation
    string licenseNumber;         // Concession permit ID
    string environmentalStatus;   // Environmental compliance status
    address minerAddress;         // Originating miner wallet
    uint256 registrationTimestamp;// Timestamp of minting
    bytes32 batchFingerprint;     // Collision prevention hash
    string ipfsAssayReport;       // IPFS CID of laboratory assay
}
```

---

## 10. User Workflow

1. **Authorization**: Minerals Commission registers an authorized miner's wallet address in `MinerRegistry`.
2. **Extraction & Assay**: The miner extracts physical gold and obtains laboratory spectrographic purity data.
3. **Minting**: The miner connects MetaMask on the **Register Batch** page, fills out the batch parameters, and submits `mintBatch(...)`.
4. **Tagging**: The system generates a QR code linking to `/verify/<tokenId>`, which is attached to the physical shipment.
5. **Transfer**: As the doré bar moves to refineries, custody is transferred via standard ERC-721 `transferFrom`.
6. **Public Audit**: Refineries, jewelers, or consumers open `/verify/<tokenId>` or scan the QR code to verify origin and compliance.

---

## 11. Technology Stack

- **Smart Contracts**: Solidity `^0.8.19` / `^0.8.24`, Hardhat, OpenZeppelin patterns.
- **Frontend**: React 19, TypeScript, ethers.js v6, Tailwind CSS v4, Lucide React, Canvas Confetti, QRCode.
- **Blockchain**: Ethereum Sepolia Testnet (Chain ID `11155111`).
- **Testing**: Hardhat, Mocha, Chai.

---

## 12. Local Setup

```bash
# 1. Clone repository
git clone https://github.com/goldchain/goldchain-protocol.git
cd goldchain-protocol

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 13. Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Ethereum Sepolia RPC Provider
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"

# Deployer Private Key (Do not commit real private keys)
PRIVATE_KEY="0xYOUR_SEPOLIA_PRIVATE_KEY"
```

---

## 14. Running Tests

Run the Hardhat unit test suite (22 tests covering all contracts):

```bash
npx hardhat test
```

### Test Coverage Highlights:
- **MinerRegistry**: Owner authorization, non-owner rejection (`OnlyOwner`), zero address rejection, duplicate miner rejection, miner revocation, profile retrieval.
- **GoldBatch**: Authorized minting, unauthorized caller rejection (`UnauthorizedMiner`), duplicate fingerprint collision rejection (`DuplicateBatchDetected`), zero weight rejection, empty location/company validation, ERC-721 token transfers.
- **VerificationSystem**: Comprehensive batch verification, boolean `isValid` checks, de-authorized miner handling, on-chain verification events, environmental audit updates.

---

## 15. Deploying to Sepolia

```bash
# Compile smart contracts
npx hardhat compile

# Deploy to Ethereum Sepolia
node deploy/Deploy.js --network sepolia
```

---

## 16. Frontend Setup

The frontend connects to contracts using `ethers.js v6`. It includes built-in test personas (Regulator, Authorized Miner, Unauthorized Galamsey Miner) so developers can test the entire protocol without needing testnet ETH.

```bash
npm run build
npm run preview
```

---

## 17. Security Considerations

- **No Hardcoded Keys**: All credentials are parameterized via environment variables.
- **Checks-Effects-Interactions**: State updates precede external interactions.
- **Custom Gas-Optimized Errors**: Reverts use custom errors (e.g. `error UnauthorizedMiner(address)`) rather than string `require` messages.
- **Input Validation**: Enforces non-zero weights, non-empty strings, and realistic extraction dates.

---

## 18. Limitations

1. **Physical-Digital Binding ("The Oracle Problem")**: The smart contract records data submitted by authorized signers. Physical tampering between extraction and minting requires hardware attestations or tamper-evident physical seals.
2. **Batch Amalgamation**: When multiple raw batches are melted into a 400 oz bullion bar, fractional batch tracing requires multi-token standards (e.g., ERC-1155).
3. **Single Owner Centralization**: In this MVP, `MinerRegistry` is governed by a single owner. A production system would require a multi-signature contract (Gnosis Safe) or decentralized governance DAO.

---

## 19. Future Improvements

- [ ] **Multi-Signature Governance**: Transition `MinerRegistry` owner to a multi-sig vault shared between mining commissions and environmental agencies.
- [ ] **ERC-1155 Refinery Splitting**: Support fractional melting and bar division at refinery stage.
- [ ] **Decentralized Storage Pinning**: Automated pinning of spectrographic assay PDFs to IPFS via Filecoin/Web3.Storage.
- [ ] **Zero-Knowledge Proofs**: Allow miners to prove extraction from certified pits without revealing commercially confidential exact GPS coordinates.

---

## 20. License

Distributed under the **MIT License**. See `LICENSE` for details.
