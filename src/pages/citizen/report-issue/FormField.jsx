/**
 * CivicFix AI - Form field wrapper.
 *
 * Consistent label, helper text, error state and accessible error association.
 */

export default function FormField({ label, required, helper, error, children, className }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-800 leading-tight">
          {label}
          {required && <span className="ml-0.5 text-[10px] font-bold text-orange-600" aria-hidden="true">*</span>}
        </span>
      </label>
      <div className="relative min-w-0">{children}</div>
      {helper && (
        <p className="text-xs text-slate-500 leading-relaxed">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-orange-700 font-medium leading-relaxed flex items-center gap-1.5" role="alert">
          <span className="flex-shrink-0" aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}
