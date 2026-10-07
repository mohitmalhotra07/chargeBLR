// ChargeBLR Simulated QR Code Scanner with Barrier Opening Animation
const { useState, useEffect } = window.React;
const Icons = window.Icons;

window.QrScannerModal = function QrScannerModal({
  station,
  stations,
  onSelectStation,
  onStartChargingSession,
  onClose
}) {
  const [flashlight, setFlashlight] = useState(false);
  const [scanState, setScanState] = useState("scanning"); // 'scanning', 'verifying', 'barrier_opening', 'barrier_open'
  const [manualCode, setManualCode] = useState("");
  const [selectedBayId, setSelectedBayId] = useState("");

  const currentStation = station || stations[0];

  // Pick first available bay by default
  useEffect(() => {
    if (currentStation && currentStation.bays) {
      const avail = currentStation.bays.find(b => b.status === 'available');
      if (avail) setSelectedBayId(avail.id);
      else setSelectedBayId(currentStation.bays[0].id);
    }
  }, [currentStation]);

  const handleSimulateScan = () => {
    // 1. Play Scanner Beep
    if (window.SoundFx) window.SoundFx.playQrScanBeep();
    setScanState("verifying");

    // 2. Verification delay
    setTimeout(() => {
      // 3. Play Barrier Servo Sound
      if (window.SoundFx) window.SoundFx.playBarrierServo();
      setScanState("barrier_opening");

      // 4. Barrier fully open
      setTimeout(() => {
        setScanState("barrier_open");
      }, 1600);
    }, 900);
  };

  const handleConfirmAndPlugIn = () => {
    if (window.SoundFx) window.SoundFx.playPlugInClick();
    onStartChargingSession(currentStation, selectedBayId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm glass-card rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-950 flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Icons.QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-white">Scan Charger QR</h3>
              <p className="text-[10px] text-slate-400">Position code inside viewfinder</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFlashlight(!flashlight)}
              className={`p-2 rounded-xl border transition ${
                flashlight
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Flashlight"
            >
              <Icons.Flashlight className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scanner Viewfinder / Barrier Stage */}
        <div className="p-4 space-y-4">
          {scanState === "scanning" && (
            <div className="relative w-full aspect-square rounded-3xl bg-slate-900 border-2 border-dashed border-slate-700 overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner">
              {/* Flashlight background effect */}
              {flashlight && (
                <div className="absolute inset-0 bg-amber-100/10 pointer-events-none blur-xl"></div>
              )}

              {/* Viewfinder Target Frame */}
              <div className="relative w-48 h-48 rounded-2xl border-2 border-emerald-400/70 flex items-center justify-center bg-slate-950/40">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-md"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-md"></div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-md"></div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-md"></div>

                {/* Animated Sweeping Laser */}
                <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-laser"></div>

                {/* Simulated QR Code Graphic */}
                <div className="opacity-25 flex flex-col items-center">
                  <Icons.QrCode className="w-24 h-24 text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-mono mt-1">ALIGN QR CODE</span>
                </div>
              </div>

              <div className="text-center mt-3">
                <span className="text-xs font-semibold text-slate-300">
                  Targeting: <strong className="text-emerald-400">{currentStation.name}</strong>
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">Bay {selectedBayId} ({currentStation.area})</p>
              </div>
            </div>
          )}

          {scanState === "verifying" && (
            <div className="w-full aspect-square rounded-3xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              <div className="text-center">
                <div className="text-sm font-bold text-white">Verifying Charger Bay...</div>
                <p className="text-xs text-slate-400 mt-1">Checking lock authorization & grid power</p>
              </div>
            </div>
          )}

          {(scanState === "barrier_opening" || scanState === "barrier_open") && (
            <div className="w-full aspect-square rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/50 flex flex-col items-center justify-center p-6 space-y-3 relative overflow-hidden">
              
              {/* Automated Boom Barrier Simulation Graphic */}
              <div className="relative w-64 h-40 flex items-center justify-center">
                {/* Barrier Base Post */}
                <div className="absolute bottom-6 left-12 w-9 h-24 bg-slate-800 rounded-t-lg border-2 border-slate-600 flex flex-col items-center justify-between p-1 z-20 shadow-xl">
                  {/* Traffic Light LED (Red while closed, Green when opened) */}
                  <div className="w-full bg-slate-950 rounded p-1 flex flex-col items-center space-y-1">
                    <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      scanState === 'barrier_open'
                        ? 'bg-slate-800'
                        : 'bg-rose-500 shadow-[0_0_10px_#ef4444]'
                    }`}></div>
                    <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                      scanState === 'barrier_open'
                        ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]'
                        : 'bg-slate-800'
                    }`}></div>
                  </div>
                  {/* Pivot axle */}
                  <div className="w-4 h-4 rounded-full bg-slate-600 border border-slate-400 mb-1"></div>
                </div>

                {/* Boom Barrier Arm with Striped Texture */}
                <div
                  className={`absolute bottom-16 left-15 h-3.5 w-44 rounded-r-md origin-left transition-transform duration-1000 shadow-lg z-10 ${
                    scanState === 'barrier_open' ? 'rotate-[-80deg]' : 'rotate-0'
                  }`}
                  style={{
                    background: 'repeating-linear-gradient(45deg, #f97316, #f97316 10px, #ffffff 10px, #ffffff 20px)'
                  }}
                >
                  <div className="absolute -top-1 -right-1 w-2 h-5 bg-rose-500 rounded-full animate-ping"></div>
                </div>

                {/* Ground Line */}
                <div className="absolute bottom-6 left-4 right-4 h-1 bg-slate-700 rounded-full"></div>
              </div>

              {/* Status Message */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                  <Icons.Check className="w-3.5 h-3.5" />
                  <span>{scanState === 'barrier_open' ? 'Barrier Unlocked & Open!' : 'Lifting Barrier Arm...'}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-2">
                  Bay <span className="text-emerald-400 font-bold">{selectedBayId}</span> is now reserved.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Drive in and connect the charger gun to your vehicle.
                </p>
              </div>
            </div>
          )}

          {/* Station & Bay selector options */}
          {scanState === "scanning" && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Selected Station:</span>
                <select
                  value={currentStation.id}
                  onChange={(e) => {
                    const st = stations.find(s => s.id === e.target.value);
                    if (st) onSelectStation(st);
                  }}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-xl max-w-[170px] truncate focus:outline-none"
                >
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Select Bay / Gun:</span>
                <select
                  value={selectedBayId}
                  onChange={(e) => setSelectedBayId(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded-xl focus:outline-none"
                >
                  {currentStation.bays.map((bay) => (
                    <option key={bay.id} value={bay.id}>
                      {bay.id} - {bay.connector} ({bay.powerKw}kW)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            {scanState === "scanning" && (
              <button
                onClick={handleSimulateScan}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition"
              >
                <Icons.QrCode className="w-4 h-4 fill-current" />
                <span>Simulate Scan & Open Barrier</span>
              </button>
            )}

            {scanState === "barrier_open" && (
              <button
                onClick={handleConfirmAndPlugIn}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition animate-pulse"
              >
                <Icons.Plug className="w-4 h-4" />
                <span>Plug In Gun & Start Charging</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
