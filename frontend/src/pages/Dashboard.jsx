import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/users/me").then(({ data }) => setData(data)).catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <div className="page"><div className="error">{error}</div></div>;
  if (!data) return <div className="page"><div className="notice">Carregando painel...</div></div>;

  return (
    <div className="page">
      <h1>Painel</h1>
      <p className="muted">{data.user.name} · {data.user.email}</p>
      <div className="statGrid">
        <strong>{data.user.points}<span>pontos</span></strong>
        <strong>{data.user.accuracy}%<span>aproveitamento</span></strong>
        <strong>{data.user.totalPredictions}<span>palpites resolvidos</span></strong>
      </div>
      <h2>Palpites recentes</h2>
      <div className="table">
        {data.history.length ? data.history.slice(0, 8).map((item) => (
          <Link key={item.id} to={`/markets/${item.prediction?._id}`} className="row">
            <span>{item.prediction?.title}</span><span>{item.selectedOption === "yes" ? "SIM" : "NÃO"}</span><span>{item.pointsEarned} pts</span>
          </Link>
        )) : <div className="empty">Faça seu primeiro palpite na página de mercados.</div>}
      </div>
    </div>
  );
}
