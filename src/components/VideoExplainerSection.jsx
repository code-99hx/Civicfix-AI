import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Camera, 
  FileCheck, 
  Clock, 
  ChevronRight,
  Sliders,
  ExternalLink
} from 'lucide-react';

const SCENES = [
  {
    id: 1,
    title: 'Spot a Civic Issue',
    stage: '01',
    stageName: 'Report',
    startTime: 0,
    endTime: 10,
    badge: 'Step 1 of 5',
    headline: 'Citizen notices hazardous road damage',
    location: '100ft Road, Indiranagar • Ward 112',
    description: 'A two-wheeler commuter spots an unmarked 12cm asphalt pothole obstructing arterial traffic.',
    image: '/images/feature_01.jpg',
    overlayType: 'detection',
    aiTag: 'Vision AI: Pothole Detected (98.4%)',
  },
  {
    id: 2,
    title: 'Select "Report an Issue"',
    stage: '01',
    stageName: 'Report',
    startTime: 10,
    endTime: 20,
    badge: 'Step 2 of 5',
    headline: 'Instant, zero-login intake modal opens',
    location: 'CivicFix AI Progressive Web App',
    description: 'Opening the camera interface automatically captures high-resolution evidence with embedded GPS metadata.',
    image: '/images/hero.jpg',
    overlayType: 'intake',
    aiTag: 'Auto-Geotagged: 12.9716° N, 77.5946° E',
  },
  {
    id: 3,
    title: 'Automated Category & Location',
    stage: '01',
    stageName: 'Report',
    startTime: 20,
    endTime: 31,
    badge: 'Step 3 of 5',
    headline: 'AI classifies severity and checks duplicates',
    location: 'Ward 112 Spatial Database',
    description: 'The platform categorizes the issue as Road Infrastructure, confirms zero duplicate reports, and assigns high priority.',
    image: '/images/feature_03.jpg',
    overlayType: 'classification',
    aiTag: 'Category: Public Safety & Roadworks',
  },
  {
    id: 4,
    title: 'Receive Reference ID & Triage',
    stage: '02',
    stageName: 'Track',
    startTime: 31,
    endTime: 41,
    badge: 'Step 4 of 5',
    headline: 'Reference CF-8402 generated instantly',
    location: 'Dispatched to Rapid Roadworks Squad',
    description: 'The citizen receives an immediate tracking reference while municipal supervisors get direct field dispatch coordinates.',
    image: '/images/feature_04.jpg',
    overlayType: 'dispatch',
    aiTag: 'Assigned: Squad Delta • SLA: 24h',
  },
  {
    id: 5,
    title: 'Track Transparent Resolution',
    stage: '03',
    stageName: 'Stay Informed',
    startTime: 41,
    endTime: 48,
    badge: 'Step 5 of 5',
    headline: 'Photographic proof & citizen verification',
    location: 'Indiranagar 100ft Road • Resolved',
    description: 'Upon crew completion, verified resolution photography is published. The citizen receives automated notification of repair.',
    image: '/images/meet_product.jpg',
    overlayType: 'resolved',
    aiTag: 'Status: Closed & Verified by Ward Inspector',
  },
];

const TOTAL_DURATION = 48; // 48 seconds walkthrough

