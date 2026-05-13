import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";

function performanceTone(accuracy) {
  if (accuracy >= 70) return "Leitura quente";
  if (accuracy >= 45) return "Em evolução";
  return "Radar em calibragem";
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/users/me").then(({ data }) => setData(data)).catch((err) => setError(errorMessage(err)));
  }, []);

  const intelligence = useMemo(() => {
    if (!data) return null;
    const accuracy = data.user.accuracy || 0;
    const total = data.user.totalPredictions || 0;
    const correct = data.user.correctPredictions || 0;
    return {
      pressure: Math.min(99, 36 + total * 6 + correct * 4),
      momentum: Math.min(99, 30 + accuracy),
      narrative: Math.min(99, 44 + data.user.points),
      tone: performanceTone(accuracy)
    };
  }, [data]);

  if (error) return <div className="page"><div className="error">{error}</div></div>;
  if (!data) return <div className="page"><div className="notice">Carregando painel...</div></div>;

  return (
    <div className="page dashboardPage">
      <section className="dashboardHero">
        <div>
          <span className="livePill"><i /> Meu radar</span>
          <h1>{intelligence.tone}</h1>
          <p>{data.user.name} · {data.user.email}</p>
        </div>
        <Link to="/" className="primaryLink">Abrir mercados</Link>
      </section>

      <section className="statGrid intelligenceStats">
        <strong>{data.user.points}<span>pontos de leitura</span></strong>
        <strong>{data.user.accuracy}%<span>aproveitamento</span></strong>
        <strong>{data.user.totalPredictions}<span>palpites resolvidos</span></strong>
        <strong>{data.user.correctPredictions}<span>acertos confirmados</span></strong>
      </section>

      <section className="radarGrid dashboardRadar">
        <article className="panel signalPanel">
          <div className="panelTitle">
            <span>Pressure Index™</span>
            <strong>{intelligence.pressure}</strong>
          </div>
          <div className="indexBar"><i style={{ width: `${intelligence.pressure}%` }} /></div>
          <p className="muted">Sua capacidade de ler tensão antes do consenso aparecer.</p>
        </article>
        <article className="panel signalPanel">
          <div className="panelTitle">
            <span>Club Momentum™</span>
            <strong>{intelligence.momentum}</strong>
          </div>
          <div className="indexBar"><i style={{ width: `${intelligence.momentum}%` }} /></div>
          <p className="muted">Precisão acumulada em narrativas de rodada e tabela.</p>
        </article>
        <article className="panel signalPanel">
          <div className="panelTitle">
            <span>Narrative Score™</span>
            <strong>{intelligence.narrative}</strong>
          </div>
          <div className="indexBar"><i style={{ width: `${intelligence.narrative}%` }} /></div>
          <p className="muted">Reputação gerada por acertos em histórias resolvidas.</p>
        </article>
      </section>

      <section className="dashboardSplit">
        <article className="panel">
          <div className="panelTitle">
            <span>Missões de leitura</span>
            <strong>Próximos passos</strong>
          </div>
          <div className="missionList">
            <Link to="/">Prever um mercado de VAR ou arbitragem</Link>
            <Link to="/">Encontrar um mercado dividido entre SIM e NÃO</Link>
            <Link to="/ranking">Comparar sua leitura com o ranking</Link>
          </div>
        </article>

        <article className="panel">
          <div className="panelTitle">
            <span>Histórico</span>
            <strong>Palpites recentes</strong>
          </div>
          <div className="table compactTable">
            {data.history.length ? data.history.slice(0, 8).map((item) => (
              <Link key={item.id} to={`/markets/${item.prediction?._id}`} className="row">
                <span>{item.prediction?.title}</span>
                <span>{item.selectedOption === "yes" ? "SIM" : "NÃO"}</span>
                <span>{item.pointsEarned} pts</span>
              </Link>
            )) : <div className="empty">Faça seu primeiro palpite para calibrar seu radar.</div>}
          </div>
        </article>
      </section>
    </div>
  );
}
