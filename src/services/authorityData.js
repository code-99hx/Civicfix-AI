/**
 * CivicFix AI - Authority Operations Data Service
 * 
 * Provides a production-grade simulated civic operations dataset for municipal
 * authorities (e.g., BBMP Ward 112 - Indiranagar, Bangalore East).
 * 
 * Features:
 * - Real, geographically verified coordinates within Ward 112 bounding box
 * - Explicit handling of unmapped issues (missing coordinates)
 * - Standardized SLA targets by severity
 * - Unified reactive state with LocalStorage persistence and subscriber events
 * - Full audit logs, internal notes, and assignment telemetry
 */

const STORAGE_KEY = 'civicfix_authority_issues_v2';
const SETTINGS_KEY = 'civicfix_authority_settings_v2';

// Standard SLA targets in hours
export const SLA_TARGETS = {
  Critical: 12, // 12 hours
  High: 24,     // 24 hours
  Medium: 48,   // 48 hours
  Low: 72       // 72 hours
};

// Municipal Field Squads
export const MUNICIPAL_SQUADS = [
  {
    id: 'squad-1',
    name: 'Ward 112 Rapid Roadworks Squad',
    lead: 'Insp. Ramesh Rao',
    department: 'Roads & Infrastructure',
    members: 6,
    phone: '+91 80 2521 4411',
    specialty: 'Asphalt cold-mix, pothole patching, paver leveling',
    status: 'Field Dispatched'
  },
  {
    id: 'squad-2',
    name: 'Electrical Maintenance Squad B',
    lead: 'Foreman Suresh K.',
    department: 'Electrical & Street Lighting',
    members: 4,
    phone: '+91 80 2521 4412',
    specialty: 'High-mast luminaires, transformer lines, underground cabling',
    status: 'Standby / Ready'
  },
  {
    id: 'squad-3',
    name: 'Zonal Sanitation Crew 4',
    lead: 'Supervisor Manjunath',
    department: 'Solid Waste Management',
    members: 8,
    phone: '+91 80 2521 4413',
    specialty: 'Commercial corridor sweeping, debris truck clearance, bin clearing',
    status: 'Field Dispatched'
  },
  {
    id: 'squad-4',
    name: 'Water Board Emergency Cell',
    lead: 'Eng. Vijay Kumar',
    department: 'Water Supply & Sewerage',
    members: 5,
    phone: '+91 80 2521 4414',
    specialty: 'Main pipe bursts, pressure testing, valve shutoffs',
    status: 'Active Dispatch'
  },
  {
    id: 'squad-5',
    name: 'Drainage & Stormwater Squad',
    lead: 'Eng. Priya Sharma',
    department: 'Stormwater & Drainage',
    members: 7,
    phone: '+91 80 2521 4415',
    specialty: 'Culvert desilting, storm drain grating repair, catch-basin clearance',
    status: 'Standby / Ready'
  }
];

// GeoJSON coordinates for Ward 112 (Indiranagar) approximate service perimeter
export const WARD_112_BOUNDARY = {
  type: 'Feature',
  properties: {
    name: 'Ward 112 - Indiranagar',
    zone: 'East Zone',
    city: 'Bengaluru',
    areaSqKm: 4.8
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [77.6320, 12.9840],
      [77.6520, 12.9830],
      [77.6560, 12.9730],
      [77.6510, 12.9640],
      [77.6360, 12.9630],
      [77.6310, 12.9710],
      [77.6320, 12.9840]
    ]]
  }
};

