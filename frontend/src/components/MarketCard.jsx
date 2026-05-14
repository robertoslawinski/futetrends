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
  return yesPercent >= noPercent ? `torcida puxa SIM` : `torcida puxa NÃO`;
}

export default function MarketCard({ market }) {
  const deadline = new Date(market.deadline).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return (
    <Link to={`/markets/${market._id}`} className={styles.card}>
      <span className={styles.category}>{market.category}</span>
      <h3>{market.title}</h3>
      <p>{shortText(market.description)}</p>
      <footer>
        <span>{trendLabel(market)}</span>
        <span>{deadline}</span>
      </footer>
    </Link>
  );
}
