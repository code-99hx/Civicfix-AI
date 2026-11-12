/**
 * CivicFix AI - Issue details form (stage 1).
 *
 * Redesigned into 4 premium structured cards:
 * 1. Incident Essentials (Title, Category, Severity, Safety Risk)
 * 2. Incident Location & Geotagging (Address, Locality, Ward, Map)
 * 3. Incident Narrative (Description, Prompts, AI Polish Helper)
 * 4. Photographic Evidence (Uploader, Sample Photos, Gallery)
 */

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  MapPin,
  Camera,
  Layers,
  Check,
} from 'lucide-react';
import CategoryCombobox from './CategoryCombobox';
import SeveritySelector from './SeveritySelector';
import LocationDetailsForm from './LocationDetailsForm';
import EvidenceUploader from './EvidenceUploader';
import { CATEGORIES, SEVERITIES, LIMITS } from './reportModel';

const WRITING_PROMPTS = [
  'How long has this issue existed?',
  'What is the approximate size or depth?',
  'Does it block pedestrians or two-wheelers?',
  'Did recent weather (rain) make it worse?',
];

export default function IssueDetailsForm({
  draft,
  onChange,
  errors = {},
  images,
  onImagesChange,
  analysis,
}) {
  const [improvementDialog, setImprovementDialog] = useState(null);

  const setField = (field) => (e) => {
    onChange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleSafety = () => {
    onChange((prev) => ({ ...prev, safetyRisk: !prev.safetyRisk }));
  };

  const appendPrompt = (prompt) => {
    onChange((prev) => {
      const addition = `\n• ${prompt}: `;
      if (prev.description.includes(prompt)) return prev;
      return {
        ...prev,
        description: (prev.description ? prev.description.trim() + ' ' : '') + addition,
      };
    });
  };

  const improveDescription = () => {
    const original = draft.description.trim();
    if (!original) return;
    const suggested = original
      .split(/[.!?]+/)
      .filter(Boolean)
      .map((s) => s.trim())
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('. ') + '.';
    setImprovementDialog({ original, suggested });
  };

  const applyImprovement = (text) => {
    onChange((prev) => ({ ...prev, description: text }));
    setImprovementDialog(null);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          CARD 1: INCIDENT ESSENTIALS
          ======================================================== */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              1. Incident Essentials
            </h2>
            <p className="text-xs text-slate-500">
              Provide a clear title, select the correct municipal category, and indicate urgency.
            </p>
          </div>
        </div>

        {/* Issue Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="report-title" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Issue Title <span className="text-orange-600">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {draft.title.length}/{LIMITS.maxTitle}
            </span>
          </div>
          <input
            id="report-title"
            type="text"
            maxLength={LIMITS.maxTitle}
            value={draft.title}
            onChange={setField('title')}
            placeholder="e.g. Deep asphalt pothole near 100ft Road metro entrance"
            aria-required="true"
            aria-invalid={errors.title ? 'true' : 'false'}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${
              errors.title
                ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                : 'border-slate-200 bg-white text-slate-900 focus:border-orange-500 placeholder:text-slate-400'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5" role="alert">
              <span aria-hidden="true">!</span> {errors.title}
            </p>
          )}
        </div>

        {/* Issue Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Incident Category <span className="text-orange-600">*</span>
          </label>
          <CategoryCombobox
            categories={CATEGORIES}
            value={draft.category}
            onChange={setField('category')}
            required
            error={errors.category}
          />
          <p className="text-[11px] text-slate-400">
            Categorizing correctly routes this ticket directly to the right municipal division squad.
          </p>
        </div>

        {/* Severity Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Severity Level (Resident Assessment) <span className="text-orange-600">*</span>
            </label>
            <span className="text-[10px] text-slate-400">Select estimated impact</span>
          </div>
          <SeveritySelector
            severities={SEVERITIES}
            value={draft.severity}
            onChange={setField('severity')}
            error={errors.severity}
          />
          {errors.severity && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5" role="alert">
              <span aria-hidden="true">!</span> {errors.severity}
            </p>
          )}
        </div>

        {/* Public Safety Risk Toggle Card */}
        <div
          onClick={toggleSafety}
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
            draft.safetyRisk
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/10'
              : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
              draft.safetyRisk ? 'bg-amber-600 text-white' : 'border border-slate-300 bg-white'
            }`}
          >
            {draft.safetyRisk && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Immediate Public Hazard or Traffic Obstruction
              </span>
              {draft.safetyRisk && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900 border border-amber-300">
                  Priority Flagged
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Check this if the issue directly blocks pedestrian walkways, risks vehicular accidents, or poses nighttime injury danger.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          CARD 2: INCIDENT LOCATION & GEOTAGGING
          ======================================================== */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              2. Location & Geotagging
            </h2>
            <p className="text-xs text-slate-500">
              Pinpoint the issue location in Ward 112 with GPS or manual address details.
            </p>
          </div>
        </div>

        <LocationDetailsForm
          value={draft.location}
          onChange={setField('location')}
          error={errors}
        />
      </section>

      {/* ========================================================
          CARD 3: INCIDENT NARRATIVE & AI POLISH
          ======================================================== */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              3. Incident Narrative
            </h2>
            <p className="text-xs text-slate-500">
              Provide context, duration, dimensions, and physical observations.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="report-description" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Description <span className="text-orange-600">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {draft.description.length}/{LIMITS.maxDescription}
            </span>
          </div>
          <textarea
            id="report-description"
            rows={5}
            value={draft.description}
            onChange={setField('description')}
            placeholder="Describe what happened, how long it has existed, approximate dimensions (e.g. 2ft wide, 6in deep), and how it affects mobility or safety..."
            className={`w-full px-3.5 py-3 text-sm rounded-xl border transition-all shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${
              errors.description
                ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                : 'border-slate-200 bg-white text-slate-900 focus:border-orange-500 placeholder:text-slate-400'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5" role="alert">
              <span aria-hidden="true">!</span> {errors.description}
            </p>
          )}
        </div>

        {/* Prompt helper chips */}
        <div className="pt-1 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick detail prompt helpers (click to insert)
          </span>
          <div className="flex flex-wrap gap-2">
            {WRITING_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => appendPrompt(prompt)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all cursor-pointer font-medium"
              >
                + {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* AI Polish helper button & suggestion card */}
        <div className="pt-2">
          <button
            type="button"
            onClick={improveDescription}
            disabled={!draft.description.trim()}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Polish description format (local AI helper)</span>
          </button>

          {improvementDialog && (
            <div className="mt-3 p-4 rounded-xl border border-orange-200 bg-orange-50/60 space-y-2.5 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  Suggested Narrative Phrasing
                </span>
                <span className="text-[10px] font-mono text-orange-600 font-bold uppercase">
                  Local suggestion
                </span>
              </div>
              <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-orange-100/80 leading-relaxed font-sans shadow-2xs">
                {improvementDialog.suggested}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => applyImprovement(improvementDialog.suggested)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer shadow-xs"
                >
                  Apply Suggested Phrasing
                </button>
                <button
                  type="button"
                  onClick={() => setImprovementDialog(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          CARD 4: PHOTOGRAPHIC EVIDENCE
          ======================================================== */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              4. Photographic Evidence
            </h2>
            <p className="text-xs text-slate-500">
              Attach images showing the severity, dimensions, and surrounding landmarks.
            </p>
          </div>
        </div>

        <EvidenceUploader images={images} onImagesChange={onImagesChange} />
      </section>
    </div>
  );
}
