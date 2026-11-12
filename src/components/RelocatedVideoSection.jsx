import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  MonitorPlay
} from 'lucide-react';

export default function RelocatedVideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(38);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const animationTimerRef = useRef(null);

  // Fallback timer simulation when playing the animated webp recording
  useEffect(() => {
    if (videoError || !videoRef.current) {
      if (isPlaying) {
        animationTimerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            const next = prev >= duration ? 0 : prev + 0.25;
            setProgress((next / duration) * 100);
            return next;
          });
        }, 250);
      } else {
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      }
    }
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [isPlaying, videoError, duration]);

  // Video time update listener
  const handleTimeUpdate = () => {
    if (videoRef.current && !videoError) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 38);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const togglePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && !videoError) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * duration;
    
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = targetTime;
    }
    setCurrentTime(targetTime);
    setProgress(pos * 100);
  };

  const handleRestart = () => {
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section 
      id="product-video-tour" 
      aria-label="CivicFix AI Product Tour Video"
      className="bg-[#f8fafc] text-neutral-900 py-20 sm:py-28 lg:py-32 border-b border-neutral-200/80 relative overflow-hidden select-none"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ea580c] text-xs font-semibold uppercase tracking-widest shadow-xs">
            <MonitorPlay className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Product Operations Tour</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-neutral-900 leading-[1.12]">
            Experience CivicFix AI in Action
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Watch a high-resolution walkthrough of our citizen intake and municipal dispatch operations.
          </p>
        </div>

        {/* Premium White-Theme Hardware Video Frame */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
          className="group relative rounded-2xl border border-neutral-300/80 bg-neutral-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),0_0_30px_rgba(255,98,67,0.08)] overflow-hidden transition-all duration-300"
        >
          {/* Hardware Glass Reflection */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-30 pointer-events-none" />

          {/* Aspect Ratio Box: 16:9 widescreen */}
          <div className="relative aspect-[16/9] w-full bg-[#0d0d11] overflow-hidden flex items-center justify-center">
            
            {/* Primary HTML5 Video Tag */}
            {!videoError && (
              <video
                ref={videoRef}
                playsInline
                muted={isMuted}
                autoPlay
                loop
                poster="/videos/video_poster.png"
                onLoadedMetadata={handleVideoLoaded}
                onTimeUpdate={handleTimeUpdate}
                onError={() => setVideoError(true)}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              >
                <source src="/videos/civicfix_demo.mp4" type="video/mp4" />
                <source src="/videos/civicfix_demo.webm" type="video/webm" />
              </video>
            )}

            {/* Seamless Fallback to Animated Product Recording */}
            {videoError && (
              <div 
                onClick={togglePlay}
                className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
              >
                <img
                  src="/videos/civicfix_demo_preview.webp"
                  alt="CivicFix AI Product Tour Walkthrough"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            )}

            {/* Soft Vignette Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/25 z-10" 
              aria-hidden="true" 
            />

            {/* Big Center Play/Pause Button */}
            {(!isPlaying || showControls) && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause product video' : 'Play product video'}
                className={`absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer ${
                  !isPlaying ? 'opacity-100 scale-100' : 'opacity-85 hover:opacity-100'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white/80" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
                )}
              </button>
            )}

            {/* Floating Live Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide shadow-lg pointer-events-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6243] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6243]" />
              </span>
              <span>CivicFix AI Operations Tour</span>
              <span className="text-white/40">•</span>
              <span className="text-white/75 font-mono text-[11px]">4K Product Demo</span>
            </div>

            {/* Bottom Video Controls Bar */}
            <div 
              className={`absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 sm:group-hover:opacity-100 pointer-events-auto'
              }`}
            >
              {/* Scrubbable Progress Line */}
              <div 
                onClick={handleSeek}
                className="relative w-full h-1.5 sm:h-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer mb-3 sm:mb-4 overflow-hidden transition-all group/bar"
              >
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#ff6243] to-[#ff4b72] rounded-full transition-all duration-75 relative"
                  style={{ width: `${progress}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Bottom Control Actions */}
              <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                
                {/* Left Controls: Play/Pause, Restart, Time counter */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    aria-label="Restart video"
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>

                  <div className="text-white/80 font-mono text-xs tracking-wider pl-1">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-white/40 mx-1.5">/</span>
                    <span className="text-white/60">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Right Controls: Mute/Unmute, Fullscreen */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
