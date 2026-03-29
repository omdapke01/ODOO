import { useEffect, useState } from "react";
import http from "../api/http";
import DataTable from "../components/DataTable";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  amount: "",
  currency: "USD",
  category: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  receipt: null,
};

export default function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [ocrPreview, setOcrPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadExpenses() {
    const response = await http.get("/expenses");
    setExpenses(response.data);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleOcr(file) {
    const body = new FormData();
    body.append("receipt", file);
    const response = await http.post("/expenses/ocr", body);
    setOcrPreview(response.data);
    setForm((current) => ({
      ...current,
      amount: response.data.amount || current.amount,
      date: response.data.date || current.date,
      description: response.data.merchantName || current.description,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      setSuccess("");
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value != null && value !== "") body.append(key, value);
      });
      const response = await http.post("/expenses", body);
      setForm(initialForm);
      setOcrPreview(null);
      setSuccess(response.data.ocrWarning || "Expense submitted successfully.");
      await loadExpenses();
    } catch (err) {
      const fieldErrors = err.response?.data?.errors?.fieldErrors;
      const detailedError = fieldErrors
        ? Object.entries(fieldErrors)
            .filter(([, messages]) => Array.isArray(messages) && messages.length)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join(" | ")
        : "";

      setError(detailedError || err.response?.data?.message || "Expense submission failed. Please check the fields and try again.");
    }
  }

  async function handleDecision(expenseId, action) {
    try {
      setError("");
      await http.post(`/approvals/${action}`, { expenseId });
      await loadExpenses();
    } catch (err) {
      setError(err.response?.data?.message || `Could not ${action} this expense.`);
    }
  }

  const columns = [
    { key: "user", label: "Employee", render: (_value, row) => row.user?.name },
    { key: "amount", label: "Original", render: (value, row) => `${row.currency} ${value}` },
    { key: "convertedAmount", label: "Base", render: (value) => `₹${value}` },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "approvals", label: "Approvals", render: (value) => value.map((item) => `${item.approver.name}: ${item.status}`).join(" | ") },
    {
      key: "actions",
      label: "Actions",
      render: (_value, row) => row.approvals?.some((item) => item.approverId === user?.id && item.status === "PENDING") ? (
        <div className="flex gap-2">
          <button type="button" className="rounded-xl bg-sage px-3 py-2 text-xs text-ink" onClick={() => handleDecision(row.id, "approve")}>Approve</button>
          <button type="button" className="rounded-xl bg-rose px-3 py-2 text-xs text-ink" onClick={() => handleDecision(row.id, "reject")}>Reject</button>
        </div>
      ) : <span className="text-slate-400">No action</span>,
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
      <SectionCard title="Submit expense" subtitle="Capture receipts, convert currency, and start approval flow">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="w-full rounded-2xl border border-dashed border-slate-300 bg-mist px-4 py-4" type="file" accept="image/*,.pdf" onChange={async (e) => {
            const file = e.target.files?.[0];
            setForm({ ...form, receipt: file || null });
            setError("");
            setSuccess("");
            if (file) {
              try {
                await handleOcr(file);
              } catch (err) {
                setOcrPreview({ warning: err.response?.data?.message || "OCR could not read this receipt. You can still enter the fields manually." });
              }
            }
          }} />
          {ocrPreview ? (
            <div className="rounded-2xl bg-shell p-4 text-sm text-slate-600">
              OCR: {ocrPreview.merchantName || "Unknown merchant"} | amount {ocrPreview.amount || "n/a"} | date {ocrPreview.date || "n/a"}
              {ocrPreview.warning ? <div className="mt-2 text-amber-700">{ocrPreview.warning}</div> : null}
            </div>
          ) : null}
          {error ? <div className="rounded-2xl bg-rose/35 p-4 text-sm text-rose-900">{error}</div> : null}
          {success ? <div className="rounded-2xl bg-sage/35 p-4 text-sm text-ink">{success}</div> : null}
          <button className="w-full rounded-2xl bg-ink px-4 py-3 text-white">Submit expense</button>
        </form>
      </SectionCard>

      <SectionCard title="Expense feed" subtitle="View your submissions and approval actions">
        <DataTable columns={columns} rows={expenses} />
      </SectionCard>
    </div>
  );
}
