/**
 * CivicFix AI - Stage 2: AI review & verification panel.
 *
 * Summarizes the draft, shows AI suggestions labeled by source, lists
 * missing information, and lets the resident verify every section before
 * submitting.
 *
 * Redesigned into executive SaaS review cards with clean grid, checklist items,
 * and clear edit triggers.
 */

import React from 'react';
import {
  MapPin,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
  Check,
  ArrowRight,
  List,
  Edit3,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { severityByKey, categoryByKey } from './reportModel';

export default function ReportReviewPanel({
  draft,
  analysis,
  images = [],
  checklist = {},
  onEditField,
  onAcceptSuggestion,
  onIgnoreSuggestion,
  onChecklistToggle,
}) {
  const toggleCheck = (key) => {
    onChecklistToggle(key);
  };

  const allChecked =
    checklist.detailsReviewed &&
    checklist.locationVerified &&
    checklist.evidenceConfirmed &&
    checklist.aiAdvisoryUnderstood;

  const severityInfo = severityByKey(draft.severity);
  const categoryInfo = categoryByKey(draft.category);

  const missing = [];
  if (!draft.title.trim()) missing.push('Issue title');
  if (!draft.category) missing.push('Issue category');
  if (!draft.severity) missing.push('Severity assessment');
  if (!draft.location.address) missing.push('Street address');
  if (draft.description.length < 20) missing.push('Detailed description');

  return (
    <div className="space-y-6">
      {/* Top Review Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Review & Verification Checklist
              </h2>
              <p className="text-xs text-slate-500">
                Verify the incident summary below before logging it into the Ward 112 sandbox.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Stage 2 of 3
          </span>
        </div>
      </div>

      {/* Missing information warning */}
      {missing.length > 0 && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50/80 text-xs text-red-800 space-y-1 animate-in fade-in-50 duration-150">
          <div className="flex items-center gap-2 font-bold text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Missing Required Information</span>
          </div>
          <p className="leading-relaxed">
            Please complete the following fields before continuing: <strong>{missing.join(', ')}</strong>.
          </p>
        </div>
      )}

      {/* Incident Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Classification */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              Incident Details
            </span>
            <button
              type="button"
              onClick={() => onEditField('title')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Title</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                {draft.title || <span className="text-slate-400 italic">Not entered</span>}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Category</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200/80">
                  {draft.category ? categoryInfo.label : 'Not selected'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Resident Severity</span>
                <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {draft.severity ? severityInfo.label : 'Not set'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Hazard Flag</span>
                <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                  draft.safetyRisk
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {draft.safetyRisk ? 'Immediate Hazard' : 'Standard'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase mb-1">Description</span>
              <div className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed font-sans max-h-32 overflow-y-auto">
                {draft.description || <span className="text-slate-400 italic">No description provided</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Location & Photos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              Location & Evidence
            </span>
            <button
              type="button"
              onClick={() => onEditField('location')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Street Address</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {draft.location.address || <span className="text-slate-400 italic">Not entered</span>}
              </p>
              {draft.location.locality && (
                <p className="text-xs text-slate-500">{draft.location.locality}, {draft.location.ward || 'Ward 112'}</p>
              )}
            </div>

            {draft.location.landmark && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Landmark</span>
                <p className="text-xs text-slate-700">{draft.location.landmark}</p>
              </div>
            )}

            {draft.location.coordinates && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium w-fit">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>{draft.location.coordinates}</span>
              </div>
            )}

            {/* Photo Previews */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Attached Photos</span>
                <span className="text-xs font-mono font-bold text-slate-500">{images.length} images</span>
              </div>
              {images.length === 0 ? (
                <div className="h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 flex items-center justify-center text-xs text-slate-400">
                  No photos attached (optional)
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(0, 3).map((img) => (
                    <div
                      key={img.id}
                      className={`relative aspect-video rounded-lg overflow-hidden border ${
                        img.primary ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
                      } bg-slate-100`}
                    >
                      {img.previewUrl ? (
                        <img src={img.previewUrl} alt={img.fileName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                      {img.primary && (
                        <span className="absolute bottom-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resident Verification Checklist */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Resident Verification Checklist
            </h3>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            allChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {Object.values(checklist).filter(Boolean).length} of 4 confirmed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'detailsReviewed', label: 'I reviewed the title, category, and severity assessment' },
            { id: 'locationVerified', label: 'The location, landmark, and ward details are accurate' },
            { id: 'evidenceConfirmed', label: 'The photo evidence represents the actual issue' },
            {
              id: 'aiAdvisoryUnderstood',
              label: 'I understand AI suggestions are advisory and I take responsibility for details',
            },
          ].map((item) => {
            const checked = !!checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                  checked
                    ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-100/60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    checked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <label className="text-xs text-slate-700 leading-relaxed font-medium cursor-pointer">
                  {item.label}
                </label>
              </div>
            );
          })}
        </div>

        {!allChecked && (
          <p className="text-xs text-orange-700 font-medium flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5" />
            <span>Please confirm all 4 checklist items above to enable final submission.</span>
          </p>
        )}
      </div>

      {/* Advisory notice */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Advisory Notice:</strong> CivicFix AI suggestions are local heuristics designed to help classify public grievances. Submitting logs this issue to the demo sandbox; no official civic authority or emergency services are automatically contacted in demo mode.
        </p>
      </div>
    </div>
  );
}
