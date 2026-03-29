import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/expenses", label: "Expenses" },
  { to: "/users", label: "Users" },
  { to: "/rules", label: "Rules" },
];

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,184,217,0.26),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(214,191,168,0.22),_transparent_28%),linear-gradient(180deg,_#f8fbfd_0%,_#f7f2ed_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row">
        <aside className="w-full rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-72 md:flex md:flex-col">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">ReimburseFlow</p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">Expense Control</h1>
            <p className="mt-2 text-sm text-slate-500">Soft-theme workspace for approvals, reimbursements, and policy rules.</p>
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${isActive ? "bg-gradient-to-r from-sage/45 to-ocean/35 text-ink" : "text-slate-600 hover:bg-slate-100/80"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-3xl bg-shell p-4">
            <p className="text-sm font-medium text-ink">{user?.name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{user?.role}</p>
            <button type="button" className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-sm text-white" onClick={logout}>
              Sign out
            </button>
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
