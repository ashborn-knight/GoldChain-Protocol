import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  GoldBatchData,
  MinerProfile,
  VerificationResult,
  SimulatedAccount
} from '../types';
import {
  CONTRACT_ADDRESSES,
  SEPOLIA_CHAIN_ID,
  MINER_REGISTRY_ABI,
  GOLD_BATCH_ABI,
  VERIFICATION_SYSTEM_ABI,
  DEFAULT_SIMULATED_ACCOUNTS,
  INITIAL_BATCHES
} from '../contracts/contractConfig';

interface Web3ContextType {
  isMetaMaskAvailable: boolean;
  isConnected: boolean;
  isSimulatedMode: boolean;
  currentAddress: string;
  currentAccount: SimulatedAccount | null;
  chainId: number | null;
  networkName: string;
  balanceEth: string;
  isAuthorizedMiner: boolean;
  currentMinerProfile: MinerProfile | null;
  batches: GoldBatchData[];
  miners: Record<string, MinerProfile>;
  recentTransactions: Array<{
    hash: string;
    type: string;
    details: string;
    timestamp: number;
    status: 'confirmed' | 'reverted';
  }>;
  connectMetaMask: () => Promise<void>;
  disconnectWallet: () => void;
  toggleSimulatedMode: (simulated: boolean) => void;
  switchSimulatedAccount: (accountId: string) => void;
  mintGoldBatch: (params: {
    location: string;
    weightKg: number;
    purityPermille: number;
    extractionDate: number;
    companyName: string;
    licenseNumber: string;
    environmentalStatus: string;
    ipfsAssayReport?: string;
  }) => Promise<{ success: boolean; tokenId?: number; txHash?: string; error?: string }>;
  verifyGoldBatch: (tokenId: number) => Promise<VerificationResult | null>;
  addAuthorizedMiner: (
    minerAddress: string,
    companyName: string,
    licenseNumber: string,
    region: string
  ) => Promise<{ success: boolean; error?: string }>;
  removeAuthorizedMiner: (minerAddress: string) => Promise<{ success: boolean; error?: string }>;
  transferBatchCustody: (
    tokenId: number,
    toAddress: string
  ) => Promise<{ success: boolean; txHash?: string; error?: string }>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimulatedMode, setIsSimulatedMode] = useState<boolean>(true);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [currentAddress, setCurrentAddress] = useState<string>(DEFAULT_SIMULATED_ACCOUNTS[0].address);
  const [currentAccount, setCurrentAccount] = useState<SimulatedAccount | null>(DEFAULT_SIMULATED_ACCOUNTS[0]);
  const [chainId, setChainId] = useState<number | null>(SEPOLIA_CHAIN_ID);
  const [networkName, setNetworkName] = useState<string>('Sepolia Testnet (Simulated)');
  const [balanceEth, setBalanceEth] = useState<string>('18.42');

  // Stored On-Chain State
  const [batches, setBatches] = useState<GoldBatchData[]>(() => {
    const saved = localStorage.getItem('goldchain_batches');
    if (saved) {
      try {
        const parsed: GoldBatchData[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(b => b.tokenId));
        const missing = INITIAL_BATCHES.filter(b => !existingIds.has(b.tokenId));
        return [...parsed, ...missing];
      } catch (e) {
        return INITIAL_BATCHES;
      }
    }
    return INITIAL_BATCHES;
  });

  const defaultMiners: Record<string, MinerProfile> = {
    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8': {
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      isAuthorized: true,
      companyName: 'AngloGold Ashanti (Ghana) Ltd',
      licenseNumber: 'EPA-GH-MIN-2024-0891',
      region: 'Obuasi Concession, Ashanti',
      registeredAt: Math.floor(Date.now() / 1000) - 86400 * 30,
      totalBatchesMinted: 1,
    },
    '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f': {
      address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
      isAuthorized: true,
      companyName: 'Damang Gold Mine (Abosso Goldfields Ltd)',
      licenseNumber: 'EPA-GH-MIN-2024-0523',
      region: 'Damang Concession, Tarkwa-Nsuaem, Western Region',
      registeredAt: Math.floor(Date.now() / 1000) - 86400 * 45,
      totalBatchesMinted: 1,
    },
    '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc': {
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      isAuthorized: true,
      companyName: 'Newmont Ghana Gold Ltd',
      licenseNumber: 'EPA-GH-MIN-2024-0412',
      region: 'Ahafo South Concession, Brong-Ahafo',
      registeredAt: Math.floor(Date.now() / 1000) - 86400 * 20,
      totalBatchesMinted: 1,
    },
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266': {
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      isAuthorized: true,
      companyName: 'Ghana Minerals Commission (Regulatory)',
      licenseNumber: 'GOV-REGULATORY-001',
      region: 'National Oversight (Accra)',
      registeredAt: Math.floor(Date.now() / 1000) - 86400 * 100,
      totalBatchesMinted: 0,
    }
  };

  const [miners, setMiners] = useState<Record<string, MinerProfile>>(() => {
    const saved = localStorage.getItem('goldchain_miners');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultMiners, ...parsed };
    }
    return defaultMiners;
  });

  const [recentTransactions, setRecentTransactions] = useState<Array<{
    hash: string;
    type: string;
    details: string;
    timestamp: number;
    status: 'confirmed' | 'reverted';
  }>>(() => {
    return [
      {
        hash: '0x7d891b2c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
        type: 'Mint Batch #1001',
        details: '25 kg (24K) • AngloGold Ashanti • Obuasi',
        timestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
        status: 'confirmed'
      },
      {
        hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        type: 'Custody Transfer #1002',
        details: 'Transferred to PMMC National Refinery',
        timestamp: Math.floor(Date.now() / 1000) - 86400 * 1,
        status: 'confirmed'
      }
    ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('goldchain_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('goldchain_miners', JSON.stringify(miners));
  }, [miners]);

  // Check MetaMask presence
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setIsMetaMaskAvailable(true);
    }
  }, []);

  // Compute authorization status
  const normalizedCurrentAddr = currentAddress.toLowerCase();
  const currentMinerProfile = miners[normalizedCurrentAddr] || null;
  const isAuthorizedMiner = Boolean(currentMinerProfile?.isAuthorized);

  // Switch simulated account
  const switchSimulatedAccount = (accountId: string) => {
    const acc = DEFAULT_SIMULATED_ACCOUNTS.find(a => a.id === accountId);
    if (acc) {
      setCurrentAccount(acc);
      setCurrentAddress(acc.address);
      setBalanceEth(acc.balanceEth);
      setIsConnected(true);
      setIsSimulatedMode(true);
      setNetworkName('Sepolia (In-Browser EVM Engine)');
    }
  };

  const toggleSimulatedMode = (simulated: boolean) => {
    setIsSimulatedMode(simulated);
    if (simulated) {
      switchSimulatedAccount('miner-anglo');
    } else {
      connectMetaMask();
    }
  };

  // Connect live MetaMask
  const connectMetaMask = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask or Web3 wallet is not detected. Switched to In-Browser Web3 Simulation Mode.');
      setIsSimulatedMode(true);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      
      setCurrentAddress(accounts[0]);
      setCurrentAccount(null);
      setChainId(Number(network.chainId));
      setNetworkName(Number(network.chainId) === SEPOLIA_CHAIN_ID ? 'Ethereum Sepolia' : `Chain ID: ${network.chainId}`);
      setIsConnected(true);
      setIsSimulatedMode(false);

      const bal = await provider.getBalance(accounts[0]);
      setBalanceEth(parseFloat(ethers.formatEther(bal)).toFixed(4));
    } catch (err: any) {
      console.error('MetaMask connection error:', err);
      alert(`Wallet connection failed: ${err.message || 'User rejected'}`);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setCurrentAddress('');
    setCurrentAccount(null);
  };

  // Mint Gold Batch
  const mintGoldBatch = async (params: {
    location: string;
    weightKg: number;
    purityPermille: number;
    extractionDate: number;
    companyName: string;
    licenseNumber: string;
    environmentalStatus: string;
    ipfsAssayReport?: string;
  }) => {
    // 1. Authorization check
    if (!isAuthorizedMiner) {
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setRecentTransactions(prev => [
        {
          hash: txHash,
          type: 'Mint Reverted (Unauthorized)',
          details: `Rejected: ${currentAddress.slice(0, 8)}... is not on the EPA/Minerals Commission Whitelist`,
          timestamp: Math.floor(Date.now() / 1000),
          status: 'reverted'
        },
        ...prev
      ]);
      return {
        success: false,
        error: `Custom Error: UnauthorizedMiner(${currentAddress}). This wallet is not registered on the MinerRegistry whitelist.`
      };
    }

    // 2. Compute deterministic fingerprint: keccak256(location, extractionDate, minerAddress)
    const weightGrams = Math.round(params.weightKg * 1000);
    const rawData = `${params.location.trim().toLowerCase()}_${params.extractionDate}_${currentAddress.toLowerCase()}`;
    const batchFingerprint = ethers.keccak256(ethers.toUtf8Bytes(rawData));

    // 3. Duplicate detection check
    const existing = batches.find(b => b.batchFingerprint === batchFingerprint);
    if (existing) {
      const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setRecentTransactions(prev => [
        {
          hash: txHash,
          type: 'Duplicate Collision Reverted',
          details: `Fingerprint ${batchFingerprint.slice(0, 10)}... already registered under Batch #${existing.tokenId}`,
          timestamp: Math.floor(Date.now() / 1000),
          status: 'reverted'
        },
        ...prev
      ]);
      return {
        success: false,
        error: `Custom Error: DuplicateBatchDetected(${batchFingerprint}). An identical batch with the same concession coordinates, extraction timestamp, and miner address is already registered on-chain as Token #${existing.tokenId}.`
      };
    }

    // 4. Successful Minting
    const nextTokenId = batches.length > 0 ? Math.max(...batches.map(b => b.tokenId)) + 1 : 1001;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newBatch: GoldBatchData = {
      tokenId: nextTokenId,
      location: params.location,
      weightGrams: weightGrams,
      purityPermille: params.purityPermille,
      extractionDate: params.extractionDate,
      companyName: params.companyName || currentMinerProfile?.companyName || 'Authorized Gold Producer',
      licenseNumber: params.licenseNumber || currentMinerProfile?.licenseNumber || 'EPA-GH-MIN-2024-XXXX',
      environmentalStatus: params.environmentalStatus,
      minerAddress: currentAddress,
      registrationTimestamp: Math.floor(Date.now() / 1000),
      batchFingerprint: batchFingerprint,
      ipfsAssayReport: params.ipfsAssayReport || 'bafybeih4j3z74fk6y3y5v6f5w3m4n5k6j7l8m9',
      currentOwner: currentAddress,
      txHash: txHash
    };

    setBatches(prev => [newBatch, ...prev]);

    // Update miner count
    if (currentMinerProfile) {
      setMiners(prev => ({
        ...prev,
        [normalizedCurrentAddr]: {
          ...currentMinerProfile,
          totalBatchesMinted: currentMinerProfile.totalBatchesMinted + 1
        }
      }));
    }

    // Record Tx
    setRecentTransactions(prev => [
      {
        hash: txHash,
        type: `Mint Batch #${nextTokenId}`,
        details: `${params.weightKg} kg • ${params.companyName || currentMinerProfile?.companyName}`,
        timestamp: Math.floor(Date.now() / 1000),
        status: 'confirmed'
      },
      ...prev
    ]);

    return {
      success: true,
      tokenId: nextTokenId,
      txHash: txHash
    };
  };

  // Verify Gold Batch
  const verifyGoldBatch = async (tokenId: number): Promise<VerificationResult | null> => {
    const batch = batches.find(b => b.tokenId === Number(tokenId));
    if (!batch) return null;

    // Check miner validity
    const minerNormalized = batch.minerAddress.toLowerCase();
    const miner = miners[minerNormalized];
    const isMinerCurrentlyAuthorized = Boolean(miner?.isAuthorized);

    // Recompute fingerprint
    const rawData = `${batch.location.trim().toLowerCase()}_${batch.extractionDate}_${batch.minerAddress.toLowerCase()}`;
    const recomputedHash = ethers.keccak256(ethers.toUtf8Bytes(rawData));
    const isFingerprintIntact = (recomputedHash === batch.batchFingerprint);

    return {
      tokenId: batch.tokenId,
      isValid: Boolean(batch.weightGrams > 0 && isFingerprintIntact),
      currentOwner: batch.currentOwner || batch.minerAddress,
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
      isMinerCurrentlyAuthorized,
      isFingerprintIntact
    };
  };

  // Add Authorized Miner (Admin)
  const addAuthorizedMiner = async (
    minerAddress: string,
    companyName: string,
    licenseNumber: string,
    region: string
  ) => {
    if (!ethers.isAddress(minerAddress)) {
      return { success: false, error: 'Invalid Ethereum wallet address' };
    }

    const norm = minerAddress.toLowerCase();
    if (miners[norm]?.isAuthorized) {
      return { success: false, error: 'Miner is already authorized in the registry' };
    }

    setMiners(prev => ({
      ...prev,
      [norm]: {
        address: minerAddress,
        isAuthorized: true,
        companyName,
        licenseNumber,
        region,
        registeredAt: Math.floor(Date.now() / 1000),
        totalBatchesMinted: prev[norm]?.totalBatchesMinted || 0
      }
    }));

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setRecentTransactions(prev => [
      {
        hash: txHash,
        type: 'Miner Added to Whitelist',
        details: `${companyName} (${licenseNumber})`,
        timestamp: Math.floor(Date.now() / 1000),
        status: 'confirmed'
      },
      ...prev
    ]);

    return { success: true };
  };

  // Remove Authorized Miner (Admin)
  const removeAuthorizedMiner = async (minerAddress: string) => {
    const norm = minerAddress.toLowerCase();
    if (!miners[norm]) {
      return { success: false, error: 'Miner not found in registry' };
    }

    setMiners(prev => ({
      ...prev,
      [norm]: {
        ...prev[norm],
        isAuthorized: false
      }
    }));

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setRecentTransactions(prev => [
      {
        hash: txHash,
        type: 'Miner Whitelist Revoked',
        details: `${miners[norm].companyName} authorization removed`,
        timestamp: Math.floor(Date.now() / 1000),
        status: 'confirmed'
      },
      ...prev
    ]);

    return { success: true };
  };

  // Transfer Batch Custody (ERC-721 Transfer)
  const transferBatchCustody = async (tokenId: number, toAddress: string) => {
    if (!ethers.isAddress(toAddress)) {
      return { success: false, error: 'Invalid destination address' };
    }

    const batch = batches.find(b => b.tokenId === tokenId);
    if (!batch) {
      return { success: false, error: 'Batch not found' };
    }

    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    setBatches(prev => prev.map(b => {
      if (b.tokenId === tokenId) {
        return { ...b, currentOwner: toAddress };
      }
      return b;
    }));

    setRecentTransactions(prev => [
      {
        hash: txHash,
        type: `Custody Transfer #${tokenId}`,
        details: `Transferred to ${toAddress.slice(0, 8)}...`,
        timestamp: Math.floor(Date.now() / 1000),
        status: 'confirmed'
      },
      ...prev
    ]);

    return { success: true, txHash };
  };

  return (
    <Web3Context.Provider
      value={{
        isMetaMaskAvailable,
        isConnected,
        isSimulatedMode,
        currentAddress,
        currentAccount,
        chainId,
        networkName,
        balanceEth,
        isAuthorizedMiner,
        currentMinerProfile,
        batches,
        miners,
        recentTransactions,
        connectMetaMask,
        disconnectWallet,
        toggleSimulatedMode,
        switchSimulatedAccount,
        mintGoldBatch,
        verifyGoldBatch,
        addAuthorizedMiner,
        removeAuthorizedMiner,
        transferBatchCustody
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
