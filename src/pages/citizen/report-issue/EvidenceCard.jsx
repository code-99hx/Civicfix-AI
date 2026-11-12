/**
 * CivicFix AI - Single evidence preview card.
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Image as ImageIcon, RefreshCw, ArrowUp, ArrowDown, Maximize } from 'lucide-react';
import { formatBytes } from './reportModel';

export default function EvidenceCard({
  img,
  index,
  total,
  onRemove,
  onCaption,
  onSetPrimary,
  onMove,
  onReplace,
  onPreview,
}) {
  const [replaceInput, setReplaceInput] = useState(null);
  const statusLabels = {
    processing: 'Processing preview',
    ready: 'Ready',
    error: 'Error',
  };

  return (
    <div className={`relative rounded-lg border overflow-hidden transition-all duration-200 ease-out
      ${img.status === 'error'
        ? 'border-orange-700 bg-orange-50/40'
        : img.primary
          ? 'border-orange-600 bg-orange-50/30 ring-1 ring-orange-600/20'
          : 'border-slate-300 bg-white'}`}>
      <div className="relative h-36 bg-slate-100 overflow-hidden">
        {img.status === 'processing' ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400 animate-pulse">
              <RefreshCw className="w-5 h-5" />
              <span className="text-[10px]">Preparing preview</span>
            </div>
          </div>
        ) : img.status === 'error' ? (
          <div className="flex h-full items-center justify-center p-2 text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-orange-700 mb-1.5" />
            <div className="text-[10px] font-medium text-orange-800 leading-snug">
              Could not load preview
            </div>
          </div>
        ) : (
          <img
            src={img.previewUrl}
            alt={img.fileName}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        {/* Top Overlay Badge / Controls */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {img.primary ? (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-600 text-[10px] font-bold text-white shadow-sm border border-white/60 pointer-events-auto">
              <CheckCircle2 className="w-3.5 h-3.5" /> Primary
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSetPrimary && onSetPrimary(img.id)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur text-[10px] font-medium text-white shadow-sm pointer-events-auto cursor-pointer transition-colors"
              title="Set as primary photo"
            >
              Set Primary
            </button>
          )}

          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={() => onPreview(index)}
              aria-label={`Preview ${img.fileName}`}
              className="min-touch-target p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur text-white transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              title="Open larger preview"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(img.id)}
              aria-label={`Remove ${img.fileName} from evidence`}
              className="min-touch-target p-2 rounded-lg bg-red-600/90 hover:bg-red-600 backdrop-blur text-white transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-2 pt-1.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-600 truncate max-w-[130px]" title={img.fileName}>
              {img.fileName}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                img.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : img.status === 'error'
                    ? 'bg-orange-50 text-orange-700 border border-orange-100'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {img.status === 'ready' ? 'Ready' : img.status === 'error' ? 'Failed' : 'Processing'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setReplaceInput((prev) => (prev ? null : Date.now()));
            }}
            aria-label={`Replace ${img.fileName}`}
            className="p-1 text-[10px] text-slate-400 hover:text-orange-600 rounded hover:bg-slate-100 transition-colors"
            title="Replace image"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        {img.width && img.height && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] text-slate-500 font-mono">{img.width}×{img.height}</span>
            <span className="w-px h-2.5 bg-slate-300" />
            <span className="text-[10px] text-slate-500 font-mono">{formatBytes(img.size)}</span>
          </div>
        )}
        {!img.width && img.status !== 'processing' && img.status !== 'error' && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] text-slate-500 font-mono">{formatBytes(img.size)}</span>
          </div>
        )}

        <div className="flex items-end gap-1.5">
          <div className="flex-1">
            <label className="block text-[10px] font-medium text-slate-500 mb-1">Caption (optional)</label>
            <input
              type="text"
              value={img.caption}
              onChange={(e) => onCaption(img.id, e.target.value)}
              placeholder="Evidence note…"
              aria-describedby={`caption-help-${img.id}`}
              className="w-full text-[10px] px-1.5 py-1 rounded-md border border-slate-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-600"
            />
            <p id={`caption-help-${img.id}`} className="text-[9px] text-slate-400 mt-0.5">
              Helps the civic worker understand what this photo shows.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {index > 0 && (
              <button
                type="button"
                onClick={() => onMove(img.id, -1)}
                aria-label={`Move ${img.fileName} up`}
                className="p-1 text-[10px] text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
            )}
            {index < total - 1 && (
              <button
                type="button"
                onClick={() => onMove(img.id, 1)}
                aria-label={`Move ${img.fileName} down`}
                className="p-1 text-[10px] text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {replaceInput && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                // Click the hidden input: we need a ref; simplest is to trigger via a temporary input
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg,image/png,image/webp';
                input.onchange = (ev) => {
                  if (ev.target.files && ev.target.files[0]) onReplace(img.id, ev.target.files[0]);
                  setReplaceInput(null);
                };
                input.click();
              }}
              aria-hidden="true"
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg,image/png,image/webp';
                input.onchange = (ev) => {
                  if (ev.target.files && ev.target.files[0]) onReplace(img.id, ev.target.files[0]);
                  setReplaceInput(null);
                };
                input.click();
              }}
              className="w-full py-1.5 rounded-md border border-dashed border-slate-300 text-[10px] text-slate-600 hover:bg-slate-50 text-left transition-colors"
            >
              Choose replacement file…
            </button>
            <button
              type="button"
              onClick={() => setReplaceInput(null)}
              className="mt-1.5 text-[10px] text-slate-400 hover:text-slate-600 underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
