"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, RefreshCw, Menu } from "lucide-react";

export type CompanyId = "maison-nova" | "atelier-sud" | "boutique-lumen";
export type Period = 7 | 14 | 30;

const COMPANIES: { id: CompanyId; name: string }[] = [
  { id: "maison-nova",    name: "Maison Nova" },
  { id: "atelier-sud",   name: "Atelier Sud" },
  { id: "boutique-lumen", name: "Boutique Lumen" },
];

type Props = {
  company: CompanyId;
  companyName: string;
  setCompany: (c: CompanyId) => void;
  period: Period;
  setPeriod: (p: Period) => void;
  refreshMinutes: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onMobileMenu?: () => void;
};

export default function TopBar({
  company,
  companyName,
  setCompany,
  period,
  setPeriod,
  refreshMinutes,
  isRefreshing,
  onRefresh,
  onMobileMenu,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const refreshLabel =
    refreshMinutes === 0 ? "À l'instant" :
    refreshMinutes === 1 ? "Actualisé il y a 1 min" :
    `Actualisé il y a ${refreshMinutes} min`;

  const periods: Period[] = [7, 14, 30];
  const periodLabel: Record<Period, string> = { 7: "7 j", 14: "14 j", 30: "30 j" };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
      <button
        className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={onMobileMenu}
      >
        <Menu size={18} strokeWidth={1.75} />
      </button>

      {/* Company dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          {companyName}
          <ChevronDown
            size={13}
            strokeWidth={2}
            className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
            {COMPANIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCompany(c.id); setDropdownOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                  company === c.id
                    ? "text-blue-700 font-medium bg-blue-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Period segmented control */}
      <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
        {periods.map((p, i) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              period === p
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-50"
            } ${i > 0 ? "border-l border-slate-200" : ""}`}
          >
            {periodLabel[p]}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Actualiser les données"
        >
          <RefreshCw
            size={11}
            strokeWidth={2}
            className={isRefreshing ? "animate-spin" : ""}
          />
          {refreshLabel}
        </button>

        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0 cursor-pointer">
          <span className="text-white text-xs font-semibold">JM</span>
        </div>
      </div>
    </header>
  );
}
