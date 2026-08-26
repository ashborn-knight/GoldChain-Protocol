import React, { useState } from 'react';
import {
  BarChart3,
  Coins,
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  Sparkles,
  Cpu,
  Clock
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { MinerProfile } from '../types';
import { GHANA_MINING_REGIONS, CONTRACT_ADDRESSES } from '../contracts/contractConfig';

interface DashboardPageProps {
  onSelectBatchToVerify: (tokenId: number) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectBatchToVerify,
  setActiveTab,
}) => {
  const { batches, miners, recentTransactions } = useWeb3();
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Computations
  const totalGrams = batches.reduce((acc, b) => acc + (b.weightGrams || 0), 0);
  const totalKg = (totalGrams / 1000).toFixed(2);
  const totalEstimatedUsd = Math.round(totalGrams * 85.50).toLocaleString();
  const authorizedMinerCount = (Object.values(miners) as MinerProfile[]).filter(m => m.isAuthorized).length;

  // Filtered Batches
  const filteredBatches = batches.filter((b) => {
    const matchSearch =
      b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tokenId.toString().includes(searchTerm);

    const matchRegion =
      filterRegion === 'all' || b.location.toLowerCase().includes(filterRegion.toLowerCase());

    return matchSearch && matchRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
            <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Real-Time Supply Chain Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            GoldChain Protocol Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Live telemetry of certified gold batches, EPA concession tracking, and illegal smuggling prevention.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('register')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
        >
          <Coins className="w-4 h-4" />
          Register New Batch
        </button>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Gold Certified */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Certified Gold</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 font-mono mt-3">
            {totalKg} <span className="text-base font-sans text-gray-500 dark:text-slate-400 font-normal">kg</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-2 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 100% On-Chain Indexed
          </div>
        </div>

        {/* Card 2: Bullion Spot Value */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Indexed Value (Spot $85.5/g)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-mono mt-3">
            ${totalEstimatedUsd}
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            USD Bullion Valuation
          </div>
        </div>

        {/* Card 3: Active Whitelisted Mines */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Verified Ethical Mines</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 font-mono mt-3">
            {authorizedMinerCount} Concessions
          </div>
          <div className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            EPA &amp; Minerals Commission Audited
          </div>
        </div>

        {/* Card 4: Total Registered Batches */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Registered Batches</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-yellow-200 dark:border-yellow-800">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-400 font-mono mt-3">
            {batches.length} Batches
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-2 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 0 Duplicates Allowed
          </div>
        </div>

      </div>

      {/* Ghana Regional Breakdown & Live Feed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Registrations Table */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                Live Gold Batch Ledger
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Every record anchored with immutable concession metadata
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by company, district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-xs text-gray-700 dark:text-slate-200 outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Regions</option>
                <option value="ashanti">Ashanti (Obuasi)</option>
                <option value="ahafo">Ahafo (Kenyasi)</option>
                <option value="western">Western (Tarkwa)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-wider font-mono text-[10px] bg-gray-50/50 dark:bg-slate-950/50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Token ID</th>
                  <th className="py-2.5 px-3 font-semibold">Mining Company</th>
                  <th className="py-2.5 px-3 font-semibold">Gross Weight</th>
                  <th className="py-2.5 px-3 font-semibold">Assay Karat</th>
                  <th className="py-2.5 px-3 font-semibold">Concession Location</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-sans">
                {filteredBatches.map((batch) => (
                  <tr key={batch.tokenId} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                      #{batch.tokenId}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900 dark:text-white">{batch.companyName}</div>
                      <div className="text-[10px] font-mono text-gray-500 dark:text-slate-400">{batch.licenseNumber}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-900 dark:text-white font-bold">
                      {(batch.weightGrams / 1000).toFixed(2)} kg
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                        {batch.purityPermille >= 999 ? '24K (99.9%)' : '22K'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-slate-300 max-w-[200px] truncate" title={batch.location}>
                      {batch.location}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectBatchToVerify(batch.tokenId)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-500 dark:hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-white dark:hover:text-white font-bold text-xs transition-colors border border-amber-200 dark:border-amber-800 cursor-pointer"
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right: Regional Concession Breakdown & Tx Feed */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ghana Region Overview Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Ghana Mining Concession Belts
            </h3>

            <div className="space-y-3">
              {GHANA_MINING_REGIONS.map((reg) => (
                <div key={reg.name} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                    <span>{reg.name.split(' ')[0]} Belt</span>
                    <span className="text-amber-700 dark:text-amber-400 font-mono">{reg.annualOutputTons}T / yr</span>
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-slate-400 mt-1">{reg.primaryMiner}</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">{reg.riverBasin}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Transaction Stream */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Recent Sepolia Protocol Activity
            </h3>

            <div className="space-y-3">
              {recentTransactions.slice(0, 4).map((tx, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">{tx.type}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      tx.status === 'confirmed' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-slate-400 font-sans">{tx.details}</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{tx.hash}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
