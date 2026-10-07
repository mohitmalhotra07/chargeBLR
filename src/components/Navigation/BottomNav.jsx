import React from 'react';
import { useApp } from '../../context/AppContext';
import { Map, Zap, Car, Wallet, QrCode } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab, activeSession } = useApp();

  const navItems = [
    {
      id: 'map',
      label: 'Explore',
      icon: Map,
      badge: null
    },
    {
      id: 'charging',
      label: activeSession ? 'Charging' : 'Scan & Charge',
      icon: activeSession ? Zap : QrCode,
      badge: activeSession ? 'ACTIVE' : null,
      isSpecial: Boolean(activeSession)
    },
    {
      id: 'vehicle',
      label: 'My EV',
      icon: Car,
      badge: null
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-navy-950/95 backdrop-blur-2xl border-t border-navy-cardBorder pb-safe pt-1 shadow-2xl">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              {/* Special glowing badge for active charging session */}
              {item.badge && (
                <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-slate-950 shadow-[0_0_8px_#10B981] animate-pulse">
                  {item.badge}
                </span>
              )}

              <div className={`p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400'
                  : item.isSpecial
                  ? 'bg-slate-800 text-brand-300'
                  : ''
              }`}>
                <Icon className={`w-5 h-5 ${item.isSpecial && activeSession ? 'animate-bounce text-emerald-400' : ''}`} />
              </div>

              <span className="text-[11px] mt-0.5 tracking-tight">
                {item.label}
              </span>

              {/* Active Underline Pill */}
              {isActive && (
                <div className="w-4 h-1 rounded-full bg-brand-400 mt-0.5 shadow-[0_0_6px_#10B981]"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
