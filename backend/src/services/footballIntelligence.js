const API_BASE_URL = "https://v3.football.api-sports.io";
const BRAZIL_LEAGUE_ID = process.env.APIFOOTBALL_BRAZIL_LEAGUE_ID || "71";
const SEASON = process.env.APIFOOTBALL_SEASON || String(new Date().getFullYear());
const CACHE_TTL_MS = Number(process.env.APIFOOTBALL_CACHE_TTL_MS || 60_000);

let cache = {
  expiresAt: 0,
  payload: null
};

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function clamp(value, min = 0, max = 99) {
  return Math.max(min, Math.min(max, value));
}

function trendFromScore(homeGoals = 0, awayGoals = 0, isHome = true) {
  if (homeGoals === awayGoals) return "stable";
  const winningHome = homeGoals > awayGoals;
  return winningHome === isHome ? "up" : "down";
}

function statusLabel(status) {
  const code = status?.short;
  if (["1H", "2H", "ET", "BT", "P", "LIVE"].includes(code)) return `${status.elapsed || ""}'`.trim() || "Ao vivo";
  if (code === "HT") return "Intervalo";
  if (["FT", "AET", "PEN"].includes(code)) return "Final";
  if (["NS", "TBD"].includes(code)) return "Agendado";
  return status?.long || code || "Status";
}

function buildMetrics(fixture, mode = "upcoming") {
  const elapsed = fixture.fixture?.status?.elapsed || 0;
  const homeGoals = fixture.goals?.home || 0;
  const awayGoals = fixture.goals?.away || 0;
  const totalGoals = homeGoals + awayGoals;
  const redCards = {
    home: fixture.teams?.home?.redCards || 0,
    away: fixture.teams?.away?.redCards || 0
  };
  const scoreGap = Math.abs(homeGoals - awayGoals);
  const pressureBase = mode === "live" ? 48 : mode === "result" ? 38 : 34;

  return {
    pressureIndex: clamp(pressureBase + elapsed / 3 + scoreGap * 8 + (redCards.home + redCards.away) * 12),
    fanHeat: clamp(42 + totalGoals * 9 + elapsed / 4),
    narrativeScore: clamp(40 + totalGoals * 8 + scoreGap * 7 + (fixture.league?.name?.includes("Serie") ? 8 : 0)),
    clubMomentum: clamp(46 + scoreGap * 12 + (mode === "result" ? 10 : 0)),
    varImpact: clamp(24 + (redCards.home + redCards.away) * 18 + (mode === "live" && elapsed > 70 ? 12 : 0))
  };
}

function mapFixture(fixture, mode) {
  const homeGoals = fixture.goals?.home ?? fixture.score?.fulltime?.home ?? 0;
  const awayGoals = fixture.goals?.away ?? fixture.score?.fulltime?.away ?? 0;
  const homeWinner = fixture.teams?.home?.winner;
  const awayWinner = fixture.teams?.away?.winner;

  return {
    id: fixture.fixture?.id,
    mode,
    competition: fixture.league?.name || "Brasileirão",
    round: fixture.league?.round,
    date: fixture.fixture?.date,
    venue: fixture.fixture?.venue?.name,
    status: {
      short: fixture.fixture?.status?.short,
      long: fixture.fixture?.status?.long,
      elapsed: fixture.fixture?.status?.elapsed,
      label: statusLabel(fixture.fixture?.status)
    },
    home: {
      id: fixture.teams?.home?.id,
      name: fixture.teams?.home?.name,
      logo: fixture.teams?.home?.logo,
      goals: homeGoals,
      winner: homeWinner,
      trend: trendFromScore(homeGoals, awayGoals, true)
    },
    away: {
      id: fixture.teams?.away?.id,
      name: fixture.teams?.away?.name,
      logo: fixture.teams?.away?.logo,
      goals: awayGoals,
      winner: awayWinner,
      trend: trendFromScore(homeGoals, awayGoals, false)
    },
    redCards: {
      home: fixture.teams?.home?.redCards || 0,
      away: fixture.teams?.away?.redCards || 0
    },
    metrics: buildMetrics(fixture, mode)
  };
}

function summarize(liveMatches, recentResults, upcomingFixtures) {
  const all = [...liveMatches, ...recentResults, ...upcomingFixtures];
  const pressureMatch = all.reduce((top, match) => (
    !top || match.metrics.pressureIndex > top.metrics.pressureIndex ? match : top
  ), null);
  const heatMatch = all.reduce((top, match) => (
    !top || match.metrics.fanHeat > top.metrics.fanHeat ? match : top
  ), null);

  return {
    provider: process.env.APIFOOTBALL_API_KEY ? "api-football" : "demo",
    updatedAt: new Date().toISOString(),
    trendingNow: heatMatch ? `${heatMatch.home.name} x ${heatMatch.away.name}` : "Rodada brasileira",
    pressureRising: pressureMatch ? `${pressureMatch.home.name} sob pressão` : "Pressão de rodada",
    mostDiscussed: liveMatches[0] ? `${liveMatches[0].home.name} x ${liveMatches[0].away.name}` : "Narrativas da rodada",
    indexes: {
      pressureIndex: pressureMatch?.metrics.pressureIndex || 58,
      fanHeat: heatMatch?.metrics.fanHeat || 62,
      narrativeScore: heatMatch?.metrics.narrativeScore || 61,
      clubMomentum: pressureMatch?.metrics.clubMomentum || 55,
      varImpact: pressureMatch?.metrics.varImpact || 38
    }
  };
}

