import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Wallet, Bike, Car, Smartphone, Monitor } from 'lucide-react';

export default function Navbar({ isMobileFrame, setIsMobileFrame }) {
  const { activeVehicle, walletBalance, setActiveTab, activeTab, activeSession } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-navy-950/90 backdrop-blur-xl border-b border-navy-cardBorder px-4 py-2.5 transition-all">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('map')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_#10B981] group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white group-hover:text-brand-300 transition-colors">
                Charge<span className="text-brand-400">BLR</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Bengaluru
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">2W & 4W EV Network</span>
          </div>
        </div>

        {/* Right Badges: Active EV & Wallet */}
        <div className="flex items-center gap-2">
          
          {/* Active Vehicle Peek Pill */}
          {activeVehicle && (
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                activeTab === 'vehicle'
                  ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title="Switch or view vehicle"
            >
              {activeVehicle.type === '2-wheeler' ? (
                <Bike className="w-3.5 h-3.5 text-brand-400" />
              ) : (
                <Car className="w-3.5 h-3.5 text-brand-400" />
              )}
              <span className="text-slate-200">{activeVehicle.currentBatteryPct}%</span>
            </button>
          )}

          {/* Wallet Balance Pill */}
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'wallet'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-emerald-400 hover:border-emerald-500/40'
            }`}
            title="ChargeBLR Wallet"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>₹{Math.round(walletBalance)}</span>
          </button>

          {/* Desktop Preview Frame Switcher (Only visible on larger screens) */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden md:flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title={isMobileFrame ? "Expand to Full Width" : "Switch to Mobile Device Frame"}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
