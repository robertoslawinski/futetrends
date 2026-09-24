import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Crosshair, Trophy, TrendingUp } from "lucide-react";
import { api, errorMessage } from "../api/client.js";
import stadiumHero from "../assets/stadium-hero.png";
import MarketCard from "../components/MarketCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Home.module.css";

function deadlineLabel(deadline) {
  return new Date(deadline).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function FeaturedPalpite({ market }) {
  if (!market) {
    return (
      <div className={styles.emptyState}>
        <strong>O próximo palpite está sendo preparado.</strong>
        <span>Volte em breve para ser um dos primeiros a responder.</span>
      </div>
    );
  }

  const yesPercent = market.voteBreakdown?.yesPercent || 0;
  const noPercent = market.voteBreakdown?.noPercent || 0;

  return (
    <article className={styles.featuredCard}>
      <div className={styles.featuredQuestion}>
        <div className={styles.cardTopline}>
          <span>{market.category}</span>
          <em>Aberto</em>
        </div>
        <Link to={`/markets/${market._id}`}>
          <h3>{market.title}</h3>
        </Link>
        <div className={styles.featuredMeta}>
          <span>Encerra {deadlineLabel(market.deadline)}</span>
          <span>{market.totalVotes || 0} {market.totalVotes === 1 ? "palpite" : "palpites"}</span>
          <span>{market.pointsValue} pontos</span>
        </div>
      </div>

      <div className={styles.featuredVote}>
        <div className={styles.votePercentages}>
          <strong>SIM <b>{yesPercent}%</b></strong>
          <strong>NÃO <b>{noPercent}%</b></strong>
        </div>
        <div className={styles.voteBar} aria-label={`SIM ${yesPercent}%, NÃO ${noPercent}%`}>
          <i style={{ width: `${yesPercent}%` }} />
          <b style={{ width: `${noPercent}%` }} />
        </div>
        <div className={styles.voteActions}>
          <Link to={`/markets/${market._id}`} state={{ choice: "yes" }} className={market.userVote === "yes" ? styles.selectedVote : styles.yesVote}>
            {market.userVote === "yes" ? "Meu palpite: SIM" : "SIM"}
          </Link>
          <Link to={`/markets/${market._id}`} state={{ choice: "no" }} className={market.userVote === "no" ? styles.selectedVote : styles.noVote}>
            {market.userVote === "no" ? "Meu palpite: NÃO" : "NÃO"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function RankingSection({ ranking, user }) {
  const userId = user?._id || user?.id;
  const currentUser = userId ? ranking.find((entry) => entry.id === userId) : null;

  return (
    <section id="ranking" className={styles.section}>
      <div className={styles.sectionHeading}>
        <div>
          <span>Ranking FuteTrends</span>
          <h2>Quem entende mais de futebol?</h2>
        </div>
        <Link to="/ranking" className={styles.textLink}>Ver ranking completo</Link>
      </div>

      {ranking.length ? (
        <div className={`${styles.rankingPanel} ${!user ? styles.rankingPanelPublic : ""}`}>
          <div className={styles.rankingList}>
            {ranking.slice(0, 3).map((entry, index) => (
              <div className={styles.rankingEntry} data-leader={index === 0 || undefined} key={entry.id}>
                <span className={styles.rankNumber}>{entry.rank}</span>
                <span className={styles.rankAvatar}>{entry.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{entry.name}</strong>
                  <small>{entry.accuracy}% de acerto</small>
                </div>
                <b>{entry.points} pts</b>
              </div>
            ))}
          </div>
          {user && (
            <div className={styles.userRank}>
              <span>Sua posição</span>
              {currentUser ? (
                <strong>#{currentUser.rank} · {currentUser.points} pts</strong>
              ) : user.points ? (
                <strong>{user.points} pts · veja sua posição completa</strong>
              ) : (
                <strong>Faça seu primeiro palpite para entrar.</strong>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.rankingEmpty}>
          <Trophy size={28} aria-hidden="true" />
          <div>
            <strong>O ranking está começando.</strong>
            <span>Faça seus palpites e seja um dos primeiros a chegar ao topo.</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [markets, setMarkets] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/predictions")
      .then(({ data }) => setMarkets(data.predictions || []))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));

    api.get("/api/ranking")
      .then(({ data }) => setRanking(data.ranking || []))
      .catch(() => setRanking([]));
  }, []);

  const openMarkets = useMemo(
    () => markets.filter((market) => market.status === "open" && new Date(market.deadline) > new Date()),
    [markets]
  );
  const featuredMarket = useMemo(
    () => [...openMarkets].sort((a, b) => ((b.totalVotes || 0) + b.pointsValue) - ((a.totalVotes || 0) + a.pointsValue))[0],
    [openMarkets]
  );
  const visibleMarkets = useMemo(
    () => openMarkets.filter((market) => market._id !== featuredMarket?._id).slice(0, 3),
    [openMarkets, featuredMarket]
  );

  return (
    <div className={styles.home}>
      <section className={styles.hero} style={{ "--hero-image": `url(${stadiumHero})` }}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Palpites de futebol valendo pontos</span>
          <h1>Você entende de futebol? Prove.</h1>
          <p>Dê seus palpites, marque pontos e suba no ranking.</p>
          <a href="#palpite-da-rodada" className={styles.primaryAction}>Começar a palpitar</a>
          <small>Grátis <i /> Sem apostas em dinheiro</small>
        </div>
      </section>

      <div className={styles.content}>
        {error && <div className="error">{error}</div>}

        <section id="palpite-da-rodada" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div><span>Palpite da rodada</span><h2>Escolha um lado.</h2></div>
          </div>
          {loading ? <div className={styles.emptyState}>Carregando palpite...</div> : <FeaturedPalpite market={featuredMarket} />}
        </section>

        <RankingSection ranking={ranking} user={user} />

        <section id="palpites" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div><span>Mais palpites</span><h2>Acerte mais. Ganhe mais pontos.</h2></div>
          </div>
          {loading ? (
            <div className={styles.emptyState}>Carregando palpites...</div>
          ) : visibleMarkets.length ? (
            <div className={styles.marketGrid}>
              {visibleMarkets.map((market) => <MarketCard market={market} key={market._id} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>Novos palpites chegam em breve.</strong>
              <span>Quando uma nova pergunta abrir, ela aparece aqui.</span>
            </div>
          )}
          <Link to="/palpites" className={styles.outlineAction}>Ver todos os palpites</Link>
        </section>

        <section id="how-it-works" className={`${styles.section} ${styles.howItWorks}`}>
          <span>Como funciona</span>
          <div className={styles.steps}>
            <div><Crosshair aria-hidden="true" /><strong>Palpite</strong></div><i aria-hidden="true" />
            <div><Check aria-hidden="true" /><strong>Acerte</strong></div><i aria-hidden="true" />
            <div><Trophy aria-hidden="true" /><strong>Ganhe pontos</strong></div><i aria-hidden="true" />
            <div><TrendingUp aria-hidden="true" /><strong>Suba no ranking</strong></div>
          </div>
          <p>Sem apostas em dinheiro. Só futebol e competição.</p>
        </section>
      </div>

      <section className={styles.finalCta}>
        <div><h2>Mostre que você entende de futebol.</h2><p>Comece grátis.</p></div>
        <Link to="/signup" className={styles.primaryAction}>Criar conta grátis</Link>
      </section>
    </div>
  );
}
