const dateAt = (day) => `${day}T18:00:00.000Z`;

export const seasonMarkets = [
  {
    title: "Flamengo termina o Brasileirão 2026 entre os três primeiros?",
    description: "Uma previsão sobre a posição final do Flamengo na Série A de 2026.",
    category: "Brasileirão 2026",
    deadline: dateAt("2026-11-15"),
    resolutionSource: "Classificação final oficial da CBF para a Série A 2026",
    resolutionCriteria: "Resolver SIM se o Flamengo terminar em 1º, 2º ou 3º lugar na classificação final oficial da CBF, após critérios de desempate e eventuais ajustes disciplinares. Qualquer outra posição resolve NÃO.",
    pointsValue: 120
  },
  {
    title: "O campeão do Brasileirão 2026 fará pelo menos 75 pontos?",
    description: "O ritmo da liderança será suficiente para chegar à marca de 75 pontos?",
    category: "Brasileirão 2026",
    deadline: dateAt("2026-11-15"),
    resolutionSource: "Classificação final oficial da CBF para a Série A 2026",
    resolutionCriteria: "Resolver SIM se o clube campeão tiver 75 pontos ou mais na classificação final oficial da CBF. Se tiver 74 pontos ou menos, resolver NÃO.",
    pointsValue: 130
  },
  {
    title: "Botafogo termina o Brasileirão 2026 à frente do Fluminense?",
    description: "Duelo de posições entre os rivais cariocas ao fim da temporada.",
    category: "Brasileirão 2026",
    deadline: dateAt("2026-11-15"),
    resolutionSource: "Classificação final oficial da CBF para a Série A 2026",
    resolutionCriteria: "Resolver SIM se o Botafogo aparecer em posição superior à do Fluminense na classificação final oficial da CBF, após todos os critérios de desempate. Caso contrário, resolver NÃO.",
    pointsValue: 120
  },
  {
    title: "Três clubes farão 70 pontos ou mais no Brasileirão 2026?",
    description: "Uma disputa de ponta apertada pode elevar a pontuação de vários concorrentes.",
    category: "Brasileirão 2026",
    deadline: dateAt("2026-11-15"),
    resolutionSource: "Classificação final oficial da CBF para a Série A 2026",
    resolutionCriteria: "Resolver SIM se pelo menos três clubes terminarem com 70 pontos ou mais na tabela final oficial da CBF. Com dois clubes ou menos nessa marca, resolver NÃO.",
    pointsValue: 140
  },
  {
    title: "O Corinthians trocará de técnico antes do fim do Brasileirão 2026?",
    description: "Uma leitura sobre a estabilidade do comando técnico corintiano.",
    category: "Brasileirão 2026",
    deadline: dateAt("2026-10-31"),
    resolutionSource: "Comunicados oficiais do Corinthians e registros de partidas da CBF",
    resolutionCriteria: "Resolver SIM se o Corinthians nomear outro técnico, efetivo ou interino, para comandar a equipe principal antes da última rodada da Série A 2026. Ausência pontual por suspensão não conta. Sem troca, resolver NÃO.",
    pointsValue: 150
  },
  {
    title: "Algum clube da Série A perderá pontos por punição em 2026?",
    description: "Uma decisão disciplinar pode alterar a classificação do campeonato.",
    category: "Brasileirão 2026",
    deadline: dateAt("2026-11-15"),
    resolutionSource: "Decisões oficiais do STJD e classificação da CBF",
    resolutionCriteria: "Resolver SIM se uma decisão oficial aplicada até a homologação da classificação final de 2026 retirar um ou mais pontos de um clube da Série A por infração disciplinar. Multa sem perda de pontos resolve NÃO.",
    pointsValue: 170
  },
  {
    title: "Um clube brasileiro vencerá a Libertadores 2026?",
    description: "A taça continental ficará com uma equipe filiada à CBF?",
    category: "Libertadores 2026",
    deadline: dateAt("2026-11-20"),
    resolutionSource: "Relatório oficial da final da CONMEBOL Libertadores 2026",
    resolutionCriteria: "Resolver SIM se o campeão oficial da CONMEBOL Libertadores 2026 for um clube filiado à CBF. Se o campeão for de outra federação, resolver NÃO.",
    pointsValue: 160
  },
  {
    title: "A final da Libertadores 2026 terá pelo menos um clube brasileiro?",
    description: "A presença brasileira na decisão será confirmada pelo chaveamento oficial.",
    category: "Libertadores 2026",
    deadline: dateAt("2026-10-20"),
    resolutionSource: "Chaveamento e súmulas oficiais da CONMEBOL Libertadores 2026",
    resolutionCriteria: "Resolver SIM se ao menos um dos dois finalistas oficiais da Libertadores 2026 for um clube filiado à CBF. Se nenhum finalista for brasileiro, resolver NÃO.",
    pointsValue: 130
  },
  {
    title: "O Palmeiras chegará à final da Libertadores 2026?",
    description: "Uma previsão direta sobre a campanha continental do Palmeiras.",
    category: "Libertadores 2026",
    deadline: dateAt("2026-10-20"),
    resolutionSource: "Chaveamento e súmulas oficiais da CONMEBOL Libertadores 2026",
    resolutionCriteria: "Resolver SIM se o Palmeiras constar entre os dois finalistas oficiais da Libertadores 2026. Eliminação em qualquer fase anterior resolve NÃO.",
    pointsValue: 150
  },
  {
    title: "A final da Libertadores 2026 será decidida nos pênaltis?",
    description: "A decisão continental pode ir além dos 120 minutos.",
    category: "Libertadores 2026",
    deadline: dateAt("2026-11-20"),
    resolutionSource: "Súmula oficial da final da CONMEBOL Libertadores 2026",
    resolutionCriteria: "Resolver SIM se o campeão da Libertadores 2026 for definido por disputa de pênaltis após empate no tempo normal e na prorrogação. Decisão antes dos pênaltis resolve NÃO.",
    pointsValue: 180
  },
  {
    title: "Um brasileiro será artilheiro isolado da Libertadores 2026?",
    description: "A disputa individual pela artilharia continental vale uma previsão própria.",
    category: "Libertadores 2026",
    deadline: dateAt("2026-10-20"),
    resolutionSource: "Tabela oficial de artilharia da CONMEBOL Libertadores 2026",
    resolutionCriteria: "Resolver SIM se um jogador de nacionalidade brasileira terminar como único artilheiro com mais gols que todos os demais jogadores. Empate na artilharia ou artilheiro de outra nacionalidade resolve NÃO.",
    pointsValue: 170
  },
  {
    title: "Um clube brasileiro vencerá a final da Libertadores 2026 no tempo normal?",
    description: "Uma previsão sobre a equipe campeã e a duração da decisão.",
    category: "Libertadores 2026",
    deadline: dateAt("2026-11-20"),
    resolutionSource: "Súmula oficial da final da CONMEBOL Libertadores 2026",
    resolutionCriteria: "Resolver SIM se um clube filiado à CBF vencer a final de 2026 após 90 minutos regulamentares, incluídos os acréscimos. Vitória na prorrogação, nos pênaltis ou de clube estrangeiro resolve NÃO.",
    pointsValue: 190
  }
];
