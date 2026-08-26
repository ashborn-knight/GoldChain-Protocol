import React, { useState } from 'react';
import { Web3Provider } from './context/Web3Context';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ComplianceModal } from './components/ComplianceModal';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyPage } from './pages/VerifyPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { CONTRACT_ADDRESSES } from './contracts/contractConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTokenIdForVerify, setSelectedTokenIdForVerify] = useState<number | null>(1001);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);

  const handleQuickVerify = (tokenId: number) => {
    setSelectedTokenIdForVerify(tokenId);
    setActiveTab('verify');
  };

  const handleMintSuccess = (tokenId: number) => {
    setSelectedTokenIdForVerify(tokenId);
    setActiveTab('verify');
  };

  return (
    <ThemeProvider>
      <Web3Provider>
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex font-sans selection:bg-amber-500 selection:text-white transition-colors duration-200">
          
          {/* Left Sidebar Navigation Panel */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            onCloseMobile={() => setIsSidebarOpen(false)}
            onOpenCompliance={() => setShowComplianceModal(true)}
          />

          {/* Main Dashboard Application Area */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
            
            {/* Top Application Header */}
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Dynamic Section Content View */}
            <main className="flex-1">
              {activeTab === 'home' && (
                <HomePage
                  setActiveTab={setActiveTab}
                  onQuickVerify={handleQuickVerify}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardPage
                  onSelectBatchToVerify={handleQuickVerify}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'register' && (
                <RegisterPage
                  onMintSuccess={handleMintSuccess}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'verify' && (
                <VerifyPage
                  initialTokenId={selectedTokenIdForVerify}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPage />
              )}
            </main>

            {/* Application Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 py-8 transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        G
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight font-display">
                        Gold<span className="text-amber-600 dark:text-amber-400">Chain</span> Protocol
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 max-w-md">
                      Cryptographic gold provenance and supply chain verification on Ethereum Sepolia, safeguarding Ghanaian communities against illicit mining.
                    </p>
                  </div>

                  {/* Verified Contract Addresses */}
                  <div className="flex flex-wrap gap-2.5 text-[11px] font-mono">
                    <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 dark:text-slate-500 block font-sans uppercase font-semibold">MinerRegistry</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{CONTRACT_ADDRESSES.MinerRegistry.slice(0, 10)}...</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 dark:text-slate-500 block font-sans uppercase font-semibold">GoldBatch (ERC-721)</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{CONTRACT_ADDRESSES.GoldBatch.slice(0, 10)}...</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
                      <span className="text-[9px] text-gray-400 dark:text-slate-500 block font-sans uppercase font-semibold">VerificationSystem</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{CONTRACT_ADDRESSES.VerificationSystem.slice(0, 10)}...</span>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 dark:text-slate-500 text-[11px]">
                  <div>
                    © {new Date().getFullYear()} GoldChain Protocol • Partnered with Ghana Minerals Commission &amp; EPA
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>Solidity ^0.8.19</span>
                    <span>•</span>
                    <span>ERC-721 Standard</span>
                    <span>•</span>
                    <span>Sepolia Testnet</span>
                  </div>
                </div>

              </div>
            </footer>

          </div>

          {/* Compliance Framework Modal */}
          <ComplianceModal
            isOpen={showComplianceModal}
            onClose={() => setShowComplianceModal(false)}
          />

        </div>
      </Web3Provider>
    </ThemeProvider>
  );
}
