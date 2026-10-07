// ChargeBLR Station Details Modal Sheet
const { useState } = window.React;
const Icons = window.Icons;

window.StationDetailModal = function StationDetailModal({
  station,
  onClose,
  onStartCharge,
  onOpenReport
}) {
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!station) return null;

  const isAvailable = station.overallStatus === 'available';
  const isBusy = station.overallStatus === 'busy';

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(station.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] glass-card rounded-t-3xl sm:rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-900 flex flex-col overflow-hidden text-left animate-in slide-in-from-bottom-6">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex-1 pr-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {station.operator}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isAvailable
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isBusy
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {isAvailable ? '🟢 Available' : isBusy ? '🟠 Busy' : '🔴 Out of Order'}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-lg text-white mt-1.5 leading-snug">
              {station.name}
            </h2>

            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
              <span>{station.area}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{station.distanceKm} km away</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-300">
                <Icons.Star className="w-3.5 h-3.5 text-amber-400 inline" />
                <span>{station.rating} ({station.reviewsCount})</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Key Specs Card */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-medium">Tariff</div>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">₹{station.pricePerKwh.toFixed(2)}</div>
              <div className="text-[9px] text-slate-400">per kWh (+GST)</div>
            </div>

            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-medium">Max Output</div>
              <div className="text-base font-extrabold text-cyan-400 mt-0.5">{station.maxPowerKw} kW</div>
              <div className="text-[9px] text-slate-400">High-speed DC</div>
            </div>

            <div className="bg-slate-800/70 p-2.5 rounded-2xl border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 font-medium">Operating Hours</div>
              <div className="text-xs font-bold text-white mt-1">{station.openHours}</div>
              <div className="text-[9px] text-emerald-400 mt-0.5">Open Now</div>
            </div>
          </div>

          {/* Full Address & Copy */}
          <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 flex items-start justify-between">
            <div className="flex-1 pr-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address & Location</div>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{station.address}</p>
            </div>
            <button
              onClick={handleCopyAddress}
              className="px-2.5 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold shrink-0 transition active:scale-95"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Amenities */}
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">Amenities on Site</div>
            <div className="flex flex-wrap gap-1.5">
              {station.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700 text-[11px] font-medium"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Live Charger Points / Bays Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
                  Live Charger Points & Bays
                </span>
                <span className="text-[10px] text-slate-400 ml-2">
                  ({station.bays.filter(b => b.status === 'available').length} of {station.bays.length} available)
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Updated {station.lastUpdatedMinutes} mins ago</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {station.bays.map((bay) => {
                const bayAvailable = bay.status === 'available';
                const bayInUse = bay.status === 'in_use';

                return (
                  <div
                    key={bay.id}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between transition ${
                      bayAvailable
                        ? 'bg-slate-800/60 border-slate-700/70 hover:border-emerald-500/40'
                        : bayInUse
                          ? 'bg-slate-800/30 border-amber-900/40'
                          : 'bg-rose-950/20 border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        bayAvailable
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : bayInUse
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        <Icons.Plug className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs">{bay.id}</span>
                          <span className="text-[11px] text-slate-400 font-medium">• {bay.connector}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Output: <span className="text-cyan-400 font-semibold">{bay.powerKw} kW</span>
                          {bay.currentOccupant && (
                            <span className="ml-1 text-slate-400 italic">({bay.currentOccupant})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bayAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : bayInUse
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {bayAvailable ? 'Available' : bayInUse ? 'In Use' : 'Out of Order'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Drawer Simulation */}
          {showNavDrawer && (
            <div className="p-3 bg-slate-800/90 rounded-2xl border border-cyan-500/40 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                  <Icons.Navigation className="w-4 h-4" />
                  <span>Route Directions to {station.name}</span>
                </div>
                <button onClick={() => setShowNavDrawer(false)} className="text-slate-400 hover:text-white">
                  <Icons.X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl">
                  <span>Estimated Driving Time:</span>
                  <span className="text-emerald-400 font-bold">~{Math.round(station.distanceKm * 3.5)} mins (Moderate traffic)</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl">
                  <span>Fastest Route:</span>
                  <span className="text-slate-200 font-medium">Via Inner Ring Road & Hosur Rd</span>
                </div>
              </div>

              <button
                onClick={handleGoogleMaps}
                className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <span>Open in Google Maps App</span>
                <Icons.Navigation className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar (Navigate, Report status, Start charging) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/95 flex items-center space-x-2">
          {/* Navigate Button */}
          <button
            onClick={() => setShowNavDrawer(!showNavDrawer)}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <Icons.Navigation className="w-4 h-4 text-cyan-400" />
            <span>Navigate</span>
          </button>

          {/* Report Status Button */}
          <button
            onClick={() => onOpenReport(station)}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <Icons.Flag className="w-4 h-4 text-amber-400" />
            <span>Report Status</span>
          </button>

          {/* Start Charging Button */}
          <button
            onClick={() => onStartCharge(station)}
            disabled={station.overallStatus === 'broken'}
            className={`flex-1 py-3 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition active:scale-95 ${
              station.overallStatus === 'broken'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
            }`}
          >
            <Icons.Zap className="w-4 h-4 fill-current" />
            <span>Start Charging</span>
          </button>
        </div>

      </div>
    </div>
  );
};
