export const seedMarkets = [
  {
    title: "Fluminense vence o São Paulo e muda o clima da rodada?",
    description: "Duelo de peso entre Rio e São Paulo: resultado pode virar argumento sobre momento, elenco e pressão para os dois lados.",
    category: "Próxima rodada",
    deadline: "2026-05-16T21:45:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Fluminense x São Paulo",
    resolutionCriteria: "Resolver SIM se o Fluminense vencer o São Paulo no tempo regulamentar. Empate ou vitória do São Paulo resolve NÃO.",
    pointsValue: 130
  },
  {
    title: "São Paulo sai do Maracanã sem perder?",
    description: "Um ponto fora contra o Fluminense pode dar fôlego; derrota recoloca cobrança na conversa da torcida.",
    category: "Próxima rodada",
    deadline: "2026-05-16T21:45:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Fluminense x São Paulo",
    resolutionCriteria: "Resolver SIM se o São Paulo empatar ou vencer o Fluminense. Vitória do Fluminense resolve NÃO.",
    pointsValue: 120
  },
  {
    title: "Vasco pontua fora contra o Internacional?",
    description: "Jogo em Porto Alegre com leitura direta de pressão: pontuar fora pode reduzir cobrança em São Januário.",
    category: "Pressão nos clubes",
    deadline: "2026-05-16T21:15:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Internacional x Vasco",
    resolutionCriteria: "Resolver SIM se o Vasco empatar ou vencer o Internacional. Vitória do Internacional resolve NÃO.",
    pointsValue: 135
  },
  {
    title: "Internacional vence o Vasco e aumenta a pressão cruz-maltina?",
    description: "Vitória colorada pode virar pauta dupla: força em casa e nova cobrança sobre o Vasco.",
    category: "Pressão nos clubes",
    deadline: "2026-05-16T21:15:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Internacional x Vasco",
    resolutionCriteria: "Resolver SIM se o Internacional vencer o Vasco no tempo regulamentar. Empate ou vitória do Vasco resolve NÃO.",
    pointsValue: 125
  },
  {
    title: "Atlético-MG vence o Mirassol na MRV Arena?",
    description: "Favorito em casa, o Atlético-MG entra com obrigação de resultado; tropeço vira narrativa de alerta.",
    category: "Próxima rodada",
    deadline: "2026-05-16T21:15:00.000Z",
    resolutionSource: "Súmula oficial da CBF do jogo Atlético-MG x Mirassol",
    resolutionCriteria: "Resolver SIM se o Atlético-MG vencer o Mirassol no tempo regulamentar. Empate ou vitória do Mirassol resolve NÃO.",
    pointsValue: 115
  },
  {
    title: "Flamengo terá reação pública forte após derrota na Copa do Brasil?",
    description: "Depois de resultado pesado, qualquer nota, entrevista ou cobrança institucional pode dominar o noticiário.",
    category: "Bastidores",
    deadline: "2026-05-19T23:59:00.000Z",
    resolutionSource: "Site oficial do Flamengo, entrevistas coletivas, CBF, ge, Globo Esporte ou veículos nacionais com fala identificada",
    resolutionCriteria: "Resolver SIM se presidente, diretor, técnico ou jogador do Flamengo fizer crítica pública direta ao desempenho, arbitragem, calendário ou cobrança da torcida até 19/05/2026. Caso contrário, resolver NÃO.",
    pointsValue: 150
  },
  {
    title: "Botafogo terá cobrança pública após derrota para a Chapecoense?",
    description: "Resultado de Copa do Brasil contra adversário de menor investimento pode aumentar ruído interno e pressão externa.",
    category: "Pressão nos clubes",
    deadline: "2026-05-19T23:59:00.000Z",
    resolutionSource: "Site oficial do Botafogo, entrevistas coletivas, ge, Globo Esporte ou veículos nacionais com fala identificada",
    resolutionCriteria: "Resolver SIM se técnico, dirigente ou jogador do Botafogo reconhecer publicamente cobrança, crise, pressão ou protesto da torcida até 19/05/2026. Caso contrário, resolver NÃO.",
    pointsValue: 145
  },
  {
    title: "Corinthians passará sem susto público após vencer na Copa do Brasil?",
    description: "Mesmo vencendo, o ambiente pode seguir quente se a atuação gerar cobrança da torcida.",
    category: "Pressão nos clubes",
    deadline: "2026-05-18T23:59:00.000Z",
    resolutionSource: "Site oficial do Corinthians, entrevistas coletivas, ge, Globo Esporte ou veículos nacionais com fala identificada",
    resolutionCriteria: "Resolver SIM se não houver protesto registrado, nota crítica de organizada, crítica pública de dirigente ou fala oficial reconhecendo pressão até 18/05/2026. Se houver qualquer um desses eventos, resolver NÃO.",
    pointsValue: 130
  },
  {
    title: "Palmeiras manterá narrativa de força após goleada na Copa do Brasil?",
    description: "Goleada fora cria hype; a pergunta é se o clube sustentará a leitura positiva na próxima pauta pública.",
    category: "Narrativas da semana",
    deadline: "2026-05-19T23:59:00.000Z",
    resolutionSource: "ge, Globo Esporte, ESPN, UOL Esporte ou coletiva oficial do Palmeiras",
    resolutionCriteria: "Resolver SIM se pelo menos dois veículos nacionais citarem o Palmeiras em contexto de força, favoritismo, elenco dominante ou sequência positiva até 19/05/2026. Caso contrário, resolver NÃO.",
    pointsValue: 135
  },
  {
    title: "Algum dos oito grandes Rio-SP perderá na próxima janela da API?",
    description: "Mercado de leitura rápida sobre risco de crise nos clubes que mais movem audiência nacional.",
    category: "Tabela e tendência",
    deadline: "2026-05-18T02:30:00.000Z",
    resolutionSource: "Súmulas oficiais da CBF ou CONMEBOL dos jogos envolvendo Flamengo, Vasco, Fluminense, Botafogo, Corinthians, Palmeiras, São Paulo e Santos",
    resolutionCriteria: "Resolver SIM se pelo menos um dos oito clubes listados perder um jogo oficial entre 16/05/2026 e 18/05/2026. Se nenhum deles perder no período, resolver NÃO.",
    pointsValue: 170
  },
  {
    title: "A rodada terá reclamação oficial de arbitragem ou VAR?",
    description: "Arbitragem segue sendo uma das faíscas mais fortes do futebol brasileiro.",
    category: "Arbitragem e VAR",
    deadline: "2026-05-19T23:59:00.000Z",
    resolutionSource: "Site oficial do clube, CBF, STJD ou comunicação oficial publicada pelo clube",
    resolutionCriteria: "Resolver SIM se qualquer clube da Série A publicar reclamação oficial, representação formal ou pedido público de explicação sobre arbitragem/VAR referente à rodada. Reclamação apenas de jogador em zona mista não conta.",
    pointsValue: 160
  },
  {
    title: "Haverá pênalti marcado com ajuda do VAR nos jogos em foco?",
    description: "Um único lance pode mudar resultado, coletiva e clima da semana.",
    category: "Arbitragem e VAR",
    deadline: "2026-05-18T02:30:00.000Z",
    resolutionSource: "Súmulas da CBF, relatório de arbitragem ou áudio/protocolo oficial do VAR",
    resolutionCriteria: "Resolver SIM se qualquer jogo em foco do Brasileirão Série A entre 16/05/2026 e 18/05/2026 tiver pênalti marcado após revisão ou recomendação do VAR. Pênalti marcado diretamente em campo sem intervenção do VAR resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "Neymar será convocado por Carlo Ancelotti para a Copa?",
    description: "Nome, mídia, condição física e debate público: a lista pode dividir o país.",
    category: "Seleção Brasileira",
    deadline: "2026-05-18T20:00:00.000Z",
    resolutionSource: "Lista oficial da CBF divulgada em 18 de maio de 2026",
    resolutionCriteria: "Resolver SIM se Neymar estiver na lista final de 26 convocados do Brasil para a Copa do Mundo de 2026. Caso não esteja na lista, resolver NÃO.",
    pointsValue: 160
  },
  {
    title: "A convocação terá pelo menos três jogadores de clubes brasileiros?",
    description: "Mede a força do futebol doméstico na lista e o peso político da convocação.",
    category: "Seleção Brasileira",
    deadline: "2026-05-18T20:00:00.000Z",
    resolutionSource: "Lista oficial da CBF divulgada em 18 de maio de 2026",
    resolutionCriteria: "Resolver SIM se pelo menos três jogadores convocados estiverem registrados em clubes brasileiros na data da convocação. Com dois ou menos, resolver NÃO.",
    pointsValue: 150
  }
];
