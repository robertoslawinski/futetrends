import { useEffect, useMemo, useState } from "react";
import { api, errorMessage } from "../api/client.js";
import MarketCard from "../components/MarketCard.jsx";

const currentCategories = new Set(["Brasileirão 2026", "Libertadores 2026"]);

export default function Palpites() {
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/api/predictions", {
      params: { status: status || undefined, category: category || undefined }
    })
      .then(({ data }) => {
        setMarkets(data.predictions.filter((market) => currentCategories.has(market.category)));
        setCategories(data.categories.filter((item) => currentCategories.has(item)));
        setError("");
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [status, category]);

  const visibleMarkets = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("pt-BR");
    return needle ? markets.filter((market) =>
      [market.title, market.category].some((value) => value?.toLocaleLowerCase("pt-BR").includes(needle))
    ) : markets;
  }, [markets, search]);

  return (
    <div className="page palpitesPage">
      <span className="sectionKicker">Brasileirão 2026 · Libertadores 2026</span>
      <h1>Todos os palpites</h1>
      <p className="muted">Escolha uma pergunta, responda SIM ou NÃO e dispute pontos no ranking.</p>

      <div className="toolbar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar time, jogador ou categoria" aria-label="Buscar palpites" />
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
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="empty">Carregando palpites...</div>
      ) : visibleMarkets.length ? (
        <div className="marketGrid">
          {visibleMarkets.map((market) => <MarketCard market={market} key={market._id} />)}
        </div>
      ) : (
        <div className="empty">Nenhum palpite encontrado para esses filtros.</div>
      )}
    </div>
  );
}
