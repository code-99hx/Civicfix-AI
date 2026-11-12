/**
 * CivicFix AI - Demo Session & Mock Authentication State Service
 * 
 * Manages client-side demo role selection, simulated user profiles,
 * onboarding progress, and sample incident data.
 * 
 * NOTE: For frontend UI prototype demonstration only. Not for production security.
 */

const STORAGE_KEY = 'civicfix_demo_session';
const REPORTS_KEY = 'civicfix_demo_reports';
const AUTHORITY_ISSUES_KEY = 'civicfix_authority_issues';

export const INITIAL_CITIZEN_REPORTS = [
  {
    id: 'CF-4082',
    title: 'Severe Asphalt Pothole • 18" Depth',
    category: 'Road Damage & Potholes',
    location: '100ft Road, Near 12th Main, Ward 112',
    coordinates: '12.9716° N, 77.6412° E',
    lat: 12.9716,
    lng: 77.6412,
    status: 'In Progress', // 'Awaiting Review' | 'In Progress' | 'Resolved'
    submittedAt: 'Today, 09:14 AM',
    photo: '/images/feature_01.jpg',
    description: 'Deep road depression causing vehicles and two-wheelers to swerve abruptly into oncoming traffic. Poses severe nighttime hazard.',
    priority: 'High (Level 4)',
    updates: [
      { time: '09:14 AM', text: 'Report submitted with geotagged photo', author: 'Citizen' },
      { time: '09:20 AM', text: 'AI Triage completed: 2 nearby duplicate reports merged', author: 'CivicFix AI' },
      { time: '10:45 AM', text: 'Work order dispatched to Ward 112 Rapid Roadworks Squad', author: 'Central Dispatch' },
    ]
  },
  {
    id: 'CF-3994',
    title: 'Defective High-Mast Streetlight',
    category: 'Streetlights',
    location: '5th Cross, Indiranagar 1st Stage',
    coordinates: '12.9782° N, 77.6408° E',
    lat: 12.9782,
    lng: 77.6408,
    status: 'Awaiting Review',
    submittedAt: 'Yesterday, 07:30 PM',
    photo: '/images/feature_03.jpg',
    description: 'Streetlight pole #42 has been flickering and completely blacked out for three consecutive nights.',
    priority: 'Medium (Level 3)',
    updates: [
      { time: '07:30 PM', text: 'Report logged by resident', author: 'Citizen' },
      { time: '07:32 PM', text: 'Queued for Electrical Sub-division review', author: 'CivicFix AI' }
    ]
  },
  {
    id: 'CF-3810',
    title: 'Overflowing Waste Bin & Green Debris',
    category: 'Garbage & Sanitation',
    location: 'Corner of 80ft Road & 4th Main',
    coordinates: '12.9691° N, 77.6450° E',
    lat: 12.9691,
    lng: 77.6450,
    status: 'Resolved',
    submittedAt: 'Oct 14, 2026',
    photo: '/images/community_story.jpg',
    description: 'Commercial waste overflowing onto footpath forcing pedestrians onto roadway.',
    priority: 'Medium',
    updates: [
      { time: 'Oct 14, 08:00 AM', text: 'Report received', author: 'Citizen' },
      { time: 'Oct 14, 11:30 AM', text: 'Sanitation vehicle dispatched', author: 'Sanitation Dept' },
      { time: 'Oct 14, 02:15 PM', text: 'Area cleared and photographic proof recorded', author: 'Ward Sanitation Inspector' }
    ]
  }
];

export const INITIAL_AUTHORITY_ISSUES = [
  {
    id: 'ISSUE-4082',
    title: 'Severe Asphalt Pothole • 18" Depth',
    category: 'Road Damage & Potholes',
    location: '100ft Road, Ward 112',
    ward: 'Ward 112 (Indiranagar)',
    reportedDate: 'Oct 17, 09:14 AM',
    suggestedPriority: 'Critical (Level 4)',
    status: 'In Progress',
    assignedTeam: 'Ward 112 Rapid Roadworks Squad',
    duplicatesCount: 3,
    description: 'Deep road depression causing vehicles and two-wheelers to swerve abruptly. High risk of accidents during peak transit.',
    photo: '/images/feature_01.jpg',
    internalNotes: 'Asphalt cold-mix batch scheduled for afternoon dispatch. Site coordinator: Insp. Rao.'
  },
  {
    id: 'ISSUE-4091',
    title: 'Underground Pipeline Joint Rupture',
    category: 'Water Leakage',
    location: 'Double Road Junction, Ward 112',
    ward: 'Ward 112 (Indiranagar)',
    reportedDate: 'Oct 17, 10:20 AM',
    suggestedPriority: 'High (Level 4)',
    status: 'Awaiting Review',
    assignedTeam: 'Unassigned',
    duplicatesCount: 5,
    description: 'Potable water bubbling through road surface at high pressure, causing localized waterlogging.',
    photo: '/images/feature_02.jpg',
    internalNotes: 'Awaiting coordination with Water Board engineers to shut supply valve.'
  },
  {
    id: 'ISSUE-4078',
    title: 'Broken Streetlight Fixture Pole #42',
    category: 'Streetlights',
    location: '5th Cross, 1st Stage',
    ward: 'Ward 112 (Indiranagar)',
    reportedDate: 'Oct 16, 07:30 PM',
    suggestedPriority: 'Medium (Level 3)',
    status: 'Awaiting Review',
    assignedTeam: 'Electrical Maintenance Squad B',
    duplicatesCount: 1,
    description: 'Flickering LED luminaire, completely out at night. Dark corridor safety concern.',
    photo: '/images/feature_03.jpg',
    internalNotes: 'Replacement LED driver requested from central inventory.'
  },
  {
    id: 'ISSUE-4050',
    title: 'Illegal Commercial Debris Dumping',
    category: 'Garbage & Sanitation',
    location: '80ft Road Commercial Corridor',
    ward: 'Ward 114 (Ulsoor)',
    reportedDate: 'Oct 15, 03:45 PM',
    suggestedPriority: 'Medium (Level 2)',
    status: 'Resolved',
    assignedTeam: 'Zonal Sanitation Crew 4',
    duplicatesCount: 2,
    description: 'Construction rubble dumped overnight obstructing pedestrian sidewalk.',
    photo: '/images/community_story.jpg',
    internalNotes: 'Clearance completed Oct 16. Offender notice served to commercial property #88.'
  }
];

