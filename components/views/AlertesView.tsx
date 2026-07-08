"use client";

import { AlertTriangle, AlertCircle, TrendingUp, CheckCircle } from "lucide-react";
import { Alert } from "@/types";
import AlertCard from "@/components/AlertCard";
import Badge from "@/components/Badge";

const historicalAlerts: (Omit<Alert, "id"> & { id: string; date: string; resolved: true })[] = [
  {
    id: "hist-1",
    date: "2 mai 2026",
    severity: "Attention",
    metric: "Taux de conversion",
    explanation: "Le taux de conversion mobile a chuté de 12,3 % pendant 2 jours consécutifs, signalant une friction dans le parcours d'achat.",
    impact: "Perte estimée de 6 à 9 commandes",
    segment: "Mobile / France / Paid Social",
    confidence: 80,
    resolved: true,
  },
  {
    id: "hist-2",
    date: "15 avr. 2026",
    severity: "Critique",
    metric: "Chiffre d'affaires",
    explanation: "Baisse de 23,8 % du CA journalier suite à une interruption partielle du système de paiement en ligne entre 10h et 14h.",
    impact: "−23,8 % de revenus journaliers",
    segment: "Tous segments",
    confidence: 95,
    resolved: true,
  },
  {
    id: "hist-3",
    date: "8 avr. 2026",
    severity: "Opportunité",
    metric: "Panier moyen",
    explanation: "Hausse de 11,2 % du panier moyen sur le segment Desktop Organic, portée par une campagne email ciblant les clients premium.",
    impact: "+11,2 % sur la valeur par transaction",
    segment: "Desktop / France / Organic",
    confidence: 83,
    resolved: true,
  },
];

const severityIcon = {
  Critique:    { Icon: AlertTriangle, cls: "text-red-500" },
  Attention:   { Icon: AlertCircle,  cls: "text-amber-500" },
  Opportunité: { Icon: TrendingUp,   cls: "text-teal-500" },
};

type Props = { alerts: Alert[] };

export default function AlertesView({ alerts }: Props) {
  const activeAlerts = alerts.filter((a) => a.id !== "alert-stable");

  return (
    <div className="max-w-2xl space-y-6">
      {/* Active */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Alertes actives</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeAlerts.length === 0
              ? "Aucune alerte active — tous les indicateurs sont dans la norme."
              : `${activeAlerts.length} alerte${activeAlerts.length > 1 ? "s" : ""} en cours`}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          {activeAlerts.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600">
              <CheckCircle size={14} strokeWidth={1.75} />
              Activité stable — aucun signal critique détecté.
            </div>
          ) : (
            activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          )}
        </div>
      </section>

      {/* Historical */}
      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Historique des alertes</h2>
          <p className="text-xs text-slate-400 mt-0.5">Alertes résolues des 30 derniers jours</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-50">
          {historicalAlerts.map((alert) => {
            const { Icon, cls } = severityIcon[alert.severity];
            return (
              <div key={alert.id} className="flex items-start gap-3 p-4">
                <Icon size={14} strokeWidth={1.75} className={`mt-0.5 shrink-0 ${cls}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium text-slate-700">{alert.metric}</span>
                    <Badge variant="neutral">{alert.date}</Badge>
                    <Badge variant="success" className="ml-auto">Résolu</Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{alert.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
