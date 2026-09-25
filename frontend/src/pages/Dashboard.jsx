import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, Medal, Target, Trophy } from "lucide-react";
import { api, errorMessage } from "../api/client.js";
import { formatPoints } from "../utils/rankingView.js";
import { getPlayerProgress } from "../utils/playerProgress.js";
import styles from "./Dashboard.module.css";

const medalLabels = { 1: "Ouro", 2: "Prata", 3: "Bronze" };

function choiceLabel(choice) {
  return choice === "yes" ? "SIM" : "NÃO";
}

function formatDeadline(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function PredictionMeta({ item, pending = false }) {
  const deadline = formatDeadline(item.prediction?.deadline);

  return (
    <div className={styles.cardMeta}>
      <span>Seu palpite <strong>{choiceLabel(item.selectedOption)}</strong></span>
      {pending ? (
        <span>Vale <strong>{formatPoints(item.prediction?.pointsValue)}</strong></span>
      ) : (
        <span className={item.isCorrect ? styles.reward : styles.neutralPoints}>
          {item.isCorrect ? `+${formatPoints(item.pointsEarned)}` : "0 pts"}
        </span>
      )}
      {pending && deadline && <span>Encerra {deadline}</span>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      api.get("/api/users/me"),
      api.get("/api/ranking")
    ]).then(([profileResult, rankingResult]) => {
      if (!active) return;
      if (profileResult.status === "rejected") {
        setError(errorMessage(profileResult.reason));
        return;
      }
      setData(profileResult.value.data);
      if (rankingResult.status === "fulfilled") {
        setRanking(rankingResult.value.data.ranking || []);
      }
    });

    return () => { active = false; };
  }, []);

  const progress = useMemo(
    () => getPlayerProgress(data?.history, ranking, data?.user),
    [data, ranking]
  );

  if (error) return <div className="page"><div className="error">{error}</div></div>;
  if (!data) return <div className="page"><div className="notice">Carregando seu desempenho...</div></div>;

  const firstName = data.user.name?.trim().split(/\s+/)[0] || "jogador";
  const hasVotes = progress.totalVotes > 0;
  const stats = [
    { label: "Pontos", value: formatPoints(data.user.points), featured: true, icon: Trophy },
    progress.currentRank && { label: "Posição", value: `#${progress.currentRank.rank}`, featured: true, icon: Medal },
    progress.totalVotes > 0 && { label: "Palpites", value: progress.totalVotes, icon: Target },
    progress.resolvedTotal > 0 && { label: "Acertos", value: progress.correctTotal, icon: CheckCircle2 },
    progress.accuracy !== null && { label: "Aproveitamento", value: `${progress.accuracy}%` }
  ].filter(Boolean);

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <span>Seu desempenho</span>
        <h1>Olá, {firstName}.</h1>
        <p>Acompanhe seu progresso no FuteTrends.</p>
      </header>

      <section className={styles.stats} aria-label="Estatísticas principais">
        {stats.map(({ label, value, featured, icon: Icon }) => (
          <article className={featured ? styles.featuredStat : undefined} key={label}>
            <div>
              {Icon && <Icon aria-hidden="true" />}
              <span>{label}</span>
            </div>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className={styles.rankCard} aria-labelledby="player-rank-title">
        <div>
          <span id="player-rank-title">Sua posição</span>
          {progress.currentRank ? (
            <>
              <strong>#{progress.currentRank.rank}</strong>
              <p>{formatPoints(progress.currentRank.points)} no ranking geral</p>
            </>
          ) : (
            <>
              <strong>Entre no ranking</strong>
              <p>Sua posição aparecerá assim que seus resultados forem contabilizados.</p>
            </>
          )}
        </div>
        <div className={styles.rankAction}>
          {progress.isTopThree && (
            <span className={styles.medal}>
              <Medal aria-hidden="true" /> Top 3 · {medalLabels[progress.currentRank.rank]}
            </span>
          )}
          <Link to="/ranking">VER RANKING COMPLETO</Link>
        </div>
      </section>

      <div className={styles.progressGrid}>
        <section className={styles.progressSection} aria-labelledby="pending-title">
          <div className={styles.sectionTitle}>
            <div>
              <span>Em jogo</span>
              <h2 id="pending-title">Palpites pendentes</h2>
            </div>
            {progress.pending.length > 0 && <b>{progress.pendingTotal}</b>}
          </div>

          <div className={styles.cardList}>
            {progress.pending.length ? progress.pending.map((item) => (
              <Link className={styles.predictionCard} to={`/markets/${item.prediction._id}`} key={item.id}>
                <div className={styles.cardTopline}>
                  <span>{item.prediction.category || "Futebol"}</span>
                  <span className={styles.pendingStatus}><Clock3 aria-hidden="true" /> Aguardando resultado</span>
                </div>
                <h3>{item.prediction.title}</h3>
                <PredictionMeta item={item} pending />
              </Link>
            )) : (
              <div className={styles.emptyState}>
                <Clock3 aria-hidden="true" />
                <div>
                  <strong>Nenhum palpite aguardando resultado.</strong>
                  <p>{hasVotes ? "Quando você participar de um palpite aberto, ele aparecerá aqui." : "Seus palpites abertos aparecerão aqui."}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={styles.progressSection} aria-labelledby="results-title">
          <div className={styles.sectionTitle}>
            <div>
              <span>Histórico</span>
              <h2 id="results-title">Últimos resultados</h2>
            </div>
          </div>

          <div className={styles.cardList}>
            {progress.results.length ? progress.results.map((item) => (
              <Link className={styles.predictionCard} to={`/markets/${item.prediction._id}`} key={item.id}>
                <div className={styles.cardTopline}>
                  <span>{item.prediction.category || "Futebol"}</span>
                  <span className={item.isCorrect ? styles.correctStatus : styles.missedStatus}>
                    {item.isCorrect ? <CheckCircle2 aria-hidden="true" /> : <Target aria-hidden="true" />}
                    {item.isCorrect ? "Acertou" : "Não foi dessa vez"}
                  </span>
                </div>
                <h3>{item.prediction.title}</h3>
                <PredictionMeta item={item} />
              </Link>
            )) : (
              <div className={styles.emptyState}>
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <strong>Ainda não há resultados.</strong>
                  <p>Seus resultados aparecerão aqui quando os palpites forem resolvidos.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className={styles.cta}>
        <div>
          <span>{hasVotes ? "Continue subindo" : "Comece sua jornada"}</span>
          <h2>{hasVotes ? "Quer somar mais pontos?" : "Faça seu primeiro palpite."}</h2>
          <p>{hasVotes ? "Faça seus próximos palpites." : "Escolha uma pergunta, vote em SIM ou NÃO e entre no ranking."}</p>
        </div>
        <Link to="/palpites">{hasVotes ? "VER PALPITES" : "FAZER PRIMEIRO PALPITE"}</Link>
      </section>
    </div>
  );
}
