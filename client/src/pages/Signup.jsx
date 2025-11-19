import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { AuthLayout } from "../components/auth/AuthLayout";
import { TextInput } from "../components/ui/TextInput";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";

const initialState = { name: "", username: "", email: "", password: "" };

export const Signup = () => {
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
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setCredentials(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start tracking your income and expenses"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextInput
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Choose a unique username"
        />
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
          {loading ? "Creating account..." : "Sign up"}
        </Button>
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

