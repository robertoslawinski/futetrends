const deadlineBeforeKickoff = (iso) => new Date(Date.parse(iso) - 60 * 60 * 1000).toISOString();

// Agenda conferida na tabela detalhada e no credenciamento da CBF em 13/11/2026.
// Janela: 13 a 19/11. Horários de início em Brasília (UTC-3).
// CONMEBOL: finais em 21/11 e 28/11, fora desta janela.
const brasileiraoSource = "CBF — https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-a/a/cbf-divulga-tabela-detalhada-das-rodadas-35-e-36-do-brasileirao-serie-a ; https://credencial.cbf.com.br/competicoes/listar/42/1";
const reschedulingCriteria = "Em caso de adiamento, aguardar a partida. Cancelamento definitivo sem resultado oficial resolve NÃO.";

export const seasonMarkets = [
  {
    title: "O Santos vence o Coritiba em 18/11?",
    description: "Coritiba x Santos, em 18/11 às 19h30 de Brasília, no Couto Pereira, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-18T19:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Santos vencer o Coritiba nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Coritiba resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O Flamengo vence o Athletico-PR em 18/11?",
    description: "Flamengo x Athletico-PR, em 18/11 às 20h30 de Brasília, no Maracanã, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-18T20:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Flamengo vencer o Athletico-PR nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Athletico-PR resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 120
  },
  {
    title: "O Palmeiras vence o Cruzeiro em 18/11?",
    description: "Cruzeiro x Palmeiras, em 18/11 às 20h30 de Brasília, no Mineirão, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-18T20:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Palmeiras vencer o Cruzeiro nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Cruzeiro resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Corinthians vence o Botafogo em 18/11?",
    description: "Corinthians x Botafogo, em 18/11 às 21h30 de Brasília, na Neo Química Arena, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-18T21:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Corinthians vencer o Botafogo nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Botafogo resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O Botafogo vence o Corinthians em 18/11?",
    description: "Corinthians x Botafogo, em 18/11 às 21h30 de Brasília, na Neo Química Arena, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-18T21:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Botafogo vencer o Corinthians nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Corinthians resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Vasco vence o Internacional em 19/11?",
    description: "Vasco x Internacional, em 19/11 às 19h30 de Brasília, em São Januário, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-19T19:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Vasco vencer o Internacional nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Internacional resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O São Paulo vence o Fluminense em 19/11?",
    description: "São Paulo x Fluminense, em 19/11 às 21h30 de Brasília, no Morumbis, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-19T21:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o São Paulo vencer o Fluminense nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do Fluminense resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O Fluminense vence o São Paulo em 19/11?",
    description: "São Paulo x Fluminense, em 19/11 às 21h30 de Brasília, no Morumbis, pela 35ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-19T21:30:00-03:00"),
    resolutionSource: brasileiraoSource,
    resolutionCriteria: `Resolver SIM se o Fluminense vencer o São Paulo nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou vitória do São Paulo resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  }
];
