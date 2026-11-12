import React from 'react';
import PublicPageLayout from '../layouts/PublicPageLayout';

export default function PrivacyPage() {
  return (
    <PublicPageLayout
      eyebrow="Platform Policy"
      title="Privacy Policy"
      description="How CivicFix AI handles civic incident imagery, geolocation coordinates, and reporter account privacy."
      badge
    >
      <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-16 lg:py-24 space-y-10 text-neutral-300 text-sm leading-relaxed">
        
        {/* Prototype Legal Disclosure */}
        <div className="p-4 rounded-md bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          <strong className="block font-semibold mb-1 text-amber-100">Prototype Draft Notice:</strong>
          This Privacy Policy is a project draft formulated for prototype demonstration and software architectural evaluation. Prior to live municipal or state government deployment, formal legal review will be conducted.
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">1. Information Collected During Issue Reporting</h2>
          <p>
            CivicFix AI collects information strictly relevant to resolving public infrastructure hazards:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-xs sm:text-sm">
            <li><strong>Photographic Media:</strong> Images of road defects, garbage mounds, lighting fixtures, or water leaks uploaded by the citizen.</li>
            <li><strong>Geolocation Coordinates:</strong> Latitude and longitude coordinates extracted with user permission from device GPS.</li>
            <li><strong>Issue Categorization:</strong> Selected hazard type, descriptive landmarks, and timestamps.</li>
            <li><strong>Reporter Metadata:</strong> Name and email address if signed in, or an anonymized session token if submitting anonymously where allowed.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">2. Facial & License Plate Privacy Scrubbing</h2>
          <p>
            Public civic reporting should not compromise personal privacy. CivicFix AI incorporates automated visual redacting filters designed to blur inadvertent facial captures, vehicle registration plates, and personal documents visible in uploaded street photos before public publication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">3. Use of Geolocation Data</h2>
          <p>
            Location coordinates are utilized solely for mapping incident clusters, verifying proximity to municipal ward boundaries, and generating accurate field repair work orders. We do not track user real-time movement or maintain background location histories.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">4. Data Sharing & Municipal Teams</h2>
          <p>
            Anonymized incident data (photos, timestamps, coordinates, defect categories) may be shared with authorized municipal agencies, ward engineers, and road maintenance contractors responsible for site repair. Personal contact information is never sold to commercial marketing vendors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white tracking-tight">5. Contact Regarding Privacy</h2>
          <p>
            For privacy inquiries or data removal requests regarding an uploaded civic report, please contact: <a href="mailto:contact@civicfix.ai" className="text-[#ffab40] underline">contact@civicfix.ai</a>.
          </p>
        </section>

      </div>
    </PublicPageLayout>
  );
}
