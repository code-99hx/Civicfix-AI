/**
 * CivicFix AI - Accessible full-screen evidence preview dialog.
 */

import React, { useEffect, useRef } from 'react';
import { X, RotateCcw, Image as ImageIcon, Download } from 'lucide-react';
import { formatBytes } from './reportModel';

export default function EvidencePreviewDialog({
  images,
  initialIndex = 0,
  onClose,
  onRemove,
  onSetPrimary,
  onCaption,
  onReplace,
}) {
  const [index, setIndex] = useRef(Math.max(0, Math.min(initialIndex, images.length - 1))).current;
  const dialogRef = useRef(null);

  const current = images[index];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowRight') {
      setIndex((i) => Math.min(i + 1, images.length - 1));
      return;
    }
    if (e.key === 'ArrowLeft') {
      setIndex((i) => Math.max(i - 1, 0));
      return;
    }
  };

  useEffect(() => {
    dialogRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [images, index]);

  return (
    <div
      ref={dialogRef}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-label="Evidence preview"
      onClick={(e) => e.target === dialogRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col outline-none">
        <div className="absolute top-0 right-0 z-30">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md bg-white/10 backdrop-blur text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 h-full min-h-[200px]">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className={`p-1.5 rounded-md transition-colors ${
              index === 0 ? 'text-slate-400 hover:bg-transparent cursor-default' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            aria-label="Previous image"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <div className="relative flex items-center justify-center max-h-full">
            {current.status === 'error' || !current.previewUrl ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed border-slate-600/60 bg-neutral-800/50">
                <ImageIcon className="w-10 h-10 text-slate-500 mb-2" />
                <p className="text-xs text-slate-400">Preview unavailable</p>
              </div>
            ) : (
              <img
                src={current.previewUrl}
                alt={current.fileName}
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(i + 1, images.length - 1))}
            disabled={index === images.length - 1}
            className={`p-1.5 rounded-md transition-colors ${
              index === images.length - 1
                ? 'text-slate-400 hover:bg-transparent cursor-default'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            aria-label="Next image"
          >
            <RotateCcw className="w-5 h-5" style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[220px]" title={current.fileName}>
              {current.fileName}
            </span>
            {current.width && current.height && (
              <span className="text-[10px] text-slate-500 font-mono">
                {current.width}×{current.height} • {formatBytes(current.size)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span>Image {index + 1} of {images.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {current.status !== 'error' && current.previewUrl && (
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = current.previewUrl;
                  link.download = current.fileName;
                  link.click();
                }}
                className="p-1.5 rounded-md bg-white/10 backdrop-blur text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 border-t border-neutral-700/40 pt-3 px-2 space-y-2">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Caption (evidence note)
          </label>
          <input
            type="text"
            value={current.caption}
            onChange={(e) => onCaption(current.id, e.target.value)}
            placeholder="Describe what this photo shows…"
            className="w-full px-2 py-1.5 rounded-md border border-neutral-600 bg-neutral-800 text-xs text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 px-2">
          <button
            type="button"
            onClick={() => onSetPrimary(current.id)}
            className={`w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border flex items-center justify-center gap-1.5 ${
              current.primary
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white/5 text-slate-300 border-neutral-600 hover:bg-white/10'
            }`}
          >
            {current.primary ? (
              <>
                <span className="flex items-center gap-1">✓ Primary evidence</span>
              </>
            ) : (
              <>Mark as primary</>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/jpeg,image/png,image/webp';
              input.onchange = (ev) => {
                if (ev.target.files && ev.target.files[0]) onReplace(current.id, ev.target.files[0]);
              };
              input.click();
            }}
            className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border flex items-center justify-center gap-1.5 bg-white/5 text-slate-300 border-neutral-600 hover:bg-white/10"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => {
              onRemove(current.id);
              if (images.length === 1) onClose();
            }}
            className="w-full sm:w-auto px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border flex items-center justify-center gap-1.5 bg-white/5 text-orange-400 border-orange-900/30 hover:bg-orange-900/20 hover:text-orange-300"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
