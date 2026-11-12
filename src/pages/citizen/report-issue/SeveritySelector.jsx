/**
 * CivicFix AI - Accessible severity selector (resident-provided assessment).
 * Redesigned with color-coded risk levels, interactive card states, and clear radio indicator pills.
 */

import React from 'react';
import { AlertTriangle, Check, ShieldAlert, AlertCircle, Info, Sparkles } from 'lucide-react';

const SEV_CONFIG = {
  low: {
    level: 'Level 1',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    activeCard: 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs',
    dotClass: 'bg-emerald-500',
  },
  moderate: {
    level: 'Level 2',
    color: 'blue',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    activeCard: 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs',
    dotClass: 'bg-blue-500',
  },
  high: {
    level: 'Level 3',
    color: 'orange',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    activeCard: 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs',
    dotClass: 'bg-orange-500',
  },
  critical: {
    level: 'Level 4',
    color: 'red',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    activeCard: 'border-red-500 bg-red-50/70 ring-2 ring-red-500/20 shadow-xs',
    dotClass: 'bg-red-500',
  },
};

export default function SeveritySelector({ severities, value, onChange, error }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {severities.map((sev) => {
        const active = value === sev.key;
        const config = SEV_CONFIG[sev.key] || SEV_CONFIG.low;

        return (
          <div key={sev.key} className="relative min-w-0">
            <input
              id={`severity-${sev.key}`}
              type="radio"
              name="report-severity"
              value={sev.key}
              checked={active}
              onChange={() => onChange(sev.key)}
              aria-describedby={`severity-${sev.key}-desc`}
              className="peer sr-only"
            />
            <label
              htmlFor={`severity-${sev.key}`}
              className={`block h-full p-3.5 text-left rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                active
                  ? config.activeCard
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
                  <span className="font-bold text-sm text-slate-900">{sev.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${config.badgeClass}`}>
                    {config.level}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      active ? 'bg-slate-900 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              </div>

              <p id={`severity-${sev.key}-desc`} className="text-xs text-slate-600 leading-relaxed font-normal">
                {sev.description}
              </p>

              {sev.key === 'critical' && (
                <div className="mt-2.5 pt-2 border-t border-red-200/60 flex items-start gap-1.5 text-[10px] text-red-700">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-tight font-medium">
                    Call 112 directly if life is in danger. Not for emergency dispatch.
                  </span>
                </div>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}
