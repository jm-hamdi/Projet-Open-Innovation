"use client";

import { AlertTriangle, AlertCircle, TrendingUp } from "lucide-react";
import { Alert } from "@/types";
import Badge from "@/components/Badge";
import type { BadgeVariant } from "@/components/Badge";

const severityConfig: Record<
  Alert["severity"],
  { variant: BadgeVariant; Icon: typeof AlertTriangle; iconClass: string }
> = {
  Critique:    { variant: "danger",      Icon: AlertTriangle, iconClass: "text-red-500" },
  Attention:   { variant: "warning",     Icon: AlertCircle,  iconClass: "text-amber-500" },
  Opportunité: { variant: "opportunity", Icon: TrendingUp,   iconClass: "text-teal-500" },
};

type Props = { alert: Alert };

export default function AlertCard({ alert }: Props) {
  const { variant, Icon, iconClass } = severityConfig[alert.severity];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className={`mt-0.5 shrink-0 ${iconClass}`}>
        <Icon size={15} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge variant={variant}>{alert.severity}</Badge>
          <span className="text-xs font-medium text-slate-700">{alert.metric}</span>
          <span className="ml-auto text-[10px] text-slate-400">{alert.confidence} % confiance</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{alert.explanation}</p>
        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
          <span>
            <span className="font-medium text-slate-500">Impact : </span>
            {alert.impact}
          </span>
          <span>
            <span className="font-medium text-slate-500">Segment : </span>
            {alert.segment}
          </span>
        </div>
      </div>
    </div>
  );
}
