/**
 * CivicFix AI - Accessible searchable category combobox.
 *
 * Keyboard: ArrowDown/ArrowUp move focus, Enter selects, Escape closes,
 * typing filters options. Redesigned with non-overlapping controls, icon tags,
 * and high-contrast active states.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  ChevronDown,
  X,
  AlertTriangle,
  Trash2,
  Droplet,
  Waves,
  Lightbulb,
  Footprints,
  TrafficCone,
  Building2,
  MoreHorizontal,
  Check,
} from 'lucide-react';

const ICON_MAP = {
  'road-damage': AlertTriangle,
  'garbage-waste': Trash2,
  'water-leakage': Droplet,
  'drainage-sewage': Waves,
  streetlights: Lightbulb,
  footpaths: Footprints,
  'traffic-signals': TrafficCone,
  'public-property': Building2,
  other: MoreHorizontal,
};

export default function CategoryCombobox({ categories, value, onChange, required, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);

  const filtered = categories.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = categories.find((c) => c.key === value);
  const SelectedIcon = selected ? (ICON_MAP[selected.key] || MoreHorizontal) : null;

  const select = useCallback(
    (cat) => {
      setQuery('');
      onChange(cat.key);
      setOpen(false);
      setHighlight(0);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const clear = useCallback(
    (e) => {
      e.stopPropagation();
      setQuery('');
      onChange('');
      setOpen(false);
      setHighlight(0);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) select(filtered[highlight]);
      return;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!open || !listboxRef.current) return;
    const el = listboxRef.current.querySelector(`[data-index="${highlight}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  return (
    <div className="relative min-w-0">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5" aria-hidden="true">
          {SelectedIcon && !query ? (
            <SelectedIcon className="w-4 h-4 text-orange-600" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls="category-listbox"
          aria-autocomplete="list"
          aria-required={required}
          aria-invalid={!!error}
          value={query || (selected ? selected.label : '')}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={handleKeyDown}
          className={`w-full pl-10 pr-20 py-2.5 text-sm rounded-xl border transition-all shadow-xs focus:outline-none focus:ring-4 focus:ring-orange-500/10 ${
            error
              ? 'border-red-400 bg-red-50/20 focus:border-red-500'
              : selected
              ? 'border-orange-300 bg-orange-50/20 text-slate-900 font-medium focus:border-orange-500'
              : 'border-slate-200 bg-white text-slate-900 focus:border-orange-500'
          }`}
          placeholder="Search categories (e.g. Roads, Garbage, Water)…"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Action button container on right (never overlapping) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selected && (
            <button
              type="button"
              onClick={clear}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
              aria-label="Clear category"
              title="Clear category"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setOpen(!open);
              inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
            aria-label="Toggle category options"
            title="Open category list"
            tabIndex={-1}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open ? 'rotate-180 text-orange-600' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="category-listbox"
          ref={listboxRef}
          role="listbox"
          aria-label="Issue categories"
          className="absolute z-40 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-[280px] overflow-y-auto p-1.5 animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {filtered.length === 0 ? (
            <div role="option" className="px-3 py-3 text-xs text-slate-500 text-center">
              No matching categories found
            </div>
          ) : (
            filtered.map((cat, index) => {
              const active = index === highlight;
              const chosen = cat.key === value;
              const CatIcon = ICON_MAP[cat.key] || MoreHorizontal;
              return (
                <div
                  key={cat.key}
                  data-index={index}
                  role="option"
                  aria-selected={chosen}
                  id={`category-option-${cat.key}`}
                  onMouseDown={(e) => {
                    // Prevent input blur before select fires
                    e.preventDefault();
                    select(cat);
                  }}
                  onMouseMove={() => setHighlight(index)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer select-none transition-colors ${
                    chosen
                      ? 'bg-orange-50 text-orange-950 font-semibold'
                      : active
                      ? 'bg-slate-100/80 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      chosen
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate flex-1">{cat.label}</span>
                  {chosen && (
                    <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1.5" role="alert">
          <span aria-hidden="true">!</span> {error}
        </p>
      )}
    </div>
  );
}
