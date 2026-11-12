/**
 * CivicFix AI - Stage 3: Final review & submission confirmation.
 *
 * Redesigned into a premium enterprise confirmation experience with
 * clear intake recap, copyable ticket reference number, and simulated
 * 3-step municipal lifecycle tracker.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { categoryByKey, severityByKey } from './reportModel';

export default function SubmissionConfirmation({
  draft,
  images = [],
  analysis,
  isSubmitting,
  onSubmit,
  onBack,
  onStartAnother,
  onReturnToReports,
  error,
}) {
  const [copied, setCopied] = useState(false);
  const severityInfo = severityByKey(draft.severity);
  const categoryInfo = categoryByKey(draft.category);

  const handleCopyId = () => {
    if (!draft.id) return;
    navigator.clipboard.writeText(draft.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          PRE-SUBMISSION CONFIRMATION
          ======================================================== */}
      {!error && !draft._submitted ? (
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Final Intake Submission
                </h2>
                <p className="text-xs text-slate-500">
                  Ready to record your report into the Ward 112 citizen grievance sandbox.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              Stage 3 of 3
            </span>
          </div>

          {/* Intake Recap Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              Summary of Incident Record
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Title</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{draft.title}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg font-bold bg-orange-50 text-orange-800 border border-orange-200">
                    {categoryInfo.label}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    Severity: {severityInfo.label}
                  </span>
                  {draft.safetyRisk && (
                    <span className="px-2.5 py-1 rounded-lg font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Hazard Flagged
                    </span>
                  )}
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Narrative</span>
                  <p className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200 line-clamp-3">
                    {draft.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Location</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{draft.location.address}</p>
                  <p className="text-slate-500 mt-0.5">
                    {draft.location.locality}, {draft.location.ward || 'Ward 112'}
                  </p>
                  {draft.location.coordinates && (
                    <p className="font-mono text-emerald-700 text-[11px] mt-1 font-semibold">
                      GPS: {draft.location.coordinates}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Attached Proof</span>
                    <span className="font-mono text-slate-500">{images.length} files</span>
                  </div>
                  {images.length > 0 ? (
                    <div className="flex gap-2">
                      {images.slice(0, 3).map((img) => (
                        <div key={img.id} className="w-16 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 relative">
                          {img.previewUrl && <img src={img.previewUrl} alt={img.fileName} className="w-full h-full object-cover" />}
                        </div>
                      ))}
                      {images.length > 3 && (
                        <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                          +{images.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No photos attached</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submission disclaimer */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                By submitting, your grievance is recorded in the citizen demo sandbox (`civicfix_demo_reports`) and will appear under My Reports.
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Checklist</span>
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl transition-all shadow-sm bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recording in Sandbox…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Submit Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      {/* ========================================================
          ERROR STATE
          ======================================================== */}
      {error && (
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Submission Error</h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Back to Edit
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SUCCESS STATE (POST SUBMISSION)
          ======================================================== */}
      {draft._submitted && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6 animate-in fade-in-50 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Civic Grievance Successfully Logged
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Your report has been recorded in the local Ward 112 sandbox and queued for municipal triage.
            </p>
          </div>

          {/* Ticket Reference Code Card */}
          <div className="max-w-sm mx-auto p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-800 block">
              Grievance Reference Number
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-black text-orange-700 tracking-wider">
                {draft.id || 'CF-4089'}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 rounded-lg bg-white border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors shadow-2xs cursor-pointer"
                title="Copy reference number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {copied ? 'Copied to clipboard!' : 'Use this ID to track resolution updates in My Reports'}
            </p>
          </div>

          {/* 3-Step Lifecycle Simulation Timeline */}
          <div className="max-w-lg mx-auto pt-2 pb-2">
            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">Step 1</span>
                <span className="text-xs font-bold text-emerald-950 mt-0.5 block">Intake Recorded</span>
                <span className="text-[10px] text-emerald-700">Completed just now</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                <span className="text-[10px] font-mono font-bold text-orange-800 uppercase block">Step 2</span>
                <span className="text-xs font-bold text-orange-950 mt-0.5 block">AI Triage</span>
                <span className="text-[10px] text-orange-700">In queue for dispatch</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 opacity-70">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Step 3</span>
                <span className="text-xs font-bold text-slate-700 mt-0.5 block">Field Squad</span>
                <span className="text-[10px] text-slate-500">Ward 112 Rapid Team</span>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onReturnToReports}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Track in My Reports</span>
            </button>

            <button
              type="button"
              onClick={onStartAnother}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