export function getDemoSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse demo session:', e);
  }
  return {
    isLoggedIn: false,
    role: 'citizen', // default selection
    user: null,
    onboardingCompleted: false, // citizen onboarding
    authorityOnboardingCompleted: false, // authority onboarding
    onboardingStep: 1,
  };
}

export function saveDemoSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save demo session:', e);
  }
}

export function clearDemoSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear demo session:', e);
  }
}

export function loginDemoUser({ email, role = 'citizen', fullName = '' }) {
  const current = getDemoSession();
  const userName = fullName || (email ? email.split('@')[0] : 'Demo User');
  
  const updatedSession = {
    ...current,
    isLoggedIn: true,
    role: role,
    user: {
      name: userName,
      email: email || `${role}@civicfix-demo.local`,
      avatar: null,
      role: role
    }
  };
  saveDemoSession(updatedSession);
  return updatedSession;
}

export function completeCitizenOnboarding(details = {}) {
  const current = getDemoSession();
  const updated = {
    ...current,
    onboardingCompleted: true,
    citizenProfile: {
      ...details,
      completedAt: new Date().toISOString()
    }
  };
  saveDemoSession(updated);
  return updated;
}

export function completeAuthorityOnboarding(details = {}) {
  const current = getDemoSession();
  const updated = {
    ...current,
    authorityOnboardingCompleted: true,
    verificationStatus: 'pending', // Simulated 'Verification pending'
    authorityProfile: {
      ...details,
      submittedAt: new Date().toISOString()
    }
  };
  saveDemoSession(updated);
  return updated;
}

export function getDemoReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CITIZEN_REPORTS;
}

export const INITIAL_CITIZEN_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Work Order Dispatched: Pothole on 100ft Road',
    desc: 'The Ward 112 Rapid Roadworks Squad has received your report (CF-4082) and scheduled cold-mix asphalt dispatch for 02:00 PM today.',
    time: '10:45 AM Today',
    type: 'dispatch',
    reportId: 'CF-4082',
    read: false
  },
  {
    id: 'n2',
    title: 'AI Triage Complete: 2 Duplicate Reports Merged',
    desc: 'Two other residents reported the same pothole near 12th Main. Your reports have been consolidated to elevate priority to Level 4.',
    time: '09:20 AM Today',
    type: 'ai',
    reportId: 'CF-4082',
    read: false
  },
  {
    id: 'n3',
    title: 'Report Resolved: Overflowing Waste Bin',
    desc: 'Zonal Sanitation Crew 4 completed waste removal at 80ft Road (CF-3810). Before-and-after photographic verification logged.',
    time: 'Oct 14, 2026',
    type: 'resolved',
    reportId: 'CF-3810',
    read: true
  }
];

const NOTIFICATIONS_KEY = 'civicfix_demo_notifications';

export function getDemoNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CITIZEN_NOTIFICATIONS;
}

export function saveDemoNotifications(notifications) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error(e);
  }
}

export function markDemoNotificationAsRead(id) {
  const list = getDemoNotifications();
  const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
  saveDemoNotifications(updated);
  return updated;
}

export function markAllDemoNotificationsAsRead() {
  const list = getDemoNotifications();
  const updated = list.map(n => ({ ...n, read: true }));
  saveDemoNotifications(updated);
  return updated;
}

export function getUnreadNotificationsCount() {
  const list = getDemoNotifications();
  return list.filter(n => !n.read).length;
}

export function addDemoNotification(notification) {
  const list = getDemoNotifications();
  const item = {
    id: `n-${Date.now()}`,
    time: 'Just now',
    read: false,
    ...notification
  };
  const updated = [item, ...list];
  saveDemoNotifications(updated);
  return updated;
}

export function addDemoReport(report) {
  const current = getDemoReports();
  // Ensure report has valid geographic coordinates in Ward 112 if not provided
  const lat = report.lat || (12.9730 + (Math.random() - 0.5) * 0.012);
  const lng = report.lng || (77.6420 + (Math.random() - 0.5) * 0.012);
  const coordsStr = report.coordinates || `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;

  const newReport = {
    id: report.id || `CF-${Math.floor(4100 + Math.random() * 900)}`,
    submittedAt: 'Just now',
    status: 'Awaiting Review',
    lat,
    lng,
    coordinates: coordsStr,
    updates: [
      { time: 'Just now', text: 'Report submitted by citizen via demo intake', author: 'Citizen' },
      { time: 'Just now', text: 'AI Triage initialized: Category & severity assigned', author: 'CivicFix AI' }
    ],
    ...report
  };
  const updated = [newReport, ...current];
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  // Also record an automatic notification for this report
  addDemoNotification({
    title: `Report Submitted: ${newReport.title}`,
    desc: `Your grievance (${newReport.id}) has been recorded in Ward 112 and queued for municipal AI dispatch triage.`,
    type: 'dispatch',
    reportId: newReport.id
  });

  return updated;
}

export { getAuthorityIssues, updateAuthorityIssue } from './authorityData';

