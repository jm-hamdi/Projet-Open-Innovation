"use client";

import { DataSource } from "@/types";

const sources: DataSource[] = [
  { name: "Paiement", icon: "💳", status: "Connecté", lastSync: "Dernière synchronisation : aujourd'hui à 09:15" },
  { name: "Analytics web", icon: "📊", status: "Connecté", lastSync: "Dernière synchronisation : aujourd'hui à 09:10" },
  { name: "CRM", icon: "👥", status: "Synchronisation récente", lastSync: "Dernière synchronisation : hier à 23:45" },
  { name: "Support client", icon: "💬", status: "À configurer", lastSync: "Non synchronisé" },
];

const statusConfig = {
  "Connecté": { badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
  "À configurer": { badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  "Synchronisation récente": { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
};

export default function DataSourceCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Sources connectées</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sources.map((source) => {
          const config = statusConfig[source.status];
          return (
            <div key={source.name} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
              <div className="text-2xl mb-3">{source.icon}</div>
              <p className="text-sm font-semibold text-gray-800 mb-2">{source.name}</p>
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${config.badge}`}>
                  {source.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{source.lastSync}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
