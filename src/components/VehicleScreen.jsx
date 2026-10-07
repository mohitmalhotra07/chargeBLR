// ChargeBLR "My Vehicle" & Smart Range/Charging Estimator Screen
const { useState } = window.React;
const Icons = window.Icons;

window.VehicleScreen = function VehicleScreen({
  vehicles,
  currentVehicle,
  setCurrentVehicle,
  onAddVehicle,
  batteryPercent,
  setBatteryPercent,
  stations,
  selectedStation,
  setSelectedStation,
  onNavigateToCharge
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetPercent, setTargetPercent] = useState(80); // 80 or 100
  const [newVehType, setNewVehType] = useState("2W");
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehModel, setNewVehModel] = useState("");
  const [newVehBatteryKwh, setNewVehBatteryKwh] = useState(3.7);
  const [newVehReg, setNewVehReg] = useState("");

  const activeStation = selectedStation || stations[0];

  // Calculations for current vehicle
  const currentKwh = (batteryPercent / 100) * currentVehicle.batteryKwh;

  // Calculate needed to reach target%
  const calculateEstimate = (target) => {
    if (batteryPercent >= target) {
      return { kwhNeeded: 0, timeMinutes: 0, costRupees: 0, rangeAddedKm: 0 };
    }

    const kwhNeeded = ((target - batteryPercent) / 100) * currentVehicle.batteryKwh;
    
    // Effective charging speed in kW
    const stationSpeedKw = activeStation ? activeStation.maxPowerKw : 50;
    const vehicleMaxKw = currentVehicle.maxChargeRateKw || 50;
    let effectiveSpeedKw = Math.min(stationSpeedKw, vehicleMaxKw);

    // Apply EV taper curve: fast charging slows down above 80%
    let timeMinutes = 0;
    if (target <= 80) {
      // 0 to 80% speed
      timeMinutes = (kwhNeeded / effectiveSpeedKw) * 60 * 1.15; // 1.15 buffer for thermal losses
    } else {
      const kwhTo80 = Math.max(0, ((80 - batteryPercent) / 100) * currentVehicle.batteryKwh);
      const kwh80To100 = ((target - Math.max(batteryPercent, 80)) / 100) * currentVehicle.batteryKwh;
      const timeTo80 = (kwhTo80 / effectiveSpeedKw) * 60 * 1.15;
      const time80To100 = (kwh80To100 / (effectiveSpeedKw * 0.45)) * 60; // slows by 55%
      timeMinutes = timeTo80 + time80To100;
    }

    const costRupees = kwhNeeded * (activeStation ? activeStation.pricePerKwh : 18.5);
    const rangeAddedKm = kwhNeeded * (currentVehicle.efficiencyKmPerKwh || 7.0);

    return {
      kwhNeeded: kwhNeeded.toFixed(2),
      timeMinutes: Math.max(2, Math.round(timeMinutes)),
      costRupees: Math.round(costRupees),
      rangeAddedKm: Math.round(rangeAddedKm)
    };
  };

  const est80 = calculateEstimate(80);
  const est100 = calculateEstimate(100);
  const currentEstimate = targetPercent === 80 ? est80 : est100;

  // Handle Quick Add from Catalog
  const handleCatalogSelect = (item) => {
    setNewVehType(item.type);
    setNewVehBrand(item.brand);
    setNewVehModel(item.model);
    setNewVehBatteryKwh(item.batteryKwh);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!newVehBrand || !newVehModel || !newVehBatteryKwh) return;

    const newVehicle = {
      id: "veh-" + Date.now(),
      type: newVehType,
      brand: newVehBrand,
      model: newVehModel,
      batteryKwh: parseFloat(newVehBatteryKwh),
      compatibleConnectors: newVehType === '2W' ? ["2-wheeler standard", "Bharat AC"] : ["CCS2", "Type 2"],
      maxChargeRateKw: newVehType === '2W' ? 22 : 60,
      efficiencyKmPerKwh: newVehType === '2W' ? 27 : 6.5,
      regNo: newVehReg.toUpperCase() || "KA 01 EV " + Math.floor(1000 + Math.random() * 9000),
      color: newVehType === '2W' ? '#10b981' : '#3b82f6'
    };

    onAddVehicle(newVehicle);
    setCurrentVehicle(newVehicle);
    setShowAddModal(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-4 py-3 bg-slate-950 pb-24 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-900">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-white">My Electric Vehicle</h2>
          <p className="text-xs text-slate-400">Manage vehicle battery & charging estimate</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold transition active:scale-95"
        >
          <Icons.Plus className="w-3.5 h-3.5" />
          <span>Add EV</span>
        </button>
      </div>

      {/* Active Vehicle Card */}
      <div className="mt-3 p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              {currentVehicle.type === '2W' ? (
                <Icons.TwoWheeler className="w-7 h-7" />
              ) : (
                <Icons.FourWheeler className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {currentVehicle.type === '2W' ? 'Two-Wheeler EV' : 'Four-Wheeler EV'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  {currentVehicle.regNo}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-base text-white mt-1">
                {currentVehicle.brand} {currentVehicle.model}
              </h3>
            </div>
          </div>
        </div>

        {/* Vehicle Switcher Pill / Dropdown */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Switch Saved EV:</span>
          <select
            value={currentVehicle.id}
            onChange={(e) => {
              const found = vehicles.find(v => v.id === e.target.value);
              if (found) setCurrentVehicle(found);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl focus:outline-none"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.type})
              </option>
            ))}
          </select>
        </div>

        {/* Battery Specs Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 text-center text-xs">
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
            <span className="text-[10px] text-slate-400">Pack Size</span>
            <div className="font-bold text-white mt-0.5">{currentVehicle.batteryKwh} kWh</div>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
            <span className="text-[10px] text-slate-400">Max In</span>
            <div className="font-bold text-cyan-400 mt-0.5">{currentVehicle.maxChargeRateKw} kW</div>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
            <span className="text-[10px] text-slate-400">Connector</span>
            <div className="font-bold text-emerald-400 mt-0.5 truncate">{currentVehicle.compatibleConnectors[0]}</div>
          </div>
        </div>
      </div>

      {/* Manual Battery Percentage Input & Slider */}
      <div className="mt-4 p-4 rounded-3xl glass-card border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Current Battery Level</span>
            <p className="text-[11px] text-slate-400">Drag slider or tap preset</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black font-heading ${
              batteryPercent < 20 ? 'text-rose-400 text-glow-rose' : batteryPercent < 50 ? 'text-amber-400' : 'text-emerald-400 text-glow-green'
            }`}>
              {batteryPercent}%
            </span>
            <div className="text-[10px] text-slate-400">
              {currentKwh.toFixed(1)} / {currentVehicle.batteryKwh} kWh
            </div>
          </div>
        </div>

        {/* Dynamic Battery Bar Visual */}
        <div className="w-full h-4 bg-slate-850 rounded-full overflow-hidden p-0.5 border border-slate-700 flex items-center">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              batteryPercent < 20
                ? 'bg-rose-500 shadow-lg shadow-rose-500/50'
                : batteryPercent < 50
                  ? 'bg-amber-400 shadow-lg shadow-amber-400/50'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/50'
            }`}
            style={{ width: `${Math.max(4, batteryPercent)}%` }}
          />
        </div>

        {/* Slider control */}
        <input
          type="range"
          min="5"
          max="100"
          value={batteryPercent}
          onChange={(e) => setBatteryPercent(parseInt(e.target.value))}
          className="w-full cursor-pointer accent-emerald-500"
        />

        {/* Quick percentage buttons */}
        <div className="flex items-center justify-between pt-1">
          {[15, 30, 50, 75, 90].map((val) => (
            <button
              key={val}
              onClick={() => setBatteryPercent(val)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition active:scale-95 ${
                batteryPercent === val
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {val}%
            </button>
          ))}
        </div>
      </div>

      {/* Charging Estimator Section */}
      <div className="mt-4 p-4 rounded-3xl glass-card border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Icons.Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Charging Estimator</span>
          </div>

          {/* Station Selection for Cost Estimate */}
          <select
            value={activeStation ? activeStation.id : ""}
            onChange={(e) => {
              const st = stations.find(s => s.id === e.target.value);
              if (st) setSelectedStation(st);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] px-2 py-1 rounded-xl max-w-[150px] truncate focus:outline-none"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.area} (₹{s.pricePerKwh}/u)
              </option>
            ))}
          </select>
        </div>

        {/* Target 80% vs 100% Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTargetPercent(80)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center ${
              targetPercent === 80
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Target 80%</span>
            <span className={`text-[9px] font-normal ${targetPercent === 80 ? 'text-slate-900' : 'text-emerald-400'}`}>
              Recommended (Battery Health)
            </span>
          </button>

          <button
            onClick={() => setTargetPercent(100)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center ${
              targetPercent === 100
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Target 100%</span>
            <span className={`text-[9px] font-normal ${targetPercent === 100 ? 'text-slate-900' : 'text-slate-400'}`}>
              Full Range (Long Drive)
            </span>
          </button>
        </div>

        {/* Estimate Output Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-medium">Energy Needed</span>
            <div className="text-base font-extrabold text-cyan-400 mt-0.5">
              {currentEstimate.kwhNeeded} <span className="text-[10px] text-slate-300">kWh</span>
            </div>
            <span className="text-[9px] text-slate-400">+{currentEstimate.rangeAddedKm} km</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-medium">Est. Duration</span>
            <div className="text-base font-extrabold text-amber-400 mt-0.5">
              ~{currentEstimate.timeMinutes} <span className="text-[10px] text-slate-300">min</span>
            </div>
            <span className="text-[9px] text-slate-400">@{activeStation ? activeStation.maxPowerKw : 60}kW</span>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-medium">Approx Cost</span>
            <div className="text-base font-extrabold text-emerald-400 mt-0.5">
              ₹{currentEstimate.costRupees}
            </div>
            <span className="text-[9px] text-slate-400">@₹{activeStation ? activeStation.pricePerKwh : 18.5}/u</span>
          </div>
        </div>

        {/* Side-by-side Quick Comparison Table */}
        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-[11px] space-y-1.5">
          <div className="text-slate-400 font-semibold uppercase text-[10px]">Charging Target Comparison</div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
            <span className="text-slate-300">To 80% (Fast Charge):</span>
            <span className="text-white font-medium">{est80.kwhNeeded} kWh • ~{est80.timeMinutes} mins • <strong className="text-emerald-400">₹{est80.costRupees}</strong></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">To 100% (Full Top):</span>
            <span className="text-white font-medium">{est100.kwhNeeded} kWh • ~{est100.timeMinutes} mins • <strong className="text-emerald-400">₹{est100.costRupees}</strong></span>
          </div>
        </div>

        {/* Charge Now Action Button */}
        <button
          onClick={() => onNavigateToCharge(activeStation)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
        >
          <Icons.Zap className="w-4 h-4 fill-current" />
          <span>Charge at {activeStation ? activeStation.area : 'Station'} Now</span>
        </button>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-900 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-heading font-bold text-base text-white">Add New Electric Vehicle</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="mt-3 space-y-3 text-xs">
              {/* Vehicle Type Toggle */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Vehicle Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewVehType("2W")}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 border ${
                      newVehType === '2W'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Icons.TwoWheeler className="w-4 h-4" />
                    <span>2-Wheeler (Scooter/Bike)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewVehType("4W")}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 border ${
                      newVehType === '4W'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Icons.FourWheeler className="w-4 h-4" />
                    <span>4-Wheeler (Car/SUV)</span>
                  </button>
                </div>
              </div>

              {/* Quick Pick Popular Models */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Quick Pick Indian Models</label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {window.POPULAR_VEHICLE_CATALOG.filter(v => v.type === newVehType).map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCatalogSelect(cat)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700"
                    >
                      {cat.brand} {cat.model} ({cat.batteryKwh}kWh)
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand and Model */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ather, Tata"
                    value={newVehBrand}
                    onChange={(e) => setNewVehBrand(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 450X, Nexon EV"
                    value={newVehModel}
                    onChange={(e) => setNewVehModel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Battery Size & Reg No */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Battery Size (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="120"
                    required
                    value={newVehBatteryKwh}
                    onChange={(e) => setNewVehBatteryKwh(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Reg No (Optional)</label>
                  <input
                    type="text"
                    placeholder="KA 01 EV 1234"
                    value={newVehReg}
                    onChange={(e) => setNewVehReg(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
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
};
