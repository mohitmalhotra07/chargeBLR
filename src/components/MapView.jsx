// ChargeBLR Interactive Leaflet Map & Filters View
const { useState, useEffect, useRef } = window.React;
const Icons = window.Icons;

window.MapView = function MapView({
  stations,
  selectedStation,
  setSelectedStation,
  onOpenDetails,
  onStartCharge,
  filters,
  setFilters,
  viewMode,
  setViewMode
}) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filter stations based on criteria
  const filteredStations = stations.filter((station) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = station.name.toLowerCase().includes(q);
      const matchArea = station.area.toLowerCase().includes(q);
      const matchOperator = station.operator.toLowerCase().includes(q);
      if (!matchName && !matchArea && !matchOperator) return false;
    }

    // Vehicle type filter
    if (filters.vehicleType !== 'ALL') {
      if (!station.vehicleTypes.includes(filters.vehicleType)) {
        return false;
      }
    }

    // Connector type filter
    if (filters.connectorType !== 'ALL') {
      const hasConnector = station.connectors.some(c => c.type === filters.connectorType);
      if (!hasConnector) return false;
    }

    // Available now toggle
    if (filters.availableNow) {
      if (station.overallStatus !== 'available') {
        return false;
      }
    }

    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    if (window.L) {
      // Bangalore center coordinates (near Koramangala / MG Road)
      const map = window.L.map(mapRef.current, {
        center: [12.9450, 77.6350],
        zoom: 12,
        zoomControl: false
      });

      // Dark style tile layer from OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
        className: 'dark-map-tiles'
      }).addTo(map);

      // Add Zoom control at top-right
      window.L.control.zoom({ position: 'topright' }).addTo(map);

      // Add User's Live Mock Location Marker (Koramangala 5th Block)
      const userIcon = window.L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-cyan-400/30 animate-ping absolute"></div>
            <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-md relative z-10"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      window.L.marker([12.9352, 77.6200], { icon: userIcon, zIndexOffset: 2000 })
        .addTo(map)
        .bindPopup("<div class='text-xs font-semibold text-slate-900'>📍 Your Location (Koramangala)</div>");

      leafletMap.current = map;
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update Markers when filtered stations change
  useEffect(() => {
    if (!leafletMap.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredStations.forEach((station) => {
      const isAvailable = station.overallStatus === 'available';
      const isBusy = station.overallStatus === 'busy';
      const statusClass = isAvailable ? 'pin-available' : isBusy ? 'pin-busy' : 'pin-broken';
      const statusIcon = isAvailable ? '⚡' : isBusy ? '⏳' : '✕';

      const customIcon = window.L.divIcon({
        className: 'custom-pin-wrapper',
        html: `
          <div class="custom-pin">
            <div class="pin-bubble ${statusClass} text-slate-950 px-2 py-1 text-[11px] font-bold shadow-xl flex items-center space-x-1">
              <span>${statusIcon}</span>
              <span>${station.maxPowerKw}kW</span>
            </div>
          </div>
        `,
        iconSize: [58, 32],
        iconAnchor: [29, 32]
      });

      const marker = window.L.marker([station.lat, station.lng], { icon: customIcon })
        .addTo(leafletMap.current)
        .on('click', () => {
          setSelectedStation(station);
          leafletMap.current.flyTo([station.lat, station.lng], 14, { duration: 0.6 });
        });

      markersRef.current.push(marker);
    });
  }, [filteredStations, setSelectedStation]);

  // Center map on user location
  const handleLocateMe = () => {
    if (leafletMap.current) {
      leafletMap.current.flyTo([12.9352, 77.6200], 14, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-125px)] sm:h-[calc(900px-130px)] flex flex-col overflow-hidden bg-slate-950">
      {/* Floating Top Controls (Search, Vehicle Filter, Available Now, List Toggle) */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col space-y-2 pointer-events-none">
        {/* Search bar & View Toggle */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="flex-1 relative flex items-center glass-panel rounded-2xl shadow-xl border border-slate-700/60 overflow-hidden px-3 py-2 bg-slate-900/90">
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
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="glass-panel p-2.5 rounded-2xl border border-slate-700/70 bg-slate-900/90 text-emerald-400 hover:text-white shadow-xl transition active:scale-95 flex items-center justify-center shrink-0"
            title={viewMode === 'map' ? 'Switch to List' : 'Switch to Map'}
          >
            {viewMode === 'map' ? <Icons.List className="w-5 h-5" /> : <Icons.Map className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick Filter Chips (Vehicle Type, Connector, Available Now) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pointer-events-auto text-xs">
          {/* Vehicle Type Buttons */}
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-lg shrink-0">
            <button
              onClick={() => setFilters({ ...filters, vehicleType: 'ALL' })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filters.vehicleType === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All EV
            </button>
            <button
              onClick={() => setFilters({ ...filters, vehicleType: '2W' })}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filters.vehicleType === '2W'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icons.TwoWheeler className="w-3.5 h-3.5" />
              <span>2W</span>
            </button>
            <button
              onClick={() => setFilters({ ...filters, vehicleType: '4W' })}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filters.vehicleType === '4W'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icons.FourWheeler className="w-3.5 h-3.5" />
              <span>4W</span>
            </button>
          </div>

          {/* Available Now Toggle Pill */}
          <button
            onClick={() => setFilters({ ...filters, availableNow: !filters.availableNow })}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border shadow-lg shrink-0 transition ${
              filters.availableNow
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${filters.availableNow ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>Available Now</span>
          </button>

          {/* Connector Filter Pill */}
          <select
            value={filters.connectorType}
            onChange={(e) => setFilters({ ...filters, connectorType: e.target.value })}
            className="bg-slate-900/90 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl shadow-lg focus:outline-none shrink-0"
          >
            <option value="ALL">All Connectors</option>
            <option value="CCS2">CCS2 (DC Fast)</option>
            <option value="Type 2">Type 2 (AC)</option>
            <option value="Bharat AC">Bharat AC</option>
            <option value="2-wheeler standard">2W Standard (16A/Ather)</option>
          </select>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapRef} className="w-full h-full z-10" />

      {/* Locate Me Floating Action Button */}
      <button
        onClick={handleLocateMe}
        className="absolute bottom-40 right-3 z-30 p-3 rounded-2xl glass-panel border border-slate-700/80 bg-slate-900/90 text-cyan-400 hover:text-white shadow-2xl transition active:scale-90"
        title="Center on my location"
      >
        <Icons.Navigation className="w-5 h-5 fill-current" />
      </button>

      {/* Map Legend */}
      <div className="absolute top-28 right-3 z-20 glass-panel px-2.5 py-1.5 rounded-xl border border-slate-800 text-[10px] space-y-1 shadow-lg bg-slate-950/85">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-slate-300">Busy</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Offline</span>
        </div>
      </div>

      {/* Bottom Sheet Card for Selected Station */}
      {selectedStation && (
        <div className="absolute bottom-2 left-2 right-2 z-30 glass-card p-3.5 rounded-3xl border border-slate-700/90 shadow-2xl bg-slate-900/95 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  selectedStation.overallStatus === 'available'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : selectedStation.overallStatus === 'busy'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {selectedStation.overallStatus === 'available' ? 'Available' : selectedStation.overallStatus === 'busy' ? 'Busy' : 'Out of Order'}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                  <Icons.Star className="w-3 h-3 text-amber-400 inline" />
                  <span>{selectedStation.rating}</span>
                  <span>({selectedStation.reviewsCount})</span>
                </span>
              </div>

              <h3 className="font-heading font-bold text-sm text-white mt-1 leading-snug truncate">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {selectedStation.area} • {selectedStation.distanceKm} km away
              </p>
            </div>

            <button
              onClick={() => setSelectedStation(null)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Specs (Speed, Price, Plugs) */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-center">
            <div className="bg-slate-800/50 rounded-xl p-1.5 border border-slate-700/40">
              <div className="text-[10px] text-slate-400">Max Speed</div>
              <div className="text-xs font-bold text-emerald-400">{selectedStation.maxPowerKw} kW</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-1.5 border border-slate-700/40">
              <div className="text-[10px] text-slate-400">Tariff</div>
              <div className="text-xs font-bold text-white">₹{selectedStation.pricePerKwh}/u</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-1.5 border border-slate-700/40">
              <div className="text-[10px] text-slate-400">Bays</div>
              <div className="text-xs font-bold text-cyan-400">
                {selectedStation.bays.filter(b => b.status === 'available').length}/{selectedStation.bays.length} Free
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => onOpenDetails(selectedStation)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition active:scale-95 text-center"
            >
              View Details
            </button>

            <button
              onClick={() => onStartCharge(selectedStation)}
              disabled={selectedStation.overallStatus === 'broken'}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition active:scale-95 ${
                selectedStation.overallStatus === 'broken'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25'
              }`}
            >
              <Icons.Zap className="w-3.5 h-3.5 fill-current" />
              <span>Charge Here</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
