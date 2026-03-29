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
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#edf5f8,_#f8efe7)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Sign in</h1>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button className="w-full rounded-2xl bg-ink px-4 py-3 text-white">Login</button>
        </div>
        <p className="mt-6 text-sm text-slate-500">New company? <Link className="text-ink underline" to="/signup">Create account</Link></p>
      </form>
    </div>
  );
}
