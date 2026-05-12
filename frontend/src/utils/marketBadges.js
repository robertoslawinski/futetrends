export function getMarketBadges(market) {
  const text = [
    market.category,
    market.resolutionSource,
    market.resolutionCriteria
  ].join(" ").toLowerCase();

  const badges = [];
  if (text.includes("cbf")) badges.push("Fonte CBF");
  if (text.includes("ge")) badges.push("Fonte ge");
  if (text.includes("súmula") || text.includes("sumula")) badges.push("Resolve por súmula");
  if (text.includes("var") || text.includes("arbitragem")) badges.push("VAR/Arbitragem");
  if (text.includes("lista oficial") || text.includes("convocados")) badges.push("Lista oficial");
  if (text.includes("classificação") || text.includes("tabela")) badges.push("Tabela oficial");
  badges.push("Critério objetivo");

  return [...new Set(badges)].slice(0, 4);
}
