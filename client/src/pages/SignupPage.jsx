import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ companyName: "", baseCurrency: "INR", name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f6f0e9,_#ebf4f8)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Start a workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Create company admin</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Base currency" value={form.baseCurrency} onChange={(e) => setForm({ ...form, baseCurrency: e.target.value.toUpperCase() })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 outline-none md:col-span-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}
        <button className="mt-6 w-full rounded-2xl bg-ink px-4 py-3 text-white">Create workspace</button>
        <p className="mt-6 text-sm text-slate-500">Already have an account? <Link className="text-ink underline" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