async function apiFootballFetch(path, params = {}) {
  if (!process.env.APIFOOTBALL_API_KEY) throw new Error("APIFOOTBALL_API_KEY is not configured");

  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": process.env.APIFOOTBALL_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`API-Football request failed with ${response.status}`);
  }

  const data = await response.json();
  return data.response || [];
}

async function fetchFromApiFootball() {
  const today = new Date();
  const [live, recent, upcoming] = await Promise.all([
    apiFootballFetch("/fixtures", { live: BRAZIL_LEAGUE_ID }),
    apiFootballFetch("/fixtures", {
      league: BRAZIL_LEAGUE_ID,
      season: SEASON,
      from: isoDate(addDays(today, -9)),
      to: isoDate(today),
      status: "FT-AET-PEN"
    }),
    apiFootballFetch("/fixtures", {
      league: BRAZIL_LEAGUE_ID,
      season: SEASON,
      from: isoDate(today),
      to: isoDate(addDays(today, 14)),
      status: "NS-TBD"
    })
  ]);

  const liveMatches = live.slice(0, 6).map((fixture) => mapFixture(fixture, "live"));
  const recentResults = recent.slice(-8).reverse().map((fixture) => mapFixture(fixture, "result"));
  const upcomingFixtures = upcoming.slice(0, 8).map((fixture) => mapFixture(fixture, "upcoming"));

  return {
    summary: summarize(liveMatches, recentResults, upcomingFixtures),
    liveMatches,
    recentResults,
    upcomingFixtures
  };
}

function demoTeam(name, id) {
  return {
    id,
    name,
    logo: `https://media.api-sports.io/football/teams/${id}.png`
  };
}

function demoFixture({ id, mode, home, away, homeGoals = 0, awayGoals = 0, elapsed, status, dateOffset = 0, competition = "Brasileirão Série A" }) {
  const fixture = {
    fixture: {
      id,
      date: addDays(new Date(), dateOffset).toISOString(),
      status: {
        short: status,
        long: status === "FT" ? "Match Finished" : status === "NS" ? "Not Started" : "Live",
        elapsed
      },
      venue: { name: "Brasil" }
    },
    league: { name: competition, round: "Rodada em foco" },
    teams: {
      home: { ...home, winner: homeGoals > awayGoals },
      away: { ...away, winner: awayGoals > homeGoals }
    },
    goals: { home: homeGoals, away: awayGoals }
  };
  return mapFixture(fixture, mode);
}

function fallbackPayload() {
  const flamengo = demoTeam("Flamengo", 127);
  const palmeiras = demoTeam("Palmeiras", 121);
  const corinthians = demoTeam("Corinthians", 131);
  const saoPaulo = demoTeam("São Paulo", 126);
  const botafogo = demoTeam("Botafogo", 120);
  const fluminense = demoTeam("Fluminense", 124);
  const vasco = demoTeam("Vasco", 133);
  const santos = demoTeam("Santos", 128);

  const liveMatches = [
    demoFixture({ id: 9001, mode: "live", home: flamengo, away: palmeiras, homeGoals: 1, awayGoals: 1, elapsed: 68, status: "2H" }),
    demoFixture({ id: 9002, mode: "live", home: corinthians, away: saoPaulo, homeGoals: 0, awayGoals: 1, elapsed: 54, status: "2H" })
  ];
  const recentResults = [
    demoFixture({ id: 9003, mode: "result", home: botafogo, away: fluminense, homeGoals: 2, awayGoals: 0, status: "FT", dateOffset: -1 }),
    demoFixture({ id: 9004, mode: "result", home: santos, away: vasco, homeGoals: 1, awayGoals: 2, status: "FT", dateOffset: -2 }),
    demoFixture({ id: 9005, mode: "result", home: palmeiras, away: corinthians, homeGoals: 2, awayGoals: 1, status: "FT", dateOffset: -3 })
  ];
  const upcomingFixtures = [
    demoFixture({ id: 9006, mode: "upcoming", home: flamengo, away: botafogo, status: "NS", dateOffset: 2 }),
    demoFixture({ id: 9007, mode: "upcoming", home: saoPaulo, away: palmeiras, status: "NS", dateOffset: 3 }),
    demoFixture({ id: 9008, mode: "upcoming", home: fluminense, away: santos, status: "NS", dateOffset: 4 })
  ];

  return {
    summary: summarize(liveMatches, recentResults, upcomingFixtures),
    liveMatches,
    recentResults,
    upcomingFixtures
  };
}

export async function getFootballIntelligence() {
  if (cache.payload && cache.expiresAt > Date.now()) return cache.payload;

  try {
    const payload = await fetchFromApiFootball();
    cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
    return payload;
  } catch (error) {
    const payload = fallbackPayload();
    payload.summary.warning = error.message;
    cache = { payload, expiresAt: Date.now() + 30_000 };
    return payload;
  }
}
