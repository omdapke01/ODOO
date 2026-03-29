import { useEffect, useState } from "react";
import http from "../api/http";
import DataTable from "../components/DataTable";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";

const emptyUser = { name: "", email: "", password: "", role: "EMPLOYEE", managerId: "" };

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);

  async function loadUsers() {
    const response = await http.get("/users");
    setUsers(response.data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await http.post("/users", { ...form, managerId: form.managerId || null });
    setForm(emptyUser);
    await loadUsers();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.3fr]">
      <SectionCard title="Team setup" subtitle="Create managers and employees within the current company">
        {user?.role === "ADMIN" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
              <option value="">No manager</option>
              {users.filter((member) => member.role === "MANAGER").map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
            <button className="w-full rounded-2xl bg-ink px-4 py-3 text-white">Add user</button>
          </form>
        ) : <p className="rounded-2xl bg-shell p-4 text-sm text-slate-600">Only admins can create users.</p>}
      </SectionCard>

      <SectionCard title="People" subtitle="Current company members and manager links">
        <DataTable columns={[{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "role", label: "Role" }, { key: "managerId", label: "Manager" }]} rows={users} />
      </SectionCard>
    </div>
  );
}
