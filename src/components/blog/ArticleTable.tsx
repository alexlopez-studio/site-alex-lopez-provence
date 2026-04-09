interface Column { key: string; label: string; highlight?: boolean }
interface Row { [key: string]: string }

export default function ArticleTable({ columns, rows }: { columns: Column[]; rows: Row[] }) {
  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="bg-foreground">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3.5 text-[13px] font-bold text-white">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={'border-t border-border ' + (i % 2 === 0 ? 'bg-white' : 'bg-surface')}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={'px-5 py-4 ' + (col.highlight ? 'font-bold text-foreground' : 'text-muted')}
                >
                  {col.highlight ? (
                    <span className="inline-block rounded-md bg-brand-light px-2.5 py-0.5 font-bold text-foreground">
                      {row[col.key]}
                    </span>
                  ) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
