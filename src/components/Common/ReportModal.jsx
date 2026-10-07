import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Clock, ThumbsUp, X, Send } from 'lucide-react';

export default function ReportModal({ station, isOpen, onClose }) {
  const { reportStationStatus } = useApp();
  const [selectedStatus, setSelectedStatus] = useState('working');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !station) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      reportStationStatus(station.id, selectedStatus, note);
      setSubmitting(false);
      onClose();
    }, 400);
  };

  const statusOptions = [
    {
      id: 'working',
      label: 'Working & Available',
      desc: 'All or most guns are functioning smoothly',
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      icon: CheckCircle2
    },
    {
      id: 'occupied',
      label: 'Occupied / Busy',
      desc: 'All charging bays are currently occupied by EVs',
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
      icon: Clock
    },
    {
      id: 'broken',
      label: 'Not Working / Broken',
      desc: 'Station offline, power fault, or physical connector damage',
      color: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-navy-card border border-navy-cardBorder rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase text-brand-400">Community Driver Report</span>
            <h3 className="text-lg font-bold text-white">Report Station Status</h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{station.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-300">What is the current condition?</label>
          {statusOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = selectedStatus === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedStatus(opt.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? `${opt.color} ring-2 ring-brand-500/50`
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Note */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Additional details (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Gun 2 display error, 2 cars in queue..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
