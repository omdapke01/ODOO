export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="panel p-6 md:p-7">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Section</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm leading-7 text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
