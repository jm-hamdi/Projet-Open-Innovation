import { DailyMetric, Alert, Report, Recommendation, KPI, Segment, SegmentDef } from "@/types";
import { segmentDefs as defaultSegmentDefs } from "@/data/metrics";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculatePercentageChange(current: number, average: number): number {
  if (average === 0) return 0;
  return ((current - average) / average) * 100;
}

/** Formate un nombre avec virgule décimale (fr-FR). Usage : dans les chaînes interpolées. */
function frFmt(n: number, decimals = 1): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function frCurrency(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Anomaly detection ───────────────────────────────────────────────────────

export function detectAnomalies(data: DailyMetric[]): Alert[] {
  if (data.length < 3) return [];

  const windowSize = Math.min(7, data.length - 1);
  const previousWindow = data.slice(-(windowSize + 1), -1);
  const today = data[data.length - 1];
  const alerts: Alert[] = [];

  const avgRevenue    = calculateAverage(previousWindow.map((d) => d.revenue));
  const avgConversion = calculateAverage(previousWindow.map((d) => d.conversionRate));
  const avgVisitors   = calculateAverage(previousWindow.map((d) => d.visitors));
  const avgAOV        = calculateAverage(previousWindow.map((d) => d.averageOrderValue));

  const revenueChange    = calculatePercentageChange(today.revenue,        avgRevenue);
  const conversionChange = calculatePercentageChange(today.conversionRate, avgConversion);
  const visitorsChange   = calculatePercentageChange(today.visitors,       avgVisitors);
  const aovChange        = calculatePercentageChange(today.averageOrderValue, avgAOV);

  if (revenueChange <= -20) {
    alerts.push({
      id: "alert-revenue",
      severity: "Critique",
      metric: "Chiffre d'affaires",
      explanation: `Le chiffre d'affaires est en baisse de ${frFmt(Math.abs(revenueChange))} % par rapport à la moyenne des ${windowSize} derniers jours. La baisse semble principalement liée au trafic mobile et au taux de conversion.`,
      impact: `−${frFmt(Math.abs(revenueChange))} % de revenus journaliers`,
      segment: "Mobile / France / Paid Social",
      confidence: 87,
    });
  } else if (revenueChange <= -10) {
    alerts.push({
      id: "alert-revenue-warn",
      severity: "Attention",
      metric: "Chiffre d'affaires",
      explanation: `Le chiffre d'affaires est en recul de ${frFmt(Math.abs(revenueChange))} % par rapport à la moyenne hebdomadaire. Une vigilance accrue est recommandée.`,
      impact: `−${frFmt(Math.abs(revenueChange))} % de revenus journaliers`,
      segment: "Mobile / France / Paid Social",
      confidence: 78,
    });
  }

  if (conversionChange <= -15) {
    alerts.push({
      id: "alert-conversion",
      severity: "Attention",
      metric: "Taux de conversion",
      explanation: `Le taux de conversion a chuté de ${frFmt(Math.abs(conversionChange))} % sous la moyenne des ${windowSize} derniers jours. Un problème sur le parcours d'achat mobile est probable.`,
      impact: "Perte estimée de 8 à 12 commandes",
      segment: "Mobile / France / Paid Social",
      confidence: 82,
    });
  }

  if (visitorsChange <= -15) {
    alerts.push({
      id: "alert-visitors",
      severity: "Attention",
      metric: "Visiteurs",
      explanation: `Le trafic est en baisse de ${frFmt(Math.abs(visitorsChange))} % par rapport à la semaine précédente. Les campagnes d'acquisition semblent moins performantes.`,
      impact: "Réduction du volume global d'opportunités",
      segment: "Mobile / France / Paid Social",
      confidence: 74,
    });
  }

  if (aovChange >= 8) {
    alerts.push({
      id: "alert-aov-up",
      severity: "Opportunité",
      metric: "Panier moyen",
      explanation: `Le panier moyen a progressé de ${frFmt(aovChange)} % par rapport à la moyenne. Les clients actifs achètent davantage — une opportunité pour capitaliser sur l'upsell.`,
      impact: `+${frFmt(aovChange)} % sur la valeur par transaction`,
      segment: "Desktop / France / Organic",
      confidence: 79,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "alert-stable",
      severity: "Attention",
      metric: "Activité globale",
      explanation: "Les indicateurs montrent un léger ralentissement général. Aucun signal critique détecté, mais une surveillance rapprochée est conseillée.",
      impact: "Impact modéré sur les revenus hebdomadaires",
      segment: "Tous segments",
      confidence: 65,
    });
  }

  return alerts;
}

// ─── Report variants ─────────────────────────────────────────────────────────

interface ReportContext {
  revenueChange: number;
  ordersChange: number;
  visitorsChange: number;
  conversionChange: number;
  pct: string; // |revenueChange| formatted fr-FR
  worstSegmentName: string;
  worstSegmentVariation: number;
}

function makeCritiqueVariants(ctx: ReportContext): Report[] {
  const { pct, revenueChange, ordersChange, visitorsChange, conversionChange, worstSegmentName, worstSegmentVariation } = ctx;
  return [
    {
      resume: `L'activité enregistre une baisse significative du chiffre d'affaires sur la journée analysée, avec un recul de ${pct} % par rapport à la moyenne de référence. Les indicateurs de trafic (${frFmt(Math.abs(visitorsChange))} %) et de conversion (${frFmt(Math.abs(conversionChange))} %) confirment une dégradation généralisée sur le canal mobile.`,
      analyse: `La décomposition par segment révèle que l'essentiel de l'écart est concentré sur ${worstSegmentName}, dont le chiffre d'affaires recule de ${frFmt(Math.abs(worstSegmentVariation))} % par rapport à sa référence. La baisse des commandes (${frFmt(Math.abs(ordersChange))} %) est cohérente avec la réduction du trafic qualifié — le panier moyen reste lui stable, ce qui exclut une cause prix.`,
      hypothese: `La dégradation est probablement liée à une sous-performance des campagnes d'acquisition mobile, couplée à un possible obstacle dans le tunnel de paiement. Une anomalie technique ou une fin de budget publicitaire peut expliquer la chute brutale du trafic qualifié sur ce segment.`,
      priorite: `Vérifier immédiatement l'état des campagnes Paid Social sur mobile et auditer le parcours de paiement depuis un appareil mobile. Si aucune anomalie technique n'est identifiée dans les 4 heures, envisager une relance ciblée auprès des visiteurs récents non convertis.`,
    },
    {
      resume: `Les résultats du jour font état d'un recul marqué de ${pct} % du chiffre d'affaires. La performance se situe nettement en deçà de la tendance, avec des baisses simultanées sur le trafic (${frFmt(Math.abs(visitorsChange))} %) et le taux de conversion (${frFmt(Math.abs(conversionChange))} %).`,
      analyse: `${worstSegmentName} concentre l'essentiel de l'écart avec une variation de ${frFmt(worstSegmentVariation)} %. La baisse du volume de commandes (${frFmt(Math.abs(ordersChange))} %) traduit un déficit d'acquisition plus que de qualité d'offre — les segments desktop maintiennent une performance proche de la normale, ce qui exclut une cause systémique.`,
      hypothese: `Une interruption ou sous-performance marquée des campagnes de trafic payant sur mobile est l'hypothèse la plus probable. Un changement d'algorithme de diffusion ou un épuisement prématuré du budget publicitaire pourrait également expliquer ce phénomène.`,
      priorite: `Contrôler en urgence les tableaux de bord des plateformes publicitaires pour détecter toute anomalie de diffusion. Préparer un plan de relance par email pour les visiteurs des 7 derniers jours si la baisse se confirme en fin de journée.`,
    },
    {
      resume: `Une chute inhabituelle de ${pct} % du chiffre d'affaires journalier est enregistrée aujourd'hui. Commandes en recul de ${frFmt(Math.abs(ordersChange))} % et trafic en baisse de ${frFmt(Math.abs(visitorsChange))} % — l'impact cumulé sur la semaine nécessite une réaction rapide.`,
      analyse: `${worstSegmentName} (${frFmt(worstSegmentVariation)} %) supporte la quasi-totalité du choc. Ce double signal — trafic et conversion en baisse simultanée — est caractéristique d'un problème d'acquisition et non d'une défaillance produit ou de prix.`,
      hypothese: `Les campagnes Paid Social semblent sous-performer de manière atypique, soit en raison d'une dégradation du score de pertinence des annonces, soit suite à une modification de ciblage ou de budget.`,
      priorite: `Suspendre les audiences les moins performantes et réallouer temporairement le budget vers les campagnes à ROAS élevé. Activer une alerte de performance en temps réel sur les campagnes mobiles pour les prochaines 48 heures.`,
    },
  ];
}

function makeAttentionVariants(ctx: ReportContext): Report[] {
  const { pct, ordersChange, visitorsChange, conversionChange, worstSegmentName, worstSegmentVariation } = ctx;
  return [
    {
      resume: `L'activité présente un recul de ${pct} % du chiffre d'affaires par rapport à la moyenne de référence. Les commandes accusent une baisse de ${frFmt(Math.abs(ordersChange))} % et le trafic de ${frFmt(Math.abs(visitorsChange))} %, signe d'un ralentissement modéré mais notable sur le canal d'acquisition principal.`,
      analyse: `La décomposition par segment situe l'origine du recul sur ${worstSegmentName}, dont la variation atteint ${frFmt(worstSegmentVariation)} %. Le taux de conversion fléchit de ${frFmt(Math.abs(conversionChange))} %, ce qui indique une légère dégradation de la qualité du trafic entrant. Les canaux desktop restent dans la norme.`,
      hypothese: `La baisse de conversion mobile pourrait être liée à une dégradation de l'expérience utilisateur sur ce canal ou à une diminution de la qualité du trafic entrant depuis les campagnes payantes. Un A/B test récemment déployé pourrait également en être la cause.`,
      priorite: `Surveiller l'évolution du taux de conversion mobile sur les prochaines 48 heures. Vérifier les optimisations récentes du tunnel d'achat et la qualité des audiences Paid Social ciblées sur mobile.`,
    },
    {
      resume: `Les métriques du jour signalent un recul de ${pct} % du chiffre d'affaires. Trafic en baisse de ${frFmt(Math.abs(visitorsChange))} %, commandes en recul de ${frFmt(Math.abs(ordersChange))} % — la situation n'est pas critique mais appelle une vigilance renforcée.`,
      analyse: `${worstSegmentName} affiche une variation de ${frFmt(worstSegmentVariation)} %, portant l'essentiel de l'écart. La conversion recule de ${frFmt(Math.abs(conversionChange))} %, ce qui suggère une moindre qualité d'audience plutôt qu'un problème produit. L'origine semble concentrée sur le trafic payant mobile.`,
      hypothese: `Une perte de qualité d'audience sur les campagnes sociales ou une hausse du coût par clic pourraient expliquer la réduction du trafic qualifié. La coïncidence avec une fin de mois publicitaire renforce cette hypothèse.`,
      priorite: `Analyser les métriques de qualité d'audience (CTR, CPC, taux de rebond post-clic) sur les campagnes actives. Suspendre les créatifs sous-performants si le ROAS descend sous le seuil cible.`,
    },
    {
      resume: `La journée enregistre un recul de ${pct} % du chiffre d'affaires, avec des baisses concomitantes du trafic (${frFmt(Math.abs(visitorsChange))} %) et des commandes (${frFmt(Math.abs(ordersChange))} %). La situation ne requiert pas d'action immédiate mais appelle une surveillance accrue.`,
      analyse: `Le segment ${worstSegmentName} montre une variation de ${frFmt(worstSegmentVariation)} %, confirmant que le mobile est l'axe de fragilité principal. La conversion fléchit de ${frFmt(Math.abs(conversionChange))} %, un signal précurseur à ne pas ignorer si la tendance se répète.`,
      hypothese: `Une réduction involontaire du budget ou une rotation d'audience peu performante sur les plateformes sociales est l'explication la plus probable. L'effet peut s'estomper naturellement d'ici 24 à 48 heures si la cause est conjoncturelle.`,
      priorite: `Vérifier les paramètres de diffusion des campagnes et ajuster les plages horaires cibles si nécessaire. Mettre en place un suivi horaire du taux de conversion mobile jusqu'à stabilisation.`,
    },
  ];
}

function makeOpportunityVariants(): Report[] {
  return [
    {
      resume: `Les indicateurs globaux sont stables avec un signal positif notable sur le panier moyen, suggérant une opportunité d'accélération à saisir dès maintenant. Le chiffre d'affaires dépasse la moyenne de référence, porté par une montée en valeur des transactions.`,
      analyse: `La progression du panier moyen traduit une montée en valeur des transactions sur les segments organiques desktop. Ce signal est cohérent avec un comportement d'achat plus engagé de la clientèle fidèle. Le taux de conversion est également supérieur à la normale, ce qui confirme une période favorable.`,
      hypothese: `Les clients récurrents répondent positivement aux offres actuelles. Une action ciblée d'upsell ou de cross-sell pourrait amplifier cet effet sur les prochaines 7 jours en capitalisant sur la dynamique positive du panier moyen.`,
      priorite: `Mettre en place une campagne de relance orientée upsell auprès des clients actifs des 30 derniers jours. Mettre en avant les produits à valeur ajoutée sur la page d'accueil et dans les emails transactionnels.`,
    },
    {
      resume: `La journée se distingue par une hausse du panier moyen et un chiffre d'affaires supérieur à la tendance, signe d'une qualité d'achat accrue sur les segments les plus engagés. C'est une fenêtre d'opportunité à exploiter rapidement.`,
      analyse: `L'augmentation du panier moyen est concentrée sur le canal desktop organique, qui affiche également le meilleur taux de conversion. Ce segment semble bénéficier d'une fidélisation efficace et d'une offre bien positionnée pour répondre aux attentes du moment.`,
      hypothese: `La récente communication éditoriale ou les offres bundlées pourraient être à l'origine de cette montée en gamme. La période est propice à une expérimentation d'upsell structuré pour ancrer ce comportement d'achat.`,
      priorite: `Déployer une proposition de produits complémentaires sur la page panier et tester un email de recommandation post-achat pour les clients ayant acheté au-dessus du panier moyen habituel.`,
    },
    {
      resume: `Journée positive pour la valeur par transaction : le panier moyen progresse de manière significative, offrant un levier clair d'amplification des revenus sans besoin d'acquisition supplémentaire. Le trafic et la conversion sont également en hausse.`,
      analyse: `La hausse du panier moyen dépasse le seuil habituel de variation naturelle, ce qui indique un comportement d'achat délibérément plus élevé. Les produits premium ou les offres groupées semblent trouver leur audience sur les segments les plus qualitatifs.`,
      hypothese: `Un effet de composition du trafic (plus forte part de clients fidèles) ou le succès d'une récente mise en avant de gamme supérieure explique vraisemblablement cette dynamique positive.`,
      priorite: `Identifier les produits ou catégories moteurs de cette hausse et les mettre en avant de manière plus systématique. Envisager un programme de fidélité à paliers pour ancrer ce comportement d'achat sur le long terme.`,
    },
  ];
}

function makeStableVariants(): Report[] {
  return [
    {
      resume: `L'activité de la période analysée présente une performance globalement conforme aux tendances récentes, sans anomalie majeure détectée. Les indicateurs clés évoluent dans leurs intervalles habituels.`,
      analyse: `Les métriques clés — chiffre d'affaires, commandes et taux de conversion — restent proches des moyennes de référence. Aucun signal de dégradation structurelle n'est identifié à ce stade.`,
      hypothese: `La stabilité observée est cohérente avec la saisonnalité habituelle. Une veille régulière est néanmoins recommandée pour anticiper toute inflexion avant qu'elle ne devienne significative.`,
      priorite: `Maintenir le dispositif de suivi en place et concentrer les efforts sur l'optimisation des campagnes d'acquisition à fort ROI. Profiter de cette période stable pour affiner les tests A/B en cours.`,
    },
    {
      resume: `Les indicateurs de la journée s'inscrivent dans la continuité des performances récentes. Aucun écart significatif par rapport à la moyenne de référence n'est à signaler.`,
      analyse: `Le chiffre d'affaires, le trafic et le taux de conversion évoluent dans leurs intervalles habituels. Cette stabilité témoigne d'une bonne cohérence entre l'offre, le trafic et la conversion sur l'ensemble des segments.`,
      hypothese: `La performance est conforme aux attentes pour cette période. Elle peut légèrement évoluer en fonction des dynamiques de fin de semaine ou d'actions promotionnelles à venir.`,
      priorite: `Profiter de cette période stable pour préparer les éventuelles actions promotionnelles à venir et pour optimiser les campagnes à fort potentiel, sans perturber l'équilibre actuel.`,
    },
    {
      resume: `Aucun signal d'alerte n'est détecté sur la période analysée. Les performances restent solides et conformes aux objectifs de référence.`,
      analyse: `L'ensemble des cinq métriques clés se situe dans un intervalle de ±5 % autour de leur moyenne respective. C'est le signe d'une activité régulière et maîtrisée sur l'ensemble des canaux.`,
      hypothese: `La régularité des performances peut s'expliquer par la maturité des campagnes en cours et la fidélité de la clientèle actuelle. Un risque de plateau est à surveiller si cette tendance se prolonge.`,
      priorite: `Explorer de nouveaux leviers de croissance (nouveaux segments d'audience, canaux inexploités) pour éviter l'effet de plafond que peut induire une performance trop régulière sur la durée.`,
    },
  ];
}

// ─── AI Report ───────────────────────────────────────────────────────────────

export function generateAIReport(data: DailyMetric[], alerts: Alert[]): Report {
  const today    = data[data.length - 1];
  const windowSz = Math.min(7, data.length - 1);
  const prev     = data.slice(-(windowSz + 1), -1);

  const avgRevenue    = calculateAverage(prev.map((d) => d.revenue));
  const avgOrders     = calculateAverage(prev.map((d) => d.orders));
  const avgVisitors   = calculateAverage(prev.map((d) => d.visitors));
  const avgConversion = calculateAverage(prev.map((d) => d.conversionRate));

  const revenueChange    = calculatePercentageChange(today.revenue,        avgRevenue);
  const ordersChange     = calculatePercentageChange(today.orders,         avgOrders);
  const visitorsChange   = calculatePercentageChange(today.visitors,       avgVisitors);
  const conversionChange = calculatePercentageChange(today.conversionRate, avgConversion);

  // Worst segment to name in the report
  const segments = computeSegments(data);
  const worstSegment = segments.reduce((w, s) => s.variation < w.variation ? s : w, segments[0]);

  const ctx: ReportContext = {
    revenueChange,
    ordersChange,
    visitorsChange,
    conversionChange,
    pct: frFmt(Math.abs(revenueChange)),
    worstSegmentName: worstSegment?.name ?? "Mobile / France / Paid Social",
    worstSegmentVariation: worstSegment?.variation ?? 0,
  };

  // Only alerts that are not the fake "stable" placeholder
  const realAlerts = alerts.filter((a) => a.id !== "alert-stable");

  const hasCritical      = realAlerts.some((a) => a.severity === "Critique");
  const hasRevenueAlert  = realAlerts.some((a) => a.metric === "Chiffre d'affaires");
  const hasConversionAlert = realAlerts.some((a) => a.metric === "Taux de conversion");
  const hasVisitorAlert  = realAlerts.some((a) => a.metric === "Visiteurs");
  const hasOpportunity   = realAlerts.some((a) => a.severity === "Opportunité");

  // Variant index: varies with period length AND today's value so different periods show different phrasing
  const variantIndex = (today.orders + data.length) % 3;

  let result: Report;

  if (hasCritical) {
    result = makeCritiqueVariants(ctx)[variantIndex];
  } else if (hasRevenueAlert || hasConversionAlert || hasVisitorAlert) {
    result = makeAttentionVariants(ctx)[variantIndex];
  } else if (hasOpportunity) {
    result = makeOpportunityVariants()[variantIndex];
  } else {
    // Only here when realAlerts is empty (true stable)
    result = makeStableVariants()[variantIndex];
  }

  // Safety guard: warn if stable wording appears despite active alerts
  if (process.env.NODE_ENV !== "production" && realAlerts.length > 0) {
    const stableKeywords = ["sans anomalie", "conforme aux tendances", "Aucun écart significatif", "Aucun signal d'alerte"];
    const looksStable = stableKeywords.some((kw) => result.resume.includes(kw));
    if (looksStable) {
      console.warn("[AI Ops] generateAIReport returned stable wording despite active alerts:", alerts);
    }
  }

  return result;
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export function generateRecommendations(alerts: Alert[]): Recommendation[] {
  const hasCritical  = alerts.some((a) => a.severity === "Critique");
  const hasConversion = alerts.some((a) => a.metric === "Taux de conversion");
  const hasVisitor   = alerts.some((a) => a.metric === "Visiteurs");
  const hasRevenue   = alerts.some((a) => a.metric === "Chiffre d'affaires" && a.id !== "alert-stable");

  const recs: Recommendation[] = [];

  if (hasCritical || hasVisitor || hasRevenue) {
    recs.push({
      id: "rec-paid-social",
      title: "Vérifier les campagnes Paid Social sur mobile",
      priority: "Haute",
      effort: "Faible",
      impact: "+15 à +25 % de trafic qualifié",
      explanation: "Contrôler les budgets, ciblages et créatifs des campagnes actives sur les plateformes sociales. Une anomalie de diffusion est la cause la plus probable du recul de trafic.",
    });
  }

  if (hasCritical || hasConversion || hasRevenue) {
    recs.push({
      id: "rec-tunnel",
      title: "Analyser le tunnel de paiement sur mobile",
      priority: "Haute",
      effort: "Moyen",
      impact: "+8 à +12 commandes par jour",
      explanation: "Réaliser un audit complet du parcours d'achat depuis un appareil mobile. Identifier les points de friction ou erreurs techniques susceptibles de bloquer la finalisation des commandes.",
    });
  }

  recs.push({
    id: "rec-relance",
    title: "Relancer les clients inactifs des 30 derniers jours",
    priority: "Moyenne",
    effort: "Faible",
    impact: "+5 à +10 % de taux de réactivation",
    explanation: "Envoyer une communication ciblée avec une offre personnalisée aux clients n'ayant pas effectué d'achat depuis 30 jours. Le coût d'acquisition est minimal sur ce segment.",
  });

  recs.push({
    id: "rec-offre-limitee",
    title: "Créer une offre limitée pour les visiteurs récurrents",
    priority: "Moyenne",
    effort: "Moyen",
    impact: "+10 à +20 % de conversion sur segment fidèle",
    explanation: "Proposer une promotion exclusive à durée limitée aux visiteurs ayant consulté le site plus de 3 fois sans convertir. Ce levier améliore la conversion sans dégrader la marge.",
  });

  recs.push({
    id: "rec-surveillance",
    title: "Surveiller le taux de conversion pendant 48 h",
    priority: "Faible",
    effort: "Faible",
    impact: "Détection précoce d'une dégradation prolongée",
    explanation: "Mettre en place une alerte automatique si le taux de conversion mobile passe sous 0,9 % deux jours consécutifs. Permettra une réaction rapide avant impact significatif.",
  });

  return recs;
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export function computeKPIs(data: DailyMetric[]): KPI[] {
  const today    = data[data.length - 1];
  const windowSz = Math.min(7, data.length - 1);
  const prev     = data.slice(-(windowSz + 1), -1);

  const avgRevenue    = calculateAverage(prev.map((d) => d.revenue));
  const avgOrders     = calculateAverage(prev.map((d) => d.orders));
  const avgVisitors   = calculateAverage(prev.map((d) => d.visitors));
  const avgConversion = calculateAverage(prev.map((d) => d.conversionRate));
  const avgAOV        = calculateAverage(prev.map((d) => d.averageOrderValue));

  const revenueChange    = calculatePercentageChange(today.revenue,           avgRevenue);
  const ordersChange     = calculatePercentageChange(today.orders,            avgOrders);
  const visitorsChange   = calculatePercentageChange(today.visitors,          avgVisitors);
  const conversionChange = calculatePercentageChange(today.conversionRate,    avgConversion);
  const aovChange        = calculatePercentageChange(today.averageOrderValue, avgAOV);

  const getStatus = (change: number, criticalThreshold = -20, warnThreshold = -10): KPI["status"] => {
    if (change <= criticalThreshold) return "alerte";
    if (change <= warnThreshold)     return "baisse";
    if (change >= 5)                 return "hausse";
    return "stable";
  };

  const fmtRev = (n: number) => frCurrency(Math.round(n));
  const fmtNum = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));
  const fmtPct = (n: number) =>
    new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " %";

  return [
    {
      label: "Chiffre d'affaires",
      value: fmtRev(today.revenue),
      previousAverage: fmtRev(avgRevenue),
      change: revenueChange,
      status: getStatus(revenueChange),
    },
    {
      label: "Commandes",
      value: `${today.orders}`,
      previousAverage: `${Math.round(avgOrders)}`,
      change: ordersChange,
      status: getStatus(ordersChange),
    },
    {
      label: "Visiteurs",
      value: fmtNum(today.visitors),
      previousAverage: fmtNum(avgVisitors),
      change: visitorsChange,
      status: getStatus(visitorsChange, -15, -8),
    },
    {
      label: "Taux de conversion",
      value: fmtPct(today.conversionRate),
      previousAverage: fmtPct(parseFloat(avgConversion.toFixed(2))),
      change: conversionChange,
      status: getStatus(conversionChange, -15, -8),
    },
    {
      label: "Panier moyen",
      value: fmtRev(today.averageOrderValue),
      previousAverage: fmtRev(avgAOV),
      change: aovChange,
      status: getStatus(aovChange),
    },
  ];
}

// ─── Segments ────────────────────────────────────────────────────────────────

export function computeSegments(data: DailyMetric[], defs: SegmentDef[] = defaultSegmentDefs): Segment[] {
  const today    = data[data.length - 1];
  const windowSz = Math.min(7, data.length - 1);
  const prev     = data.slice(-(windowSz + 1), -1);
  const avgRevenue = calculateAverage(prev.map((d) => d.revenue));

  return defs.map((def) => {
    const todayRevenue   = Math.round(today.revenue   * def.todayShare);
    const segAvgRevenue  = Math.round(avgRevenue      * def.avgShare);
    const variation      = Math.round(((todayRevenue - segAvgRevenue) / segAvgRevenue) * 100);
    const conversionRate = parseFloat((today.conversionRate + def.conversionOffset).toFixed(2));
    const status: Segment["status"] =
      variation <= -15 ? "En baisse" :
      variation >= 5   ? "En hausse" :
      variation <= -5  ? "À surveiller" : "Stable";

    return { name: def.name, revenue: todayRevenue, variation, conversionRate, status };
  });
}
