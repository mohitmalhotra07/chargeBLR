// ChargeBLR Station List View (Sorted by Distance)
const { useState } = window.React;
const Icons = window.Icons;

window.StationList = function StationList({
  stations,
  onSelectStation,
  onOpenDetails,
  onStartCharge,
  filters,
  setFilters,
  viewMode,
  setViewMode
}) {
  const [sortBy, setSortBy] = useState("distance"); // 'distance', 'price', 'power', 'rating'
  const [searchQuery, setSearchQuery] = useState("");

  // Filter
  const filtered = stations.filter((station) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = station.name.toLowerCase().includes(q);
      const matchArea = station.area.toLowerCase().includes(q);
      const matchOperator = station.operator.toLowerCase().includes(q);
      if (!matchName && !matchArea && !matchOperator) return false;
    }

    if (filters.vehicleType !== 'ALL') {
      if (!station.vehicleTypes.includes(filters.vehicleType)) return false;
    }

    if (filters.connectorType !== 'ALL') {
      const hasConnector = station.connectors.some(c => c.type === filters.connectorType);
      if (!hasConnector) return false;
    }

    if (filters.availableNow) {
      if (station.overallStatus !== 'available') return false;
    }

    return true;
  });

  // Sort
  const sortedStations = [...filtered].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price') return a.pricePerKwh - b.pricePerKwh;
    if (sortBy === 'power') return b.maxPowerKw - a.maxPowerKw;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-4 py-3 bg-slate-950 pb-24">
      {/* Top Search & Filter Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md pt-1 pb-3 space-y-2 border-b border-slate-900">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative flex items-center glass-panel rounded-2xl border border-slate-700/60 overflow-hidden px-3 py-2 bg-slate-900/90">
            <Icons.Search className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search area (Koramangala, Indiranagar...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white p-1">
                <Icons.X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setViewMode('map')}
            className="glass-panel p-2.5 rounded-2xl border border-slate-700/70 bg-slate-900/90 text-emerald-400 hover:text-white shadow-xl transition active:scale-95 flex items-center justify-center shrink-0"
            title="Switch to Map"
          >
            <Icons.Map className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setFilters({ ...filters, vehicleType: 'ALL' })}
              className={`px-2.5 py-1 rounded-lg transition ${filters.vehicleType === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilters({ ...filters, vehicleType: '2W' })}
              className={`px-2.5 py-1 rounded-lg transition ${filters.vehicleType === '2W' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              2W
            </button>
            <button
              onClick={() => setFilters({ ...filters, vehicleType: '4W' })}
              className={`px-2.5 py-1 rounded-lg transition ${filters.vehicleType === '4W' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              4W
            </button>
          </div>

          <button
            onClick={() => setFilters({ ...filters, availableNow: !filters.availableNow })}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition ${
              filters.availableNow
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Available Now
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2.5 py-1.5 rounded-xl shrink-0 focus:outline-none"
          >
            <option value="distance">📍 Distance (Nearest)</option>
            <option value="price">💰 Price (Lowest)</option>
            <option value="power">⚡ Speed (Highest kW)</option>
            <option value="rating">⭐ Rating</option>
          </select>
        </div>
      </div>

      {/* Station List Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 py-2">
        <span>Found {sortedStations.length} EV charging stations</span>
        <span>Sorted by {sortBy}</span>
      </div>

      {/* List Cards */}
      <div className="space-y-3">
        {sortedStations.map((station) => {
          const availableBays = station.bays.filter(b => b.status === 'available').length;
          const totalBays = station.bays.length;
          const isAvailable = station.overallStatus === 'available';
          const isBusy = station.overallStatus === 'busy';

          return (
            <div
              key={station.id}
              className="glass-card p-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 transition duration-150 active:bg-slate-900/60"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
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
                      {isAvailable ? `${availableBays}/${totalBays} Available` : isBusy ? 'Busy' : 'Out of Order'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-white mt-1.5 leading-snug">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {station.area} • {station.distanceKm} km
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-400">₹{station.pricePerKwh.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400">per kWh</div>
                  <div className="mt-1 flex items-center justify-end space-x-1 text-xs text-slate-300">
                    <Icons.Star className="w-3 h-3 text-amber-400" />
                    <span>{station.rating}</span>
                  </div>
                </div>
              </div>

              {/* Connectors & Speed */}
              <div className="flex items-center flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  ⚡ {station.maxPowerKw} kW Max
                </span>
                {station.connectors.map((c, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {c.type} ({c.powerKw}kW)
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-3 pt-1">
                <button
                  onClick={() => onOpenDetails(station)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition active:scale-95 text-center"
                >
                  View Details
                </button>

                <button
                  onClick={() => onStartCharge(station)}
                  disabled={station.overallStatus === 'broken'}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition active:scale-95 ${
                    station.overallStatus === 'broken'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <Icons.Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Start Charge</span>
                </button>
              </div>
            </div>
          );
        })}

        {sortedStations.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800">
            <Icons.AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">No stations match your filters</div>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try removing the "Available Now" filter or choosing "All Connectors".
            </p>
            <button
              onClick={() => {
                setFilters({ vehicleType: 'ALL', connectorType: 'ALL', availableNow: false });
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
