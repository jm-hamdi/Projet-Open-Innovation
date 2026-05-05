import { dailyMetrics, companyName, analysisPeriod } from "@/data/metrics";
import {
  detectAnomalies,
  generateAIReport,
  generateRecommendations,
  computeKPIs,
} from "@/utils/analytics";

import DashboardHeader from "@/components/DashboardHeader";
import KPICard from "@/components/KPICard";
import TrendChart from "@/components/TrendChart";
import AlertCard from "@/components/AlertCard";
import AIReport from "@/components/AIReport";
import RecommendationCard from "@/components/RecommendationCard";
import SegmentTable from "@/components/SegmentTable";
import DataSourceCard from "@/components/DataSourceCard";
import RoadmapSection from "@/components/RoadmapSection";

export default function Home() {
  const kpis = computeKPIs(dailyMetrics);
  const alerts = detectAnomalies(dailyMetrics);
  const report = generateAIReport(dailyMetrics, alerts);
  const recommendations = generateRecommendations(alerts);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader company={companyName} period={analysisPeriod} />

        {/* KPI Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} kpi={kpi} />
          ))}
        </div>

        {/* Trend Charts */}
        <TrendChart data={dailyMetrics} />

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Alertes intelligentes</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {alerts.length} alerte{alerts.length > 1 ? "s" : ""} détectée{alerts.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* AI Report */}
        <AIReport report={report} />

        {/* Recommendations */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Actions recommandées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        </div>

        {/* Segment Table */}
        <SegmentTable />

        {/* Data Sources */}
        <DataSourceCard />

        {/* Roadmap */}
        <RoadmapSection />

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-200 mt-4">
          <p className="text-xs text-gray-400">
            AI Ops Co-pilot — Analyse intelligente des opérations PME
          </p>
        </footer>
      </div>
    </div>
  );
}
