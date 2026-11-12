import React from 'react';
import PublicPageLayout from '../layouts/PublicPageLayout';

export default function TermsPage() {
  return (
    <PublicPageLayout
      eyebrow="Platform Guidelines"
      title="Terms of Use"
      description="Operational standards and community guidelines for participating on the CivicFix AI reporting network."
      badge
    >
      <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-16 lg:py-24 space-y-10 text-neutral-300 text-sm leading-relaxed">
        
        {/* Prototype Legal Disclosure */}
        <div className="p-4 rounded-md bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          <strong className="block font-semibold mb-1 text-amber-100">Prototype Terms Notice:</strong>
          These Terms of Use represent a software prototype draft. Binding terms for public municipal usage will be ratified prior to official city rollout.
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Scope of the Platform</h2>
          <p>
            CivicFix AI operates as an information intake, deduplication, and status tracking platform. CivicFix AI provides software tools to facilitate civic transparency; it does not replace the constitutional authority or operational jurisdiction of municipal corporations, urban local bodies (ULBs), or law enforcement agencies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Responsible Citizen Reporting</h2>
          <p>
            Users agree to submit truthful, accurate observations of genuine public infrastructure defects. The following submissions are strictly prohibited:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-xs sm:text-sm">
            <li>Fabricated, staged, or maliciously falsified hazard photographs.</li>
            <li>Defamatory statements targeting individual civic workers or community members.</li>
            <li>Commercial advertising, spam, or promotional material disguised as civic reports.</li>
            <li>Harassing, obscene, or abusive text or media submissions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">3. Emergency Situations</h2>
          <p>
            <strong>Do not use CivicFix AI for life-threatening emergencies.</strong> In the event of an active fire, medical emergency, gas pipeline rupture, live fallen electrical transmission line, or criminal incident, call your local emergency telephone number immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">4. AI Prioritization Disclaimer</h2>
          <p>
            AI triage algorithms provide automated categorization and clustering recommendations to assist human dispatch squads. CivicFix AI does not guarantee specific resolution timeframes, which depend on municipal budget, contractor availability, and field conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">5. Modifications to Terms</h2>
          <p>
            As CivicFix AI evolves with new open datasets and municipal integrations, these terms will be updated with notice posted to this page.
          </p>
        </section>

      </div>
    </PublicPageLayout>
  );
}
