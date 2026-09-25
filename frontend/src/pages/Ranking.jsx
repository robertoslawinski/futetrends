import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Medal, Trophy } from "lucide-react";
import { api, errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPoints, getRankingView } from "../utils/rankingView.js";
import styles from "./Ranking.module.css";

export default function Ranking() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/ranking")
      .then(({ data }) => setRanking(data.ranking || []))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const { currentUser, hasRanking, leaders } = getRankingView(ranking, user);
  const remaining = ranking.slice(3);

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <span>Ranking FuteTrends</span>
        <h1>Quem entende mais de futebol?</h1>
        <p>Acerte palpites, ganhe pontos e suba na classificação.</p>
      </header>

      {error && <div className="error">{error}</div>}

      {!hasRanking ? (
        <section className={styles.empty}>
          <Trophy aria-hidden="true" />
          <div>
            <strong>O topo está livre.</strong>
            <span>Acerte seus palpites e seja um dos primeiros a chegar ao topo.</span>
          </div>
          <Link to="/palpites">FAZER UM PALPITE</Link>
        </section>
      ) : (
        <>
          <section className={styles.podium} data-count={leaders.length} aria-label="Três primeiros colocados">
            {leaders.map((entry) => (
              <article key={entry.id} data-leader={entry.rank === 1 || undefined}>
                <div className={styles.place}>
                  <Medal aria-hidden="true" />
                  <span>#{entry.rank}</span>
                </div>
                <div className={styles.avatar}>{entry.name.slice(0, 1).toUpperCase()}</div>
                <strong>{entry.name}</strong>
                <b>{formatPoints(entry.points)}</b>
                <small>{entry.correctPredictions} acertos · {entry.accuracy}% de aproveitamento</small>
              </article>
            ))}
          </section>

          {currentUser && (
            <section className={styles.currentUser}>
              <span>Sua posição</span>
              <strong>#{currentUser.rank}</strong>
              <b>{formatPoints(currentUser.points)}</b>
              <small>{currentUser.accuracy}% de aproveitamento</small>
            </section>
          )}

          {remaining.length > 0 && (
            <section className={styles.list} aria-label="Classificação completa">
              {remaining.map((entry) => (
                <div className={styles.row} data-current={currentUser && String(currentUser.id) === String(entry.id) || undefined} key={entry.id}>
                  <strong>#{entry.rank}</strong>
                  <span className={styles.avatar}>{entry.name.slice(0, 1).toUpperCase()}</span>
                  <div>
                    <b>{entry.name}</b>
                    <small>{entry.accuracy}% de aproveitamento</small>
                  </div>
                  <em>{formatPoints(entry.points)}</em>
                </div>
              ))}
            </section>
          )}

          <Link to="/palpites" className={styles.cta}>FAZER UM PALPITE</Link>
        </>
      )}
    </div>
  );
}
