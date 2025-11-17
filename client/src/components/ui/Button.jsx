const variants = {
  primary:
    "bg-primary hover:bg-primary/90 text-white transition-colors duration-200",
  outline:
    "border border-slate-600 text-slate-100 hover:bg-slate-800 transition",
  ghost: "text-slate-300 hover:text-white",
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

