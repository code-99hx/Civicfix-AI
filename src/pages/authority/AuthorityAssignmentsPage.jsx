import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Map, 
  ChevronRight,
  Phone,
  Flame,
  Search,
  RotateCcw,
  PlusCircle
} from 'lucide-react';
import { getSlaCondition, MUNICIPAL_SQUADS } from '../../services/authorityData';
import AuthorityAssignModal from '../../components/AuthorityAssignModal';

const PRIORITIES = ['All Priorities', 'Critical', 'High', 'Medium', 'Low'];
const SLA_STATES = ['All SLA States', 'Overdue', 'Due Soon', 'On Track'];

export default function AuthorityAssignmentsPage() {
  const { issues, openIssueDetail, updateIssue, showToast } = useOutletContext();
  const navigate = useNavigate();

  // View state: 'table' (Active Work Orders Table) vs 'squads' (Squad Capacity & Fleet Grid)
  const [activeViewTab, setActiveViewTab] = useState('table'); // 'table' | 'squads'

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [selectedSquad, setSelectedSquad] = useState('All Squads');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedSla, setSelectedSla] = useState('All SLA States');
  const [sortField, setSortField] = useState('dueAt'); // 'dueAt' | 'severity' | 'createdAt'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Modal state
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Unassigned Backlog
  const unassignedIssues = useMemo(() => {
    return issues.filter(i => {
      const isUnassigned = i.assignedTeam === 'Unassigned' || !i.assignedTeam;
      if (!isUnassigned || i.status === 'Resolved') return false;

      if (unassignedSearch.trim()) {
        const q = unassignedSearch.toLowerCase();
        const matches = 
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.locality.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort critical first
      const weight = (s) => (s === 'Critical' ? 4 : s === 'High' ? 3 : s === 'Medium' ? 2 : 1);
      return weight(b.severity) - weight(a.severity);
    });
  }, [issues, unassignedSearch]);

  // Active Assigned Work Orders
  const activeAssignedIssues = useMemo(() => {
    return issues.filter(i => {
      const isAssigned = i.assignedTeam !== 'Unassigned' && i.assignedTeam && i.status !== 'Resolved';
      if (!isAssigned) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.locality.toLowerCase().includes(q) ||
          i.assignedTeam.toLowerCase().includes(q) ||
          (i.assignedTo && i.assignedTo.toLowerCase().includes(q)) ||
          i.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Squad Filter
      if (selectedSquad !== 'All Squads' && i.assignedTeam !== selectedSquad) return false;

      // Priority Filter
      if (selectedPriority !== 'All Priorities' && i.severity !== selectedPriority) return false;

      // SLA State Filter
      if (selectedSla !== 'All SLA States') {
        const cond = getSlaCondition(i);
        if (cond !== selectedSla) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortField === 'dueAt') {
        const timeA = new Date(a.dueAt || 0).getTime();
        const timeB = new Date(b.dueAt || 0).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (sortField === 'severity') {
        const weight = (s) => (s === 'Critical' ? 4 : s === 'High' ? 3 : s === 'Medium' ? 2 : 1);
        const diff = weight(b.severity) - weight(a.severity);
        return sortOrder === 'asc' ? -diff : diff;
      }
      if (sortField === 'createdAt') {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
  }, [issues, searchQuery, selectedSquad, selectedPriority, selectedSla, sortField, sortOrder]);

  // Squad workload telemetry
  const squadsWithTelemetry = useMemo(() => {
    return MUNICIPAL_SQUADS.map((squad) => {
      const activeTasks = issues.filter(i => i.assignedTeam === squad.name && i.status !== 'Resolved');
      const resolvedTasks = issues.filter(i => i.assignedTeam === squad.name && i.status === 'Resolved');
      const overdueTasks = activeTasks.filter(i => getSlaCondition(i) === 'Overdue');
      const criticalTasks = activeTasks.filter(i => i.severity === 'Critical');

      // Max capacity threshold benchmark is 5 concurrent work orders per municipal crew
      const capacityPct = Math.min(100, Math.round((activeTasks.length / 5) * 100));

      return {
        ...squad,
        activeTasks,
        resolvedTasks,
        overdueTasks,
        criticalTasks,
        capacityPct
      };
    });
  }, [issues]);

  // Telemetry KPIs
  const totalSquadsCount = MUNICIPAL_SQUADS.length;
  const totalUnassignedCount = issues.filter(i => (i.assignedTeam === 'Unassigned' || !i.assignedTeam) && i.status !== 'Resolved').length;
  const totalActiveAssignedCount = issues.filter(i => i.assignedTeam !== 'Unassigned' && i.assignedTeam && i.status !== 'Resolved').length;
  const totalOverdueCount = issues.filter(i => getSlaCondition(i) === 'Overdue').length;

  const handleOpenAssignModal = (issue) => {
    setSelectedIssueForAssign(issue);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = ({ squadName, assigneeName, workInstructions, priority }) => {
    if (!selectedIssueForAssign) return;

    updateIssue(selectedIssueForAssign.id, {
      assignedTeam: squadName,
      assignedTo: assigneeName,
      severity: priority || selectedIssueForAssign.severity,
      status: selectedIssueForAssign.status === 'New' ? 'In Progress' : selectedIssueForAssign.status,
      internalNotes: workInstructions 
        ? `${selectedIssueForAssign.internalNotes ? `${selectedIssueForAssign.internalNotes}\n` : ''}[Dispatch Work Order]: ${workInstructions}`
        : selectedIssueForAssign.internalNotes,
      statusNote: `Dispatched to ${squadName} (${assigneeName})`
    });

    if (showToast) showToast(`Work order ${selectedIssueForAssign.id} allocated to ${squadName}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSquad('All Squads');
    setSelectedPriority('All Priorities');
    setSelectedSla('All SLA States');
    setSortField('dueAt');
    setSortOrder('asc');
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getSlaBadge = (condition) => {
    switch (condition) {
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'Due Soon': return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]';
    }
  };

  const hasActiveFilters = searchQuery || selectedSquad !== 'All Squads' || selectedPriority !== 'All Priorities' || selectedSla !== 'All SLA States';

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full space-y-3.5 select-none">
      
      {/* ========================================================
          1. TOP HEADER: Title, Operational Status & Quick Actions
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#f0f2f5] flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              Assignments
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dispatch Node Active</span>
            </span>
          </div>
          <p className="text-xs text-[#6b7280] pt-0.5">
            Municipal field squad allocations, active work-order distribution, and SLA capacity management for Ward 112.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unassignedIssues.length > 0 && (
            <button
              type="button"
              onClick={() => handleOpenAssignModal(unassignedIssues[0])}
              className="px-3 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Dispatch Next ({unassignedIssues[0].id})</span>
            </button>
          )}

          <Link
            to="/authority/map"
            className="px-3 py-1.5 rounded-lg border border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-[#ea580c]" />
            <span className="hidden sm:inline">GIS Radar Map</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          2. COMPACT TELEMETRY KPI STRIP
          ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 flex-shrink-0">
        
        {/* Total Dedicated Squads */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
              Municipal Squads
            </div>
            <div className="text-xl font-extrabold text-[#111827] font-mono leading-none">
              {totalSquadsCount}
            </div>
            <div className="text-[10px] text-[#6b7280]">
              29 Field Personnel On-Duty
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#f4f5f6] text-[#4b5563] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Unassigned Incident Backlog */}
        <div className={`p-3 rounded-xl border shadow-2xs flex items-center justify-between transition-colors ${
          totalUnassignedCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-[#e5e7eb]'
        }`}>
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Unassigned Backlog
            </div>
            <div className="text-xl font-extrabold text-amber-700 font-mono leading-none">
              {totalUnassignedCount}
            </div>
            <div className="text-[10px] text-amber-800 font-medium">
              Awaiting squad dispatch
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        {/* Active Work Orders Dispatched */}
        <div className="p-3 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Active Work Orders
            </div>
            <div className="text-xl font-extrabold text-blue-600 font-mono leading-none">
              {totalActiveAssignedCount}
            </div>
            <div className="text-[10px] text-[#6b7280]">
              Assigned & in transit/repair
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Overdue SLA Workload */}
        <div className={`p-3 rounded-xl border shadow-2xs flex items-center justify-between transition-colors ${
          totalOverdueCount > 0 ? 'bg-red-50/60 border-red-200' : 'bg-white border-[#e5e7eb]'
        }`}>
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">
              SLA Overdue
            </div>
            <div className="text-xl font-extrabold text-red-600 font-mono leading-none">
              {totalOverdueCount}
            </div>
            <div className="text-[10px] text-red-700 font-medium">
              {totalOverdueCount > 0 ? 'Urgent escalation needed' : 'All squads on schedule'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* ========================================================
          3. MAIN ASSIGNMENTS WORKSPACE
          - Split into two independent scrolling operations zones on desktop (lg:)
          - Mobile / tablet stacks naturally with fluid height
          ======================================================== */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5 overflow-hidden">
        
        {/* ======================================================
            ZONE 1: UNASSIGNED INTAKE QUEUE (4 Cols on desktop)
            - Independent vertical scrolling (.hide-scrollbar)
            - Sticky header with search & count
            ====================================================== */}
        <div className="lg:col-span-4 flex flex-col min-h-0 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs overflow-hidden">
          
          {/* Sticky Header */}
          <div className="p-3 border-b border-[#f0f2f5] bg-white z-10 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ea580c]" />
                <h2 className="font-bold text-xs text-[#111827] uppercase tracking-wider">
                  Unassigned Intake Queue
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                {unassignedIssues.length} Pending
              </span>
            </div>

            {/* Quick search inside unassigned queue */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={unassignedSearch}
                onChange={(e) => setUnassignedSearch(e.target.value)}
                placeholder="Search unassigned tickets..."
                className="w-full bg-[#f4f5f6] text-[11px] py-1 pl-8 pr-2.5 rounded-lg text-[#111827] placeholder-[#9ca3af] border border-transparent focus:bg-white focus:border-[#ea580c] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Independently Scrollable List Container (No Visible Scrollbars) */}
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar p-2 space-y-2">
            {unassignedIssues.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-[#6b7280]">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-[#111827]">
                  All Incidents Dispatched
                </div>
                <p className="text-[11px] max-w-xs leading-relaxed">
                  No grievances currently pending squad allocation in Ward 112.
                </p>
              </div>
            ) : (
              unassignedIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => openIssueDetail(issue)}
                  className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] hover:bg-white hover:border-[#ea580c] transition-all cursor-pointer space-y-2 group shadow-2xs"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#ea580c] text-[10px] bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                      {issue.id}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-xs text-[#111827] line-clamp-1 group-hover:text-[#ea580c] transition-colors">
                    {issue.title}
                  </h3>

                  {/* Locality & Category */}
                  <div className="space-y-0.5 text-[11px] text-[#6b7280]">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#9ca3af] flex-shrink-0" />
                      <span className="truncate">{issue.locality}</span>
                    </div>
                    <div className="text-[10px] text-[#9ca3af] font-mono">
                      Category: {issue.category}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div 
                    className="flex items-center justify-between pt-1 border-t border-[#f0f2f5]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => openIssueDetail(issue)}
                      className="text-[11px] text-[#6b7280] hover:text-[#111827] font-semibold"
                    >
                      Inspect
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(issue)}
                      className="px-2.5 py-1 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>Dispatch Squad</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* ======================================================
            ZONE 2: ACTIVE WORK ORDERS & FLEET (8 Cols on desktop)
            - Independent vertical scrolling (.hide-scrollbar)
            - Sticky top view switcher & filter toolbar
            ====================================================== */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs overflow-hidden">
          
          {/* Sticky Toolbar: View Switcher Tabs & Filters */}
          <div className="p-3 border-b border-[#f0f2f5] bg-white z-10 flex-shrink-0 space-y-2.5">
            
            {/* Top row: View Switcher Tabs & Quick Count */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-[#f3f4f6] p-0.5 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('table')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeViewTab === 'table'
                      ? 'bg-white text-[#111827] shadow-2xs font-bold'
                      : 'text-[#4b5563] hover:text-[#111827]'
                  }`}
                >
                  <span>Active Work Orders ({activeAssignedIssues.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('squads')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeViewTab === 'squads'
                      ? 'bg-white text-[#111827] shadow-2xs font-bold'
                      : 'text-[#4b5563] hover:text-[#111827]'
                  }`}
                >
                  <span>Squad Fleet & Capacity ({MUNICIPAL_SQUADS.length})</span>
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[11px] font-semibold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Filter Toolbar Inputs (Only for Table View) */}
            {activeViewTab === 'table' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search work orders..."
                    className="w-full bg-[#f4f5f6] text-[11px] py-1 pl-8 pr-2.5 rounded-lg text-[#111827] placeholder-[#9ca3af] border border-transparent focus:bg-white focus:border-[#ea580c] focus:outline-none transition-all"
                  />
                </div>

                {/* Squad Selector */}
                <div>
                  <select
                    value={selectedSquad}
                    onChange={(e) => setSelectedSquad(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] bg-[#f4f5f6] border border-transparent focus:bg-white focus:border-[#ea580c] rounded-lg text-[#111827] font-medium outline-none"
                  >
                    <option value="All Squads">All Squads ({MUNICIPAL_SQUADS.length})</option>
                    {MUNICIPAL_SQUADS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                {/* Priority Selector */}
                <div>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] bg-[#f4f5f6] border border-transparent focus:bg-white focus:border-[#ea580c] rounded-lg text-[#111827] font-medium outline-none"
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* SLA State Selector */}
                <div>
                  <select
                    value={selectedSla}
                    onChange={(e) => setSelectedSla(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] bg-[#f4f5f6] border border-transparent focus:bg-white focus:border-[#ea580c] rounded-lg text-[#111827] font-medium outline-none"
                  >
                    {SLA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

              </div>
            )}

          </div>

          {/* Independently Scrollable Core Area (No Visible Scrollbars) */}
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
            
            {/* VIEW A: ACTIVE WORK ORDERS TABLE */}
            {activeViewTab === 'table' && (
              <div className="w-full">
                
                {/* Desktop Data Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#374151] border-collapse">
                    <thead className="sticky top-0 bg-[#fafbfc] border-b border-[#e5e7eb] text-[10px] font-bold text-[#6b7280] uppercase tracking-wider select-none z-10">
                      <tr>
                        <th className="p-3 whitespace-nowrap">Issue ID</th>
                        <th className="p-3">Title & Locality</th>
                        <th className="p-3 whitespace-nowrap">Priority</th>
                        <th className="p-3 whitespace-nowrap">Assigned Squad</th>
                        <th className="p-3 whitespace-nowrap">SLA Due</th>
                        <th className="p-3 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0f2f5]">
                      {activeAssignedIssues.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-xs text-[#6b7280]">
                            No active work orders match your current filter parameters.
                          </td>
                        </tr>
                      ) : (
                        activeAssignedIssues.map((task) => {
                          const sla = getSlaCondition(task);
                          return (
                            <tr
                              key={task.id}
                              onClick={() => openIssueDetail(task)}
                              className="hover:bg-[#fafbfc] transition-colors cursor-pointer group"
                            >
                              {/* ID */}
                              <td className="p-3 font-mono font-bold text-[#ea580c] whitespace-nowrap">
                                {task.id}
                              </td>

                              {/* Title & Locality */}
                              <td className="p-3 max-w-xs">
                                <div className="font-semibold text-[#111827] truncate group-hover:text-[#ea580c] transition-colors">
                                  {task.title}
                                </div>
                                <div className="text-[11px] text-[#6b7280] flex items-center gap-1 truncate pt-0.5">
                                  <MapPin className="w-3 h-3 text-[#9ca3af] flex-shrink-0" />
                                  <span className="truncate">{task.locality}</span>
                                </div>
                              </td>

                              {/* Priority */}
                              <td className="p-3 whitespace-nowrap">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(task.severity)}`}>
                                  {task.severity}
                                </span>
                              </td>

                              {/* Assigned Squad */}
                              <td className="p-3 whitespace-nowrap">
                                <div className="font-semibold text-xs text-[#111827]">
                                  {task.assignedTeam}
                                </div>
                                <div className="text-[10px] text-[#6b7280]">
                                  {task.assignedTo ? `Lead: ${task.assignedTo}` : 'Assigned to squad'}
                                </div>
                              </td>

                              {/* SLA Condition */}
                              <td className="p-3 whitespace-nowrap">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSlaBadge(sla)}`}>
                                  {sla}
                                </span>
                              </td>

                              {/* Actions */}
                              <td 
                                className="p-3 text-right whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAssignModal(task)}
                                    className="px-2 py-1 rounded-md border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] text-[11px] font-semibold transition-colors cursor-pointer"
                                    title="Reassign to another squad"
                                  >
                                    Reassign
                                  </button>

                                  {task.hasValidCoords && (
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/authority/map?issueId=${task.id}`)}
                                      className="p-1 text-[#6b7280] hover:text-[#ea580c] hover:bg-[#f3f4f6] rounded-md transition-colors"
                                      title="View on Map"
                                    >
                                      <Map className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards Alternative for Active Work Orders */}
                <div className="md:hidden divide-y divide-[#f0f2f5] p-2 space-y-2">
                  {activeAssignedIssues.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6b7280]">
                      No active work orders match your criteria.
                    </div>
                  ) : (
                    activeAssignedIssues.map((task) => {
                      const sla = getSlaCondition(task);
                      return (
                        <div
                          key={task.id}
                          onClick={() => openIssueDetail(task)}
                          className="p-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-2 cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-[#ea580c]">
                              {task.id}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSlaBadge(sla)}`}>
                              {sla}
                            </span>
                          </div>

                          <h3 className="font-semibold text-xs text-[#111827]">
                            {task.title}
                          </h3>

                          <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#9ca3af]" />
                            <span>{task.locality}</span>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#f0f2f5] text-[11px]">
                            <span className="font-medium text-[#111827]">
                              {task.assignedTeam}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAssignModal(task);
                              }}
                              className="px-2 py-0.5 rounded border border-[#d1d5db] font-semibold text-[#ea580c]"
                            >
                              Reassign
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* VIEW B: SQUAD CAPACITY & FLEET CARDS */}
            {activeViewTab === 'squads' && (
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {squadsWithTelemetry.map((squad) => (
                  <div
                    key={squad.id}
                    className="p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb] space-y-3.5 flex flex-col justify-between shadow-2xs hover:border-[#d1d5db] transition-colors"
                  >
                    <div className="space-y-2.5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-[#111827]">
                            {squad.name}
                          </h3>
                          <div className="text-[11px] text-[#6b7280] pt-0.5">
                            Lead: <strong>{squad.lead}</strong> • {squad.members} Crew Members ({squad.department})
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex-shrink-0">
                          {squad.status}
                        </span>
                      </div>

                      {/* Scope */}
                      <div className="p-2 rounded-lg bg-white border border-[#e5e7eb] text-[11px] text-[#4b5563]">
                        <strong>Scope:</strong> {squad.specialty}
                      </div>

                      {/* Capacity Meter */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6b7280]">Live Capacity Load:</span>
                          <span className="font-mono font-bold text-[#111827]">
                            {squad.activeTasks.length} / 5 Work Orders ({squad.capacityPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              squad.capacityPct >= 80 ? 'bg-red-500' : squad.capacityPct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${squad.capacityPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Active Tasks In Squad */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#374151]">
                          <span>Allocated Tasks ({squad.activeTasks.length})</span>
                          {squad.overdueTasks.length > 0 && (
                            <span className="text-red-600 font-mono text-[10px]">
                              ⚠️ {squad.overdueTasks.length} Overdue
                            </span>
                          )}
                        </div>

                        {squad.activeTasks.length === 0 ? (
                          <div className="p-2.5 rounded-lg bg-white border border-[#e5e7eb] text-center text-[11px] text-[#9ca3af] italic">
                            No active tickets allocated • Standby ready
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-36 overflow-y-auto hide-scrollbar pr-0.5">
                            {squad.activeTasks.map((task) => (
                              <div
                                key={task.id}
                                onClick={() => openIssueDetail(task)}
                                className="p-2 rounded-lg bg-white border border-[#e5e7eb] hover:border-[#ea580c] transition-all cursor-pointer flex items-center justify-between text-xs group"
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[10px] font-bold text-[#ea580c]">
                                      {task.id}
                                    </span>
                                    <span className="font-semibold text-[#111827] truncate group-hover:text-[#ea580c] transition-colors">
                                      {task.title}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#6b7280] truncate">
                                    📍 {task.locality}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenAssignModal(task);
                                  }}
                                  className="text-[10px] font-semibold text-[#ea580c] hover:underline flex-shrink-0"
                                >
                                  Reassign
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Squad Contact & Resolved Summary */}
                    <div className="pt-2.5 border-t border-[#e5e7eb] flex items-center justify-between text-[11px] text-[#6b7280]">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#9ca3af]" />
                        <span>{squad.phone}</span>
                      </span>

                      <span className="font-mono text-[10px]">
                        {squad.resolvedTasks.length} Closed this Month
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Field Squad Assign & Reassign Modal */}
      {selectedIssueForAssign && (
        <AuthorityAssignModal
          isOpen={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedIssueForAssign(null);
          }}
          issue={selectedIssueForAssign}
          onConfirmAssign={handleConfirmAssign}
        />
      )}

    </div>
  );
}
