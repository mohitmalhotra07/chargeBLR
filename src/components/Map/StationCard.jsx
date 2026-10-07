import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Navigation, Clock, ShieldCheck, AlertCircle, ChevronRight, CheckCircle2, Bike, Car } from 'lucide-react';

export default function StationCard({ station, onOpenDetails, compact = false }) {
  const { setSelectedStationId, setActiveTab } = useApp();

  const getStatusBadge = () => {
    if (station.overallStatus === 'available') {
      const freeGuns = station.guns.filter(g => g.status === 'available').length;
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{freeGuns} of {station.guns.length} Guns Free</span>
        </span>
      );
    }
    if (station.overallStatus === 'busy') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Busy • High Demand</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
        <span>Not Working</span>
      </span>
    );
  };

  const handleCardClick = () => {
    setSelectedStationId(station.id);
    if (onOpenDetails) {
      onOpenDetails(station);
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-navy-card/90 hover:bg-navy-light/80 border border-navy-cardBorder hover:border-brand-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
        compact ? 'shadow-2xl' : ''
      }`}
    >
      {/* Top Header: Name, Distance & Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
              {station.operator}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {station.lastUpdatedMinutesAgo === 0 ? 'Just now' : `${station.lastUpdatedMinutesAgo}m ago`}
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors truncate">
            {station.name}
          </h3>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            📍 {station.area} • {station.address}
          </p>
        </div>

        {/* Distance Badge */}
        <div className="flex flex-col items-end flex-shrink-0">
          <div className="text-right">
            <span className="text-base font-extrabold text-brand-300">{station.distanceKm}</span>
            <span className="text-xs text-slate-400 ml-0.5">km</span>
          </div>
          <div className="mt-1">{getStatusBadge()}</div>
        </div>
      </div>

      {/* Speed, Price and Vehicle Types Row */}
      <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Speed</span>
          <span className="text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-brand-400 fill-brand-400/30" />
            {station.chargingSpeed} kW
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Price / Unit</span>
          <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">
            ₹{station.pricePerKwh.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Supports</span>
          <div className="flex items-center gap-1.5 mt-1 text-slate-300">
            {station.vehicleTypes.includes('2-wheeler') && (
              <span title="2-Wheelers Supported" className="p-1 rounded bg-slate-800 text-brand-300">
                <Bike className="w-3.5 h-3.5" />
              </span>
            )}
            {station.vehicleTypes.includes('4-wheeler') && (
              <span title="4-Wheelers Supported" className="p-1 rounded bg-slate-800 text-brand-300">
                <Car className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Connectors Chips & Action Button Row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 flex-wrap overflow-hidden max-h-7">
          {station.connectorTypes.map(c => (
            <span
              key={c}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleNavigate}
            title="Navigate via Google Maps"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-white border border-slate-700 active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleCardClick}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs active:scale-95 transition-all shadow-md"
          >
            <span>View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
