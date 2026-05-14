import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import FootballIntelligence from "../components/FootballIntelligence.jsx";
import MarketCard from "../components/MarketCard.jsx";

const clubNames = [
  "Flamengo",
  "Palmeiras",
  "Corinthians",
  "Santos",
  "Botafogo",
  "Fluminense",
  "Vasco",
  "Sao Paulo",
  "São Paulo",
  "Bahia",
  "Cruzeiro",
  "Gremio",
  "Grêmio",
  "Internacional",
  "Atletico-MG",
  "Atlético-MG"
];

const hotCategories = [
  "Próxima rodada",
  "Pressão nos clubes",
  "Arbitragem e VAR",
  "Seleção Brasileira",
  "Bastidores"
];

function clamp(value, min = 0, max = 99) {
  return Math.max(min, Math.min(max, value));
}

function hasTerm(market, terms) {
  const text = `${market.title} ${market.description} ${market.category}`.toLowerCase();
  return terms.some((term) => text.includes(term.toLowerCase()));
}

function getIndexValue(markets, terms, base) {
  const matches = markets.filter((market) => hasTerm(market, terms));
  const votes = matches.reduce((sum, market) => sum + (market.totalVotes || 0), 0);
  const points = matches.reduce((sum, market) => sum + (market.pointsValue || 0), 0);
  return clamp(base + matches.length * 7 + votes * 2 + Math.round(points / 22), 18, 96);
}

