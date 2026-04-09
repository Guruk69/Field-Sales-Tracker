import React from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'shops' | 'stats';
  setActiveTab: (tab: 'dashboard' | 'shops' | 'stats') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 items-center px-6 z-50">
        <h1 className="text-xl font-bold text-black mr-8">SalesTracker</h1>

        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'dashboard'
                ? 'bg-black !text-white'
                : 'text-black opacity-60 hover:opacity-100'
            }`}
          >
            Daily Tasks
          </button>

          <button
            onClick={() => setActiveTab('shops')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'shops'
                ? 'bg-black !text-white'
                : 'text-black opacity-60 hover:opacity-100'
            }`}
          >
            Shops
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'stats'
                ? 'bg-black !text-white'
                : 'text-black opacity-60 hover:opacity-100'
            }`}
          >
            Stats
          </button>
        </nav>

        {/* 🔥 Logout Button */}
        <button
          onClick={onLogout}
          className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 px-2">

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-black' : 'opacity-40'}`}
        >
          Tasks
        </button>

        <button
          onClick={() => setActiveTab('shops')}
          className={`flex flex-col items-center ${activeTab === 'shops' ? '!text-black' : 'opacity-40'}`}
        >
          Shops
        </button>

        <button
          onClick={onLogout}
          className="text-red-500 font-bold"
        >
          Logout
        </button>

      </nav>
    </>
  );
};