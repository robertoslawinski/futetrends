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

function matchLocation(match) {
  return match.location || [match.venue, match.venueCity].filter(Boolean).join(" · ") || "Local a definir";
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
    location: "Local a definir",
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

function pressureTeam(match) {
  if (match.home.winner === false) return match.home.name;
  if (match.away.winner === false) return match.away.name;
  return match.metrics.pressureIndex >= 70 ? match.home.name : null;
}

function narrativeForMatch(match) {
  const redTotal = (match.redCards?.home || 0) + (match.redCards?.away || 0);
  const target = pressureTeam(match);

  if (match.mode === "live") {
    if (redTotal) return "Cartão vermelho mudou o tom do jogo e aumentou a tensão da torcida.";
    if (match.metrics.pressureIndex >= 70) return "Cada lance pesa: a pressão já está virando assunto da rodada.";
    return "Jogo em aberto, com clima suficiente para mudar a conversa em tempo real.";
  }

  if (match.mode === "result") {
    if (target) return `${target} sai pressionado; o resultado já muda a leitura da semana.`;
    if (match.home.winner || match.away.winner) return "Vitória que dá fôlego e mexe no humor da torcida.";
    return "Empate que deixa a discussão aberta e mantém a pressão viva.";
  }

  if (match.metrics.varImpact > 50) return "Partida com potencial de arbitragem virar personagem.";
  if (match.metrics.fanHeat > 60) return "Pré-jogo quente: a torcida já está criando narrativa.";
  return "Jogo em foco para medir pressão, momento e reação da torcida.";
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
      <p>{pressureLabel(match.metrics.pressureIndex)}. {narrativeForMatch(match)}</p>
      <small className={styles.location}>{matchLocation(match)}</small>
    </article>
  );
}

function ResultCard({ match }) {
  const winner = match.home.winner ? match.home.name : match.away.winner ? match.away.name : "Empate";
  return (
    <article className={styles.sideCard}>
      <span>Resultado</span>
      <strong>{match.home.name} {match.home.goals} - {match.away.goals} {match.away.name}</strong>
      <p>{matchLocation(match)}. {winner === "Empate" ? "O empate deixa a discussão em aberto." : narrativeForMatch(match)}</p>
    </article>
  );
}

function FixtureCard({ match }) {
  return (
    <article className={styles.sideCard}>
      <span>{formatKickoff(match.date)}</span>
      <strong>{match.home.name} x {match.away.name}</strong>
      <p>{matchLocation(match)}. {narrativeForMatch(match)}</p>
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

  if (!data) return <section className={styles.shell}><div className="notice">Carregando radar de jogos...</div></section>;
  const isDemo = data.summary.provider !== "api-football";
  const hasMatches = data.liveMatches.length || data.recentResults.length || data.upcomingFixtures.length;

  if (!isDemo && !hasMatches) return null;

  return (
    <section id="live-radar" className={styles.shell} aria-label="Radar de jogos em foco">
      <div className={styles.heading}>
        <div>
          <span>Radar de jogos</span>
          <h2>Partidas que mexem com narrativas</h2>
        </div>
        <p>{isDemo ? "Dados reais aguardando conexão com API-Football." : "Brasileirão, Copa do Brasil e Libertadores com leitura de pressão, momento e torcida."}</p>
      </div>

      {isDemo ? (
        <div className={styles.setupCard}>
          <span>Radar em preparação</span>
          <strong>Os jogos reais aparecem aqui quando a API-Football estiver conectada.</strong>
          <p>Para evitar confusão, escondemos partidas simuladas da página pública. Assim o usuário nunca confunde exemplo com jogo real.</p>
        </div>
      ) : (
        <>
          <div className={styles.liveGrid}>
            {data.liveMatches.length ? data.liveMatches.slice(0, 2).map((match) => <LiveMatchCard key={match.id} match={match} />) : (
              <div className={styles.emptyCard}>Nenhum jogo ao vivo agora. Abaixo ficam resultados recentes e próximos jogos com potencial de mexer nas narrativas.</div>
            )}
          </div>

          <div className={styles.contextGrid}>
            <div>
              <h3>Resultados recentes</h3>
              <div className={styles.stack}>
                {data.recentResults.length ? data.recentResults.slice(0, 2).map((match) => <ResultCard key={match.id} match={match} />) : (
                  <div className={styles.emptyCard}>Nenhum resultado recente encontrado nas competições brasileiras conectadas.</div>
                )}
              </div>
            </div>
            <div>
              <h3>Próximos jogos em foco</h3>
              <div className={styles.stack}>
                {data.upcomingFixtures.length ? data.upcomingFixtures.slice(0, 2).map((match) => <FixtureCard key={match.id} match={match} />) : (
                  <div className={styles.emptyCard}>Nenhum jogo futuro encontrado nas competições brasileiras conectadas. Assim que a API liberar a tabela, ele entra no radar.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
