import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import http from "../api/http";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [data, setData] = useState({ totalExpenses: 0, pendingApprovals: 0, approvedExpenses: 0, users: 0, monthlyTrends: {}, categoryBreakdown: {} });

  useEffect(() => {
    http.get("/expenses/dashboard").then((response) => setData(response.data));
  }, []);

  const monthlyData = Object.entries(data.monthlyTrends || {}).map(([month, total]) => ({ month, total }));
  const categoryData = Object.entries(data.categoryBreakdown || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total spend" value={`₹${Number(data.totalExpenses || 0).toFixed(2)}`} tone="sage" />
        <StatCard title="Pending approvals" value={data.pendingApprovals || 0} tone="ocean" />
        <StatCard title="Approved expenses" value={data.approvedExpenses || 0} tone="clay" />
        <StatCard title="Users" value={data.users || 0} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Monthly trend" subtitle="Company expenses in base currency over time">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" radius={[14, 14, 0, 0]}>
                  {monthlyData.map((entry, index) => <Cell key={entry.month} fill={index % 2 === 0 ? "#8bb8d9" : "#95b8a7"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Category split" subtitle="Top categories by converted spend">
          <div className="space-y-4">
            {categoryData.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.name}</span>
                  <span>₹{Number(item.value).toFixed(2)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-gradient-to-r from-sage to-ocean" style={{ width: `${Math.min(100, (item.value / (data.totalExpenses || 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
