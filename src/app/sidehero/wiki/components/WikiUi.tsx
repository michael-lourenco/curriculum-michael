import { ReactNode } from 'react';

interface WikiSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function WikiSection({ id, title, children }: WikiSectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-[#e94560] mb-4 border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

interface WikiTableProps {
  headers: string[];
  rows: (string | number)[][];
}

export function WikiTable({ headers, rows }: WikiTableProps) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full text-sm border border-border rounded-lg overflow-hidden">
        <thead className="bg-surface-hover">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-3 py-2 text-left font-semibold text-text-primary border-b border-border"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-surface' : 'bg-surface-hover/50'}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-3 py-2 text-text-secondary border-b border-border align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FormulaBlock({ children }: { children: string }) {
  return <pre className="formula-block">{children}</pre>;
}

export function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-hover border border-border rounded-xl p-4 mb-4 text-text-secondary">
      {children}
    </div>
  );
}
