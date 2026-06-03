export const seedMarkets = [
  {
    title: "Brasil vence Marrocos na estreia da Copa 2026?",
    description: "A estreia contra Marrocos deve definir o tom emocional da Seleção: autoridade imediata ou pressão logo no primeiro jogo.",
    category: "Copa 2026 - Estreia",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Brasil x Marrocos, Grupo C da Copa do Mundo FIFA 2026",
    resolutionCriteria: "Resolver SIM se o Brasil vencer Marrocos no tempo regulamentar da partida do Grupo C em 13/06/2026. Empate ou vitória de Marrocos resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "Brasil termina o primeiro tempo vencendo Marrocos?",
    description: "Um início forte derruba ansiedade. Um primeiro tempo travado muda a conversa sobre ataque, escalação e pressão.",
    category: "Copa 2026 - Estreia",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Brasil x Marrocos, placar de intervalo",
    resolutionCriteria: "Resolver SIM se o Brasil estiver vencendo Marrocos no intervalo. Empate ou vantagem de Marrocos no intervalo resolve NÃO.",
    pointsValue: 135
  },
  {
    title: "Brasil faz pelo menos 2 gols contra Marrocos?",
    description: "Mais de um gol na estreia sustenta narrativa de ataque pronto para Copa. Um jogo curto alimenta cobrança.",
    category: "Copa 2026 - Estreia",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Brasil x Marrocos, placar final",
    resolutionCriteria: "Resolver SIM se o Brasil marcar dois ou mais gols contra Marrocos no tempo regulamentar. Um gol ou zero gols resolve NÃO.",
    pointsValue: 145
  },
  {
    title: "Brasil não sofre gol contra Marrocos?",
    description: "Clean sheet na estreia cria sensação de controle. Sofrer gol reacende debate sobre defesa e transição.",
    category: "Copa 2026 - Estreia",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Brasil x Marrocos, placar final",
    resolutionCriteria: "Resolver SIM se Marrocos não marcar gols contra o Brasil. Qualquer gol de Marrocos resolve NÃO.",
    pointsValue: 140
  },
  {
    title: "Vini Jr participa de gol contra Marrocos?",
    description: "A primeira grande noite do camisa de impacto pode mudar o eixo da narrativa brasileira na Copa.",
    category: "Copa 2026 - Jogadores",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Brasil x Marrocos, eventos oficiais de gol e assistência",
    resolutionCriteria: "Resolver SIM se Vinícius Júnior marcar gol ou registrar assistência oficial contra Marrocos. Se não marcar nem assistir, resolver NÃO.",
    pointsValue: 160
  },
  {
    title: "Brasil terá mais posse de bola que Marrocos?",
    description: "A posse não decide tudo, mas ajuda a medir se a Seleção controlou o jogo ou ficou reativa.",
    category: "Copa 2026 - Dados do jogo",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: estatísticas oficiais de Brasil x Marrocos",
    resolutionCriteria: "Resolver SIM se o Brasil terminar a partida com porcentagem de posse de bola maior que a de Marrocos nas estatísticas oficiais da FIFA. Posse igual ou menor resolve NÃO.",
    pointsValue: 125
  },
  {
    title: "Brasil terá mais finalizações no alvo que Marrocos?",
    description: "Finalização certa mostra volume real. Esse mercado separa domínio territorial de perigo concreto.",
    category: "Copa 2026 - Dados do jogo",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: estatísticas oficiais de Brasil x Marrocos",
    resolutionCriteria: "Resolver SIM se o Brasil terminar com mais finalizações no alvo do que Marrocos. Empate ou vantagem de Marrocos nesse indicador resolve NÃO.",
    pointsValue: 130
  },
  {
    title: "Haverá pênalti em Brasil x Marrocos?",
    description: "Um pênalti na estreia muda resultado, coletiva, pressão e discussão sobre arbitragem imediatamente.",
    category: "Copa 2026 - Arbitragem",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre e relatório oficial da partida Brasil x Marrocos",
    resolutionCriteria: "Resolver SIM se qualquer pênalti for marcado para Brasil ou Marrocos durante a partida, incluindo prorrogação se houver. Se nenhum pênalti for marcado no jogo, resolver NÃO. Disputa de pênaltis não conta.",
    pointsValue: 150
  },
  {
    title: "Algum jogador será expulso em Brasil x Marrocos?",
    description: "Cartão vermelho muda o jogo e a narrativa da estreia em segundos.",
    category: "Copa 2026 - Arbitragem",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: disciplina oficial de Brasil x Marrocos",
    resolutionCriteria: "Resolver SIM se qualquer jogador de Brasil ou Marrocos receber cartão vermelho direto ou segundo amarelo na partida. Se não houver expulsão, resolver NÃO.",
    pointsValue: 155
  },
  {
    title: "Brasil vence o Haiti por 2 ou mais gols?",
    description: "Contra o Haiti, a pressão deve ser por controle e saldo. Vitória curta pode soar como alerta.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-19T23:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Brasil x Haiti, Grupo C da Copa do Mundo FIFA 2026",
    resolutionCriteria: "Resolver SIM se o Brasil vencer o Haiti por diferença de dois ou mais gols. Vitória por um gol, empate ou derrota resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "Brasil chega invicto ao jogo contra a Escócia?",
    description: "Chegar sem derrota à terceira rodada muda completamente o clima da Seleção no grupo.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-23T23:30:00.000Z",
    resolutionSource: "FIFA Match Centre e classificação oficial do Grupo C após Brasil x Haiti",
    resolutionCriteria: "Resolver SIM se o Brasil não tiver perdido para Marrocos nem para Haiti antes de enfrentar a Escócia. Uma derrota em qualquer um dos dois primeiros jogos resolve NÃO.",
    pointsValue: 145
  },
  {
    title: "Brasil vence a Escócia na última rodada do Grupo C?",
    description: "A última rodada pode ser gestão de pressão ou jogo de afirmação. O resultado define leitura para o mata-mata.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-24T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre: Escócia x Brasil, Grupo C da Copa do Mundo FIFA 2026",
    resolutionCriteria: "Resolver SIM se o Brasil vencer a Escócia no tempo regulamentar. Empate ou vitória da Escócia resolve NÃO.",
    pointsValue: 145
  },
  {
    title: "Brasil termina o Grupo C em primeiro lugar?",
    description: "Liderar o grupo reduz ruído e muda o caminho emocional do mata-mata.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Classificação oficial da FIFA do Grupo C após a última rodada",
    resolutionCriteria: "Resolver SIM se o Brasil terminar a fase de grupos em primeiro lugar no Grupo C. Qualquer outra posição resolve NÃO.",
    pointsValue: 180
  },
  {
    title: "Brasil faz 7 ou mais pontos no Grupo C?",
    description: "Sete pontos ou mais indicam campanha forte. Abaixo disso, a conversa vira margem de alerta.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Classificação oficial da FIFA do Grupo C após a última rodada",
    resolutionCriteria: "Resolver SIM se o Brasil somar sete, oito ou nove pontos na fase de grupos. Se somar seis pontos ou menos, resolver NÃO.",
    pointsValue: 175
  },
  {
    title: "Brasil marca 6 ou mais gols na fase de grupos?",
    description: "Volume ofensivo na primeira fase cria hype e fortalece a narrativa de favoritismo.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre dos três jogos do Brasil no Grupo C",
    resolutionCriteria: "Resolver SIM se o Brasil marcar seis ou mais gols somando os jogos contra Marrocos, Haiti e Escócia. Cinco gols ou menos resolve NÃO.",
    pointsValue: 170
  },
  {
    title: "Brasil sofre gol em pelo menos dois jogos do Grupo C?",
    description: "Mesmo avançando, sofrer gols em sequência pode virar pauta sobre equilíbrio defensivo.",
    category: "Copa 2026 - Grupo C",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre dos três jogos do Brasil no Grupo C",
    resolutionCriteria: "Resolver SIM se o Brasil sofrer pelo menos um gol em dois ou três jogos da fase de grupos. Se sofrer gol em zero ou apenas um jogo, resolver NÃO.",
    pointsValue: 160
  },
  {
    title: "Vini Jr marca 2 ou mais gols na fase de grupos?",
    description: "Se Vini assumir a artilharia brasileira cedo, a narrativa da Seleção passa por ele.",
    category: "Copa 2026 - Jogadores",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre dos jogos do Brasil no Grupo C",
    resolutionCriteria: "Resolver SIM se Vinícius Júnior marcar dois ou mais gols somando os três jogos do Brasil no Grupo C. Um gol ou nenhum gol resolve NÃO.",
    pointsValue: 180
  },
  {
    title: "Um jogador do Brasil dará 2 ou mais assistências no Grupo C?",
    description: "Assistências revelam quem está criando vantagem real, não só quem aparece no placar.",
    category: "Copa 2026 - Jogadores",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "FIFA Match Centre dos jogos do Brasil no Grupo C",
    resolutionCriteria: "Resolver SIM se qualquer jogador da Seleção Brasileira registrar duas ou mais assistências oficiais durante a fase de grupos. Se nenhum brasileiro alcançar duas assistências, resolver NÃO.",
    pointsValue: 175
  },
  {
    title: "Marrocos avança ao mata-mata no Grupo C?",
    description: "Marrocos chega com respeito internacional. Se avançar, pode alterar o caminho dos favoritos.",
    category: "Copa 2026 - Rivais do Brasil",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Classificação oficial da FIFA ao fim da fase de grupos da Copa 2026",
    resolutionCriteria: "Resolver SIM se Marrocos se classificar para a fase eliminatória da Copa do Mundo 2026. Se for eliminado na fase de grupos, resolver NÃO.",
    pointsValue: 150
  },
  {
    title: "Escócia avança ao mata-mata no Grupo C?",
    description: "A Escócia pode transformar o grupo em disputa nervosa se pontuar cedo.",
    category: "Copa 2026 - Rivais do Brasil",
    deadline: "2026-06-13T23:30:00.000Z",
    resolutionSource: "Classificação oficial da FIFA ao fim da fase de grupos da Copa 2026",
    resolutionCriteria: "Resolver SIM se a Escócia se classificar para a fase eliminatória da Copa do Mundo 2026. Se for eliminada na fase de grupos, resolver NÃO.",
    pointsValue: 155
  },
  {
    title: "Haiti conquista pelo menos 1 ponto no Grupo C?",
    description: "Um ponto do Haiti mexe na matemática do grupo e pode criar uma das narrativas populares da Copa.",
    category: "Copa 2026 - Rivais do Brasil",
    deadline: "2026-06-13T23:30:00.000Z",
    resolutionSource: "Classificação oficial da FIFA do Grupo C após a última rodada",
    resolutionCriteria: "Resolver SIM se o Haiti somar pelo menos um ponto na fase de grupos. Se terminar com zero ponto, resolver NÃO.",
    pointsValue: 150
  },
  {
    title: "Brasil avança ao mata-mata da Copa 2026?",
    description: "O primeiro corte emocional da Copa: passar de fase é obrigação, tropeçar seria abalo histórico.",
    category: "Copa 2026 - Mata-mata",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Classificação oficial da FIFA ao fim da fase de grupos da Copa 2026",
    resolutionCriteria: "Resolver SIM se o Brasil se classificar para a fase eliminatória da Copa do Mundo 2026. Se for eliminado na fase de grupos, resolver NÃO.",
    pointsValue: 130
  },
  {
    title: "Brasil chega às quartas de final da Copa 2026?",
    description: "Oitavas vencidas mudam o tom de cobrança para ambição real de título.",
    category: "Copa 2026 - Mata-mata",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Tabela oficial da FIFA da Copa do Mundo 2026",
    resolutionCriteria: "Resolver SIM se o Brasil vencer sua partida nas oitavas de final e se classificar para as quartas de final. Se cair antes ou nas oitavas, resolver NÃO.",
    pointsValue: 190
  },
  {
    title: "Brasil chega à semifinal da Copa 2026?",
    description: "Semifinal é o ponto em que a narrativa muda de boa campanha para chance real de taça.",
    category: "Copa 2026 - Mata-mata",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Tabela oficial da FIFA da Copa do Mundo 2026",
    resolutionCriteria: "Resolver SIM se o Brasil vencer sua partida de quartas de final e se classificar para a semifinal. Se cair antes ou nas quartas, resolver NÃO.",
    pointsValue: 230
  },
  {
    title: "Brasil vence a Copa do Mundo de 2026?",
    description: "O mercado definitivo: a leitura de longo prazo sobre elenco, pressão, caminho e capacidade de decisão.",
    category: "Copa 2026 - Título",
    deadline: "2026-06-13T21:30:00.000Z",
    resolutionSource: "Resultado oficial da final da Copa do Mundo FIFA 2026",
    resolutionCriteria: "Resolver SIM se o Brasil for campeão da Copa do Mundo FIFA 2026. Qualquer outro campeão resolve NÃO.",
    pointsValue: 300
  }
];
