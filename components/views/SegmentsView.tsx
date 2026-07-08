"use client";

import { Segment } from "@/types";
import SegmentTable from "@/components/SegmentTable";
import { formatCurrency, formatPercent, formatConversion } from "@/lib/format";

type Props = { segments: Segment[] };

export default function SegmentsView({ segments }: Props) {
  const topRevenue = [...segments].sort((a, b) => b.revenue - a.revenue)[0];
  const mostImpacted = [...segments].sort((a, b) => a.variation - b.variation)[0];
  const bestConversion = [...segments].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  const totalRevenue = segments.reduce((s, seg) => s + seg.revenue, 0);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Segment leader</p>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{topRevenue?.name}</p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">{formatCurrency(topRevenue?.revenue ?? 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Plus impacté</p>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{mostImpacted?.name}</p>
          <p className={`text-xs mt-1 tabular-nums font-semibold ${(mostImpacted?.variation ?? 0) < 0 ? "text-red-600" : "text-emerald-600"}`}>
            {formatPercent(mostImpacted?.variation ?? 0, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Meilleure conversion</p>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{bestConversion?.name}</p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">{formatConversion(bestConversion?.conversionRate ?? 0)}</p>
        </div>
      </div>

      {/* Full table */}
      <SegmentTable segments={segments} />

      {/* Breakdown note */}
      <div className="text-xs text-slate-400 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
        Total du CA segmenté : <span className="font-semibold text-slate-600 tabular-nums">{formatCurrency(totalRevenue)}</span>
        {" — "} correspond au chiffre d'affaires journalier total.
      </div>
    </div>
  );
}
