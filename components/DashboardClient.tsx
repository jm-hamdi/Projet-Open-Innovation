"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw } from "lucide-react";

import {
  maisonNovaMetrics, atelierSudMetrics, boutiqueLumenMetrics,
  maisonNovaSegmentDefs, atelierSudSegmentDefs, boutiqueLumenSegmentDefs,
} from "@/data/metrics";
import {
  detectAnomalies, generateAIReport, generateRecommendations, computeKPIs, computeSegments,
} from "@/utils/analytics";

import Sidebar from "@/components/Sidebar";
import TopBar, { CompanyId, Period } from "@/components/TopBar";
import KPICard from "@/components/KPICard";
import TrendChart from "@/components/TrendChart";
import AlertCard from "@/components/AlertCard";
import AIReport from "@/components/AIReport";
import RecommendationCard from "@/components/RecommendationCard";
import SegmentTable from "@/components/SegmentTable";
import DataSourceCard, { SourceItem } from "@/components/DataSourceCard";
import RoadmapSection from "@/components/RoadmapSection";
import Panel from "@/components/Panel";

import AlertesView from "@/components/views/AlertesView";
import RapportsView from "@/components/views/RapportsView";
import SegmentsView from "@/components/views/SegmentsView";
import SourcesView from "@/components/views/SourcesView";
import ParamètresView from "@/components/views/ParamètresView";

import { Alert, Recommendation, Segment } from "@/types";
import { Bell } from "lucide-react";

// ─── Company data map ────────────────────────────────────────────────────────

const COMPANY_DATA = {
  "maison-nova":    { name: "Maison Nova",    metrics: maisonNovaMetrics,    defs: maisonNovaSegmentDefs },
  "atelier-sud":   { name: "Atelier Sud",    metrics: atelierSudMetrics,    defs: atelierSudSegmentDefs },
  "boutique-lumen": { name: "Boutique Lumen", metrics: boutiqueLumenMetrics, defs: boutiqueLumenSegmentDefs },
} as const;

// ─── Panel content types ─────────────────────────────────────────────────────

type PanelState =
  | { type: "rec"; rec: Recommendation; alerts: Alert[]; segments: Segment[] }
  | { type: "source"; source: SourceItem }
  | null;

// ─── Source panel content ─────────────────────────────────────────────────────

