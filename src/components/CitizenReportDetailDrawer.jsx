import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  Copy, 
  Sparkles
} from 'lucide-react';

export default function CitizenReportDetailDrawer({ report, onClose, onShare, showToast }) {
  if (!report) return null;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(report.id);
      if (showToast) showToast(`Reference ID ${report.id} copied to clipboard.`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Awaiting Review</span>
          </span>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-neutral-950/40 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Surface */}
      <aside className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200/90 z-10 animate-slideInRight overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200/80 sticky top-0 bg-white/95 backdrop-blur-md z-20 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {report.id}
              </span>
              {getStatusBadge(report.status)}
            </div>
            <h2 id="drawer-title" className="text-base sm:text-lg font-bold text-neutral-900 leading-snug pt-1">
              {report.title}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyId}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"
              title="Copy Incident ID"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"
              aria-label="Close details drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 text-xs">
          
          {/* Photo Evidence Section */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
              <span>Photo Evidence</span>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Geotag Verified</span>
              </span>
            </div>

            {report.photo ? (
              <div className="relative rounded-lg overflow-hidden border border-neutral-200 group bg-neutral-950">
                <img
                  src={report.photo}
                  alt={report.title}
                  className="w-full h-52 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-transparent p-3 flex items-center justify-between text-white text-[11px] font-mono">
                  <span>GPS: {report.coordinates || '12.9716° N, 77.5946° E'}</span>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px]">Evidence #01</span>
                </div>
              </div>
            ) : (
              <div className="h-32 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col items-center justify-center text-neutral-400 gap-2">
                <Camera className="w-6 h-6 text-neutral-300" />
                <span>No photographic proof attached</span>
              </div>
            )}
          </div>

          {/* Key Incident Metadata Table */}
          <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/60 divide-y divide-neutral-200/60 overflow-hidden text-xs">
            <div className="p-3 flex items-center justify-between">
              <span className="text-neutral-500">Category:</span>
              <span className="font-semibold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                {report.category}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-neutral-500">Location:</span>
              <span className="font-medium text-neutral-800 text-right max-w-[240px] truncate" title={report.location}>
                {report.location}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-neutral-500">Priority Level:</span>
              <span className="font-semibold text-amber-700 font-mono">
                {report.priority || 'Medium (Level 3)'}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-neutral-500">Submitted:</span>
              <span className="text-neutral-700 font-mono">
                {report.submittedAt}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Citizen Description
            </div>
            <p className="text-neutral-700 leading-relaxed bg-white border border-neutral-200 rounded-lg p-3 text-xs">
              {report.description}
            </p>
          </div>

          {/* Chronological Progress Timeline */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
              <span>Resolution Progress Timeline</span>
              <span className="text-[10px] text-neutral-400 font-mono">Ward 112 Dispatch</span>
            </div>

            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              
              {/* Step 1: Initial Submission */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                  ✓
                </div>
                <div className="bg-white border border-neutral-200 rounded p-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">Report Submitted</span>
                    <span className="text-[10px] font-mono text-neutral-400">{report.submittedAt}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Logged with geotagged photo proof by citizen node.
                  </p>
                </div>
              </div>

              {/* Step 2: AI Triage */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                  ✓
                </div>
                <div className="bg-white border border-neutral-200 rounded p-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">AI Triage & Verification</span>
                    <span className="text-[10px] font-mono text-neutral-400">+6 mins</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Optical analysis verified damage severity. Spatial duplicate check cleared.
                  </p>
                </div>
              </div>

              {/* Step 3: Squad Dispatch */}
              <div className="relative">
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-xs ${
                  report.status === 'In Progress' || report.status === 'Resolved'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-neutral-900'
                }`}>
                  {report.status === 'In Progress' || report.status === 'Resolved' ? '✓' : '•'}
                </div>
                <div className="bg-white border border-neutral-200 rounded p-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">Field Squad Dispatched</span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {report.status === 'Awaiting Review' ? 'Pending Queue' : 'Assigned Squad Delta'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {report.status === 'Awaiting Review'
                      ? 'Incident queued for municipal supervisor assessment.'
                      : 'Assigned to Ward 112 Rapid Roadworks Squad. SLA: 24 hours.'}
                  </p>
                </div>
              </div>

              {/* Step 4: Resolution Outcome */}
              <div className="relative">
                <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-xs ${
                  report.status === 'Resolved'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-200 text-neutral-400'
                }`}>
                  {report.status === 'Resolved' ? '✓' : '4'}
                </div>
                <div className={`border rounded p-2.5 space-y-0.5 ${
                  report.status === 'Resolved' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-neutral-50 border-neutral-200/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${report.status === 'Resolved' ? 'text-emerald-900' : 'text-neutral-500'}`}>
                      Resolution Verification
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {report.status === 'Resolved' ? 'Closed' : 'Awaiting Completion'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {report.status === 'Resolved'
                      ? 'Supervisor-verified photographic proof confirmed repair work completed.'
                      : 'Post-repair photographic proof will appear once squad completes field repair.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Official Demo Disclaimer Notice */}
          <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-500 space-y-1">
            <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff5722]" />
              <span>CivicFix AI Demo State</span>
            </div>
            <p className="leading-relaxed">
              This grievance is tracked within your local browser demonstration profile. No official police or emergency ticket has been created.
            </p>
          </div>

        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 sm:p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] border-t border-neutral-200/80 bg-neutral-50/95 backdrop-blur-md flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={handleCopyId}
            className="flex-1 min-touch-target py-2.5 px-3.5 rounded-xl border border-neutral-300 bg-white text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Reference</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 min-touch-target py-2.5 px-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Close Details</span>
          </button>
        </div>

      </aside>
    </div>
  );
}
