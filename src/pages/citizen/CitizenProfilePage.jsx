import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Save, 
  Bell, 
  Sliders,
  Building2
} from 'lucide-react';
import { getDemoSession, saveDemoSession } from '../../services/demoAuth';

const AVATAR_COLORS = [
  { name: 'Warm Charcoal', class: 'bg-neutral-900 text-white' },
  { name: 'Civic Coral', class: 'bg-[#ff5722] text-white' },
  { name: 'Navy Blue', class: 'bg-blue-600 text-white' },
  { name: 'Emerald Pine', class: 'bg-emerald-600 text-white' }
];

const PREF_CATEGORIES = [
  'Road Damage & Potholes',
  'Garbage & Sanitation',
  'Streetlights',
  'Water Leakage',
  'Drainage & Sewage',
  'Public Spaces & Parks'
];

export default function CitizenProfilePage() {
  const { showToast } = useOutletContext();
  const [session, setSession] = useState(getDemoSession());
  const [name, setName] = useState(session?.user?.name || 'Priya Sharma');
  const [email, setEmail] = useState(session?.user?.email || 'citizen@demo.org');
  const [locality, setLocality] = useState(session?.citizenProfile?.location?.locality || 'Indiranagar');
  const [ward, setWard] = useState('Ward 112 (Indiranagar)');
  const [city, setCity] = useState(session?.citizenProfile?.location?.city || 'Bengaluru');
  const [stateName, setStateName] = useState(session?.citizenProfile?.location?.state || 'Karnataka');
  const [pincode, setPincode] = useState(session?.citizenProfile?.location?.pincode || '560038');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [notifyStatusUpdates, setNotifyStatusUpdates] = useState(true);
  const [notifyNearbyActivity, setNotifyNearbyActivity] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);
  const [selectedCats, setSelectedCats] = useState(['Road Damage & Potholes', 'Streetlights']);

  const toggleCategory = (cat) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter(c => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...session,
      user: {
        ...session.user,
        name,
        email
      },
      citizenProfile: {
        ...session.citizenProfile,
        categories: selectedCats,
        notificationPreferences: {
          notifyStatusUpdates,
          notifyNearbyActivity,
          notifyWeeklyDigest
        },
        location: {
          locality,
          ward,
          city,
          state: stateName,
          pincode
        }
      }
    };
    saveDemoSession(updated);
    setSession(updated);
    if (showToast) showToast('Citizen profile and ward preferences saved.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Profile & Preferences
        </h2>
        <p className="text-xs text-neutral-500 pt-0.5">
          Manage your verified citizen node identity, default ward jurisdiction, and dispatch notification subscriptions.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Citizen Identity */}
        <div className="bg-white border border-neutral-200/90 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <User className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-bold text-sm text-neutral-900">
              Citizen Identity
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shadow-xs ${AVATAR_COLORS[selectedColorIndex].class}`}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {AVATAR_COLORS.map((col, idx) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-4 h-4 rounded-full ${col.class.split(' ')[0]} ${selectedColorIndex === idx ? 'ring-2 ring-neutral-900 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Full Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-800">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-neutral-800">Verification Status</label>
                <div className="flex items-center gap-2 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified Citizen Node • Mobile SMS OTP Authenticated (Simulated)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Ward Preferences */}
        <div className="bg-white border border-neutral-200/90 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Building2 className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-bold text-sm text-neutral-900">
              Ward Jurisdiction & Spatial Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Primary Ward</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Locality / Sector</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-800">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-neutral-800">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Subscribed Categories */}
        <div className="bg-white border border-neutral-200/90 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Sliders className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-bold text-sm text-neutral-900">
              Subscribed Civic Categories
            </h3>
          </div>

          <p className="text-xs text-neutral-500">
            Select the issues you care most about to personalize your nearby radar highlights and digest notifications.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {PREF_CATEGORIES.map((cat) => {
              const isSelected = selectedCats.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {isSelected && '✓ '}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Notification Preferences */}
        <div className="bg-white border border-neutral-200/90 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Bell className="w-4 h-4 text-[#ff5722]" />
            <h3 className="font-bold text-sm text-neutral-900">
              Notification Preferences
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-md bg-neutral-50 border border-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyStatusUpdates}
                onChange={(e) => setNotifyStatusUpdates(e.target.checked)}
                className="mt-0.5 rounded text-[#ff5722] focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-900">Immediate Report Status Changes</span>
                <p className="text-neutral-500 text-[11px]">Receive in-app alerts when a field crew is dispatched or your issue is resolved.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md bg-neutral-50 border border-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyNearbyActivity}
                onChange={(e) => setNotifyNearbyActivity(e.target.checked)}
                className="mt-0.5 rounded text-[#ff5722] focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-900">Nearby High-Priority Incidents</span>
                <p className="text-neutral-500 text-[11px]">Notify when neighbors report hazardous road damage or water main bursts within 500m.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md bg-neutral-50 border border-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyWeeklyDigest}
                onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                className="mt-0.5 rounded text-[#ff5722] focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-neutral-900">Weekly Ward 112 Resolution Digest</span>
                <p className="text-neutral-500 text-[11px]">Receive a weekly recap of repaired potholes, restored streetlights, and sanitation cleanups.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-[#ff5722] text-white text-xs font-semibold hover:bg-[#e64a19] shadow-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  );
}
