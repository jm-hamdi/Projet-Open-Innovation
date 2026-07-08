"use client";

import { DailyMetric, Alert, Report } from "@/types";
import { generateAIReport, detectAnomalies } from "@/utils/analytics";
import { maisonNovaMetrics } from "@/data/metrics";
import AIReport from "@/components/AIReport";
import Badge from "@/components/Badge";

type Props = {
  report: Report;
  data: DailyMetric[];
  alerts: Alert[];
};

function PreviousReport({ title, date, report }: { title: string; date: string; report: Report }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">Généré le {date}</p>
        </div>
        <Badge variant="neutral">Archivé</Badge>
      </div>
      <div className="border-l-2 border-slate-200 pl-4 space-y-4">
        {(["resume", "analyse", "hypothese", "priorite"] as const).map((key) => {
          const labels: Record<string, string> = {
            resume:    "Résumé",
            analyse:   "Analyse",
            hypothese: "Hypothèse principale",
            priorite:  "Priorité d'action",
          };
          return (
            <div key={key}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{labels[key]}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{report[key]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Generate previous reports from older slices of the dataset
const prev7Data    = maisonNovaMetrics.slice(0, -7);
const prev7Alerts  = detectAnomalies(prev7Data);
const report7Days  = generateAIReport(prev7Data, prev7Alerts);

const prev14Data   = maisonNovaMetrics.slice(0, -14);
const prev14Alerts = detectAnomalies(prev14Data);
const report14Days = generateAIReport(prev14Data, prev14Alerts);

export default function RapportsView({ report, alerts }: Props) {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-0.5">Rapport actuel</h2>
        <p className="text-xs text-slate-400 mb-4">Basé sur les données de la période sélectionnée</p>
        <AIReport report={report} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-0.5">Rapports précédents</h2>
        <p className="text-xs text-slate-400 mb-4">Historique des analyses automatisées</p>
        <div className="space-y-4">
          <PreviousReport
            title="Rapport du 28 avr. 2026"
            date="28 avril 2026 à 09:31"
            report={report7Days}
          />
          <PreviousReport
            title="Rapport du 21 avr. 2026"
            date="21 avril 2026 à 09:28"
            report={report14Days}
          />
        </div>
      </div>
    </div>
  );
}
