"use client";

import { Segment } from "@/types";

const segments: Segment[] = [
  { name: "Mobile / France / Paid Social", revenue: "620 €", variation: -28, conversion: "0,82 %", status: "En baisse" },
  { name: "Desktop / France / Organic", revenue: "740 €", variation: 2, conversion: "1,34 %", status: "Stable" },
  { name: "Mobile / Belgique / Direct", revenue: "280 €", variation: -12, conversion: "1,05 %", status: "À surveiller" },
  { name: "Desktop / Suisse / Email", revenue: "210 €", variation: 8, conversion: "1,61 %", status: "En hausse" },
];

const statusConfig = {
  "En baisse": "bg-red-100 text-red-700",
  "Stable": "bg-gray-100 text-gray-600",
  "En hausse": "bg-green-100 text-green-700",
  "À surveiller": "bg-orange-100 text-orange-700",
};

export default function SegmentTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Segments impactés</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-3 pr-4">Segment</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3 px-4">Chiffre d&apos;affaires</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3 px-4">Variation</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3 px-4">Conversion</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-3 pl-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((seg, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 pr-4 font-medium text-gray-800 text-xs">{seg.name}</td>
                <td className="py-3 px-4 text-right text-gray-700 font-semibold">{seg.revenue}</td>
                <td className={`py-3 px-4 text-right font-semibold ${seg.variation < 0 ? "text-red-600" : "text-green-600"}`}>
                  {seg.variation > 0 ? "+" : ""}{seg.variation} %
                </td>
                <td className="py-3 px-4 text-right text-gray-600">{seg.conversion}</td>
                <td className="py-3 pl-4 text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig[seg.status]}`}>
                    {seg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
