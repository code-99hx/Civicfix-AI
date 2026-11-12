import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Building2, 
  Save, 
  Check, 
  Map, 
  Clock, 
  RotateCcw, 
  ShieldAlert
} from 'lucide-react';
import { 
  getAuthoritySettings, 
  saveAuthoritySettings, 
  resetAuthorityDataset 
} from '../../services/authorityData';

export default function AuthoritySettingsPage() {
  const { setIssues, showToast } = useOutletContext();
  const [settings, setSettings] = useState(getAuthoritySettings());

  // Form states
  const [orgName, setOrgName] = useState(settings.orgName || 'Bruhat Bengaluru Mahanagara Palike');
  const [department, setDepartment] = useState(settings.department || 'Roads & Infrastructure Engineering');
  const [ward, setWard] = useState(settings.ward || 'Ward 112 (Indiranagar)');
  const [zone, setZone] = useState(settings.zone || 'East Zone');
  const [nodalOfficer, setNodalOfficer] = useState(settings.nodalOfficer || 'Insp. Ramesh Rao');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'nodal.ward112@bbmp.gov.in');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '+91 80 2521 4410');

  // SLA Targets
  const [criticalSla, setCriticalSla] = useState(settings.slaTargets?.criticalHours || 12);
  const [highSla, setHighSla] = useState(settings.slaTargets?.highHours || 24);
  const [mediumSla, setMediumSla] = useState(settings.slaTargets?.mediumHours || 48);
  const [lowSla, setLowSla] = useState(settings.slaTargets?.lowHours || 72);

  // Map defaults
  const [defaultBasemap, setDefaultBasemap] = useState(settings.mapDefaults?.defaultBasemap || 'light');
  const [enableClustering, setEnableClustering] = useState(settings.mapDefaults?.enableClustering ?? true);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(settings.notifications?.criticalSlaBreachEmail ?? true);
  const [smsAlerts, setSmsAlerts] = useState(settings.notifications?.newDuplicateReportSms ?? true);

  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      orgName,
      department,
      ward,
      zone,
      nodalOfficer,
      contactEmail,
      contactPhone,
      slaTargets: {
        criticalHours: Number(criticalSla),
        highHours: Number(highSla),
        mediumHours: Number(mediumSla),
        lowHours: Number(lowSla)
      },
      mapDefaults: {
        defaultBasemap,
        enableClustering
      },
      notifications: {
        criticalSlaBreachEmail: emailAlerts,
        newDuplicateReportSms: smsAlerts
      }
    };

    saveAuthoritySettings(updated);
    setSettings(updated);
    setSavedFeedback(true);
    if (showToast) showToast('Settings updated successfully in demo storage');
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo incidents to initial sample state? This will clear custom notes and simulated status changes.')) {
      const fresh = resetAuthorityDataset();
      setIssues(fresh);
      if (showToast) showToast('Demo dataset reset to initial state');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#f0f2f5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
            Authority Console Settings & Preferences
          </h1>
          <p className="text-xs text-[#6b7280]">
            Manage operational parameters, SLA target thresholds, and jurisdictional preferences for Ward 112.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Incidents</span>
        </button>
      </div>

      {savedFeedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Authority settings saved in client storage and synced to all console views.</span>
        </div>
      )}

      {/* Simulated Verification Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>Demonstration Operations Mode • Simulated Administrative Role</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          This console provides a production-grade prototype for civic triage and dispatch demonstration. In an official municipal deployment, updates are signed through municipal SSO and dispatch gateways.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Organization & Jurisdiction Profile */}
        <div className="p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f0f2f5]">
            <Building2 className="w-4 h-4 text-[#ea580c]" />
            <h2 className="font-bold text-sm text-[#111827]">
              Jurisdictional Node & Department Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Civic Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Operating Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Ward Identifier
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Administrative Zone
              </label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Nodal Operations Officer
              </label>
              <input
                type="text"
                value={nodalOfficer}
                onChange={(e) => setNodalOfficer(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Official Dispatch Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Direct Control Room Line
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs text-[#111827] focus:bg-white focus:border-[#ea580c] focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Operational SLA Target Thresholds */}
        <div className="p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f0f2f5]">
            <Clock className="w-4 h-4 text-[#ea580c]" />
            <h2 className="font-bold text-sm text-[#111827]">
              Service Level Agreement (SLA) Resolution Targets
            </h2>
          </div>

          <p className="text-[11px] text-[#6b7280]">
            Configures deadline countdowns and overdue alert triggers across the issue queue and GIS map.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
              <label className="block font-bold text-red-800 text-[10px] uppercase">
                Critical SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={criticalSla}
                  onChange={(e) => setCriticalSla(e.target.value)}
                  className="w-16 px-2 py-1 bg-white border border-red-300 rounded font-mono font-bold text-xs"
                />
                <span className="text-red-700 font-medium">Hours</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 space-y-1">
              <label className="block font-bold text-orange-800 text-[10px] uppercase">
                High SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={highSla}
                  onChange={(e) => setHighSla(e.target.value)}
                  className="w-16 px-2 py-1 bg-white border border-orange-300 rounded font-mono font-bold text-xs"
                />
                <span className="text-orange-700 font-medium">Hours</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <label className="block font-bold text-amber-800 text-[10px] uppercase">
                Medium SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={mediumSla}
                  onChange={(e) => setMediumSla(e.target.value)}
                  className="w-16 px-2 py-1 bg-white border border-amber-300 rounded font-mono font-bold text-xs"
                />
                <span className="text-amber-700 font-medium">Hours</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <label className="block font-bold text-blue-800 text-[10px] uppercase">
                Low SLA
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  max={360}
                  value={lowSla}
                  onChange={(e) => setLowSla(e.target.value)}
                  className="w-16 px-2 py-1 bg-white border border-blue-300 rounded font-mono font-bold text-xs"
                />
                <span className="text-blue-700 font-medium">Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* GIS Map & Ingestion Defaults */}
        <div className="p-5 bg-white border border-[#e5e7eb] rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#f0f2f5]">
            <Map className="w-4 h-4 text-[#ea580c]" />
            <h2 className="font-bold text-sm text-[#111827]">
              GIS Command Map & Telemetry Defaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-[#374151] uppercase tracking-wider text-[11px]">
                Default Basemap Theme
              </label>
              <select
                value={defaultBasemap}
                onChange={(e) => setDefaultBasemap(e.target.value)}
                className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg text-xs"
              >
                <option value="light">Carto Positron (Clean Light SaaS)</option>
                <option value="dark">Carto Dark Matter (Tactical Night)</option>
                <option value="osm">OpenStreetMap Standard</option>
                <option value="satellite">Esri World Satellite Imagery</option>
              </select>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableClustering}
                  onChange={(e) => setEnableClustering(e.target.checked)}
                  className="rounded text-[#ea580c] focus:ring-[#ea580c]"
                />
                <span className="font-medium text-[#111827]">Enable Spatial Cluster Bubbles at low zoom</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-[#ea580c] focus:ring-[#ea580c]"
                />
                <span className="font-medium text-[#111827]">Notify Officer on Critical SLA Breaches</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-[#ea580c] focus:ring-[#ea580c]"
                />
                <span className="font-medium text-[#111827]">Send SMS dispatch notifications for duplicate surges</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
}
