import { Link } from "react-router-dom";
import styles from "./MarketCard.module.css";

function shortText(text) {
  if (!text) return "";
  return text.length > 104 ? `${text.slice(0, 104)}...` : text;
}

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

  return (
    <article className={styles.card}>
      <header>
        <span className={styles.category}>{market.category}</span>
        <span className={isOpen ? styles.open : styles.closed}>
          {isOpen ? "Aberto" : market.status === "resolved" ? "Resolvido" : "Encerrado"}
        </span>
      </header>

      <Link to={`/markets/${market._id}`} className={styles.title}>
        <h3>{market.title}</h3>
      </Link>
      <p>{shortText(market.description)}</p>

      <div className={styles.meta}>
        <span>Fecha {deadlineLabel(market.deadline)}</span>
        <span>{market.totalVotes || 0} palpites</span>
      </div>

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
            <Link to={`/markets/${market._id}`} className={styles.yes}>Votar SIM</Link>
            <Link to={`/markets/${market._id}`} className={styles.no}>Votar NÃO</Link>
          </>
        ) : (
          <Link to={`/markets/${market._id}`} className={styles.result}>Ver resultado</Link>
        )}
      </div>
    </article>
  );
}
