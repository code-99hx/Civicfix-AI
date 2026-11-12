import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { MUNICIPAL_SQUADS } from '../services/authorityData';

export default function AuthorityAssignModal({
  isOpen,
  onClose,
  issue,
  onConfirmAssign,
  isBulk = false,
  selectedCount = 1
}) {
  const [selectedSquad, setSelectedSquad] = useState(
    issue?.assignedTeam && issue.assignedTeam !== 'Unassigned'
      ? issue.assignedTeam
      : MUNICIPAL_SQUADS[0]?.name || ''
  );
  const [workInstructions, setWorkInstructions] = useState('');
  const [priorityOverride, setPriorityOverride] = useState(issue?.severity || 'Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state whenever issue or modal open changes
  useEffect(() => {
    if (isOpen) {
      if (issue) {
        setSelectedSquad(
          issue.assignedTeam && issue.assignedTeam !== 'Unassigned'
            ? issue.assignedTeam
            : MUNICIPAL_SQUADS[0]?.name || ''
        );
        setPriorityOverride(issue.severity || 'Medium');
      }
      setIsSubmitting(false);
    }
  }, [isOpen, issue]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const currentSquadObj = MUNICIPAL_SQUADS.find(s => s.name === selectedSquad) || MUNICIPAL_SQUADS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Realistic brief simulated dispatch turnaround
    setTimeout(() => {
      onConfirmAssign({
        squadName: selectedSquad,
        assigneeName: currentSquadObj?.lead || 'Squad Captain',
        priority: priorityOverride,
        workInstructions
      });
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispatch-modal-title"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col z-[var(--z-modal)] max-h-[92dvh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#f0f2f5] flex items-center justify-between bg-[#fafbfc] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ea580c] text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 id="dispatch-modal-title" className="font-bold text-sm text-[#111827]">
                {isBulk ? `Assign Squad to ${selectedCount} Selected Issues` : 'Dispatch Field Squad'}
              </h3>
              <p className="text-[11px] text-[#6b7280]">
                {isBulk ? 'Bulk work-order allocation' : `${issue?.id || 'Ticket'} • ${issue?.category || 'Civic Infrastructure'}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close dispatch modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto flex-1">
          
          {/* Issue Summary if single */}
          {!isBulk && issue && (
            <div className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#111827]">{issue.title}</span>
                <span className="font-mono text-[#ea580c] font-semibold">{issue.id}</span>
              </div>
              <div className="text-[11px] text-[#6b7280]">
                📍 {issue.locality || 'Ward 112'}
              </div>
            </div>
          )}

          {/* Squad Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[#374151] text-[11px] uppercase tracking-wider">
              Select Field Squad
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {MUNICIPAL_SQUADS.map((squad) => (
                <label
                  key={squad.id}
                  className={`flex items-start justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedSquad === squad.name
                      ? 'border-[#ea580c] bg-[#fff7ed] shadow-2xs ring-1 ring-[#ea580c]/30'
                      : 'border-[#e5e7eb] hover:border-[#d1d5db] bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="squadSelect"
                      value={squad.name}
                      checked={selectedSquad === squad.name}
                      onChange={() => setSelectedSquad(squad.name)}
                      className="mt-0.5 text-[#ea580c] focus:ring-[#ea580c]"
                    />
                    <div>
                      <div className="font-semibold text-[#111827] text-xs">
                        {squad.name}
                      </div>
                      <div className="text-[10px] text-[#6b7280]">
                        Lead: {squad.lead} • {squad.members} Crew Members ({squad.department})
                      </div>
                      <div className="text-[10px] text-[#9ca3af] italic">
                        {squad.specialty}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f3f4f6] text-[#4b5563] flex-shrink-0">
                    {squad.status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority Confirmation */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] text-[11px] uppercase tracking-wider">
                Priority Level
              </label>
              <select
                value={priorityOverride}
                onChange={(e) => setPriorityOverride(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs font-medium text-[#111827] focus:border-[#ea580c] focus:bg-white focus:outline-none"
              >
                <option value="Critical">Critical (12h SLA)</option>
                <option value="High">High (24h SLA)</option>
                <option value="Medium">Medium (48h SLA)</option>
                <option value="Low">Low (72h SLA)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] text-[11px] uppercase tracking-wider">
                Target Team Lead
              </label>
              <input
                type="text"
                readOnly
                value={currentSquadObj?.lead || 'Squad Lead'}
                className="w-full px-2.5 py-1.5 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs font-medium text-[#6b7280] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Work Order Instructions */}
          <div className="space-y-1">
            <label className="block font-semibold text-[#374151] text-[11px] uppercase tracking-wider">
              Dispatch Instructions / Material Notes
            </label>
            <textarea
              rows={2}
              value={workInstructions}
              onChange={(e) => setWorkInstructions(e.target.value)}
              placeholder="e.g. Bring asphalt compactor and warning cones. Coordinate with local traffic police."
              className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] placeholder-[#9ca3af] focus:border-[#ea580c] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Honest Simulation Notice */}
          <div className="p-2.5 rounded-lg bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] text-[11px] flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Simulated Work Order Dispatch: Updates local squad queue and telemetry instantly.</span>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#f0f2f5] flex items-center justify-end gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-touch-target px-4 py-2.5 rounded-xl border border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb] font-medium transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-touch-target px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
