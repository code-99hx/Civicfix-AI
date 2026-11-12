import React from 'react';
import { UserCheck, Building2, CheckCircle2 } from 'lucide-react';

export default function RoleSelector({ selectedRole, onSelectRole, className = '' }) {
  const roles = [
    {
      id: 'citizen',
      title: "I'm a Citizen",
      description: "Report local issues and follow their progress.",
      icon: UserCheck,
      badge: "Citizen Portal",
      accent: "#ff5722"
    },
    {
      id: 'authority',
      title: "I'm with a Civic Authority",
      description: "Manage reported issues and coordinate resolution.",
      icon: Building2,
      badge: "Operations Hub",
      accent: "#e64a19"
    }
  ];

  const handleKeyDown = (e, roleId) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelectRole(roleId);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      onSelectRole('authority');
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      onSelectRole('citizen');
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider">
          Select Account Type
        </label>
        <span className="text-[10px] text-neutral-400 font-mono">2 roles available</span>
      </div>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-2" 
        role="radiogroup" 
        aria-label="Account type"
      >
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <div
              key={role.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectRole(role.id)}
              onKeyDown={(e) => handleKeyDown(e, role.id)}
              className={`relative group p-2.5 sm:p-3 rounded-md border text-left cursor-pointer transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                isSelected
                  ? 'border-[#ff5722] bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 shadow-sm ring-1 ring-[#ff5722]'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/70'
              }`}
            >
              {/* Check indicator badge */}
              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                  isSelected 
                    ? 'bg-[#ff5722] text-white shadow-xs' 
                    : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200/80'
                }`}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-mono tracking-tight uppercase px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-orange-100/90 text-orange-800' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {role.badge}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#ff5722] flex-shrink-0" />
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="font-semibold text-xs sm:text-[13px] text-neutral-900 tracking-tight leading-snug">
                {role.title}
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug mt-0.5">
                {role.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