// Initial realistic dataset
export const INITIAL_AUTHORITY_DATASET = [
  {
    id: 'CF-4082',
    title: 'Severe Asphalt Pothole • 18" Depth on High-Transit Arterial',
    description: 'Deep road depression causing vehicles and two-wheelers to swerve abruptly into oncoming traffic. High risk of nocturnal collisions near 12th Main signal.',
    category: 'Road Damage & Potholes',
    severity: 'Critical',
    status: 'In Progress',
    department: 'Roads & Infrastructure',
    assignedTeam: 'Ward 112 Rapid Roadworks Squad',
    assignedTo: 'Insp. Ramesh Rao',
    locality: '100ft Road, Near 12th Main',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9716,
    longitude: 77.6412,
    hasValidCoords: true,
    photo: '/images/feature_01.jpg',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hrs ago
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(), // 8 hrs remaining
    resolvedAt: null,
    duplicatesCount: 3,
    internalNotes: 'Cold-mix asphalt batch allocated from Whitefield depot. Site coordinator: Insp. Rao.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), status: 'New', note: 'Grievance ingested via citizen portal with geotagged photo', author: 'AI Dispatch' },
      { timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(), status: 'Awaiting Review', note: 'AI merged 2 duplicates. Severity elevated to Critical.', author: 'CivicFix AI' },
      { timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), status: 'In Progress', note: 'Assigned to Ward 112 Rapid Roadworks Squad', author: 'Officer Rao' }
    ]
  },
  {
    id: 'CF-4091',
    title: 'Underground Potable Pipeline Joint Rupture',
    description: 'High-pressure treated drinking water bubbling through asphalt fissures, causing road foundation erosion and waterlogging at busy intersection.',
    category: 'Water Leakage',
    severity: 'Critical',
    status: 'Awaiting Review',
    department: 'Water Supply & Sewerage',
    assignedTeam: 'Unassigned',
    assignedTo: null,
    locality: 'Double Road Junction, CMH Road',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9789,
    longitude: 77.6445,
    hasValidCoords: true,
    photo: '/images/feature_02.jpg',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // 14 hrs ago (overdue Critical!)
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // Overdue by 2 hours
    resolvedAt: null,
    duplicatesCount: 5,
    internalNotes: 'Urgent: Water supply feeder valve #12 requires manual turn-off before excavation.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), status: 'New', note: 'Reported by local merchant association', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), status: 'Awaiting Review', note: 'Critical SLA alert triggered. Awaiting squad assignment.', author: 'System' }
    ]
  },
  {
    id: 'CF-4078',
    title: 'Broken Streetlight Luminaire Pole #42',
    description: 'Flickering LED luminaire and loose base wiring. Complete darkness along 120m pedestrian corridor adjacent to children park.',
    category: 'Streetlights',
    severity: 'Medium',
    status: 'Awaiting Review',
    department: 'Electrical & Street Lighting',
    assignedTeam: 'Electrical Maintenance Squad B',
    assignedTo: 'Foreman Suresh K.',
    locality: '5th Cross, 1st Stage',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9782,
    longitude: 77.6398,
    hasValidCoords: true,
    photo: '/images/feature_03.jpg',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    duplicatesCount: 1,
    internalNotes: 'Replacement 90W LED driver requisitioned from central store.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), status: 'New', note: 'Citizen reported via mobile app', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), status: 'Awaiting Review', note: 'Electrical supervisor notified', author: 'CivicFix AI' }
    ]
  },
  {
    id: 'CF-4050',
    title: 'Commercial Debris Dumping Obstructing Footpath',
    description: 'Heavy construction rubble and masonry waste dumped overnight on pedestrian sidewalk forcing school children onto vehicular carriageway.',
    category: 'Garbage & Sanitation',
    severity: 'Medium',
    status: 'Resolved',
    department: 'Solid Waste Management',
    assignedTeam: 'Zonal Sanitation Crew 4',
    assignedTo: 'Supervisor Manjunath',
    locality: '80ft Road Commercial Corridor',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9691,
    longitude: 77.6450,
    hasValidCoords: true,
    photo: '/images/community_story.jpg',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    duplicatesCount: 2,
    internalNotes: 'Cleared with Bobcat loader. Notice served to commercial builder at Site #88.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), status: 'New', note: 'Report logged', author: 'Resident' },
      { timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), status: 'In Progress', note: 'Sanitation tipper truck dispatched', author: 'Supervisor Manjunath' },
      { timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), status: 'Resolved', note: 'Site verified and photographic proof recorded', author: 'Inspector Rao' }
    ]
  },
  {
    id: 'CF-4102',
    title: 'Clogged Storm Drain Inlet & Standing Water',
    description: 'Heavy silt and plastic debris blocking stormwater grate. 6-inch stagnant water puddle accumulating near residential gate.',
    category: 'Drainage & Stormwater',
    severity: 'High',
    status: 'In Progress',
    department: 'Stormwater & Drainage',
    assignedTeam: 'Drainage & Stormwater Squad',
    assignedTo: 'Eng. Priya Sharma',
    locality: '6th Main, Defence Colony',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9745,
    longitude: 77.6480,
    hasValidCoords: true,
    photo: '/images/feature_01.jpg',
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(), // 4h remaining (Due soon!)
    resolvedAt: null,
    duplicatesCount: 2,
    internalNotes: 'Desilting suction machine en route from Ulsoor sub-division.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), status: 'New', note: 'Reported by Defence Colony RWA', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), status: 'In Progress', note: 'Excavation team dispatched', author: 'Eng. Priya Sharma' }
    ]
  },
  {
    id: 'CF-4115',
    title: 'Fallen Tree Branch Snapping Service Wire',
    description: 'Large bough cracked during thunderstorm, dangling precariously above pedestrian walkway and tangling telephone/broadband lines.',
    category: 'Road Damage & Potholes',
    severity: 'High',
    status: 'New',
    department: 'Roads & Infrastructure',
    assignedTeam: 'Unassigned',
    assignedTo: null,
    locality: '11th Cross, HAL 2nd Stage',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9668,
    longitude: 77.6492,
    hasValidCoords: true,
    photo: '/images/feature_02.jpg',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    duplicatesCount: 0,
    internalNotes: 'Requires chainsaw crew and electrical department de-energization confirmation.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), status: 'New', note: 'Emergency report logged via citizen app', author: 'Citizen' }
    ]
  },
  {
    id: 'CF-4120',
    title: 'Dislodged Manhole Chamber Cover',
    description: 'Heavy cast-iron chamber frame shifted out of position on carriage road. Exposed deep void posing severe wheel trap.',
    category: 'Drainage & Stormwater',
    severity: 'Critical',
    status: 'In Progress',
    department: 'Stormwater & Drainage',
    assignedTeam: 'Drainage & Stormwater Squad',
    assignedTo: 'Eng. Priya Sharma',
    locality: 'Old Airport Road, Near Domlur Flyover',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9625,
    longitude: 77.6385,
    hasValidCoords: true,
    photo: '/images/feature_03.jpg',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), // 2 hrs remaining
    resolvedAt: null,
    duplicatesCount: 4,
    internalNotes: 'Traffic cones placed. Cast-iron lid replacement arriving via transit vehicle.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), status: 'New', note: 'Traffic police relayed incident', author: 'Officer' },
      { timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), status: 'In Progress', note: 'Safety barricades deployed', author: 'Drainage Squad' }
    ]
  },
  {
    id: 'CF-4131',
    title: 'Uncollected Mixed Household Garbage Pile',
    description: 'Secondary collection point overflowing onto stormwater gutter. Odor issues and stray dog aggregation.',
    category: 'Garbage & Sanitation',
    severity: 'Low',
    status: 'Resolved',
    department: 'Solid Waste Management',
    assignedTeam: 'Zonal Sanitation Crew 4',
    assignedTo: 'Supervisor Manjunath',
    locality: '4th Main Road, Binnamangala',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9812,
    longitude: 77.6350,
    hasValidCoords: true,
    photo: '/images/community_story.jpg',
    createdAt: new Date(Date.now() - 56 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    duplicatesCount: 1,
    internalNotes: 'Regular compacting truck schedule restored for morning rounds.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 56 * 3600 * 1000).toISOString(), status: 'New', note: 'Resident reported overflowing community bin', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), status: 'Resolved', note: 'Cleared and disinfected with bleaching powder', author: 'Supervisor Manjunath' }
    ]
  },
  {
    id: 'CF-4144',
    title: 'Traffic Signal Controller Timing Malfunction',
    description: 'Signal stuck on flashing amber during evening peak hour creating 1km bottleneck at junction.',
    category: 'Traffic Infrastructure',
    severity: 'High',
    status: 'In Progress',
    department: 'Electrical & Street Lighting',
    assignedTeam: 'Electrical Maintenance Squad B',
    assignedTo: 'Foreman Suresh K.',
    locality: '100ft & CMH Road Junction',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9760,
    longitude: 77.6430,
    hasValidCoords: true,
    photo: '/images/feature_03.jpg',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 21 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    duplicatesCount: 6,
    internalNotes: 'Microprocessor board reboot needed. Coordinating with Bengaluru Traffic Police.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), status: 'New', note: 'Multiple citizen and automated sensor reports received', author: 'CivicFix AI' },
      { timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), status: 'In Progress', note: 'Technician on-site', author: 'Foreman Suresh' }
    ]
  },
  {
    id: 'CF-4155',
    title: 'Illegal Post-Construction Sand Pile on Roadway',
    description: 'Builder dumped 2 truckloads of coarse river sand occupying half the asphalt lane with no warning reflectors.',
    category: 'Road Damage & Potholes',
    severity: 'Medium',
    status: 'Awaiting Review',
    department: 'Roads & Infrastructure',
    assignedTeam: 'Unassigned',
    assignedTo: null,
    locality: '14th Main Road, HAL 2nd Stage',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9695,
    longitude: 77.6530,
    hasValidCoords: true,
    photo: '/images/feature_01.jpg',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 40 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    duplicatesCount: 0,
    internalNotes: 'Pending ward engineer inspection to levy civic encroachment fine.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), status: 'New', note: 'Citizen photo report ingested', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), status: 'Awaiting Review', note: 'Queued for road inspector triage', author: 'AI Dispatch' }
    ]
  },
  {
    id: 'CF-4160',
    title: 'Water Supply Valve Sputter & Murky Effluent',
    description: 'Brownish tap water reported across 12 residences; probable underground cross-contamination with broken sewer line.',
    category: 'Water Leakage',
    severity: 'Critical',
    status: 'Awaiting Review',
    department: 'Water Supply & Sewerage',
    assignedTeam: 'Water Board Emergency Cell',
    assignedTo: 'Eng. Vijay Kumar',
    locality: '9th Cross, Indiranagar 1st Stage',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9805,
    longitude: 77.6380,
    hasValidCoords: true,
    photo: '/images/feature_02.jpg',
    createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // Overdue Critical by 3h
    resolvedAt: null,
    duplicatesCount: 3,
    internalNotes: 'Water samples dispatched to municipal test lab. Urgent valve isolation required.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 15 * 3600 * 1000).toISOString(), status: 'New', note: 'Resident welfare association alert', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), status: 'Awaiting Review', note: 'Critical SLA breach alert triggered', author: 'System' }
    ]
  },
  {
    id: 'CF-4172',
    title: 'Damaged Pedestrian Guardrail at School Crosswalk',
    description: 'Tubular steel safety barrier crumpled after vehicle collision. Sharp jagged edges protruding towards sidewalk.',
    category: 'Road Damage & Potholes',
    severity: 'Medium',
    status: 'Resolved',
    department: 'Roads & Infrastructure',
    assignedTeam: 'Ward 112 Rapid Roadworks Squad',
    assignedTo: 'Insp. Ramesh Rao',
    locality: '12th Cross Road, Indiranagar',
    ward: 'Ward 112 (Indiranagar)',
    latitude: 12.9730,
    longitude: 77.6465,
    hasValidCoords: true,
    photo: '/images/feature_01.jpg',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    duplicatesCount: 1,
    internalNotes: 'Welding squad cut out bent section and bolted new safety bar.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), status: 'New', note: 'Report logged by school principal', author: 'Citizen' },
      { timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), status: 'Resolved', note: 'Work completed and certified safe', author: 'Insp. Rao' }
    ]
  },
  // Intentional unmapped issue with missing/unverified coordinates to demonstrate honest GIS handling
  {
    id: 'CF-4188',
    title: 'Intermittent Transformer Hum & Voltage Fluctuations',
    description: 'Residents reporting sharp voltage spikes and loud mechanical buzzing from distribution box. Exact GPS not captured by citizen photo.',
    category: 'Streetlights',
    severity: 'High',
    status: 'New',
    department: 'Electrical & Street Lighting',
    assignedTeam: 'Unassigned',
    assignedTo: null,
    locality: 'Indiranagar 2nd Stage (Precise Pole ID Unconfirmed)',
    ward: 'Ward 112 (Indiranagar)',
    latitude: null,
    longitude: null,
    hasValidCoords: false,
    photo: null,
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 23 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    duplicatesCount: 0,
    internalNotes: 'Geocoding unavailable; field squad dispatched with handheld tester to inspect Substation #4.',
    statusHistory: [
      { timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), status: 'New', note: 'Report received with unverified coordinates', author: 'Citizen' }
    ]
  }
];

