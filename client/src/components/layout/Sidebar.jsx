import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";
import { LayoutDashboard, Receipt, TrendingUp, User, Wallet, Users } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/fixed-expenses", label: "Fixed Expenses", icon: Wallet },
  { to: "/groups", label: "Group Transactions", icon: Users },
  { to: "/analytics", label: "Analytics", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
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
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  isActive ? "bg-primary/20 text-primary" : "text-slate-300"
                }`
              }
            >
              <Icon size={20} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
};

