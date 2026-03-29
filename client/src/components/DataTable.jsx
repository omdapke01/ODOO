export default function DataTable({ columns, rows }) {
  if (!rows?.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-sm text-slate-500">
        No records yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-100">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/90">
            <tr className="text-slate-500">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-4 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((row, index) => (
              <tr key={row.id || index} className="border-t border-slate-100 transition hover:bg-shell/45">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top text-slate-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
