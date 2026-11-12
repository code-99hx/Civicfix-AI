/**
 * CivicFix AI - Location details form.
 *
 * Geolocation is only requested after an explicit button click; manual entry is
 * always available. Ward options are explicitly demo data.
 * Redesigned with premium SaaS input styles, coordinates pill, and modern map container.
 */

import React, { useState, useCallback } from 'react';
import { MapPin, LocateFixed, AlertTriangle, Info, Compass } from 'lucide-react';
import { DEMO_WARDS } from './reportModel';
import LocationMapPreview from './LocationMapPreview';

export default function LocationDetailsForm({
  value,
  onChange,
  error = {},
  mapDisabled: _mapDisabled,
}) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const loc = (value && value.location) ? value.location : (value || {});

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Your browser does not support geolocation. Please enter the address manually.');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange((prev) => {
          const current = (prev && prev.location) ? prev.location : (prev || {});
          return {
            ...current,
            lat: latitude,
            lng: longitude,
            coordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            source: 'geolocation',
          };
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Please enter the address manually.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError('Location information is unavailable. Please enter the address manually.');
        } else if (err.code === err.TIMEOUT) {
          setGeoError('The location request timed out. Please enter the address manually.');
        } else {
          setGeoError('Unable to determine your location. Please enter the address manually.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }, [onChange]);

  const setField = (field) => (e) => {
    onChange({ ...loc, [field]: e.target.value });
  };

  const setWard = (e) => {
    onChange({ ...loc, ward: e.target.value });
  };

  const handleMapChange = (lat, lng, source) => {
    onChange({
      ...loc,
      lat,
      lng,
      coordinates: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
      source,
    });
  };

  return (
    <div className="space-y-4">
      {/* Street Address */}
      <div className="space-y-1.5">
        <label htmlFor="report-location-address" className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Street address or landmark area <span className="text-orange-600">*</span></span>
          <span className="text-[10px] text-slate-400 font-normal lowercase">required</span>
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="report-location-address"
            type="text"
            value={loc.address || ''}
            onChange={setField('address')}
            placeholder="e.g. 100ft Road, near 12th Main junction"
            aria-required="true"
            aria-invalid={error?.location ? 'true' : 'false'}
            className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border transition-all shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${
              error?.location
                ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                : 'border-slate-200 bg-white text-slate-900 focus:border-orange-500 placeholder:text-slate-400'
            }`}
          />
        </div>
        {error?.location && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1.5" role="alert">
            <span aria-hidden="true">!</span> {error.location}
          </p>
        )}
      </div>

      {/* Locality & Ward Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label htmlFor="report-location-locality" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Locality / neighborhood
          </label>
          <input
            id="report-location-locality"
            type="text"
            value={loc.locality || ''}
            onChange={setField('locality')}
            placeholder="e.g. Indiranagar 1st Stage"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 placeholder:text-slate-400 transition-all"
          />
          {error?.locality && (
            <p className="text-xs text-red-600 font-medium" role="alert">
              <span aria-hidden="true">!</span> {error.locality}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="report-location-ward" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Municipal Ward
            </label>
            <span className="text-[10px] text-slate-400 font-mono">Demo zone</span>
          </div>
          <select
            id="report-location-ward"
            value={loc.ward || ''}
            onChange={setWard}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all cursor-pointer"
          >
            <option value="">Select municipal ward…</option>
            {DEMO_WARDS.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Landmark & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="report-location-landmark" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nearby Landmark (optional)
          </label>
          <input
            id="report-location-landmark"
            type="text"
            value={loc.landmark || ''}
            onChange={setField('landmark')}
            placeholder="e.g. Opposite Metro Pillar #42, near coffee house"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="report-location-postal" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            PIN code (optional)
          </label>
          <input
            id="report-location-postal"
            type="text"
            value={loc.postalCode || ''}
            onChange={setField('postalCode')}
            placeholder="e.g. 560038"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 placeholder:text-slate-400 font-mono transition-all"
          />
        </div>
      </div>

      {/* Map & GPS Pinning Box */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs bg-white border border-slate-200 text-slate-800 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <LocateFixed className={`w-4 h-4 text-orange-600 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Acquiring GPS fix…' : 'Use my current GPS location'}</span>
          </button>

          {loc.coordinates ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{loc.coordinates}</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
              GPS requested only when clicked
            </span>
          )}
        </div>

        {geoError && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span>{geoError}</span>
          </div>
        )}

        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
          <LocationMapPreview
            value={loc}
            onChange={handleMapChange}
            className="h-44 sm:h-52 w-full"
          />
        </div>

        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Click anywhere on the map to pin the exact incident spot, or drag the marker to adjust.</span>
        </p>
      </div>
    </div>
  );
}
