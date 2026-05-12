import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";

export default function AdminDashboard() {
  const [markets, setMarkets] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function load() {
    api.get("/api/predictions").then(({ data }) => setMarkets(data.predictions)).catch((err) => setError(errorMessage(err)));
  }

  useEffect(load, []);

  async function remove(id) {
    if (!window.confirm("Excluir este mercado e seus votos?")) return;
    await api.delete(`/api/predictions/${id}`);
    setSuccess("Mercado excluído.");
    load();
  }

  async function resolve(id, result) {
    const label = result === "yes" ? "SIM" : "NÃO";
    if (!window.confirm(`Resolver este mercado como ${label} e distribuir pontos?`)) return;
    await api.put(`/api/predictions/${id}/resolve`, { result });
    setSuccess("Mercado resolvido e pontos distribuídos.");
    load();
  }

  return (
    <div className="page">
      <div className="titleRow"><h1>Painel Admin</h1><Link className="primaryLink" to="/admin/markets/new">Criar mercado</Link></div>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div className="table">
        {markets.map((market) => (
          <div className="row adminRow" key={market._id}>
            <span>{market.title}</span><span>{statusLabel[market.status] || market.status}</span>
            <Link to={`/admin/markets/${market._id}/edit`}>Editar</Link>
            {market.status !== "resolved" && <button onClick={() => resolve(market._id, "yes")}>SIM</button>}
            {market.status !== "resolved" && <button onClick={() => resolve(market._id, "no")}>NÃO</button>}
            <button onClick={() => remove(market._id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
  const statusLabel = { open: "aberto", closed: "fechado", resolved: "resolvido" };
