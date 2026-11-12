import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Heart, 
  Check, 
  Building2,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function Footer({ onOpenReportModal }) {
  const navigate = useNavigate();
  
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please confirm consent to receive updates.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleReportClick = () => {
    if (typeof onOpenReportModal === 'function') {
      onOpenReportModal();
    } else {
      navigate('/dashboard/report-issue');
    }
  };

  const handleExploreClick = () => {
    const el = document.getElementById('platform') || document.getElementById('how-it-works-explainer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/how-it-works');
    }
  };

  return (
    <footer 
      id="footer" 
      aria-label="CivicFix AI Footer" 
      className="relative min-h-screen min-h-[100dvh] hero-warm-gradient text-white flex flex-col justify-between overflow-hidden select-none px-6 sm:px-10 lg:px-14 py-7 sm:py-9 lg:py-10"
    >
      {/* =========================================================================
          AMBIENT BACKGROUND ILLUMINATION (Identical Warm Atmosphere to Hero)
          ========================================================================= */}
      <div 
        className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-orange-400/25 rounded-full blur-[130px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[110px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-yellow-400/20 rounded-full blur-[90px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Subtle civic-inspired line art / connected nodes in soft translucent golden/white strokes */}
      <div 
        className="absolute inset-0 pointer-events-none select-none opacity-25 overflow-hidden" 
        aria-hidden="true"
      >
        <svg className="w-full h-full" viewBox="0 0 1400 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <path 
            d="M0 650 Q 350 480 700 600 T 1400 560" 
            stroke="rgba(255, 255, 255, 0.45)" 
            strokeWidth="1.2" 
            strokeDasharray="6 6" 
          />
          <path 
            d="M0 720 Q 450 600 900 660 T 1400 620" 
            stroke="rgba(255, 240, 200, 0.35)" 
            strokeWidth="1" 
          />
          {/* Subtle connected nodes */}
          <circle cx="280" cy="510" r="4.5" fill="#ffffff" />
          <circle cx="700" cy="600" r="5.5" fill="#fde047" />
          <circle cx="1120" cy="580" r="4.5" fill="#ffffff" />
          <line x1="280" y1="510" x2="700" y2="600" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          <line x1="700" y1="600" x2="1120" y2="580" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
        </svg>
      </div>

      {/* Main Content Container constrained to viewport */}
      <div className="max-w-[1360px] w-full mx-auto flex-grow flex flex-col justify-between relative z-10 py-1 sm:py-2">
        
        {/* =========================================================================
            AREA 1: TOP — BRAND STATEMENT & RECOGNITION
            ========================================================================= */}
        <div className="space-y-4 sm:space-y-6 pt-1">
          
          {/* Brand Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-white rounded-md"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-white text-[#ff5722] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff5722]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
                CivicFix<span className="text-yellow-200 font-semibold ml-0.5">AI</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
              <span>Better cities begin with people who care</span>
            </div>
          </div>

          {/* Strong Inspiring Headline & Supporting Copy */}
          <div className="max-w-3xl space-y-2 sm:space-y-3">
            <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.035em] text-white leading-[1.06] drop-shadow-xs">
              Let's build better communities{' '}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-pink-100">
                together.
              </span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
              Spot local infrastructure problems, report them in seconds, and follow verified progress. Small actions help build stronger, safer, and cleaner neighborhoods.
            </p>
          </div>

        </div>

        {/* =========================================================================
            AREA 2: MIDDLE — ACTIONS AND NAVIGATION (Spacious & Editorial)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-6 my-auto">
          
          {/* Actions & Dispatch Intake (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={handleReportClick}
                className="rounded-md bg-white text-neutral-900 text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 sm:py-3.5 shadow-lg hover:bg-neutral-100 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4 text-neutral-900" />
              </button>

              <button
                type="button"
                onClick={handleExploreClick}
                className="rounded-md bg-black/25 backdrop-blur-md border border-white/40 text-white text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 sm:py-3.5 hover:bg-black/40 hover:border-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Explore CivicFix AI</span>
                <ArrowUpRight className="w-4 h-4 text-white/80" />
              </button>
            </div>

            {/* Compact Civic Dispatch / Updates Intake */}
            <div className="pt-1 max-w-sm">
              {submitted ? (
                <div className="p-2.5 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                  <span>Subscribed successfully: <strong>{email}</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-1.5">
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email for open civic updates..."
                      aria-label="Email for open civic updates"
                      className="w-full px-3 py-2 text-xs text-white bg-black/25 backdrop-blur-md border border-white/30 rounded-md focus:border-white focus:outline-none placeholder:text-white/60 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-3 bg-white text-neutral-900 rounded-[4px] text-[11px] font-bold hover:bg-neutral-100 transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      id="footer-consent-input"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="rounded-sm border-white/40 bg-black/25 text-[#ff5722] focus:ring-0 cursor-pointer w-3 h-3"
                      required
                    />
                    <label 
                      htmlFor="footer-consent-input" 
                      className="text-[10px] text-white/80 select-none cursor-pointer"
                    >
                      I agree to receive platform developments and release notices.
                    </label>
                  </div>

                  {error && (
                    <p className="text-[10px] text-yellow-200 font-medium" role="alert">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 text-xs text-white/80 pt-0.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-yellow-200" />
              <span>Verified Municipal Triage & Open Incident Protocol</span>
            </div>

          </div>

          {/* Compact Navigation Groups (lg:col-span-7) */}
          <nav 
            aria-label="Footer Platform Links"
            className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-6 pt-2 lg:pt-0"
          >
            
            {/* Group 1: Explore */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-yellow-200 font-bold">
                Explore
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/85">
                <li>
                  <Link to="/" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Core Features
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/community-impact" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Impact Metrics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Group 2: CivicFix AI */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-yellow-200 font-bold">
                About
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/85">
                <li>
                  <Link to="/about" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Contact Team
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/help" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Help & Support
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:contact@civicfix.ai" 
                    className="hover:text-white hover:translate-x-0.5 inline-block transition-all text-white/70"
                  >
                    contact@civicfix.ai
                  </a>
                </li>
              </ul>
            </div>

            {/* Group 3: Account & Portals */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-yellow-200 font-bold">
                Account
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/85">
                <li>
                  <Link to="/login" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link to="/authority/dashboard" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    <span>Authority Portal</span>
                    <Building2 className="w-3 h-3 text-yellow-200" />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleReportClick}
                    className="hover:text-yellow-200 hover:translate-x-0.5 inline-block text-left transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm"
                  >
                    File a Report
                  </button>
                </li>
              </ul>
            </div>

            {/* Group 4: Legal & Standards */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-yellow-200 font-bold">
                Legal
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-white/85">
                <li>
                  <Link to="/privacy" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="hover:text-white hover:translate-x-0.5 inline-block transition-all focus-visible:ring-1 focus-visible:ring-white rounded-sm">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <span className="text-[10px] text-white/60 font-mono">
                    WCAG 2.1 AA
                  </span>
                </li>
              </ul>
            </div>

          </nav>

        </div>

        {/* =========================================================================
            AREA 3: BOTTOM — CLOSING STRIP (Aligned Near Bottom)
            ========================================================================= */}
        <div className="border-t border-white/20 pt-4 pb-1 text-xs text-white/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Dynamic Copyright */}
            <div className="flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()} CivicFix AI. All rights reserved.</span>
            </div>

            {/* Short Brand Sign-off */}
            <div className="flex items-center gap-1.5 text-white font-medium">
              <span>Built for better communities</span>
              <Heart className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200/50" />
            </div>

            {/* Quick Legal Links */}
            <div className="flex items-center gap-4 text-white/75">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
            </div>

          </div>
        </div>

      </div>

    </footer>
  );
}
