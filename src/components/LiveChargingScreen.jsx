// ChargeBLR Live EV Charging Screen & Session Summary
const { useState, useEffect } = window.React;
const Icons = window.Icons;

window.LiveChargingScreen = function LiveChargingScreen({
  activeSession,
  onUpdateSession,
  onStopSession,
  walletBalance,
  onFinishPaymentAndShowReceipt
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);

  if (!activeSession) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950 pb-24">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-xl">
          <Icons.Zap className="w-8 h-8" />
        </div>
        <h3 className="font-heading font-bold text-lg text-white">No Active Charging Session</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Find a nearby charger on the map or scan a QR code to begin fast charging your EV.
        </p>
      </div>
    );
  }

  // Live Charging Ticker Simulation
  useEffect(() => {
    if (isPaused || showSummaryModal) return;

    const interval = setInterval(() => {
      onUpdateSession((prev) => {
        if (!prev) return null;
        if (prev.batteryPercent >= 100) return prev;

        const incrementPercent = 0.25;
        const newPercent = Math.min(100, prev.batteryPercent + incrementPercent);
        
        // Calculate kWh delivered this tick
        const vehicleBatteryKwh = prev.vehicle.batteryKwh || 40.5;
        const totalDeliveredKwh = ((newPercent - prev.initialPercent) / 100) * vehicleBatteryKwh;
        
        // Running cost
        const pricePerKwh = prev.station.pricePerKwh || 18.5;
        const runningCost = totalDeliveredKwh * pricePerKwh;

        // Seconds elapsed
        const elapsedSeconds = prev.elapsedSeconds + 1;

        // Time remaining to 80% or 100%
        const targetPercent = newPercent < 80 ? 80 : 100;
        const remainingPercent = Math.max(0, targetPercent - newPercent);
        const remainingMinutes = Math.ceil((remainingPercent / 0.25) / 60 * 2.5);

        return {
          ...prev,
          batteryPercent: newPercent,
          deliveredKwh: totalDeliveredKwh,
          runningCost: runningCost,
          elapsedSeconds: elapsedSeconds,
          timeRemainingMinutes: Math.max(1, remainingMinutes),
          currentSpeedKw: (prev.station.maxPowerKw * (0.92 + Math.random() * 0.08)).toFixed(1),
          voltage: Math.round(398 + Math.random() * 5),
          currentAmps: Math.round(135 + Math.random() * 8)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, showSummaryModal, onUpdateSession]);

  const handleStopCharging = () => {
    // Generate summary data
    const summary = {
      sessionId: "CHG-" + Math.floor(100000 + Math.random() * 900000),
      stationName: activeSession.station.name,
      stationArea: activeSession.station.area,
      operator: activeSession.station.operator,
      bayId: activeSession.bayId,
      vehicle: activeSession.vehicle,
      startPercent: activeSession.initialPercent,
      endPercent: Math.round(activeSession.batteryPercent),
      unitsKwh: parseFloat(activeSession.deliveredKwh.toFixed(2)),
      durationMinutes: Math.max(1, Math.round(activeSession.elapsedSeconds / 60)),
      pricePerKwh: activeSession.station.pricePerKwh,
      baseAmount: parseFloat((activeSession.deliveredKwh * activeSession.station.pricePerKwh).toFixed(2)),
      gstAmount: parseFloat((activeSession.deliveredKwh * activeSession.station.pricePerKwh * 0.18).toFixed(2)),
      totalAmount: Math.round(activeSession.deliveredKwh * activeSession.station.pricePerKwh * 1.18),
      co2SavedKg: (activeSession.deliveredKwh * 0.82).toFixed(1),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setSessionSummary(summary);
    setShowSummaryModal(true);
  };

  const handlePayAndClose = () => {
    if (window.SoundFx) window.SoundFx.playSuccessChime();
    onFinishPaymentAndShowReceipt(sessionSummary);
  };

  // Format mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // SVG circular gauge math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeSession.batteryPercent / 100) * circumference;

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-4 py-3 bg-slate-950 pb-24 text-left">
      {/* Top Station Info Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
              ⚡ Live Fast Charging
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Bay {activeSession.bayId}
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-base text-white mt-1 leading-snug truncate">
            {activeSession.station.name}
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">{formatTime(activeSession.elapsedSeconds)}</span>
          <div className="text-[10px] text-slate-500">Elapsed</div>
        </div>
      </div>

      {/* Hero Circular Battery Gauge */}
      <div className="my-4 flex flex-col items-center justify-center relative">
        {/* Glowing Background Radial */}
        <div className="absolute w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative w-52 h-52 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Track Ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Animated Active Progress Arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#emerald-gradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Info Inside Gauge */}
          <div className="absolute flex flex-col items-center text-center">
            <Icons.Zap className="w-5 h-5 text-emerald-400 fill-current animate-bounce mb-1" />
            <div className="text-4xl font-black font-heading tracking-tight text-white text-glow-green">
              {Math.round(activeSession.batteryPercent)}%
            </div>
            <div className="text-[11px] text-cyan-300 font-semibold mt-0.5">
              ~{activeSession.timeRemainingMinutes} mins left
            </div>
            <div className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
              To {activeSession.batteryPercent < 80 ? '80%' : '100%'}
            </div>
          </div>
        </div>

        {/* Vehicle Badge */}
        <div className="mt-2 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-md">
          {activeSession.vehicle.type === '2W' ? (
            <Icons.TwoWheeler className="w-4 h-4 text-emerald-400" />
          ) : (
            <Icons.FourWheeler className="w-4 h-4 text-emerald-400" />
          )}
          <span>{activeSession.vehicle.brand} {activeSession.vehicle.model}</span>
          <span className="text-slate-500 font-mono text-[10px]">({activeSession.vehicle.regNo})</span>
        </div>
      </div>

      {/* Live Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Delivered Energy */}
        <div className="glass-card p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Energy Delivered</span>
            <Icons.Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {activeSession.deliveredKwh.toFixed(2)} <span className="text-xs font-medium text-slate-400">kWh</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            +{(activeSession.deliveredKwh * (activeSession.vehicle.efficiencyKmPerKwh || 6.5)).toFixed(0)} km range added
          </div>
        </div>

        {/* Running Cost */}
        <div className="glass-card p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Running Cost</span>
            <Icons.Wallet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            ₹{activeSession.runningCost.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            @ ₹{activeSession.station.pricePerKwh}/unit
          </div>
        </div>

        {/* Charging Speed */}
        <div className="glass-card p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Power Output</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="text-xl font-extrabold text-cyan-400 mt-1">
            {activeSession.currentSpeedKw} <span className="text-xs font-medium text-slate-400">kW</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {activeSession.voltage}V • {activeSession.currentAmps}A DC
          </div>
        </div>

        {/* Environmental Offset */}
        <div className="glass-card p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Carbon Saved</span>
            <span className="text-emerald-400">🌿</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1">
            {(activeSession.deliveredKwh * 0.82).toFixed(1)} <span className="text-xs font-medium text-slate-400">kg</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            Zero direct emissions
          </div>
        </div>
      </div>

      {/* Control Actions (Pause/Resume & Stop Charging) */}
      <div className="mt-4 pt-2 space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-1 py-3 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 ${
              isPaused
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span>{isPaused ? '▶ Resume Charging' : '⏸ Pause Session'}</span>
          </button>

          <button
            onClick={handleStopCharging}
            className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-500/25 active:scale-95 transition"
          >
            <Icons.X className="w-4 h-4" />
            <span>Stop Charging</span>
          </button>
        </div>
      </div>

      {/* Session Summary Modal */}
      {showSummaryModal && sessionSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-slate-700 shadow-2xl bg-slate-900 text-left">
            <div className="text-center pb-3 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                <Icons.CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-white">Charging Complete!</h3>
              <p className="text-xs text-slate-400 mt-0.5">{sessionSummary.stationName}</p>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Battery Level:</span>
                <span className="font-bold text-white">
                  {sessionSummary.startPercent}% → <span className="text-emerald-400">{sessionSummary.endPercent}% (+{sessionSummary.endPercent - sessionSummary.startPercent}%)</span>
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total Energy Delivered:</span>
                <span className="font-bold text-cyan-400">{sessionSummary.unitsKwh} kWh</span>
              </div>

              <div className="flex items-center justify-between bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Charging Duration:</span>
                <span className="font-bold text-white">{sessionSummary.durationMinutes} minutes</span>
              </div>

              <div className="flex items-center justify-between bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Clean Carbon Saved:</span>
                <span className="font-bold text-emerald-400">🌿 {sessionSummary.co2SavedKg} kg CO₂</span>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Energy Cost ({sessionSummary.unitsKwh}u @ ₹{sessionSummary.pricePerKwh}):</span>
                  <span>₹{sessionSummary.baseAmount}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>GST (18%):</span>
                  <span>₹{sessionSummary.gstAmount}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold text-sm text-white">
                  <span>Total Payable:</span>
                  <span className="text-emerald-400">₹{sessionSummary.totalAmount}</span>
                </div>
              </div>

              {/* Wallet info */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Current Wallet Balance:</span>
                <span className="font-semibold text-slate-200">₹{walletBalance.toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <button
                onClick={handlePayAndClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition"
              >
                <Icons.Wallet className="w-4 h-4 fill-current" />
                <span>Pay ₹{sessionSummary.totalAmount} & View Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
