import { DailyMetric, SegmentDef } from "@/types";

// ─── Maison Nova — 30 jours (06/04 → 05/05) ────────────────────────────────
// Derniers 7 jours avant aujourd'hui : moyenne CA ≈ 2 271 €
// Aujourd'hui (05/05) : 1 850 € → −18,5 % → alerte Attention
export const maisonNovaMetrics: DailyMetric[] = [
  { date: "06/04", revenue: 1980, orders: 45, visitors: 3900, conversionRate: 1.15, averageOrderValue: 44.0 },
  { date: "07/04", revenue: 2380, orders: 54, visitors: 4600, conversionRate: 1.17, averageOrderValue: 44.1 },
  { date: "08/04", revenue: 2430, orders: 55, visitors: 4700, conversionRate: 1.17, averageOrderValue: 44.2 },
  { date: "09/04", revenue: 2290, orders: 52, visitors: 4400, conversionRate: 1.18, averageOrderValue: 44.0 },
  { date: "10/04", revenue: 2480, orders: 56, visitors: 4800, conversionRate: 1.17, averageOrderValue: 44.3 },
  { date: "11/04", revenue: 2350, orders: 53, visitors: 4550, conversionRate: 1.16, averageOrderValue: 44.3 },
  { date: "12/04", revenue: 2100, orders: 48, visitors: 4150, conversionRate: 1.16, averageOrderValue: 43.8 },
  { date: "13/04", revenue: 1950, orders: 44, visitors: 3950, conversionRate: 1.11, averageOrderValue: 44.3 },
  { date: "14/04", revenue: 2410, orders: 55, visitors: 4650, conversionRate: 1.18, averageOrderValue: 43.8 },
  { date: "15/04", revenue: 2520, orders: 57, visitors: 4900, conversionRate: 1.16, averageOrderValue: 44.2 },
  { date: "16/04", revenue: 2360, orders: 53, visitors: 4600, conversionRate: 1.15, averageOrderValue: 44.5 },
  { date: "17/04", revenue: 2440, orders: 55, visitors: 4750, conversionRate: 1.16, averageOrderValue: 44.4 },
  { date: "18/04", revenue: 2380, orders: 54, visitors: 4600, conversionRate: 1.17, averageOrderValue: 44.1 },
  { date: "19/04", revenue: 2150, orders: 49, visitors: 4200, conversionRate: 1.17, averageOrderValue: 43.9 },
  { date: "20/04", revenue: 2020, orders: 46, visitors: 3950, conversionRate: 1.16, averageOrderValue: 43.9 },
  { date: "21/04", revenue: 2300, orders: 52, visitors: 4450, conversionRate: 1.17, averageOrderValue: 44.2 },
  { date: "22/04", revenue: 2100, orders: 48, visitors: 4200, conversionRate: 1.14, averageOrderValue: 43.75 },
  { date: "23/04", revenue: 2340, orders: 52, visitors: 4500, conversionRate: 1.16, averageOrderValue: 45.0 },
  { date: "24/04", revenue: 1980, orders: 44, visitors: 4050, conversionRate: 1.09, averageOrderValue: 45.0 },
  { date: "25/04", revenue: 2210, orders: 50, visitors: 4300, conversionRate: 1.16, averageOrderValue: 44.2 },
  { date: "26/04", revenue: 2050, orders: 46, visitors: 4100, conversionRate: 1.12, averageOrderValue: 44.57 },
  { date: "27/04", revenue: 2400, orders: 54, visitors: 4600, conversionRate: 1.17, averageOrderValue: 44.44 },
  { date: "28/04", revenue: 2280, orders: 51, visitors: 4400, conversionRate: 1.16, averageOrderValue: 44.71 },
  { date: "29/04", revenue: 2190, orders: 49, visitors: 4250, conversionRate: 1.15, averageOrderValue: 44.69 },
  { date: "30/04", revenue: 2310, orders: 52, visitors: 4450, conversionRate: 1.17, averageOrderValue: 44.42 },
  { date: "01/05", revenue: 2420, orders: 55, visitors: 4700, conversionRate: 1.17, averageOrderValue: 44.0 },
  { date: "02/05", revenue: 2150, orders: 48, visitors: 4200, conversionRate: 1.14, averageOrderValue: 44.79 },
  { date: "03/05", revenue: 2300, orders: 51, visitors: 4400, conversionRate: 1.16, averageOrderValue: 45.1 },
  { date: "04/05", revenue: 2250, orders: 50, visitors: 4350, conversionRate: 1.15, averageOrderValue: 45.0 },
  { date: "05/05", revenue: 1850, orders: 42, visitors: 3980, conversionRate: 1.06, averageOrderValue: 44.05 },
];

