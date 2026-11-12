/**
 * CivicFix AI - Report an Issue page (/dashboard/report-issue).
 *
 * Premium, accessible, three-stage AI-assisted civic issue reporting workflow.
 * Stage 1: Issue details + photo evidence.
 * Stage 2: AI review & verification (local demo suggestions only).
 * Stage 3: Final review & submission confirmation.
 *
 * No external AI service, no fabricated coordinates/maps, no real government
 * integration. Submissions are saved to the existing local demo sandbox only.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import {
  DEFAULT_DRAFT,
  validateStep1,
  validateStep2,
  draftHasChanges,
} from './report-issue/reportModel';
import { runLocalAnalysis } from './report-issue/localAnalysis';
import { getDemoReports, addDemoNotification } from '../../services/demoAuth';
import ReportProgressStepper from './report-issue/ReportProgressStepper';
import IssueDetailsForm from './report-issue/IssueDetailsForm';
import AIAnalysisPanel from './report-issue/AIAnalysisPanel';
import ReportReviewPanel from './report-issue/ReportReviewPanel';
import SubmissionConfirmation from './report-issue/SubmissionConfirmation';

/**
 * Persists a report to the existing local demo sandbox without inventing
 * coordinates. Reuses the project's storage keys and notification service.
 */
function saveReportLocally(report, setReports, showToast) {
  const current = getDemoReports();
  const id = `CF-${Math.floor(4100 + Math.random() * 900)}`;
  const primary = report.images.find((img) => img.primary) || report.images[0];
  const saved = {
    ...report,
    id,
    submittedAt: 'Just now',
    status: 'Awaiting Review',
    createdAt: new Date().toISOString(),
    lat: report.lat || null,
    lng: report.lng || null,
    coordinates: report.coordinates || null,
    images: report.images.filter((img) => img.status !== 'error'),
    source: 'citizen-demo-intake',
    photo: primary ? primary.previewUrl : null,
    updates: [
      { time: 'Just now', text: 'Report submitted by citizen via demo intake', author: 'Citizen' },
    ],
  };
  // Coordinates are only stored when genuinely provided by the user — never fabricated.
  const updated = [saved, ...current];
  try {
    localStorage.setItem('civicfix_demo_reports', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist demo report:', e);
  }
  setReports(updated);
  addDemoNotification({
    title: `Report Submitted: ${saved.id}`,
    desc: `Your grievance (${saved.id}) has been recorded in the local demo sandbox and queued for review.`,
    type: 'dispatch',
    reportId: saved.id,
  });
  if (showToast) showToast(`Report ${id} recorded in demo sandbox.`);
  return { ...saved, id };
}

export default function CitizenReportIssuePage() {
  const { setReports, showToast } = useOutletContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [draft, setDraft] = useState(() => {
    const base = { ...DEFAULT_DRAFT };
    const catParam = searchParams.get('category');
    const map = {
      roads: 'road-damage',
      garbage: 'garbage-waste',
      streetlights: 'streetlights',
      water: 'water-leakage',
      drainage: 'drainage-sewage',
    };
    if (catParam && map[catParam]) {
      base.category = map[catParam];
    }
    return base;
  });
  const [analysis, setAnalysis] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [submissionError, setSubmissionError] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const dirty = draftHasChanges(draft);
  const hasContent =
    dirty ||
    draft.title.length > 0 ||
    draft.category.length > 0 ||
    draft.location.address.length > 0 ||
    draft.description.length > 0 ||
    draft.images.length > 0;

  const setField = useCallback(
    (field) => (value) => {
      setDraft((prev) => {
        const next = { ...prev, [field]: value };
        // Analysis becomes stale when suggestion inputs change
        if (['title', 'description', 'category'].includes(field)) {
          next.analysis = null;
        }
        return next;
      });
      setAnalysis(null);
    },
    []
  );

  const onImagesChange = (nextImages) => {
    setDraft((prev) => ({ ...prev, images: nextImages }));
    setAnalysis(null);
  };

  const onAcceptSuggestion = (field, value) => {
    if (field === 'category') {
      setDraft((prev) => ({ ...prev, category: value, analysis: null }));
    } else     if (field === 'title') {
      setDraft((prev) => ({ ...prev, title: value, analysis: null }));
    }
  };

  const onIgnoreSuggestion = () => {
    // User choice preserved; nothing to do
  };

  const goToStep = (targetStep) => {
    if (targetStep === step) return;

    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    if (targetStep === 2) {
      const result = validateStep1(draft);
      setErrors(result.errors);
      if (!result.ok) return;
      setCompletedSteps((prev) => (prev.includes(1) ? prev : [...prev, 1]));
      setStep(2);
      return;
    }

    if (targetStep === 3) {
      const result = validateStep2(draft);
      setErrors(result.errors);
      const checklist = draft._checklist || {};
      const allChecked =
        checklist.detailsReviewed &&
        checklist.locationVerified &&
        checklist.evidenceConfirmed &&
        checklist.aiAdvisoryUnderstood;
      if (!result.ok || !allChecked) return;
      setCompletedSteps((prev) => (prev.includes(2) ? prev : [...prev, 2]));
      setStep(3);
      return;
    }

    setStep(targetStep);
  };

  const onChecklistToggle = (key) => {
    setDraft((prev) => ({
      ...prev,
      _checklist: {
        ...(prev._checklist || {}),
        [key]: !(prev._checklist || {})[key],
      },
    }));
  };

  const handleRunAnalysis = () => {
    const nextVersion = (draft.analysisVersion || 0) + 1;
    setDraft((prev) => ({ ...prev, analysisVersion: nextVersion, analysis: null }));
    setAnalysis(null);
    setTimeout(() => {
      const result = runLocalAnalysis({ ...draft, analysisVersion: nextVersion });
      setDraft((prev) => ({ ...prev, analysis: result }));
      setAnalysis(result);
    }, 900);
  };

  const handleSubmit = () => {
    setStatus('submitting');
    setSubmissionError(null);

    const payload = {
      title: draft.title.trim(),
      category: draft.category,
      severity: draft.severity,
      safetyRisk: draft.safetyRisk,
      location: {
        address: draft.location.address.trim(),
        locality: draft.location.locality.trim(),
        landmark: draft.location.landmark.trim(),
        ward: draft.location.ward,
        postalCode: draft.location.postalCode.trim(),
        lat: draft.location.lat,
        lng: draft.location.lng,
        coordinates: draft.location.coordinates,
        source: draft.location.source,
      },
      description: draft.description.trim(),
      images: draft.images.map((img) => ({
        id: img.id,
        fileName: img.fileName,
        size: img.size,
        type: img.type,
        width: img.width,
        height: img.height,
        caption: img.caption,
        primary: img.primary,
      })),
      contactPreference: draft.contactPreference,
      analysis: analysis,
    };

    // Simulate a submission round-trip so loading/disabled states are real
    setTimeout(() => {
      try {
        const saved = saveReportLocally(payload, setReports, showToast);
        setSubmittedReport(saved);
        setDraft((prev) => ({ ...prev, _submitted: true }));
        setStatus('success');
        setStep(3);
        setCompletedSteps([1, 2, 3]);
      } catch (err) {
        setStatus('error');
        setSubmissionError(
          'Unable to save the report right now. Please try again, or return to edit and retry.'
        );
      }
    }, 1000);
  };

  const handleStartAnother = () => {
    setDraft({ ...DEFAULT_DRAFT });
    setAnalysis(null);
    setErrors({});
    setStatus('idle');
    setSubmissionError(null);
    setSubmittedReport(null);
    setCompletedSteps([]);
    setStep(1);
  };

  const headerDraftStatus = dirty ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-100">
      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" /> Unsaved changes
    </span>
  ) : hasContent ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
      Draft in this session
    </span>
  ) : null;

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <IssueDetailsForm
          draft={draft}
          onChange={setField}
          errors={errors}
          images={draft.images}
          onImagesChange={onImagesChange}
          analysis={analysis}
          onRunAnalysis={handleRunAnalysis}
          onAcceptSuggestion={onAcceptSuggestion}
          onIgnoreSuggestion={onIgnoreSuggestion}
        />
      );
    }

    if (step === 2) {
      const checklist = draft._checklist || {
        detailsReviewed: false,
        locationVerified: false,
        evidenceConfirmed: false,
        aiAdvisoryUnderstood: false,
      };
      return (
        <ReportReviewPanel
          draft={draft}
          analysis={analysis}
          images={draft.images}
          checklist={checklist}
          onEditField={(field) => {
            setStep(1);
            setTimeout(() => {
              const el = document.getElementById(`report-${field}`) || document.getElementById(`report-location-${field}`);
              if (el) el.focus();
            }, 50);
          }}
          onAcceptSuggestion={(field) => {
            const value =
              field === 'category' ? analysis.suggestedCategoryKey : analysis.suggestedTitle;
            onAcceptSuggestion(field, value);
            setStep(2);
          }}
          onIgnoreSuggestion={onIgnoreSuggestion}
          onChecklistToggle={onChecklistToggle}
        />
      );
    }

    return (
      <SubmissionConfirmation
        draft={{ ...draft, id: submittedReport?.id }}
        images={draft.images}
        analysis={analysis}
        isSubmitting={status === 'submitting'}
        onSubmit={handleSubmit}
        onBack={() => setStep(2)}
        onStartAnother={handleStartAnother}
        onReturnToReports={() => {
          handleStartAnother();
          navigate('/dashboard/reports');
        }}
        error={status === 'error' ? submissionError : null}
      />
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Workspace header */}
      <header className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5">
              <span>Citizen Workspace</span>
              <span>/</span>
              <span className="text-orange-600 font-bold">Report an Issue</span>
              <span>/</span>
              <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                Ward 112 • Indiranagar
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Report a Civic Grievance
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Submit infrastructure grievances with geolocation and photo proof to trigger municipal triage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPrivacyOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              aria-expanded={privacyOpen}
              aria-controls="evidence-privacy-panel"
            >
              <span>How evidence is handled</span>
            </button>
            {headerDraftStatus}
          </div>
        </div>

        {privacyOpen && (
          <div
            id="evidence-privacy-panel"
            className="rounded-xl border border-orange-200/90 bg-orange-50/50 p-4 text-xs text-slate-700 space-y-2 animate-in fade-in-50 duration-150"
          >
            <div className="font-bold text-orange-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Evidence Handling & Privacy Guarantees</span>
            </div>
            <p className="leading-relaxed">
              Photo previews are generated locally on your device via standard browser Blob URLs (`URL.createObjectURL`). No images or descriptions leave your browser during drafting.
            </p>
            <p className="leading-relaxed text-slate-600">
              When submitted, the report is saved directly to your browser's demo storage (`civicfix_demo_reports`) to simulate municipal workflows. No data is sent to external servers or government tracking systems in demo mode.
            </p>
          </div>
        )}
      </header>

      {/* Step indicator */}
      <ReportProgressStepper
        currentStep={step}
        completedSteps={completedSteps}
        onStepSelect={goToStep}
      />

      {/* Main workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {renderStepContent()}
        </div>

        <div className="lg:col-span-4 space-y-5">
          <AIAnalysisPanel
            draft={draft}
            analysis={analysis}
            onRunAnalysis={handleRunAnalysis}
            onAcceptSuggestion={onAcceptSuggestion}
            onIgnoreSuggestion={onIgnoreSuggestion}
          />

          {/* Draft Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Draft Status
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                Session Sandbox
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Title</span>
                <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                  draft.title ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {draft.title ? 'Set' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category</span>
                <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                  draft.category ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {draft.category ? 'Selected' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location GPS</span>
                <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                  draft.location.address ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {draft.location.address ? 'Entered' : 'Required'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Evidence Proof</span>
                <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {draft.images.length} photos attached
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 leading-relaxed">
              Your edits persist in memory for this session and are saved to demo storage on submit.
            </p>
          </div>
        </div>
      </div>

      {/* Step navigation footer (Sticky on mobile above bottom navigation, static on desktop) */}
      <footer className="sticky bottom-16 lg:static z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-lg sm:shadow-xs flex items-center justify-between gap-3 transition-all">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="min-touch-target px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" /> <span>Back</span>
          </button>
        ) : <div />}

        {step === 1 && (
          <button
            type="button"
            onClick={() => goToStep(2)}
            disabled={Object.keys(validateStep1(draft).errors).length > 0}
            className="min-touch-target px-5 sm:px-6 py-2.5 rounded-xl transition-all shadow-xs bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to AI Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {step === 2 && (
          <button
            type="button"
            onClick={() => goToStep(3)}
            disabled={
              Object.keys(validateStep2(draft).errors).length > 0 ||
              !(draft._checklist?.detailsReviewed) ||
              !(draft._checklist?.locationVerified) ||
              !(draft._checklist?.evidenceConfirmed) ||
              !(draft._checklist?.aiAdvisoryUnderstood)
            }
            className="min-touch-target px-5 sm:px-6 py-2.5 rounded-xl transition-all shadow-xs bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to Final Submit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
