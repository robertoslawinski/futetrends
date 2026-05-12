export const seedMarkets = [
  {
    title: "Algum técnico de clube grande cairá até o fim de maio?",
    description: "Pressão de torcida, diretoria e imprensa: mercado sobre troca de comando em Flamengo, Palmeiras, Corinthians, São Paulo, Santos, Vasco, Botafogo, Fluminense, Grêmio, Internacional, Atlético-MG ou Cruzeiro.",
    category: "Pressão nos clubes",
    deadline: "2026-05-31T23:59:00.000Z",
    resolutionSource: "Comunicado oficial do clube ou registro oficial da CBF",
    resolutionCriteria: "Resolver SIM se qualquer um dos clubes listados anunciar saída, demissão, licença ou substituição do técnico principal até 31/05/2026. Caso contrário, resolver NÃO.",
    pointsValue: 180
  },
  {
    title: "A rodada terá pelo menos um clube reclamando oficialmente da arbitragem?",
    description: "Mercado sobre bastidor quente: nota oficial, entrevista institucional ou representação formal contra arbitragem após jogos da rodada.",
    category: "Arbitragem e VAR",
    deadline: "2026-05-19T23:59:00.000Z",
    resolutionSource: "Site oficial do clube, CBF, STJD ou comunicação oficial publicada pelo clube",
    resolutionCriteria: "Resolver SIM se um clube da Série A publicar reclamação oficial, representação formal ou pedido público de explicação sobre arbitragem/VAR referente à rodada 16. Reclamação apenas de jogador em zona mista não conta.",
    pointsValue: 160
  },
  {
    title: "Haverá pênalti marcado com ajuda do VAR em algum jogo da rodada 16?",
    description: "Mercado técnico sobre interferência do VAR em lance capital de pênalti.",
    category: "Arbitragem e VAR",
    deadline: "2026-05-18T02:30:00.000Z",
    resolutionSource: "Súmulas da CBF, relatório de arbitragem ou áudio/protocolo oficial do VAR",
    resolutionCriteria: "Resolver SIM se qualquer jogo da rodada 16 tiver pênalti marcado após revisão ou recomendação do VAR. Pênalti marcado diretamente em campo sem intervenção do VAR resolve NÃO para este mercado.",
    pointsValue: 150
  },
  {
    title: "Palmeiras vence o Cruzeiro e aumenta a pressão na parte de cima?",
    description: "Leitura de campo e tabela: Palmeiras recebe o Cruzeiro na rodada 16 e tenta sustentar narrativa de força no Brasileirão.",
    category: "Próxima rodada",
    deadline: "2026-05-16T23:30:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Palmeiras x Cruzeiro",
    resolutionCriteria: "Resolver SIM se o Palmeiras vencer o Cruzeiro no tempo regulamentar. Empate ou vitória do Cruzeiro resolve NÃO.",
    pointsValue: 110
  },
  {
    title: "Flamengo vence o Athletico-PR fora e chega forte para o confronto direto?",
    description: "Mercado de termômetro rubro-negro antes de sequência decisiva no Brasileirão.",
    category: "Próxima rodada",
    deadline: "2026-05-17T22:30:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Athletico-PR x Flamengo",
    resolutionCriteria: "Resolver SIM se o Flamengo vencer o Athletico-PR no tempo regulamentar. Empate ou vitória do Athletico-PR resolve NÃO.",
    pointsValue: 120
  },
  {
    title: "Botafogo vence o Corinthians e aumenta a crise no Parque São Jorge?",
    description: "Mercado sobre resultado com impacto político e esportivo no Corinthians.",
    category: "Pressão nos clubes",
    deadline: "2026-05-17T19:00:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Botafogo x Corinthians",
    resolutionCriteria: "Resolver SIM se o Botafogo vencer o Corinthians no tempo regulamentar. Empate ou vitória do Corinthians resolve NÃO.",
    pointsValue: 130
  },
  {
    title: "Santos tropeça contra o Coritiba e vê a cobrança aumentar?",
    description: "Mercado sobre um jogo de pressão para o Santos em casa na rodada 16.",
    category: "Pressão nos clubes",
    deadline: "2026-05-17T14:00:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Santos x Coritiba",
    resolutionCriteria: "Resolver SIM se o Santos não vencer o Coritiba no tempo regulamentar. Vitória do Santos resolve NÃO.",
    pointsValue: 125
  },
  {
    title: "Bahia vence o Grêmio e entra no debate de surpresa da rodada?",
    description: "Mercado sobre afirmação do Bahia contra um rival tradicional da Série A.",
    category: "Próxima rodada",
    deadline: "2026-05-17T19:00:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Bahia x Grêmio",
    resolutionCriteria: "Resolver SIM se o Bahia vencer o Grêmio no tempo regulamentar. Empate ou vitória do Grêmio resolve NÃO.",
    pointsValue: 115
  },
  {
    title: "Algum clube do G-6 perderá para time fora do G-10 na rodada 16?",
    description: "Mercado de leitura de tabela: risco de tropeço dos favoritos contra adversários de meio/baixo da classificação.",
    category: "Tabela e tendência",
    deadline: "2026-05-18T02:30:00.000Z",
    resolutionSource: "Classificação oficial da CBF antes da rodada 16 e súmulas oficiais da rodada",
    resolutionCriteria: "Resolver SIM se pelo menos um clube que iniciou a rodada 16 no G-6 perder para adversário que iniciou a rodada fora do G-10. Caso contrário, resolver NÃO.",
    pointsValue: 170
  },
  {
    title: "Pedro seguirá entre os dois maiores artilheiros após a rodada 17?",
    description: "Mercado de artilharia e narrativa individual sobre o atacante do Flamengo.",
    category: "Artilharia",
    deadline: "2026-05-23T23:30:00.000Z",
    resolutionSource: "Ranking de artilharia do ge ou estatísticas oficiais da CBF após a rodada 17",
    resolutionCriteria: "Resolver SIM se Pedro estiver empatado ou isolado entre as duas primeiras posições do ranking de artilheiros do Brasileirão após a rodada 17. Caso contrário, resolver NÃO.",
    pointsValue: 125
  },
  {
    title: "Neymar será convocado por Carlo Ancelotti para a Copa?",
    description: "Mercado que divide torcedores: nome, peso midiático, condição física e decisão final da comissão da Seleção.",
    category: "Seleção Brasileira",
    deadline: "2026-05-18T20:00:00.000Z",
    resolutionSource: "Lista oficial da CBF divulgada em 18 de maio de 2026",
    resolutionCriteria: "Resolver SIM se Neymar estiver na lista final de 26 convocados do Brasil para a Copa do Mundo de 2026. Caso não esteja na lista, resolver NÃO.",
    pointsValue: 160
  },
  {
    title: "Estêvão será chamado para a Copa como aposta de impacto?",
    description: "Mercado sobre juventude, talento e coragem da lista final da Seleção.",
    category: "Seleção Brasileira",
    deadline: "2026-05-18T20:00:00.000Z",
    resolutionSource: "Lista oficial da CBF divulgada em 18 de maio de 2026",
    resolutionCriteria: "Resolver SIM se Estêvão estiver na lista final de 26 convocados do Brasil para a Copa do Mundo de 2026. Caso não esteja na lista, resolver NÃO.",
    pointsValue: 170
  },
  {
    title: "A convocação terá pelo menos três jogadores de clubes brasileiros?",
    description: "Mercado sobre força doméstica, lobby esportivo e espaço do Brasileirão na lista de Carlo Ancelotti.",
    category: "Seleção Brasileira",
    deadline: "2026-05-18T20:00:00.000Z",
    resolutionSource: "Lista oficial da CBF divulgada em 18 de maio de 2026",
    resolutionCriteria: "Resolver SIM se pelo menos três jogadores convocados estiverem registrados em clubes brasileiros na data da convocação. Com dois ou menos, resolver NÃO.",
    pointsValue: 150
  },
  {
    title: "Algum presidente ou dirigente de clube grande criticará publicamente a CBF até 24/05?",
    description: "Mercado de política do futebol: calendário, arbitragem, bastidor e pressão institucional.",
    category: "Bastidores",
    deadline: "2026-05-24T23:59:00.000Z",
    resolutionSource: "Entrevista registrada por veículo jornalístico, nota oficial do clube ou publicação oficial do dirigente",
    resolutionCriteria: "Resolver SIM se presidente, vice-presidente de futebol, CEO ou diretor executivo de futebol de clube grande fizer crítica pública direta à CBF, arbitragem da CBF ou calendário da CBF até 24/05/2026. Caso contrário, resolver NÃO.",
    pointsValue: 190
  }
];
