import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <AuthLayout
      visualQuote="Reliable communication is the foundation of civic trust."
      visualSub="Account Recovery Protocol"
    >
      <div className="space-y-6">
        
        {/* Header copy */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#ff5722]">
            Password Recovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Let's get you back in.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Enter the email associated with your CivicFix AI account and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700" role="alert">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="space-y-5 py-2">
            <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
              <div className="font-semibold text-amber-900">Prototype Recovery Request Recorded</div>
              <p className="leading-relaxed">
                Password recovery request recorded for <strong className="font-semibold">{email}</strong>. In live production, a secure cryptographic reset token is dispatched to your registered address.
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full text-center rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-semibold py-3 shadow hover:bg-neutral-800 transition-colors uppercase tracking-wider"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label htmlFor="recovery-email" className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Account email address
              </label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@neighbourhood.org"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-neutral-300 rounded-md focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors placeholder:text-neutral-400"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-neutral-900 text-white text-xs sm:text-sm font-semibold py-3 shadow-md hover:bg-neutral-800 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </div>

            <div className="text-center pt-2 text-xs text-neutral-600">
              <Link 
                to="/login" 
                className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                &larr; Back to Sign In
              </Link>
            </div>

          </form>
        )}

      </div>
    </AuthLayout>
  );
}
