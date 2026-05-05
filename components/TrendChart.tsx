"use client";

import { DailyMetric } from "@/types";

type Props = {
  data: DailyMetric[];
};

function MiniBarChart({
  values,
  color,
  max,
}: {
  values: { date: string; value: number }[];
  color: string;
  max: number;
}) {
  return (
    <div className="flex items-end gap-1 h-20">
      {values.map((item, i) => {
        const height = Math.max(4, (item.value / max) * 80);
        const isLast = i === values.length - 1;
        return (
          <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className={`w-full rounded-t transition-all ${isLast ? "opacity-70" : ""} ${color}`}
              style={{ height: `${height}px` }}
            />
            <div className="absolute bottom-[-22px] text-[9px] text-gray-400 whitespace-nowrap hidden group-hover:block bg-white border border-gray-200 px-1 rounded shadow-sm z-10">
              {item.date}: {item.value.toLocaleString("fr-FR")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TrendChart({ data }: Props) {
  const revenueValues = data.map((d) => ({ date: d.date, value: d.revenue }));
  const visitorValues = data.map((d) => ({ date: d.date, value: d.visitors }));
  const maxRevenue = Math.max(...revenueValues.map((v) => v.value)) * 1.1;
  const maxVisitors = Math.max(...visitorValues.map((v) => v.value)) * 1.1;

  const dates = data.map((d) => d.date);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Tendances — 14 derniers jours</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">Évolution du chiffre d&apos;affaires</p>
          <MiniBarChart values={revenueValues} color="bg-indigo-400" max={maxRevenue} />
          <div className="flex justify-between mt-6">
            {dates.filter((_, i) => i % 3 === 0 || i === dates.length - 1).map((d) => (
              <span key={d} className="text-[9px] text-gray-400">{d}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-3">Évolution du trafic</p>
          <MiniBarChart values={visitorValues} color="bg-violet-400" max={maxVisitors} />
          <div className="flex justify-between mt-6">
            {dates.filter((_, i) => i % 3 === 0 || i === dates.length - 1).map((d) => (
              <span key={d} className="text-[9px] text-gray-400">{d}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-400"></div>
          <span className="text-xs text-gray-500">Chiffre d&apos;affaires (€)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-violet-400"></div>
          <span className="text-xs text-gray-500">Visiteurs</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-2 h-2 rounded bg-gray-300 opacity-60"></div>
          <span className="text-xs text-gray-400">Dernière journée analysée</span>
        </div>
      </div>
    </div>
  );
}
