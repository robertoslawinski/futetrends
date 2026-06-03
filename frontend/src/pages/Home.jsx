import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import FootballIntelligence from "../components/FootballIntelligence.jsx";
import MarketCard from "../components/MarketCard.jsx";

const steps = [
  {
    number: "01",
    title: "Escolha uma previsão",
    text: "Encontre perguntas objetivas sobre jogos, clubes, técnicos e bastidores."
  },
  {
    number: "02",
    title: "Responda SIM ou NÃO",
    text: "Registre sua leitura antes do prazo. É gratuito e não envolve apostas."
  },
  {
    number: "03",
    title: "Acerte e suba no ranking",
    text: "Quando o fato acontece, quem previu melhor ganha pontos e reputação."
  }
];

function numberLabel(value) {
  return new Intl.NumberFormat("pt-BR").format(value || 0);
}

function accuracyLabel(value) {
  return `${Math.round(value || 0)}%`;
}

function deadlineLabel(deadline) {
  return new Date(deadline).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });
}

function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="homeSection">
      <div className="sectionIntro">
        <div>
          <span className="sectionKicker">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

function RankingRows({ ranking, limit = 3 }) {
  const rows = ranking.slice(0, limit);

  if (!rows.length) {
    return (
      <div className="rankingEmpty">
        <strong>O topo está aberto.</strong>
        <span>Seja um dos primeiros a pontuar.</span>
      </div>
    );
  }

  return (
    <div className="rankingRows">
      {rows.map((entry) => (
        <div className="rankingRow" key={entry.id}>
          <span className="rankPosition">{entry.rank}</span>
          <span className="rankAvatar">{entry.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{entry.name}</strong>
            <small>{accuracyLabel(entry.accuracy)} de precisão</small>
          </div>
          <b>{numberLabel(entry.points)} pts</b>
        </div>
      ))}
    </div>
  );
}

function FeaturedMarket({ market }) {
  if (!market) return <div className="empty">Nenhum mercado em destaque agora.</div>;

  const yesPercent = market.voteBreakdown?.yesPercent || 0;
  const noPercent = market.voteBreakdown?.noPercent || 0;

  return (
    <article className="featuredMarket">
      <div className="featuredMain">
        <div className="featuredTopline">
          <span>{market.category}</span>
          <em>Mercado em destaque</em>
        </div>
        <Link to={`/markets/${market._id}`} className="featuredTitle">
          <h3>{market.title}</h3>
        </Link>
        <p>{market.description}</p>
        <div className="featuredMeta">
          <span>Fecha {deadlineLabel(market.deadline)}</span>
          <span>{market.totalVotes || 0} participantes</span>
          <span>Vale {market.pointsValue} pontos</span>
        </div>
      </div>
      <div className="featuredForecast">
        <span>Leitura da comunidade</span>
        <div className="featuredPercents">
          <strong>SIM <b>{yesPercent}%</b></strong>
          <strong>NÃO <b>{noPercent}%</b></strong>
        </div>
        <div className="featuredBar">
          <i style={{ width: `${yesPercent}%` }} />
          <b style={{ width: `${noPercent}%` }} />
        </div>
        <div className="featuredActions">
          <Link to={`/markets/${market._id}`} className="featuredYes">Votar SIM</Link>
          <Link to={`/markets/${market._id}`} className="featuredNo">Votar NÃO</Link>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/api/predictions", {
      params: {
        status: status || undefined,
        category: category || undefined
      }
    })
      .then(({ data }) => {
        setMarkets(data.predictions);
        setCategories(data.categories);
        setError("");
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [status, category]);

  useEffect(() => {
    api.get("/api/ranking")
      .then(({ data }) => setRanking(data.ranking || []))
      .catch(() => setRanking([]));
  }, []);

  const openMarkets = useMemo(() => markets.filter((market) => market.status === "open"), [markets]);
  const totalVotes = useMemo(
    () => markets.reduce((sum, market) => sum + (market.totalVotes || 0), 0),
    [markets]
  );
  const averageAccuracy = useMemo(() => {
    if (!ranking.length) return 0;
    return ranking.reduce((sum, entry) => sum + (entry.accuracy || 0), 0) / ranking.length;
  }, [ranking]);
  const featuredMarket = useMemo(
    () => [...openMarkets].sort((a, b) => ((b.totalVotes || 0) + b.pointsValue) - ((a.totalVotes || 0) + a.pointsValue))[0] || markets[0],
    [markets, openMarkets]
  );
  const trendingMarkets = useMemo(
    () => [...openMarkets].sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0)).slice(0, 4),
    [openMarkets]
  );
  const visibleMarkets = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("pt-BR");
    if (!needle) return markets;
    return markets.filter((market) =>
      [market.title, market.description, market.category].some((value) =>
        value?.toLocaleLowerCase("pt-BR").includes(needle)
      )
    );
  }, [markets, search]);
  const hasActiveFilters = Boolean(search || status || category);
  const displayedMarkets = showAll || hasActiveFilters ? visibleMarkets : visibleMarkets.slice(0, 6);

  function clearFilters() {
    setStatus("");
    setCategory("");
    setSearch("");
  }

  return (
    <div className="page saasHome">
      <section className="saasHero">
        <div className="heroCopy">
          <span className="heroEyebrow">Modo Copa do Mundo 2026</span>
          <h1>Quem entende melhor a Copa antes da bola rolar?</h1>
          <p>Responda SIM ou NÃO sobre Brasil, Grupo C e mata-mata. Acerte previsões e prove sua leitura no ranking.</p>
          <div className="heroActions">
            <a href="#markets" className="primaryLink">Começar a prever</a>
            <a href="#how-it-works" className="secondaryLink">Como funciona</a>
          </div>
          <div className="heroTrust">
            <span><i /> Gratuito para jogar</span>
            <span>Sem apostas e sem dinheiro envolvido</span>
          </div>
        </div>

        <aside className="heroDashboard">
          <header>
            <div>
              <span>Ranking ao vivo</span>
              <strong>Melhores leitores</strong>
            </div>
            <Link to="/ranking">Ver ranking</Link>
          </header>
          <RankingRows ranking={ranking} />
          <div className="heroStats">
            <div>
              <strong>{numberLabel(openMarkets.length)}</strong>
              <span>mercados abertos</span>
            </div>
            <div>
              <strong>{numberLabel(totalVotes)}</strong>
              <span>palpites registrados</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="worldCupBrief" aria-label="Contexto da Copa do Mundo 2026">
        <div>
          <span>Grupo C</span>
          <strong>Brasil, Marrocos, Haiti e Escócia</strong>
        </div>
        <div>
          <span>Primeiro foco</span>
          <strong>Brasil x Marrocos</strong>
        </div>
        <div>
          <span>Mercados novos</span>
          <strong>{numberLabel(openMarkets.length)} previsões abertas</strong>
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="proofStrip" aria-label="Números da comunidade">
        <div>
          <strong>{numberLabel(totalVotes)}</strong>
          <span>palpites registrados</span>
        </div>
        <div>
          <strong>{numberLabel(openMarkets.length)}</strong>
          <span>mercados abertos</span>
        </div>
        <div>
          <strong>{numberLabel(ranking.length)}</strong>
          <span>leitores no ranking</span>
        </div>
        <div>
          <strong>{accuracyLabel(averageAccuracy)}</strong>
          <span>precisão média</span>
        </div>
      </section>

      <Section
        id="how-it-works"
        eyebrow="Como funciona"
        title="Sua leitura da Copa vale pontos."
        description="Um jogo simples de previsão para descobrir quem enxerga a Seleção e os rivais antes dos outros."
      >
        <div className="stepsGrid">
          {steps.map((step) => (
            <article className="stepCard" key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Em destaque"
        title="Uma pergunta. Duas escolhas."
        description="Vote antes do prazo e compare sua leitura com a comunidade."
      >
        <FeaturedMarket market={featuredMarket} />
      </Section>

      <section id="markets" className="homeSection marketsSection">
        <div className="sectionIntro">
          <div>
            <span className="sectionKicker">Mercados abertos</span>
            <h2>Faça sua próxima previsão da Copa.</h2>
          </div>
          <p>Perguntas objetivas sobre Brasil, Grupo C, jogadores, arbitragem e caminho até o título.</p>
        </div>

        <div className="toolbar">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar time, jogador ou categoria"
            aria-label="Buscar mercados"
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar por status">
            <option value="">Todos os status</option>
            <option value="open">Abertos</option>
            <option value="closed">Encerrados</option>
            <option value="resolved">Resolvidos</option>
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoria">
            <option value="">Todas as categorias</option>
            {categories.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
          {hasActiveFilters && <button type="button" onClick={clearFilters}>Limpar</button>}
        </div>

        {loading ? (
          <div className="empty">Carregando mercados...</div>
        ) : displayedMarkets.length ? (
          <>
            <div className="marketGrid">
              {displayedMarkets.map((market) => <MarketCard market={market} key={market._id} />)}
            </div>
            {!showAll && !hasActiveFilters && visibleMarkets.length > 6 && (
              <button type="button" className="showMore" onClick={() => setShowAll(true)}>Ver todos os mercados</button>
            )}
          </>
        ) : (
          <div className="empty">Nenhum mercado combina com essa busca.</div>
        )}
      </section>

      <Section
        id="community"
        eyebrow="Comunidade"
        title="Quem lê melhor, sobe mais rápido."
        description="Acompanhe os líderes e as perguntas que estão mobilizando a torcida."
      >
        <div className="communityGrid">
          <article className="communityPanel leaderboardPanel">
            <header>
              <div>
                <span>Ranking de precisão</span>
                <h3>Melhores leitores</h3>
              </div>
              <Link to="/ranking">Ranking completo</Link>
            </header>
            <RankingRows ranking={ranking} limit={5} />
          </article>

          <article className="communityPanel trendingPanel">
            <header>
              <div>
                <span>Em alta agora</span>
                <h3>Mais discutidos</h3>
              </div>
              <a href="#markets">Ver mercados</a>
            </header>
            {trendingMarkets.length ? (
              <div className="trendingList">
                {trendingMarkets.map((market, index) => (
                  <Link to={`/markets/${market._id}`} key={market._id}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>{market.title}</span>
                    <small>{market.totalVotes || 0} palpites</small>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rankingEmpty">
                <strong>As primeiras leituras começam aqui.</strong>
                <span>Vote em um mercado para movimentar a comunidade.</span>
              </div>
            )}
          </article>
        </div>
      </Section>

      <FootballIntelligence />
    </div>
  );
}
