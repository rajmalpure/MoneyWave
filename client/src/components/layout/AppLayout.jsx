import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NavLink } from "react-router-dom";

const mobileLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <nav className="flex lg:hidden gap-3 border-b border-slate-800 bg-slate-900/60 px-4 py-2">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 text-sm ${
                  isActive ? "bg-primary/30 text-primary" : "text-slate-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 lg:p-8 bg-slate-950/60">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

