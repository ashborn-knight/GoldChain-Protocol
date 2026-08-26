import React, { useState } from 'react';
import {
  AlertOctagon,
  Droplets,
  Trees,
  TrendingDown,
  ShieldCheck,
  MapPin,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GHANA_MINING_REGIONS } from '../contracts/contractConfig';

export const GhanaCrisisSection: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState(GHANA_MINING_REGIONS[0]);

  return (
    <section className="py-16 bg-gray-50/70 dark:bg-slate-900/60 border-y border-gray-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold uppercase tracking-wider mb-4">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>The $2.3 Billion Crisis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Combating Illicit Gold Smuggling &amp; "Galamsey" in Ghana
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
            Ghana is Africa's top gold producer, yet over <strong className="text-amber-700 dark:text-amber-400 font-semibold">$2.3 Billion in untracked gold</strong> is smuggled annually through uncertified artisanal syndicates ("Galamsey"). Without cryptographic provenance at the excavation site, illicit gold is melted with ethical bullion, polluting global jewelry, central bank reserves, and investment vaults.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Economic Drain */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 border border-amber-200 dark:border-amber-800">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 tracking-tight">$2.3B+</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Annual Revenue Stolen</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              Uncertified doré bars bypass national export royalties, customs oversight, and sovereign tax revenue, depriving local mining communities of hospitals and schools.
            </p>
          </div>

          {/* Card 2: River Pollution & Mercury */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 border border-cyan-200 dark:border-cyan-800">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-700 dark:text-cyan-400 tracking-tight">14,000+ NTU</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Water Turbidity in Offin &amp; Pra</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              Toxic mercury amalgamation and riverbed dredging turn pristine rivers into sludge, exceeding WHO safety standards by over 2,800x and poisoning drinking water for millions.
            </p>
          </div>

          {/* Card 3: Deforestation & Soil Poisoning */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-200 dark:border-emerald-800">
              <Trees className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">1.2M+ Acres</div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">Cocoa Forest Land Ravaged</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              Illegal excavation pits destroy Ghana's prime cocoa reserves and fertile topsoil. Unregulated strip-mining leaves behind hazardous, mercury-laden toxic craters.
            </p>
          </div>

        </div>

        {/* Interactive Concession Regions Explorer */}
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Key Ghana Mining Belts &amp; EPA Concession Oversight
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Select a gold mining belt to inspect certified concession output and environmental river protection status.
              </p>
            </div>

            {/* Region Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {GHANA_MINING_REGIONS.map((region) => (
                <button
                  key={region.name}
                  onClick={() => setActiveRegion(region)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeRegion.name === region.name
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {region.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">District &amp; Belt</span>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">{activeRegion.name}</div>
              <div className="text-xs font-mono text-amber-700 dark:text-amber-400 mt-1">{activeRegion.coordinates}</div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Certified Operator</span>
              <div className="text-base font-bold text-gray-900 dark:text-white mt-1">{activeRegion.primaryMiner}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> EPA Gold Seal Certified
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Annual Licensed Output</span>
              <div className="text-base font-bold text-amber-700 dark:text-amber-400 mt-1">{activeRegion.annualOutputTons} Metric Tonnes</div>
              <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">100% On-Chain Indexed</div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">River Protection Status</span>
              <div className="text-base font-bold text-gray-800 dark:text-slate-200 mt-1">{activeRegion.riverBasin}</div>
              <div className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold mt-1">{activeRegion.turbidityRisk}</div>
            </div>
          </div>
        </div>

        {/* The 4-Phase Blockchain Provenance Engine */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              The GoldChain Provenance Architecture
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
              How Ethereum smart contracts eliminate counterfeit gold from pit to vault
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-2xs">
                1
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Pit Extraction</h4>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                Licensed miners log raw doré gold batches with GPS coordinates, concession license, and mercury-free assay metrics.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-2xs">
                2
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">NFT Minting</h4>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                Smart contract computes deterministic <code className="text-amber-700 dark:text-amber-400 font-mono">keccak256</code> hash, enforces whitelist check, and rejects duplicate attempts.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-2xs">
                3
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Custody Transfer</h4>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                As gold transfers to PMMC national refinery and bullion vaults, ERC-721 token ownership moves atomically on Ethereum.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-2xs">
                4
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Instant Verification</h4>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                Central banks, jewelers, and consumers scan the cryptographic QR code to view tamper status, miner permit, and chemical assay.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
