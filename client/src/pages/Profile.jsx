import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";

export const Profile = () => {
  const [serverUser, setServerUser] = useState(null);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await api.get("/auth/profile");
      setServerUser(data.user);
    };
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6 max-w-xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold mb-4">Profile details</h2>
        {serverUser ? (
          <div className="space-y-2 text-slate-300">
            <p>
              <span className="text-slate-500">Name:</span> {serverUser.name}
            </p>
            <p>
              <span className="text-slate-500">Email:</span> {serverUser.email}
            </p>
            <p>
              <span className="text-slate-500">Member since:</span>{" "}
              {new Date(serverUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

