"use client";

import { CheckCircle } from "lucide-react";
import { Recommendation } from "@/types";
import Badge from "@/components/Badge";
import type { BadgeVariant } from "@/components/Badge";

const priorityVariant: Record<Recommendation["priority"], BadgeVariant> = {
  Haute:   "danger",
  Moyenne: "warning",
  Faible:  "neutral",
};

const effortVariant: Record<Recommendation["effort"], BadgeVariant> = {
  Faible: "success",
  Moyen:  "info",
  Élevé:  "danger",
};

type Props = {
  rec: Recommendation;
  treated?: boolean;
  onTreat?: () => void;
  onViewDetail?: () => void;
};

export default function RecommendationCard({ rec, treated = false, onTreat, onViewDetail }: Props) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col hover:border-slate-300 hover:shadow-md transition-all cursor-default ${
        treated ? "border-slate-100 opacity-60" : "border-slate-200"
      }`}
    >
      {treated && (
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle size={13} strokeWidth={1.75} className="text-emerald-500" />
          <Badge variant="success">Traité</Badge>
        </div>
      )}

      <h3 className={`text-sm font-semibold text-slate-900 mb-3 leading-snug ${treated ? "line-through text-slate-400" : ""}`}>
        {rec.title}
      </h3>

      {!treated && (
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={priorityVariant[rec.priority]}>Priorité {rec.priority}</Badge>
          <Badge variant={effortVariant[rec.effort]}>Effort {rec.effort}</Badge>
        </div>
      )}

      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{rec.explanation}</p>

      <div className="pt-3 border-t border-slate-100">
        <p className="text-xs font-medium text-blue-700 mb-3">
          Impact estimé : {rec.impact}
        </p>
        <div className="flex items-center gap-2">
          {!treated && (
            <button
              onClick={onTreat}
              className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Marquer comme traité
            </button>
          )}
          <button
            onClick={onViewDetail}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline ml-auto transition-colors cursor-pointer"
          >
            Voir le détail →
          </button>
        </div>
      </div>
    </div>
  );
}
