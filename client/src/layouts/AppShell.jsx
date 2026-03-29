import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", hint: "Overview and trends" },
  { to: "/expenses", label: "Expenses", hint: "Submissions and approvals" },
  { to: "/users", label: "Users", hint: "People and hierarchy" },
  { to: "/rules", label: "Rules", hint: "Approval logic" },
];

const pageMeta = {
  "/": { title: "Dashboard", subtitle: "Track spend, approval workload, and category movement." },
  "/expenses": { title: "Expenses", subtitle: "Capture receipts, review approvals, and keep submissions organized." },
  "/users": { title: "Users", subtitle: "Set up your team structure with a clearer view of roles." },
  "/rules": { title: "Rules", subtitle: "Define approval logic with simple, readable controls." },
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta["/"];

  return (
    <div className="min-h-screen bg-app-wash">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 md:px-6 lg:flex-row lg:py-6">
        <aside className="panel w-full p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80 lg:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">ReimburseFlow</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-ink">Expense control, simplified.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">A softer workspace for teams handling reimbursements, approvals, and policy checks.</p>
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 transition ${isActive ? "bg-gradient-to-r from-sage/40 to-ocean/30 text-ink shadow-panel" : "text-slate-600 hover:bg-white/70"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{link.label}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-ink" : "bg-slate-300"}`} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{link.hint}</p>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 rounded-[1.75rem] bg-shell/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
            <p className="mt-2 text-base font-semibold text-ink">{user?.name || "User"}</p>
            <p className="text-sm text-slate-500">{user?.role || "Member"}</p>
            <button type="button" className="button-primary mt-4 w-full" onClick={logout}>
              Sign out
            </button>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <header className="panel-soft mb-6 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-ink">{meta.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{meta.subtitle}</p>
              </div>
              <div className="badge-info">Calm theme active</div>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
