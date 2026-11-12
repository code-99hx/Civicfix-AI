/**
 * CivicFix AI - Progressive step indicator for the three-stage report flow.
 *
 * States: upcoming -> current -> completed.
 * Redesigned into an enterprise SaaS step banner with stage cards, icons, and status badges.
 */

import React from 'react';
import { Check, Sparkles, FileText, Send } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Issue Details & Evidence', sub: 'Category, location, and photos', icon: FileText },
  { id: 2, label: 'AI Review & Verification', sub: 'Local heuristics & checklist', icon: Sparkles },
  { id: 3, label: 'Final Submission', sub: 'Confirm and record ticket', icon: Send },
];

export default function ReportProgressStepper({ currentStep, completedSteps = [], canSelect = true, onStepSelect }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs">
      {/* Mobile Compact Progress Bar (screens < md) */}
      <div className="md:hidden space-y-2 p-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              {currentStep}
            </span>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {STEPS.find(s => s.id === currentStep)?.label}
              </span>
              <span className="text-[10px] text-slate-500">
                Step {currentStep} of 3
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            {currentStep === 1 ? 'Details' : currentStep === 2 ? 'AI Review' : 'Submit'}
          </span>
        </div>

        {/* 3-Segment Progress Bar */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {STEPS.map((s) => {
            const isCompleted = completedSteps.includes(s.id);
            const isCurrent = currentStep === s.id;
            const isClickable = canSelect && (isCompleted || isCurrent);
            return (
              <button
                key={s.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepSelect && onStepSelect(s.id)}
                className={`h-1.5 rounded-full transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500' 
                    : isCurrent 
                    ? 'bg-orange-500 ring-2 ring-orange-500/20' 
                    : 'bg-slate-200'
                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                title={`Go to Step ${s.id}`}
                aria-label={`Step ${s.id}: ${s.label}`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet Full 3-Card Stepper (screens >= md) */}
      <div className="hidden md:grid grid-cols-3 gap-2.5">
        {STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = !isCompleted && !isCurrent;
          const isClickable = canSelect && (isCompleted || isCurrent);
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepSelect && onStepSelect(step.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left relative overflow-hidden ${
                isCurrent
                  ? 'bg-gradient-to-r from-orange-50/90 via-orange-50/40 to-white border border-orange-300 shadow-xs ring-1 ring-orange-500/10'
                  : isCompleted
                  ? 'bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/80 cursor-pointer'
                  : 'bg-white border border-slate-200/50 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Active glow accent bar */}
              {isCurrent && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-l-xl" />
              )}

              {/* Step indicator circle / icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all shadow-xs ${
                  isCurrent
                    ? 'bg-orange-600 text-white ring-4 ring-orange-500/20'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
              </div>

              {/* Step text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold tracking-wider uppercase font-mono ${
                    isCurrent ? 'text-orange-700' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    Stage {step.id} {isCompleted ? '• Done' : isCurrent ? '• Active' : ''}
                  </span>
                </div>
                <div className={`text-xs sm:text-sm font-semibold truncate ${
                  isCurrent ? 'text-slate-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  {step.label}
                </div>
                <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                  {step.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
