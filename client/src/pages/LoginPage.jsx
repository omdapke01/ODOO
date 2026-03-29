import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-wash px-4 py-8">
      <form onSubmit={handleSubmit} className="panel w-full max-w-md p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-ink">Sign in</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">Review submissions, process approvals, and manage policies from one calm workspace.</p>
        <div className="mt-6 space-y-4">
          <input className="field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button className="button-primary w-full">Login</button>
        </div>
        <div className="mt-6 rounded-2xl bg-shell/80 p-4 text-sm text-slate-600">
          Demo seed users live in the backend seeder if you want a quick start.
        </div>
        <p className="mt-6 text-sm text-slate-500">New company? <Link className="font-medium text-ink underline" to="/signup">Create account</Link></p>
      </form>
    </div>
  );
}