// Segments Maison Nova : calibrés pour donner −28 %, +2 %, −12 %, +8 %
export const maisonNovaSegmentDefs: SegmentDef[] = [
  { name: "Mobile / France / Paid Social", todayShare: 0.335, avgShare: 0.379, conversionOffset: -0.24 },
  { name: "Desktop / France / Organic",    todayShare: 0.400, avgShare: 0.319, conversionOffset: 0.28 },
  { name: "Mobile / Belgique / Direct",    todayShare: 0.151, avgShare: 0.140, conversionOffset: -0.01 },
  { name: "Desktop / Suisse / Email",      todayShare: 0.114, avgShare: 0.086, conversionOffset: 0.55 },
];

// ─── Atelier Sud — 30 jours (06/04 → 05/05) ─────────────────────────────────
// Histoire positive : hausse du CA (+15 %) + opportunité panier moyen (+9 %)
export const atelierSudMetrics: DailyMetric[] = [
  { date: "06/04", revenue: 1780, orders: 43, visitors: 3700, conversionRate: 1.16, averageOrderValue: 41.4 },
  { date: "07/04", revenue: 1920, orders: 46, visitors: 3950, conversionRate: 1.16, averageOrderValue: 41.7 },
  { date: "08/04", revenue: 1850, orders: 45, visitors: 3820, conversionRate: 1.18, averageOrderValue: 41.1 },
  { date: "09/04", revenue: 1990, orders: 48, visitors: 4100, conversionRate: 1.17, averageOrderValue: 41.5 },
  { date: "10/04", revenue: 2010, orders: 48, visitors: 4150, conversionRate: 1.16, averageOrderValue: 41.9 },
  { date: "11/04", revenue: 1960, orders: 47, visitors: 4050, conversionRate: 1.16, averageOrderValue: 41.7 },
  { date: "12/04", revenue: 1740, orders: 42, visitors: 3600, conversionRate: 1.17, averageOrderValue: 41.4 },
  { date: "13/04", revenue: 1680, orders: 40, visitors: 3500, conversionRate: 1.14, averageOrderValue: 42.0 },
  { date: "14/04", revenue: 1950, orders: 47, visitors: 4000, conversionRate: 1.18, averageOrderValue: 41.5 },
  { date: "15/04", revenue: 2050, orders: 49, visitors: 4200, conversionRate: 1.17, averageOrderValue: 41.8 },
  { date: "16/04", revenue: 1980, orders: 48, visitors: 4050, conversionRate: 1.18, averageOrderValue: 41.3 },
  { date: "17/04", revenue: 1940, orders: 47, visitors: 3980, conversionRate: 1.18, averageOrderValue: 41.3 },
  { date: "18/04", revenue: 1900, orders: 46, visitors: 3900, conversionRate: 1.18, averageOrderValue: 41.3 },
  { date: "19/04", revenue: 1760, orders: 43, visitors: 3650, conversionRate: 1.18, averageOrderValue: 40.9 },
  { date: "20/04", revenue: 1820, orders: 44, visitors: 3800, conversionRate: 1.16, averageOrderValue: 41.4 },
  { date: "21/04", revenue: 1970, orders: 47, visitors: 4050, conversionRate: 1.16, averageOrderValue: 41.9 },
  { date: "22/04", revenue: 1850, orders: 45, visitors: 3820, conversionRate: 1.18, averageOrderValue: 41.1 },
  { date: "23/04", revenue: 2000, orders: 48, visitors: 4100, conversionRate: 1.17, averageOrderValue: 41.7 },
  { date: "24/04", revenue: 1920, orders: 46, visitors: 3950, conversionRate: 1.16, averageOrderValue: 41.7 },
  { date: "25/04", revenue: 1860, orders: 45, visitors: 3850, conversionRate: 1.17, averageOrderValue: 41.3 },
  { date: "26/04", revenue: 1940, orders: 47, visitors: 4000, conversionRate: 1.18, averageOrderValue: 41.3 },
  { date: "27/04", revenue: 2050, orders: 49, visitors: 4200, conversionRate: 1.17, averageOrderValue: 41.8 },
  { date: "28/04", revenue: 1780, orders: 43, visitors: 3700, conversionRate: 1.16, averageOrderValue: 41.4 },
  { date: "29/04", revenue: 1820, orders: 44, visitors: 3800, conversionRate: 1.16, averageOrderValue: 41.4 },
  { date: "30/04", revenue: 1950, orders: 47, visitors: 3980, conversionRate: 1.18, averageOrderValue: 41.5 },
  { date: "01/05", revenue: 1890, orders: 46, visitors: 3850, conversionRate: 1.20, averageOrderValue: 41.1 },
  { date: "02/05", revenue: 1780, orders: 43, visitors: 3720, conversionRate: 1.16, averageOrderValue: 41.4 },
  { date: "03/05", revenue: 2020, orders: 49, visitors: 4100, conversionRate: 1.20, averageOrderValue: 41.2 },
  { date: "04/05", revenue: 1960, orders: 47, visitors: 3980, conversionRate: 1.18, averageOrderValue: 41.7 },
  { date: "05/05", revenue: 2180, orders: 52, visitors: 4200, conversionRate: 1.24, averageOrderValue: 45.2 },
];

