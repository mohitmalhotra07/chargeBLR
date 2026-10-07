// ChargeBLR Wallet & Mock UPI Payment Screen
const { useState } = window.React;
const Icons = window.Icons;

window.WalletScreen = function WalletScreen({
  walletBalance,
  onAddMoney,
  transactions,
  selectedReceipt,
  setSelectedReceipt
}) {
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState(500);
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("driver.ev@okhdfcbank");
  const [upiStep, setUpiStep] = useState("select"); // 'select', 'pin', 'success'
  const [pin, setPin] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all"); // 'all', 'charge', 'topup'

  const upiApps = [
    { id: "gpay", name: "Google Pay", icon: "🟢", color: "from-blue-600 to-emerald-600" },
    { id: "phonepe", name: "PhonePe", icon: "🟣", color: "from-purple-600 to-indigo-600" },
    { id: "paytm", name: "Paytm UPI", icon: "🔵", color: "from-sky-500 to-blue-700" },
    { id: "cred", name: "CRED Pay", icon: "⚪", color: "from-slate-800 to-slate-950" },
    { id: "bhim", name: "BHIM UPI", icon: "🟠", color: "from-orange-600 to-emerald-700" }
  ];

  const handleStartTopup = () => {
    setUpiStep("pin");
    setPin("");
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 4) return;

    if (window.SoundFx) window.SoundFx.playQrScanBeep();
    setUpiStep("processing");

    setTimeout(() => {
      if (window.SoundFx) window.SoundFx.playSuccessChime();
      setUpiStep("success");
      onAddMoney(parseFloat(topupAmount), upiApps.find(a => a.id === selectedUpiApp).name);

      setTimeout(() => {
        setShowAddMoneyModal(false);
        setUpiStep("select");
        setPin("");
      }, 1500);
    }, 1000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (historyFilter === 'charge') return tx.type === 'charge';
    if (historyFilter === 'topup') return tx.type === 'topup';
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-4 py-3 bg-slate-950 pb-24 text-left">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-900">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-white">EV Wallet & Payments</h2>
          <p className="text-xs text-slate-400">Prepaid balance & session tax receipts</p>
        </div>
      </div>

      {/* Hero Wallet Balance Card */}
      <div className="mt-3 p-5 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <Icons.Wallet className="w-4 h-4" />
              <span>ChargeBLR EV Pass</span>
            </div>
            <div className="text-3xl font-black font-heading text-white mt-1">
              ₹{walletBalance.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Auto-debits on EV barrier exit</p>
          </div>

          <button
            onClick={() => {
              setUpiStep("select");
              setShowAddMoneyModal(true);
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Add Money</span>
          </button>
        </div>

        {/* Quick Wallet Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400">Total Spent</span>
            <div className="font-bold text-white mt-0.5">₹1,480</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Total Units</span>
            <div className="font-bold text-cyan-400 mt-0.5">82.4 kWh</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Fast Charges</span>
            <div className="font-bold text-emerald-400 mt-0.5">6 Sessions</div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-white">Payment & Session History</h3>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-2 py-0.5 rounded-lg transition ${historyFilter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setHistoryFilter('charge')}
              className={`px-2 py-0.5 rounded-lg transition ${historyFilter === 'charge' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Charges
            </button>
            <button
              onClick={() => setHistoryFilter('topup')}
              className={`px-2 py-0.5 rounded-lg transition ${historyFilter === 'topup' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Top-ups
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const isCharge = tx.type === 'charge';

            return (
              <div
                key={tx.id}
                onClick={() => tx.receipt && setSelectedReceipt(tx.receipt)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                  tx.receipt ? 'hover:border-emerald-500/50 hover:bg-slate-900/80' : ''
                } bg-slate-900/50 border-slate-800`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isCharge
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {isCharge ? <Icons.Zap className="w-5 h-5 fill-current" /> : <Icons.Wallet className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{tx.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {tx.date} • {tx.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-bold ${isCharge ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isCharge ? `- ₹${tx.amount.toFixed(2)}` : `+ ₹${tx.amount.toFixed(2)}`}
                  </div>
                  {tx.receipt && (
                    <span className="text-[9px] text-cyan-400 font-semibold underline mt-0.5 block">
                      View Receipt
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Money Modal (Mock UPI Screen) */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-900 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Icons.Wallet className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-white">Add Money to EV Wallet</h3>
              </div>
              <button onClick={() => setShowAddMoneyModal(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            {upiStep === "select" && (
              <div className="mt-4 space-y-4 text-xs">
                {/* Amount input */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Enter Top-up Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-lg font-bold text-emerald-400">₹</span>
                    <input
                      type="number"
                      min="50"
                      max="10000"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-8 pr-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Preset amounts */}
                  <div className="flex items-center space-x-1.5 mt-2">
                    {[200, 500, 1000, 2000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTopupAmount(amt)}
                        className={`flex-1 py-1.5 rounded-xl border font-semibold text-xs transition ${
                          topupAmount == amt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose UPI App */}
                <div>
                  <label className="text-slate-400 block mb-2 font-medium">Select UPI Payment App</label>
                  <div className="space-y-1.5">
                    {upiApps.map((app) => (
                      <label
                        key={app.id}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition ${
                          selectedUpiApp === app.id
                            ? 'bg-emerald-500/10 border-emerald-400'
                            : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{app.icon}</span>
                          <span className="font-semibold text-white">{app.name}</span>
                        </div>
                        <input
                          type="radio"
                          name="upiApp"
                          value={app.id}
                          checked={selectedUpiApp === app.id}
                          onChange={() => setSelectedUpiApp(app.id)}
                          className="text-emerald-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartTopup}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition"
                >
                  Proceed to Pay ₹{topupAmount}
                </button>
              </div>
            )}

            {upiStep === "pin" && (
              <form onSubmit={handlePinSubmit} className="mt-4 space-y-4 text-center">
                <div className="p-3 bg-slate-850 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Paying via {upiApps.find(a => a.id === selectedUpiApp).name}</div>
                  <div className="text-2xl font-black text-white mt-0.5">₹{topupAmount}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">To: ChargeBLR Technologies Pvt Ltd</div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-2 font-semibold">Enter 4 or 6 Digit UPI PIN</label>
                  <input
                    type="password"
                    maxLength="6"
                    autoFocus
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-36 text-center tracking-widest text-2xl bg-slate-850 border-2 border-emerald-500 rounded-2xl py-2 text-white font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">Simulated Bank PIN (Any 4 digits)</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUpiStep("select")}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </form>
            )}

            {upiStep === "processing" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                <div className="text-sm font-bold text-white">Communicating with Bank UPI Server...</div>
              </div>
            )}

            {upiStep === "success" && (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-center animate-in zoom-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Icons.CheckCircle className="w-8 h-8" />
                </div>
                <div className="text-base font-extrabold text-white">₹{topupAmount} Added Successfully!</div>
                <p className="text-xs text-slate-400">Wallet balance updated instantly</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tax Invoice Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-slate-700 shadow-2xl bg-slate-900 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Icons.Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-base text-white">EV Charging Tax Invoice</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 rounded-full text-slate-400 hover:text-white">
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] space-y-2.5 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="text-white font-bold">{selectedReceipt.stationName}</div>
                  <div className="text-slate-400 text-[10px]">{selectedReceipt.stationArea}, Bengaluru</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">{selectedReceipt.sessionId}</div>
                  <div className="text-slate-500 text-[10px]">PAID</div>
                </div>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span>{selectedReceipt.vehicle.brand} {selectedReceipt.vehicle.model} ({selectedReceipt.vehicle.regNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Connector / Bay:</span>
                  <span>Bay {selectedReceipt.bayId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Energy Dispensed:</span>
                  <span>{selectedReceipt.unitsKwh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate per Unit:</span>
                  <span>₹{selectedReceipt.pricePerKwh.toFixed(2)}/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span>{selectedReceipt.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GSTIN (KA):</span>
                  <span>29AAACT2727Q1ZB</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Energy Base Charge:</span>
                  <span>₹{selectedReceipt.baseAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CGST (9%) + SGST (9%):</span>
                  <span>₹{selectedReceipt.gstAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-slate-800">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-400 font-heading">₹{selectedReceipt.totalAmount}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-emerald-400/80 pt-1">
                🌿 CO₂ Offset: {selectedReceipt.co2SavedKg} kg • Thank you for driving clean!
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <button
                onClick={() => {
                  alert("Receipt download simulated: Saved as PDF to downloads.");
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 text-center"
              >
                Download PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
