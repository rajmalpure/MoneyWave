import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";
import { AuthLayout } from "../components/auth/AuthLayout";
import { TextInput } from "../components/ui/TextInput";
import { Button } from "../components/ui/Button";

const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", form);
      setCredentials(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your financial insights"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && (
          <p className="rounded bg-red-500/10 p-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

