import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  AlertTriangle, 
  Trash2, 
  Lightbulb, 
  Droplets, 
  Waves, 
  HelpCircle,
  CheckCircle2, 
  Sparkles,
  User,
  ShieldCheck,
  Compass,
  X
} from 'lucide-react';
import CitizenOnboardingVisual from '../components/CitizenOnboardingVisual';
import StepTransition from '../components/StepTransition';
import { getDemoSession, completeCitizenOnboarding } from '../services/demoAuth';

const REPORT_CATEGORIES = [
  { id: 'roads', label: 'Roads & Potholes', icon: AlertTriangle, desc: 'Potholes, broken asphalt' },
  { id: 'sanitation', label: 'Garbage & Waste', icon: Trash2, desc: 'Overflowing bins, dumping' },
  { id: 'streetlights', label: 'Street Lighting', icon: Lightbulb, desc: 'Dark poles, outages' },
  { id: 'water', label: 'Water Leakage', icon: Droplets, desc: 'Pipeline bursts, supply loss' },
  { id: 'drainage', label: 'Drainage & Sewage', icon: Waves, desc: 'Blocked storm drains' },
  { id: 'other', label: 'Other Civic Issues', icon: HelpCircle, desc: 'Encroachments, signage' }
];

const AVATAR_OPTIONS = [
  { id: 'charcoal', label: 'Charcoal', bg: 'bg-neutral-800 text-white' },
  { id: 'coral', label: 'Coral', bg: 'bg-[#ff5722] text-white' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-600 text-white' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600 text-white' },
];

