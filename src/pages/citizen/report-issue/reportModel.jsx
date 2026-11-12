/**
 * CivicFix AI - Report Issue draft model, validation and constants.
 *
 * Single source of truth for the report draft. All values are resident-provided
 * unless explicitly marked as a local demo suggestion. Nothing here claims a
 * real AI service, geolocation, map provider or government integration.
 */

export const LIMITS = {
  maxImages: 5,
  maxFileSizeMB: 10,
  maxFileSizeBytes: 10 * 1024 * 1024,
  maxTitle: 120,
  minTitle: 3,
  maxDescription: 2000,
  minDescription: 10,
};

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const CATEGORIES = [
  {
    key: 'road-damage',
    label: 'Road Damage & Potholes',
    icon: 'RoadDamage',
    keywords: ['pothole', 'road', 'asphalt', 'pavement', 'crack', 'street'],
  },
  {
    key: 'garbage-waste',
    label: 'Garbage & Waste Overflow',
    icon: 'Garbage',
    keywords: ['garbage', 'waste', 'trash', 'bin', 'overflow', 'dump', 'litter', 'sanitation'],
  },
  {
    key: 'water-leakage',
    label: 'Water Leakage & Pipeline Damage',
    icon: 'Droplet',
    keywords: ['water', 'leak', 'pipeline', 'pipe', 'burst', 'flooding', 'seepage'],
  },
  {
    key: 'drainage-sewage',
    label: 'Drainage & Sewage',
    icon: 'Drain',
    keywords: ['drain', 'sewage', 'sewer', 'manhole', 'clogged', 'waterlogging'],
  },
  {
    key: 'streetlights',
    label: 'Broken Streetlights',
    icon: 'Lightbulb',
    keywords: ['streetlight', 'lamp', 'light', 'pole', 'dark', 'flickering', 'blackout'],
  },
  {
    key: 'footpaths',
    label: 'Damaged Footpaths',
    icon: 'Footsteps',
    keywords: ['footpath', 'sidewalk', 'footpath', 'pedestrian', 'walkway', 'slab', 'tile'],
  },
  {
    key: 'traffic-signals',
    label: 'Traffic Signals',
    icon: 'TrafficCone',
    keywords: ['traffic signal', 'traffic light', 'signal', 'junction', 'crossing'],
  },
  {
    key: 'public-property',
    label: 'Public Property Damage',
    icon: 'Building',
    keywords: ['public property', 'bench', 'fence', 'park', 'compound', 'wall', 'gate'],
  },
  {
    key: 'other',
    label: 'Other',
    icon: 'MoreHorizontal',
    keywords: [],
  },
];

export const SEVERITIES = [
  {
    key: 'low',
    label: 'Low',
    description: 'Minor cosmetic issue with no immediate safety risk.',
  },
  {
    key: 'moderate',
    label: 'Moderate',
    description: 'Visible damage causing limited disruption to the public.',
  },
  {
    key: 'high',
    label: 'High',
    description: 'Affects mobility, access or public safety and needs prompt attention.',
  },
  {
    key: 'critical',
    label: 'Critical',
    description: 'Immediate hazard. If there is danger to life, call emergency services directly — this app does not dispatch emergency responders.',
  },
];

// Explicitly marked demo ward data — not real ward boundaries.
export const DEMO_WARDS = [
  'Ward 112 – Indiranagar (demo)',
  'Ward 114 – Ulsoor (demo)',
  'Ward 110 – Koramangala (demo)',
  'Ward 115 – Domlur (demo)',
  'Ward 109 – HSR Layout (demo)',
];

export const DEFAULT_LOCATION = {
  address: '',
  locality: '',
  landmark: '',
  ward: '',
  postalCode: '',
  lat: null,
  lng: null,
  coordinates: null,
  source: null, // 'manual' | 'geolocation' | 'map'
};

export const DEFAULT_DRAFT = {
  title: '',
  category: '',
  severity: '',
  safetyRisk: false,
  location: { ...DEFAULT_LOCATION },
  description: '',
  images: [],
  contactPreference: 'anonymous', // 'anonymous' | 'contact-if-needed'
  analysis: null,
  analysisVersion: 0,
  lastSavedAt: null,
};

export function categoryByKey(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
}

export function severityByKey(key) {
  return SEVERITIES.find((s) => s.key === key) || SEVERITIES[1];
}

/**
 * Step 1 validation: issue details + evidence. Returns { ok, errors }.
 * Photo evidence is optional; only limits/capacity are enforced when images exist.
 */
export function validateStep1(draft) {
  const errors = {};

  const title = String(draft.title || '').trim();
  if (!title) {
    errors.title = 'Please enter a short title for the issue.';
  } else if (title.length < LIMITS.minTitle) {
    errors.title = `Title must be at least ${LIMITS.minTitle} characters.`;
  } else if (title.length > LIMITS.maxTitle) {
    errors.title = `Title must be no more than ${LIMITS.maxTitle} characters.`;
  }

  if (!draft.category) {
    errors.category = 'Please select an issue category.';
  }

  if (!draft.severity) {
    errors.severity = 'Please select a severity level.';
  }

  const address = String(draft.location.address || '').trim();
  if (!address) {
    errors.location = 'Please enter the street address or locality of the issue.';
  } else if (address.length > 200) {
    errors.location = 'Address must be no more than 200 characters.';
  }

  const locality = String(draft.location.locality || '').trim();
  if (locality.length > 100) {
    errors.locality = 'Locality must be no more than 100 characters.';
  }

  if (String(draft.location.postalCode || '').length > 20) {
    errors.postalCode = 'Postal code must be no more than 20 characters.';
  }

  const description = String(draft.description || '').trim();
  if (description.length > LIMITS.maxDescription) {
    errors.description = `Description must be no more than ${LIMITS.maxDescription} characters.`;
  }

  const oversized = draft.images.filter((img) => img.status === 'error' && img.error === 'size');
  if (oversized.length) {
    errors.images = `${oversized.length} image(s) exceed the ${LIMITS.maxFileSizeMB} MB limit and must be removed or replaced.`;
  }
  const unreadable = draft.images.filter((img) => img.status === 'error' && img.error === 'unreadable');
  if (unreadable.length) {
    errors.images = (errors.images ? errors.images + ' ' : '') + `${unreadable.length} image(s) could not be read and must be removed.`;
  }
  const unsupported = draft.images.filter((img) => img.status === 'error' && img.error === 'type');
  if (unsupported.length) {
    errors.images = (errors.images ? errors.images + ' ' : '') + `${unsupported.length} file(s) are not supported (JPEG, PNG or WebP only).`;
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Step 2 validation: resident review checklist must be acknowledged.
 */
export function validateStep2(draft) {
  const errors = {};
  if (!draft.category) errors.category = 'Please select a category.';
  if (!draft.severity) errors.severity = 'Please select a severity level.';
  return { ok: Object.keys(errors).length === 0, errors };
}

export function draftHasChanges(draft) {
  const defaults = DEFAULT_DRAFT;
  return (
    draft.title !== defaults.title ||
    draft.category !== defaults.category ||
    draft.severity !== defaults.severity ||
    draft.safetyRisk !== defaults.safetyRisk ||
    draft.location.address !== defaults.location.address ||
    draft.location.locality !== defaults.location.locality ||
    draft.location.landmark !== defaults.location.landmark ||
    draft.location.ward !== defaults.location.ward ||
    draft.location.postalCode !== defaults.location.postalCode ||
    draft.description !== defaults.description ||
    draft.images.length !== defaults.images.length ||
    draft.contactPreference !== defaults.contactPreference
  );
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)) + ' ' + sizes[i];
}
