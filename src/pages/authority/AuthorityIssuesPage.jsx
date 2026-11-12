import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  Users,
  Map,
  ChevronLeft
} from 'lucide-react';
import { getSlaCondition, MUNICIPAL_SQUADS, bulkUpdateIssueStatus } from '../../services/authorityData';
import AuthorityAssignModal from '../../components/AuthorityAssignModal';

const CATEGORIES = [
  'All Categories',
  'Road Damage & Potholes',
  'Water Leakage',
  'Streetlights',
  'Garbage & Sanitation',
  'Drainage & Stormwater',
  'Traffic Infrastructure'
];

const SEVERITIES = ['All Severities', 'Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['All Statuses', 'New', 'Awaiting Review', 'In Progress', 'Resolved'];
const SLA_CONDITIONS = ['All SLA States', 'Overdue', 'Due Soon', 'On Track', 'Resolved'];

export default function AuthorityIssuesPage() {
  const { issues, openIssueDetail, updateIssue, showToast } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Query Sync
  const initialSearch = searchParams.get('q') || '';
  const initialFilterTab = searchParams.get('filter') || 'all'; // 'all' | 'unassigned' | 'in_progress' | 'overdue' | 'resolved'
  const initialSla = searchParams.get('sla') || 'All SLA States';

  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState(initialFilterTab);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedSla, setSelectedSla] = useState(initialSla === 'overdue' ? 'Overdue' : 'All SLA States');
  const [selectedSquad, setSelectedSquad] = useState('All Squads');

  // Sorting
  const [sortField, setSortField] = useState('createdAt'); // 'createdAt' | 'severity' | 'dueAt' | 'id'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // React to URL query changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearch(q);

    const f = searchParams.get('filter');
    if (f) setActiveTab(f);

    const s = searchParams.get('sla');
    if (s === 'overdue') setSelectedSla('Overdue');
  }, [searchParams]);

  // Tab presets
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === 'unassigned') {
      setSelectedStatus('All Statuses');
      setSelectedSla('All SLA States');
    } else if (tab === 'in_progress') {
      setSelectedStatus('In Progress');
      setSelectedSla('All SLA States');
    } else if (tab === 'overdue') {
      setSelectedSla('Overdue');
      setSelectedStatus('All Statuses');
    } else if (tab === 'resolved') {
      setSelectedStatus('Resolved');
      setSelectedSla('All SLA States');
    } else {
      setSelectedStatus('All Statuses');
      setSelectedSla('All SLA States');
    }
  };

  // Severity Weight helper for sorting
  const getSeverityWeight = (sev) => {
    switch (sev) {
      case 'Critical': return 4;
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  // Filtered and Sorted Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Tab presets
      if (activeTab === 'unassigned' && (issue.assignedTeam !== 'Unassigned' && issue.assignedTeam)) return false;
      if (activeTab === 'in_progress' && issue.status !== 'In Progress') return false;
      if (activeTab === 'overdue' && getSlaCondition(issue) !== 'Overdue') return false;
      if (activeTab === 'resolved' && issue.status !== 'Resolved') return false;

      // Text search across ID, title, locality, department, assignedTeam, description
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesQuery = 
          issue.id.toLowerCase().includes(query) ||
          issue.title.toLowerCase().includes(query) ||
          issue.locality.toLowerCase().includes(query) ||
          issue.department.toLowerCase().includes(query) ||
          issue.assignedTeam.toLowerCase().includes(query) ||
          issue.category.toLowerCase().includes(query) ||
          (issue.description && issue.description.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Category
      if (selectedCategory !== 'All Categories' && issue.category !== selectedCategory) return false;

      // Severity
      if (selectedSeverity !== 'All Severities' && issue.severity !== selectedSeverity) return false;

      // Status
      if (selectedStatus !== 'All Statuses' && issue.status !== selectedStatus) return false;

      // SLA
      if (selectedSla !== 'All SLA States') {
        const cond = getSlaCondition(issue);
        if (cond !== selectedSla) return false;
      }

      // Squad
      if (selectedSquad !== 'All Squads' && issue.assignedTeam !== selectedSquad) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortField === 'dueAt') {
        comparison = new Date(a.dueAt || 0) - new Date(b.dueAt || 0);
      } else if (sortField === 'severity') {
        comparison = getSeverityWeight(a.severity) - getSeverityWeight(b.severity);
      } else if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [issues, activeTab, search, selectedCategory, selectedSeverity, selectedStatus, selectedSla, selectedSquad, sortField, sortDirection]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredIssues.length / pageSize) || 1;
  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIssues.slice(start, start + pageSize);
  }, [filteredIssues, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedIssues.length && paginatedIssues.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedIssues.map(i => i.id)));
    }
  };

  const handleToggleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedIds.size === 0) return;
    bulkUpdateIssueStatus(Array.from(selectedIds), newStatus, 'Bulk Queue Action');
    setSelectedIds(new Set());
    if (showToast) showToast(`Updated ${selectedIds.size} issues to ${newStatus}`);
  };

  const handleBulkAssignConfirm = ({ squadName, assigneeName, workInstructions }) => {
    selectedIds.forEach((id) => {
      updateIssue(id, {
        assignedTeam: squadName,
        assignedTo: assigneeName,
        status: 'In Progress',
        internalNotes: workInstructions ? `[Bulk Dispatch]: ${workInstructions}` : undefined,
        statusNote: `Bulk assigned to ${squadName}`
      });
    });
    setSelectedIds(new Set());
    if (showToast) showToast(`Dispatched ${selectedIds.size} issues to ${squadName}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All Categories');
    setSelectedSeverity('All Severities');
    setSelectedStatus('All Statuses');
    setSelectedSla('All SLA States');
    setSelectedSquad('All Squads');
    setActiveTab('all');
    setSearchParams({});
    setCurrentPage(1);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Severity styling
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getSlaBadge = (condition) => {
    switch (condition) {
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'Due Soon':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Awaiting Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] font-semibold';
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#f0f2f5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Municipal Incident Queue
          </h1>
          <p className="text-xs text-[#6b7280]">
            Review incoming citizen reports, prioritize triage, assign field squads, and track SLA delivery across Ward 112.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/authority/map')}
            className="px-3 py-1.5 rounded-lg border border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>View on GIS Map</span>
          </button>
        </div>
      </div>

      {/* Preset View Tabs (Horizontally scrollable on mobile) */}
      <div className="flex overflow-x-auto no-scrollbar scroll-smooth items-center gap-2 border-b border-[#f0f2f5] pb-2 text-xs whitespace-nowrap">
        {[
          { id: 'all', label: 'All Issues', count: issues.length },
          { id: 'unassigned', label: 'Unassigned', count: issues.filter(i => i.assignedTeam === 'Unassigned' || !i.assignedTeam).length, color: 'text-amber-700 bg-amber-50' },
          { id: 'in_progress', label: 'In Progress', count: issues.filter(i => i.status === 'In Progress').length, color: 'text-blue-700 bg-blue-50' },
          { id: 'overdue', label: 'SLA Overdue', count: issues.filter(i => getSlaCondition(i) === 'Overdue').length, color: 'text-red-700 bg-red-50' },
          { id: 'resolved', label: 'Resolved', count: issues.filter(i => i.status === 'Resolved').length, color: 'text-emerald-700 bg-emerald-50' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-[#f9fafb] text-[#4b5563] hover:bg-[#f3f4f6]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeTab === tab.id ? 'bg-[#374151] text-white' : (tab.color || 'bg-[#e5e7eb] text-[#374151]')
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ID, title, locality..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-[#111827] placeholder-[#9ca3af] focus:bg-white focus:border-[#ea580c] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
            >
              {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* SLA State Filter */}
          <div>
            <select
              value={selectedSla}
              onChange={(e) => {
                setSelectedSla(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
            >
              {SLA_CONDITIONS.map(sla => <option key={sla} value={sla}>{sla}</option>)}
            </select>
          </div>

          {/* Squad Filter */}
          <div>
            <select
              value={selectedSquad}
              onChange={(e) => {
                setSelectedSquad(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
            >
              <option value="All Squads">All Field Squads</option>
              {MUNICIPAL_SQUADS.map(sq => (
                <option key={sq.id} value={sq.name}>{sq.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter Summary & Reset Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0f2f5] text-[11px] text-[#6b7280]">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-[#111827]">{filteredIssues.length}</strong> matching tickets</span>
            {(search || selectedCategory !== 'All Categories' || selectedSeverity !== 'All Severities' || selectedStatus !== 'All Statuses' || selectedSla !== 'All SLA States' || selectedSquad !== 'All Squads') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[#ea580c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px]">Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-[#111827] text-white flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
            <span><strong>{selectedIds.size}</strong> issues selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBulkAssignModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Bulk Assign Squad</span>
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange('In Progress')}
              className="px-2.5 py-1 rounded-lg bg-[#374151] hover:bg-[#4b5563] text-white font-medium transition-colors"
            >
              Set In Progress
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatusChange('Resolved')}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors"
            >
              Mark Resolved
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-2 py-1 text-[#9ca3af] hover:text-white"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Main Issue Table (Desktop) & Card List (Mobile) */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-[#374151] border-collapse">
            <thead className="bg-[#fafbfc] border-b border-[#e5e7eb] text-[10px] font-bold text-[#6b7280] uppercase tracking-wider select-none">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedIssues.length && paginatedIssues.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded text-[#ea580c] focus:ring-[#ea580c] cursor-pointer"
                    aria-label="Select all issues on page"
                  />
                </th>
                <th 
                  className="p-3.5 cursor-pointer hover:text-[#111827]"
                  onClick={() => toggleSort('id')}
                >
                  <div className="flex items-center gap-1">
                    <span>Issue ID</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9ca3af]" />
                  </div>
                </th>
                <th className="p-3.5">Issue Summary & Locality</th>
                <th className="p-3.5">Category</th>
                <th 
                  className="p-3.5 cursor-pointer hover:text-[#111827]"
                  onClick={() => toggleSort('severity')}
                >
                  <div className="flex items-center gap-1">
                    <span>Severity</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9ca3af]" />
                  </div>
                </th>
                <th 
                  className="p-3.5 cursor-pointer hover:text-[#111827]"
                  onClick={() => toggleSort('dueAt')}
                >
                  <div className="flex items-center gap-1">
                    <span>SLA State</span>
                    <ArrowUpDown className="w-3 h-3 text-[#9ca3af]" />
                  </div>
                </th>
                <th className="p-3.5">Assigned Squad</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0f2f5]">
              {paginatedIssues.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-[#6b7280]">
                    No civic incidents match your current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedIssues.map((issue) => {
                  const isSelected = selectedIds.has(issue.id);
                  const sla = getSlaCondition(issue);

                  return (
                    <tr 
                      key={issue.id}
                      onClick={() => openIssueDetail(issue)}
                      className={`hover:bg-[#fafbfc] transition-colors cursor-pointer ${
                        isSelected ? 'bg-orange-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td 
                        className="p-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(issue.id)}
                          className="rounded text-[#ea580c] focus:ring-[#ea580c] cursor-pointer"
                          aria-label={`Select issue ${issue.id}`}
                        />
                      </td>

                      {/* ID */}
                      <td className="p-3.5 font-mono font-bold text-[#ea580c] whitespace-nowrap">
                        {issue.id}
                      </td>

                      {/* Summary & Locality */}
                      <td className="p-3.5 max-w-xs">
                        <div className="font-semibold text-[#111827] line-clamp-1 hover:text-[#ea580c] transition-colors">
                          {issue.title}
                        </div>
                        <div className="text-[11px] text-[#6b7280] flex items-center gap-1 truncate pt-0.5">
                          <MapPin className="w-3 h-3 text-[#9ca3af] flex-shrink-0" />
                          <span className="truncate">{issue.locality}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-[#4b5563] bg-[#f3f4f6] px-2 py-0.5 rounded-md">
                          {issue.category}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSeverityBadge(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </td>

                      {/* SLA State */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getSlaBadge(sla)}`}>
                          {sla}
                        </span>
                      </td>

                      {/* Assigned Squad */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`text-xs ${
                          issue.assignedTeam === 'Unassigned' ? 'text-amber-700 font-semibold italic' : 'text-[#111827] font-medium'
                        }`}>
                          {issue.assignedTeam}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td 
                        className="p-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {issue.hasValidCoords && (
                            <button
                              type="button"
                              onClick={() => navigate(`/authority/map?issueId=${issue.id}`)}
                              className="p-1 rounded-md text-[#6b7280] hover:text-[#ea580c] hover:bg-[#f3f4f6] transition-colors"
                              title="Focus on Map"
                            >
                              <Map className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openIssueDetail(issue)}
                            className="px-2.5 py-1 rounded-md border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] text-[11px] font-semibold transition-colors"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden divide-y divide-[#f0f2f5]">
          {paginatedIssues.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6b7280]">
              No civic incidents match your filter criteria.
            </div>
          ) : (
            paginatedIssues.map((issue) => {
              const sla = getSlaCondition(issue);
              return (
                <div
                  key={issue.id}
                  onClick={() => openIssueDetail(issue)}
                  className="p-4 space-y-2 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#ea580c]">
                      {issue.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-[#111827]">
                    {issue.title}
                  </h3>

                  <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9ca3af]" />
                    <span>{issue.locality}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f0f2f5] text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded border ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border ${getSlaBadge(sla)}`}>
                        {sla}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#374151] font-medium hidden sm:inline">
                        Squad: {issue.assignedTeam}
                      </span>
                      {issue.hasValidCoords && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/authority/map?issueId=${issue.id}`);
                          }}
                          className="p-1.5 rounded-md text-[#6b7280] hover:text-[#ea580c] hover:bg-[#f3f4f6] min-touch-target flex items-center justify-center"
                          title="Focus on Map"
                        >
                          <Map className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openIssueDetail(issue);
                        }}
                        className="px-3 py-1 rounded-lg border border-[#d1d5db] bg-white text-[#374151] font-bold text-xs hover:bg-[#f3f4f6] shadow-2xs cursor-pointer min-touch-target flex items-center justify-center"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Toolbar */}
        <div className="px-4 py-3 border-t border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between text-xs text-[#6b7280]">
          <div>
            Showing <strong className="text-[#111827]">{filteredIssues.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-[#111827]">{Math.min(currentPage * pageSize, filteredIssues.length)}</strong> of{' '}
            <strong className="text-[#111827]">{filteredIssues.length}</strong> issues
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 rounded-md border border-[#d1d5db] disabled:opacity-40 hover:bg-white text-[#374151] transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1 rounded-md border border-[#d1d5db] disabled:opacity-40 hover:bg-white text-[#374151] transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Bulk Assign Modal */}
      <AuthorityAssignModal
        isOpen={bulkAssignModalOpen}
        onClose={() => setBulkAssignModalOpen(false)}
        onConfirmAssign={handleBulkAssignConfirm}
        isBulk={true}
        selectedCount={selectedIds.size}
      />

    </div>
  );
}
