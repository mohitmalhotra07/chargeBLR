import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ReportModal from '../Common/ReportModal';
import { 
  Zap, Navigation, Clock, ShieldCheck, AlertTriangle, 
  CheckCircle2, X, Share2, Bike, Car, ArrowLeft, 
  MapPin, Sparkles, QrCode, Info, ExternalLink
} from 'lucide-react';

export default function StationDetailModal({ station, isOpen, onClose, onStartCharging }) {
  const { setActiveTab, showToast, activeVehicle } = useApp();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedGunId, setSelectedGunId] = useState(null);

  if (!isOpen || !station) return null;

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: station.name,
        text: `Charge your EV at ${station.name} (${station.speedLabel}) in ${station.area}, Bangalore!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${station.name}, ${station.address}`);
      showToast('Station address copied to clipboard!', 'info');
    }
  };

  const availableGuns = station.guns.filter(g => g.status === 'available');

  const handleStartChargingClick = () => {
    // Choose selected gun or first available gun
    const gunToUse = selectedGunId 
      ? station.guns.find(g => g.id === selectedGunId) 
      : availableGuns[0] || station.guns[0];

    if (station.overallStatus === 'broken') {
      showToast('This station is currently marked as out of order.', 'error');
      return;
    }

    if (onStartCharging) {
      onStartCharging(station, gunToUse);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-lg max-h-[92vh] flex flex-col bg-navy-950 border border-navy-cardBorder rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Top Sticky Header */}
          <div className="relative px-5 pt-4 pb-3 bg-navy-900 border-b border-navy-cardBorder flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                {station.operator}
              </span>
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Last updated {station.lastUpdatedMinutesAgo === 0 ? 'just now' : `${station.lastUpdatedMinutesAgo} min ago`}</span>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Share station"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* Title & Status Banner */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-extrabold text-white leading-snug">
                  {station.name}
                </h2>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-extrabold text-brand-300">{station.distanceKm} km</div>
                  <span className="text-[10px] text-slate-400">from your location</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="truncate">{station.address}</span>
              </div>

              {/* Status Ribbon */}
              <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${
                    station.overallStatus === 'available' ? 'bg-emerald-400 shadow-[0_0_10px_#10B981]' :
                    station.overallStatus === 'busy' ? 'bg-amber-400 shadow-[0_0_10px_#F59E0B]' :
                    'bg-rose-500 shadow-[0_0_10px_#EF4444]'
                  }`}></span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wide block">
                      {station.overallStatus === 'available' ? 'Operational & Available' :
                       station.overallStatus === 'busy' ? 'Station High Demand / Busy' :
                       'Temporarily Out of Order'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {availableGuns.length} of {station.guns.length} charging points ready
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-300">★ {station.rating || 4.7}</span>
                  <span className="text-[10px] text-slate-400 block">({station.totalReviews || 120}+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-navy-card border border-navy-cardBorder text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Price / kWh</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                  ₹{station.pricePerKwh.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">incl. all taxes</span>
              </div>

              <div className="p-3 rounded-2xl bg-navy-card border border-navy-cardBorder text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Peak Speed</span>
                <span className="text-lg font-black text-brand-300 mt-0.5 flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 fill-brand-300/30" />
                  {station.chargingSpeed} kW
                </span>
                <span className="text-[10px] text-slate-500">{station.speedLabel}</span>
              </div>

              <div className="p-3 rounded-2xl bg-navy-card border border-navy-cardBorder text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Timings</span>
                <span className="text-xs font-bold text-white mt-1 block leading-tight">
                  {station.openingHours}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Open Now</span>
              </div>
            </div>

            {/* Live Charger Points / Guns Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-white">Live Charger Points (Guns)</h3>
                </div>
                <span className="text-[11px] text-slate-400">Tap a gun to select</span>
              </div>

              <div className="space-y-2">
                {station.guns.map(gun => {
                  const isSelected = selectedGunId === gun.id;
                  const isAvailable = gun.status === 'available';
                  const isInUse = gun.status === 'in-use';
                  const isBroken = gun.status === 'out-of-order';

                  return (
                    <div
                      key={gun.id}
                      onClick={() => setSelectedGunId(gun.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-500/15 border-brand-500 ring-2 ring-brand-500/30'
                          : 'bg-navy-card/80 border-navy-cardBorder hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isAvailable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          isInUse ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {gun.vehicleType === '2-wheeler' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{gun.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                              {gun.connector}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">Power Output: {gun.speed}</span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="text-right">
                        {isAvailable && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Available
                          </span>
                        )}
                        {isInUse && (
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              In Use
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              ~{gun.inUseRemainingMin || 15}m left
                            </span>
                          </div>
                        )}
                        {isBroken && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            Out of Order
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Available Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {(station.amenities || ['Clean Restrooms', 'Café', '24/7 Security']).map(am => (
                  <span
                    key={am}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Vehicle Compatibility Check */}
            {activeVehicle && (
              <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-300 font-bold">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-brand-400 block">Vehicle Compatibility</span>
                    <span className="text-xs font-bold text-white">
                      Compatible with your {activeVehicle.brand} {activeVehicle.model}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-brand-400">100% Match</span>
              </div>
            )}
          </div>

          {/* Bottom Sticky Action Buttons */}
          <div className="p-4 bg-navy-900/95 border-t border-navy-cardBorder flex items-center gap-2.5">
            {/* Navigate Button */}
            <button
              onClick={handleNavigate}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all shadow-md"
            >
              <Navigation className="w-4 h-4 text-brand-400" />
              <span>Navigate</span>
            </button>

            {/* Report Status Button */}
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all shadow-md"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Report</span>
            </button>

            {/* Start Charging Button */}
            <button
              onClick={handleStartChargingClick}
              className="flex-[1.5] py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-navy-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Start Charging</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Report Modal */}
      <ReportModal
        station={station}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
}
