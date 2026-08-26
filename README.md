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

- **🔐 Cryptographic Whitelisting & Governance (`MinerRegistry.sol`)**:
  - Regulatory bodies (e.g., Ghana Minerals Commission / EPA) manage on-chain authorization.
  - Non-compliant or unlicensed mining entities are cryptographically blocked from minting or certifying batches.
- **🏷️ Digital Batch Tokenization (`GoldBatch.sol`)**:
  - Raw doré gold batches are minted into verifiable ERC-721 digital certificates.
  - Immutably logs batch weight, chemical fineness (purity), extraction GPS coordinates, concession licenses, and zero-mercury certifications.
- **🛡️ Duplicate & Fraud Detection**:
  - Employs deterministic `keccak256` hashing on batch parameters to prevent double-counting or re-registering physical bullion.
- **🔍 Public Provenance & QR Verification (`VerificationSystem.sol`)**:
  - Customs officials, refineries, jewelers, and end consumers can scan a QR code or enter a Token ID to instantly verify authenticity and complete chain-of-custody history.
- **⚡ Dual Web3 Connectivity**:
  - Full support for live MetaMask browser extension on Ethereum Sepolia, alongside pre-configured simulated test personas (Regulator, Damang Gold Mine, AngloGold Ashanti, Newmont, and Unauthorized User) for frictionless demonstration.

---

## 🏗️ System Architecture
