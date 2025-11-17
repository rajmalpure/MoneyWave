import { useAuthStore } from "../../store/useAuthStore";

export const Topbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-900/60 backdrop-blur">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome back 👋</h1>
        <p className="text-sm text-slate-400">
          Here is what&apos;s happening with your finances
        </p>
      </div>
      {user && (
        <div className="text-right">
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      )}
    </header>
  );
};

