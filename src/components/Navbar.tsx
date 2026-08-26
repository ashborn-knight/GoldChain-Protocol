import React, { useState } from 'react';
import {
  Menu,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_SIMULATED_ACCOUNTS } from '../contracts/contractConfig';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onToggleSidebar }) => {
  const {
    currentAddress,
    currentAccount,
    balanceEth,
    isAuthorizedMiner,
    connectMetaMask,
    switchSimulatedAccount
  } = useWeb3();

  const { theme, toggleTheme } = useTheme();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':
        return { section: 'Overview', title: 'Home Overview' };
      case 'dashboard':
        return { section: 'Analytics', title: 'Dashboard' };
      case 'register':
        return { section: 'Operations', title: 'Register Gold Batch' };
      case 'verify':
        return { section: 'Public Portal', title: 'Verify Provenance' };
      case 'admin':
        return { section: 'Governance', title: 'Miner Registry' };
      default:
        return { section: 'Platform', title: 'GoldChain' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Main Application Header Toolbar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Sidebar Toggle + Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              id="sidebar-toggle-btn"
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Toggle Navigation Menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 hidden sm:inline">
                {pageInfo.section}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 hidden sm:inline" />
              <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white font-display truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {pageInfo.title}
              </h1>
            </div>
          </div>

          {/* Right: Controls & Wallet */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Dark/Light Mode Switcher */}
            <button
              id="theme-toggle-button"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-amber-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                id="persona-switcher-button"
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 text-xs text-gray-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                title="Switch User Role"
              >
                <div className={`w-2 h-2 rounded-full ${isAuthorizedMiner ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="font-semibold truncate max-w-[110px] sm:max-w-[130px] text-gray-800 dark:text-slate-200">
                  {currentAccount ? currentAccount.name.split(' ')[0] : 'Web3 User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in duration-150">
                  <div className="p-2 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Select User Persona
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Quick Switch</span>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {DEFAULT_SIMULATED_ACCOUNTS.map((acc) => {
                      const isSelected = currentAccount?.id === acc.id;
                      return (
                        <button
                          key={acc.id}
                          id={`persona-btn-${acc.id}`}
                          onClick={() => {
                            switchSimulatedAccount(acc.id);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
                              {acc.name}
                              {acc.role === 'miner' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                                  Authorized Miner
                                </span>
                              )}
                              {acc.role === 'owner' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                                  Regulator
                                </span>
                              )}
                              {acc.role === 'unauthorized' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
                                  Unauthorized
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 font-mono mt-0.5">
                              {acc.address.slice(0, 10)}...{acc.address.slice(-6)}
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">
                            {acc.balanceEth} ETH
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-gray-100 dark:border-slate-800">
                    <button
                      id="metamask-connect-button"
                      onClick={() => {
                        connectMetaMask();
                        setShowPersonaMenu(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      Connect MetaMask
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Address & Status Pill */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono shadow-2xs">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200">
                  {currentAddress ? `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}` : 'Disconnected'}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  {balanceEth} ETH
                </span>
              </div>

              {isAuthorizedMiner ? (
                <span
                  title="Authorized Miner"
                  className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              ) : (
                <span
                  title="Unauthorized Wallet"
                  className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