// Helper: Calculate SLA Condition
export function getSlaCondition(issue) {
  if (issue.status === 'Resolved') return 'Resolved';
  if (!issue.dueAt) return 'On Track';

  const due = new Date(issue.dueAt).getTime();
  const now = Date.now();
  const diffHours = (due - now) / (1000 * 3600);

  if (diffHours < 0) return 'Overdue';
  if (diffHours <= 6) return 'Due Soon';
  return 'On Track';
}

// Get issues from localStorage or initialize
export function getAuthorityIssues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading authority issues from localStorage:', err);
  }
  // Store initial dataset
  saveAuthorityIssues(INITIAL_AUTHORITY_DATASET);
  return INITIAL_AUTHORITY_DATASET;
}

// Save issues and dispatch cross-component sync event
export function saveAuthorityIssues(issues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    window.dispatchEvent(new CustomEvent('civicfix_authority_issues_updated', { detail: issues }));
  } catch (err) {
    console.error('Failed saving authority issues:', err);
  }
}

// Update single issue
export function updateAuthorityIssue(issueId, updates) {
  const issues = getAuthorityIssues();
  const updated = issues.map((iss) => {
    if (iss.id === issueId) {
      const isResolving = updates.status === 'Resolved' && iss.status !== 'Resolved';
      const historyEntry = updates.status && updates.status !== iss.status
        ? {
            timestamp: new Date().toISOString(),
            status: updates.status,
            note: updates.statusNote || `Status changed to ${updates.status}`,
            author: updates.author || 'Municipal Officer'
          }
        : null;

      const newHistory = historyEntry
        ? [historyEntry, ...(iss.statusHistory || [])]
        : (iss.statusHistory || []);

      return {
        ...iss,
        ...updates,
        updatedAt: new Date().toISOString(),
        resolvedAt: isResolving ? new Date().toISOString() : iss.resolvedAt,
        statusHistory: newHistory
      };
    }
    return iss;
  });

  saveAuthorityIssues(updated);
  return updated;
}

