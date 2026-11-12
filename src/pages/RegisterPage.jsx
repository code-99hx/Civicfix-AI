import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import RoleSelector from '../components/RoleSelector';
import { loginDemoUser } from '../services/demoAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your full name or official title.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the terms of service and privacy policy.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Initialize demo session
      loginDemoUser({ email, role: selectedRole, fullName });
      
      // Route directly to respective onboarding flow
      if (selectedRole === 'citizen') {
        navigate('/onboarding/citizen');
      } else {
        navigate('/onboarding/authority');
      }
    }, 600);
  };

  return (
    <AuthLayout
      visualQuote={selectedRole === 'citizen' ? "Small local observations can start meaningful change." : "Empowering municipal teams with real-time field triage."}
      visualSub={selectedRole === 'citizen' ? "Transparent Civic Participation" : "Municipal Incident Network"}
    >
      <div className="space-y-3 sm:space-y-3.5">
        
        {/* Header copy */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ff5722]">
              Join CivicFix AI
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-800">
              Frontend Demo
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-xs text-neutral-500 leading-snug font-normal">
            Choose whether you are participating as an individual citizen or a municipal department.
          </p>
        </div>

        {/* Validation error */}
        {error && (
          <div className="p-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Account Role Selector */}
        <RoleSelector 
          selectedRole={selectedRole} 
          onSelectRole={(role) => setSelectedRole(role)} 
        />

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          
          {/* Full Name */}
          <div className="space-y-0.5">
            <label htmlFor="reg-name" className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
              {selectedRole === 'authority' ? 'Official / Representative Name' : 'Full name'}
            </label>
            <input
              id="reg-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={selectedRole === 'authority' ? 'e.g. Ramesh Kumar (Asst. Executive Eng.)' : 'e.g. Priya Sharma'}
              className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-0.5">
            <label htmlFor="reg-email" className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
              {selectedRole === 'authority' ? 'Official Work Email' : 'Email address'}
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === 'authority' ? 'officer@bbmp.gov.in' : 'name@neighbourhood.org'}
              className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Password & Confirm Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label htmlFor="reg-pass" className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  className="w-full px-3 py-1.5 sm:py-2 pr-9 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-[11px]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              <label htmlFor="reg-confirm" className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                Confirm
              </label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
                required
              />
            </div>
          </div>

          {/* Terms Consent */}
          <div className="flex items-start gap-2 pt-0.5">
            <input
              id="reg-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 text-[#ff5722] border-neutral-300 rounded focus:ring-0 cursor-pointer"
              required
            />
            <label htmlFor="reg-terms" className="text-xs text-neutral-600 leading-tight select-none cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-[#ff5722] underline underline-offset-2 hover:text-[#e64a19]">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#ff5722] underline underline-offset-2 hover:text-[#e64a19]">
                Privacy Policy
              </Link>
              .*
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 shadow-md hover:bg-neutral-800 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing Onboarding...</span>
                </>
              ) : (
                <span>Continue to {selectedRole === 'citizen' ? 'Citizen' : 'Authority'} Setup &rarr;</span>
              )}
            </button>
          </div>

        </form>

        {/* Existing account switch */}
        <div className="text-center pt-0.5 text-xs text-neutral-600">
          <span>Already have an account? </span>
          <Link 
            to="/login" 
            className="text-[#ff5722] hover:text-[#e64a19] font-semibold underline underline-offset-2 transition-colors"
          >
            Sign in
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
}
