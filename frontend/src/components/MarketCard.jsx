import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { getVoteViewState } from "../utils/voteVisibility.js";
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
  const { canVote, hasUserVote, isOpen, showCommunity, showVoteCount } = getVoteViewState(market);

  return (
    <article className={styles.card}>
      <Link to={`/markets/${market._id}`} className={styles.title}>
        <h3>{market.title}</h3>
      </Link>

      {showCommunity && (
        <div className={styles.voteResult}>
          <div className={styles.voteConfirmation}>
            <CheckCircle2 aria-hidden="true" />
            Seu palpite: {market.userVote === "yes" ? "SIM" : "NÃO"}
          </div>
          <p className={styles.communityLabel}>O que a torcida acha</p>
          <div className={styles.splitBar} aria-label={`SIM ${yesPercent}%, NÃO ${noPercent}%`}>
            <i style={{ width: `${yesPercent}%` }} />
            <b style={{ width: `${noPercent}%` }} />
          </div>
          <div className={styles.percentages}>
            <strong>SIM <em>{yesPercent}%</em></strong>
            <strong>NÃO <em>{noPercent}%</em></strong>
          </div>
        </div>
      )}

      {canVote && <p className={styles.votePrompt}>Qual é o seu palpite?</p>}
      {canVote && (
        <div className={styles.actions}>
          <Link to={`/markets/${market._id}`} state={{ choice: "yes" }} className={styles.yes}>SIM</Link>
          <Link to={`/markets/${market._id}`} state={{ choice: "no" }} className={styles.no}>NÃO</Link>
        </div>
      )}

      <div className={styles.meta}>
        {market.pointsValue && <strong>Vale {market.pointsValue} pts</strong>}
        <span>Encerra {deadlineLabel(market.deadline)}</span>
        {showVoteCount && <span>{market.totalVotes} palpites</span>}
      </div>

      {!canVote && (
        <div className={styles.actions}>
          <Link to={`/markets/${market._id}`} className={styles.result}>
            {hasUserVote ? "Ver detalhes" : "Ver resultado"}
          </Link>
        </div>
      )}

      <footer>
        <span className={styles.category}>{market.category}</span>
        <span className={isOpen ? styles.open : styles.closed}>
          {isOpen ? "Aberto" : market.status === "resolved" ? "Resolvido" : "Encerrado"}
        </span>
      </footer>
    </article>
  );
}
