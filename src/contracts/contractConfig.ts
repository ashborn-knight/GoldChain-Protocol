export const SEPOLIA_CHAIN_ID = 11155111;

export const CONTRACT_ADDRESSES = {
  MinerRegistry: '0x5bE4532B0F48a7366627680Fa22C79b36C4eA304',
  GoldBatch: '0xa62629b35041a7A85d9961B01211b439cAc4E63C',
  VerificationSystem: '0x2774C13df8398867a505bF46D080345d3A6372d8',
};

export const MINER_REGISTRY_ABI = [
  "function owner() view returns (address)",
  "function addMiner(address miner, string companyName, string licenseNumber, string region)",
  "function removeMiner(address miner)",
  "function isAuthorizedMiner(address miner) view returns (bool)",
  "function getMinerDetails(address miner) view returns (bool isAuthorized, string companyName, string licenseNumber, string region, uint256 registeredAt, uint256 totalBatchesMinted)",
  "function getTotalRegisteredMiners() view returns (uint256)",
  "function getMinerAddressByIndex(uint256 index) view returns (address)",
  "function transferOwnership(address newOwner)",
  "event MinerAdded(address indexed miner, string companyName, string licenseNumber, string region, uint256 timestamp)",
  "event MinerRemoved(address indexed miner, string companyName, uint256 timestamp)"
];

export const GOLD_BATCH_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function getAllTokenIds() view returns (uint256[])",
  "function getBatchDetails(uint256 tokenId) view returns (tuple(uint256 tokenId, string location, uint256 weightGrams, uint256 purityPermille, uint256 extractionDate, string companyName, string licenseNumber, string environmentalStatus, address minerAddress, uint256 registrationTimestamp, bytes32 batchFingerprint, string ipfsAssayReport))",
  "function computeFingerprint(string location, uint256 extractionDate, address miner) pure returns (bytes32)",
  "function isFingerprintRegistered(bytes32 fingerprint) view returns (bool)",
  "function mintBatch(string location, uint256 weightGrams, uint256 purityPermille, uint256 extractionDate, string companyName, string licenseNumber, string environmentalStatus, string ipfsAssayReport) returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function updateEnvironmentalAudit(uint256 tokenId, string newStatus)",
  "event BatchRegistered(uint256 indexed tokenId, address indexed miner, string companyName, uint256 weightGrams, string location, bytes32 indexed batchFingerprint, uint256 timestamp)",
  "event DuplicateDetected(bytes32 indexed batchFingerprint, address indexed miner, uint256 timestamp)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const VERIFICATION_SYSTEM_ABI = [
  "function verifyBatch(uint256 tokenId) view returns (tuple(uint256 tokenId, bool isValid, address currentOwner, address originatingMiner, string companyName, string licenseNumber, string location, uint256 weightGrams, uint256 purityPermille, uint256 extractionDate, uint256 registrationTimestamp, string environmentalStatus, bytes32 batchFingerprint, string ipfsAssayReport, bool isMinerCurrentlyAuthorized, bool isFingerprintIntact))",
  "function isValid(uint256 tokenId) view returns (bool)",
  "function recordOnChainVerification(uint256 tokenId) returns (bool)",
  "event BatchVerified(uint256 indexed tokenId, address indexed verifier, bool isValid, uint256 timestamp)"
];

export const DEFAULT_SIMULATED_ACCOUNTS = [
  {
    id: 'miner-anglo',
    name: 'AngloGold Ashanti (Ghana)',
    role: 'miner' as const,
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    companyName: 'AngloGold Ashanti (Ghana) Ltd',
    licenseNumber: 'EPA-GH-MIN-2024-0891',
    region: 'Obuasi Concession, Ashanti',
    balanceEth: '18.42',
  },
  {
    id: 'miner-damang',
    name: 'Damang Gold Mine (Abosso Goldfields)',
    role: 'miner' as const,
    address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    companyName: 'Damang Gold Mine (Abosso Goldfields Ltd)',
    licenseNumber: 'EPA-GH-MIN-2024-0523',
    region: 'Damang Concession, Tarkwa-Nsuaem, Western Region',
    balanceEth: '29.75',
  },
  {
    id: 'miner-newmont',
    name: 'Newmont Ghana Gold',
    role: 'miner' as const,
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    companyName: 'Newmont Ghana Gold Ltd',
    licenseNumber: 'EPA-GH-MIN-2024-0412',
    region: 'Ahafo South Concession, Brong-Ahafo',
    balanceEth: '24.15',
  },
  {
    id: 'owner-regulator',
    name: 'Ghana Minerals Commission (Admin)',
    role: 'owner' as const,
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    companyName: 'Minerals Commission & EPA Ghana',
    licenseNumber: 'GOV-REGULATORY-001',
    region: 'Accra HQ',
    balanceEth: '100.00',
  },
  {
    id: 'unauthorized-wildcat',
    name: 'Illegal / Uncertified Operator (Galamsey)',
    role: 'unauthorized' as const,
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    companyName: 'Unregistered Dredging Group',
    licenseNumber: 'NO-LICENSE',
    region: 'Offin River Basin',
    balanceEth: '3.50',
  },
  {
    id: 'refinery-pmmc',
    name: 'Precious Minerals Marketing Corp (PMMC)',
    role: 'refinery' as const,
    address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    companyName: 'PMMC National Refinery & Vault',
    licenseNumber: 'PMMC-ASSAY-VAULT-01',
    region: 'Accra Bullion Terminal',
    balanceEth: '45.80',
  }
];