// Assign squad to issue
export function assignSquadToIssue(issueId, squadName, assigneeName = '', internalNote = '') {
  const issues = getAuthorityIssues();
  const updated = issues.map((iss) => {
    if (iss.id === issueId) {
      const historyEntry = {
        timestamp: new Date().toISOString(),
        status: iss.status === 'New' ? 'In Progress' : iss.status,
        note: `Dispatched to ${squadName}${assigneeName ? ` (${assigneeName})` : ''}`,
        author: 'Dispatch Coordinator'
      };

      return {
        ...iss,
        assignedTeam: squadName,
        assignedTo: assigneeName || iss.assignedTo,
        status: iss.status === 'New' ? 'In Progress' : iss.status,
        internalNotes: internalNote 
          ? `${iss.internalNotes ? `${iss.internalNotes}\n` : ''}[${new Date().toLocaleDateString()}] ${internalNote}`
          : iss.internalNotes,
        updatedAt: new Date().toISOString(),
        statusHistory: [historyEntry, ...(iss.statusHistory || [])]
      };
    }
    return iss;
  });

  saveAuthorityIssues(updated);
  return updated;
}

// Bulk update status
export function bulkUpdateIssueStatus(issueIds, newStatus, author = 'Central Operations') {
  const issues = getAuthorityIssues();
  const idSet = new Set(issueIds);
  const updated = issues.map((iss) => {
    if (idSet.has(iss.id)) {
      const isResolving = newStatus === 'Resolved' && iss.status !== 'Resolved';
      return {
        ...iss,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        resolvedAt: isResolving ? new Date().toISOString() : iss.resolvedAt,
        statusHistory: [
          {
            timestamp: new Date().toISOString(),
            status: newStatus,
            note: `Bulk update: status transitioned to ${newStatus}`,
            author
          },
          ...(iss.statusHistory || [])
        ]
      };
    }
    return iss;
  });

  saveAuthorityIssues(updated);
  return updated;
}

