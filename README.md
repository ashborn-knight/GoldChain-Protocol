# 🏅 GoldChain Protocol

> **Decentralized Gold Provenance, Ethical Supply Chain & Regulatory Verification Protocol on Ethereum**

[![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=flat-square&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=flat-square&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 📖 Overview & Problem Statement

Ghana is Africa's largest gold producer, yet its mining ecosystem faces a critical crisis: **unregulated, illegal mining (*Galamsey*)**. 

Illegal operations introduce toxic mercury and cyanide into vital river basins (such as the Pra, Ankobra, and Birim rivers), cause rapid deforestation, and allow conflict and untaxed gold to infiltrate the international bullion market.

**GoldChain Protocol** is a decentralized provenance registry and digital certification system built on the Ethereum blockchain. It guarantees that every bar of gold entering the international market comes strictly from legally licensed, EPA-compliant, mercury-free mining concessions.

---

## 🚀 Key Features

- **🔐 Cryptographic Whitelisting & Governance (`MinerRegistry.sol`)**  
  Regulatory bodies (e.g., Ghana Minerals Commission / EPA) manage on-chain authorization.  
  Non-compliant or unlicensed mining entities are cryptographically blocked from minting or certifying batches.

- **🏷️ Digital Batch Tokenization (`GoldBatch.sol`)**  
  Raw doré gold batches are minted into verifiable ERC-721 digital certificates.  
  Immutably logs batch weight, chemical fineness (purity), extraction GPS coordinates, concession licenses, and zero-mercury certifications.

- **🛡️ Duplicate & Fraud Detection**  
  Employs deterministic `keccak256` hashing on batch parameters to prevent double-counting or re-registering physical bullion.

- **🔍 Public Provenance & QR Verification (`VerificationSystem.sol`)**  
  Customs officials, refineries, jewelers, and end consumers can scan a QR code or enter a Token ID to instantly verify authenticity and complete chain-of-custody history.

- **⚡ Dual Web3 Connectivity**  
  Full support for live MetaMask browser extension on Ethereum Sepolia, alongside pre-configured simulated test personas (Regulator, Damang Gold Mine, AngloGold Ashanti, Newmont, and Unauthorized User) for frictionless demonstration.

---

## 🏗️ System Architecture
┌─────────────────────────────────────────────────────────┐
│ React 19 + TypeScript UI                                │
│ (Dashboard, Batch Registration, Verification, Admin)    │
└────────────────────────────┬────────────────────────────┘
│
ethers.js / Web3Context / MetaMask
│
▼
┌─────────────────────────────────────────────────────────┐
│ Ethereum Sepolia Smart Contracts                        │
│                                                         │
│ 1. MinerRegistry.sol (Whitelisting & Auth)              │
│ 2. GoldBatch.sol (ERC-721 Digital Tokens)               │
│ 3. VerificationSystem.sol (Public Cryptographic API)    │
└─────────────────────────────────────────────────────────┘

---

## 📦 Project Structure

```bash
goldchain-protocol/
├── contracts/               # Solidity Smart Contracts
│   ├── GoldBatch.sol        # ERC-721 batch tokenization
│   ├── MinerRegistry.sol    # Regulatory access control & whitelisting
│   └── VerificationSystem.sol # Public read-only verification gateway
├── scripts/                 # Deployment & test helper scripts
├── src/                     # React frontend source code
│   ├── components/          # Reusable UI components & modals
│   ├── context/             # Web3 & Wallet Provider Context
│   ├── pages/               # Application views (Dashboard, Register, Verify, Admin)
│   ├── types.ts             # TypeScript interfaces and data models
│   └── App.tsx              # Root application router & navigation
├── hardhat.config.cjs       # Hardhat network & compiler configuration
├── vite.config.ts           # Vite bundler configuration
└── package.json             # Dependencies and scripts

```

🛠️ Getting Started
Prerequisites
Node.js (v18.0.0 or higher)

npm or yarn

MetaMask browser extension (optional for live Sepolia testing)

Installation
Clone the repository:
git clone https://github.com/ashborn-knight/GoldChain-Protocol.git
cd GoldChain-Protocol

Install dependencies:
npm install


🧪 Smart Contract Deployment & Testing
To compile and deploy the smart contracts using Hardhat:
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.cjs --network sepolia

🛡️ Security & Privacy
No Secrets in Repo: All API keys, RPC credentials, and private keys remain strictly local via .env (ignored by git).

Role-Based Access Control (RBAC): All sensitive administrative smart contract functions enforce onlyOwner / regulator modifiers.

Tamper-Evident Hashing: Gold batch fingerprints are cryptographically anchored on-chain upon block confirmation.

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.


---

✅ Copy this entire block into your `README.md` file. It’s fully Markdown‑compatible and will render perfectly on GitHub.  

👉 Do you want me to also generate a **short tagline** (like one sentence under the repo name) that makes the project sound recruiter‑ready on GitHub and LinkedIn?



