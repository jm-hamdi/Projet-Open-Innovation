"use client";

type Props = {
  company: string;
  period: string;
};

export default function DashboardHeader({ company, period }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Ops Co-pilot</h1>
        </div>
        <p className="text-sm text-gray-500 ml-11">
          Votre copilote intelligent pour suivre, comprendre et améliorer vos performances.
        </p>
      </div>
      <div className="flex flex-col items-start md:items-end gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-semibold text-gray-800">{company}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Période analysée : {period}
        </span>
      </div>
    </div>
  );
}
