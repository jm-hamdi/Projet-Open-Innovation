"use client";

import { Recommendation } from "@/types";

const priorityConfig = {
  Haute: "bg-red-100 text-red-700",
  Moyenne: "bg-orange-100 text-orange-700",
  Faible: "bg-gray-100 text-gray-600",
};

const effortConfig = {
  Faible: "bg-green-100 text-green-700",
  Moyen: "bg-yellow-100 text-yellow-700",
  Élevé: "bg-red-100 text-red-700",
};

type Props = { rec: Recommendation };

export default function RecommendationCard({ rec }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 leading-snug">{rec.title}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityConfig[rec.priority]}`}>
          Priorité {rec.priority}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${effortConfig[rec.effort]}`}>
          Effort {rec.effort}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">{rec.explanation}</p>
      <div className="pt-3 border-t border-gray-100">
        <span className="text-xs font-medium text-indigo-600">Impact estimé : {rec.impact}</span>
      </div>
    </div>
  );
}
