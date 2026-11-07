const deadlineBeforeKickoff = (iso) => new Date(Date.parse(iso) - 60 * 60 * 1000).toISOString();

// Agenda conferida na CBF em 06/11/2026; prazos revisados em 07/11 antes do push.
// Horários de início em Brasília (UTC-3).
const copaSource = "CBF — https://www.cbf.com.br/futebol-brasileiro/tabelas/copa-do-brasil/masculino/2026/2002?documento=Tabela+Detalhada";
const reschedulingCriteria = "Em caso de adiamento, aguardar a partida. Cancelamento definitivo sem resultado oficial resolve NÃO.";

export const seasonMarkets = [
  {
    title: "Vasco e Palmeiras terão gols dos dois times?",
    description: "Em 08/11, às 17h de Brasília, Vasco e Palmeiras jogam em São Januário pela volta da semifinal.",
    category: "Copa do Brasil 2026",
    deadline: deadlineBeforeKickoff("2026-11-08T17:00:00-03:00"),
    resolutionSource: copaSource,
    resolutionCriteria: `Resolver SIM se Vasco e Palmeiras marcarem pelo menos um gol cada nos 90 minutos e acréscimos, conforme o placar oficial da CBF. Se um dos times terminar sem marcar, resolve NÃO. Excluir cobranças de desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 150
  },
  {
    title: "O Grêmio vai à final da Copa do Brasil?",
    description: "Em 07/11, às 18h de Brasília, o Atlético-MG recebe o Grêmio na Arena MRV pela volta da semifinal.",
    category: "Copa do Brasil 2026",
    deadline: deadlineBeforeKickoff("2026-11-07T18:00:00-03:00"),
    resolutionSource: copaSource,
    resolutionCriteria: `Resolver SIM se a CBF confirmar o Grêmio como classificado para a final, incluindo eventual decisão por pênaltis. Classificação do Atlético-MG resolve NÃO. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O Flamengo vai à final da Copa do Brasil Feminina?",
    description: "Em 07/11, às 21h30 de Brasília, o Flamengo recebe o Bahia no Luso Brasileiro pela volta da semifinal.",
    category: "Copa do Brasil Feminina 2026",
    deadline: deadlineBeforeKickoff("2026-11-07T21:30:00-03:00"),
    resolutionSource: "CBF — https://www.cbf.com.br/futebol-brasileiro/noticias/copa-brasil-feminina/a/copa-do-brasil-feminina-cbf-marca-sorteio-que-definira-mando-de-campo-da-final",
    resolutionCriteria: `Resolver SIM se a CBF confirmar o Flamengo como classificado para a final, incluindo eventual decisão por pênaltis. Classificação do Bahia resolve NÃO. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Internacional vai à final da Copa do Brasil Feminina?",
    description: "Em 08/11, às 11h de Brasília, o Bragantino recebe o Internacional no Cícero de Souza Marques pela volta da semifinal.",
    category: "Copa do Brasil Feminina 2026",
    deadline: deadlineBeforeKickoff("2026-11-08T11:00:00-03:00"),
    resolutionSource: "CBF — https://www.cbf.com.br/futebol-brasileiro/jogos/copa-do-brasil/feminino/2026/red-bull-bragantino-x-internacional/835452",
    resolutionCriteria: `Resolver SIM se a CBF confirmar o Internacional como classificado para a final, incluindo eventual decisão por pênaltis. Classificação do Bragantino resolve NÃO. ${reschedulingCriteria}`,
    pointsValue: 120
  },
  {
    title: "O Vasco vai à final da Copa do Brasil?",
    description: "Em 08/11, às 17h de Brasília, o Vasco recebe o Palmeiras em São Januário pela volta da semifinal.",
    category: "Copa do Brasil 2026",
    deadline: deadlineBeforeKickoff("2026-11-08T17:00:00-03:00"),
    resolutionSource: copaSource,
    resolutionCriteria: `Resolver SIM se a CBF confirmar o Vasco como classificado para a final, incluindo eventual decisão por pênaltis. Classificação do Palmeiras resolve NÃO. ${reschedulingCriteria}`,
    pointsValue: 150
  }
];
