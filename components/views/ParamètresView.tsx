"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

type Props = { companyName: string };

export default function ParamètresView({ companyName }: Props) {
  const [name, setName]           = useState(companyName);
  const [revenueThreshold, setRT] = useState("-20");
  const [visitorsThreshold, setVT] = useState("-15");
  const [langue, setLangue]       = useState("Français");
  const [saved, setSaved]         = useState(false);

  // Sync when company changes
  useEffect(() => { setName(companyName); }, [companyName]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-lg">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-900">Paramètres</h2>
        <p className="text-xs text-slate-400 mt-0.5">Configurez les préférences de votre tableau de bord</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {/* Company */}
        <div className="p-5">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Entreprise</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nom de l&apos;entreprise</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Langue</label>
              <select
                value={langue}
                onChange={(e) => setLangue(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition cursor-pointer"
              >
                <option>Français</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert thresholds */}
        <div className="p-5">
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Seuils d&apos;alerte</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Seuil critique chiffre d&apos;affaires (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={revenueThreshold}
                  onChange={(e) => setRT(e.target.value)}
                  min="-50"
                  max="-5"
                  className="w-28 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition tabular-nums"
                />
                <span className="text-xs text-slate-400">Déclenche une alerte Critique</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Seuil visiteurs (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={visitorsThreshold}
                  onChange={(e) => setVT(e.target.value)}
                  min="-50"
                  max="-5"
                  className="w-28 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition tabular-nums"
                />
                <span className="text-xs text-slate-400">Déclenche une alerte Attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="p-5 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
          >
            Enregistrer
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle size={13} strokeWidth={2} />
              Préférences enregistrées
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
