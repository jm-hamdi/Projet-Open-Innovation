"use client";

import { useState } from "react";
import { DailyMetric } from "@/types";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";

type Props = { data: DailyMetric[] };

function BarChart({ values, avgValue }: { values: { date: string; value: number }[]; avgValue: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const max = Math.max(...values.map((v) => v.value)) * 1.15;
  const avgHeight = Math.max(4, (avgValue / max) * 80);

  return (
    <div className="relative">
      <div className="flex items-end gap-1 h-20 relative">
        {/* Average dashed line */}
        <div
          className="absolute inset-x-0 border-t border-dashed border-slate-300 pointer-events-none"
          style={{ bottom: `${avgHeight}px` }}
        />
        {values.map((item, i) => {
          const height = Math.max(4, (item.value / max) * 80);
          const isLast = i === values.length - 1;
          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center relative"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`w-full rounded-t transition-colors ${isLast ? "bg-blue-700" : "bg-slate-200 hover:bg-slate-300"}`}
                style={{ height: `${height}px` }}
              />
              {hoveredIndex === i && (
                <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                  {formatDate(item.date)} : {formatCurrency(item.value)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Avg label */}
      <div
        className="absolute right-0 text-[9px] text-slate-400 pointer-events-none"
        style={{ bottom: `${avgHeight + 2}px` }}
      >
        Moy. 7 j
      </div>
    </div>
  );
}

function LineAreaChart({ values, avgValue }: { values: { date: string; value: number }[]; avgValue: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const W = 400;
  const H = 80;
  const padL = 4;
  const padR = 40;
  const padT = 8;
  const padB = 4;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const min = Math.min(...values.map((v) => v.value)) * 0.92;
  const max = Math.max(...values.map((v) => v.value)) * 1.08;

  const xOf = (i: number) => padL + (i / (values.length - 1)) * innerW;
  const yOf = (v: number) => H - padB - ((v - min) / (max - min)) * innerH;

  const polyPoints = values.map((v, i) => `${xOf(i)},${yOf(v.value)}`).join(" ");
  const areaPoints =
    `${xOf(0)},${H - padB} ` + polyPoints + ` ${xOf(values.length - 1)},${H - padB}`;

  const avgY = yOf(avgValue);
  const lastX = xOf(values.length - 1);
  const lastY = yOf(values[values.length - 1].value);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 80 }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon points={areaPoints} fill="url(#areaFill)" />

        {/* Avg dashed line */}
        <line
          x1={padL} y1={avgY} x2={W - padR} y2={avgY}
          stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3"
        />
        <text x={W - padR + 3} y={avgY + 3} fontSize="8" fill="#94a3b8">
          Moy. 7 j
        </text>

        <polyline
          points={polyPoints}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Hover hit areas */}
        {values.map((v, i) => (
          <rect
            key={i}
            x={xOf(i) - innerW / values.length / 2}
            y={padT}
            width={innerW / values.length}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHoveredIndex(i)}
          />
        ))}

        {/* Hover dot */}
        {hoveredIndex !== null && (
          <circle
            cx={xOf(hoveredIndex)}
            cy={yOf(values[hoveredIndex].value)}
            r="3.5"
            fill="#0ea5e9"
            stroke="white"
            strokeWidth="1.5"
          />
        )}

        {/* Last point marker */}
        <circle cx={lastX} cy={lastY} r="3.5" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute bottom-full mb-1.5 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none -translate-x-1/2"
          style={{ left: `${(hoveredIndex / (values.length - 1)) * 100}%` }}
        >
          {formatDate(values[hoveredIndex].date)} : {formatNumber(values[hoveredIndex].value)}
        </div>
      )}
    </div>
  );
}

export default function TrendChart({ data }: Props) {
  const revenueValues = data.map((d) => ({ date: d.date, value: d.revenue }));
  const visitorValues = data.map((d) => ({ date: d.date, value: d.visitors }));

  const avgRevenue = revenueValues.slice(-8, -1).reduce((s, v) => s + v.value, 0) / 7;
  const avgVisitors = visitorValues.slice(-8, -1).reduce((s, v) => s + v.value, 0) / 7;

  const dates = data.map((d) => d.date);
  const labelDates = dates.filter((_, i) => i % 3 === 0 || i === dates.length - 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-900">Tendances — 14 derniers jours</h2>
        <p className="text-xs text-slate-400 mt-0.5">Évolution des indicateurs clés sur la période</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-700" />
            <p className="text-xs font-medium text-slate-600">Chiffre d&apos;affaires (€)</p>
            <span className="ml-auto text-[10px] text-slate-400">Aujourd&apos;hui : {formatCurrency(revenueValues[revenueValues.length - 1].value)}</span>
          </div>
          <BarChart values={revenueValues} avgValue={avgRevenue} />
          <div className="flex justify-between mt-5">
            {labelDates.map((d) => (
              <span key={d} className="text-[9px] text-slate-400">{formatDate(d)}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <p className="text-xs font-medium text-slate-600">Visiteurs</p>
            <span className="ml-auto text-[10px] text-slate-400">Aujourd&apos;hui : {formatNumber(visitorValues[visitorValues.length - 1].value)}</span>
          </div>
          <LineAreaChart values={visitorValues} avgValue={avgVisitors} />
          <div className="flex justify-between mt-5">
            {labelDates.map((d) => (
              <span key={d} className="text-[9px] text-slate-400">{formatDate(d)}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <div className="w-5 border-t border-dashed border-slate-300" />
          Moyenne 7 j
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-700" />
          Aujourd&apos;hui
        </span>
      </div>
    </div>
  );
}
