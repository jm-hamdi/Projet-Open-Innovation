"use client";

import { Plus } from "lucide-react";
import DataSourceCard, { SourceItem } from "@/components/DataSourceCard";

type Props = {
  onManage: (source: SourceItem) => void;
};

export default function SourcesView({ onManage }: Props) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-0.5">Sources connectées</h2>
        <p className="text-xs text-slate-400 mb-4">
          Gérez les connexions aux sources de données externes. Cliquez sur &quot;Gérer&quot; pour configurer chaque source.
        </p>
        <DataSourceCard onManage={onManage} />
      </div>

      <div>
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm cursor-not-allowed w-full justify-center hover:border-slate-400 transition-colors"
          title="Disponible prochainement"
        >
          <Plus size={15} strokeWidth={1.75} />
          Ajouter une source
          <span className="ml-auto text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">Bientôt disponible</span>
        </button>
      </div>
    </div>
  );
}
