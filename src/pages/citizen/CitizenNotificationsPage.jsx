import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  CheckCheck, 
  Eye,
  Sparkles
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
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

export default function CitizenNotificationsPage() {
  const context = useOutletContext() || {};
  const { 
    reports = [], 
    openReportDrawer, 
    showToast,
    notifications: contextNotifications,
    markNotificationRead,
    markAllNotificationsRead
  } = context;

  const [localNotifications, setLocalNotifications] = useState(contextNotifications || INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    if (contextNotifications) {
      setLocalNotifications(contextNotifications);
    }
  }, [contextNotifications]);

  const markAsRead = (id) => {
    if (markNotificationRead) {
      markNotificationRead(id);
    } else {
      setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
    if (showToast) showToast('Notification marked as read.');
  };

  const markAllAsRead = () => {
    if (markAllNotificationsRead) {
      markAllNotificationsRead();
    } else {
      setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (showToast) showToast('All notifications marked as read.');
    }
  };

  const notifications = contextNotifications || localNotifications;

  const handleOpenReport = (reportId) => {
    const found = reports.find(r => r.id === reportId);
    if (found && openReportDrawer) {
      openReportDrawer(found);
    } else if (showToast) {
      showToast(`Viewing details for incident ${reportId}.`);
    }
  };

  const displayed = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Activity & Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff5722] text-white font-semibold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 pt-0.5">
            Automated alerts, triage updates, and municipal crew progress updates on your reported grievances.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-[#ff5722] text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'unread'
              ? 'border-[#ff5722] text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="p-12 text-center rounded-lg bg-white border border-neutral-200/90 shadow-2xs space-y-2">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="font-semibold text-neutral-700 text-sm">No notifications to display</p>
            <p className="text-xs text-neutral-500">You are completely up to date on all civic reports.</p>
          </div>
        ) : (
          displayed.map((n) => {
            return (
              <div
                key={n.id}
                className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !n.read 
                    ? 'bg-white border-neutral-300 shadow-2xs ring-1 ring-neutral-200' 
                    : 'bg-neutral-50/70 border-neutral-200/80 text-neutral-600'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.type === 'dispatch' 
                      ? 'bg-blue-100 text-blue-700' 
                      : n.type === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-orange-100 text-[#ff5722]'
                  }`}>
                    {n.type === 'dispatch' ? (
                      <Clock className="w-4 h-4" />
                    ) : n.type === 'resolved' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-neutral-900">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#ff5722]" />
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {n.desc}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono pt-0.5">
                      <span>{n.time}</span>
                      <span>•</span>
                      <span>Ref: {n.reportId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {n.reportId && (
                    <button
                      onClick={() => handleOpenReport(n.reportId)}
                      className="px-2.5 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Report</span>
                    </button>
                  )}

                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
