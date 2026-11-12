import React, { useState, useRef } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  UploadCloud, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trash2,
  FileImage,
  Crosshair,
  Check,
  ShieldAlert,
  Info,
  Clock,
  Copy
} from 'lucide-react';
import { addDemoReport } from '../services/demoAuth';

const CATEGORIES = [
  { id: 'Road Damage & Potholes', label: 'Road Damage & Potholes', icon: '🚧' },
  { id: 'Garbage & Sanitation', label: 'Garbage & Sanitation', icon: '🗑️' },
  { id: 'Streetlights & Signals', label: 'Streetlights & Signals', icon: '💡' },
  { id: 'Water Leakage & Mains', label: 'Water Leakage & Mains', icon: '💧' },
  { id: 'Drainage & Footpaths', label: 'Drainage & Footpaths', icon: '🌊' },
  { id: 'Public Safety & Hazards', label: 'Public Safety & Hazards', icon: '⚠️' }
];

const SEVERITIES = [
  { id: 'Low (Level 1)', label: 'Low', desc: 'Minor issue / 72h SLA', color: 'border-slate-200 text-slate-700 hover:border-slate-400' },
  { id: 'Medium (Level 2)', label: 'Medium', desc: 'Noticeable / 48h SLA', color: 'border-amber-200 text-amber-800 bg-amber-50/50' },
  { id: 'High (Level 3)', label: 'High', desc: 'Hazardous / 24h SLA', color: 'border-orange-300 text-orange-900 bg-orange-50/60' },
  { id: 'Critical (Level 4)', label: 'Critical', desc: 'Immediate Danger / 6h SLA', color: 'border-red-300 text-red-900 bg-red-50/70' }
];

const SAMPLE_PHOTOS = [
  { label: 'Pothole Trench', url: '/images/feature_01.jpg', name: 'pothole_asphalt_100ft.jpg', size: '1.8 MB' },
  { label: 'Water Main Pipe', url: '/images/feature_02.jpg', name: 'pipe_burst_leak.jpg', size: '2.1 MB' },
  { label: 'Broken Luminaire', url: '/images/feature_03.jpg', name: 'pole_lamp_dark.jpg', size: '1.2 MB' },
  { label: 'Overflowing Bin', url: '/images/community_story.jpg', name: 'sanitation_bin_overflow.jpg', size: '2.4 MB' }
];

