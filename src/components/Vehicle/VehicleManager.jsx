import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRESET_VEHICLES } from '../../data/vehiclesData';
import { 
  Bike, Car, Plus, Trash2, BatteryCharging, Zap, Clock, 
  IndianRupee, CheckCircle2, ChevronRight, X, AlertCircle, Sparkles 
} from 'lucide-react';

export default function VehicleManager() {
  const {
    vehicles,
    activeVehicleId,
    setActiveVehicleId,
    activeVehicle,
    updateVehicleBattery,
    addVehicle,
    deleteVehicle,
    stations,
    selectedStationId,
    setSelectedStationId,
    selectedStation,
    showToast
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetPercent, setTargetPercent] = useState(80); // 80% or 100%

  // New vehicle form state
  const [formType, setFormType] = useState('4-wheeler');
  const [formBrand, setFormBrand] = useState('Tata');
  const [formModel, setFormModel] = useState('Nexon EV');
  const [formCapacity, setFormCapacity] = useState('40.5');
  const [formRegNo, setFormRegNo] = useState('KA 01 EV 2026');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Handle Preset Selection in Add Modal
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setFormType(preset.type);
    setFormBrand(preset.brand);
    setFormModel(preset.model);
    setFormCapacity(preset.batteryCapacityKwh.toString());
  };

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    if (!formBrand.trim() || !formModel.trim() || !formCapacity) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const capacityNum = parseFloat(formCapacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      showToast('Invalid battery size', 'error');
      return;
    }

    addVehicle({
      type: formType,
      brand: formBrand.trim(),
      model: formModel.trim(),
      registrationNumber: formRegNo.trim() || 'KA 03 EV 9999',
      batteryCapacityKwh: capacityNum,
      currentBatteryPct: 35,
      compatibleConnectors: formType === '2-wheeler' ? ['2-wheeler standard'] : ['CCS2', 'Type 2'],
      maxChargeRateKw: formType === '2-wheeler' ? 3.3 : 50
    });

    setIsAddModalOpen(false);
    // Reset form
    setSelectedPresetId('');
  };

  // Calculations for charging estimate
  const currentPct = activeVehicle?.currentBatteryPct || 30;
  const batteryCap = activeVehicle?.batteryCapacityKwh || 40.5;
  const stationPrice = selectedStation?.pricePerKwh || 18.0;
  const stationSpeed = selectedStation?.chargingSpeed || 50;
  const vehicleMaxRate = activeVehicle?.maxChargeRateKw || 50;

  // Effective charging speed is limited by either station or vehicle
  const effectiveSpeedKw = Math.min(stationSpeed, vehicleMaxRate);

  // Energy needed in kWh
  const pctDelta = Math.max(0, targetPercent - currentPct);
  const kwhNeeded = Math.round(((pctDelta / 100) * batteryCap) * 10) / 10;

  // Approximate time calculation (in minutes)
  // For EV fast charging, 0-80% is constant power, 80-100% slows down by ~40% for cell balancing
  let estimatedMinutes = 0;
  if (kwhNeeded > 0 && effectiveSpeedKw > 0) {
    const rawHours = kwhNeeded / effectiveSpeedKw;
    estimatedMinutes = Math.round(rawHours * 60);
    if (targetPercent === 100 && currentPct < 80) {
      estimatedMinutes = Math.round(estimatedMinutes * 1.25); // Cell tapering factor
    }
  }

  // Cost in Rupees
  const estimatedCost = Math.round(kwhNeeded * stationPrice);

  // Battery gauge color
  const getBatteryColor = (pct) => {
    if (pct < 20) return 'text-rose-400 bg-rose-500';
    if (pct < 50) return 'text-amber-400 bg-amber-500';
    return 'text-emerald-400 bg-emerald-500';
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 p-4 space-y-5 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">My Garage</span>
          <h1 className="text-2xl font-black text-white">Vehicle & Battery</h1>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/40 text-brand-300 font-bold text-xs transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {vehicles.map(veh => {
          const isActive = veh.id === activeVehicleId;
          const is2W = veh.type === '2-wheeler';

          return (
            <div
              key={veh.id}
              onClick={() => setActiveVehicleId(veh.id)}
              className={`flex-shrink-0 min-w-[200px] p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-navy-card border-brand-500 ring-2 ring-brand-500/30 shadow-lg'
                  : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  isActive ? 'bg-brand-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {is2W ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-white truncate">
                    {veh.brand} {veh.model}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {veh.registrationNumber || `${veh.batteryCapacityKwh} kWh`}
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_8px_#10B981]"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Vehicle Card & Interactive Battery Slider */}
      {activeVehicle && (
        <div className="p-5 rounded-3xl bg-navy-card/90 border border-navy-cardBorder shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-brand-400 border border-slate-700">
                  {activeVehicle.type === '2-wheeler' ? 'Two-Wheeler EV' : 'Four-Wheeler EV'}
                </span>
                <span className="text-xs text-slate-400">{activeVehicle.registrationNumber}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {activeVehicle.brand} {activeVehicle.model}
              </h2>
            </div>

            {vehicles.length > 1 && (
              <button
                onClick={() => deleteVehicle(activeVehicle.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="Remove vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Large Battery Status Box */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-brand-400" />
                Current Battery Level
              </span>
              <div className="text-right">
                <span className="text-2xl font-black text-white">{currentPct}%</span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-semibold">
                  ({((currentPct / 100) * batteryCap).toFixed(1)} / {batteryCap} kWh)
                </span>
              </div>
            </div>

            {/* Visual Tank Gauge Bar */}
            <div className="relative w-full h-5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  currentPct < 20 ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_12px_#EF4444]' :
                  currentPct < 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_12px_#F59E0B]' :
                  'bg-gradient-to-r from-emerald-600 to-brand-400 shadow-[0_0_12px_#10B981]'
                }`}
                style={{ width: `${currentPct}%` }}
              />
              {/* 80% sweet spot indicator mark */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10"
                style={{ left: '80%' }}
                title="80% recommended fast-charge limit"
              />
            </div>

            {/* Manual Slider input */}
            <div className="pt-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span>Drag slider to adjust current %:</span>
                <span className="text-brand-300 font-bold">{currentPct}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={currentPct}
                onChange={(e) => updateVehicleBattery(activeVehicle.id, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Empty)</span>
                <span className="text-brand-400">80% Sweetspot</span>
                <span>100% (Full)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charge & Cost Estimation Card */}
      <div className="p-5 rounded-3xl bg-navy-card/90 border border-navy-cardBorder shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Smart Charging Estimate
            </h3>
          </div>
          
          {/* Target Toggle: 80% vs 100% */}
          <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setTargetPercent(80)}
              className={`px-3 py-1 rounded-lg transition-all ${
                targetPercent === 80
                  ? 'bg-brand-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              To 80%
            </button>
            <button
              onClick={() => setTargetPercent(100)}
              className={`px-3 py-1 rounded-lg transition-all ${
                targetPercent === 100
                  ? 'bg-brand-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              To 100%
            </button>
          </div>
        </div>

        {/* Selected Station Benchmark Selector */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Charging at Station</span>
            <span className="text-xs font-bold text-white truncate block">
              {selectedStation?.name || 'Tata Power - Koramangala'}
            </span>
            <span className="text-[11px] text-brand-400">
              ₹{selectedStation?.pricePerKwh.toFixed(2)}/kWh • {selectedStation?.chargingSpeed} kW
            </span>
          </div>

          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 max-w-[130px] truncate"
          >
            {stations.map(st => (
              <option key={st.id} value={st.id}>
                {st.area} (₹{st.pricePerKwh})
              </option>
            ))}
          </select>
        </div>

        {/* Calculated Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Energy to Add */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Energy Needed</span>
            <span className="text-lg font-black text-brand-300 mt-1 block">
              {kwhNeeded} <span className="text-xs font-bold text-slate-400">kWh</span>
            </span>
            <span className="text-[10px] text-slate-500">+{pctDelta}% top-up</span>
          </div>

          {/* Approx Time */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Approx Time</span>
            <span className="text-lg font-black text-amber-300 mt-1 block">
              {estimatedMinutes === 0 ? '0m' : estimatedMinutes >= 60 ? `${Math.floor(estimatedMinutes/60)}h ${estimatedMinutes%60}m` : `${estimatedMinutes}m`}
            </span>
            <span className="text-[10px] text-slate-500">at {effectiveSpeedKw} kW max</span>
          </div>

          {/* Approx Cost in Rupees */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Est. Cost</span>
            <span className="text-lg font-black text-emerald-400 mt-1 block">
              ₹{estimatedCost}
            </span>
            <span className="text-[10px] text-slate-500">at ₹{stationPrice}/unit</span>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 flex items-start gap-2">
          <Zap className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <span>
            {targetPercent === 80 
              ? "Charging to 80% protects long-term battery health and is 2.5x faster than finishing the top 20%." 
              : "Reaching 100% takes extra time for cell balancing before long highway road trips."}
          </span>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-navy-card border border-navy-cardBorder rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-400">Garage Setup</span>
                <h3 className="text-lg font-bold text-white">Add New EV</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Bangalore EV Presets */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                Quick Select Popular Model:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_VEHICLES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPresetId === p.id
                        ? 'bg-brand-500/20 border-brand-500 ring-2 ring-brand-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      {p.type === '2-wheeler' ? <Bike className="w-3.5 h-3.5 text-brand-400" /> : <Car className="w-3.5 h-3.5 text-blue-400" />}
                      <span className="truncate">{p.brand}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.model}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCreateVehicle} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Vehicle Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="2-wheeler">2-Wheeler</option>
                    <option value="4-wheeler">4-Wheeler</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Battery Size (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    placeholder="e.g. 40.5"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Tata / Ather"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Model</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. Nexon EV / 450X"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Vehicle Reg Number</label>
                <input
                  type="text"
                  value={formRegNo}
                  onChange={(e) => setFormRegNo(e.target.value)}
                  placeholder="KA 01 EV 1234"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-500 text-slate-950 text-xs font-black shadow-lg"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
