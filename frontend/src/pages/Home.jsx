import { useEffect, useMemo, useState } from "react";
import { api, errorMessage } from "../api/client.js";
import MarketCard from "../components/MarketCard.jsx";

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
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [status, category]);

  const stats = useMemo(() => ({
    open: markets.filter((market) => market.status === "open").length,
    votes: markets.reduce((sum, market) => sum + (market.totalVotes || 0), 0)
  }), [markets]);
  const hotCategories = ["Próxima rodada", "Pressão nos clubes", "Arbitragem e VAR", "Seleção Brasileira", "Bastidores"];
  const trending = useMemo(() => markets.filter((market) => hotCategories.includes(market.category)).slice(0, 6), [markets]);
  const provocationCards = useMemo(() => [
    { label: "VAR no centro", text: "Lances capitais, áudio, súmula e narrativa de crise." },
    { label: "Pressão no técnico", text: "Quando resultado ruim vira bastidor quente." },
    { label: "Seleção na mesa", text: "Convocação, clubes brasileiros e nomes que dividem torcida." }
  ], []);
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
      <section className="hero">
        <div>
          <span className="eyebrow">futetrends.com · radar brasileiro</span>
          <h1>FuteTrends</h1>
          <p>Preveja o futebol brasileiro antes da tabela reagir.</p>
          <div className="hookStrip">
            {provocationCards.map((item) => (
              <article key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.text}</span>
              </article>
            ))}
          </div>
          <div className="heroStats">
            <strong>{stats.open}<span>mercados abertos</span></strong>
            <strong>{stats.votes}<span>palpites da torcida</span></strong>
            <strong>R$ 0<span>jogo grátis por pontos</span></strong>
          </div>
        </div>
      </section>
      <section className="toolbar">
        <input
          className="searchInput"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por time, jogador ou categoria"
          aria-label="Buscar mercados"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
          <option value="">Todos os status</option>
          <option value="open">Abertos</option>
          <option value="closed">Fechados</option>
          <option value="resolved">Resolvidos</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
          <option value="">Todas as categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        {hasActiveFilters && <button onClick={clearFilters}>Limpar filtros</button>}
      </section>
      {!loading && (
        <div className="resultCount">
          {visibleMarkets.length} {visibleMarkets.length === 1 ? "mercado encontrado" : "mercados encontrados"}
        </div>
      )}
      {!loading && trending.length > 0 && (
        <section className="trending">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">Radar da rodada</span>
              <h2>Campo, VAR, bastidor e Seleção</h2>
            </div>
          </div>
          <div className="gridCards compactGrid">
            {trending.map((market) => <MarketCard key={market._id} market={market} />)}
          </div>
        </section>
      )}
      <section className="dataValue">
        <div>
          <span className="eyebrow">Valor dos dados</span>
          <h2>O jogo mede a leitura da torcida antes do fato acontecer</h2>
          <p>Palpite correto continua sendo o que bate com o resultado real. Antes disso, o FuteTrends transforma votos em sinais: consenso, divisao, pressao, narrativa e surpresa potencial.</p>
        </div>
        <div className="dataCards">
          <article><strong>Tendencia da torcida</strong><span>Mostra para onde a comunidade esta inclinada antes da rodada.</span></article>
          <article><strong>Mercado dividido</strong><span>Quando SIM e NAO ficam perto, existe debate real e conteudo bom.</span></article>
          <article><strong>Surpresa potencial</strong><span>Se a maioria errar, a minoria que acertou ganha reputacao.</span></article>
        </div>
      </section>
      {error && <div className="error">{error}</div>}
      {loading ? <div className="notice">Carregando mercados...</div> : visibleMarkets.length ? (
        <section className="gridCards">{visibleMarkets.map((market) => <MarketCard key={market._id} market={market} />)}</section>
      ) : <div className="empty">Nenhum mercado combina com essa busca.</div>}
    </div>
  );
}
