import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  UserX,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  RefreshCw,
  Sparkles,
  Lock,
  Building2
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { MinerProfile } from '../types';

export const AdminPage: React.FC = () => {
  const {
    miners,
    currentAddress,
    currentAccount,
    addAuthorizedMiner,
    removeAuthorizedMiner,
    switchSimulatedAccount
  } = useWeb3();

  const [newMinerAddress, setNewMinerAddress] = useState<string>('');
  const [newCompanyName, setNewCompanyName] = useState<string>('');
  const [newLicenseNumber, setNewLicenseNumber] = useState<string>('');
  const [newRegion, setNewRegion] = useState<string>('Obuasi, Ashanti Region');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);

  const isOwner = currentAccount?.role === 'owner' || currentAddress.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

  const handleAddMiner = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await addAuthorizedMiner(
        newMinerAddress,
        newCompanyName,
        newLicenseNumber,
        newRegion
      );

      if (!res.success) {
        setAdminError(res.error || 'Failed to add miner to registry');
      } else {
        setAdminSuccess(`Successfully authorized ${newCompanyName} on the MinerRegistry whitelist.`);
        setNewMinerAddress('');
        setNewCompanyName('');
        setNewLicenseNumber('');
      }
    } catch (err: any) {
      setAdminError(err.message || 'Error occurred while adding miner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMiner = async (address: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke authorization for ${name}? They will immediately lose NFT minting privileges.`)) {
      return;
    }

    const res = await removeAuthorizedMiner(address);
    if (res.success) {
      setAdminSuccess(`Revoked authorization for ${name}.`);
    } else {
      setAdminError(res.error || 'Failed to revoke authorization.');
    }
  };

  const minersList: MinerProfile[] = Object.values(miners) as MinerProfile[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Regulatory Oversight</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Miner Registry
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-3xl">
            Manage authorized mining concessions and licensed corporate entities on the registry.
          </p>
        </div>

        {/* Quick switch to administrator */}
        {!isOwner && (
          <button
            onClick={() => switchSimulatedAccount('owner-regulator')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Switch to Administrator
          </button>
        )}
      </div>

      {/* Admin Notice */}
      {isOwner ? (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-300">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-medium">
            Logged in as Administrator. You have permission to authorize and manage mining licenses.
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">
            View-only Mode: You are in a standard user session. Switch to the Administrator account to add or manage licenses.
          </span>
        </div>
      )}

      {/* Feedback banners */}
      {adminSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {adminSuccess}
        </div>
      )}

      {adminError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-mono">
          {adminError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form: Add New Authorized Miner */}
        <div className="lg:col-span-5">
          <form onSubmit={handleAddMiner} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors duration-200">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" />
              Authorize New Mining Company
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Register a licensed company and wallet address to the authorized directory.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Company Wallet Address
              </label>
              <input
                type="text"
                required
                placeholder="0x..."
                value={newMinerAddress}
                onChange={(e) => setNewMinerAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Asanko Gold Ghana Ltd"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                License Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EPA-GH-MIN-2024-0994"
                value={newLicenseNumber}
                onChange={(e) => setNewLicenseNumber(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Mining District / Region
              </label>
              <input
                type="text"
                required
                value={newRegion}
                onChange={(e) => setNewRegion(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-xs focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isOwner}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Authorize Mining Company
            </button>
          </form>
        </div>

        {/* Miner Whitelist Directory */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              Registered Mining Companies ({minersList.length})
            </h2>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              {minersList.filter(m => m.isAuthorized).length} Active Authorized
            </span>
          </div>

          <div className="space-y-4">
            {minersList.map((m) => (
              <div
                key={m.address}
                className="p-4 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{m.companyName}</span>
                    {m.isAuthorized ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Authorized
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        Revoked
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-slate-400 font-mono mt-1">
                    {m.address}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-slate-300 mt-2">
                    <span>License: <strong className="text-gray-900 dark:text-white">{m.licenseNumber}</strong></span>
                    <span>Region: <strong className="text-gray-900 dark:text-white">{m.region}</strong></span>
                    <span>Batches: <strong className="text-amber-700 dark:text-amber-400 font-bold">{m.totalBatchesMinted}</strong></span>
                  </div>
                </div>

                {isOwner && m.isAuthorized && (
                  <button
                    onClick={() => handleRemoveMiner(m.address, m.companyName)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 dark:hover:bg-rose-600 text-rose-700 dark:text-rose-400 hover:text-white dark:hover:text-white text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Revoke License
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
