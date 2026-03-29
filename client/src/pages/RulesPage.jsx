import { useEffect, useState } from "react";
import http from "../api/http";
import DataTable from "../components/DataTable";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";

const emptyRule = { ruleType: "SEQUENTIAL", percentageRequired: 0.6, specificApproverRole: "ADMIN", minAmount: "", maxAmount: "" };

export default function RulesPage() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState(emptyRule);

  async function loadRules() {
    const response = await http.get("/rules");
    setRules(response.data);
  }

  useEffect(() => {
    loadRules();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await http.post("/rules", {
      ...form,
      percentageRequired: form.ruleType === "SEQUENTIAL" || form.ruleType === "PARALLEL" ? null : Number(form.percentageRequired),
      minAmount: form.minAmount ? Number(form.minAmount) : null,
      maxAmount: form.maxAmount ? Number(form.maxAmount) : null,
    });
    setForm(emptyRule);
    await loadRules();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
      <SectionCard title="Approval logic" subtitle="Range-based rules that drive the approval engine">
        {user?.role === "ADMIN" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.ruleType} onChange={(e) => setForm({ ...form, ruleType: e.target.value })}>
              <option value="SEQUENTIAL">Sequential</option>
              <option value="PARALLEL">Parallel</option>
              <option value="CONDITIONAL">Conditional</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Min amount" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Max amount" value={form.maxAmount} onChange={(e) => setForm({ ...form, maxAmount: e.target.value })} />
            </div>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Percentage required (0-1)" value={form.percentageRequired} onChange={(e) => setForm({ ...form, percentageRequired: e.target.value })} />
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.specificApproverRole} onChange={(e) => setForm({ ...form, specificApproverRole: e.target.value })}>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            <button className="w-full rounded-2xl bg-ink px-4 py-3 text-white">Create rule</button>
          </form>
        ) : <p className="rounded-2xl bg-shell p-4 text-sm text-slate-600">Only admins can define rules.</p>}
      </SectionCard>

      <SectionCard title="Rule list" subtitle="Database-driven rules ordered by amount range">
        <DataTable columns={[{ key: "ruleType", label: "Type" }, { key: "percentageRequired", label: "Threshold" }, { key: "specificApproverRole", label: "Specific role" }, { key: "minAmount", label: "Min" }, { key: "maxAmount", label: "Max" }]} rows={rules} />
      </SectionCard>
    </div>
  );
}
