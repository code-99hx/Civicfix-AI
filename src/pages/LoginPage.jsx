import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginAbstractArt from '../components/LoginAbstractArt';
import RoleSelector from '../components/RoleSelector';
import { getDemoSession, loginDemoUser } from '../services/demoAuth';
import { signInWithGoogle } from '../services/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoNotice, setDemoNotice] = useState('');

  // Handle standard email/password login
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setDemoNotice('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Save demo session
      loginDemoUser({ email, role: selectedRole });
      const currentSession = getDemoSession();

      if (selectedRole === 'citizen') {
        if (currentSession.onboardingCompleted) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding/citizen');
        }
      } else {
        if (currentSession.authorityOnboardingCompleted) {
          navigate('/authority/dashboard');
        } else {
          navigate('/onboarding/authority');
        }
      }
    }, 600);
  };

  // Handle Google OAuth Sign-In simulation / attempt
  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;

    setError('');
    setDemoNotice('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      // If live token is returned, continue
    } catch (err) {
      setGoogleLoading(false);
      setDemoNotice(`Google OAuth simulation active for ${selectedRole === 'citizen' ? 'Citizen' : 'Civic Authority'} role. Logging into demo sandbox...`);
      setTimeout(() => {
        loginDemoUser({ email: `google.user@civicfix.org`, role: selectedRole, fullName: 'Google Demo User' });
        const currentSession = getDemoSession();
        if (selectedRole === 'citizen') {
          navigate(currentSession.onboardingCompleted ? '/dashboard' : '/onboarding/citizen');
        } else {
          navigate(currentSession.authorityOnboardingCompleted ? '/authority/dashboard' : '/onboarding/authority');
        }
      }, 700);
    }
  };

  return (
    <AuthLayout
      visualQuote={selectedRole === 'citizen' ? "Every report can help move a community forward." : "Coordinated civic resolution at municipal scale."}
      visualSub={selectedRole === 'citizen' ? "Report. Track. Resolve." : "Command & Triage Operations"}
      decorativeVisual={<LoginAbstractArt />}
    >
      <div className="space-y-3.5 sm:space-y-4">
        
        {/* Header copy */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ff5722]">
              Welcome Back
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-800">
              Frontend Demo Mode
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Sign in to CivicFix AI
          </h1>
          <p className="text-xs text-neutral-500 leading-snug font-normal">
            Select your account type to access your personalized portal and issue tools.
          </p>
        </div>

        {/* Role Selector */}
        <RoleSelector 
          selectedRole={selectedRole} 
          onSelectRole={(role) => setSelectedRole(role)} 
        />

        {/* Informational or error notification */}
        {error && (
          <div className="p-2.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed" role="alert">
            <strong className="block font-semibold mb-0.5">Authentication Notice:</strong>
            {error}
          </div>
        )}

        {demoNotice && (
          <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed" role="status">
            <strong className="block font-semibold mb-0.5">Demo Simulation:</strong>
            {demoNotice}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          
          {/* Email input */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
              {selectedRole === 'authority' ? 'Official Work Email' : 'Email address'}
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === 'authority' ? 'officer@bbmp.gov.in' : 'name@neighbourhood.org'}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Password input with show/hide */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-[11px] text-[#ff5722] hover:text-[#e64a19] font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (demo: 6+ chars)"
                className="w-full px-3 py-2 pr-10 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember me control */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 text-[#ff5722] border-neutral-300 rounded focus:ring-0 cursor-pointer"
            />
            <label htmlFor="remember-me" className="text-xs text-neutral-600 select-none cursor-pointer">
              Remember me on this device
            </label>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-0.5">
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-2.5 shadow-md hover:bg-neutral-800 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entering {selectedRole === 'citizen' ? 'Citizen' : 'Authority'} Demo...</span>
                </>
              ) : (
                <span>Sign In as {selectedRole === 'citizen' ? 'Citizen' : 'Civic Authority'}</span>
              )}
            </button>
          </div>

        </form>

        {/* Visual OR Separator */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-[#fcfbf9] px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            OR
          </span>
        </div>

        {/* Google Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full rounded-md bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold py-2 sm:py-2.5 shadow-xs hover:bg-neutral-50 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 cursor-pointer"
          >
            {googleLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
                <span>Simulating Google Auth...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google as {selectedRole === 'citizen' ? 'Citizen' : 'Authority'}</span>
              </>
            )}
          </button>
        </div>

        {/* Switch to Register */}
        <div className="text-center pt-0.5 text-xs text-neutral-600">
          <span>New to CivicFix AI? </span>
          <Link 
            to="/register" 
            className="text-[#ff5722] hover:text-[#e64a19] font-semibold underline underline-offset-2 transition-colors"
          >
            Create an account
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
}
