
import React from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'shops';
  setActiveTab: (tab: 'dashboard' | 'shops') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 items-center px-6 z-50">
        <h1 className="text-xl font-bold text-black mr-8">SalesTracker</h1>
        <nav className="flex gap-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-black font-semibold' : 'text-black hover:bg-gray-100'}`}
          >
            Daily Tasks
          </button>
          <button 
            onClick={() => setActiveTab('shops')}
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'shops' ? 'bg-blue-50 text-black font-semibold' : 'text-black hover:bg-gray-100'}`}
          >
            Shops
          </button>
        </nav>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 px-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-1/2 h-full gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-black' : 'text-black opacity-40'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          <span className="text-xs font-medium">Tasks</span>
        </button>
        <button 
          onClick={() => setActiveTab('shops')}
          className={`flex flex-col items-center justify-center w-1/2 h-full gap-1 transition-colors ${activeTab === 'shops' ? 'text-black' : 'text-black opacity-40'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <span className="text-xs font-medium">Shops</span>
        </button>
      </nav>
    </>
  );
};
