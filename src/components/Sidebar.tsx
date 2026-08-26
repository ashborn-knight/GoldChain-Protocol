import React from 'react';
import {
  Coins,
  LayoutDashboard,
  PlusCircle,
  Search,
  Users,
  ShieldCheck,
  Award,
  ChevronRight,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenCompliance: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
  onOpenCompliance
}) => {
  const {
    currentAddress,
    currentAccount,
    balanceEth,
    isAuthorizedMiner
  } = useWeb3();

  const navGroups = [
    {
      group: 'Overview & Operations',
      items: [
        {
          id: 'home',
          label: 'Home',
          icon: Coins,
          description: 'Protocol introduction & overview'
        },
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          description: 'Supply statistics & registered batches'
        },
        {
          id: 'register',
          label: 'Register Gold Batch',
          icon: PlusCircle,
          description: 'Register and certify new gold extraction'
        },
        {
          id: 'verify',
          label: 'Verify Provenance',
          icon: Search,
          description: 'Check gold origin & authenticity'
        }
      ]
    },
    {
      group: 'Administration',
      items: [
        {
          id: 'admin',
          label: 'Miner Registry',
          icon: Users,
          description: 'Authorized miner directory'
        }
      ]
    }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40">
          <div
            onClick={() => handleSelectTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-display">
                  Gold<span className="text-amber-600 dark:text-amber-400">Chain</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                Gold Provenance Platform
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold font-mono tracking-wider uppercase text-gray-400 dark:text-slate-500">
                {group.group}
              </div>

              <div className="space-y-1 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 font-bold'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate font-medium">
                          {item.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Standards & Guidelines link */}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenCompliance();
                onCloseMobile();
              }}
              className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-800 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Standards &amp; Guidelines
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Active Account / Role Card */}
        <div className="p-3.5 border-t border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-2 shadow-2xs">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${isAuthorizedMiner ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200 truncate">
                  {currentAccount ? currentAccount.name : 'Web3 Account'}
                </span>
              </div>
              
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                currentAccount?.role === 'miner'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : currentAccount?.role === 'owner'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}>
                {currentAccount?.role === 'miner' ? 'Miner' : currentAccount?.role === 'owner' ? 'Regulator' : 'Unauthorized'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 dark:text-slate-400">
              <span>{currentAddress ? `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}` : '0x00...0000'}</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">{balanceEth} ETH</span>
            </div>

          </div>
        </div>

      </aside>
    </>
  );
};
