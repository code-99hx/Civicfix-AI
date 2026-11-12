import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Briefcase,
  X,
  Sparkles
} from 'lucide-react';
import AuthorityOnboardingVisual from '../components/AuthorityOnboardingVisual';
import StepTransition from '../components/StepTransition';
import { getDemoSession, completeAuthorityOnboarding } from '../services/demoAuth';

const ORG_TYPES = [
  'Municipal Corporation',
  'Municipality',
  'Nagar Panchayat',
  'Government Department',
  'Other Civic Body'
];

const DEPARTMENTS = [
  'Roads & Infrastructure',
  'Sanitation & Solid Waste',
  'Water Supply & Sewerage',
  'Street Lighting & Electrical',
  'Stormwater Drainage',
  'General Administration'
];

export default function AuthorityOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [isFinishing, setIsFinishing] = useState(false);

  // Step 1: Organization Details
  const [orgName, setOrgName] = useState('Bruhat Bengaluru Mahanagara Palike (BBMP)');
  const [orgType, setOrgType] = useState('Municipal Corporation');
  const [orgWebsite, setOrgWebsite] = useState('https://bbmp.gov.in');
  const [orgEmail, setOrgEmail] = useState('commissioner@bbmp.gov.in');

  // Step 2: Department and Role
  const [department, setDepartment] = useState('Roads & Infrastructure');
  const [roleTitle, setRoleTitle] = useState('Assistant Executive Engineer (AEE)');
  const [contactEmail, setContactEmail] = useState('engineer.ward112@bbmp.gov.in');
  const [workPhone, setWorkPhone] = useState('+91 80 2266 0000');

  // Step 3: Jurisdiction
  const [stateName, setStateName] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [city, setCity] = useState('Bengaluru');
  const [ward, setWard] = useState('Ward 112 (Indiranagar / East Zone)');
  const [coverageDetails, setCoverageDetails] = useState('Primary arterial roads and collector streets within Ward 112 boundaries.');

  // Error state
  const [error, setError] = useState('');

  useEffect(() => {
    const s = getDemoSession();
    if (s.user?.email) {
      setOrgEmail(s.user.email);
      setContactEmail(s.user.email);
    }
  }, []);

  const goToStep = (nextStep, dir = 'forward') => {
    setDirection(dir);
    setStep(nextStep);
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!orgName.trim() || !orgEmail.trim()) {
      setError('Please provide organization name and official work email.');
      return;
    }
    setError('');
    goToStep(2, 'forward');
  };

  const handleStep2Next = (e) => {
    e.preventDefault();
    if (!roleTitle.trim() || !contactEmail.trim()) {
      setError('Please provide your official role title and contact email.');
      return;
    }
    setError('');
    goToStep(3, 'forward');
  };

  const handleStep3Next = (e) => {
    e.preventDefault();
    if (!city.trim() || !ward.trim()) {
      setError('Please specify your municipal jurisdiction city and ward.');
      return;
    }
    setError('');
    goToStep(4, 'forward');
  };

  const handleComplete = () => {
    setIsFinishing(true);
    setTimeout(() => {
      completeAuthorityOnboarding({
        orgName,
        orgType,
        orgWebsite,
        orgEmail,
        department,
        roleTitle,
        contactEmail,
        workPhone,
        jurisdiction: { state: stateName, district, city, ward, coverageDetails }
      });
      navigate('/authority/dashboard');
    }, 450);
  };

  return (
    <div className="w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#0d0d0f] flex flex-col select-none font-sans antialiased text-white">
      
      {/* ========================================================
          FULL-SCREEN TWO-PANEL COMPOSITION
          - Left Panel: Authority-specific Visual Narrative (5 cols desktop)
          - Right Panel: Authority Form Panel (7 cols desktop)
          - Strictly NO page scroll, NO component scroll
          ======================================================== */}
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Authority Visual Narrative (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 h-full overflow-hidden border-r border-white/10">
          <AuthorityOnboardingVisual currentStep={step} />
        </div>

        {/* RIGHT PANEL: Authority Onboarding Form */}
        <div className="col-span-12 lg:col-span-7 h-full flex flex-col justify-between overflow-hidden bg-[#121216] p-4 sm:p-6 lg:p-8 xl:p-10 box-border">
          
          {/* TOP TOOLBAR: Branding & Step Progress */}
          <div className="flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-6 h-6 rounded bg-[#ff5722] flex items-center justify-center text-white text-xs font-bold">
                  CF
                </div>
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#ff7e5f] transition-colors">
                  CivicFix<span className="text-[#ff5722] ml-0.5">AI</span>
                </span>
                <span className="text-[10px] font-mono text-[#ffab40] bg-orange-950/60 border border-orange-500/30 px-2 py-0.2 rounded ml-1">
                  Authority Portal
                </span>
              </Link>

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
                    s <= step ? 'bg-gradient-to-r from-[#ff5722] to-amber-400' : 'bg-transparent'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* ========================================================
              MIDDLE FORM REGION: Centered vertically without scroll
              ======================================================== */}
          <div className="my-auto min-h-0 flex-1 flex flex-col justify-center max-w-lg w-full mx-auto py-2">
            
            <StepTransition stepKey={step} direction={direction}>
              
              {/* Validation Alert */}
              {error && (
                <div className="mb-3 p-2.5 rounded-md bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 1: ORGANIZATION DETAILS
                  ---------------------------------------------------- */}
              {step === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffab40] font-semibold">
                      Municipal Registry
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Organization Details
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Register your municipal corporation or civic agency for verified incident dispatch routing.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Organization Name <span className="text-[#ff5722]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => {
                        setOrgName(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">Organization Type</label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      >
                        {ORG_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">Official Website</label>
                      <input
                        type="url"
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">
                      Official Work Email <span className="text-[#ff5722]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={orgEmail}
                      onChange={(e) => {
                        setOrgEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="p-2.5 rounded bg-white/5 border border-white/10 text-[11px] text-neutral-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Government institutional credentials are encrypted in local evaluation mode.</span>
                  </div>
                </form>
              )}

              {/* ----------------------------------------------------
                  STEP 2: DEPARTMENT AND ROLE
                  ---------------------------------------------------- */}
              {step === 2 && (
                <form onSubmit={handleStep2Next} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffab40] font-semibold">
                      Operational Unit
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Department & Officer Role
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Identify your municipal department and designation for dispatch authority permissions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-neutral-300">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-neutral-300">
                        Designation / Role Title <span className="text-[#ff5722]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={roleTitle}
                        onChange={(e) => {
                          setRoleTitle(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="e.g. Assistant Executive Engineer (AEE)"
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">
                        Contact Email <span className="text-[#ff5722]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">Official Phone</label>
                      <input
                        type="text"
                        value={workPhone}
                        onChange={(e) => setWorkPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* ----------------------------------------------------
                  STEP 3: JURISDICTION & COVERAGE
                  ---------------------------------------------------- */}
              {step === 3 && (
                <form onSubmit={handleStep3Next} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#ffab40] font-semibold">
                      Spatial Boundary
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Territorial Jurisdiction
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Define the administrative boundaries and ward zones monitored by your division.
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
                      <label className="font-semibold text-neutral-300">District</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">
                        City / Municipality <span className="text-[#ff5722]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-300">
                        Primary Ward / Zone <span className="text-[#ff5722]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-neutral-300">Coverage Details</label>
                      <input
                        type="text"
                        value={coverageDetails}
                        onChange={(e) => setCoverageDetails(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/15 rounded-md text-white focus:border-[#ff5722] focus:outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* ----------------------------------------------------
                  STEP 4: REVIEW & REQUEST ACCESS
                  ---------------------------------------------------- */}
              {step === 4 && (
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Simulated Clearance Active</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Confirm Authority Access
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Review your municipal credentials. Clicking enter launches your operational triage console.
                    </p>
                  </div>

                  <div className="bg-neutral-900 border border-white/15 rounded-lg p-3.5 sm:p-4 space-y-2 divide-y divide-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Organization:</span>
                      <span className="font-semibold text-white truncate max-w-[200px]">{orgName}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-400">Department / Role:</span>
                      <span className="text-neutral-200">{department} • {roleTitle}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-400">Jurisdiction:</span>
                      <span className="text-neutral-300">{ward}, {city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-neutral-400">Dispatch Routing:</span>
                      <span className="font-mono text-emerald-400 font-semibold">Enabled (Demo Console)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                    <strong>Notice:</strong> CivicFix AI does not claim automated government verification. You are entering an evaluation sandbox preloaded with simulated Ward 112 roadwork dispatches.
                  </div>
                </div>
              )}

            </StepTransition>

          </div>

          {/* ========================================================
              BOTTOM ACTION BAR: Consistent navigation position
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
                    step === 1 ? handleStep1Next :
                    step === 2 ? handleStep2Next :
                    handleStep3Next
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
                  className="px-6 py-2 rounded-md bg-gradient-to-r from-[#ff5722] to-amber-500 hover:from-[#e64a19] hover:to-[#ff5722] text-white text-xs font-bold shadow-md active:scale-[0.99] transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isFinishing ? (
                    <span>Launching Console...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enter Authority Console</span>
                    </>
                  )}
                </button>
              )}

            </div>

            <div className="text-[10px] text-neutral-500 font-mono text-center">
              Municipal Corporation Evaluation Console • Ward 112 Triage Routing
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