// Add note to issue
export function addNoteToIssue(issueId, noteText, author = 'Municipal Officer') {
  const issues = getAuthorityIssues();
  const updated = issues.map((iss) => {
    if (iss.id === issueId) {
      const formattedNote = `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${author}]: ${noteText}`;
      return {
        ...iss,
        internalNotes: iss.internalNotes ? `${iss.internalNotes}\n${formattedNote}` : formattedNote,
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            timestamp: new Date().toISOString(),
            status: iss.status,
            note: `Operational note added: "${noteText}"`,
            author
          },
          ...(iss.statusHistory || [])
        ]
      };
    }
    return iss;
  });

  saveAuthorityIssues(updated);
  return updated;
}

// Reset data to defaults
export function resetAuthorityDataset() {
  saveAuthorityIssues(INITIAL_AUTHORITY_DATASET);
  return INITIAL_AUTHORITY_DATASET;
}

// Authority Settings
export const DEFAULT_AUTHORITY_SETTINGS = {
  orgName: 'Bruhat Bengaluru Mahanagara Palike',
  department: 'Roads & Infrastructure Engineering',
  ward: 'Ward 112 (Indiranagar)',
  zone: 'East Zone',
  city: 'Bengaluru',
  nodalOfficer: 'Insp. Ramesh Rao',
  contactEmail: 'nodal.ward112@bbmp.gov.in',
  contactPhone: '+91 80 2521 4410',
  dispatchEmergencyLine: '+91 80 2266 0000',
  slaTargets: {
    criticalHours: 12,
    highHours: 24,
    mediumHours: 48,
    lowHours: 72
  },
  notifications: {
    criticalSlaBreachEmail: true,
    newDuplicateReportSms: true,
    dailyDigestReport: true
  },
  mapDefaults: {
    defaultBasemap: 'light',
    enableClustering: true,
    showWardBoundary: true,
    defaultZoom: 14
  }
};

export function getAuthoritySettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_AUTHORITY_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed reading settings:', err);
  }
  return DEFAULT_AUTHORITY_SETTINGS;
}

export function saveAuthoritySettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('civicfix_authority_settings_updated', { detail: settings }));
  } catch (err) {
    console.error('Failed saving settings:', err);
  }
}