function SourcePanelContent({ source }: { source: SourceItem }) {
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "done">("idle");

  const handleSync = () => {
    setSyncState("syncing");
    setTimeout(() => setSyncState("done"), 1000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <source.Icon size={20} strokeWidth={1.75} className="text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-slate-900">{source.name}</p>
          <p className="text-xs text-slate-400">{source.status}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dernière synchronisation</p>
        <p className="text-sm text-slate-700">{source.lastSync}</p>
      </div>

      {source.syncHistory.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Historique des syncs</p>
          <div className="space-y-1">
            {source.syncHistory.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={syncState === "syncing"}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-70 transition-colors cursor-pointer"
      >
        <RefreshCw size={14} strokeWidth={2} className={syncState === "syncing" ? "animate-spin" : ""} />
        {syncState === "syncing" ? "Synchronisation…" : syncState === "done" ? "Synchronisé à l'instant" : "Resynchroniser"}
      </button>
    </div>
  );
}

// ─── Recommendation detail content ───────────────────────────────────────────

function RecPanelContent({ rec, alerts, segments }: { rec: Recommendation; alerts: Alert[]; segments: Segment[] }) {
  const relatedAlert = alerts.find(
    (a) => a.segment === "Mobile / France / Paid Social" || a.metric === "Chiffre d'affaires"
  );
  const impactedSeg = segments.find((s) => s.status === "En baisse" || s.status === "À surveiller");

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">{rec.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{rec.explanation}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Impact estimé</p>
        <p className="text-sm font-medium text-blue-800">{rec.impact}</p>
      </div>

      {relatedAlert && (
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Alerte associée</p>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-800 mb-1">{relatedAlert.metric}</p>
            <p className="text-xs text-amber-700 leading-relaxed">{relatedAlert.explanation}</p>
          </div>
        </div>
      )}

      {impactedSeg && (
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Segment impacté</p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-800 mb-0.5">{impactedSeg.name}</p>
            <p className={`text-xs font-semibold ${impactedSeg.variation < 0 ? "text-red-600" : "text-emerald-600"}`}>
              {impactedSeg.variation > 0 ? "+" : ""}{impactedSeg.variation} %
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export default function DashboardClient() {
  const [company, setCompany]       = useState<CompanyId>("maison-nova");
  const [period, setPeriod]         = useState<Period>(14);
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [treatedRecs, setTreatedRecs] = useState<Set<string>>(new Set());
  const [panel, setPanel]           = useState<PanelState>(null);
  const [refreshMinutes, setRefreshMinutes] = useState(4);
  const [isRefreshing, setIsRefreshing]     = useState(false);

  // Live refresh counter
  useEffect(() => {
    const timer = setInterval(() => setRefreshMinutes((m) => m + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  // Reset state when company changes
  useEffect(() => {
    setTreatedRecs(new Set());
    setPanel(null);
  }, [company]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshMinutes(0);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // ── Computed data ──────────────────────────────────────────────────────────

  const { name: companyName, metrics: fullMetrics, defs: segDefs } = COMPANY_DATA[company];
  const slicedData = useMemo(() => fullMetrics.slice(-period), [fullMetrics, period]);

  const kpis            = useMemo(() => computeKPIs(slicedData), [slicedData]);
  const alerts          = useMemo(() => detectAnomalies(slicedData), [slicedData]);
  const report          = useMemo(() => generateAIReport(slicedData, alerts), [slicedData, alerts]);
  const recommendations = useMemo(() => generateRecommendations(alerts), [alerts]);
  const segments        = useMemo(() => computeSegments(slicedData, segDefs), [slicedData, segDefs]);

  // Sort: untreated first, treated at end
  const sortedRecs = useMemo(
    () => [...recommendations].sort((a, b) => {
      const aT = treatedRecs.has(a.id);
      const bT = treatedRecs.has(b.id);
      return aT === bT ? 0 : aT ? 1 : -1;
    }),
    [recommendations, treatedRecs],
  );

  // ── Panel helpers ──────────────────────────────────────────────────────────

  const openRecPanel = useCallback((rec: Recommendation) => {
    setPanel({ type: "rec", rec, alerts, segments });
  }, [alerts, segments]);

  const openSourcePanel = useCallback((source: SourceItem) => {
    setPanel({ type: "source", source });
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          company={company}
          companyName={companyName}
          setCompany={setCompany}
          period={period}
          setPeriod={setPeriod}
          refreshMinutes={refreshMinutes}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && (
            <>
              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {kpis.map((kpi) => <KPICard key={kpi.label} kpi={kpi} />)}
              </div>

              {/* 2/3 + 1/3: Charts + Alerts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="xl:col-span-2">
                  <TrendChart data={slicedData} />
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell size={15} strokeWidth={1.75} className="text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-900">Alertes intelligentes</h2>
                    <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {alerts.filter((a) => a.id !== "alert-stable").length || alerts.length}
                    </span>
                  </div>
                  {alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
                </div>
              </div>

              {/* AI Report — full width */}
              <AIReport report={report} />

              {/* Recommendations — 3 col */}
              <div className="mb-6">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Actions recommandées</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Priorisées par impact et facilité de mise en œuvre</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedRecs.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      rec={rec}
                      treated={treatedRecs.has(rec.id)}
                      onTreat={() => setTreatedRecs((prev) => new Set([...prev, rec.id]))}
                      onViewDetail={() => openRecPanel(rec)}
                    />
                  ))}
                </div>
              </div>

              {/* Segments + Sources side-by-side */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <SegmentTable segments={segments} />
                <DataSourceCard onManage={openSourcePanel} />
              </div>

              <RoadmapSection />

              <footer className="pt-4 border-t border-slate-200 mt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>AI Ops Co-pilot — Analyse intelligente des opérations PME</span>
                  <div className="flex items-center gap-4">
                    <span>v1.4.2</span>
                    <a href="#" className="hover:text-slate-600 transition-colors">Statut des services</a>
                  </div>
                </div>
              </footer>
            </>
          )}

          {activeTab === "alertes"    && <AlertesView alerts={alerts} />}
          {activeTab === "rapports"   && <RapportsView report={report} data={slicedData} alerts={alerts} />}
          {activeTab === "segments"   && <SegmentsView segments={segments} />}
          {activeTab === "sources"    && <SourcesView onManage={openSourcePanel} />}
          {activeTab === "parametres" && <ParamètresView companyName={companyName} />}
        </main>
      </div>

      {/* Side panel */}
      <Panel
        open={panel !== null}
        onClose={() => setPanel(null)}
        title={
          panel?.type === "rec"    ? "Détail de la recommandation" :
          panel?.type === "source" ? "Gestion de la source" :
          ""
        }
      >
        {panel?.type === "rec" && (
          <RecPanelContent rec={panel.rec} alerts={panel.alerts} segments={panel.segments} />
        )}
        {panel?.type === "source" && (
          <SourcePanelContent source={panel.source} />
        )}
      </Panel>
    </div>
  );
}
