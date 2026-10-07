// ChargeBLR Community Status Report Modal
const { useState } = window.React;
const Icons = window.Icons;

window.ReportModal = function ReportModal({ station, onClose, onSubmitReport }) {
  const [reportType, setReportType] = useState("working");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reportOptions = [
    {
      id: "working",
      title: "Working & Available",
      desc: "Chargers are online and bays are clear",
      status: "available",
      icon: "🟢"
    },
    {
      id: "occupied",
      title: "All Bays Occupied / Long Queue",
      desc: "Other EVs are charging or waiting in line",
      status: "busy",
      icon: "⏳"
    },
    {
      id: "broken",
      title: "Broken / Out of Order",
      desc: "Charger screen blank, error code, or no power",
      status: "broken",
      icon: "🔴"
    },
    {
      id: "ice_blocked",
      title: "ICE Car Blocking EV Bay",
      desc: "Petrol/diesel vehicle illegally parked in charging spot",
      status: "busy",
      icon: "🚫"
    },
    {
      id: "cable_damaged",
      title: "Cable or Connector Damaged",
      desc: "Lock broken, damaged gun, or safety hazard",
      status: "broken",
      icon: "⚠️"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const selectedOption = reportOptions.find(o => o.id === reportType);

    setTimeout(() => {
      setSubmitting(false);
      onSubmitReport(station.id, selectedOption.status, notes);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm glass-card p-5 rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-900 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-base text-white">Report Station Status</h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{station.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800">
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <p className="text-xs text-slate-300 font-medium">What is the current situation on ground?</p>

          <div className="space-y-2">
            {reportOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start p-2.5 rounded-2xl border cursor-pointer transition ${
                  reportType === opt.id
                    ? 'bg-emerald-500/10 border-emerald-400 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="reportType"
                  value={opt.id}
                  checked={reportType === opt.id}
                  onChange={() => setReportType(opt.id)}
                  className="mt-1 text-emerald-500 focus:ring-emerald-400"
                />
                <div className="ml-3 flex-1">
                  <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
                    <span>{opt.icon}</span>
                    <span>{opt.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Additional Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Gun 1 working, Gun 2 screen has error"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
            >
              {submitting ? "Updating..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
