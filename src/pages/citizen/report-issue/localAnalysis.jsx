/**
 * CivicFix AI - Local (client-side) analysis helper.
 *
 * Transparent demo assistance only. No external AI service is called, no images
 * or descriptions leave the browser, and no machine-learning model is used.
 * Results are deterministic keyword heuristics and must be labeled as such.
 */

import { CATEGORIES, categoryByKey, LIMITS } from './reportModel';

export const ANALYSIS_SOURCE = 'local-demo';

function scoreKeywords(text, keywords) {
  const lower = String(text || '').toLowerCase();
  let hits = 0;
  keywords.forEach((kw) => {
    if (kw && lower.includes(kw.toLowerCase())) hits += 1;
  });
  return keywords.length ? hits / keywords.length : 0;
}

function titleWords(text) {
  return String(text || '').split(/\s+/).filter(Boolean).length;
}

export function runLocalAnalysis(draft) {
  const { title, category, severity, description, images, location } = draft;
  const fieldsUsed = [];
  if (title) fieldsUsed.push('issue title');
  if (description) fieldsUsed.push('description');
  if (category) fieldsUsed.push('selected category');
  if (images.length) fieldsUsed.push('photo evidence');
  if (location.address) fieldsUsed.push('location');

  // --- Suggested category (keyword heuristic, never overwrites user choice) ---
  const blob = `${title} ${description}`;
  let suggestedCategory = category;
  let suggestedCategoryKey = category;
  let topScore = 0;
  let categoryConfidence = 0;
  CATEGORIES.forEach((cat) => {
    const score = scoreKeywords(blob, cat.keywords);
    if (score > topScore) {
      topScore = score;
      suggestedCategoryKey = cat.key;
      suggestedCategory = cat.label;
      categoryConfidence = score;
    }
  });
  const categoryMatchesUser = suggestedCategoryKey === category;
  fieldsUsed.push('category suggestion (local keywords)');

  // --- Suggested title ---
  let suggestedTitle = '';
  if (description) {
    const firstSentence = String(description).split(/[.!?]/).filter(Boolean)[0] || '';
    const trimmed = firstSentence.trim();
    suggestedTitle =
      trimmed.length > 0 && trimmed.length <= LIMITS.maxTitle
        ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
        : '';
  }
  if (!suggestedTitle && category) {
    suggestedTitle = `${categoryByKey(category).label} reported at ${location.address || 'location'}`;
  }
  fieldsUsed.push('title suggestion (local heuristic)');

  // --- Description clarity checklist ---
  const desc = String(description || '');
  const clarityChecks = [
    { id: 'duration', label: 'Mentions how long the issue has existed', pass: /\b(days?|weeks?|months?|years?|since|for \d+|ago)\b/i.test(desc) },
    { id: 'size', label: 'Describes approximate size or extent', pass: /\b(inch|feet|ft|meter|metre|cm|mm|deep|wide|large|small|huge)\b/i.test(desc) },
    { id: 'safety', label: 'Notes any safety risk', pass: /\b(risk|hazard|danger|unsafe|accident|fall|slip|injury)\b/i.test(desc) },
    { id: 'length', label: 'Enough detail for a civic worker to act', pass: desc.length >= 40 },
  ];
  const clarityPassed = clarityChecks.filter((c) => c.pass).length;
  fieldsUsed.push('description clarity check');

  // --- Severity comparison (resident assessment vs heuristic hint only) ---
  const severityOrder = { low: 0, moderate: 1, high: 2, critical: 3 };
  let severityHint = null;
  const highRiskWords = ['urgent', 'immediate', 'danger', 'hazard', 'burst', 'collapsing', 'blocked', 'flowing'];
  if (highRiskWords.some((w) => blob.includes(w)) && severityOrder[severity || ''] < 2) {
    severityHint = 'moderate-or-higher';
  }
  const severityComparison = {
    resident: severity,
    hint: severityHint,
    note: severityHint ? 'Resident-selected severity is lower than the language in your description suggests — consider increasing it.' : null,
  };

  // --- Photo quality checks (basic, deterministic, not AI) ---
  const photoChecks = images.map((img) => {
    const checks = [];
    let flagged = false;
    if (img.width && img.height) {
      const minDim = Math.min(img.width, img.height);
      if (minDim < 400) {
        checks.push({ id: 'resolution', label: 'Low resolution', level: 'warning', note: 'Image may be too small to show detail clearly.' });
        flagged = true;
      } else {
        checks.push({ id: 'resolution', label: 'Resolution', level: 'ok', note: `${img.width}×${img.height}` });
      }
    }
    if (img.size > 5 * 1024 * 1024) {
      checks.push({ id: 'size', label: 'Large file', level: 'info', note: formatBytes(img.size) });
    }
    if (!checks.length) checks.push({ id: 'preview', label: 'Preview', level: 'ok', note: 'Ready to view' });
    return { id: img.id, fileName: img.fileName, flagged, checks };
  });

  // --- Duplicate warning: no real comparison dataset -> explicit demo label ---
  const duplicateWarning = {
    available: false,
    label: 'Duplicate report check',
    note: 'No live comparison dataset is configured. Nearby-report matching is a demonstration only.',
    demo: true,
  };

  // --- Evidence completeness ---
  const hasPrimary = images.some((img) => img.primary);
  const evidenceComplete = images.length > 0;
  const evidenceChecks = [
    { id: 'count', label: `${images.length} of ${LIMITS.maxImages} photo evidence slots used`, pass: images.length > 0 },
    { id: 'primary', label: 'Primary evidence photo selected', pass: hasPrimary },
  ];

  // --- Suggested next info ---
  const nextSteps = [];
  if (!location.address) nextSteps.push('Add the street address or nearest landmark');
  else nextSteps.push('Add nearby landmarks or directions for the civic worker');
  if (!desc.includes('duration') && clarityPassed < 3) nextSteps.push('Say how long the issue has existed');
  if (!description) nextSteps.push('Add a detailed description of what happened');
  if (images.length === 0) nextSteps.push('Attach a photo of the issue');
  if (!categoryMatchesUser && suggestedCategoryKey !== 'other') {
    nextSteps.push(`Consider category "${suggestedCategory}" based on your description (your choice is preserved)`);
  }
  // dedupe
  const seen = new Set();
  const uniqueNextSteps = nextSteps.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });

  // --- Readiness checklist ---
  const readiness = {
    title: Boolean(title && title.length >= LIMITS.minTitle),
    category: Boolean(category),
    severity: Boolean(severity),
    location: Boolean(location.address),
    description: desc.length >= 40,
    evidence: images.length > 0,
  };
  const readinessScore = Object.values(readiness).filter(Boolean).length;
  const readinessMax = Object.keys(readiness).length;

  return {
    source: ANALYSIS_SOURCE,
    ranAt: Date.now(),
    version: draft.analysisVersion + 1,
    fieldsUsed,
    suggestedCategory,
    suggestedCategoryKey,
    categoryMatchesUser,
    categoryConfidence: Math.round(categoryConfidence * 100),
    suggestedTitle,
    titleWords: titleWords(title),
    clarityChecks,
    clarityPassed,
    clarityTotal: clarityChecks.length,
    severityComparison,
    photoChecks,
    duplicateWarning,
    evidenceComplete,
    evidenceChecks,
    nextSteps: uniqueNextSteps,
    readiness,
    readinessScore,
    readinessMax,
  };
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)) + ' ' + sizes[i];
}
