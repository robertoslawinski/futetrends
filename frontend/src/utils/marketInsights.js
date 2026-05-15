export function getMarketInsight(market) {
  const yes = market.voteBreakdown?.yesPercent || 0;
  const no = market.voteBreakdown?.noPercent || 0;
  const total = market.totalVotes || 0;
  const leadingOption = yes >= no ? "SIM" : "NÃO";
  const leadingPercent = Math.max(yes, no);
  const gap = Math.abs(yes - no);

  if (!total) {
    return {
      label: "Sem consenso ainda",
      detail: "Primeiros palpites definem a leitura inicial da torcida.",
      leadingOption,
      leadingPercent: 0,
      tone: "neutral"
    };
  }

  if (gap <= 12) {
    return {
      label: "Mercado dividido",
      detail: "A torcida está rachada. Bom mercado para testar leitura própria.",
      leadingOption,
      leadingPercent,
      tone: "split"
    };
  }

  if (leadingPercent >= 70) {
    return {
      label: "Consenso forte",
      detail: `${leadingPercent}% da comunidade está em ${leadingOption}.`,
      leadingOption,
      leadingPercent,
      tone: "strong"
    };
  }

  return {
    label: "Tendência da torcida",
    detail: `${leadingPercent}% da comunidade pende para ${leadingOption}.`,
    leadingOption,
    leadingPercent,
    tone: "trend"
  };
}

export function getDataValueCopy(market) {
  const category = market.category?.toLowerCase() || "";
  if (category.includes("arbitragem")) return "Mede quanto o VAR virou personagem da rodada antes da análise oficial.";
  if (category.includes("selec")) return "Mostra quais nomes mobilizam confiança, dúvida e pressão pública antes da lista.";
  if (category.includes("press")) return "Transforma sensação de crise em sinal mensurável por clube e rodada.";
  if (category.includes("tabela")) return "Revela onde a torcida enxerga tropeço, arrancada ou virada de narrativa.";
  return "Converte leitura de torcida em dado comparável antes do fato acontecer.";
}
