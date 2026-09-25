import { Link } from "react-router-dom";
import styles from "./MarketCard.module.css";

function deadlineLabel(deadline) {
  return new Date(deadline).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });
}

export default function MarketCard({ market }) {
  const yesPercent = market.voteBreakdown?.yesPercent || 0;
  const noPercent = market.voteBreakdown?.noPercent || 0;
  const isOpen = market.status === "open";
  const showVoteCount = (market.totalVotes || 0) >= 10;

  return (
    <article className={styles.card}>
      <Link to={`/markets/${market._id}`} className={styles.title}>
        <h3>{market.title}</h3>
      </Link>

      <div className={styles.splitBar} aria-label={`SIM ${yesPercent}%, NÃO ${noPercent}%`}>
        <i style={{ width: `${yesPercent}%` }} />
        <b style={{ width: `${noPercent}%` }} />
      </div>

      <div className={styles.percentages}>
        <strong>SIM <em>{yesPercent}%</em></strong>
        <strong>NÃO <em>{noPercent}%</em></strong>
      </div>

      <div className={styles.actions}>
        {isOpen ? (
          <>
            <Link to={`/markets/${market._id}`} state={{ choice: "yes" }} className={styles.yes}>SIM</Link>
            <Link to={`/markets/${market._id}`} state={{ choice: "no" }} className={styles.no}>NÃO</Link>
          </>
        ) : (
          <Link to={`/markets/${market._id}`} className={styles.result}>Ver resultado</Link>
        )}
      </div>

      <div className={styles.meta}>
        {market.pointsValue && <strong>Vale {market.pointsValue} pts</strong>}
        <span>Encerra {deadlineLabel(market.deadline)}</span>
        {showVoteCount && <span>{market.totalVotes} palpites</span>}
      </div>

      <footer>
        <span className={styles.category}>{market.category}</span>
        <span className={isOpen ? styles.open : styles.closed}>
          {isOpen ? "Aberto" : market.status === "resolved" ? "Resolvido" : "Encerrado"}
        </span>
      </footer>
    </article>
  );
}
