// ChargeBLR Top Navigation Bar
const React = window.React;
const Icons = window.Icons;

window.Navbar = function Navbar({ activeTab, setActiveTab, walletBalance, activeSession }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
      <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('map')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Icons.Zap className="w-5 h-5 text-slate-950 fill-current" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              ChargeBLR
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Demo
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Bengaluru Central</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {activeSession && (
          <button
            onClick={() => setActiveTab('charge')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold animate-pulse"
          >
            <Icons.Zap className="w-3.5 h-3.5 fill-current" />
            <span>{Math.round(activeSession.batteryPercent)}%</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('wallet')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-semibold transition active:scale-95"
        >
          <Icons.Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span>₹{walletBalance.toFixed(0)}</span>
        </button>
      </div>
    </header>
  );
};
