import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/analytics", label: "Analytics" },
  { to: "/profile", label: "Profile" },
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-900/70 backdrop-blur border-r border-slate-800 p-6 hidden lg:flex flex-col">
      <div>
        <p className="text-xl font-semibold text-white">Money Manager</p>
        <p className="text-sm text-slate-400">Track smarter, spend wiser</p>
      </div>
      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-primary/20 text-primary" : "text-slate-300"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
};

