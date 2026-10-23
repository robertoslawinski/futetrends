const deadlineBeforeKickoff = (iso) => iso;

const serieASource = "Tabela e súmula oficiais do Campeonato Brasileiro Série A 2026 publicadas pela CBF";

export const seasonMarkets = [
  {
    title: "O São Paulo vencerá o Mirassol fora de casa?",
    description: "O São Paulo visita o Mirassol pela 32ª rodada e precisa confirmar sua força longe do Morumbis.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-24T18:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o São Paulo vencer o Mirassol após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 120
  },
  {
    title: "O Corinthians vencerá o Vasco em São Januário?",
    description: "Vasco e Corinthians se enfrentam em um duelo direto que pode mexer com a pressão sobre os dois clubes.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-24T20:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Corinthians vencer o Vasco após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 140
  },
  {
    title: "O Palmeiras vencerá o Red Bull Bragantino?",
    description: "O Palmeiras recebe o Bragantino antes de uma sequência decisiva no Brasileirão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-24T20:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Palmeiras vencer o Red Bull Bragantino após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 120
  },
  {
    title: "O Botafogo vencerá o Internacional no Beira-Rio?",
    description: "O Botafogo encara um dos jogos mais difíceis da rodada longe de casa.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-24T18:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Botafogo vencer o Internacional após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "O Flamengo vencerá o Atlético-MG no Maracanã?",
    description: "Flamengo e Atlético-MG fecham a 32ª rodada em um confronto de alta pressão.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-26T22:00:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Flamengo vencer o Atlético-MG após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 130
  },
  {
    title: "Fluminense e Internacional marcarão gols no Maracanã?",
    description: "A pergunta é direta: os dois times conseguirão balançar a rede na abertura da 33ª rodada?",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-28T21:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se Fluminense e Internacional marcarem pelo menos um gol cada durante os 90 minutos regulamentares, incluindo os acréscimos. Se um dos clubes terminar sem marcar, resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "O Palmeiras vencerá o Santos na Vila Belmiro?",
    description: "O clássico paulista coloca o Palmeiras diante do Santos fora de casa na 33ª rodada.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-28T21:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Palmeiras vencer o Santos após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 140
  },
  {
    title: "O Botafogo vencerá o Remo no Mangueirão?",
    description: "O Botafogo viaja a Belém para um confronto que pode influenciar as duas pontas da tabela.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-28T23:30:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Botafogo vencer o Remo após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "Vasco e Flamengo terão gols dos dois times?",
    description: "O clássico carioca da 33ª rodada promete tensão e vale uma leitura sobre o poder ofensivo dos rivais.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-29T22:00:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se Vasco e Flamengo marcarem pelo menos um gol cada durante os 90 minutos regulamentares, incluindo os acréscimos. Se um dos clubes terminar sem marcar, resolve NÃO.",
    pointsValue: 160
  },
  {
    title: "O Corinthians vencerá o Mirassol na Neo Química Arena?",
    description: "O Corinthians fecha a rodada em casa com a obrigação de responder à pressão da tabela.",
    category: "Brasileirão 2026",
    deadline: deadlineBeforeKickoff("2026-10-30T22:00:00.000Z"),
    resolutionSource: serieASource,
    resolutionCriteria: "Resolver SIM se o Corinthians vencer o Mirassol após os 90 minutos regulamentares, incluindo os acréscimos. Empate, derrota ou cancelamento sem resultado oficial resolve NÃO.",
    pointsValue: 130
  }
];
