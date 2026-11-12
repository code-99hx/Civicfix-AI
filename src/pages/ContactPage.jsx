import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../layouts/PublicPageLayout';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please provide a brief message description.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <PublicPageLayout
      eyebrow="Direct Communication"
      title="Contact & Community Inquiries"
      description="Connect with the CivicFix AI initiative for platform technical inquiries, open dataset collaboration, or community pilot discussions."
      badge
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#ff7e5f] font-semibold block mb-2">
                Get In Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Civic Collaboration
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal mt-3">
                Have questions regarding incident deduplication, spatial reporting architecture, or pilot programs in your ward? We welcome community feedback and civic tech collaboration.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <div className="p-4 rounded-md bg-[#141419] border border-white/10 space-y-1">
                <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">Project Email</span>
                <a href="mailto:contact@civicfix.ai" className="text-white hover:text-[#ffab40] font-medium text-sm transition-colors">
                  contact@civicfix.ai
                </a>
              </div>

              <div className="p-4 rounded-md bg-[#141419] border border-white/10 space-y-1">
                <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">Response Protocol</span>
                <span className="text-neutral-300 block">Inquiries are reviewed by the open civic platform initiative.</span>
              </div>
            </div>

            <div className="text-xs text-neutral-500 space-y-2">
              <p>For urgent emergencies (gas leak, active road collapse, downed power lines), please immediately contact local emergency municipal authorities directly.</p>
              <div className="flex gap-4 pt-1">
                <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>
                <Link to="/terms" className="underline hover:text-white">Terms of Use</Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-md bg-[#15151b] border border-white/15 p-6 sm:p-10 shadow-2xl">
              {submitted ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-white">Inquiry Recorded (Demo Prototype)</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{name}</strong>. Your prototype submission for topic <strong className="text-white">{topic}</strong> has been received locally.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-4 rounded-md bg-white text-neutral-900 text-xs font-semibold px-6 py-2.5 hover:bg-neutral-100 transition-colors uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    Send a Message
                  </h3>

                  {error && (
                    <div className="p-3 rounded-md bg-red-950/60 border border-red-500/30 text-xs text-red-300">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-neutral-900 border border-white/15 rounded-md focus:border-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full px-3.5 py-2.5 text-xs text-white bg-neutral-900 border border-white/15 rounded-md focus:border-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-topic" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                      Inquiry Topic
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-white bg-neutral-900 border border-white/15 rounded-md focus:border-white focus:outline-none"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Ward Pilot Program">Ward Pilot Program</option>
                      <option value="Technical & GIS Integration">Technical & GIS Integration</option>
                      <option value="Feedback / Bug Report">Feedback / Bug Report</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-msg" className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                      Message *
                    </label>
                    <textarea
                      id="contact-msg"
                      rows="4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your question or feedback..."
                      className="w-full p-3.5 text-xs text-white bg-neutral-900 border border-white/15 rounded-md focus:border-white focus:outline-none placeholder:text-neutral-500"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto rounded-md bg-white text-neutral-900 text-xs font-semibold px-8 py-3.5 hover:bg-neutral-100 transition-colors uppercase tracking-wider shadow"
                    >
                      {loading ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </PublicPageLayout>
  );
}
