export type DailyMetric = {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
  averageOrderValue: number;
};

export type AlertSeverity = "Critique" | "Attention" | "Opportunité";

export type Alert = {
  id: string;
  severity: AlertSeverity;
  metric: string;
  explanation: string;
  impact: string;
  segment: string;
  confidence: number;
};

export type Report = {
  resume: string;
  analyse: string;
  hypothese: string;
  priorite: string;
};

export type RecommendationPriority = "Haute" | "Moyenne" | "Faible";
export type RecommendationEffort = "Faible" | "Moyen" | "Élevé";

export type Recommendation = {
  id: string;
  title: string;
  priority: RecommendationPriority;
  effort: RecommendationEffort;
  impact: string;
  explanation: string;
};

export type KPIStatus = "stable" | "hausse" | "baisse" | "alerte";

export type KPI = {
  label: string;
  value: string;
  previousAverage: string;
  change: number;
  status: KPIStatus;
};

export type Segment = {
  name: string;
  revenue: string;
  variation: number;
  conversion: string;
  status: "En baisse" | "Stable" | "En hausse" | "À surveiller";
};

export type DataSource = {
  name: string;
  icon: string;
  status: "Connecté" | "À configurer" | "Synchronisation récente";
  lastSync: string;
};
