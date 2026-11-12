import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ChevronRight,
  Camera,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  Download
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Road Damage & Potholes',
  'Garbage & Sanitation',
  'Streetlights',
  'Water Leakage',
  'Drainage & Sewage',
  'Other Civic Issues'
];

const STATUSES = ['All Statuses', 'In Progress', 'Awaiting Review', 'Resolved'];
const SORTS = ['Newest First', 'Oldest First'];
const ITEMS_PER_PAGE = 6;

export default function CitizenReportsPage() {
  const { reports, openReportModal, openReportDrawer, showToast } = useOutletContext();
  const [searchParams] = useSearchParams();
  
  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSort, setSelectedSort] = useState('Newest First');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);

  // Sync incoming search query parameters
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && STATUSES.includes(statusParam)) {
      setSelectedStatus(statusParam);
    }
    const qParam = searchParams.get('q');
    if (qParam) {
      setSearch(qParam);
    }
    const catParam = searchParams.get('category');
    if (catParam) {
      const match = CATEGORIES.find(c => c.toLowerCase().includes(catParam.toLowerCase()));
      if (match) setSelectedCategory(match);
    }
    setCurrentPage(1);
  }, [searchParams]);

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('All Statuses');
    setSelectedCategory('All Categories');
    setSelectedSort('Newest First');
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = 
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Statuses' || r.status === selectedStatus;
      const matchesCategory = selectedCategory === 'All Categories' || r.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      if (selectedSort === 'Oldest First') {
        return a.id.localeCompare(b.id);
      }
      return b.id.localeCompare(a.id);
    });
  }, [reports, search, selectedStatus, selectedCategory, selectedSort]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedReports = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Title,Category,Location,Status,SubmittedAt"]
      .concat(filtered.map(r => `"${r.id}","${r.title}","${r.category}","${r.location}","${r.status}","${r.submittedAt}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `civicfix_reports_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Reports exported to CSV successfully.');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            My Reported Issues
          </h2>
          <p className="text-xs text-neutral-500 pt-0.5">
            Search, filter, and track real-time resolution updates on all your submitted grievances.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={openReportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#ff5722] text-white text-xs font-semibold hover:bg-[#e64a19] shadow-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar (Matching Reference SaaS controls) */}
      <div className="p-4 bg-white border border-neutral-200/90 rounded-lg shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, keyword, or street..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort filter */}
          <div>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Toolbar Footer with Reset & View Toggle */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <span>Showing <strong className="text-neutral-900 font-semibold">{filtered.length}</strong> of {reports.length} reports</span>
            {(search || selectedStatus !== 'All Statuses' || selectedCategory !== 'All Categories') && (
              <button
                onClick={resetFilters}
                className="text-[#ff5722] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded border border-neutral-200/60">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}
              title="Grid cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports Render */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-white border border-neutral-200/90 shadow-2xs space-y-3">
          <p className="font-semibold text-neutral-700 text-sm">No reports match your filters</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting filters to view all civic reports.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* TABLE VIEW (Matching Reference CRM Table) */
        <div className="bg-white border border-neutral-200/90 rounded-lg shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Reference ID</th>
                  <th className="py-2.5 px-4 font-semibold">Issue</th>
                  <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Category</th>
                  <th className="py-2.5 px-4 font-semibold hidden lg:table-cell">Location</th>
                  <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">Submitted</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => openReportDrawer(report)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      {report.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {report.photo ? (
                          <img
                            src={report.photo}
                            alt=""
                            className="w-9 h-9 rounded object-cover border border-neutral-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded bg-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
                            <Camera className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0 max-w-[220px] sm:max-w-[280px]">
                          <div className="font-semibold text-neutral-900 group-hover:text-[#ff5722] transition-colors truncate">
                            {report.title}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate md:hidden">
                            {report.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell text-neutral-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px]">
                        {report.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 hidden lg:table-cell text-neutral-600 max-w-[180px] truncate" title={report.location}>
                      {report.location}
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell text-neutral-500 font-mono whitespace-nowrap">
                      {report.submittedAt}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : report.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {report.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReportDrawer(report);
                        }}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="View Full Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (screens < md) */}
          <div className="md:hidden divide-y divide-neutral-100">
            {paginatedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => openReportDrawer(report)}
                className="p-3.5 space-y-2 hover:bg-neutral-50/80 transition-colors cursor-pointer active:bg-neutral-100"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-neutral-900">{report.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                    report.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : report.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {report.photo ? (
                    <img
                      src={report.photo}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 flex-shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-neutral-900 text-xs line-clamp-2 leading-snug">
                      {report.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 truncate">
                      📍 {report.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-400 border-t border-neutral-100/80">
                  <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600 font-medium">
                    {report.category}
                  </span>
                  <span className="font-mono">{report.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border border-neutral-200 bg-white disabled:opacity-40 hover:bg-neutral-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border border-neutral-200 bg-white disabled:opacity-40 hover:bg-neutral-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedReports.map((report) => (
            <div
              key={report.id}
              onClick={() => openReportDrawer(report)}
              className="bg-white border border-neutral-200/90 rounded-lg p-4 shadow-2xs hover:border-neutral-300 transition-all cursor-pointer space-y-3 group"
            >
              {report.photo ? (
                <div className="w-full h-36 rounded-md overflow-hidden bg-neutral-950 border border-neutral-200">
                  <img
                    src={report.photo}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-36 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <Camera className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-neutral-900">{report.id}</span>
                  <span className={`px-2 py-0.5 rounded font-semibold border ${
                    report.status === 'Resolved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : report.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-neutral-900 group-hover:text-[#ff5722] transition-colors truncate">
                  {report.title}
                </h3>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="truncate max-w-[180px]">{report.location}</span>
                <span className="font-mono">{report.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
