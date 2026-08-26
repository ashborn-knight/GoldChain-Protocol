import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  QrCode,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Info,
  Flame,
  FileCheck2,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useWeb3 } from '../context/Web3Context';
import { GHANA_MINING_REGIONS } from '../contracts/contractConfig';

interface RegisterPageProps {
  onMintSuccess: (tokenId: number) => void;
  setActiveTab: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onMintSuccess, setActiveTab }) => {
  const {
    currentAddress,
    currentAccount,
    isAuthorizedMiner,
    currentMinerProfile,
    mintGoldBatch,
    switchSimulatedAccount,
    batches
  } = useWeb3();

  // Form State
  const [selectedConcession, setSelectedConcession] = useState<string>(
    'Obuasi Underground Shaft 3, Ashanti Region (6.202°N, 1.684°W)'
  );
  const [customLocation, setCustomLocation] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number>(20.0);
  const [purityPermille, setPurityPermille] = useState<number>(999); // 24K (99.9%)
  const [extractionDate, setExtractionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [companyName, setCompanyName] = useState<string>(
    currentMinerProfile?.companyName || 'AngloGold Ashanti (Ghana) Ltd'
  );
  const [licenseNumber, setLicenseNumber] = useState<string>(
    currentMinerProfile?.licenseNumber || 'EPA-GH-MIN-2024-0891'
  );
  const [ipfsAssayCid, setIpfsAssayCid] = useState<string>(
    'bafybeih4j3z74fk6y3y5v6f5w3m4n5k6j7l8m9labreportghana'
  );

  // Environmental Compliance Checkboxes
  const [envChecks, setEnvChecks] = useState({
    mercuryFree: true,
    epaPermit: true,
    waterRecycled: true,
    reforestationBond: true,
    fairminedCertified: true,
  });

  // UI state
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccessData, setMintSuccessData] = useState<{
    tokenId: number;
    txHash: string;
    qrDataUrl: string;
  } | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Update defaults when miner profile changes
  useEffect(() => {
    if (currentMinerProfile) {
      setCompanyName(currentMinerProfile.companyName);
      setLicenseNumber(currentMinerProfile.licenseNumber);
    }
  }, [currentMinerProfile]);

  const activeLocation = customLocation.trim() ? customLocation : selectedConcession;

  // Build environmental description string
  const compileEnvironmentalStatus = () => {
    const items = [];
    if (envChecks.epaPermit) items.push('EPA Ghana Certified Concession');
    if (envChecks.mercuryFree) items.push('100% Mercury-Free Gravity Extraction');
    if (envChecks.waterRecycled) items.push('Closed-Loop Water Recycling Circuit');
    if (envChecks.reforestationBond) items.push('Reforestation Escrow Bond Deposited');
    if (envChecks.fairminedCertified) items.push('Fairmined Ethical Labor Standard');
    return items.join(' • ');
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setMintError(null);
    setIsMinting(true);

    try {
      const unixDate = Math.floor(new Date(extractionDate).getTime() / 1000);
      const envStatus = compileEnvironmentalStatus();

      const result = await mintGoldBatch({
        location: activeLocation,
        weightKg: Number(weightKg),
        purityPermille: Number(purityPermille),
        extractionDate: unixDate,
        companyName: companyName,
        licenseNumber: licenseNumber,
        environmentalStatus: envStatus,
        ipfsAssayReport: ipfsAssayCid
      });

      if (!result.success) {
        setMintError(result.error || 'Failed to mint gold batch NFT.');
        setIsMinting(false);
        return;
      }

      // Generate QR Code
      const qrPayload = JSON.stringify({
        protocol: 'GoldChain',
        network: 'Ethereum Sepolia',
        tokenId: result.tokenId,
        weightKg: weightKg,
        purity: purityPermille >= 999 ? '24K (99.9%)' : '22K (91.6%)',
        company: companyName,
        location: activeLocation,
        txHash: result.txHash
      });

      const qrCodeUrl = await QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#f8fafc',
        }
      });

      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
      });

      setMintSuccessData({
        tokenId: result.tokenId!,
        txHash: result.txHash!,
        qrDataUrl: qrCodeUrl
      });

      setIsMinting(false);
    } catch (err: any) {
      console.error(err);
      setMintError(err.message || 'Minting error occurred');
      setIsMinting(false);
    }
  };

  // Test duplicate collision
  const handleTestDuplicateCollision = () => {
    if (batches.length > 0) {
      const first = batches[0];
      setSelectedConcession(first.location);
      setCustomLocation('');
      setWeightKg(first.weightGrams / 1000);
      setPurityPermille(first.purityPermille);
      setExtractionDate(new Date(first.extractionDate * 1000).toISOString().split('T')[0]);
      setCompanyName(first.companyName);
      setLicenseNumber(first.licenseNumber);
      setMintError(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
          <PlusCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Batch Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Register Certified Gold Batch
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-3xl">
          Register verified raw extracted doré bars on the digital supply chain registry. Only authorized and licensed mining companies can certify new batches.
        </p>
      </div>

      {/* Whitelist Authorization Status Alert */}
      <div className="mb-8">
        {isAuthorizedMiner ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Authorized Mining Concession Verified
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-semibold">
                    MinerRegistry: PASS
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                  Signing wallet <code className="font-mono text-emerald-900 dark:text-emerald-200 font-semibold">{currentAddress.slice(0, 8)}...{currentAddress.slice(-6)}</code> is authorized as <strong className="text-emerald-950 dark:text-white">{currentMinerProfile?.companyName}</strong> ({currentMinerProfile?.licenseNumber}).
                </p>
              </div>
            </div>

            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono whitespace-nowrap bg-emerald-100/70 dark:bg-emerald-900/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold">
              {currentMinerProfile?.totalBatchesMinted || 0} Batches Registered
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    Unauthorized Wallet Address (Galamsey / Wildcat)
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 font-semibold">
                    Revert: UnauthorizedMiner()
                  </span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300/80 mt-0.5">
                  Current wallet <code className="font-mono text-rose-900 dark:text-rose-200 font-semibold">{currentAddress.slice(0, 8)}...{currentAddress.slice(-6)}</code> is not in the Minerals Commission Whitelist. Minting transactions will be rejected by <code className="text-amber-800 dark:text-amber-400 font-semibold">MinerRegistry</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchSimulatedAccount('miner-anglo')}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Switch to AngloGold Miner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-semibold border border-gray-300 dark:border-slate-700 cursor-pointer"
              >
                Request Whitelist
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Registration Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleMint} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-500" />
                Physical Extraction &amp; Assay Data
              </h2>
              <button
                type="button"
                onClick={handleTestDuplicateCollision}
                className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold underline flex items-center gap-1 cursor-pointer"
                title="Populates form with an existing batch to test cryptographic duplicate rejection"
              >
                <RefreshCw className="w-3 h-3" /> Test Duplicate Collision
              </button>
            </div>

            {/* Error banner */}
            {mintError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-900 dark:text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Transaction Reverted on Ethereum
                </div>
                <p className="font-mono text-rose-700 dark:text-rose-300">{mintError}</p>
              </div>
            )}

            {/* Mining Concession Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Ghana Concession Location &amp; District Coordinates
              </label>
              <select
                value={selectedConcession}
                onChange={(e) => setSelectedConcession(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <option value="Obuasi Deep Underground Mine, Block 2, Ashanti (6.202°N, 1.684°W)">
                  Obuasi Deep Underground Mine, Block 2, Ashanti (6.202°N, 1.684°W)
                </option>
                <option value="Damang Open Pit & Complex, Western Region (5.301°N, 1.992°W)">
                  Damang Gold Mine Open Pit &amp; Complex, Western Region (5.301°N, 1.992°W)
                </option>
                <option value="Ahafo South Concession, Pit 4, Ahafo Region (7.054°N, 2.338°W)">
                  Ahafo South Concession, Pit 4, Ahafo Region (7.054°N, 2.338°W)
                </option>
                <option value="Tarkwa Open Cast Mine, Western Region (5.295°N, 1.988°W)">
                  Tarkwa Open Cast Mine, Western Region (5.295°N, 1.988°W)
                </option>
                <option value="Prestea Underground Shaft 4, Western Region (5.433°N, 2.143°W)">
                  Prestea Underground Shaft 4, Western Region (5.433°N, 2.143°W)
                </option>
                <option value="Bibiani-Chirano Concession, Western North (6.467°N, 2.333°W)">
                  Bibiani-Chirano Concession, Western North (6.467°N, 2.333°W)
                </option>
              </select>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or enter custom concession coordinates (e.g. Asanko Mine Block A, 6.31°N, 1.95°W)"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 text-xs focus:border-amber-500 outline-none placeholder-gray-400 dark:placeholder-slate-600"
                />
              </div>
            </div>

            {/* Weight and Purity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Gross Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-mono focus:border-amber-500 outline-none pr-12"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-amber-600 dark:text-amber-400 font-bold">
                    KG
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 block">
                  = {(weightKg * 1000).toLocaleString()} grams
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Gold Fineness / Karat Rating
                </label>
                <select
                  value={purityPermille}
                  onChange={(e) => setPurityPermille(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:border-amber-500 outline-none"
                >
                  <option value={999}>24 Karat (99.9% Pure Doré)</option>
                  <option value={916}>22 Karat (91.6% Refined)</option>
                  <option value={750}>18 Karat (75.0% Industrial)</option>
                </select>
              </div>
            </div>

            {/* Extraction Date and License Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Excavation / Assay Date
                </label>
                <input
                  type="date"
                  required
                  value={extractionDate}
                  onChange={(e) => setExtractionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Concession License Number
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-mono focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Miner Company Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Mining Corporate Entity
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:border-amber-500 outline-none"
              />
            </div>

            {/* Environmental & Ethical Standards Checkbox Group */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                EPA Environmental Compliance Declarations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700 dark:text-slate-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={envChecks.mercuryFree}
                    onChange={(e) => setEnvChecks({ ...envChecks, mercuryFree: e.target.checked })}
                    className="rounded border-gray-300 dark:border-slate-700 text-amber-600 focus:ring-0"
                  />
                  <span className="font-medium">100% Mercury-Free Method</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={envChecks.epaPermit}
                    onChange={(e) => setEnvChecks({ ...envChecks, epaPermit: e.target.checked })}
                    className="rounded border-gray-300 dark:border-slate-700 text-amber-600 focus:ring-0"
                  />
                  <span className="font-medium">EPA Environmental Permit</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={envChecks.waterRecycled}
                    onChange={(e) => setEnvChecks({ ...envChecks, waterRecycled: e.target.checked })}
                    className="rounded border-gray-300 dark:border-slate-700 text-amber-600 focus:ring-0"
                  />
                  <span className="font-medium">Zero River Sludge Discharge</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={envChecks.reforestationBond}
                    onChange={(e) => setEnvChecks({ ...envChecks, reforestationBond: e.target.checked })}
                    className="rounded border-gray-300 dark:border-slate-700 text-amber-600 focus:ring-0"
                  />
                  <span className="font-medium">Reforestation Escrow Active</span>
                </label>
              </div>
            </div>

            {/* Spectrographic Lab Assay CID */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                IPFS Spectrographic Assay CID (PMMC / Intertek Lab)
              </label>
              <input
                type="text"
                value={ipfsAssayCid}
                onChange={(e) => setIpfsAssayCid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-800 dark:text-slate-200 text-xs font-mono focus:border-amber-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              id="submit-mint-batch-btn"
              type="submit"
              disabled={isMinting}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isMinting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Recording Batch to Registry...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Register Gold Batch ({weightKg} kg)
                </>
              )}
            </button>

          </form>
        </div>

        {/* Holographic Gold Bar Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 space-y-6">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors duration-200">
              
              {/* Metallic Gold Bar Visual Render */}
              <div className="relative mx-auto w-full max-w-[280px] h-[150px] rounded-2xl bg-gradient-to-r from-yellow-600 via-amber-300 to-yellow-500 p-1 shadow-lg shadow-amber-500/15 mb-6 border border-yellow-200/60">
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-yellow-400/95 via-amber-500 to-yellow-600 p-4 flex flex-col justify-between text-slate-950 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      GOLDCHAIN CERTIFIED
                    </span>
                    <span className="text-xs font-mono font-black">
                      {purityPermille >= 999 ? '999.9 FINE' : '916.0 FINE'}
                    </span>
                  </div>

                  <div className="text-center my-auto">
                    <div className="text-3xl font-black tracking-tight font-mono">
                      {weightKg} <span className="text-base font-sans font-bold">KG</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-900/80">
                      GHANA CONCESSION INGOT
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                    <span>{licenseNumber || 'EPA-GH-MIN'}</span>
                    <span>{(weightKg * 32.1507).toFixed(1)} TROY OZ</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Metadata Summary */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-gray-500 dark:text-slate-400">Certification</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">Digital Origin Certificate</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-gray-500 dark:text-slate-400">Mining Company</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-200 truncate max-w-[180px]">
                    {companyName || 'Not Set'}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-gray-500 dark:text-slate-400">Spot Value</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    ${(weightKg * 1000 * 85.50).toLocaleString()} USD
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-gray-500 dark:text-slate-400">Concession Site</span>
                  <span className="text-gray-700 dark:text-slate-300 truncate max-w-[180px] font-medium">
                    {activeLocation}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Duplicate Shield</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    keccak256 ACTIVE
                  </span>
                </div>
              </div>

            </div>

            {/* Smart Contract Guarantee Notice */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Anti-Galamsey Invariant Enforcement
              </div>
              <p className="leading-relaxed text-gray-600 dark:text-slate-400">
                If duplicate coordinates, duplicate timestamps, or an unauthorized miner attempt to mint, the contract will atomically revert with gas-efficient custom errors.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Success Modal / QR Certificate */}
      {mintSuccessData && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in duration-200">
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
                Batch Successfully Minted
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Gold Batch #{mintSuccessData.tokenId}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                Anchored to Ethereum Sepolia with cryptographic QR provenance
              </p>
            </div>

            {/* QR Code */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white border border-gray-200 dark:border-slate-800 w-fit mx-auto shadow-inner">
              <img
                src={mintSuccessData.qrDataUrl}
                alt={`QR Code for Batch #${mintSuccessData.tokenId}`}
                className="w-52 h-52 mx-auto"
              />
            </div>

            {/* Tx Hash Pill */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-xs flex items-center justify-between">
              <div className="text-left font-mono">
                <span className="text-[10px] text-gray-400 dark:text-slate-500 block font-sans">Transaction Hash</span>
                <span className="text-gray-700 dark:text-slate-300 truncate max-w-[200px] block font-semibold">
                  {mintSuccessData.txHash}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(mintSuccessData.txHash)}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                title="Copy Hash"
              >
                {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onMintSuccess(mintSuccessData.tokenId);
                  setActiveTab('verify');
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Audit &amp; Verify Batch
              </button>
              <button
                onClick={() => setMintSuccessData(null)}
                className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
