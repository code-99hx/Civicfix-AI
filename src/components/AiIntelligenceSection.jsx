import React, { useState } from 'react';

const incidentData = [
  {
    id: 'INC-4082',
    title: 'Severe Asphalt Pothole • 18" Dia',
    location: '100ft Rd, Ward 112',
    category: 'Road Infrastructure',
    urgency: 'Level 4 • Urgent',
    duplicates: 3,
    status: 'In Progress',
    coordinates: '12.9716° N, 77.5946° E',
    time: '22 mins ago',
  },
  {
    id: 'INC-4079',
    title: 'Broken High-Mast Streetlight',
    location: '5th Main, 2nd Stage',
    category: 'Civic Lighting',
    urgency: 'Level 3 • Medium',
    duplicates: 1,
    status: 'Acknowledged',
    coordinates: '12.9728° N, 77.5982° E',
    time: '1h 15m ago',
  },
  {
    id: 'INC-4075',
    title: 'Sub-Surface Pipe Joint Leak',
    location: '80ft Road Junction',
    category: 'Water & Utilities',
    urgency: 'Level 4 • Urgent',
    duplicates: 4,
    status: 'Assigned',
    coordinates: '12.9691° N, 77.5921° E',
    time: '3h 40m ago',
  },
];

export default function AiIntelligenceSection() {
  const [selectedIncident, setSelectedIncident] = useState(incidentData[0]);

  return (
    <section className="bg-white text-neutral-900 py-20 sm:py-28 border-b border-neutral-200/80 relative">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-block text-xs uppercase tracking-widest text-[#ea580c] font-semibold px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
            Civic Intelligence Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]">
            Transforming Noise Into Structured Local Priorities
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal">
            CivicFix AI groups redundant reports, detects geographic patterns, and surfaces actionable evidence for municipal teams without black-box automation.
          </p>
        </div>

        {/* 5 Core Intelligence Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
            <span className="block font-bold text-neutral-900 mb-0.5">Categorization</span>
            <span className="text-[11px] text-neutral-500">Multimodal vision tagger</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
            <span className="block font-bold text-neutral-900 mb-0.5">Duplicate Filter</span>
            <span className="text-[11px] text-neutral-500">Spatial radius grouping</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
            <span className="block font-bold text-neutral-900 mb-0.5">Ward Clusters</span>
            <span className="text-[11px] text-neutral-500">Neighborhood heatmaps</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
            <span className="block font-bold text-neutral-900 mb-0.5">Priority Scoring</span>
            <span className="text-[11px] text-neutral-500">Configurable civic signals</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 col-span-2 md:col-span-1">
            <span className="block font-bold text-neutral-900 mb-0.5">Audit Trails</span>
            <span className="text-[11px] text-neutral-500">Tamper-evident logs</span>
          </div>
        </div>

        {/* Premium Product Dashboard Mockup */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-lg overflow-hidden">
          
          {/* Dashboard Chrome Bar */}
          <div className="bg-neutral-50 px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-neutral-700 pl-2 border-l border-neutral-200">
                CivicFix Command Terminal • Central Ward District 4
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                ● Live Intake Active
              </span>
              <span className="text-neutral-500 text-[11px] hidden sm:inline">
                Sample Interface Data
              </span>
            </div>
          </div>

          {/* Dashboard Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
            
            {/* Left Column: Structured Incident Stream */}
            <div className="lg:col-span-5 p-5 space-y-3 bg-neutral-50/50">
              <div className="flex items-center justify-between text-xs text-neutral-600 pb-2">
                <span className="font-bold uppercase tracking-wider text-neutral-900">Active Incidents ({incidentData.length})</span>
                <span className="text-[11px] text-neutral-500">Auto-sorted by Priority</span>
              </div>

              {incidentData.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedIncident.id === inc.id
                      ? 'bg-white border-[#ff6243] shadow-md ring-1 ring-orange-500/20'
                      : 'bg-white/70 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="font-mono text-[#ea580c] font-bold">{inc.id}</span>
                    <span className="text-[10px] text-neutral-500">{inc.time}</span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 mb-2">{inc.title}</h4>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700">
                      {inc.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-[#ea580c] border border-orange-200 font-semibold">
                      {inc.urgency}
                    </span>
                    {inc.duplicates > 0 && (
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {inc.duplicates} merged duplicates
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Spatial Map & Intelligence Breakdown */}
            <div className="lg:col-span-7 p-6 bg-white space-y-5">
              
              {/* Map & Cluster Visual Area */}
              <div className="aspect-[16/9] rounded-xl border border-neutral-200 bg-neutral-900 overflow-hidden relative group">
                <img
                  src="/images/feature_04.jpg"
                  alt="City neighborhood spatial coordinates map"
                  className="w-full h-full object-cover filter contrast-105 opacity-80"
                />
                
                {/* Simulated Geolocation Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="bg-black/80 px-3 py-1.5 rounded-md border border-white/20 text-xs font-mono text-white">
                      📍 {selectedIncident.coordinates}
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#ff6243] text-white text-[11px] font-semibold tracking-wide">
                      Clustered Incident Hub
                    </span>
                  </div>

                  {/* Cluster indicator box */}
                  <div className="p-3 bg-black/85 backdrop-blur-md border border-white/20 rounded-lg max-w-sm text-xs space-y-1">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Spatial Cluster Analysis Verified
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      {selectedIncident.duplicates} independent citizen submissions merged automatically within 45m radius. Single dispatch ticket issued.
                    </p>
                  </div>
                </div>
              </div>

              {/* Triage Evidence Card */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Assigned Squad</span>
                  <span className="font-bold text-neutral-900">Ward 112 Rapid Roadworks</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Current Status</span>
                  <span className="font-bold text-amber-700">{selectedIncident.status}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider block font-semibold">Decision Protocol</span>
                  <span className="font-bold text-neutral-900">Human Verification Required</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
