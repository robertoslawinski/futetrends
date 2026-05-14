import { useEffect, useState } from "react";
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

function demoTeam(name, id) {
  return { id, name, logo: `https://media.api-sports.io/football/teams/${id}.png` };
}

function demoMatch(id, mode, home, away, homeGoals, awayGoals, offsetDays, statusLabel = "Ao vivo", redCards = { home: 0, away: 0 }) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const scoreGap = Math.abs(homeGoals - awayGoals);
  const totalGoals = homeGoals + awayGoals;

  return {
    id,
    mode,
    competition: "Brasileirão Série A",
    date: date.toISOString(),
    status: { label: statusLabel },
    home: { ...home, goals: homeGoals, winner: homeGoals > awayGoals },
    away: { ...away, goals: awayGoals, winner: awayGoals > homeGoals },
    redCards,
    metrics: {
      pressureIndex: Math.min(96, 46 + scoreGap * 12 + totalGoals * 4 + (redCards.home + redCards.away) * 14),
      fanHeat: Math.min(96, 48 + totalGoals * 8),
      narrativeScore: Math.min(96, 48 + totalGoals * 7 + scoreGap * 6),
      clubMomentum: Math.min(96, 44 + scoreGap * 12),
      varImpact: Math.min(82, 28 + scoreGap * 8 + (redCards.home + redCards.away) * 18)
    }
  };
}

function clientFallback() {
  const flamengo = demoTeam("Flamengo", 127);
  const palmeiras = demoTeam("Palmeiras", 121);
  const corinthians = demoTeam("Corinthians", 131);
  const saoPaulo = demoTeam("São Paulo", 126);
  const botafogo = demoTeam("Botafogo", 120);
  const fluminense = demoTeam("Fluminense", 124);

  return {
    summary: {
      provider: "demo",
      trendingNow: "Flamengo x Palmeiras",
      pressureRising: "Corinthians sob pressão",
      mostDiscussed: "Clássicos e arbitragem"
    },
    liveMatches: [
      demoMatch(8001, "live", flamengo, palmeiras, 1, 1, 0, "68'"),
      demoMatch(8002, "live", corinthians, saoPaulo, 0, 1, 0, "54'", { home: 1, away: 0 })
    ],
    recentResults: [
      demoMatch(8003, "result", botafogo, fluminense, 2, 0, -1, "Final"),
      demoMatch(8004, "result", palmeiras, corinthians, 2, 1, -3, "Final")
    ],
    upcomingFixtures: [
      demoMatch(8005, "upcoming", flamengo, botafogo, 0, 0, 2, "Agendado"),
      demoMatch(8006, "upcoming", saoPaulo, palmeiras, 0, 0, 3, "Agendado")
    ]
  };
}

function pressureLabel(value) {
  if (value >= 78) return "Pressão alta";
  if (value >= 60) return "Clima quente";
  return "Em observação";
}

function TeamLine({ team }) {
  return (
    <div className={styles.teamLine}>
      {team.logo && <img src={team.logo} alt="" />}
      <span>{team.name}</span>
    </div>
  );
}

function LiveMatchCard({ match }) {
  const redTotal = (match.redCards?.home || 0) + (match.redCards?.away || 0);

  return (
    <article className={styles.liveCard}>
      <div className={styles.cardTop}>
        <span className={styles.livePill}><i /> {match.status.label}</span>
        <small>{match.competition}</small>
      </div>
      <div className={styles.scoreLine}>
        <TeamLine team={match.home} />
        <strong>{match.home.goals} - {match.away.goals}</strong>
        <TeamLine team={match.away} />
      </div>
      <p>{pressureLabel(match.metrics.pressureIndex)}. {redTotal ? "Cartão vermelho mudou o tom do jogo." : "Cada lance pesa na conversa da torcida."}</p>
    </article>
  );
}

function ResultCard({ match }) {
  const winner = match.home.winner ? match.home.name : match.away.winner ? match.away.name : "Empate";
  return (
    <article className={styles.sideCard}>
      <span>Resultado</span>
      <strong>{match.home.name} {match.home.goals} - {match.away.goals} {match.away.name}</strong>
      <p>{winner === "Empate" ? "O empate deixa a discussão em aberto." : `${winner} ganha fôlego; o outro lado acorda pressionado.`}</p>
    </article>
  );
}

function FixtureCard({ match }) {
  return (
    <article className={styles.sideCard}>
      <span>{formatKickoff(match.date)}</span>
      <strong>{match.home.name} x {match.away.name}</strong>
      <p>{match.metrics.varImpact > 50 ? "Jogo com potencial de polêmica." : "Pré-jogo já começa a mover narrativas."}</p>
    </article>
  );
}

export default function FootballIntelligence() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/football/intelligence")
      .then(({ data }) => setData(data))
      .catch((err) => {
        console.warn("Using demo football intelligence fallback:", errorMessage(err));
        setData(clientFallback());
      });
  }, []);

  if (!data) return <section className={styles.shell}><div className="notice">Carregando jogos da rodada...</div></section>;

  return (
    <section id="live-radar" className={styles.shell} aria-label="Jogos mudando narrativas ao vivo">
      <div className={styles.heading}>
        <div>
          <span>Jogos ao vivo</span>
          <h2>Jogos mudando narrativas ao vivo</h2>
        </div>
        <p>{data.summary.provider === "api-football" ? "Dados ao vivo via API-Football" : "Demonstração com dados simulados"}</p>
      </div>

      <div className={styles.liveGrid}>
        {data.liveMatches.length ? data.liveMatches.slice(0, 2).map((match) => <LiveMatchCard key={match.id} match={match} />) : (
          <div className={styles.emptyCard}>Nenhum jogo ao vivo agora. Quando a bola rolar, o radar mostra o que está mudando.</div>
        )}
      </div>

      <div className={styles.contextGrid}>
        <div>
          <h3>Resultados recentes</h3>
          <div className={styles.stack}>
            {data.recentResults.slice(0, 2).map((match) => <ResultCard key={match.id} match={match} />)}
          </div>
        </div>
        <div>
          <h3>Próximos jogos</h3>
          <div className={styles.stack}>
            {data.upcomingFixtures.slice(0, 2).map((match) => <FixtureCard key={match.id} match={match} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