export default function CitizenOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [isFinishing, setIsFinishing] = useState(false);

  // Step 1: Welcome & Profile
  const [fullName, setFullName] = useState('Priya Sharma');
  const [selectedAvatar, setSelectedAvatar] = useState('coral');

  // Step 2: Location preferences
  const [country] = useState('India');
  const [stateName, setStateName] = useState('Karnataka');
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('Indiranagar / Ward 112');
  const [pincode, setPincode] = useState('560038');

  // Step 3: Reporting preferences
  const [selectedCategories, setSelectedCategories] = useState(['roads', 'streetlights']);

  // Error state
  const [error, setError] = useState('');

  useEffect(() => {
    const s = getDemoSession();
    if (s.user?.name) {
      setFullName(s.user.name);
    }
  }, []);

  const goToStep = (nextStep, dir = 'forward') => {
    setDirection(dir);
    setStep(nextStep);
  };

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) {
        setError('Please keep at least one category selected.');
        return;
      }
      setError('');
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setError('');
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your name to continue.');
      return;
    }
    setError('');
    goToStep(2, 'forward');
  };

  const handleNextStep2 = (e) => {
    if (e) e.preventDefault();
    if (!locality.trim()) {
      setError('Please enter your locality or street name.');
      return;
    }
    setError('');
    goToStep(3, 'forward');
  };

  const handleNextStep3 = () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one civic category.');
      return;
    }
    setError('');
    goToStep(4, 'forward');
  };

  const handleComplete = () => {
    setIsFinishing(true);
    setTimeout(() => {
      completeCitizenOnboarding({
        fullName,
        avatar: selectedAvatar,
        location: { country, state: stateName, city, locality, pincode },
        categories: selectedCategories
      });
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#0d0d0f] flex flex-col select-none font-sans antialiased text-white">
      
      {/* ========================================================
          FULL-SCREEN TWO-PANEL COMPOSITION
          - Left Panel: Step-specific Visual Narrative (5 cols desktop)
          - Right Panel: Precision Form Panel (7 cols desktop)
          - Strictly NO page scroll, NO component scroll
          ======================================================== */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Step-Specific Visual Narrative (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 h-full overflow-hidden border-r border-white/10">
          <CitizenOnboardingVisual currentStep={step} />
        </div>

        {/* RIGHT PANEL: Focused Onboarding Experience */}
        <div className="col-span-12 lg:col-span-7 h-full flex flex-col justify-between overflow-hidden bg-[#121216] p-4 sm:p-6 lg:p-8 xl:p-10 box-border">
          
          {/* TOP TOOLBAR: Branding & Compact Step Progress Bar */}
          <div className="flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              
              {/* Brand wordmark */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-6 h-6 rounded bg-[#ff5722] flex items-center justify-center text-white text-xs font-bold">
                  CF
                </div>
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#ff7e5f] transition-colors">
                  CivicFix<span className="text-[#ff5722] ml-0.5">AI</span>
                </span>
              </Link>

              {/* Step Counter & Exit Button */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                  Step {step} of 4
                </span>
                <Link
                  to="/"
                  className="text-neutral-400 hover:text-white text-xs p-1 rounded hover:bg-white/5 transition-colors"
                  title="Exit Onboarding"
                >
                  <X className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Segmented 4-Step Progress Bar */}
            <div className="grid grid-cols-4 gap-1.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`h-full transition-all duration-300 rounded-full ${
                    s <= step ? 'bg-gradient-to-r from-[#ff5722] to-[#ff7e5f]' : 'bg-transparent'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* ========================================================
              MIDDLE FORM REGION: Perfectly vertically centered
              - min-h-0 prevents overflow on short viewports
              - StepTransition handles forward/backward slide-fade
              ======================================================== */}
          <div className="my-auto min-h-0 flex-1 flex flex-col justify-center max-w-lg w-full mx-auto py-2">
            
            <StepTransition stepKey={step} direction={direction}>
              
              {/* Inline Validation Alert (compact, no layout jump) */}
              {error && (
                <div className="mb-3 p-2.5 rounded-md bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 1: WELCOME & CITIZEN PROFILE
                  ---------------------------------------------------- */}
              {step === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e5f] font-semibold">
                      Citizen Workspace Setup
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Welcome to CivicFix AI
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Let's set up your profile to ensure verified community incident reporting and transparent ward tracking.
                    </p>
                  </div>

                  {/* Display Name Input */}
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300 flex items-center justify-between">
                      <span>Display Name <span className="text-[#ff5722]">*</span></span>
                      <span className="text-[10px] text-neutral-500 font-mono">Visible on reports</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="e.g. Priya Sharma"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white placeholder-neutral-500 focus:border-[#ff5722] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Avatar Initial Theme Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="font-semibold text-neutral-300 text-xs">
                      Avatar Theme
                    </label>
                    <div className="flex items-center gap-2.5">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setSelectedAvatar(av.id)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all cursor-pointer ${av.bg} ${
                            selectedAvatar === av.id ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-105' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          {fullName ? fullName.charAt(0).toUpperCase() : 'C'}
                        </button>
                      ))}
                      <span className="text-[11px] text-neutral-400 pl-1">
                        Initials Badge
                      </span>
                    </div>
                  </div>

                  {/* Info Notice Card */}
                  <div className="p-3 rounded-md bg-white/5 border border-white/10 text-[11px] text-neutral-400 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      CivicFix AI uses zero-password client session keys for evaluation. Your contact information is never publicly displayed.
                    </span>
                  </div>
                </form>
              )}

              {/* ----------------------------------------------------
                  STEP 2: LOCATION PREFERENCES
                  ---------------------------------------------------- */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e5f] font-semibold">
                      Spatial Routing
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Where do you live?
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Setting your neighborhood connects you with the appropriate municipal ward engineers and local field crews.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">State</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-neutral-300 flex items-center justify-between">
                        <span>Neighborhood / Locality <span className="text-[#ff5722]">*</span></span>
                        <span className="text-[10px] font-mono text-neutral-500">e.g. Indiranagar Ward 112</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={locality}
                          onChange={(e) => {
                            setLocality(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="e.g. Indiranagar 100ft Road"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-neutral-300">Postal PIN Code</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560038"
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-neutral-500 font-mono">
                    Manual entry active • No automatic geolocation requested.
                  </div>
                </form>
              )}

              {/* ----------------------------------------------------
                  STEP 3: CIVIC INTERESTS & REPORTING CATEGORIES
                  ---------------------------------------------------- */}
              {step === 3 && (
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff7e5f] font-semibold">
                      Category Subscriptions
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      What issues matter most?
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Select categories to personalize your neighborhood radar and receive instant triage alerts.
                    </p>
                  </div>

                  {/* Compact 2-Column Category Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[42vh] sm:max-h-none overflow-hidden">
                    {REPORT_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategories.includes(cat.id);

                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 group ${
                            isSelected
                              ? 'bg-[#ff5722]/15 border-[#ff5722] text-white shadow-xs'
                              : 'bg-neutral-900/90 border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            isSelected ? 'bg-[#ff5722] text-white' : 'bg-white/5 text-neutral-400'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="overflow-hidden flex-1 min-w-0">
                            <div className="font-semibold text-xs text-white truncate flex items-center justify-between">
                              <span>{cat.label}</span>
                              {isSelected && <Check className="w-3 h-3 text-[#ff7e5f]" />}
                            </div>
                            <p className="text-[10px] text-neutral-400 truncate pt-0.5">
                              {cat.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-neutral-500 font-mono">
                    {selectedCategories.length} categories selected for your live radar.
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 4: REVIEW & GET STARTED
                  ---------------------------------------------------- */}
              {step === 4 && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ready for Launch</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Review Your Citizen Node
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Confirm your setup below. You can update these preferences anytime from your profile settings.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-neutral-900 border border-white/15 rounded-lg p-3.5 sm:p-4 space-y-2.5 divide-y divide-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Citizen Name:</span>
                      <span className="font-semibold text-white">{fullName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-400">Primary Ward:</span>
                      <span className="font-semibold text-white">{locality}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-400">City / State:</span>
                      <span className="text-neutral-300">{city}, {stateName} ({pincode})</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-400">Subscribed Streams:</span>
                      <span className="font-mono text-[#ffab40] font-semibold">
                        {selectedCategories.length} categories active
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                    <strong>Demo Protocol Notice:</strong> Clicking continue completes simulated registration and opens your Citizen Dashboard with interactive sample reports.
                  </div>
                </div>
              )}

            </StepTransition>

          </div>

          {/* ========================================================
              BOTTOM ACTION BAR: Strictly consistent position
              - Back and Continue buttons
              - Never pushed off-screen
              ======================================================== */}
          <div className="flex-shrink-0 pt-3 border-t border-white/10 space-y-2">
            
            <div className="flex items-center justify-between gap-3">
              
              {/* Back Button */}
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(step - 1, 'backward')}
                  className="px-3.5 py-2 rounded-md border border-white/20 text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <Link
                  to="/"
                  className="px-3 py-2 text-neutral-500 hover:text-neutral-300 text-xs transition-colors"
                >
                  Cancel
                </Link>
              )}

              {/* Continue / Complete Action */}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={
                    step === 1 ? handleNextStep1 :
                    step === 2 ? handleNextStep2 :
                    handleNextStep3
                  }
                  className="px-5 py-2 rounded-md bg-[#ff5722] hover:bg-[#e64a19] text-white text-xs font-semibold shadow-md active:scale-[0.99] transition-all uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={isFinishing}
                  className="px-6 py-2 rounded-md bg-gradient-to-r from-[#ff5722] to-[#ff7e5f] hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-bold shadow-md active:scale-[0.99] transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isFinishing ? (
                    <span>Launching Portal...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Enter Dashboard</span>
                    </>
                  )}
                </button>
              )}

            </div>

            {/* Micro disclaimer footer */}
            <div className="text-[10px] text-neutral-500 font-mono text-center">
              Verified Civic Infrastructure Protocol • Client-side Demo Sandbox
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
