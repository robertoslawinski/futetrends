import { useEffect, useMemo, useState } from "react";
import { api, errorMessage } from "../api/client.js";
import FootballIntelligence from "../components/FootballIntelligence.jsx";
import MarketCard from "../components/MarketCard.jsx";

const pressureTerms = ["pressão", "tecnico", "técnico", "demitido", "crise", "arbitragem", "var"];
const hotCategories = ["Próxima rodada", "Pressão nos clubes", "Arbitragem e VAR", "Seleção Brasileira", "Bastidores"];
const clubNames = ["Flamengo", "Palmeiras", "Corinthians", "Santos", "Botafogo", "Fluminense", "Vasco", "São Paulo", "Bahia", "Cruzeiro", "Grêmio", "Internacional", "Atlético-MG"];

function normalize(text = "") {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function hasTerm(market, terms) {
  const text = normalize(`${market.title} ${market.description} ${market.category}`);
  return terms.some((term) => text.includes(normalize(term)));
}

function getClubSignals(markets) {
  const signals = clubNames.map((club) => {
    const related = markets.filter((market) => normalize(`${market.title} ${market.description}`).includes(normalize(club)));
    return {
      club,
      count: related.length,
      pressure: related.filter((market) => hasTerm(market, pressureTerms)).length,
      score: related.length * 12 + related.reduce((sum, market) => sum + (market.totalVotes || 0), 0)
    };
  }).filter((item) => item.count > 0).sort((a, b) => b.score - a.score);

  if (signals.length >= 3) return signals.slice(0, 3);
  return [
    { club: "Flamengo", count: 2, pressure: 0, score: 74 },
    { club: "Corinthians", count: 2, pressure: 2, score: 68 },
    { club: "Palmeiras", count: 2, pressure: 0, score: 66 }
  ];
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

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/api/predictions", { params: { status: status || undefined, category: category || undefined } })
      .then(({ data }) => {
        setMarkets(data.predictions);
        setCategories(data.categories);
        setError("");
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [status, category]);

  const trendingNow = useMemo(() => {
    return markets
      .filter((market) => hotCategories.includes(market.category) || (market.totalVotes || 0) > 0)
      .sort((a, b) => ((b.totalVotes || 0) + b.pointsValue) - ((a.totalVotes || 0) + a.pointsValue))
      .slice(0, 3);
  }, [markets]);

  const pressureMarkets = useMemo(() => (
    markets.filter((market) => hasTerm(market, pressureTerms)).slice(0, 3)
  ), [markets]);

  const hotNarratives = useMemo(() => {
    const categoryCounts = categories.map((item) => ({
      category: item,
      count: markets.filter((market) => market.category === item).length,
      votes: markets.filter((market) => market.category === item).reduce((sum, market) => sum + (market.totalVotes || 0), 0)
    })).sort((a, b) => (b.count + b.votes) - (a.count + a.votes));

    return categoryCounts.slice(0, 3);
  }, [categories, markets]);

  const clubSignals = useMemo(() => getClubSignals(markets), [markets]);

  const visibleMarkets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return markets;
    return markets.filter((market) => [
      market.title,
      market.description,
      market.category,
      market.resolutionSource,
      market.resolutionCriteria
    ].some((value) => value?.toLowerCase().includes(term)));
  }, [markets, search]);

  const hasActiveFilters = Boolean(search || status || category);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setCategory("");
  }

  return (
    <div className="page">
      <section className="intelHero">
        <div className="heroCopy">
          <span className="livePill"><i /> Radar do futebol brasileiro</span>
          <h1>Descubra antes quais histórias vão dominar o futebol brasileiro.</h1>
          <p>Tendências, pressão da torcida, crises e narrativas analisadas em tempo real.</p>
          <div className="heroActions">
            <a href="#markets" className="primaryLink">Entrar no radar</a>
            <a href="#trending" className="secondaryLink">Ver tendências ao vivo</a>
          </div>
        </div>
        <aside className="heroTrendPanel" aria-label="Principais sinais agora">
          {clubSignals.map((item, index) => (
            <article key={item.club} className="heroTrendCard">
              <span>{index === 0 ? "Em alta" : item.pressure ? "Pressionado" : "Crescendo"}</span>
              <strong>{item.club}</strong>
              <small>{item.pressure ? "pressão subindo" : "narrativa ganhando força"}</small>
            </article>
          ))}
        </aside>
      </section>

      {error && <div className="error">{error}</div>}

      <FootballIntelligence />

      <Section
        id="trending"
        eyebrow="Agora"
        title="Tendências em destaque"
        description="Os assuntos que começam a concentrar atenção antes da rodada reagir."
      >
        {loading ? <div className="notice">Carregando tendências...</div> : (
          <div className="marketStrip">
            {(trendingNow.length ? trendingNow : markets.slice(0, 3)).map((market) => <MarketCard key={market._id} market={market} />)}
          </div>
        )}
      </Section>

      <Section
        eyebrow="Pressão"
        title="Clubes sob pressão"
        description="Crises, arbitragem, técnicos e jogos que podem mudar o clima da semana."
      >
        <div className="marketStrip">
          {(pressureMarkets.length ? pressureMarkets : trendingNow).map((market) => <MarketCard key={market._id} market={market} />)}
        </div>
      </Section>

      <Section
        eyebrow="Narrativas"
        title="Histórias quentes"
        description="O mapa rápido das conversas que podem crescer nos próximos dias."
      >
        <div className="narrativeGrid">
          {(hotNarratives.length ? hotNarratives : [{ category: "Arbitragem e VAR", count: 3, votes: 0 }, { category: "Pressão nos clubes", count: 3, votes: 0 }, { category: "Seleção Brasileira", count: 2, votes: 0 }]).map((item) => (
            <article key={item.category} className="narrativeCard">
              <span>{item.category}</span>
              <strong>{item.count} sinais ativos</strong>
              <p>{item.votes ? `${item.votes} leituras da comunidade` : "Narrativa em observação"}</p>
            </article>
          ))}
        </div>
      </Section>

      <section id="markets" className="homeSection">
        <div className="sectionIntro">
          <div>
            <span className="sectionKicker">Mercados</span>
            <h2>Todos os sinais</h2>
          </div>
          {!loading && <p>{visibleMarkets.length} mercados encontrados</p>}
        </div>

        <section className="toolbar intelligenceToolbar">
          <input
            className="searchInput"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por time, jogador ou categoria"
            aria-label="Buscar mercados"
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar por status">
            <option value="">Todos os status</option>
            <option value="open">Abertos</option>
            <option value="closed">Fechados</option>
            <option value="resolved">Resolvidos</option>
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoria">
            <option value="">Todas as categorias</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {hasActiveFilters && <button onClick={clearFilters}>Limpar</button>}
        </section>

        {loading ? <div className="notice">Carregando mercados...</div> : visibleMarkets.length ? (
          <section className="gridCards">{visibleMarkets.map((market) => <MarketCard key={market._id} market={market} />)}</section>
        ) : <div className="empty">Nenhum mercado combina com essa busca.</div>}
      </section>
    </div>
  );
}
