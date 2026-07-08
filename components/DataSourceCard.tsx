"use client";

import { CreditCard, BarChart3, Users, MessageSquare } from "lucide-react";
import Badge from "@/components/Badge";
import type { BadgeVariant } from "@/components/Badge";

export type SourceItem = {
  id: string;
  name: string;
  Icon: typeof CreditCard;
  status: "Connecté" | "À configurer" | "Synchronisation récente";
  lastSync: string;
  syncHistory: string[];
};

export const dataSources: SourceItem[] = [
  {
    id: "paiement",
    name: "Paiement",
    Icon: CreditCard,
    status: "Connecté",
    lastSync: "Synchronisé à 09h15",
    syncHistory: ["09h15", "08h15", "07h15", "06h15"],
  },
  {
    id: "analytics",
    name: "Analytics web",
    Icon: BarChart3,
    status: "Connecté",
    lastSync: "Synchronisé à 09h10",
    syncHistory: ["09h10", "08h10", "07h10", "06h10"],
  },
  {
    id: "crm",
    name: "CRM",
    Icon: Users,
    status: "Synchronisation récente",
    lastSync: "Synchronisé hier à 23h45",
    syncHistory: ["23h45 (hier)", "12h00 (hier)", "08h30 (avant-hier)"],
  },
  {
    id: "support",
    name: "Support client",
    Icon: MessageSquare,
    status: "À configurer",
    lastSync: "Non synchronisé",
    syncHistory: [],
  },
];

const statusConfig: Record<SourceItem["status"], { variant: BadgeVariant; dot: string }> = {
  "Connecté":               { variant: "success", dot: "bg-emerald-500" },
  "À configurer":           { variant: "neutral", dot: "bg-slate-300" },
  "Synchronisation récente": { variant: "info",    dot: "bg-sky-400" },
};

type Props = {
  onManage?: (source: SourceItem) => void;
};

export default function DataSourceCard({ onManage }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Sources connectées</h2>
        <p className="text-xs text-slate-400 mt-0.5">Synchronisation des données en temps réel</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {dataSources.map((source) => {
          const { variant, dot } = statusConfig[source.status];
          return (
            <div
              key={source.id}
              className="border border-slate-100 rounded-lg p-4 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <source.Icon size={17} strokeWidth={1.75} className="text-slate-400" />
                <button
                  onClick={() => onManage?.(source)}
                  className="text-[10px] text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Gérer
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-800 mb-2">{source.name}</p>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                <Badge variant={variant}>{source.status}</Badge>
              </div>
              <p className="text-[10px] text-slate-400">{source.lastSync}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