export const INITIAL_BATCHES = [
  {
    tokenId: 1001,
    location: 'Obuasi Deep Underground Mine, Block 2, Ashanti (6.202°N, 1.684°W)',
    weightGrams: 25000,
    purityPermille: 999,
    extractionDate: Math.floor(Date.now() / 1000) - 86400 * 3,
    companyName: 'AngloGold Ashanti (Ghana) Ltd',
    licenseNumber: 'EPA-GH-MIN-2024-0891',
    environmentalStatus: 'EPA Ghana Certified Tier-1 • Mercury-Free Cyanidation • ISO 14001 Reforestation Bonded',
    minerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    registrationTimestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
    batchFingerprint: '0x8f3c1b489a691bc3a67011d8cfa9014528c0b29ff090d8be140283cf20938b81',
    ipfsAssayReport: 'bafybeicb3nslx2e2l4g2u63gupgh7hszpfn2h5mvyy2w67q2mzyxgh2j7e',
    currentOwner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    txHash: '0x7d891b2c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b'
  },
  {
    tokenId: 1002,
    location: 'Ahafo South Concession, Pit 4, Ahafo Region (7.054°N, 2.338°W)',
    weightGrams: 18500,
    purityPermille: 995,
    extractionDate: Math.floor(Date.now() / 1000) - 86400 * 1,
    companyName: 'Newmont Ghana Gold Ltd',
    licenseNumber: 'EPA-GH-MIN-2024-0412',
    environmentalStatus: 'EPA Gold Seal • 100% Gravity Concentration • Water Recycling Circuit 98.4%',
    minerAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    registrationTimestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
    batchFingerprint: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    ipfsAssayReport: 'bafybeie4l5x6q7z8w9v0u1t2s3r4q5p6o7n8m9l0k1j2i3h4g5f6e7d8c',
    currentOwner: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', // Transferred to PMMC refinery
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    tokenId: 1003,
    location: 'Damang Open Pit & Complex, Western Region (5.301°N, 1.992°W)',
    weightGrams: 32000,
    purityPermille: 999,
    extractionDate: Math.floor(Date.now() / 1000) - 43200,
    companyName: 'Damang Gold Mine (Abosso Goldfields Ltd)',
    licenseNumber: 'EPA-GH-MIN-2024-0523',
    environmentalStatus: 'Certified Zero-Mercury Extraction • Biodiversity Offset Reserve Protected • ISO 14001',
    minerAddress: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    registrationTimestamp: Math.floor(Date.now() / 1000) - 43200,
    batchFingerprint: '0x99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
    ipfsAssayReport: 'bafybeicassay999damangwesternregionghana0987654321xyz',
    currentOwner: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    txHash: '0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e'
  }
];

export const GHANA_MINING_REGIONS = [
  {
    name: 'Ashanti Gold Belt (Obuasi)',
    coordinates: '6.202°N, 1.684°W',
    primaryMiner: 'AngloGold Ashanti',
    annualOutputTons: '38.4',
    riverBasin: 'Offin & Jimi River Basins',
    turbidityRisk: 'High (Under Restoration)',
  },
  {
    name: 'Damang & Tarkwa Belt (Western Region)',
    coordinates: '5.301°N, 1.992°W',
    primaryMiner: 'Damang Gold Mines (Abosso Goldfields / Gold Fields)',
    annualOutputTons: '44.2',
    riverBasin: 'Ankobra River Basin',
    turbidityRisk: 'Critical River Buffer Enforced',
  },
  {
    name: 'Ahafo Concession Belt (Kenyasi)',
    coordinates: '7.054°N, 2.338°W',
    primaryMiner: 'Newmont Ghana',
    annualOutputTons: '29.1',
    riverBasin: 'Tano River Basin',
    turbidityRisk: 'Monitored / High Compliance',
  },
  {
    name: 'Bibiani-Chirano Belt (Western North)',
    coordinates: '6.467°N, 2.333°W',
    primaryMiner: 'Asante Gold / Chirano',
    annualOutputTons: '18.7',
    riverBasin: 'Bia River Basin',
    turbidityRisk: 'Moderate / Buffer Enforced',
  }
];
