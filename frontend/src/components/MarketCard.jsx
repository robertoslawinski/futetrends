import { Link } from "react-router-dom";
import { getMarketBadges } from "../utils/marketBadges.js";
import { getMarketInsight } from "../utils/marketInsights.js";
import styles from "./MarketCard.module.css";

function shortText(text) {
  if (!text) return "";
  return text.length > 132 ? `${text.slice(0, 132)}...` : text;
}

export default function MarketCard({ market }) {
  const deadline = new Date(market.deadline).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const statusLabel = { open: "ao vivo", closed: "fechado", resolved: "resolvido" }[market.status] || market.status;
  const badges = getMarketBadges(market);
  const insight = getMarketInsight(market);
  const yesPercent = market.voteBreakdown?.yesPercent || 0;
  const noPercent = market.voteBreakdown?.noPercent || 0;
  const narrativeScore = Math.min(99, 42 + (market.pointsValue || 0) + (market.totalVotes || 0) * 4);
  const leader = yesPercent >= noPercent ? "SIM" : "NÃO";

  return (
    <Link to={`/markets/${market._id}`} className={styles.card}>
      <div className={styles.topline}>
        <span>{market.category}</span>
        <strong className={styles[market.status]}>{statusLabel}</strong>
      </div>
      <h3>{market.title}</h3>
      <p>{shortText(market.description)}</p>

      <div className={styles.signalStrip}>
        <div>
          <span>Narrative Score™</span>
          <strong>{narrativeScore}</strong>
        </div>
        <div>
          <span>Tendência</span>
          <strong>{leader} {Math.max(yesPercent, noPercent)}%</strong>
        </div>
      </div>

      <div className={styles.badges}>
        {badges.slice(0, 3).map((badge) => <span key={badge}>{badge}</span>)}
      </div>

      <div className={styles.meta}>
        <span>{market.pointsValue} pts</span>
        <span>{market.totalVotes || 0} sinais</span>
        <span>{deadline}</span>
      </div>

      <div className={`${styles.insight} ${styles[insight.tone]}`}>
        <strong>{insight.label}</strong>
        <span>{insight.detail}</span>
      </div>

      <div className={styles.bar} aria-hidden="true">
        <span style={{ width: `${yesPercent}%` }} />
      </div>
    </Link>
  );
}
