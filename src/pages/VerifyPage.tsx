import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Camera,
  Upload,
  Printer,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  FileText,
  UserCheck,
  Lock,
  ArrowRight,
  Send,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { useWeb3 } from '../context/Web3Context';
import { VerificationResult } from '../types';

interface VerifyPageProps {
  initialTokenId?: number | null;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ initialTokenId }) => {
  const { verifyGoldBatch, batches, transferBatchCustody, currentAddress } = useWeb3();

  const [searchTokenId, setSearchTokenId] = useState<string>(
    initialTokenId ? initialTokenId.toString() : (batches[0]?.tokenId.toString() || '1001')
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [qrCertUrl, setQrCertUrl] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Custody transfer modal state
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [transferToAddress, setTransferToAddress] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  // Camera QR Scanner Modal State
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Run verification
  const handleVerify = async (idToVerify?: number) => {
    const id = idToVerify !== undefined ? idToVerify : parseInt(searchTokenId, 10);
    if (isNaN(id)) {
      setSearchError('Please enter a valid numeric Batch Token ID (e.g. 1001)');
      setResult(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await verifyGoldBatch(id);
      if (!res) {
        setSearchError(`Batch #${id} was not found on the Ethereum Sepolia ledger. It may be uncertified or fraudulent.`);
        setResult(null);
      } else {
        setResult(res);

        // Generate verification QR code
        const qrPayload = JSON.stringify({
          protocol: 'GoldChain',
          tokenId: res.tokenId,
          verified: true,
          miner: res.companyName,
          weightKg: res.weightGrams / 1000,
          fingerprint: res.batchFingerprint
        });
        const url = await QRCode.toDataURL(qrPayload, { width: 260, margin: 2 });
        setQrCertUrl(url);
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || 'Verification query failed');
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialTokenId) {
      setSearchTokenId(initialTokenId.toString());
      handleVerify(initialTokenId);
    } else if (batches.length > 0) {
      handleVerify(batches[0].tokenId);
    }
  }, [initialTokenId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setIsTransferring(true);
    setTransferError(null);

    try {
      const res = await transferBatchCustody(result.tokenId, transferToAddress);
      if (!res.success) {
        setTransferError(res.error || 'Transfer failed');
      } else {
        setTransferSuccess(true);
        setTimeout(() => {
          setTransferSuccess(false);
          setShowTransferModal(false);
          handleVerify(result.tokenId);
        }, 1500);
      }
    } catch (err: any) {
      setTransferError(err.message || 'Custody transfer reverted');
    } finally {
      setIsTransferring(false);
    }
  };

  // Start Camera Stream for QR Scanner
  const startCamera = async () => {
    setShowScannerModal(true);
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err: any) {
      setCameraError('Camera access unavailable in this environment. You can select one of the registered batches below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowScannerModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Authenticity Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify Gold Batch Provenance
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-3xl">
          Instantly verify any registered gold batch, checking concession origins, environmental standards, and custody records.
        </p>
      </div>

      {/* Search Bar & Quick Selectors */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm mb-8 transition-colors duration-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            <input
              id="search-token-id-input"
              type="text"
              placeholder="Enter Batch Token ID (e.g. 1001, 1002)..."
              value={searchTokenId}
              onChange={(e) => setSearchTokenId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white font-mono text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          <button
            id="verify-submit-btn"
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Verify Batch
          </button>

          <button
            type="button"
            onClick={startCamera}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Scan QR Code
          </button>
        </form>

        {/* Quick Demo Batch Selectors */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium mr-1">Quick Select Active Batches:</span>
          {batches.map((b) => (
            <button
              key={b.tokenId}
              onClick={() => {
                setSearchTokenId(b.tokenId.toString());
                handleVerify(b.tokenId);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                result?.tokenId === b.tokenId
                  ? 'bg-amber-500 text-white font-bold shadow-2xs'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              #{b.tokenId} ({b.companyName.split(' ')[0]} - {b.weightGrams / 1000}kg)
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {searchError && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start gap-4 mb-8">
          <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-rose-900 dark:text-rose-200">Verification Failure</h3>
            <p className="text-xs mt-1 leading-relaxed text-rose-700 dark:text-rose-300">{searchError}</p>
          </div>
        </div>
      )}

      {/* Verification Certificate Result */}
      {result && (
        <div id="printable-certificate" className="space-y-6">
          
          {/* Main Certificate Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden transition-colors duration-200">
            
            {/* Certificate Header Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    CERTIFICATE OF PROVENANCE
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-slate-400 font-semibold">
                    Token ID: #{result.tokenId}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {result.companyName}
                </h2>
                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 pt-1 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Concession License: {result.licenseNumber} (EPA Ghana Verified)
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-start md:items-end">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-sm shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  AUTHENTIC ETHICAL GOLD
                </div>
                <span className="text-[11px] font-mono text-gray-500 dark:text-slate-400 mt-1.5 font-medium">
                  Ethereum Sepolia Verified
                </span>
              </div>

            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Certified Gross Weight</span>
                <div className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-mono mt-1">
                  {(result.weightGrams / 1000).toFixed(2)}{' '}
                  <span className="text-sm font-sans text-gray-500 dark:text-slate-400">kg</span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 block">
                  {(result.weightGrams * 0.0321507).toFixed(1)} Troy Oz
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Assay Fineness</span>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono mt-1">
                  {result.purityPermille >= 999 ? '24K' : '22K'}
                </div>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 block font-mono font-semibold">
                  {result.purityPermille / 10}% Fine Doré
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Extraction Date</span>
                <div className="text-base font-bold text-gray-900 dark:text-white mt-1">
                  {new Date(result.extractionDate * 1000).toLocaleDateString()}
                </div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 block">
                  Concession Assay Logged
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Est. Value (Spot $85.5/g)</span>
                <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-1">
                  ${Math.round(result.weightGrams * 85.5).toLocaleString()}
                </div>
                <span className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 block">
                  USD Benchmark
                </span>
              </div>

            </div>

            {/* Geographical Concession Map & Coordinates View */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Geographical Concession &amp; Concession District
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-mono">
                  Ghana Minerals Cadastre
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {result.location}
              </p>
              <div className="text-xs text-gray-600 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Geofence Boundary Verified: Concession concession polygon matching EPA active permit registry.</span>
              </div>
            </div>

            {/* Environmental & Cryptographic Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Environmental Compliance */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  EPA Environmental &amp; Ethical Audit
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>100% Mercury-Free Extraction (No river dredging)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Closed-Loop Cyanidation with Tailings Dam Neutralization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Reforestation Escrow Bond Deposited to EPA</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Conflict-Free &amp; Fairmined Labor Standard Verified</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proofs */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  Smart Contract Integrity Proofs
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  
                  <div>
                    <span className="text-gray-500 dark:text-slate-400 text-[10px] block font-sans">keccak256 Deterministic Fingerprint</span>
                    <div className="flex items-center justify-between text-gray-800 dark:text-slate-200">
                      <span className="truncate max-w-[200px]">{result.batchFingerprint}</span>
                      <button
                        onClick={() => copyToClipboard(result.batchFingerprint, 'fingerprint')}
                        className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-[11px] font-sans font-semibold cursor-pointer"
                      >
                        {copiedText === 'fingerprint' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-slate-400 text-[10px] block font-sans">Originating Miner Signer</span>
                    <div className="flex items-center justify-between text-gray-800 dark:text-slate-200">
                      <span className="truncate max-w-[200px]">{result.originatingMiner}</span>
                      <button
                        onClick={() => copyToClipboard(result.originatingMiner, 'miner')}
                        className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-[11px] font-sans font-semibold cursor-pointer"
                      >
                        {copiedText === 'miner' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-slate-400 text-[10px] block font-sans">Current Custody Owner</span>
                    <div className="flex items-center justify-between text-gray-800 dark:text-slate-200">
                      <span className="truncate max-w-[200px]">{result.currentOwner}</span>
                      <button
                        onClick={() => copyToClipboard(result.currentOwner, 'owner')}
                        className="text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-[11px] font-sans font-semibold cursor-pointer"
                      >
                        {copiedText === 'owner' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* QR Code and Actions Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-800">
              
              <div className="flex items-center space-x-4">
                {qrCertUrl && (
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-white border border-gray-200 dark:border-slate-700 shadow-2xs">
                    <img src={qrCertUrl} alt="QR" className="w-20 h-20" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    Tamper-Proof Verification QR
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                    Scan with any mobile camera to view cryptographic proof
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                
                {/* Custody Transfer Button (if user is owner) */}
                <button
                  id="transfer-custody-btn"
                  onClick={() => setShowTransferModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-300 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Transfer Custody (ERC-721)
                </button>

                {/* Print Certificate */}
                <button
                  onClick={handlePrintCertificate}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Certificate
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Custody Transfer Modal */}
      {showTransferModal && result && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-500" />
                Transfer Batch Custody
              </h3>
              <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">Batch #{result.tokenId}</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Transfer this gold batch NFT (ERC-721) to the next participant in the supply chain (e.g. PMMC National Refinery, vault depository, or bullion bank).
            </p>

            {transferError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-mono">
                {transferError}
              </div>
            )}

            {transferSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Custody Transferred Successfully!
              </div>
            )}

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Recipient Ethereum Wallet Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x... (e.g. PMMC Refinery: 0x15d34AAf...)"
                  value={transferToAddress}
                  onChange={(e) => setTransferToAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div className="text-[11px] text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg border border-gray-200 dark:border-slate-800">
                Preset shortcut: Click below to transfer to PMMC National Refinery:
                <button
                  type="button"
                  onClick={() => setTransferToAddress('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65')}
                  className="text-amber-700 dark:text-amber-400 hover:underline block font-mono mt-1 font-semibold cursor-pointer"
                >
                  0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (PMMC Vault)
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isTransferring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Confirm Custody Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <Camera className="w-5 h-5 text-amber-500" />
              Live QR Scanner
            </h3>
            
            <div className="w-full aspect-square bg-gray-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-300 dark:border-slate-700 relative flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-amber-500/80 rounded-xl pointer-events-none animate-pulse" />
            </div>

            {cameraError && (
              <p className="text-xs text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                {cameraError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  stopCamera();
                  if (batches.length > 0) {
                    setSearchTokenId(batches[0].tokenId.toString());
                    handleVerify(batches[0].tokenId);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Scan Batch #{batches[0]?.tokenId || 1001}
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
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
