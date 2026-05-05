"use client";

import { Alert } from "@/types";

const severityConfig = {
  Critique: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: "⚠",
    iconColor: "text-red-500",
  },
  Attention: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    icon: "◉",
    iconColor: "text-orange-500",
  },
  Opportunité: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "↗",
    iconColor: "text-emerald-500",
  },
};

type Props = { alert: Alert };

export default function AlertCard({ alert }: Props) {
  const config = severityConfig[alert.severity];

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5`}>
      <div className="flex items-start gap-3">
        <span className={`text-lg mt-0.5 ${config.iconColor}`}>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
              {alert.severity}
            </span>
            <span className="text-xs font-medium text-gray-600">{alert.metric}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{alert.explanation}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-600">Impact :</span> {alert.impact}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-600">Segment :</span> {alert.segment}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-600">Confiance :</span> {alert.confidence} %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
