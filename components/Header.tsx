
import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'list', label: 'Participants', icon: 'fa-users' },
    { id: 'raffle', label: 'Lucky Draw', icon: 'fa-gift' },
    { id: 'grouping', label: 'Team Grouping', icon: 'fa-layer-group' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fa-solid fa-briefcase text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:inline">
            HR Pro <span className="text-indigo-600">Toolbox</span>
          </span>
        </div>

        <nav className="flex gap-1 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as Tab)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
