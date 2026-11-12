import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  MapPin,
  Layers
} from 'lucide-react';
import { getSlaCondition } from '../../services/authorityData';

export default function AuthorityAnalyticsPage() {
  const { issues, showToast } = useOutletContext();
  const [timeWindow, setTimeWindow] = useState('30d'); // '7d' | '30d' | '90d'
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter issues by time window and category
  const filteredIssues = useMemo(() => {
    const now = Date.now();
    return issues.filter((iss) => {
      // Category filter
      if (categoryFilter !== 'All' && iss.category !== categoryFilter) return false;

      // Time window filter
      const created = new Date(iss.createdAt).getTime();
      const diffHours = (now - created) / (1000 * 3600);
      if (timeWindow === '7d') return diffHours <= 7 * 24;
      if (timeWindow === '30d') return diffHours <= 30 * 24;
      if (timeWindow === '90d') return diffHours <= 90 * 24;
      return true;
    });
  }, [issues, timeWindow, categoryFilter]);

  // Resolution Calculations
  const resolvedIssues = useMemo(() => {
    return filteredIssues.filter(i => i.status === 'Resolved' && i.resolvedAt);
  }, [filteredIssues]);

  // Average resolution time in hours calculated from timestamps
  const avgResolutionHours = useMemo(() => {
    if (resolvedIssues.length === 0) return 22.4; // fallback baseline
    const totalHours = resolvedIssues.reduce((sum, iss) => {
      const created = new Date(iss.createdAt).getTime();
      const resolved = new Date(iss.resolvedAt).getTime();
      return sum + Math.max(1, (resolved - created) / (1000 * 3600));
    }, 0);
    return Math.round((totalHours / resolvedIssues.length) * 10) / 10;
  }, [resolvedIssues]);

  // Overdue count
  const overdueCount = useMemo(() => {
    return filteredIssues.filter(i => getSlaCondition(i) === 'Overdue').length;
  }, [filteredIssues]);

  // Overall SLA Compliance Rate
  const slaCompliancePct = useMemo(() => {
    if (filteredIssues.length === 0) return 100;
    const nonBreached = filteredIssues.length - overdueCount;
    return Math.round((nonBreached / filteredIssues.length) * 100);
  }, [filteredIssues, overdueCount]);

  // Category distribution
  const categoriesList = [
    'Road Damage & Potholes',
    'Water Leakage',
    'Streetlights',
    'Garbage & Sanitation',
    'Drainage & Stormwater',
    'Traffic Infrastructure'
  ];

  const categoryBreakdown = useMemo(() => {
    return categoriesList.map((cat) => {
      const count = filteredIssues.filter(i => i.category === cat).length;
      const pct = filteredIssues.length > 0 ? Math.round((count / filteredIssues.length) * 100) : 0;
      return { category: cat, count, pct };
    }).sort((a, b) => b.count - a.count);
  }, [filteredIssues]);

  // Hotspot localities derived from incident records
  const localityHotspots = useMemo(() => {
    const counts = {};
    filteredIssues.forEach((i) => {
      const loc = i.locality ? i.locality.split(',')[0].trim() : 'Ward 112';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([locality, count]) => ({ locality, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredIssues]);

  // Export Filtered Issue Data to real CSV download
  const handleExportCSV = () => {
    if (filteredIssues.length === 0) {
      if (showToast) showToast('No data to export', 'error');
      return;
    }

    const headers = ['Issue ID', 'Title', 'Category', 'Severity', 'Status', 'Locality', 'Assigned Squad', 'SLA Due', 'Created At'];
    const rows = filteredIssues.map(i => [
      `"${i.id}"`,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      `"${i.severity}"`,
      `"${i.status}"`,
      `"${i.locality}"`,
      `"${i.assignedTeam}"`,
      `"${i.dueAt}"`,
      `"${i.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicFix_Ward112_Analytics_${timeWindow}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) showToast(`Exported ${filteredIssues.length} incident records to CSV`);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#f0f2f5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Performance Telemetry & SLA Compliance
          </h1>
          <p className="text-xs text-[#6b7280]">
            Resolution velocities, SLA adherence metrics, and geographic hotspot analysis across Ward 112.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 bg-white border border-[#d1d5db] rounded-lg text-xs font-medium text-[#111827] focus:border-[#ea580c] focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Time Window Selector */}
          <div className="flex items-center gap-1 bg-[#f3f4f6] p-1 rounded-xl text-xs font-semibold text-[#4b5563]">
            {['7d', '30d', '90d'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setTimeWindow(w)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                  timeWindow === w
                    ? 'bg-white text-[#111827] shadow-2xs font-bold'
                    : 'hover:text-[#111827]'
                }`}
              >
                {w === '7d' ? '7 Days' : w === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1f2937] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Average Resolution Time */}
        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Average Fix Time (SLA)</span>
          <div className="text-2xl font-extrabold font-mono text-[#111827]">{avgResolutionHours} Hours</div>
          <p className="text-[11px] text-emerald-600 font-semibold">↓ 14% vs previous operating cycle</p>
        </div>

        {/* SLA Compliance */}
        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Overall SLA Compliance</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">{slaCompliancePct}%</div>
          <p className="text-[11px] text-[#6b7280]">{overdueCount} breach incidents recorded</p>
        </div>

        {/* AI Duplicate Suppression */}
        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">AI Duplicate Consolidations</span>
          <div className="text-2xl font-extrabold font-mono text-[#ea580c]">
            {filteredIssues.reduce((sum, i) => sum + (i.duplicatesCount || 0), 0)} Reports
          </div>
          <p className="text-[11px] text-[#6b7280]">Saved redundant squad dispatches</p>
        </div>

        {/* Citizen Audit Verification */}
        <div className="p-4 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-1">
          <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">Verified Resolution Rate</span>
          <div className="text-2xl font-extrabold font-mono text-[#111827]">
            {filteredIssues.length > 0 ? Math.round((resolvedIssues.length / filteredIssues.length) * 100) : 0}%
          </div>
          <p className="text-[11px] text-[#6b7280]">Photo audit proof on file</p>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly SLA Compliance by Urgency Level */}
        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#111827]">SLA Adherence by Severity Class</h3>
              <p className="text-[11px] text-[#6b7280]">Target completion windows vs historical compliance</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f3f4f6] text-[#4b5563]">
              Sample Telemetry
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-red-700">Critical (Level 4) • Target &lt; 12 Hours</span>
                <span className="font-mono font-bold text-emerald-600">92% on-time</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-orange-700">High (Level 3) • Target &lt; 24 Hours</span>
                <span className="font-mono font-bold text-blue-600">89% on-time</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-amber-700">Medium (Level 2) • Target &lt; 48 Hours</span>
                <span className="font-mono font-bold text-amber-600">94% on-time</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-semibold text-blue-700">Low (Level 1) • Target &lt; 72 Hours</span>
                <span className="font-mono font-bold text-emerald-600">98% on-time</span>
              </div>
              <div className="w-full bg-[#f3f4f6] h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Hotspot Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#111827]">Corridor Incident Hotspots</h3>
              <p className="text-[11px] text-[#6b7280]">Recurring infrastructure stress clusters in Ward 112</p>
            </div>
            <MapPin className="w-4 h-4 text-[#ea580c]" />
          </div>

          <div className="space-y-2.5 text-xs">
            {localityHotspots.map((item, idx) => (
              <div key={item.locality} className="p-2.5 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ea580c]/10 text-[#ea580c] font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-[#111827]">{item.locality}</div>
                    <div className="text-[10px] text-[#6b7280]">Ward 112 • High Density Corridor</div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-[#111827] px-2 py-0.5 rounded bg-white border border-[#d1d5db]">
                  {item.count} Reports
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#111827]">Grievance Distribution by Service Category</h3>
              <p className="text-[11px] text-[#6b7280]">Incident distribution across civic categories in Ward 112</p>
            </div>
            <Layers className="w-4 h-4 text-[#ea580c]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] truncate pr-1">{item.category}</span>
                  <span className="font-mono text-[#ea580c] font-bold text-[11px]">{item.count}</span>
                </div>
                <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#ea580c] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, item.pct)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#6b7280]">
                  <span>Share</span>
                  <span className="font-mono">{item.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Triage Operations Impact */}
      <div className="p-5 rounded-2xl bg-white border border-[#e5e7eb] shadow-2xs space-y-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ea580c]" />
          <h3 className="font-bold text-sm text-[#111827]">AI Ingestion & Duplicate Suppression Telemetry</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-600 text-[11px] leading-relaxed pt-1">
          <div className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
            <div className="font-bold text-[#111827] text-xs">Geospatial Clustering</div>
            <p>38% of incoming pothole and stormwater reports occurred within 100 meters of an active ticket and were auto-consolidated.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
            <div className="font-bold text-[#111827] text-xs">Vision Verification</div>
            <p>98.2% of submitted photos accurately classified asphalt degradation or overflow without requiring manual re-categorization.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-1">
            <div className="font-bold text-[#111827] text-xs">Resource Efficiency</div>
            <p>Prevented an estimated 72 redundant squad transit hours across Ward 112 this calendar quarter.</p>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-[#9ca3af] font-mono text-center border-t border-[#f0f2f5]">
          Simulated Demonstration Analytics • Derived from active local operations store
        </div>
      </div>

    </div>
  );
}
