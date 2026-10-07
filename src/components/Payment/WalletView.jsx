import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, Plus, ArrowUpRight, History, Receipt, 
  CheckCircle2, CreditCard, ShieldCheck, X, ChevronRight, 
  Sparkles, Download, IndianRupee, Clock, Zap 
} from 'lucide-react';

export default function WalletView() {
  const { walletBalance, addWalletMoney, history, showToast } = useApp();

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('500');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [customVpa, setCustomVpa] = useState('evdriver@okhdfcbank');

  const upiApps = [
    { name: 'Google Pay', logo: '🔵', desc: 'Instant UPI 2.0' },
    { name: 'PhonePe', logo: '🟣', desc: 'Auto-Pay supported' },
    { name: 'Paytm UPI', logo: '🔷', desc: 'Fast checkout' },
    { name: 'BHIM UPI', logo: '🇮🇳', desc: 'Govt NPCI gateway' }
  ];

  const handleAddMoneySubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(addAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    addWalletMoney(amountNum, selectedUpiApp);
    setIsAddMoneyOpen(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 p-4 space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Payments & Receipts</span>
          <h1 className="text-2xl font-black text-white">ChargeBLR Wallet</h1>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      {/* Main Wallet Card */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-navy-card via-slate-900 to-emerald-950/40 border border-navy-cardBorder shadow-2xl overflow-hidden space-y-5">
        {/* Decorative background glow */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-brand-500/15 rounded-full blur-2xl"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Available Balance
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 flex items-baseline tracking-tight">
              <span>₹{walletBalance.toFixed(2)}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Auto-deduct for hassle-free charging
            </span>
          </div>

          <button
            onClick={() => setIsAddMoneyOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Money</span>
          </button>
        </div>

        {/* Quick Top-Up Presets */}
        <div className="pt-2 border-t border-slate-800/80 relative z-10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">Quick Top-up via UPI:</div>
          <div className="flex gap-2">
            {[200, 500, 1000].map(amt => (
              <button
                key={amt}
                onClick={() => {
                  setAddAmount(amt.toString());
                  setIsAddMoneyOpen(true);
                }}
                className="flex-1 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 active:scale-95 transition-all"
              >
                +₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History & Past Receipts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Charging Session History
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">{history.length} Sessions</span>
        </div>

        {history.length === 0 ? (
          <div className="p-8 rounded-3xl bg-navy-card/60 border border-slate-800 text-center space-y-2">
            <Zap className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No charging sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedReceipt(item)}
                className="group p-4 rounded-2xl bg-navy-card/90 hover:bg-slate-900 border border-navy-cardBorder hover:border-brand-500/40 transition-all cursor-pointer shadow-md flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                        {item.stationName}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.date} • {item.energyKwh} kWh • {item.durationMinutes} mins
                    </p>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {item.vehicleName}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <div>
                    <span className="text-sm font-black text-emerald-400 block">
                      ₹{item.cost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.paymentMethod.includes('Wallet') ? 'Wallet' : 'UPI'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== ADD MONEY UPI MODAL ==================== */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-navy-card border border-navy-cardBorder rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-400">Mock UPI Gateway</span>
                <h3 className="text-lg font-bold text-white">Add Money to Wallet</h3>
              </div>
              <button
                onClick={() => setIsAddMoneyOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMoneySubmit} className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Enter Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-brand-400">₹</span>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-lg font-black text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* UPI App Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select UPI Application
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {upiApps.map(app => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.name)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedUpiApp === app.name
                          ? 'bg-brand-500/20 border-brand-500 ring-2 ring-brand-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{app.logo}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{app.name}</div>
                        <div className="text-[10px] text-slate-400">{app.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID field mock */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">UPI ID / VPA</label>
                <input
                  type="text"
                  value={customVpa}
                  onChange={(e) => setCustomVpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMoneyOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all"
                >
                  Authorize ₹{addAmount || 0}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAX INVOICE & RECEIPT MODAL ==================== */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-navy-card border border-navy-cardBorder rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-white">Charging Tax Invoice</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Details Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>RECEIPT #{selectedReceipt.receiptId}</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="border-t border-dashed border-slate-800 pt-2 text-white">
                <div className="font-bold">{selectedReceipt.stationName}</div>
                <div className="text-[11px] text-slate-400">{selectedReceipt.area}</div>
                <div className="text-[11px] text-brand-400 mt-0.5">{selectedReceipt.vehicleName}</div>
              </div>
              <div className="border-t border-dashed border-slate-800 pt-2 space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Energy Consumed:</span>
                  <span className="font-bold text-white">{selectedReceipt.energyKwh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-bold text-white">{selectedReceipt.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-emerald-400">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% inclusive):</span>
                  <span className="text-slate-400">₹{(selectedReceipt.cost * 0.18).toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t-2 border-slate-700 pt-2 flex justify-between items-center text-base font-bold text-white">
                <span>TOTAL PAID:</span>
                <span className="text-emerald-400 text-lg">₹{selectedReceipt.cost.toFixed(2)}</span>
              </div>
            </div>

            {/* Download/Done buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast('Receipt downloaded to device storage', 'success');
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs transition-transform active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