export default function CitizenReportModal({ isOpen, onClose, onReportCreated }) {
  const [step, setStep] = useState(1); // 1: Intake Form, 2: Review, 3: Success Confirmation
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [severity, setSeverity] = useState('High (Level 3)');
  const [location, setLocation] = useState('100ft Road, Ward 112 (Near Metro Pillar 42)');
  const [coordinates, setCoordinates] = useState({ lat: 12.9730, lng: 77.6420 });
  const [description, setDescription] = useState('');
  
  // Image attachments (supports both real file uploads and sample photos)
  const [uploadedPhotos, setUploadedPhotos] = useState([
    { url: SAMPLE_PHOTOS[0].url, name: SAMPLE_PHOTOS[0].name, size: SAMPLE_PHOTOS[0].size, isSample: true }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle local file uploads via <input type="file" /> or Drag & Drop
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    setError('');

    const newAttachments = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files (JPG, PNG, WebP) are supported.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 10MB limit.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      newAttachments.push({
        url: previewUrl,
        name: file.name,
        size: formattedSize,
        isSample: false
      });
    });

    if (newAttachments.length > 0) {
      setUploadedPhotos((prev) => [...prev, ...newAttachments].slice(0, 5));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSelectSample = (sample) => {
    // If not already in attachments, add or set as primary
    const exists = uploadedPhotos.some(p => p.url === sample.url);
    if (!exists) {
      setUploadedPhotos((prev) => [...prev, {
        url: sample.url,
        name: sample.name,
        size: sample.size,
        isSample: true
      }].slice(0, 5));
    }
  };

  // Simulate Geo-GPS detection
  const handleDetectGPS = () => {
    setGpsDetecting(true);
    setTimeout(() => {
      const lat = (12.9725 + (Math.random() - 0.5) * 0.008).toFixed(4);
      const lng = (77.6415 + (Math.random() - 0.5) * 0.008).toFixed(4);
      setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setLocation(`100ft Road, Ward 112 (GPS: ${lat}° N, ${lng}° E • Accurate to 4m)`);
      setGpsDetecting(false);
    }, 500);
  };

  const handleNextToReview = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a descriptive title for this issue.');
      return;
    }
    if (!location.trim()) {
      setError('Please specify the approximate street location.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const primaryPhoto = uploadedPhotos[0]?.url || SAMPLE_PHOTOS[0].url;
      const newReport = {
        title,
        category,
        location,
        description: description || 'Citizen reported local neighborhood issue via CivicFix intake.',
        photo: primaryPhoto,
        lat: coordinates.lat,
        lng: coordinates.lng,
        priority: severity
      };

      const updatedList = addDemoReport(newReport);
      const created = updatedList[0];
      setIsSubmitting(false);
      setSubmittedReport(created);
      setStep(3);
      if (onReportCreated) onReportCreated(updatedList);
    }, 700);
  };

  const handleCopyId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleClose = () => {
    setStep(1);
    setTitle('');
    setDescription('');
    setSubmittedReport(null);
    setError('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-md transition-all animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* ========================================================
            MODAL HEADER: Brand Mark + Title + Step Pills + Close
            ======================================================== */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-orange-50/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="report-modal-title" className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  Report a Civic Issue
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                  Ward 112
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                AI-assisted intake with automated GPS & visual classification
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            STEP INDICATOR BAR (Only for Step 1 and Step 2)
            ======================================================== */}
        {step < 3 && (
          <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50/60 border-b border-slate-100 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 1 ? 'bg-orange-600 text-white shadow-xs' : 'bg-emerald-500 text-white'
              }`}>
                {step > 1 ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span className={step === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}>
                Incident Details & Evidence
              </span>
            </div>

            <div className="h-0.5 w-8 bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 2 ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}>
                2
              </span>
              <span className={step === 2 ? 'font-bold text-slate-900' : 'text-slate-500'}>
                Review & Dispatch
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            SCROLLABLE FORM BODY (Scrollbar Hidden via CSS)
            ======================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 animate-fadeIn text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ====================================================
              STEP 1: DETAILS & DEDICATED IMAGE UPLOADER
              ==================================================== */}
          {step === 1 && (
            <form onSubmit={handleNextToReview} className="space-y-4">
              
              {/* Field 1: Issue Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Incident Title <span className="text-orange-600">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {title.length}/80
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hazardous deep pothole on northbound carriageway"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                  required
                />
              </div>

              {/* Field 2: Category & Severity Dual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Category <span className="text-orange-600">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all font-medium text-slate-800"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Urgency & Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all font-medium text-slate-800"
                  >
                    {SEVERITIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.desc})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 3: Location / Landmark + GPS Auto-Detect Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800">
                    Street Location / Landmark <span className="text-orange-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={gpsDetecting}
                    className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${gpsDetecting ? 'animate-spin' : ''}`} />
                    <span>{gpsDetecting ? 'Locating...' : 'Detect GPS'}</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 100ft Road, Ward 112 (Near Pillar 42)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Field 4: Description Narrative */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  Description & Contextual Hazards
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe depth, traffic disruption, water logging, or night visibility risks..."
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-900 resize-none"
                />
              </div>

              {/* ====================================================
                  FIELD 5: IMAGE UPLOAD INPUT & DROPZONE (PREMIUM)
                  ==================================================== */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileImage className="w-3.5 h-3.5 text-orange-600" />
                    <span>Photo Evidence Attachments</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {uploadedPhotos.length}/5 photos attached
                  </span>
                </div>

                {/* Hidden Real File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/jpeg,image/png,image/webp" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => handleFiles(e.target.files)} 
                />

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-orange-500 bg-orange-50/70 scale-[1.01]' 
                      : 'border-slate-300/80 bg-slate-50/50 hover:bg-slate-50 hover:border-orange-400'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-orange-100/70 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        <span className="text-orange-600 hover:underline">Click to upload</span> or drag and drop photos
                      </p>
                      <p className="text-[10px] text-slate-400 pt-0.5">
                        High-resolution JPG, PNG or WebP (Max 10MB each)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attached Photos Thumbnail Gallery */}
                {uploadedPhotos.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-medium text-slate-600">Attached Images:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {uploadedPhotos.map((photo, idx) => (
                        <div 
                          key={idx}
                          className="relative group rounded-xl border border-slate-200 bg-white overflow-hidden p-1 shadow-2xs flex items-center gap-2"
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.name} 
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1 pr-5">
                            <p className="text-[11px] font-semibold text-slate-800 truncate leading-tight">
                              {photo.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono pt-0.5">
                              {photo.size}
                            </p>
                          </div>

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(idx);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Sample Photos Selector for Fast Demo Testing */}
                <div className="pt-2">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-1.5">
                    Or choose verified sample scenario:
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_PHOTOS.map((sp) => (
                      <button
                        type="button"
                        key={sp.url}
                        onClick={() => handleSelectSample(sp)}
                        className={`group relative rounded-lg overflow-hidden border aspect-video text-left transition-all cursor-pointer ${
                          uploadedPhotos.some(p => p.url === sp.url)
                            ? 'border-orange-500 ring-2 ring-orange-500/20'
                            : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400'
                        }`}
                      >
                        <img src={sp.url} alt={sp.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 p-1 text-[9px] text-white font-medium truncate backdrop-blur-2xs">
                          {sp.label}
                        </div>
                        {uploadedPhotos.some(p => p.url === sp.url) && (
                          <div className="absolute top-1 right-1 bg-orange-600 text-white rounded-full p-0.5 shadow-xs">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          )}

          {/* ====================================================
              STEP 2: REVIEW & DISPATCH CONFIRMATION
              ==================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                      {category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm pt-0.5">{title}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold">
                    {severity.split(' ')[0]} Priority
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                  <span>{location}</span>
                </div>

                {description && (
                  <p className="text-xs text-slate-600 border-t border-slate-200/80 pt-2 leading-relaxed italic">
                    "{description}"
                  </p>
                )}

                {/* Photo Previews in Review */}
                {uploadedPhotos.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-700 block pb-1.5">
                      Attached Photographic Evidence ({uploadedPhotos.length}):
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {uploadedPhotos.map((photo, i) => (
                        <img 
                          key={i}
                          src={photo.url} 
                          alt="Review preview" 
                          className="w-20 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs flex-shrink-0" 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Copilot Triage Assessment Note */}
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 rounded-xl text-[11px] text-slate-700 space-y-1">
                <div className="font-bold text-orange-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>CivicFix AI Automated Dispatch SLA</span>
                </div>
                <p className="text-slate-600 leading-normal">
                  Based on Ward 112 telemetry, this report will be verified via duplicate detection and routed to the East Zone Road Maintenance squad within 2 hours.
                </p>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting to Ward 112 Queue...</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch Incident Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ====================================================
              STEP 3: SUCCESS FEEDBACK & TICKET RECEIPT
              ==================================================== */}
          {step === 3 && (
            <div className="space-y-4 py-2 text-center animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Civic Grievance Dispatched Successfully
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your incident has been cataloged in your active reports and broadcast to the Ward 112 operations desk.
                </p>
              </div>

              {submittedReport && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-sm mx-auto shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Ticket Reference ID:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(submittedReport.id)}
                      className="flex items-center gap-1 font-mono font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 cursor-pointer"
                      title="Click to copy ID"
                    >
                      <span>{submittedReport.id}</span>
                      {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-orange-600" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Category:</span>
                    <span className="font-semibold text-slate-800">{submittedReport.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Dispatch Status:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Awaiting Field Review</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Jurisdiction:</span>
                    <span className="text-slate-700 truncate max-w-[190px]">{submittedReport.location}</span>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 max-w-sm mx-auto border border-slate-200/80">
                <p className="flex items-center justify-center gap-1.5 font-medium text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Real-time notifications enabled for this ticket.</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full max-w-xs py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Done & Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
