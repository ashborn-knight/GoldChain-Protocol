import React from 'react';
import {
  ShieldCheck,
  Scale,
  FileCheck2,
  AlertTriangle,
  Globe2,
  X,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Building,
  Award
} from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>International &amp; Sovereign Framework</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
              Regulatory Compliance &amp; Ethical Standards
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              How GoldChain maps physical mineral law to Ethereum smart contract constraints.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pillar 1: OECD Due Diligence */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                OECD Due Diligence Guidance
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Annex II Compliant
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Enforces 5-step supply chain risk management for minerals originating in conflict-affected and high-risk areas (CAHRAs), guaranteeing origin traceability to certified extraction pits.
            </p>
          </div>

          {/* Pillar 2: LBMA Responsible Gold */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                LBMA Good Delivery Standard
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                RGG v9 Standard
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Provides cryptographic chain of custody required by London Bullion Market Association refineries, preventing uncertified scrap or smuggled doré bars from entering wholesale bullion markets.
            </p>
          </div>

          {/* Pillar 3: Minamata Convention */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                UNEP Minamata Convention
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Mercury-Free
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Mandates that all whitelisted mining entities attest to gravity-concentration methods with zero mercury river amalgamation, protecting Ghana's Pra and Offin river basins.
            </p>
          </div>

          {/* Pillar 4: Ghana Minerals & Mining Act 703 */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Ghana Mining Act (Act 703)
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                PMMC &amp; MINCOM
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Directly integrates Ghana Minerals Commission concession cadastre permits and Precious Minerals Marketing Company (PMMC) assay certificates into decentralized state.
            </p>
          </div>

        </div>

        {/* Technical Architecture Invariant Proof */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
          <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Smart Contract Invariant Verification Engine
          </div>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
            Every mint transaction computes a <code className="font-mono font-semibold text-amber-900 dark:text-amber-200">keccak256(location, weightGrams, purity, timestamp, company)</code> hash collision check. If a non-whitelisted address or duplicate batch tries to mint, the EVM execution atomically reverts with zero state modification.
          </p>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Acknowledge &amp; Return
          </button>
        </div>

      </div>
    </div>
  );
};
