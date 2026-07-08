"use client";

import { Segment } from "@/types";
import { formatCurrency, formatPercent, formatConversion } from "@/lib/format";
import Badge from "@/components/Badge";
import type { BadgeVariant } from "@/components/Badge";

const statusVariant: Record<Segment["status"], BadgeVariant> = {
  "En baisse":   "danger",
  "Stable":      "neutral",
  "En hausse":   "success",
  "À surveiller": "warning",
};

type Props = { segments: Segment[] };

export default function SegmentTable({ segments }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Segments impactés</h2>
        <p className="text-xs text-slate-400 mt-0.5">Répartition des performances par canal et géographie</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Segment</th>
              <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-3 px-4">CA du jour</th>
              <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-3 px-4">Variation</th>
              <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-3 px-4">Conversion</th>
              <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wide pb-3 pl-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((seg) => (
              <tr key={seg.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 pr-4 font-medium text-slate-800 text-xs">{seg.name}</td>
                <td className="py-3 px-4 text-right font-semibold text-slate-700 tabular-nums">{formatCurrency(seg.revenue)}</td>
                <td className={`py-3 px-4 text-right font-semibold tabular-nums ${seg.variation < 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {formatPercent(seg.variation, 0)}
                </td>
                <td className="py-3 px-4 text-right text-slate-500 tabular-nums">{formatConversion(seg.conversionRate)}</td>
                <td className="py-3 pl-4 text-right">
                  <Badge variant={statusVariant[seg.status]}>{seg.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
