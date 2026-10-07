import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Map, List, Bike, Car, Filter, X, Check, Zap } from 'lucide-react';

export default function FilterBar() {
  const {
    filterVehicleType,
    setFilterVehicleType,
    filterConnector,
    setFilterConnector,
    filterAvailableOnly,
    setFilterAvailableOnly,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filteredStations
  } = useApp();

  const connectorOptions = [
    { id: 'all', label: 'All Connectors' },
    { id: 'CCS2', label: 'CCS2 (DC Fast)' },
    { id: 'Type 2', label: 'Type 2 (AC)' },
    { id: '2-wheeler standard', label: '2W Standard / 16A' },
    { id: 'Bharat AC', label: 'Bharat AC-001' }
  ];

  const hasActiveFilters = filterVehicleType !== 'all' || filterConnector !== 'all' || filterAvailableOnly || searchQuery !== '';

  const clearFilters = () => {
    setFilterVehicleType('all');
    setFilterConnector('all');
    setFilterAvailableOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full bg-navy-900/90 backdrop-blur-xl border-b border-navy-cardBorder px-3.5 py-2.5 space-y-2.5 z-20">
      {/* Top Search & View Mode Switcher */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Koramangala, Whitefield, Tata EZ..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs md:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Map / List View Toggle */}
        <div className="flex bg-slate-950/80 border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Map view"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-brand-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List view sorted by distance"
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Filter Row 1: Vehicle Type Buttons & Available Switch */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Vehicle Segments */}
        <div className="flex bg-slate-950/60 p-0.5 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilterVehicleType('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterVehicleType === 'all'
                ? 'bg-slate-800 text-brand-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All EVs
          </button>
          <button
            onClick={() => setFilterVehicleType('2-wheeler')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              filterVehicleType === '2-wheeler'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>2-Wheeler</span>
          </button>
          <button
            onClick={() => setFilterVehicleType('4-wheeler')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              filterVehicleType === '4-wheeler'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>4-Wheeler</span>
          </button>
        </div>

        {/* Available Now Toggle Pill */}
        <button
          onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            filterAvailableOnly
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filterAvailableOnly ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-slate-600'}`}></span>
          <span>Available Now</span>
        </button>
      </div>

      {/* Filter Row 2: Connector Dropdown & Status Counter */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Connector scrollable chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {connectorOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterConnector(opt.id)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all ${
                filterConnector === opt.id
                  ? 'bg-brand-500 text-navy-950 border-brand-400 font-bold'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Active Filters Clear / Count */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex-shrink-0 flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-medium px-2 py-0.5"
          >
            <span>Reset</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Quick info counter */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
        <span>Found <strong className="text-brand-400">{filteredStations.length}</strong> stations near you</span>
        <span className="text-slate-500">Sorted by distance</span>
      </div>
    </div>
  );
}
