import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { trackEvent } from "../api/analytics.js";
import { getMarketBadges } from "../utils/marketBadges.js";
import { getDataValueCopy, getMarketInsight } from "../utils/marketInsights.js";
import { getVoteViewState } from "../utils/voteVisibility.js";

export default function MarketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const choice = ["yes", "no"].includes(location.state?.choice) ? location.state.choice : null;
  const [market, setMarket] = useState(null);
  const [allMarkets, setAllMarkets] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/api/predictions/${id}`), api.get("/api/predictions")])
      .then(([detail, list]) => {
        setMarket(detail.data.prediction);
        setAllMarkets(list.data.predictions);
        trackEvent("market_opened", { market_id: id });
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function vote(selectedOption) {
    if (!user) return navigate("/login", { state: { returnTo: location.pathname, choice: selectedOption } });
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/api/predictions/${id}/vote`, { selectedOption });
      setMarket(data.prediction);
      setMessage("Palpite registrado.");
      trackEvent("vote_submitted", { market_id: id, selected_option: selectedOption });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !market) return <div className="page"><div className="error">{error}</div></div>;
  if (!market) return <div className="page"><div className="notice">Carregando palpite...</div></div>;

  const index = allMarkets.findIndex((item) => item._id === market._id);
  const next = index >= 0 ? allMarkets[(index + 1) % allMarkets.length] : null;
  const statusLabel = { open: "aberto", closed: "fechado", resolved: "resolvido" }[market.status] || market.status;
  const badges = getMarketBadges(market);
  const insight = getMarketInsight(market);
  const { canVote, hasUserVote, showCommunity, showVoteCount } = getVoteViewState(market);

  return (
    <div className="page detail">
      <Link to="/palpites" className="textLink">Voltar aos palpites</Link>
      <section className="detailGrid">
        <article className="panel">
          <span className="eyebrow">{market.category} · {statusLabel}</span>
          <h1>{market.title}</h1>
          <p>{market.description}</p>
          <div className="badgeRow">
            {badges.map((badge) => <span key={badge}>{badge}</span>)}
          </div>
          <dl className="facts">
            <div><dt>Fechamento</dt><dd>{new Date(market.deadline).toLocaleString()}</dd></div>
            <div><dt>Pontos</dt><dd>{market.pointsValue}</dd></div>
            <div><dt>Fonte</dt><dd>{market.resolutionSource}</dd></div>
            <div><dt>Critério</dt><dd>{market.resolutionCriteria}</dd></div>
          </dl>
        </article>
        <aside>
          <div className="voteBox">
            <h2>{hasUserVote ? "Seu palpite" : "Qual é o seu palpite?"}</h2>
            {!user ? (
              <div className="authPrompt">
                <p>Entre para registrar seu palpite e competir no ranking.</p>
                <Link to="/login" state={{ returnTo: location.pathname, choice }} className="primaryLink">Entrar para palpitar</Link>
              </div>
            ) : canVote ? (
              <div className="split">
                <button className={choice === "yes" ? "preferredChoice" : ""} disabled={submitting} onClick={() => vote("yes")}>{choice === "yes" ? "Confirmar SIM" : "Sim"}</button>
                <button className={choice === "no" ? "preferredChoice" : ""} disabled={submitting} onClick={() => vote("no")}>{choice === "no" ? "Confirmar NÃO" : "Não"}</button>
              </div>
            ) : !hasUserVote ? (
              <div className="voteUnavailable">Este palpite está encerrado.</div>
            ) : null}
            {hasUserVote && (
              <div className="voteConfirmation">
                <CheckCircle2 aria-hidden="true" />
                Seu palpite: {market.userVote === "yes" ? "SIM" : "NÃO"}
              </div>
            )}
            {message && <div className="success voteFeedback" role="status">{message}</div>}
            {error && <div className="error">{error}</div>}
            {showCommunity && (
              <div className="communityDistribution">
                <h3>O que a torcida acha</h3>
                <div className="meter"><span style={{ width: `${market.voteBreakdown.yesPercent}%` }} /></div>
                <div className="percentRow"><span>Sim {market.voteBreakdown.yesPercent}%</span><span>Não {market.voteBreakdown.noPercent}%</span></div>
                {showVoteCount && <p className="muted">{market.totalVotes} palpites no total</p>}
                <div className="dataSignal">
                  <span>{insight.label}</span>
                  <strong>{insight.leadingPercent ? `${insight.leadingPercent}% em ${insight.leadingOption}` : "Aguardando leitura"}</strong>
                  <p>{getDataValueCopy(market)}</p>
                </div>
              </div>
            )}
            {market.status === "resolved" && <strong>Resultado: {market.result === "yes" ? "SIM" : "NÃO"}</strong>}
          </div>
          {(message || market.userVote) && (
            <div className="navButtons">
              <button onClick={() => navigate(-1)}>Voltar</button>
              {next && <Link to={`/markets/${next._id}`}>Próximo</Link>}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
