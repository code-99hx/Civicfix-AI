/**
 * CivicFix AI - Advanced photo evidence uploader.
 *
 * Client-side validation of MIME type, size, count and readability. Previews
 * use revocable object URLs; nothing is uploaded to a server in this demo.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Upload,
  Image,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  validateFile,
  validateImageReadable,
  createPreviewUrl,
  revokeObjectUrl,
  revokeAllPreviews,
  isDuplicateFile,
  IMAGE_ERROR_TYPES,
} from './evidenceUtils';
import { LIMITS, formatBytes } from './reportModel';
import EvidenceCard from './EvidenceCard';
import EvidencePreviewDialog from './EvidencePreviewDialog';

export default function EvidenceUploader({ images, onImagesChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [rejects, setRejects] = useState([]);
  const [dialog, setDialog] = useState(null); // { id, index }
  const fileInputRef = useRef(null);
  const rejectTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      revokeAllPreviews(images);
      if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
    };
  }, [images]);

  const addFiles = useCallback(
    (files) => {
      const list = Array.from(files);
      const incoming = [];
      const newRejects = [];

      for (const file of list) {
        if (isDuplicateFile(images, file)) continue;
        if (images.length + incoming.length >= LIMITS.maxImages) {
          newRejects.push({ file, error: 'capacity', message: `Maximum of ${LIMITS.maxImages} images reached.` });
          continue;
        }
        const validation = validateFile(file, {
          maxFileSizeBytes: LIMITS.maxFileSizeBytes,
          acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });
        if (!validation.ok) {
          newRejects.push({ file, error: validation.error });
          continue;
        }
        incoming.push(file);
      }

      if (newRejects.length) {
        setRejects((prev) => [...prev, ...newRejects]);
        if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
        rejectTimeoutRef.current = setTimeout(() => setRejects([]), 6000);
      }

      const now = Date.now();
      incoming.forEach((file, index) => {
        const previewUrl = createPreviewUrl(file);
        const newImage = {
          id: `img-${now}-${index}-${Math.random().toString(36).slice(2, 6)}`,
          file,
          previewUrl,
          fileName: file.name,
          size: file.size,
          type: file.type,
          status: 'processing',
          width: null,
          height: null,
          caption: '',
          primary: images.length === 0 && index === 0 && images.length + incoming.length === 1,
        };
        onImagesChange((prev) => {
          // Avoid duplicate ids if called rapidly
          if (prev.some((img) => img.id === newImage.id)) return prev;
          return [...prev, newImage];
        });
        validateImageReadable(file).then(({ ok, width, height, error }) => {
          if (!ok) {
            onImagesChange((prev) =>
              prev.map((img) =>
                img.id === newImage.id
                  ? { ...img, status: 'error', error: error || IMAGE_ERROR_TYPES.UNREADABLE }
                  : img
              )
            );
            revokeObjectUrl(previewUrl);
            return;
          }
          onImagesChange((prev) =>
            prev.map((img) =>
              img.id === newImage.id ? { ...img, status: 'ready', width, height } : img
            )
          );
        });
      });
    },
    [images, onImagesChange]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = '';
  };

  const capturePhoto = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.setAttribute('capture', 'environment');
    input.click();
    input.removeAttribute('capture');
  };

  const handleTrySamplePhotos = async (e) => {
    if (e) e.stopPropagation();
    try {
      const samples = [
        { url: '/images/feature_01.jpg', name: 'sample_pothole_evidence.jpg', type: 'image/jpeg' },
        { url: '/images/feature_02.jpg', name: 'sample_water_leakage.jpg', type: 'image/jpeg' },
      ];
      const files = await Promise.all(
        samples.map(async (s) => {
          const res = await fetch(s.url);
          const blob = await res.blob();
          return new File([blob], s.name, { type: s.type });
        })
      );
      addFiles(files);
    } catch (err) {
      console.error('Failed to load sample photos:', err);
    }
  };

  const removeImage = (id) => {
    onImagesChange((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) revokeObjectUrl(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const setCaption = (id, caption) => {
    onImagesChange((prev) => prev.map((img) => (img.id === id ? { ...img, caption } : img)));
  };

  const setPrimary = (id) => {
    onImagesChange((prev) =>
      prev.map((img) => ({ ...img, primary: img.id === id }))
    );
  };

  const moveImage = (id, delta) => {
    onImagesChange((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      const target = idx + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const openDialog = (id, index) => setDialog({ id, index });
  const closeDialog = () => setDialog(null);

  const replaceImage = (id, file) => {
    if (!file) return;
    const validation = validateFile(file, {
      maxFileSizeBytes: LIMITS.maxFileSizeBytes,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (!validation.ok) {
      setRejects((prev) => [...prev, { file, error: validation.error }]);
      if (rejectTimeoutRef.current) clearTimeout(rejectTimeoutRef.current);
      rejectTimeoutRef.current = setTimeout(() => setRejects([]), 6000);
      return;
    }
    onImagesChange((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) revokeObjectUrl(target.previewUrl);
      const previewUrl = createPreviewUrl(file);
      const updated = {
        ...target,
        file,
        previewUrl,
        fileName: file.name,
        size: file.size,
        type: file.type,
        status: 'processing',
        width: null,
        height: null,
      };
      validateImageReadable(file).then(({ ok, width, height, error }) => {
        if (!ok) {
          onImagesChange((p) =>
            p.map((i) => (i.id === id ? { ...i, status: 'error', error: error || IMAGE_ERROR_TYPES.UNREADABLE } : i))
          );
          revokeObjectUrl(previewUrl);
          return;
        }
        onImagesChange((p) =>
          p.map((i) => (i.id === id ? { ...i, status: 'ready', width, height } : i))
        );
      });
      return prev.map((img) => (img.id === id ? updated : img));
    });
  };

  const used = images.length;
  const remaining = LIMITS.maxImages - used;
  const atCapacity = used >= LIMITS.maxImages;
  const acceptAttr = 'image/jpeg,image/png,image/webp';

  return (
    <div className="space-y-4">
      <section aria-labelledby="evidence-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="evidence-heading" className="text-sm font-semibold text-slate-800">
              Photo evidence
            </h3>
            <p className="text-xs text-slate-500">
              Up to {LIMITS.maxImages} images, {LIMITS.maxFileSizeMB} MB each (JPEG, PNG, WebP). Photos stay on your device until you submit.
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
            atCapacity ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
          }`}>
            {used}/{LIMITS.maxImages}
            <span className="ml-0.5">{remaining} remaining</span>
          </span>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Drag and drop photos here or browse files"
          aria-describedby="evidence-hint"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBrowseClick();
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border-2 border-dashed transition-all duration-200 ease-out
            ${dragActive
              ? 'bg-orange-50 border-orange-600'
              : 'bg-slate-50/50 border-slate-300 hover:border-slate-400'}
            ${atCapacity ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}`}
        >
          <Upload className="w-7 h-7 text-slate-500 dragActive:text-orange-600" />
          <span className="text-sm font-semibold text-slate-700">
            {dragActive ? 'Drop images here' : 'Drag & drop or click to browse'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleBrowseClick}
              disabled={atCapacity}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors border
                ${atCapacity
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-orange-600'}`}
            >
              <Image className="w-4 h-4" /> Browse files
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              disabled={atCapacity}
              title="Capture photo with device camera"
              aria-label="Capture photo with camera"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border
                ${atCapacity
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-orange-600'}`}
            >
              <ImageIcon className="w-4 h-4" /> Camera
            </button>
            <button
              type="button"
              onClick={handleTrySamplePhotos}
              disabled={atCapacity}
              title="Add sample incident images for testing"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border
                ${atCapacity
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 focus-visible:ring-2 focus-visible:ring-orange-600'}`}
            >
              <Sparkles className="w-4 h-4 text-orange-600" /> Try Sample Photos
            </button>
          </div>
          <p id="evidence-hint" className="text-[10px] text-slate-400">
            Multiple files at once supported • JPEG, PNG, WebP up to {LIMITS.maxFileSizeMB} MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptAttr}
            multiple
            className="sr-only"
            onChange={handleInputChange}
            aria-hidden="true"
          />
        </div>

        {rejects.length > 0 && (
          <div role="alert" className="p-3 rounded-lg border border-orange-100 bg-orange-50 text-sm text-orange-800 space-y-1.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Problem with {rejects.length} file(s):</span>
            </div>
            <ul className="list-disc list-inside text-xs text-orange-700 space-y-0.5">
              {rejects.map((r, i) => (
                <li key={i}>
                  {r.file.name}:{' '}
                  {r.error === 'capacity'
                    ? r.message
                    : r.error === IMAGE_ERROR_TYPES.TYPE
                      ? 'Unsupported file type (JPEG, PNG or WebP only).'
                      : r.error === IMAGE_ERROR_TYPES.SIZE
                        ? `File exceeds ${LIMITS.maxFileSizeMB} MB.`
                        : 'Could not be read.'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Your evidence</h3>

        {used === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
            <Image className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">
              No photos selected yet. Evidence is optional — the report can still be submitted.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {images.map((img, index) => (
              <EvidenceCard
                key={img.id}
                img={img}
                index={index}
                total={used}
                onRemove={removeImage}
                onCaption={setCaption}
                onSetPrimary={setPrimary}
                onMove={moveImage}
                onReplace={(file) => replaceImage(img.id, file)}
                onPreview={() => openDialog(img.id, index)}
              />
            ))}
          </div>
        )}
      </section>

      {dialog && (
        <EvidencePreviewDialog
          images={images}
          initialIndex={dialog.index}
          onClose={closeDialog}
          onRemove={(id) => {
            removeImage(id);
            closeDialog();
          }}
          onSetPrimary={setPrimary}
          onCaption={setCaption}
          onReplace={(file) => replaceImage(dialog.id, file)}
        />
      )}
    </div>
  );
}
