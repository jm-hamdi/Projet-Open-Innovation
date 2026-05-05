"use client";

const roadmapItems = [
  { icon: "🔗", title: "Connexion avancée aux outils marketing", status: "Planifié" },
  { icon: "📈", title: "Prévision des ventes", status: "En cours" },
  { icon: "🎯", title: "Scoring des clients à risque", status: "Planifié" },
  { icon: "⚡", title: "Automatisation contrôlée des actions", status: "Roadmap" },
  { icon: "📋", title: "Rapports personnalisés par rôle", status: "Roadmap" },
];

const statusBadge: Record<string, string> = {
  "En cours": "bg-indigo-100 text-indigo-700",
  "Planifié": "bg-blue-50 text-blue-600",
  "Roadmap": "bg-gray-100 text-gray-500",
};

export default function RoadmapSection() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Prochaines évolutions</h2>
      <div className="space-y-3">
        {roadmapItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-gray-700 font-medium">{item.title}</span>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[item.status]}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
