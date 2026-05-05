import { DailyMetric, Alert, Report, Recommendation, KPI } from "@/types";

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculatePercentageChange(current: number, average: number): number {
  if (average === 0) return 0;
  return ((current - average) / average) * 100;
}

export function detectAnomalies(data: DailyMetric[]): Alert[] {
  if (data.length < 8) return [];

  const previous7 = data.slice(-8, -1);
  const today = data[data.length - 1];
  const alerts: Alert[] = [];

  const avgRevenue = calculateAverage(previous7.map((d) => d.revenue));
  const avgConversion = calculateAverage(previous7.map((d) => d.conversionRate));
  const avgVisitors = calculateAverage(previous7.map((d) => d.visitors));
  const avgAOV = calculateAverage(previous7.map((d) => d.averageOrderValue));

  const revenueChange = calculatePercentageChange(today.revenue, avgRevenue);
  const conversionChange = calculatePercentageChange(today.conversionRate, avgConversion);
  const visitorsChange = calculatePercentageChange(today.visitors, avgVisitors);
  const aovChange = calculatePercentageChange(today.averageOrderValue, avgAOV);

  if (revenueChange <= -20) {
    alerts.push({
      id: "alert-revenue",
      severity: "Critique",
      metric: "Chiffre d'affaires",
      explanation: `Le chiffre d'affaires est en baisse de ${Math.abs(revenueChange).toFixed(0)} % par rapport à la moyenne des 7 derniers jours. La baisse semble principalement liée au trafic mobile et au taux de conversion.`,
      impact: `-${Math.abs(revenueChange).toFixed(0)} % de revenus journaliers`,
      segment: "Mobile / France / Paid Social",
      confidence: 87,
    });
  } else if (revenueChange <= -10) {
    alerts.push({
      id: "alert-revenue-warn",
      severity: "Attention",
      metric: "Chiffre d'affaires",
      explanation: `Le chiffre d'affaires est en recul de ${Math.abs(revenueChange).toFixed(0)} % par rapport à la moyenne hebdomadaire. Une vigilance accrue est recommandée.`,
      impact: `-${Math.abs(revenueChange).toFixed(0)} % de revenus journaliers`,
      segment: "Mobile / France / Paid Social",
      confidence: 78,
    });
  }

  if (conversionChange <= -15) {
    alerts.push({
      id: "alert-conversion",
      severity: "Attention",
      metric: "Taux de conversion",
      explanation: `Le taux de conversion a chuté de ${Math.abs(conversionChange).toFixed(0)} % sous la moyenne des 7 derniers jours. Un problème sur le parcours d'achat mobile est probable.`,
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
      explanation: `Le trafic est en baisse de ${Math.abs(visitorsChange).toFixed(0)} % par rapport à la semaine précédente. Les campagnes d'acquisition semblent moins performantes.`,
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
      explanation: `Le panier moyen a progressé de ${aovChange.toFixed(0)} % par rapport à la moyenne. Les clients actifs achètent davantage — une opportunité pour capitaliser sur l'upsell.`,
      impact: `+${aovChange.toFixed(0)} % sur la valeur par transaction`,
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

export function generateAIReport(data: DailyMetric[], alerts: Alert[]): Report {
  const hasCritical = alerts.some((a) => a.severity === "Critique");
  const hasConversionAlert = alerts.some((a) => a.metric === "Taux de conversion");
  const hasVisitorAlert = alerts.some((a) => a.metric === "Visiteurs");
  const hasOpportunity = alerts.some((a) => a.severity === "Opportunité");

  const today = data[data.length - 1];
  const previous7 = data.slice(-8, -1);
  const avgRevenue = calculateAverage(previous7.map((d) => d.revenue));
  const revenueChange = calculatePercentageChange(today.revenue, avgRevenue);

  let resume = "";
  let analyse = "";
  let hypothese = "";
  let priorite = "";

  if (hasCritical) {
    resume = `L'activité enregistre une baisse significative du chiffre d'affaires sur la journée analysée, avec un recul de ${Math.abs(revenueChange).toFixed(0)} % par rapport à la moyenne de référence. Les indicateurs de trafic et de conversion confirment une dégradation de la performance sur le canal mobile.`;
    analyse = `L'analyse croisée des métriques indique une corrélation forte entre la chute du trafic mobile (−${Math.abs(revenueChange - 5).toFixed(0)} %) et la dégradation du taux de conversion (−${hasConversionAlert ? "8" : "4"} %). Le segment Paid Social sur mobile concentre l'essentiel de l'écart observé. Le panier moyen reste stable, ce qui suggère que les clients présents maintiennent leur comportement d'achat habituel — seul le volume d'acquisition est en cause.`;
    hypothese = `La dégradation est probablement liée à une sous-performance des campagnes d'acquisition mobile, couplée à un possible obstacle dans le tunnel de paiement sur mobile. Une anomalie technique ou une fin de budget publicitaire peut expliquer la chute brutale du trafic qualifié.`;
    priorite = `Vérifier immédiatement l'état des campagnes Paid Social sur mobile et auditer le parcours de paiement depuis un appareil mobile. Si aucune anomalie technique n'est identifiée dans les 4 heures, envisager une relance ciblée auprès des visiteurs récents non convertis.`;
  } else if (hasConversionAlert || hasVisitorAlert) {
    resume = `L'activité présente un ralentissement modéré, avec une légère baisse du trafic et du taux de conversion. Le chiffre d'affaires reste dans une zone de vigilance sans atteindre de seuil critique.`;
    analyse = `Les données des 14 derniers jours révèlent une tendance à la baisse amorcée sur les 2 à 3 dernières journées. Le canal mobile concentre la majorité de l'écart de performance, tandis que le canal desktop maintient un niveau de conversion satisfaisant.`;
    hypothese = `La baisse de conversion mobile pourrait être liée à une dégradation de l'expérience utilisateur sur ce canal ou à une diminution de la qualité du trafic entrant depuis les campagnes payantes.`;
    priorite = `Surveiller l'évolution du taux de conversion mobile sur les prochaines 48 heures. Vérifier les optimisations récentes du tunnel d'achat et la qualité des audiences Paid Social.`;
  } else if (hasOpportunity) {
    resume = `Les indicateurs globaux sont globalement stables avec un signal positif notable sur le panier moyen, suggérant une opportunité d'accélération à saisir.`;
    analyse = `La progression du panier moyen traduit une montée en valeur des transactions sur les segments organiques desktop. Ce signal est cohérent avec un comportement d'achat plus engagé de la clientèle fidèle.`;
    hypothese = `Les clients récurrents répondent positivement aux offres actuelles. Une action ciblée d'upsell ou de cross-sell pourrait amplifier cet effet sur les prochaines 7 jours.`;
    priorite = `Mettre en place une campagne de relance orientée upsell auprès des clients actifs des 30 derniers jours pour capitaliser sur la dynamique positive du panier moyen.`;
  } else {
    resume = `L'activité de la période analysée présente une performance globalement conforme aux tendances récentes, sans anomalie majeure détectée.`;
    analyse = `Les métriques clés — chiffre d'affaires, commandes et taux de conversion — restent proches des moyennes de référence. Aucun signal de dégradation structurelle n'est identifié à ce stade.`;
    hypothese = `La stabilité observée est cohérente avec la saisonnalité habituelle. Une veille régulière est néanmoins recommandée pour anticiper toute inflexion.`;
    priorite = `Maintenir le dispositif de suivi en place et concentrer les efforts sur l'optimisation des campagnes d'acquisition à fort ROI.`;
  }

  return { resume, analyse, hypothese, priorite };
}

export function generateRecommendations(alerts: Alert[]): Recommendation[] {
  const hasCritical = alerts.some((a) => a.severity === "Critique");
  const hasConversion = alerts.some((a) => a.metric === "Taux de conversion");
  const hasVisitor = alerts.some((a) => a.metric === "Visiteurs");

  const recommendations: Recommendation[] = [];

  if (hasCritical || hasVisitor) {
    recommendations.push({
      id: "rec-paid-social",
      title: "Vérifier les campagnes Paid Social sur mobile",
      priority: "Haute",
      effort: "Faible",
      impact: "+15 à +25 % de trafic qualifié",
      explanation: "Contrôler les budgets, ciblages et créatifs des campagnes actives sur les plateformes sociales. Une anomalie de diffusion est la cause la plus probable du recul de trafic.",
    });
  }

  if (hasCritical || hasConversion) {
    recommendations.push({
      id: "rec-tunnel",
      title: "Analyser le tunnel de paiement sur mobile",
      priority: "Haute",
      effort: "Moyen",
      impact: "+8 à +12 commandes par jour",
      explanation: "Réaliser un audit complet du parcours d'achat depuis un appareil mobile. Identifier les points de friction ou erreurs techniques susceptibles de bloquer la finalisation des commandes.",
    });
  }

  recommendations.push({
    id: "rec-relance",
    title: "Relancer les clients inactifs des 30 derniers jours",
    priority: "Moyenne",
    effort: "Faible",
    impact: "+5 à +10 % de taux de réactivation",
    explanation: "Envoyer une communication ciblée avec une offre personnalisée aux clients n'ayant pas effectué d'achat depuis 30 jours. Le coût d'acquisition est minimal sur ce segment.",
  });

  recommendations.push({
    id: "rec-offre-limitee",
    title: "Créer une offre limitée pour les visiteurs récurrents",
    priority: "Moyenne",
    effort: "Moyen",
    impact: "+10 à +20 % de conversion sur segment fidèle",
    explanation: "Proposer une promotion exclusive à durée limitée aux visiteurs ayant consulté le site plus de 3 fois sans convertir. Ce levier améliore la conversion sans dégrader la marge.",
  });

  recommendations.push({
    id: "rec-surveillance",
    title: "Surveiller le taux de conversion pendant 48 h",
    priority: "Faible",
    effort: "Faible",
    impact: "Détection précoce d'une dégradation prolongée",
    explanation: "Mettre en place une alerte automatique si le taux de conversion mobile passe sous 0,9 % deux jours consécutifs. Permettra une réaction rapide avant impact significatif.",
  });

  return recommendations;
}

export function computeKPIs(data: DailyMetric[]): KPI[] {
  const today = data[data.length - 1];
  const previous7 = data.slice(-8, -1);

  const avgRevenue = calculateAverage(previous7.map((d) => d.revenue));
  const avgOrders = calculateAverage(previous7.map((d) => d.orders));
  const avgVisitors = calculateAverage(previous7.map((d) => d.visitors));
  const avgConversion = calculateAverage(previous7.map((d) => d.conversionRate));
  const avgAOV = calculateAverage(previous7.map((d) => d.averageOrderValue));

  const revenueChange = calculatePercentageChange(today.revenue, avgRevenue);
  const ordersChange = calculatePercentageChange(today.orders, avgOrders);
  const visitorsChange = calculatePercentageChange(today.visitors, avgVisitors);
  const conversionChange = calculatePercentageChange(today.conversionRate, avgConversion);
  const aovChange = calculatePercentageChange(today.averageOrderValue, avgAOV);

  const getStatus = (change: number, criticalThreshold = -20, warnThreshold = -10): KPI["status"] => {
    if (change <= criticalThreshold) return "alerte";
    if (change <= warnThreshold) return "baisse";
    if (change >= 5) return "hausse";
    return "stable";
  };

  return [
    {
      label: "Chiffre d'affaires",
      value: `${today.revenue.toLocaleString("fr-FR")} €`,
      previousAverage: `${avgRevenue.toFixed(0)} €`,
      change: revenueChange,
      status: getStatus(revenueChange),
    },
    {
      label: "Commandes",
      value: `${today.orders}`,
      previousAverage: `${avgOrders.toFixed(0)}`,
      change: ordersChange,
      status: getStatus(ordersChange),
    },
    {
      label: "Visiteurs",
      value: `${today.visitors.toLocaleString("fr-FR")}`,
      previousAverage: `${avgVisitors.toFixed(0)}`,
      change: visitorsChange,
      status: getStatus(visitorsChange, -15, -8),
    },
    {
      label: "Taux de conversion",
      value: `${today.conversionRate.toFixed(2).replace(".", ",")} %`,
      previousAverage: `${avgConversion.toFixed(2).replace(".", ",")} %`,
      change: conversionChange,
      status: getStatus(conversionChange, -15, -8),
    },
    {
      label: "Panier moyen",
      value: `${today.averageOrderValue.toFixed(0)} €`,
      previousAverage: `${avgAOV.toFixed(0)} €`,
      change: aovChange,
      status: getStatus(aovChange),
    },
  ];
}
