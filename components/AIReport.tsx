"use client";

import { Report } from "@/types";

type Props = { report: Report };

export default function AIReport({ report }: Props) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">IA</span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">Rapport IA</h2>
          <p className="text-xs text-indigo-400">Analyse automatisée — {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/70 rounded-lg p-4 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Résumé</p>
          <p className="text-sm text-gray-700 leading-relaxed">{report.resume}</p>
        </div>
        <div className="bg-white/70 rounded-lg p-4 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Analyse</p>
          <p className="text-sm text-gray-700 leading-relaxed">{report.analyse}</p>
        </div>
        <div className="bg-white/70 rounded-lg p-4 border border-indigo-100">
          <p className="text-xs font-bold text-violet-600 uppercase mb-2">Hypothèse principale</p>
          <p className="text-sm text-gray-700 leading-relaxed">{report.hypothese}</p>
        </div>
        <div className="bg-indigo-600/10 rounded-lg p-4 border border-indigo-200">
          <p className="text-xs font-bold text-indigo-700 uppercase mb-2">Priorité</p>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{report.priorite}</p>
        </div>
      </div>
    </div>
  );
}
