"use client";

import { Link2, TrendingUp, Target, Zap, FileText } from "lucide-react";
import Badge from "@/components/Badge";
import type { BadgeVariant } from "@/components/Badge";

const roadmapItems = [
  { Icon: Link2,      title: "Connexion avancée aux outils marketing", status: "Planifié" as const },
  { Icon: TrendingUp, title: "Prévision des ventes",                   status: "En cours" as const },
  { Icon: Target,     title: "Scoring des clients à risque",           status: "Planifié" as const },
  { Icon: Zap,        title: "Automatisation contrôlée des actions",   status: "Planifié" as const },
  { Icon: FileText,   title: "Rapports personnalisés par rôle",        status: "Planifié" as const },
];

const statusBadge: Record<"En cours" | "Planifié", BadgeVariant> = {
  "En cours": "info",
  "Planifié": "neutral",
};

export default function RoadmapSection() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Prochaines évolutions</h2>
        <p className="text-xs text-slate-400 mt-0.5">Fonctionnalités planifiées et en cours de développement</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
        {roadmapItems.map((item) => (
          <div key={item.title} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <item.Icon size={14} strokeWidth={1.75} className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-700 font-medium truncate">{item.title}</span>
            </div>
            <Badge variant={statusBadge[item.status]} className="ml-3 shrink-0">
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
