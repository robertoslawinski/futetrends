const deadlineBeforeKickoff = (iso) => new Date(Date.parse(iso) - 60 * 60 * 1000).toISOString();

// Rodada de 30/10 a 05/11/2026. Agenda conferida na CBF em 30/10/2026.
// Horários de início em Brasília (UTC-3); os prazos são calculados em UTC.
// A agenda da CONMEBOL não prevê Libertadores ou Sul-Americana nesta janela.
const serieASource = "CBF — agenda oficial do Brasileirão Série A 2026: https://credencial.cbf.com.br/competicoes/listar/42/1; resultado e súmula oficiais da CBF.";

export const seasonMarkets = [
  {
    title: "O Santos vencerá o Red Bull Bragantino?",
    description: "Em 02/11, às 20h de Brasília, o Santos visita o Bragantino no Cícero de Souza Marques pela 34ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-02T20:00:00-03:00"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Santos vencer o Red Bull Bragantino nos 90 minutos regulamentares, incluindo os acréscimos, conforme resultado oficial da CBF; empate ou derrota resolve NÃO. Em caso de adiamento, aguardar o jogo. Cancelamento definitivo sem resultado oficial resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "O Flamengo vencerá o Grêmio?",
    description: "Em 04/11, às 19h30 de Brasília, o Flamengo recebe o Grêmio no Maracanã pela 34ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-04T19:30:00-03:00"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Flamengo vencer o Grêmio nos 90 minutos regulamentares, incluindo os acréscimos, conforme resultado oficial da CBF; empate ou derrota resolve NÃO. Em caso de adiamento, aguardar o jogo. Cancelamento definitivo sem resultado oficial resolve NÃO.",
    pointsValue: 130
  },
  {
    title: "O Vasco vencerá o Athletico-PR fora de casa?",
    description: "Em 04/11, às 19h30 de Brasília, o Vasco visita o Athletico-PR na Arena da Baixada pela 34ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-04T19:30:00-03:00"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Vasco vencer o Athletico-PR nos 90 minutos regulamentares, incluindo os acréscimos, conforme resultado oficial da CBF; empate ou derrota resolve NÃO. Em caso de adiamento, aguardar o jogo. Cancelamento definitivo sem resultado oficial resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "O Botafogo vencerá o Atlético-MG?",
    description: "Em 04/11, às 21h30 de Brasília, o Botafogo recebe o Atlético-MG no Nilton Santos pela 34ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-04T21:30:00-03:00"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Botafogo vencer o Atlético-MG nos 90 minutos regulamentares, incluindo os acréscimos, conforme resultado oficial da CBF; empate ou derrota resolve NÃO. Em caso de adiamento, aguardar o jogo. Cancelamento definitivo sem resultado oficial resolve NÃO.",
    pointsValue: 140
  },
  {
    title: "São Paulo e Corinthians terão gols dos dois times?",
    description: "Em 04/11, às 21h30 de Brasília, São Paulo e Corinthians disputam o clássico na Vila Belmiro pela 34ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-04T21:30:00-03:00"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se São Paulo e Corinthians marcarem pelo menos um gol cada nos 90 minutos regulamentares, incluindo os acréscimos, conforme resultado oficial da CBF; se um dos times terminar sem marcar, resolve NÃO. Em caso de adiamento, aguardar o jogo. Cancelamento definitivo sem resultado oficial resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "O Palmeiras vencerá o Remo?",
    description: "Em 05/11, às 19h30 de Brasília, o Palmeiras recebe o Remo no Nubank Parque pela 34ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-11-05T19:30:00-03:00"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Palmeiras vencer o Remo nos 90 minutos regulamentares, incluindo os acréscimos, conforme resultado oficial da CBF; empate ou derrota resolve NÃO. Em caso de adiamento, aguardar o jogo. Cancelamento definitivo sem resultado oficial resolve NÃO.",
    pointsValue: 120
  }
];
