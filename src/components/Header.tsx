import React from 'react';
import { Radar, MapPin, Navigation as NavIcon } from 'lucide-react';
import type { UserLocation, NavigationTab } from '../types';
import { SOSButton } from './SOSButton';

interface HeaderProps {
  location: UserLocation;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onSOSActivated: () => void;
}

export const Header: React.FC<HeaderProps> = ({ location, activeTab, onTabChange, onSOSActivated }) => {
  const isDetected = location.status === 'detected';
  const isManual = location.status === 'manual';

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'map', label: 'Intelligence' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'report', label: 'Report' },
    { id: 'feed', label: 'Community' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onTabChange('dashboard')}
          className="flex min-w-0 items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 group-hover:border-blue-400/50 transition-colors">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2 truncate">
              LifeLink
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-semibold">
                PLATFORM
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Emergency & Intelligence Platform
            </p>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="order-3 flex w-full sm:order-none sm:w-auto max-w-full sm:max-w-none shrink-0 items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* System Online Status & Region */}
        <div className="hidden lg:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-emerald-400 font-semibold">System Online</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-300 font-mono flex items-center gap-1">
              {isDetected && location.state ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">{location.state}</span>
                </>
              ) : isManual && location.state ? (
                <>
                  <NavIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold text-blue-300">{location.state}</span>
                </>
              ) : (
                <span className="text-slate-400">Region: India</span>
              )}
            </span>
          </div>
        </div>
        <SOSButton onActivated={onSOSActivated} compact />

      </div>
    </header>
  );
};
