import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does CivicFix AI triage reported civic issues?',
    a: 'When you submit photo evidence and street location, our triage engine simulates optical analysis, identifies category and severity flags (Level 1 to 4), checks for nearby duplicate grievances within 100 meters, and auto-routes the incident to the appropriate municipal department.'
  },
  {
    q: 'How do report statuses progress?',
    a: 'Reports begin in "Awaiting Review" while under municipal evaluation. Once a work order is generated and assigned to a rapid field crew, the status transitions to "In Progress". When work is completed and photographic evidence is verified by a ward inspector, it transitions to "Resolved".'
  },
  {
    q: 'How long does municipal dispatch take?',
    a: 'Urgent road hazards (Level 4, such as 18" potholes or collapsed manholes) target response within 12 to 24 hours. General streetlight repairs, waste clearance, and footpath pavers typically complete within 48 to 72 hours.'
  },
  {
    q: 'Can I report grievances outside my registered ward?',
    a: 'Yes. You can report civic problems in any neighborhood. Your default ward preference simply organizes your primary radar view.'
  },
  {
    q: 'Is this live emergency dispatch?',
    a: 'No. CivicFix AI currently operates in a client-side evaluation prototype mode with mock data for research and demonstration purposes. For immediate physical emergencies (such as downed power lines or structural collapse), please dial emergency services (112) directly.'
  }
];

const STATUS_GUIDE = [
  {
    status: 'Awaiting Review',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: AlertCircle,
    desc: 'Incident logged. Queued for municipal supervisor review and spatial duplicate checking.'
  },
  {
    status: 'In Progress',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
    desc: 'Work order dispatched to field squad (e.g. Rapid Roadworks Squad). Repairs actively underway.'
  },
  {
    status: 'Resolved',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
    desc: 'Field repair complete. Verified with supervisor photographic proof and signed off.'
  }
];

export default function CitizenHelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Help & Support Center
        </h2>
        <p className="text-xs text-neutral-500 pt-0.5">
          Comprehensive guides on reporting civic issues, understanding triage SLAs, and tracking resolution outcomes.
        </p>
      </div>

      {/* Emergency Disclaimer Banner */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-semibold">Life-Safety Emergency Notice:</strong>
          <p className="leading-relaxed text-[11px] text-amber-800">
            CivicFix AI is designed for public infrastructure maintenance and municipal accountability. If an incident poses immediate physical peril to human life (such as exposed high-voltage cables or structural building collapse), please contact 112 or local disaster management immediately.
          </p>
        </div>
      </div>

      {/* Status Progress Guide */}
      <div className="bg-white border border-neutral-200/90 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-neutral-100 pb-2">
          <h3 className="font-bold text-sm text-neutral-900">
            How Incident Statuses Work
          </h3>
          <p className="text-xs text-neutral-500">
            Understand every stage of the civic remediation lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STATUS_GUIDE.map((sg) => {
            const Icon = sg.icon;
            return (
              <div key={sg.status} className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${sg.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sg.status}</span>
                </span>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  {sg.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Searchable FAQ Accordion */}
      <div className="bg-white border border-neutral-200/90 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-neutral-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-neutral-500">
              Clear answers to common questions about reporting and tracking.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-neutral-100 text-xs">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full text-left font-semibold text-neutral-900 flex items-center justify-between gap-3 hover:text-[#ff5722] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 text-[11px]">0{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-neutral-600 leading-relaxed pt-2 pl-6 animate-fadeIn text-[11px]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