function formatDeadline(date) {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
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

  const stats = useMemo(() => {
    const open = markets.filter((market) => market.status === "open").length;
    const votes = markets.reduce((sum, market) => sum + (market.totalVotes || 0), 0);
    const divided = markets.filter((market) => {
      const yes = market.voteBreakdown?.yesPercent || 0;
      return yes > 38 && yes < 62;
    }).length;
    return { open, votes, divided };
  }, [markets]);

  const indexes = useMemo(() => ([
    {
      label: "Pressure Index™",
      value: getIndexValue(markets, ["pressão", "tecnico", "técnico", "demitido", "crise"], 38),
      tone: "danger",
      detail: "Clubes e técnicos sob cobrança"
    },
    {
      label: "Fan Heat™",
      value: getIndexValue(markets, ["rival", "torcida", "flamengo", "palmeiras", "corinthians"], 44),
      tone: "orange",
      detail: "Temperatura emocional da conversa"
    },
    {
      label: "VAR Impact™",
      value: getIndexValue(markets, ["var", "arbitragem", "juiz", "erro"], 36),
      tone: "blue",
      detail: "Risco de polêmica de arbitragem"
    },
    {
      label: "Narrative Score™",
      value: getIndexValue(markets, ["seleção", "libertadores", "brasileirão", "bastidor", "copa"], 41),
      tone: "blue",
      detail: "Força das histórias dominantes"
    }
  ]), [markets]);

  const clubHeat = useMemo(() => {
    const normalized = new Map();
    clubNames.forEach((club) => {
      const key = club.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!normalized.has(key)) normalized.set(key, club);
    });

    return [...normalized.entries()].map(([key, label]) => {
      const related = markets.filter((market) => {
        const text = `${market.title} ${market.description}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return text.includes(key.toLowerCase());
      });
      const votes = related.reduce((sum, market) => sum + (market.totalVotes || 0), 0);
      const score = clamp(24 + related.length * 18 + votes * 3);
      return { label, score, count: related.length };
    }).filter((club) => club.count > 0).sort((a, b) => b.score - a.score).slice(0, 6);
  }, [markets]);

  const trendingNow = useMemo(() => {
    return markets
      .filter((market) => hotCategories.includes(market.category) || (market.totalVotes || 0) > 0)
      .sort((a, b) => ((b.totalVotes || 0) + b.pointsValue) - ((a.totalVotes || 0) + a.pointsValue))
      .slice(0, 3);
  }, [markets]);

  const pressureRising = useMemo(() => (
    markets.filter((market) => hasTerm(market, ["pressão", "tecnico", "técnico", "demitido", "crise", "arbitragem", "var"]))
      .slice(0, 3)
  ), [markets]);

  const mostDiscussed = useMemo(() => (
    [...markets].sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0)).slice(0, 3)
  ), [markets]);

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
          <span className="livePill"><i /> Radar ao vivo do futebol brasileiro</span>
          <h1>Acompanhe pressão, tendências e narrativas que moldam o futebol brasileiro.</h1>
          <p>Monitore pressão nos clubes, controvérsia de VAR, momentum da torcida e narrativas da mídia em tempo real.</p>
          <div className="heroActions">
            <a href="#live-radar" className="primaryLink">Ver radar</a>
            <Link to="/ranking" className="secondaryLink">Ranking de leitura</Link>
          </div>
        </div>
        <aside className="terminalPanel" aria-label="Live intelligence indexes">
          <div className="terminalHeader">
            <span>FUTETRENDS LIVE</span>
            <strong>{stats.open} mercados abertos</strong>
          </div>
          <div className="indexStack">
            {indexes.map((item) => (
              <article key={item.label} className={`indexCard ${item.tone}`}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <p>{item.detail}</p>
                <div className="indexBar"><i style={{ width: `${item.value}%` }} /></div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="quickPulse">
        <article>
          <span>Trending Now</span>
          <strong>{trendingNow[0]?.category || "Narrativas abertas"}</strong>
          <p>{trendingNow[0]?.title || "O radar mede onde a atenção da torcida está subindo."}</p>
        </article>
        <article>
          <span>Pressure Rising</span>
          <strong>{stats.divided} mercados divididos</strong>
          <p>Quando a comunidade racha, a história fica mais forte.</p>
        </article>
        <article>
          <span>Most Discussed</span>
          <strong>{stats.votes} sinais da torcida</strong>
          <p>Votos viram leitura de consenso, tensão e surpresa potencial.</p>
        </article>
      </section>

      <FootballIntelligence />

      <section id="live-radar" className="radarBoard">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">Live intelligence</span>
            <h2>Quem está quente, pressionado ou virando narrativa</h2>
          </div>
        </div>
        <div className="radarGrid">
          <article className="panel signalPanel">
            <div className="panelTitle">
              <span>Club Heat Index</span>
              <strong>Momentum dos clubes</strong>
            </div>
            <div className="clubHeatList">
              {(clubHeat.length ? clubHeat : [{ label: "Flamengo", score: 82 }, { label: "Palmeiras", score: 78 }, { label: "Corinthians", score: 66 }]).map((club) => (
                <div key={club.label} className="clubHeatRow">
                  <span>{club.label}</span>
                  <strong>{club.score}</strong>
                  <i><b style={{ width: `${club.score}%` }} /></i>
                </div>
              ))}
            </div>
          </article>
          <article className="panel signalPanel alert">
            <div className="panelTitle">
              <span>Pressure Rising</span>
              <strong>Técnicos, crise e bastidor</strong>
            </div>
            <div className="signalList">
              {(pressureRising.length ? pressureRising : trendingNow).map((market) => (
                <Link key={market._id} to={`/markets/${market._id}`}>
                  <span>{market.category}</span>
                  <strong>{market.title}</strong>
                  <small>Fecha {formatDeadline(market.deadline)} · {market.pointsValue} pts</small>
                </Link>
              ))}
            </div>
          </article>
          <article className="panel signalPanel">
            <div className="panelTitle">
              <span>Narrative Heat</span>
              <strong>Mais discutidos</strong>
            </div>
            <div className="signalList">
              {mostDiscussed.map((market) => (
                <Link key={market._id} to={`/markets/${market._id}`}>
                  <span>{market.totalVotes || 0} sinais</span>
                  <strong>{market.title}</strong>
                  <small>{market.category}</small>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="toolbar intelligenceToolbar">
        <input
          className="searchInput"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por time, jogador, categoria ou polêmica"
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
        {hasActiveFilters && <button onClick={clearFilters}>Limpar filtros</button>}
      </section>

      <div className="sectionHeader marketsHeader">
        <div>
          <span className="eyebrow">Open intelligence markets</span>
          <h2>Palpites que viram sinal</h2>
        </div>
        {!loading && (
          <strong className="resultPill">
            {visibleMarkets.length} {visibleMarkets.length === 1 ? "mercado" : "mercados"}
          </strong>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? <div className="notice">Carregando radar...</div> : visibleMarkets.length ? (
        <section className="gridCards">{visibleMarkets.map((market) => <MarketCard key={market._id} market={market} />)}</section>
      ) : <div className="empty">Nenhum mercado combina com essa busca.</div>}
    </div>
  );
}
