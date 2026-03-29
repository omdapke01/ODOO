export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
