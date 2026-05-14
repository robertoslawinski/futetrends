import { Link } from "react-router-dom";
import styles from "./MarketCard.module.css";

function shortText(text) {
  if (!text) return "";
  return text.length > 118 ? `${text.slice(0, 118)}...` : text;
}

function trendLabel(market) {
  const yesPercent = market.voteBreakdown?.yesPercent || 0;
  const noPercent = market.voteBreakdown?.noPercent || 0;
  if (!market.totalVotes) return "sem consenso";
  return yesPercent >= noPercent ? `SIM ${yesPercent}%` : `NÃO ${noPercent}%`;
}

export default function MarketCard({ market }) {
  const deadline = new Date(market.deadline).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const score = Math.min(96, 24 + (market.pointsValue || 0) / 4 + (market.totalVotes || 0) * 2);

  return (
    <Link to={`/markets/${market._id}`} className={styles.card}>
      <span className={styles.category}>{market.category}</span>
      <h3>{market.title}</h3>
      <p>{shortText(market.description)}</p>
      <footer>
        <span>{Math.round(score)} score</span>
        <span>{trendLabel(market)}</span>
        <span>{deadline}</span>
      </footer>
    </Link>
  );
}
