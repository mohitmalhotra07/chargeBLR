// ChargeBLR Mobile Bottom Navigation Bar
const React = window.React;
const Icons = window.Icons;

window.BottomNav = function BottomNav({ activeTab, setActiveTab, activeSession, vehicleType }) {
  const tabs = [
    {
      id: 'map',
      label: 'Explore',
      icon: (active) => <Icons.MapPin className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
    },
    {
      id: 'vehicle',
      label: 'My EV',
      icon: (active) => (
        vehicleType === '2W' 
          ? <Icons.TwoWheeler className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
          : <Icons.FourWheeler className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
      )
    },
    {
      id: 'charge',
      label: activeSession ? 'Charging' : 'Scan & Charge',
      isCenter: true,
      icon: (active) => (
        <div className={`relative p-2.5 rounded-full transition-transform active:scale-90 ${
          activeSession 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20' 
            : active 
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' 
              : 'bg-slate-800 text-emerald-400 border border-slate-700'
        }`}>
          <Icons.Zap className="w-5 h-5 fill-current" />
          {activeSession && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></span>
          )}
        </div>
      )
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: (active) => <Icons.Wallet className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
    }
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full glass-nav px-3 py-2 flex items-center justify-around border-t border-slate-800/80">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        if (tab.isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center -mt-5 focus:outline-none"
            >
              {tab.icon(isActive)}
              <span className={`text-[10px] font-semibold mt-1 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition duration-150 ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon(isActive)}
            <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