// Segments Atelier Sud : Desktop Organic en forte hausse
export const atelierSudSegmentDefs: SegmentDef[] = [
  { name: "Mobile / France / Paid Social", todayShare: 0.270, avgShare: 0.310, conversionOffset: -0.08 },
  { name: "Desktop / France / Organic",    todayShare: 0.450, avgShare: 0.380, conversionOffset: 0.20 },
  { name: "Mobile / Belgique / Direct",    todayShare: 0.165, avgShare: 0.165, conversionOffset: 0.04 },
  { name: "Desktop / Suisse / Email",      todayShare: 0.115, avgShare: 0.145, conversionOffset: 0.48 },
];

// ─── Boutique Lumen — 30 jours (06/04 → 05/05) ───────────────────────────────
// Histoire stable : activité régulière sans anomalie
export const boutiqueLumenMetrics: DailyMetric[] = [
  { date: "06/04", revenue: 1520, orders: 37, visitors: 3100, conversionRate: 1.19, averageOrderValue: 41.1 },
  { date: "07/04", revenue: 1680, orders: 41, visitors: 3350, conversionRate: 1.22, averageOrderValue: 41.0 },
  { date: "08/04", revenue: 1720, orders: 42, visitors: 3450, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "09/04", revenue: 1640, orders: 40, visitors: 3280, conversionRate: 1.22, averageOrderValue: 41.0 },
  { date: "10/04", revenue: 1750, orders: 43, visitors: 3500, conversionRate: 1.23, averageOrderValue: 40.7 },
  { date: "11/04", revenue: 1690, orders: 41, visitors: 3380, conversionRate: 1.21, averageOrderValue: 41.2 },
  { date: "12/04", revenue: 1560, orders: 38, visitors: 3150, conversionRate: 1.21, averageOrderValue: 41.1 },
  { date: "13/04", revenue: 1490, orders: 36, visitors: 3020, conversionRate: 1.19, averageOrderValue: 41.4 },
  { date: "14/04", revenue: 1700, orders: 41, visitors: 3400, conversionRate: 1.21, averageOrderValue: 41.5 },
  { date: "15/04", revenue: 1780, orders: 43, visitors: 3560, conversionRate: 1.21, averageOrderValue: 41.4 },
  { date: "16/04", revenue: 1730, orders: 42, visitors: 3460, conversionRate: 1.21, averageOrderValue: 41.2 },
  { date: "17/04", revenue: 1760, orders: 43, visitors: 3520, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "18/04", revenue: 1720, orders: 42, visitors: 3440, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "19/04", revenue: 1640, orders: 40, visitors: 3300, conversionRate: 1.21, averageOrderValue: 41.0 },
  { date: "20/04", revenue: 1590, orders: 39, visitors: 3200, conversionRate: 1.22, averageOrderValue: 40.8 },
  { date: "21/04", revenue: 1700, orders: 41, visitors: 3400, conversionRate: 1.21, averageOrderValue: 41.5 },
  { date: "22/04", revenue: 1700, orders: 41, visitors: 3400, conversionRate: 1.21, averageOrderValue: 41.5 },
  { date: "23/04", revenue: 1750, orders: 43, visitors: 3500, conversionRate: 1.23, averageOrderValue: 40.7 },
  { date: "24/04", revenue: 1680, orders: 41, visitors: 3350, conversionRate: 1.22, averageOrderValue: 41.0 },
  { date: "25/04", revenue: 1720, orders: 42, visitors: 3450, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "26/04", revenue: 1800, orders: 44, visitors: 3600, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "27/04", revenue: 1760, orders: 43, visitors: 3520, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "28/04", revenue: 1690, orders: 41, visitors: 3380, conversionRate: 1.21, averageOrderValue: 41.2 },
  { date: "29/04", revenue: 1730, orders: 42, visitors: 3460, conversionRate: 1.22, averageOrderValue: 41.2 },
  { date: "30/04", revenue: 1780, orders: 43, visitors: 3560, conversionRate: 1.21, averageOrderValue: 41.4 },
  { date: "01/05", revenue: 1720, orders: 42, visitors: 3440, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "02/05", revenue: 1650, orders: 40, visitors: 3300, conversionRate: 1.21, averageOrderValue: 41.3 },
  { date: "03/05", revenue: 1800, orders: 44, visitors: 3600, conversionRate: 1.22, averageOrderValue: 40.9 },
  { date: "04/05", revenue: 1750, orders: 43, visitors: 3500, conversionRate: 1.23, averageOrderValue: 40.7 },
  { date: "05/05", revenue: 1760, orders: 43, visitors: 3520, conversionRate: 1.22, averageOrderValue: 40.9 },
];

// Segments Boutique Lumen : répartition équilibrée, faible volatilité
export const boutiqueLumenSegmentDefs: SegmentDef[] = [
  { name: "Mobile / France / Paid Social", todayShare: 0.300, avgShare: 0.300, conversionOffset: -0.15 },
  { name: "Desktop / France / Organic",    todayShare: 0.420, avgShare: 0.420, conversionOffset: 0.22 },
  { name: "Mobile / Belgique / Direct",    todayShare: 0.170, avgShare: 0.170, conversionOffset: 0.05 },
  { name: "Desktop / Suisse / Email",      todayShare: 0.110, avgShare: 0.110, conversionOffset: 0.40 },
];

// Compat : les anciens imports continuent de fonctionner
export const dailyMetrics = maisonNovaMetrics;
export const segmentDefs = maisonNovaSegmentDefs;
export const companyName = "Maison Nova";
export const analysisPeriod = "14 derniers jours";
