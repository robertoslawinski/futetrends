import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

function shortText(text = "", size = 112) {
  return text.length > size ? `${text.slice(0, size)}...` : text;
}

function humanHook(market) {
  const text = normalize(`${market.title} ${market.description}`);
  if (text.includes("corinthians")) return "Se tropeçar de novo, a cobrança vira crise aberta.";
  if (text.includes("flamengo")) return "Qualquer oscilação vira manchete nacional em minutos.";
  if (text.includes("palmeiras")) return "O time que todos perseguem também vira termômetro da rodada.";
  if (text.includes("var") || text.includes("arbitragem")) return "Um lance polêmico pode dominar a conversa até segunda.";
  if (text.includes("tecnico") || text.includes("pressao")) return "A próxima partida pode mudar o clima interno do clube.";
  if (text.includes("selecao")) return "A lista pode criar novos heróis e novas cobranças.";
  return shortText(market.description, 118);
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

function FeaturedNarrative({ market }) {
  if (!market) return <div className="empty">Carregando principal narrativa...</div>;

  return (
    <Link to={`/markets/${market._id}`} className="featuredNarrative">
      <span>{market.category}</span>
      <h3>{market.title}</h3>
      <p>{humanHook(market)}</p>
      <footer>
        <strong>História em formação</strong>
        <small>Fecha {new Date(market.deadline).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</small>
      </footer>
    </Link>
  );
}

function PressureCard({ market }) {
  return (
    <Link to={`/markets/${market._id}`} className="pressureCard">
      <span>{market.category}</span>
      <h3>{market.title}</h3>
      <p>{humanHook(market)}</p>
    </Link>
  );
}

function NarrativeCard({ item }) {
  return (
    <article className="narrativeCard">
      <span>{item.category}</span>
      <strong>{item.count} histórias no radar</strong>
      <p>{item.votes ? `${item.votes} leituras da torcida` : "A conversa está começando a ganhar corpo."}</p>
    </article>
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
      .slice(0, 4);
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

    return categoryCounts.slice(0, 6);
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

  const featuredMarket = trendingNow[0] || markets[0];
  const hasActiveFilters = Boolean(search || status || category);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setCategory("");
  }

  return (
    <div className="page editorialHome">
      <section className="intelHero editorialHero">
        <div className="heroCopy">
          <span className="livePill"><i /> Radar vivo do futebol brasileiro</span>
          <h1>Veja quais histórias vão explodir no futebol antes de todo mundo.</h1>
          <p>Pressão, crises, arbitragem, torcida e narrativas monitoradas em tempo real.</p>
          <div className="heroActions">
            <a href="#live-radar" className="primaryLink">Ver radar ao vivo</a>
            <a href="#trending" className="secondaryLink">Explorar narrativas</a>
          </div>
        </div>
        <aside className="heroFocus" aria-label="Sinal principal">
          <span>Agora no radar</span>
          <strong>{clubSignals[0]?.club || "Flamengo"} em alerta</strong>
          <p>{clubSignals[0]?.pressure ? "A pressão está subindo e pode virar pauta da rodada." : "A narrativa está ganhando força antes do próximo jogo."}</p>
        </aside>
      </section>

      {error && <div className="error">{error}</div>}

      <Section id="trending" eyebrow="Explodindo agora" title="A história que pode dominar a rodada">
        {loading ? <div className="notice">Carregando narrativas...</div> : <FeaturedNarrative market={featuredMarket} />}
      </Section>

      <Section
        eyebrow="Pressão"
        title="Clubes sob pressão"
        description="Três situações que podem virar crise, cobrança ou manchete."
      >
        <div className="pressureGrid">
          {(pressureMarkets.length ? pressureMarkets : trendingNow.slice(1, 4)).map((market) => <PressureCard key={market._id} market={market} />)}
        </div>
      </Section>

      <FootballIntelligence />

      <Section
        eyebrow="Semana"
        title="Narrativas da semana"
        description="Os temas que estão formando o clima do futebol brasileiro."
      >
        <div className="narrativeGrid">
          {(hotNarratives.length ? hotNarratives : [
            { category: "Arbitragem e VAR", count: 3, votes: 0 },
            { category: "Pressão nos clubes", count: 3, votes: 0 },
            { category: "Seleção Brasileira", count: 2, votes: 0 }
          ]).map((item) => <NarrativeCard key={item.category} item={item} />)}
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
