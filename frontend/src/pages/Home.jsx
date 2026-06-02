import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import FootballIntelligence from "../components/FootballIntelligence.jsx";
import MarketCard from "../components/MarketCard.jsx";

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

function FeaturedMarket({ market }) {
  if (!market) return <div className="empty">Nenhum palpite em destaque agora.</div>;

  return (
    <Link to={`/markets/${market._id}`} className="featuredNarrative">
      <span>{market.category}</span>
      <h3>{market.title}</h3>
      <p>{market.description}</p>
      <footer>
        <strong>Dar meu palpite</strong>
        <small>Vale {market.pointsValue} pontos</small>
      </footer>
    </Link>
  );
}

const steps = [
  {
    number: "01",
    title: "Escolha uma pergunta",
    text: "Veja os sinais abertos sobre jogos, clubes, arbitragem e Seleção."
  },
  {
    number: "02",
    title: "Vote SIM ou NÃO",
    text: "Registre sua leitura antes do prazo. Não existe dinheiro envolvido."
  },
  {
    number: "03",
    title: "Acerte e ganhe pontos",
    text: "Quando o fato acontece, os melhores leitores sobem no ranking."
  }
];

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
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

  const openMarkets = useMemo(() => markets.filter((market) => market.status === "open"), [markets]);

  const featuredMarket = useMemo(() => (
    [...openMarkets].sort((a, b) => ((b.totalVotes || 0) + b.pointsValue) - ((a.totalVotes || 0) + a.pointsValue))[0]
      || markets[0]
  ), [markets, openMarkets]);

  const visibleMarkets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return markets;
    return markets.filter((market) => [
      market.title,
      market.description,
      market.category
    ].some((value) => value?.toLowerCase().includes(term)));
  }, [markets, search]);

  const hasActiveFilters = Boolean(search || status || category);
  const displayedMarkets = showAll || hasActiveFilters ? visibleMarkets : visibleMarkets.slice(0, 6);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setCategory("");
    setShowAll(false);
  }

  return (
    <div className="page editorialHome">
      <section className="intelHero editorialHero simplifiedHero">
        <div className="heroCopy">
          <span className="livePill"><i /> Palpites com pontos. Sem apostas.</span>
          <h1>Preveja o que vai marcar o futebol brasileiro.</h1>
          <p>Responda SIM ou NÃO antes do fato acontecer. Acerte previsões sobre clubes, jogos e bastidores para subir no ranking.</p>
          <div className="heroActions">
            <a href="#markets" className="primaryLink">Começar a palpitar</a>
            <a href="#how-it-works" className="secondaryLink">Como funciona</a>
          </div>
        </div>
        <aside className="conceptCard" aria-label="Resumo do jogo">
          <span>FuteTrends em uma frase</span>
          <strong>Quem lê melhor o futebol soma mais pontos.</strong>
          <p>Você não aposta dinheiro. Você testa sua leitura contra fatos reais e compara seu desempenho com outros torcedores.</p>
        </aside>
      </section>

      {error && <div className="error">{error}</div>}

      <section id="how-it-works" className="howGrid" aria-label="Como funciona">
        {steps.map((step) => (
          <article className="howCard" key={step.number}>
            <span>{step.number}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <Section
        eyebrow="Destaque"
        title="Um palpite para começar"
        description="Escolha um lado antes do prazo e acompanhe a leitura da torcida."
      >
        {loading ? <div className="notice">Carregando palpite...</div> : <FeaturedMarket market={featuredMarket} />}
      </Section>

      <section id="markets" className="homeSection">
        <div className="sectionIntro">
          <div>
            <span className="sectionKicker">Mercados</span>
            <h2>Faça sua previsão</h2>
          </div>
          {!loading && <p>{openMarkets.length} perguntas abertas para testar sua leitura.</p>}
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

        {loading ? <div className="notice">Carregando mercados...</div> : displayedMarkets.length ? (
          <>
            <section className="gridCards">{displayedMarkets.map((market) => <MarketCard key={market._id} market={market} />)}</section>
            {!showAll && !hasActiveFilters && visibleMarkets.length > 6 && (
              <div className="marketsActions">
                <button className="showMoreButton" onClick={() => setShowAll(true)}>Ver todos os mercados</button>
              </div>
            )}
          </>
        ) : <div className="empty">Nenhum mercado combina com essa busca.</div>}
      </section>

      <FootballIntelligence />
    </div>
  );
}
