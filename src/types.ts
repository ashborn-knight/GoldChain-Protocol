export interface GoldBatchData {
  tokenId: number;
  location: string;
  weightGrams: number;
  purityPermille: number; // e.g. 999 = 24K, 916 = 22K
  extractionDate: number; // unix timestamp
  companyName: string;
  licenseNumber: string;
  environmentalStatus: string;
  minerAddress: string;
  registrationTimestamp: number;
  batchFingerprint: string;
  ipfsAssayReport: string;
  currentOwner?: string;
  txHash?: string;
}

export interface MinerProfile {
  address: string;
  isAuthorized: boolean;
  companyName: string;
  licenseNumber: string;
  region: string;
  registeredAt: number;
  totalBatchesMinted: number;
}

export interface VerificationResult {
  tokenId: number;
  isValid: boolean;
  currentOwner: string;
  originatingMiner: string;
  companyName: string;
  licenseNumber: string;
  location: string;
  weightGrams: number;
  purityPermille: number;
  extractionDate: number;
  registrationTimestamp: number;
  environmentalStatus: string;
  batchFingerprint: string;
  ipfsAssayReport: string;
  isMinerCurrentlyAuthorized: boolean;
  isFingerprintIntact: boolean;
}

export interface SimulatedAccount {
  id: string;
  name: string;
  role: 'owner' | 'miner' | 'unauthorized' | 'refinery';
  address: string;
  companyName?: string;
  licenseNumber?: string;
  region?: string;
  balanceEth: string;
}

export interface HardhatTestResult {
  id: number;
  section: string;
  title: string;
  status: 'passed' | 'failed' | 'pending';
  durationMs: number;
  gasUsed?: number;
  details?: string;
}
