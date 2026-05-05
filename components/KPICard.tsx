"use client";

import { KPI } from "@/types";

const statusConfig = {
  stable: {
    badge: "bg-gray-100 text-gray-600",
    label: "Stable",
    trend: "text-gray-500",
    border: "border-gray-200",
    icon: "→",
  },
  hausse: {
    badge: "bg-green-100 text-green-700",
    label: "En hausse",
    trend: "text-green-600",
    border: "border-green-200",
    icon: "↑",
  },
  baisse: {
    badge: "bg-orange-100 text-orange-700",
    label: "En baisse",
    trend: "text-orange-600",
    border: "border-orange-200",
    icon: "↓",
  },
  alerte: {
    badge: "bg-red-100 text-red-700",
    label: "Alerte",
    trend: "text-red-600",
    border: "border-red-200",
    icon: "↓",
  },
};

type Props = { kpi: KPI };

export default function KPICard({ kpi }: Props) {
  const config = statusConfig[kpi.status];
  const sign = kpi.change > 0 ? "+" : "";

  return (
    <div className={`bg-white rounded-xl border ${config.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.label}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
          {config.label}
        </span>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${config.trend}`}>
          {config.icon} {sign}{kpi.change.toFixed(1)} %
        </span>
        <span className="text-xs text-gray-400">vs moy. {kpi.previousAverage}</span>
      </div>
    </div>
  );
}
