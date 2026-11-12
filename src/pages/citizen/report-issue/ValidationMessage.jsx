/**
 * CivicFix AI - Standalone inline validation message (role="alert").
 */

export default function ValidationMessage({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-orange-700 font-medium leading-relaxed flex items-center gap-1.5" role="alert">
      <span className="flex-shrink-0" aria-hidden="true">!</span>
      {message}
    </p>
  );
}
