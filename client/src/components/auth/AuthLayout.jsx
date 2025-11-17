export const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

