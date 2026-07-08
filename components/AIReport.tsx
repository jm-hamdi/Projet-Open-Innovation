"use client";

import { FileText } from "lucide-react";
import { Report } from "@/types";

type Props = { report: Report };

const sections: { key: keyof Report; label: string }[] = [
  { key: "resume",    label: "Résumé" },
  { key: "analyse",   label: "Analyse" },
  { key: "hypothese", label: "Hypothèse principale" },
  { key: "priorite",  label: "Priorité d'action" },
];

export default function AIReport({ report }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="w-7 h-7 rounded-md bg-blue-700 flex items-center justify-center shrink-0">
          <FileText size={14} strokeWidth={1.75} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Rapport IA</h2>
          <p className="text-xs text-slate-400">
            Généré le 8 juillet 2026 à 09:32
          </p>
        </div>
      </div>

      <div className="border-l-2 border-blue-700 pl-5 space-y-5">
        {sections.map(({ key, label }) => (
          <div key={key}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              {label}
            </p>
            <p className={`text-sm text-slate-700 leading-relaxed ${key === "priorite" ? "font-medium text-slate-800" : ""}`}>
              {report[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
