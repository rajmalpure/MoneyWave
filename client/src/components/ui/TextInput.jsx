export const TextInput = ({
  label,
  type = "text",
  error,
  className = "",
  ...props
}) => (
  <label className={`flex flex-col gap-1 text-sm ${className}`}>
    <span className="text-slate-300">{label}</span>
    <input
      type={type}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </label>
);

