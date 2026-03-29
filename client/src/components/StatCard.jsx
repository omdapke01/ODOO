export default function StatCard({ title, value, tone = "sage" }) {
  const tones = {
    sage: "from-sage/50 to-white",
    ocean: "from-ocean/40 to-white",
    rose: "from-rose/45 to-white",
    clay: "from-clay/45 to-white",
  };

  return (
    <div className={`rounded-3xl border border-white/70 bg-gradient-to-br ${tones[tone]} p-5 shadow-soft`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
