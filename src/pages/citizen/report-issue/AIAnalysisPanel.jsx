/**
 * CivicFix AI - AI assistance panel.
 *
 * Transparent local demo assistance only. Deterministic heuristics — no
 * external AI service, no model, no data leaves the browser. Results are
 * advisory and clearly labeled.
 *
 * Redesigned into a cohesive, high-end AI Copilot card with circular readiness,
 * smart recommendation pills, and clear municipal SLA guidance.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  Check,
  ArrowRight,
  ShieldCheck,
  Gauge,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const ANALYSIS_STAGES = [
  'Parsing title & narrative keywords…',
  'Evaluating municipal category match…',
  'Validating photo resolution & size…',
  'Synthesizing readiness scorecard…',
];

export default function AIAnalysisPanel({
  draft,
  analysis,
  onRunAnalysis,
  onAcceptSuggestion,
  onIgnoreSuggestion,
}) {
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(true);
  const intervalRef = useRef(null);

  const runAnalysis = useCallback(() => {
    setError(null);
    setRunning(true);
    setStage(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      setStage((s) => (s < ANALYSIS_STAGES.length - 1 ? s + 1 : s));
      i += 1;
      if (i >= ANALYSIS_STAGES.length) {
        clearInterval(intervalRef.current);
        setRunning(false);
        intervalRef.current = null;
      }
    }, 400);
    onRunAnalysis();
  }, [onRunAnalysis]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const acceptCategory = () => onAcceptSuggestion('category', analysis.suggestedCategoryKey);
  const acceptTitle = () => onAcceptSuggestion('title', analysis.suggestedTitle);

  // Calculate readiness percentage
  const readinessPct = analysis
    ? Math.round((analysis.readinessScore / analysis.readinessMax) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* ========================================================
          COPILOT MAIN CARD
          ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs relative overflow-hidden">
        {/* Subtle orange accent glow in background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-orange-400/10 via-amber-300/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-orange-600 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>CivicFix AI Assistant</span>
              </h3>
              <p className="text-[11px] text-slate-500">Heuristic Triage Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200/80">
              Local Demo
            </span>
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-700 min-touch-target flex items-center justify-center"
              aria-label={isMobileOpen ? 'Collapse AI panel' : 'Expand AI panel'}
            >
              {isMobileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className={isMobileOpen ? 'block' : 'hidden lg:block'}>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Runs client-side keyword heuristics to check report completeness, categorize issues, and guide submission readiness without sending personal data externally.
          </p>

        {/* Trigger / Status action */}
        {running ? (
          <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-orange-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                Analyzing incident details…
              </span>
              <span className="text-[10px] font-mono text-orange-700">Stage {stage + 1}/4</span>
            </div>
            <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ease-out"
                style={{ width: `${((stage + 1) / ANALYSIS_STAGES.length) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-orange-800 font-mono truncate">
              {ANALYSIS_STAGES[stage]}
            </p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>Analysis could not complete. You can still submit safely.</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={runAnalysis}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-xs bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold text-xs sm:text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analysis ? 'Re-run AI Analysis' : 'Analyze Report with AI'}</span>
          </button>
        )}

        {analysis && !running && (
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified locally
            </span>
            <span>Last ran at {new Date(analysis.ranAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        </div>
      </div>

      <div className={isMobileOpen ? 'space-y-4' : 'hidden lg:space-y-4 lg:block'}>
      {/* ========================================================
          ANALYSIS RESULTS (When ready)
          ======================================================== */}
      {analysis && !running && (
        <div className="space-y-3.5 animate-in fade-in-50 duration-200">
          {/* Readiness Score Box */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-orange-600" />
                Readiness Score
              </span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                readinessPct >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {readinessPct}% Complete
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  readinessPct >= 80 ? 'bg-emerald-500' : 'bg-orange-500'
                }`}
                style={{ width: `${readinessPct}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2 pt-1">
              {Object.entries(analysis.readiness).map(([key, passed]) => {
                const labels = {
                  title: 'Title Specificity',
                  category: 'Category Assignment',
                  severity: 'Resident Severity Level',
                  location: 'Location / Geotag',
                  description: 'Detailed Narrative',
                  evidence: 'Photo Evidence (Optional)',
                };
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        passed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {passed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                      </div>
                      <span>{labels[key]}</span>
                    </span>
                    <span className={`text-[10px] font-bold ${
                      passed ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      {passed ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Category Recommendation (if divergent) */}
          {analysis.suggestedCategory && !analysis.categoryMatchesUser && (
            <div className="bg-white border border-orange-200 rounded-2xl p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  Category Recommendation
                </span>
                <span className="text-[10px] font-mono text-orange-600 font-bold">
                  {analysis.categoryConfidence}% match
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Your description suggests this could be categorized as:
              </p>
              <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs font-bold text-orange-950 flex items-center justify-between">
                <span>{analysis.suggestedCategory}</span>
                <button
                  type="button"
                  onClick={acceptCategory}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Title Recommendation (if available and not applied) */}
          {analysis.suggestedTitle && draft.title !== analysis.suggestedTitle && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  Suggested Title
                </span>
                <button
                  type="button"
                  onClick={acceptTitle}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer flex items-center gap-1"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-medium truncate">
                {analysis.suggestedTitle}
              </p>
            </div>
          )}

          {/* Description Clarity Summary */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Narrative Clarity
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {analysis.clarityPassed} of {analysis.clarityTotal} covered
              </span>
            </div>
            <div className="space-y-1.5">
              {analysis.clarityChecks.map((check) => (
                <div key={check.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    check.pass ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-300'
                  }`}>
                    {check.pass ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                  </div>
                  <span className={check.pass ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          WARD 112 DISPATCH SLA CARD
          ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Ward 112 Dispatch SLA
          </span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
            Simulated
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          High-priority road and electrical grievances in Indiranagar are typically triaged by municipal squads within <strong>2–4 hours</strong> of submission.
        </p>
      </div>
      </div>
    </div>
  );
}
