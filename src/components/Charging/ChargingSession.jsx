import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  QrCode, Zap, BatteryCharging, Clock, IndianRupee, 
  CheckCircle2, AlertTriangle, ArrowLeft, Flashlight, 
  FlashlightOff, Camera, RefreshCw, StopCircle, Sparkles, 
  Receipt, Wallet, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function ChargingSession() {
  const {
    activeSession,
    setActiveSession,
    startChargingSession,
    endChargingSession,
    selectedStation,
    activeVehicle,
    walletBalance,
    setActiveTab,
    showToast
  } = useApp();

  // Internal phases: 'scan' | 'unlocking' | 'charging' | 'summary'
  const [phase, setPhase] = useState(activeSession ? 'charging' : 'scan');
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('BLR-KRM-01-G1');
  const [simSpeed, setSimSpeed] = useState(2); // 1x, 2x, 5x speed multiplier for fast demo
  const [completedSummary, setCompletedSummary] = useState(null);

  // Unlocking barrier animation step
  const [unlockStep, setUnlockStep] = useState(1);

  // If activeSession changes, sync phase
  useEffect(() => {
    if (activeSession && phase !== 'summary') {
      setPhase('charging');
    }
  }, [activeSession]);

  // Charging ticker simulation loop
  useEffect(() => {
    if (phase !== 'charging' || !activeSession) return;

    const interval = setInterval(() => {
      setActiveSession(prev => {
        if (!prev) return null;

        const newElapsedSeconds = prev.elapsedSeconds + (1 * simSpeed);
        
        // Calculate kWh increment per tick based on chargingRateKw
        // 1 hr = 3600s -> kWh per second = (kW / 3600) * simSpeed
        const kwhIncrement = (prev.chargingRateKw / 3600) * simSpeed;
        const newEnergy = Math.round((prev.energyDeliveredKwh + kwhIncrement) * 100) / 100;
        
        // Running cost
        const newCost = Math.round((newEnergy * prev.pricePerKwh) * 100) / 100;

        // Battery % increase
        const batteryCapacity = prev.batteryCapacityKwh || 40.5;
        const pctAdded = (newEnergy / batteryCapacity) * 100;
        const newPct = Math.min(100, Math.round((prev.startBatteryPct + pctAdded) * 10) / 10);

        return {
          ...prev,
          elapsedSeconds: newElapsedSeconds,
          energyDeliveredKwh: newEnergy,
          runningCost: newCost,
          currentBatteryPct: newPct
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, activeSession, simSpeed]);

  // Handle Simulate QR Scan & Unlock Barrier
  const handleSimulateScan = () => {
    setPhase('unlocking');
    setUnlockStep(1);

    // Step 1: Handshake
    setTimeout(() => {
      setUnlockStep(2);
    }, 900);

    // Step 2: Barrier lifting
    setTimeout(() => {
      setUnlockStep(3);
    }, 1800);

    // Step 3: Start session
    setTimeout(() => {
      const station = selectedStation;
      const gun = station.guns.find(g => g.status === 'available') || station.guns[0];
      startChargingSession(station, gun);
      setPhase('charging');
      showToast('Charging started successfully!', 'success');
    }, 2700);
  };

  // Stop charging
  const handleStopCharging = () => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    const summary = endChargingSession('wallet');
    setCompletedSummary(summary);
    setPhase('summary');
  };

  // Format mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 p-4 space-y-5 animate-fadeIn">

      {/* ==================== 1. SCAN QR CODE VIEW ==================== */}
      {phase === 'scan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Step 1 of 2</span>
              <h1 className="text-2xl font-black text-white">Scan Charger QR</h1>
            </div>
            <button
              onClick={() => setActiveTab('map')}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Camera Viewfinder Mock */}
          <div className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-700 flex flex-col items-center justify-center transition-colors shadow-2xl ${
            torchOn ? 'bg-slate-800' : 'bg-slate-950'
          }`}>
            {/* Background grid texture */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Viewfinder Target Box */}
            <div className="relative w-56 h-56 rounded-2xl border-2 border-brand-500/80 bg-brand-500/5 flex flex-col items-center justify-center p-4">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brand-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brand-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brand-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brand-400 rounded-br-lg"></div>

              {/* Animated Laser Scan Bar */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_12px_#34D399] animate-scan"></div>

              {/* QR Mock graphic */}
              <QrCode className="w-24 h-24 text-slate-500/50" />
              <span className="text-[11px] font-bold text-slate-300 mt-2 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700">
                Point at Station QR
              </span>
            </div>

            {/* Flashlight and Camera Control Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setTorchOn(!torchOn)}
                className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                  torchOn ? 'bg-brand-500 text-slate-950 border-brand-400' : 'bg-slate-900/80 text-slate-300 border-slate-700'
                }`}
                title="Toggle Torch"
              >
                {torchOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Target Charger Badge at bottom */}
            <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
              <span className="truncate">📍 {selectedStation?.name}</span>
              <span className="text-brand-400 font-bold ml-1">Gun 1 (60kW)</span>
            </div>
          </div>

          {/* Manual Charger Code Input Mock */}
          <div className="p-4 rounded-2xl bg-navy-card border border-navy-cardBorder space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Or enter Gun ID manually:</span>
              <span className="text-brand-400 font-normal text-[11px]">e.g. BLR-KRM-01</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono uppercase text-white tracking-wider focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Big Action Button */}
          <button
            onClick={handleSimulateScan}
            className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 active:scale-95 text-navy-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-brand-500/25 transition-all"
          >
            <Zap className="w-5 h-5 fill-navy-950" />
            <span>Simulate Scan & Unlock Barrier</span>
          </button>
        </div>
      )}

      {/* ==================== 2. BARRIER UNLOCK ANIMATION VIEW ==================== */}
      {phase === 'unlocking' && (
        <div className="p-8 rounded-3xl bg-navy-card border border-navy-cardBorder shadow-2xl text-center space-y-6 my-8 animate-fadeIn">
          {/* Animated Barrier Graphic */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"></div>
            <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-brand-400 flex items-center justify-center shadow-[0_0_30px_#10B981]">
              <span className="text-4xl animate-bounce">
                {unlockStep === 1 ? '📡' : unlockStep === 2 ? '🚧' : '⚡'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">
              {unlockStep === 1 && 'Scanning QR Code...'}
              {unlockStep === 2 && 'Opening Bay Barrier...'}
              {unlockStep === 3 && 'Locking Connector & Starting Flow!'}
            </h2>
            <p className="text-xs text-slate-400">
              {unlockStep === 1 && 'Verifying digital certificate with BESCOM/Tata Power network'}
              {unlockStep === 2 && 'Smart barrier lifting up for your vehicle entry'}
              {unlockStep === 3 && 'Safety communication handshake verified. Flowing electricity!'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-700"
              style={{ width: `${unlockStep * 33.3}%` }}
            />
          </div>
        </div>
      )}

      {/* ==================== 3. LIVE CHARGING SCREEN ==================== */}
      {phase === 'charging' && activeSession && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Top Status Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Live Charging Active
              </span>
            </div>

            {/* Demo Simulation Speed Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xl text-[11px]">
              <span className="text-slate-400">Speed:</span>
              {[1, 2, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                    simSpeed === s ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Station & Gun Information Banner */}
          <div className="p-3.5 rounded-2xl bg-navy-card border border-navy-cardBorder flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-brand-400 block">{activeSession.stationArea}</span>
              <h2 className="text-sm font-bold text-white truncate">{activeSession.stationName}</h2>
              <span className="text-[11px] text-slate-400">{activeSession.gunName} • {activeSession.connectorType}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-white block">{activeSession.vehicleName}</span>
              <span className="text-[10px] text-brand-400">₹{activeSession.pricePerKwh}/kWh</span>
            </div>
          </div>

          {/* Glowing Circular Battery Tank / Dial */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-navy-card to-slate-950 border border-navy-cardBorder shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient Back Glow */}
            <div className="absolute w-44 h-44 rounded-full bg-brand-500/15 blur-3xl -top-10"></div>

            {/* Circular Gauge Representation */}
            <div className="relative w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center shadow-inner">
              {/* Dynamic SVG Circular Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="86"
                  stroke="#10B981"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="540"
                  strokeDashoffset={540 - (540 * (activeSession.currentBatteryPct / 100))}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>

              {/* Inside Value */}
              <div className="text-center z-10 space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-brand-400">
                  <Zap className="w-5 h-5 fill-brand-400 animate-pulse" />
                </div>
                <div className="text-4xl font-black text-white tracking-tight">
                  {Math.round(activeSession.currentBatteryPct)}%
                </div>
                <div className="text-[11px] font-bold text-emerald-400">
                  +{Math.round((activeSession.currentBatteryPct - activeSession.startBatteryPct) * 10) / 10}% gained
                </div>
              </div>
            </div>

            {/* Power Telemetry Row */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-slate-800 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Power</span>
                <span className="text-base font-extrabold text-brand-300 mt-0.5 block">
                  {activeSession.chargingRateKw} kW DC
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Voltage / Amps</span>
                <span className="text-base font-extrabold text-slate-200 mt-0.5 block">
                  410 V • 135 A
                </span>
              </div>
            </div>
          </div>

          {/* Live Telemetry Grid: Energy, Time, Cost */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Energy Delivered */}
            <div className="p-3.5 rounded-2xl bg-navy-card border border-navy-cardBorder text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Energy</span>
              <span className="text-lg font-black text-brand-300 mt-1 block">
                {activeSession.energyDeliveredKwh.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">kWh Delivered</span>
            </div>

            {/* Time Elapsed */}
            <div className="p-3.5 rounded-2xl bg-navy-card border border-navy-cardBorder text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
              <span className="text-lg font-black text-amber-300 mt-1 block font-mono">
                {formatTime(activeSession.elapsedSeconds)}
              </span>
              <span className="text-[10px] text-slate-500">Elapsed</span>
            </div>

            {/* Running Cost */}
            <div className="p-3.5 rounded-2xl bg-navy-card border border-navy-cardBorder text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Running Cost</span>
              <span className="text-lg font-black text-emerald-400 mt-1 block">
                ₹{activeSession.runningCost.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">at ₹{activeSession.pricePerKwh}/kWh</span>
            </div>
          </div>

          {/* Stop Charging Button */}
          <button
            onClick={handleStopCharging}
            className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/30 transition-all"
          >
            <StopCircle className="w-5 h-5" />
            <span>Stop Charging & View Summary</span>
          </button>
        </div>
      )}

      {/* ==================== 4. SESSION SUMMARY & RECEIPT MODAL ==================== */}
      {phase === 'summary' && completedSummary && (
        <div className="space-y-4 animate-fadeIn">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_#10B981]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">Charging Complete!</h2>
            <p className="text-xs text-slate-400">Payment processed and session receipt generated</p>
          </div>

          {/* Itemized Receipt Card */}
          <div className="p-5 rounded-3xl bg-navy-card border border-navy-cardBorder shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Receipt No.</span>
                <div className="text-xs font-mono font-bold text-brand-300">{completedSummary.receiptId}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Date</span>
                <div className="text-xs font-medium text-slate-200">{completedSummary.date}</div>
              </div>
            </div>

            {/* Station details */}
            <div>
              <h3 className="text-sm font-bold text-white">{completedSummary.stationName}</h3>
              <p className="text-xs text-slate-400">{completedSummary.area} • {completedSummary.gunName}</p>
              <p className="text-xs text-brand-400 mt-0.5">{completedSummary.vehicleName}</p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Energy Delivered:</span>
                <div className="font-extrabold text-white text-sm">{completedSummary.energyKwh} kWh</div>
              </div>
              <div>
                <span className="text-slate-400">Total Duration:</span>
                <div className="font-extrabold text-white text-sm">{completedSummary.durationMinutes} mins</div>
              </div>
              <div>
                <span className="text-slate-400">Battery Level:</span>
                <div className="font-extrabold text-brand-300 text-sm">
                  {completedSummary.startBatteryPct}% ➔ {completedSummary.endBatteryPct}%
                </div>
              </div>
              <div>
                <span className="text-slate-400">Tariff Rate:</span>
                <div className="font-extrabold text-white text-sm">₹{completedSummary.pricePerKwh}/unit</div>
              </div>
            </div>

            {/* Final Total Amount */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">Total Amount Paid</span>
                <span className="text-xs text-slate-300">{completedSummary.paymentMethod}</span>
              </div>
              <span className="text-2xl font-black text-emerald-400">
                ₹{completedSummary.cost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCompletedSummary(null);
                setPhase('scan');
                setActiveTab('map');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              Back to Map
            </button>
            <button
              onClick={() => {
                setCompletedSummary(null);
                setActiveTab('wallet');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-lg"
            >
              View Wallet & History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
