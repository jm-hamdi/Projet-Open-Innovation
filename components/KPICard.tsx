"use client";

import { CreditCard, ShoppingCart, Users, Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { KPI } from "@/types";
import { formatPercent } from "@/lib/format";
import Badge from "@/components/Badge";
import type { BadgeVariant } from "@/components/Badge";

const statusConfig: Record<
  KPI["status"],
  { variant: BadgeVariant; label: string; trendColor: string; Icon: typeof TrendingUp | typeof TrendingDown | typeof Minus }
> = {
  stable: { variant: "neutral",  label: "Stable",    trendColor: "text-slate-500", Icon: Minus },
  hausse: { variant: "success",  label: "En hausse", trendColor: "text-emerald-600", Icon: TrendingUp },
  baisse: { variant: "warning",  label: "En baisse", trendColor: "text-amber-600", Icon: TrendingDown },
  alerte: { variant: "danger",   label: "Alerte",    trendColor: "text-red-600", Icon: TrendingDown },
};

const kpiIcons: Record<string, typeof CreditCard> = {
  "Chiffre d'affaires": CreditCard,
  "Commandes": ShoppingCart,
  "Visiteurs": Users,
  "Taux de conversion": Target,
  "Panier moyen": TrendingUp,
};

type Props = { kpi: KPI };

export default function KPICard({ kpi }: Props) {
  const config = statusConfig[kpi.status];
  const KpiIcon = kpiIcons[kpi.label] ?? CreditCard;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-slate-300 hover:shadow-md transition-all cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <KpiIcon size={15} strokeWidth={1.75} className="text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-slate-900 tabular-nums">{kpi.value}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <config.Icon size={13} strokeWidth={2} className={config.trendColor} />
        <span className={`text-sm font-semibold tabular-nums ${config.trendColor}`}>
          {formatPercent(kpi.change)}
        </span>
        <span className="text-xs text-slate-400">vs moy. {kpi.previousAverage}</span>
      </div>
    </div>
  );
}
