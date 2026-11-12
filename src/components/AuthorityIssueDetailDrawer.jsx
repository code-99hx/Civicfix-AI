import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Users, 
  Send, 
  ExternalLink, 
  Check, 
  Clock 
} from 'lucide-react';
import { getSlaCondition } from '../services/authorityData';
import AuthorityAssignModal from './AuthorityAssignModal';

const STATUS_OPTIONS = ['New', 'Awaiting Review', 'In Progress', 'Resolved'];
const SEVERITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

export default function AuthorityIssueDetailDrawer({ 
  issue, 
  onClose, 
  onUpdateIssue, 
  onNavigateToMap,
  showToast 
}) {
  const [newNote, setNewNote] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'notes'

  // Handle Escape key to close drawer
  useEffect(() => {
    if (!issue) return;
    const handleKeyDown = (e) => {
      // Only close if assignModal is not open
      if (e.key === 'Escape' && !assignModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [issue, assignModalOpen, onClose]);

  if (!issue) return null;

  const slaCondition = getSlaCondition(issue);

  const handleStatusChange = (newStatus) => {
    onUpdateIssue(issue.id, {
      status: newStatus,
      statusNote: `Status changed from ${issue.status} to ${newStatus}`
    });
    if (showToast) showToast(`Issue ${issue.id} status changed to ${newStatus}`);
  };

  const handleSeverityChange = (newSev) => {
    onUpdateIssue(issue.id, {
      severity: newSev,
      statusNote: `Priority re-assessed to ${newSev}`
    });
    if (showToast) showToast(`Priority updated to ${newSev}`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const formatted = `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Municipal Officer]: ${newNote.trim()}`;
    const combinedNotes = issue.internalNotes ? `${issue.internalNotes}\n${formatted}` : formatted;

    onUpdateIssue(issue.id, {
      internalNotes: combinedNotes,
      statusNote: `Operational note added: "${newNote.trim()}"`
    });

    setNewNote('');
    if (showToast) showToast('Operational note recorded in audit log');
  };

  const handleAssignConfirm = ({ squadName, assigneeName, workInstructions }) => {
    onUpdateIssue(issue.id, {
      assignedTeam: squadName,
      assignedTo: assigneeName,
      status: issue.status === 'New' ? 'In Progress' : issue.status,
      internalNotes: workInstructions 
        ? `${issue.internalNotes ? `${issue.internalNotes}\n` : ''}[Dispatch Order]: ${workInstructions}`
        : issue.internalNotes,
      statusNote: `Dispatched to ${squadName} (${assigneeName})`
    });
    if (showToast) showToast(`Dispatched to ${squadName}`);
  };

  // Severity styles
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  // SLA condition styles
  const getSlaBadge = (condition) => {
    switch (condition) {
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'Due Soon':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const drawerElement = (
    <>
      <div 
        className="fixed inset-0 z-[var(--z-drawer-backdrop)] flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-detail-drawer-title"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-xl bg-white h-[100dvh] max-h-screen shadow-2xl flex flex-col border-l border-[#e5e7eb] overflow-hidden z-[var(--z-drawer)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-[#f0f2f5] bg-white flex items-center justify-between flex-shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {issue.id}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(issue.severity)}`}>
                  {issue.severity}
                </span>
                <span className="text-[11px] font-semibold text-[#6b7280]">
                  {issue.department}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSlaBadge(slaCondition)}`}>
                  SLA: {slaCondition}
                </span>
              </div>
              <h2 id="issue-detail-drawer-title" className="font-bold text-sm sm:text-base text-[#111827] line-clamp-1">
                {issue.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#f0f2f5] px-5 text-xs bg-[#fafbfc] flex-shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#ea580c] text-[#ea580c]'
                  : 'border-transparent text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              Operations & Triage
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-[#ea580c] text-[#ea580c]'
                  : 'border-transparent text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              Audit Trail ({issue.statusHistory?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2.5 px-3 font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-[#ea580c] text-[#ea580c]'
                  : 'border-transparent text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              Internal Notes
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
            
            {activeTab === 'overview' && (
              <>
                {/* Evidence Photo */}
                {issue.photo && (
                  <div className="space-y-1.5">
                    <div className="relative rounded-xl overflow-hidden border border-[#e5e7eb] group">
                      <img 
                        src={issue.photo} 
                        alt="Civic issue photographic evidence" 
                        className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300" 
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-white text-[10px] flex items-center justify-between">
                        <span>Geotagged Citizen Evidence</span>
                        <span className="font-mono text-neutral-300">
                          {issue.hasValidCoords ? `${issue.latitude.toFixed(4)}° N, ${issue.longitude.toFixed(4)}° E` : 'Unverified GPS'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Transition Control */}
                <div className="space-y-2 p-3.5 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#374151] uppercase tracking-wider">
                      Operational Status Workflow
                    </span>
                    <span className="text-[10px] text-[#6b7280]">
                      Current: <strong className="text-[#111827]">{issue.status}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {STATUS_OPTIONS.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(st)}
                        className={`py-2 px-2 rounded-lg font-semibold text-xs border transition-all cursor-pointer text-center ${
                          issue.status === st
                            ? st === 'Resolved'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : st === 'In Progress'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : st === 'Awaiting Review'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-[#ea580c] text-white border-[#ea580c] shadow-xs'
                            : 'bg-white border-[#d1d5db] text-[#4b5563] hover:bg-[#f3f4f6]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority / Severity Level */}
                <div className="space-y-2 p-3.5 bg-white border border-[#e5e7eb] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#374151] uppercase tracking-wider">
                      Severity & SLA Urgency
                    </span>
                    <span className="text-[10px] text-[#6b7280]">
                      Target: {issue.severity === 'Critical' ? '12 Hours' : issue.severity === 'High' ? '24 Hours' : issue.severity === 'Medium' ? '48 Hours' : '72 Hours'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {SEVERITY_OPTIONS.map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => handleSeverityChange(sev)}
                        className={`py-1.5 px-1.5 rounded-lg font-semibold text-[11px] border transition-all cursor-pointer text-center ${
                          issue.severity === sev
                            ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                            : 'bg-[#f9fafb] border-[#e5e7eb] text-[#4b5563] hover:bg-[#f3f4f6]'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field Squad Allocation */}
                <div className="p-3.5 bg-white border border-[#e5e7eb] rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>Assigned Field Squad</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setAssignModalOpen(true)}
                      className="px-2.5 py-1 rounded-md bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      {issue.assignedTeam === 'Unassigned' ? 'Assign Squad' : 'Reassign Squad'}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#111827]">
                        {issue.assignedTeam}
                      </div>
                      <div className="text-[10px] text-[#6b7280]">
                        {issue.assignedTo ? `Lead Officer: ${issue.assignedTo}` : 'No individual assigned'}
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      issue.assignedTeam === 'Unassigned'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {issue.assignedTeam === 'Unassigned' ? 'Action Required' : 'Active Squad'}
                    </span>
                  </div>
                </div>

                {/* Geographic & Locality Coordinates */}
                <div className="p-3.5 bg-white border border-[#e5e7eb] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                      <span>Geographic Coordinates</span>
                    </span>

                    {issue.hasValidCoords && onNavigateToMap && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToMap(issue);
                        }}
                        className="text-[#ea580c] hover:text-[#c2410c] font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Focus on Map</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-[#111827]">{issue.locality}</div>
                    <div className="text-[11px] text-[#6b7280]">{issue.ward}</div>
                    <div className="font-mono text-[10px] text-[#4b5563] pt-0.5">
                      {issue.hasValidCoords ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Verified GPS: {issue.latitude.toFixed(6)}° N, {issue.longitude.toFixed(6)}° E
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          GPS Unverified • Location recorded by text only
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Citizen Report Description */}
                <div className="space-y-1.5">
                  <div className="font-bold text-[11px] text-[#374151] uppercase tracking-wider">
                    Citizen Grievance Description
                  </div>
                  <p className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-[#374151] leading-relaxed text-xs">
                    {issue.description}
                  </p>
                </div>

                {/* AI-Assisted Triage Heuristic Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-orange-50/50 via-[#fafbfc] to-white border border-orange-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#ea580c] text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Dispatch Triage Analysis</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-[#ea580c] font-bold">
                      DEMO MODEL
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#4b5563]">
                    <div>
                      • <strong>Potential Duplicates:</strong> {issue.duplicatesCount || 0} consolidated reports within 150m buffer.
                    </div>
                    <div>
                      • <strong>Category Confidence:</strong> 99.1% match for municipal infrastructure category.
                    </div>
                    <div>
                      • <strong>SLA Impact:</strong> Calculated priority targets resolution before {new Date(issue.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(issue.dueAt).toLocaleDateString()}.
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Audit Trail Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-3">
                <div className="font-bold text-[11px] text-[#374151] uppercase tracking-wider">
                  Audit History & Status Log
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e5e7eb]">
                  {issue.statusHistory?.map((entry, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#ea580c] ring-4 ring-white" />
                      <div className="flex items-center justify-between text-[10px] text-[#9ca3af]">
                        <span className="font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
                        <span className="font-semibold text-[#4b5563]">{entry.author}</span>
                      </div>
                      <div className="font-semibold text-xs text-[#111827]">
                        Status: <span className="text-[#ea580c]">{entry.status}</span>
                      </div>
                      <div className="text-[11px] text-[#6b7280]">
                        {entry.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="font-bold text-[11px] text-[#374151] uppercase tracking-wider">
                  Operational Dispatch Notes
                </div>

                {issue.internalNotes ? (
                  <div className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] font-mono text-[11px] text-[#374151] whitespace-pre-wrap leading-relaxed">
                    {issue.internalNotes}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] text-center text-[#9ca3af] italic">
                    No internal notes recorded yet.
                  </div>
                )}

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-[#f0f2f5]">
                  <label className="block font-semibold text-[#374151] text-[11px]">
                    Add Internal Operational Note
                  </label>
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter dispatch updates, material requisition, or field findings..."
                    className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-xl text-xs text-[#111827] placeholder-[#9ca3af] focus:border-[#ea580c] focus:bg-white focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Note</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Footer Quick Actions */}
          <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between flex-shrink-0">
            <button
              onClick={onClose}
              className="min-touch-target px-4 py-2 rounded-xl border border-[#d1d5db] text-[#374151] hover:bg-white font-medium transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAssignModalOpen(true)}
                className="min-touch-target px-3.5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Dispatch</span>
              </button>

              {issue.status !== 'Resolved' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('Resolved')}
                  className="min-touch-target px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </button>
              )}
              {issue.status === 'Resolved' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('In Progress')}
                  className="min-touch-target px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Reopen</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Squad Assign Modal */}
      <AuthorityAssignModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        issue={issue}
        onConfirmAssign={handleAssignConfirm}
      />
    </>
  );

  return createPortal(drawerElement, document.body);
}
