"use client";

import { LayoutDashboard, Bell, FileText, PieChart, Link2, Settings } from "lucide-react";

const navItems = [
  { id: "dashboard",  icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "alertes",    icon: Bell,            label: "Alertes" },
  { id: "rapports",   icon: FileText,        label: "Rapports" },
  { id: "segments",   icon: PieChart,        label: "Segments" },
  { id: "sources",    icon: Link2,           label: "Sources" },
  { id: "parametres", icon: Settings,        label: "Paramètres" },
];

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-200 shrink-0">
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-slate-200">
        <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
        <span className="text-sm font-semibold text-slate-900 leading-none">AI Ops Co-pilot</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={16} strokeWidth={1.75} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-semibold">JM</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">Jaouad M.</p>
            <p className="text-[10px] text-slate-400 truncate">Administrateur</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
