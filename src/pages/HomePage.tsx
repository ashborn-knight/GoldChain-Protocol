import React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  Coins,
  CheckCircle2,
  Lock,
  FileCheck2,
  Flame,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers,
  BarChart2
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { GhanaCrisisSection } from '../components/GhanaCrisisSection';
import { CONTRACT_ADDRESSES } from '../contracts/contractConfig';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onQuickVerify?: (tokenId: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onQuickVerify }) => {
  const { batches, isAuthorizedMiner, currentAccount } = useWeb3();

  // Compute live metrics
  const totalGrams = batches.reduce((acc, b) => acc + (b.weightGrams || 0), 0);
  const totalKg = (totalGrams / 1000).toFixed(1);
  const totalEstimatedUsd = Math.round((totalGrams * 85.50)).toLocaleString(); // ~$85.5/g gold spot price
  const activeCount = batches.length;

  return (
    <div className="space-y-0">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-18 lg:pb-24 bg-gradient-to-b from-white via-[#fcfcfc] to-gray-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-100/40 dark:bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 text-xs font-bold tracking-wide uppercase mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Ethereum Sepolia Web3 Supply Chain</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15]">
              Cryptographic Provenance for{' '}
              <span className="text-amber-600 dark:text-amber-400 underline decoration-amber-300 dark:decoration-amber-500 decoration-wavy decoration-2 underline-offset-8">
                Ethical Gold
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-slate-300 font-normal leading-relaxed">
              GoldChain anchors physical gold batches from authorized Ghanaian concession pits to unique, non-duplicable ERC-721 tokens—eradicating illegal mining fraud and uncertified bullion laundering.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-register-btn"
                onClick={() => setActiveTab('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
              >
                <PlusCircle className="w-5 h-5" />
                Register Gold Batch (Mint NFT)
              </button>

              <button
                id="hero-verify-btn"
                onClick={() => setActiveTab('verify')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 font-bold text-base border border-gray-300 dark:border-slate-700 flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Audit &amp; Verify Provenance
              </button>
            </div>

            {/* Live Highlights Banner */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
              
              <div className="p-3 text-center border-r border-gray-100 dark:border-slate-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {totalKg} <span className="text-sm font-sans font-normal text-gray-500 dark:text-slate-400">kg</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">Certified Gold Tracked</div>
              </div>

              <div className="p-3 text-center sm:border-r border-gray-100 dark:border-slate-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
                  ${totalEstimatedUsd}
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">Bullion Value Indexed</div>
              </div>

              <div className="p-3 text-center border-r border-gray-100 dark:border-slate-800 last:border-none">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  100%
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">Mercury-Free Compliant</div>
              </div>

              <div className="p-3 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {activeCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1">ERC-721 Batches Minted</div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Ghana Crisis In-Depth Section */}
      <GhanaCrisisSection />

      {/* Featured Genesis & Recent Batches */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-500" />
              Live On-Chain Registered Batches
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Immutable gold tokens currently tracked on Ethereum Sepolia ledger
            </p>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-2 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors"
          >
            View All in Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {batches.slice(0, 3).map((batch) => (
            <div
              key={batch.tokenId}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Batch #{batch.tokenId}
                  </span>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Authentic
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                    {(batch.weightGrams / 1000).toFixed(2)} kg{' '}
                    <span className="text-xs font-sans text-amber-700 dark:text-amber-400 font-bold">
                      {batch.purityPermille >= 999 ? '24K (99.9%)' : '22K (91.6%)'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-800 dark:text-slate-200 mt-1">{batch.companyName}</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">{batch.location}</div>
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {batch.environmentalStatus}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400 dark:text-slate-500">
                  {batch.batchFingerprint.slice(0, 10)}...
                </span>
                <button
                  id={`verify-batch-${batch.tokenId}-btn`}
                  onClick={() => {
                    if (onQuickVerify) {
                      onQuickVerify(batch.tokenId);
                    } else {
                      setActiveTab('verify');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Verify Batch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Contract Proof Card */}
      <section className="py-12 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-gray-900 dark:bg-slate-900 text-white border border-gray-800 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                Verified Solidity ^0.8.19 Deployment
              </div>
              <h3 className="text-2xl font-bold text-white">
                Ethereum Sepolia Testnet Architecture
              </h3>
              <p className="text-sm text-gray-300 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Audited contracts include <code className="text-amber-300 font-mono">MinerRegistry</code>, <code className="text-amber-300 font-mono">GoldBatch</code> (ERC-721), and <code className="text-amber-300 font-mono">VerificationSystem</code> with native custom errors, reentrancy guards, and cryptographic collision hashing.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                View Protocol Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
