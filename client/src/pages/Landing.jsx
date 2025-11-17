import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 lg:px-8">
        {/* Top nav */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-primary/20 ring-2 ring-primary/40 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">MM</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Money Manager
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <Button
              className="hidden sm:inline-flex"
              onClick={() => navigate("/signup")}
            >
              Get started
            </Button>
          </div>
        </header>

        {/* Hero section */}
        <main className="mt-12 flex flex-1 flex-col items-center gap-12 lg:mt-20 lg:flex-row">
          <section className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Smart insights for your money, in real time.
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              Take control of your{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                financial future
              </span>
              .
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-400">
              Track every income and expense, visualize your spending,
              and stay ahead with personalized analytics — all in one
              beautiful, focused workspace.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-shadow"
                onClick={() => navigate("/signup")}
              >
                Start for free
              </Button>
              <button
                className="w-full sm:w-auto rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                onClick={() => navigate("/login")}
              >
                I already have an account
              </button>
            </div>
            <div className="flex gap-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Bank‑grade security
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Real‑time analytics
              </div>
            </div>
          </section>

          {/* Animated illustration / preview card */}
          <section className="relative w-full lg:w-1/2">
            <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_55%)] opacity-70" />

            <div className="relative mx-auto max-w-md">
              <div className="animate-[float_6s_ease-in-out_infinite] rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-2xl shadow-sky-900/40 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Current balance
                    </p>
                    <p className="mt-1 text-2xl font-semibold">$12,480.32</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    +18.2% this month
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-950/60 p-3">
                    <p className="text-slate-400">Income</p>
                    <p className="mt-1 text-emerald-400 font-semibold">
                      $7,300
                    </p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                      <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-950/60 p-3">
                    <p className="text-slate-400">Expenses</p>
                    <p className="mt-1 text-rose-400 font-semibold">
                      $4,120
                    </p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-[10px] sm:text-xs">
                  {["Dining", "Bills", "Savings"].map((label, idx) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
                    >
                      <p className="text-slate-400">{label}</p>
                      <p className="mt-1 font-semibold">
                        {idx === 0 ? "$420" : idx === 1 ? "$1,120" : "$2,300"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glowing accent card */}
              <div className="pointer-events-none absolute -bottom-10 left-1/2 w-40 -translate-x-1/2 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-[10px] text-sky-100 shadow-lg shadow-sky-900/40 backdrop-blur animate-[float_7s_ease-in-out_infinite_reverse]">
                <p className="font-medium">“You’re on track this month 🎯”</p>
                <p className="text-slate-300">
                  Spending is <span className="text-emerald-300">12%</span> below your usual average.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom CTA */}
        <footer className="mt-10 border-t border-slate-800/60 pt-6 text-xs text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Money Manager. All rights reserved.</p>
          <p className="text-slate-500">
            Built for people who want clarity, not spreadsheets.
          </p>
        </footer>
      </div>
    </div>
  );
};


