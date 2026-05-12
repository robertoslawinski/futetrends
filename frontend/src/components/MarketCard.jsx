import { Link } from "react-router-dom";
import { getMarketBadges } from "../utils/marketBadges.js";
import { getMarketInsight } from "../utils/marketInsights.js";
import styles from "./MarketCard.module.css";

export default function MarketCard({ market }) {
  const deadline = new Date(market.deadline).toLocaleDateString();
  const statusLabel = { open: "aberto", closed: "fechado", resolved: "resolvido" }[market.status] || market.status;
  const badges = getMarketBadges(market);
  const insight = getMarketInsight(market);
  return (
    <Link to={`/markets/${market._id}`} className={styles.card}>
      <div className={styles.topline}>
        <span>{market.category}</span>
        <strong className={styles[market.status]}>{statusLabel}</strong>
      </div>
      <h3>{market.title}</h3>
      <p>{market.description}</p>
      <div className={styles.badges}>
        {badges.map((badge) => <span key={badge}>{badge}</span>)}
      </div>
      <div className={styles.meta}>
        <span>{market.pointsValue} pts</span>
        <span>{market.totalVotes} palpites</span>
        <span>Fecha {deadline}</span>
      </div>
      <div className={`${styles.insight} ${styles[insight.tone]}`}>
        <strong>{insight.label}</strong>
        <span>{insight.detail}</span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ width: `${market.voteBreakdown?.yesPercent || 0}%` }} />
      </div>
    </Link>
  );
}
