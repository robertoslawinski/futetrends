const deadlineBeforeKickoff = (iso) => new Date(Date.parse(iso) - 60 * 60 * 1000).toISOString();

// Agenda conferida nas tabelas detalhadas oficiais da CBF em 20/11/2026.
// Janela: 20 a 26/11. Horários de início em Brasília (UTC-3).
// CONMEBOL consultada: Sul-Americana em 21/11; Libertadores em 28/11 (fora).
// Seleção desta semana prioriza os oito clubes no Brasileirão.
const brasileirao36Source = "CBF — https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/Tabela_Detalhada_Brasileiro_Serie_A_2026_35_e_36_rodada_e41122dd5b.pdf ; https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/Tabela_Detalhada_BSA_2026_04_11_7e8eea9eb8.pdf";
const brasileirao37Source = "CBF — https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro/campeonato-brasileiro-serie-a/cbf-publica-tabela-detalhada-das-duas-rodadas-finais-do-brasileirao ; https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/Tabela_Detalhada_Brasileiro_Serie_A_2026_37_e_38_rodada_ca107fa561.pdf";
const reschedulingCriteria = "Em caso de adiamento, aguardar a partida. Cancelamento definitivo sem resultado oficial resolve NÃO.";

export const seasonMarkets = [
  {
    title: "O Palmeiras vence o Flamengo em 21/11?",
    description: "Palmeiras x Flamengo, em 21/11 às 16h30 de Brasília, no estádio Nubank Parque, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-21T16:30:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Palmeiras vencer o Flamengo nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Flamengo vence o Palmeiras em 21/11?",
    description: "Palmeiras x Flamengo, em 21/11 às 16h30 de Brasília, no estádio Nubank Parque, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-21T16:30:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Flamengo vencer o Palmeiras nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Fluminense vence o Mirassol em 22/11?",
    description: "Fluminense x Mirassol, em 22/11 às 18h30 de Brasília, no estádio Maracanã, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-22T18:30:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Fluminense vencer o Mirassol nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 120
  },
  {
    title: "O Vasco vence o Red Bull Bragantino em 22/11?",
    description: "Red Bull Bragantino x Vasco, em 22/11 às 19h30 de Brasília, no estádio Cícero de Souza Marques, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-22T19:30:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Vasco vencer o Red Bull Bragantino nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Botafogo vence o São Paulo em 23/11?",
    description: "Botafogo x São Paulo, em 23/11 às 20h00 de Brasília, no estádio Nilton Santos, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-23T20:00:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Botafogo vencer o São Paulo nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O São Paulo vence o Botafogo em 23/11?",
    description: "Botafogo x São Paulo, em 23/11 às 20h00 de Brasília, no estádio Nilton Santos, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-23T20:00:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o São Paulo vencer o Botafogo nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O Santos vence o Grêmio em 23/11?",
    description: "Santos x Grêmio, em 23/11 às 21h00 de Brasília, no estádio Morumbis, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-23T21:00:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Santos vencer o Grêmio nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 130
  },
  {
    title: "O Palmeiras vence a Chapecoense em 24/11?",
    description: "Chapecoense x Palmeiras, em 24/11 às 18h00 de Brasília, no estádio Arena Condá, pela 37ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-24T18:00:00-03:00"),
    resolutionSource: brasileirao37Source,
    resolutionCriteria: `Resolver SIM se o Palmeiras vencer a Chapecoense nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 120
  },
  {
    title: "O Corinthians vence o Atlético-MG em 25/11?",
    description: "Atlético-MG x Corinthians, em 25/11 às 20h00 de Brasília, no estádio Arena MRV, pela 36ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-25T20:00:00-03:00"),
    resolutionSource: brasileirao36Source,
    resolutionCriteria: `Resolver SIM se o Corinthians vencer o Atlético-MG nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 140
  },
  {
    title: "O São Paulo vence o Remo em 26/11?",
    description: "São Paulo x Remo, em 26/11 às 20h00 de Brasília, no estádio Morumbis, pela 37ª rodada do Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-26T20:00:00-03:00"),
    resolutionSource: brasileirao37Source,
    resolutionCriteria: `Resolver SIM se o São Paulo vencer o Remo nos 90 minutos e acréscimos, conforme o resultado oficial da CBF. Empate ou derrota resolve NÃO. Excluir eventual prorrogação e desempate por pênaltis. ${reschedulingCriteria}`,
    pointsValue: 120
  }
];
