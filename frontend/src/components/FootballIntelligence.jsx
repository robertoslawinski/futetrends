import { useEffect, useMemo, useState } from "react";
import { api, errorMessage } from "../api/client.js";
import styles from "./FootballIntelligence.module.css";

function formatKickoff(date) {
  if (!date) return "A definir";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

function trendIcon(trend) {
  if (trend === "up") return "↗";
  if (trend === "down") return "↘";
  return "→";
}

function Metric({ label, value, tone = "blue" }) {
  return (
    <div className={styles.metric}>
      <div>
        <span>{label}</span>
        <strong className={styles[tone]}>{value}</strong>
      </div>
      <i><b style={{ width: `${value}%` }} /></i>
    </div>
  );
}

function TeamLine({ team, align = "left" }) {
  return (
    <div className={`${styles.teamLine} ${styles[align]}`}>
      {team.logo && <img src={team.logo} alt="" />}
      <span>{team.name}</span>
    </div>
  );
}

function MatchScore({ match, compact = false }) {
  return (
    <div className={compact ? styles.compactScore : styles.scoreBox}>
      <TeamLine team={match.home} />
      <strong>{match.home.goals} - {match.away.goals}</strong>
      <TeamLine team={match.away} align="right" />
    </div>
  );
}

function LiveMatchCard({ match }) {
  const pressureTone = match.metrics.pressureIndex > 72 ? "red" : "orange";

  return (
    <article className={`${styles.card} ${styles.liveCard}`}>
      <div className={styles.cardTop}>
        <span className={styles.livePill}><i /> {match.status.label}</span>
        <small>{match.competition}</small>
      </div>
      <MatchScore match={match} />
      <div className={styles.matchSignals}>
        <Metric label="Pressure Index™" value={match.metrics.pressureIndex} tone={pressureTone} />
        <Metric label="Club Momentum™" value={match.metrics.clubMomentum} />
      </div>
      <div className={styles.narrativeLine}>
        <strong>{match.metrics.pressureIndex > 70 ? "Pressure Rising" : "Narrativa ativa"}</strong>
        <span>{match.home.name} {trendIcon(match.home.trend)} · {match.away.name} {trendIcon(match.away.trend)}</span>
      </div>
    </article>
  );
}

function ResultCard({ match }) {
  const winner = match.home.winner ? match.home.name : match.away.winner ? match.away.name : "Empate";
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span>Resultado</span>
        <small>{formatKickoff(match.date)}</small>
      </div>
      <MatchScore match={match} compact />
      <div className={styles.resultImpact}>
        <strong>{winner}</strong>
        <span>{match.metrics.pressureIndex > 64 ? "impacto alto na pressão" : "momentum recalibrado"}</span>
      </div>
      <Metric label="Narrative Score™" value={match.metrics.narrativeScore} />
    </article>
  );
}

function FixtureCard({ match }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span>{match.competition}</span>
        <small>{formatKickoff(match.date)}</small>
      </div>
      <div className={styles.fixtureTeams}>
        <TeamLine team={match.home} />
        <span>vs</span>
        <TeamLine team={match.away} align="right" />
      </div>
      <div className={styles.predictiveGrid}>
        <Metric label="Fan Heat™" value={match.metrics.fanHeat} tone="orange" />
        <Metric label="VAR Impact™" value={match.metrics.varImpact} />
      </div>
    </article>
  );
}

export default function FootballIntelligence() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/football/intelligence")
      .then(({ data }) => {
        setData(data);
        setError("");
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const summaryCards = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Trending Now", value: data.summary.trendingNow, tone: "blue" },
      { label: "Pressure Rising", value: data.summary.pressureRising, tone: "orange" },
      { label: "Most Discussed", value: data.summary.mostDiscussed, tone: "blue" }
    ];
  }, [data]);

  if (error) return <section className={styles.shell}><div className="error">{error}</div></section>;
  if (!data) return <section className={styles.shell}><div className="notice">Carregando dados de futebol...</div></section>;

  return (
    <section className={styles.shell} aria-label="FuteTrends football intelligence">
      <div className={styles.heading}>
        <div>
          <span className="eyebrow">Football intelligence</span>
          <h2>Radar vivo da rodada brasileira</h2>
          <p>Placar, resultados e agenda viram sinais de pressão, momentum e narrativa.</p>
        </div>
        <div className={styles.source}>
          <i />
          <span>{data.summary.provider === "api-football" ? "API-Football live" : "Demo intelligence"}</span>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        {summaryCards.map((card) => (
          <article key={card.label} className={styles.summaryCard}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.indexGrid}>
        <Metric label="Pressure Index™" value={data.summary.indexes.pressureIndex} tone="orange" />
        <Metric label="Fan Heat™" value={data.summary.indexes.fanHeat} tone="orange" />
        <Metric label="Narrative Score™" value={data.summary.indexes.narrativeScore} />
        <Metric label="Club Momentum™" value={data.summary.indexes.clubMomentum} />
        <Metric label="VAR Impact™" value={data.summary.indexes.varImpact} tone="red" />
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.columnWide}>
          <div className={styles.sectionTitle}>
            <h3>Ao vivo</h3>
            <span>{data.liveMatches.length} jogos</span>
          </div>
          <div className={styles.liveGrid}>
            {data.liveMatches.length ? data.liveMatches.map((match) => <LiveMatchCard key={match.id} match={match} />) : (
              <div className={styles.emptyCard}>Nenhum jogo ao vivo agora. O radar volta a pulsar quando a bola rolar.</div>
            )}
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>
            <h3>Resultados recentes</h3>
            <span>Impacto</span>
          </div>
          <div className={styles.stack}>
            {data.recentResults.slice(0, 3).map((match) => <ResultCard key={match.id} match={match} />)}
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>
            <h3>Próximos jogos</h3>
            <span>Pré-jogo</span>
          </div>
          <div className={styles.stack}>
            {data.upcomingFixtures.slice(0, 3).map((match) => <FixtureCard key={match.id} match={match} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
