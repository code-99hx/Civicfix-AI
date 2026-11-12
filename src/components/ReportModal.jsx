import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Road Surface / Pothole',
  'Garbage Accumulation',
  'Broken Streetlight',
  'Water Leakage / Drainage',
  'Damaged Footpath / Pavement',
];

export default function ReportModal({ isOpen, onClose }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Indiranagar 100ft Road, Ward 112');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedId = `CIVIC-${Math.floor(1000 + Math.random() * 9000)}`;
    setReportId(generatedId);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setDescription('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-xl bg-[#141418] border border-white/20 text-white p-6 sm:p-8 rounded-md shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e5f] mb-1">
              [ Interactive Demo Intake • Client-Side Prototype ]
            </div>
            <h3 id="modal-title" className="text-2xl font-bold text-white tracking-tight">
              Report a Civic Issue
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-sm rounded-md border border-white/10 hover:border-white/30 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="space-y-6 py-2">
            <div className="bg-neutral-900/90 border border-white/10 rounded-md p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/10">
                <span className="font-bold text-white">INCIDENT ID: {reportId}</span>
                <span className="text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">STATUS: LOGGED</span>
              </div>
              <div className="space-y-2 text-xs">
                <div><strong className="text-neutral-400">Category:</strong> {category}</div>
                <div><strong className="text-neutral-400">Location:</strong> {locationName} (12.9716° N, 77.5946° E)</div>
                <div><strong className="text-neutral-400">AI Triage Flag:</strong> High Urgency • Road Safety Hazard</div>
                <div><strong className="text-neutral-400">Duplicate Check:</strong> 0 prior matches within 50m radius</div>
              </div>
            </div>

            <div className="p-3 bg-neutral-900 border border-white/10 rounded-md text-[11px] text-neutral-400 leading-relaxed">
              <strong className="text-white">Note:</strong> This is a client-side prototype demonstration of the CivicFix AI intake and triage flow. No live municipal emergency or dispatch request has been submitted.
            </div>

            <button
              onClick={handleReset}
              className="w-full rounded-md bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider py-3.5 hover:bg-neutral-100 transition-colors shadow"
            >
              Close Demo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="issue-category" className="block text-xs uppercase tracking-wider text-neutral-300 mb-2 font-medium">
                1. Select Issue Category
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 text-white text-xs px-3.5 py-3 rounded-md focus:border-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="issue-location" className="block text-xs uppercase tracking-wider text-neutral-300 mb-2 font-medium">
                2. Location / Street Context
              </label>
              <input
                id="issue-location"
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 text-white text-xs px-3.5 py-2.5 rounded-md focus:border-white focus:outline-none"
                required
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                GPS auto-detection simulated: 12.9716° N, 77.5946° E (±4m accuracy)
              </span>
            </div>

            <div>
              <label htmlFor="issue-desc" className="block text-xs uppercase tracking-wider text-neutral-300 mb-2 font-medium">
                3. Description & Context (Optional)
              </label>
              <textarea
                id="issue-desc"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Deep pothole causing two-wheelers to swerve dangerously near the intersection..."
                className="w-full bg-neutral-900 border border-white/15 text-white text-xs p-3 rounded-md focus:border-white focus:outline-none placeholder:text-neutral-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900 border border-white/10 rounded-md text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Simulated Photo Attached (1080p road surface)</span>
              </div>
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className="text-[11px] text-neutral-400 hover:text-white underline"
              >
                {hasPhoto ? 'Remove' : 'Re-attach'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-md bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider py-3.5 hover:bg-neutral-100 transition-colors shadow"
              >
                Submit Demo Report
              </button>
            </div>

            <div className="text-[10px] text-neutral-400 text-center">
              Prototype Demonstration — strictly client-side sandbox
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
