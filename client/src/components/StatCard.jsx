export default function StatCard({ title, value, tone = "sage" }) {
  const tones = {
    sage: "from-sage/40 via-white to-white",
    ocean: "from-ocean/35 via-white to-white",
    rose: "from-rose/35 via-white to-white",
    clay: "from-clay/40 via-white to-white",
  };

  return (
    <div className={`rounded-[1.75rem] border border-white/70 bg-gradient-to-br ${tones[tone]} p-5 shadow-panel`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-ink">{value}</p>
    </div>
  );
}
