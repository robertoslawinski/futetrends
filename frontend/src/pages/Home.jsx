import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Crosshair, Medal, Target, Trophy } from "lucide-react";
import { api, errorMessage } from "../api/client.js";
import stadiumHero from "../assets/stadium-hero.png";
import MarketCard from "../components/MarketCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getVoteViewState } from "../utils/voteVisibility.js";
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
  const { canVote, showCommunity, showVoteCount } = getVoteViewState(market);

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
          {showVoteCount && <span>{market.totalVotes} palpites</span>}
          {market.pointsValue && <span className={styles.pointsValue}>Vale {market.pointsValue} pts</span>}
        </div>
      </div>

      <div className={styles.featuredVote}>
        {showCommunity ? (
          <>
            <div className={styles.voteConfirmation}>
              <CheckCircle2 aria-hidden="true" />
              Seu palpite: {market.userVote === "yes" ? "SIM" : "NÃO"}
            </div>
            <p className={styles.communityLabel}>O que a torcida acha</p>
            <div className={styles.votePercentages}>
              <strong>SIM <b>{yesPercent}%</b></strong>
              <strong>NÃO <b>{noPercent}%</b></strong>
            </div>
            <div className={styles.voteBar} aria-label={`SIM ${yesPercent}%, NÃO ${noPercent}%`}>
              <i style={{ width: `${yesPercent}%` }} />
              <b style={{ width: `${noPercent}%` }} />
            </div>
          </>
        ) : canVote ? (
          <>
            <p className={styles.votePrompt}>Qual é o seu palpite?</p>
            <div className={styles.voteActions}>
              <Link to={`/markets/${market._id}`} state={{ choice: "yes" }} className={styles.yesVote}>SIM</Link>
              <Link to={`/markets/${market._id}`} state={{ choice: "no" }} className={styles.noVote}>NÃO</Link>
            </div>
          </>
        ) : (
          <div className={styles.closedVote}>Palpite encerrado</div>
        )}
      </div>
    </article>
  );
}

function RankingSection({ ranking, user }) {
  const userId = user?._id || user?.id;
  const currentUser = userId ? ranking.find((entry) => entry.id === userId) : null;
  const hasFullRanking = ranking.length >= 3;

  return (
    <section id="ranking" className={`${styles.section} ${styles.rankingSection}`}>
      <div className={styles.sectionHeading}>
        <div>
          <span>Ranking FuteTrends</span>
          <h2>Quem entende mais de futebol?</h2>
        </div>
        {hasFullRanking && <Link to="/ranking" className={styles.textLink}>Ver ranking completo</Link>}
      </div>

      {hasFullRanking ? (
        <div className={`${styles.rankingPanel} ${!user ? styles.rankingPanelPublic : ""}`}>
          <div className={styles.rankingList}>
            {ranking.slice(0, 3).map((entry, index) => (
              <div className={styles.rankingEntry} data-leader={index === 0 || undefined} key={entry.id}>
                <span className={styles.rankMedal} data-rank={index + 1} aria-label={`${entry.rank}º lugar`}><Medal aria-hidden="true" /></span>
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
            <strong>O topo está livre.</strong>
            <span>Acerte seus palpites e seja um dos primeiros a chegar ao topo.</span>
          </div>
          <Link to="/palpites">FAZER UM PALPITE</Link>
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
          <h1>Você entende de futebol? <strong>Prove.</strong></h1>
          <p>Dê seus palpites, ganhe pontos e suba no ranking.</p>
          <a href="#palpite-da-rodada" className={styles.primaryAction}>COMEÇAR A PALPITAR</a>
          <small>Grátis <i /> Sem apostas em dinheiro</small>
        </div>
      </section>

      <div className={styles.content}>
        {error && <div className="error">{error}</div>}

        <section id="palpite-da-rodada" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div><span>Palpite da rodada</span><h2>Dê seu palpite.</h2></div>
          </div>
          {loading ? <div className={styles.emptyState}>Carregando palpite...</div> : <FeaturedPalpite market={featuredMarket} />}
        </section>

        <RankingSection ranking={ranking} user={user} />

        <section id="palpites" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div><h2>Mais palpites</h2></div>
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
            <div><Target aria-hidden="true" /><strong>Acerte</strong></div><i aria-hidden="true" />
            <div className={styles.pointsStep}><strong>+ Pontos</strong></div><i aria-hidden="true" />
            <div><Trophy aria-hidden="true" /><strong>Suba no ranking</strong></div>
          </div>
          <p>Quanto mais você acerta, mais sobe no ranking.</p>
        </section>
      </div>

      <section className={styles.finalCta}>
        {user ? (
          <>
            <div><h2>Continue subindo no ranking.</h2><p>Faça seus próximos palpites.</p></div>
            <Link to="/palpites" className={styles.primaryAction}>VER PALPITES</Link>
          </>
        ) : (
          <>
            <div><h2>Pronto para provar que entende de futebol?</h2><p>Comece grátis.</p></div>
            <Link to="/signup" className={styles.primaryAction}>CRIAR CONTA GRÁTIS</Link>
          </>
        )}
      </section>
    </div>
  );
}