export default function VideoExplainerSection({ onOpenReportModal }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStepTab, setActiveStepTab] = useState('01');
  const timerRef = useRef(null);

  // Determine current active scene based on currentTime
  const currentSceneIndex = SCENES.findIndex(
    (scene) => currentTime >= scene.startTime && currentTime < scene.endTime
  );
  const activeScene = currentSceneIndex !== -1 ? SCENES[currentSceneIndex] : SCENES[0];

  // Sync active step tab with current scene
  useEffect(() => {
    if (activeScene) {
      setActiveStepTab(activeScene.stage);
    }
  }, [activeScene]);

  // Video playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(prev + 0.25, TOTAL_DURATION);
        });
      }, 250);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleSelectStage = (stageCode) => {
    setActiveStepTab(stageCode);
    const targetScene = SCENES.find((s) => s.stage === stageCode);
    if (targetScene) {
      setCurrentTime(targetScene.startTime);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <section 
      id="how-it-works-explainer"
      aria-label="Civic Reporting Explainer Video"
      className="bg-white text-neutral-900 py-20 sm:py-28 lg:py-32 border-b border-neutral-200 relative overflow-hidden"
    >
      {/* Subtle warm ambient background glow for smooth transition from hero */}
      <div 
        className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-[#ff7e5f]/08 via-[#fca311]/05 to-transparent rounded-full blur-[100px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Section Header with Eyebrow */}
        <div className="max-w-3xl space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50/90 border border-orange-200/80 text-[#ff5722] text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5722]" />
            <span>How It Works • 48-Second Product Walkthrough</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-neutral-900 leading-[1.08]">
            Reporting a civic issue should be simple.
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 leading-relaxed font-normal pt-1 max-w-2xl">
            From spotting a problem to tracking its progress, CivicFix AI helps citizens understand the reporting journey every step of the way.
          </p>
        </div>

        {/* Two-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: 3 Connected Sequential Stages & Direct Trigger */}
          <div className="lg:col-span-5 space-y-6">
            
            <p className="text-xs uppercase tracking-widest font-bold text-neutral-400">
              The Three-Stage Citizen Journey
            </p>

            <div className="space-y-4 relative">
              {/* Connecting vertical line */}
              <div 
                className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-neutral-200 pointer-events-none" 
                aria-hidden="true" 
              />

              {/* STAGE 01: Report */}
              <button
                type="button"
                onClick={() => handleSelectStage('01')}
                className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-all duration-200 relative z-10 flex items-start gap-4 ${
                  activeStepTab === '01'
                    ? 'bg-orange-50/70 border-[#ff5722]/50 shadow-md ring-1 ring-[#ff5722]/20'
                    : 'bg-neutral-50/80 hover:bg-neutral-100/70 border-neutral-200/80'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-colors ${
                    activeStepTab === '01' 
                      ? 'bg-[#ff5722] text-white shadow-xs' 
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  01
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      Report
                    </h3>
                    {activeStepTab === '01' && isPlaying && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff5722] text-white font-semibold animate-pulse">
                        Playing
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-700">
                    Describe the issue and provide its location.
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed pt-0.5">
                    Capture clear photo evidence. CivicFix AI extracts precise coordinates and detects category types automatically.
                  </p>
                </div>
              </button>

              {/* STAGE 02: Track */}
              <button
                type="button"
                onClick={() => handleSelectStage('02')}
                className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-all duration-200 relative z-10 flex items-start gap-4 ${
                  activeStepTab === '02'
                    ? 'bg-orange-50/70 border-[#ff5722]/50 shadow-md ring-1 ring-[#ff5722]/20'
                    : 'bg-neutral-50/80 hover:bg-neutral-100/70 border-neutral-200/80'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-colors ${
                    activeStepTab === '02' 
                      ? 'bg-[#ff5722] text-white shadow-xs' 
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  02
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      Track
                    </h3>
                    {activeStepTab === '02' && isPlaying && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff5722] text-white font-semibold animate-pulse">
                        Playing
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-700">
                    Follow status updates and review progress.
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed pt-0.5">
                    Receive your incident reference ID (<span className="font-mono text-neutral-800 font-semibold">CF-8402</span>). Review automated triage alerts and field squad dispatches in real-time.
                  </p>
                </div>
              </button>

              {/* STAGE 03: Stay Informed */}
              <button
                type="button"
                onClick={() => handleSelectStage('03')}
                className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-all duration-200 relative z-10 flex items-start gap-4 ${
                  activeStepTab === '03'
                    ? 'bg-orange-50/70 border-[#ff5722]/50 shadow-md ring-1 ring-[#ff5722]/20'
                    : 'bg-neutral-50/80 hover:bg-neutral-100/70 border-neutral-200/80'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 transition-colors ${
                    activeStepTab === '03' 
                      ? 'bg-[#ff5722] text-white shadow-xs' 
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  03
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">
                      Stay Informed
                    </h3>
                    {activeStepTab === '03' && isPlaying && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ff5722] text-white font-semibold animate-pulse">
                        Playing
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-neutral-700">
                    Understand when the issue progresses or is marked resolved.
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed pt-0.5">
                    View supervisor-verified completion photos, confirm neighborhood sign-off, and track resolution metrics across your ward.
                  </p>
                </div>
              </button>

            </div>

            {/* Direct Interactive Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md font-semibold text-sm text-white bg-[#ff5722] hover:bg-[#e64a19] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Launch Interactive Report Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Premium High-Definition Video Player & Citizen Journey Simulator */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Player Frame Container (16:9 Aspect Ratio) */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-neutral-300 shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-neutral-950 text-white select-none group">
              
              {/* Active Scene Backdrop Image */}
              <img
                src={activeScene.image}
                alt={activeScene.title}
                className="w-full h-full object-cover transition-opacity duration-500 filter brightness-[0.72] contrast-105"
              />

              {/* Dark Gradient Overlay for Cinematic Depth */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/30 pointer-events-none" 
                aria-hidden="true" 
              />

              {/* TOP VIDEO BAR: Telemetry & Stage Pills */}
              <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-neutral-950/80 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-200">
                    Citizen Flow Walkthrough
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="font-mono text-[11px] text-[#ffab40]">
                    {activeScene.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                    HD 1080p
                  </span>
                </div>
              </div>

              {/* CENTER DISPLAY: Dynamic Scene Telemetry & Interactive Cards */}
              <div className="absolute inset-x-4 sm:inset-x-8 bottom-16 sm:bottom-20 z-20">
                <div className="max-w-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 key={activeScene.id}">
                  
                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ff5722]/90 text-white text-[11px] font-mono font-semibold shadow-sm backdrop-blur-md">
                    <Sparkles className="w-3 h-3" />
                    <span>{activeScene.aiTag}</span>
                  </div>

                  {/* Scene Title */}
                  <h4 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-snug drop-shadow-md">
                    {activeScene.headline}
                  </h4>

                  {/* Scene Location & Metadata */}
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#ffab40] flex-shrink-0" />
                    <span>{activeScene.location}</span>
                  </div>

                </div>
              </div>

              {/* BIG CENTER PLAY BUTTON (Shown when paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-neutral-950/30 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Play explainer video"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group/btn"
                  >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#ff5722] fill-[#ff5722] ml-1 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              )}

              {/* BOTTOM VIDEO CONTROLS BAR */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-neutral-950/90 backdrop-blur-md border-t border-white/10 z-30">
                
                {/* Scrubber Timeline Bar */}
                <div 
                  className="w-full bg-white/20 hover:bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer mb-3 transition-colors relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
                    handleSeek(newProgress * TOTAL_DURATION);
                  }}
                  role="slider"
                  aria-label="Video timeline scrubber"
                  aria-valuemin="0"
                  aria-valuemax={TOTAL_DURATION}
                  aria-valuenow={Math.round(currentTime)}
                >
                  <div 
                    className="bg-gradient-to-r from-[#ff5722] via-[#ff7e5f] to-[#ffab40] h-full transition-all duration-100" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>

                {/* Control Actions Row */}
                <div className="flex items-center justify-between text-xs text-neutral-300">
                  
                  {/* Left: Play/Pause, Replay, Time counter */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="p-1.5 rounded hover:bg-white/10 text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      aria-label="Restart video"
                      className="p-1.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <div className="font-mono text-[11px] text-neutral-300">
                      <span>{formatTime(currentTime)}</span>
                      <span className="text-neutral-500 mx-1">/</span>
                      <span className="text-neutral-400">{formatTime(TOTAL_DURATION)}</span>
                    </div>
                  </div>

                  {/* Center: Quick Scene Jump Chips */}
                  <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px]">
                    {SCENES.map((scene, idx) => (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => handleSeek(scene.startTime)}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          activeScene.id === scene.id 
                            ? 'bg-[#ff5722] text-white font-bold' 
                            : 'bg-white/10 hover:bg-white/20 text-neutral-400'
                        }`}
                      >
                        {idx + 1}. {scene.stageName}
                      </button>
                    ))}
                  </div>

                  {/* Right: Audio Toggle & Fullscreen */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      aria-label={isMuted ? 'Unmute sound simulation' : 'Mute sound simulation'}
                      className="p-1.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onOpenReportModal}
                      aria-label="Try interactive report modal"
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-neutral-900 text-[11px] font-semibold hover:bg-neutral-200 transition-colors"
                    >
                      <span>Try Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* Video Caption & Accessibility Note */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-500 gap-2 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Simulated Citizen Walkthrough • Demonstrating 5 Core Reporting Phases</span>
              </div>
              <span className="font-mono text-[11px] text-neutral-400">
                Duration: 48s • Interactive Scrubber Active
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
