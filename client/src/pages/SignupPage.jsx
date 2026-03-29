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
    <div className="flex min-h-screen items-center justify-center bg-app-wash px-4 py-8">
      <form onSubmit={handleSubmit} className="panel w-full max-w-xl p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Start a workspace</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-ink">Create company admin</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">Set up your company, choose a base currency, and start managing reimbursements with a cleaner interface.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="field" placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <input className="field" placeholder="Base currency" value={form.baseCurrency} onChange={(e) => setForm({ ...form, baseCurrency: e.target.value.toUpperCase() })} />
          <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="field md:col-span-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}
        <button className="button-primary mt-6 w-full">Create workspace</button>
        <p className="mt-6 text-sm text-slate-500">Already have an account? <Link className="font-medium text-ink underline" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
