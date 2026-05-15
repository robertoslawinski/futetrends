const API_BASE_URL = "https://v3.football.api-sports.io";
const TARGET_LEAGUE_IDS = ["71", "73", "13"];
const DOMESTIC_BRAZIL_LEAGUE_IDS = ["71", "73"];
const INTERNATIONAL_LEAGUE_IDS = ["13"];
const FINISHED_STATUS = new Set(["FT", "AET", "PEN"]);
const CACHE_TTL_MS = Number(process.env.APIFOOTBALL_CACHE_TTL_MS || 300_000);
const FOOTBALL_RADAR_VERSION = "football-radar-target-leagues-2026-05-15";

let cache = {
  expiresAt: 0,
  payload: null
};

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function brazilLeagueIds() {
  const raw = process.env.APIFOOTBALL_BRAZIL_LEAGUE_IDS;
  if (!raw) return TARGET_LEAGUE_IDS;
  const requestedIds = raw.split(",").map((item) => item.trim()).filter(Boolean);
  return requestedIds.filter((id) => TARGET_LEAGUE_IDS.includes(id));
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function activeSeason() {
  const current = new Date().getFullYear();
  const configured = Number(process.env.APIFOOTBALL_SEASON);
  return Number.isInteger(configured) && configured >= current ? String(configured) : String(current);
}

function fixtureTime(fixture) {
  const date = fixture.fixture?.date ? new Date(fixture.fixture.date) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function sortByKickoffAsc(a, b) {
  return (fixtureTime(a)?.getTime() || 0) - (fixtureTime(b)?.getTime() || 0);
}

function sortByKickoffDesc(a, b) {
  return (fixtureTime(b)?.getTime() || 0) - (fixtureTime(a)?.getTime() || 0);
}

function isBetweenFixtureDates(fixture, fromDate, toDate) {
  const date = fixtureTime(fixture);
  return Boolean(date && date >= fromDate && date <= toDate);
}

function isFutureFixture(fixture, today) {
  const date = fixtureTime(fixture);
  return Boolean(date && date >= today);
}

function isBrazilianFixture(fixture) {
  const country = fixture.league?.country || "";
  const teams = `${fixture.teams?.home?.name || ""} ${fixture.teams?.away?.name || ""}`;
  return country.toLowerCase() === "brazil" || /flamengo|palmeiras|corinthians|santos|vasco|fluminense|botafogo|são paulo|sao paulo|grêmio|gremio|internacional|cruzeiro|atlético mineiro|atletico mineiro|bahia|fortaleza|ceará|ceara|sport recife|vitória|vitoria|bragantino|athletico|coritiba|goiás|goias/i.test(teams);
}

function isFinishedFixture(fixture) {
  return FINISHED_STATUS.has(fixture.fixture?.status?.short);
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hasBrazilianMajorClub(fixture) {
  const teams = normalizeText(`${fixture.teams?.home?.name || ""} ${fixture.teams?.away?.name || ""}`);
  return [
    "flamengo",
    "palmeiras",
    "corinthians",
    "santos",
    "vasco",
    "fluminense",
    "botafogo",
    "sao paulo",
    "gremio",
    "internacional",
    "cruzeiro",
    "atletico mineiro",
    "bahia",
    "fortaleza",
    "ceara",
    "sport recife",
    "vitoria",
    "bragantino",
    "athletico",
    "coritiba",
    "goias"
  ].some((club) => teams.includes(club));
}

function isRelevantBrazilianFixture(fixture, leagueIds = TARGET_LEAGUE_IDS) {
  const leagueId = String(fixture.league?.id || "");
  const country = normalizeText(fixture.league?.country);
  if (DOMESTIC_BRAZIL_LEAGUE_IDS.includes(leagueId)) return true;
  if (leagueIds.includes(leagueId) && country === "brazil") return true;
  if (INTERNATIONAL_LEAGUE_IDS.includes(leagueId)) return hasBrazilianMajorClub(fixture);
  return false;
}

function dedupeFixtures(fixtures) {
  const byId = new Map();
  fixtures.forEach((fixture) => {
    const id = fixture.fixture?.id;
    if (id) byId.set(id, fixture);
  });
  return [...byId.values()];
}

async function settledFixtures(requests) {
  const results = await Promise.allSettled(requests);
  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function fixturesByDates(startDate, days) {
  const requests = Array.from({ length: days }, (_, index) => (
    apiFootballFetch("/fixtures", { date: isoDate(addDays(startDate, index)) })
  ));
  return settledFixtures(requests);
}

function clamp(value, min = 0, max = 99) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function teamSide(event, fixture) {
  if (event.team?.id === fixture.teams?.home?.id) return "home";
  if (event.team?.id === fixture.teams?.away?.id) return "away";
  return "neutral";
}

function extractEvents(fixture) {
  const events = Array.isArray(fixture.events) ? fixture.events : [];
  const goals = [];
  const cards = [];
  const redCards = { home: 0, away: 0 };

  events.forEach((event) => {
    const side = teamSide(event, fixture);
    const detail = event.detail || "";
    const item = {
      minute: event.time?.elapsed,
      extra: event.time?.extra,
      team: event.team?.name,
      player: event.player?.name,
      detail
    };

    if (event.type === "Goal") goals.push(item);
    if (event.type === "Card") {
      cards.push(item);
      if (detail.toLowerCase().includes("red") && side !== "neutral") {
        redCards[side] += 1;
      }
    }
  });

  return { goals: goals.slice(-4), cards: cards.slice(-4), redCards };
}

function statusLabel(status) {
  const code = status?.short;
  if (["1H", "2H", "ET", "BT", "P", "LIVE"].includes(code)) return `${status.elapsed || ""}'`.trim() || "Ao vivo";
  if (code === "HT") return "Intervalo";
  if (["FT", "AET", "PEN"].includes(code)) return "Final";
  if (["NS", "TBD"].includes(code)) return "Agendado";
  return status?.long || code || "Status";
}

function trendFromScore(homeGoals = 0, awayGoals = 0, isHome = true) {
  if (homeGoals === awayGoals) return "stable";
  const winningHome = homeGoals > awayGoals;
  return winningHome === isHome ? "up" : "down";
}

function buildMetrics(fixture, mode = "upcoming") {
  const elapsed = fixture.fixture?.status?.elapsed || 0;
  const homeGoals = fixture.goals?.home ?? fixture.score?.fulltime?.home ?? 0;
  const awayGoals = fixture.goals?.away ?? fixture.score?.fulltime?.away ?? 0;
  const totalGoals = homeGoals + awayGoals;
  const redCards = fixture.intelligenceEvents?.redCards || { home: 0, away: 0 };
  const cardCount = (fixture.intelligenceEvents?.cards || []).length;
  const scoreGap = Math.abs(homeGoals - awayGoals);
  const derbyBoost = /flamengo|palmeiras|corinthians|santos|vasco|fluminense|botafogo|são paulo|sao paulo/i.test(
    `${fixture.teams?.home?.name} ${fixture.teams?.away?.name}`
  ) ? 8 : 0;
  const pressureBase = mode === "live" ? 46 : mode === "result" ? 38 : 34;

  return {
    pressureIndex: clamp(pressureBase + elapsed / 4 + scoreGap * 8 + (redCards.home + redCards.away) * 14 + cardCount * 2),
    fanHeat: clamp(40 + totalGoals * 9 + derbyBoost + elapsed / 5),
    narrativeScore: clamp(42 + totalGoals * 7 + scoreGap * 6 + derbyBoost + cardCount * 3),
    clubMomentum: clamp(44 + scoreGap * 12 + (mode === "result" ? 10 : 0) + (homeGoals !== awayGoals ? 6 : 0)),
    varImpact: clamp(22 + (redCards.home + redCards.away) * 20 + cardCount * 4 + (mode === "live" && elapsed > 70 ? 12 : 0))
  };
}

function mapFixture(fixture, mode) {
  const homeGoals = fixture.goals?.home ?? fixture.score?.fulltime?.home ?? 0;
  const awayGoals = fixture.goals?.away ?? fixture.score?.fulltime?.away ?? 0;
  const intelligenceEvents = fixture.intelligenceEvents || extractEvents(fixture);
  const venueName = fixture.fixture?.venue?.name;
  const venueCity = fixture.fixture?.venue?.city;

  return {
    id: fixture.fixture?.id,
    mode,
    competition: fixture.league?.name || "Brasileirão",
    round: fixture.league?.round,
    date: fixture.fixture?.date,
    venue: venueName,
    venueCity,
    location: [venueName, venueCity].filter(Boolean).join(" · ") || "Local a definir",
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
      winner: fixture.teams?.home?.winner,
      trend: trendFromScore(homeGoals, awayGoals, true)
    },
    away: {
      id: fixture.teams?.away?.id,
      name: fixture.teams?.away?.name,
      logo: fixture.teams?.away?.logo,
      goals: awayGoals,
      winner: fixture.teams?.away?.winner,
      trend: trendFromScore(homeGoals, awayGoals, false)
    },
    redCards: intelligenceEvents.redCards,
    goals: intelligenceEvents.goals,
    cards: intelligenceEvents.cards,
    metrics: buildMetrics({ ...fixture, intelligenceEvents }, mode)
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
  const narrativeMatch = all.reduce((top, match) => (
    !top || match.metrics.narrativeScore > top.metrics.narrativeScore ? match : top
  ), null);

  return {
    provider: process.env.APIFOOTBALL_API_KEY ? "api-football" : "demo",
    version: FOOTBALL_RADAR_VERSION,
    updatedAt: new Date().toISOString(),
    trendingNow: heatMatch ? `${heatMatch.home.name} x ${heatMatch.away.name}` : "Rodada brasileira",
    pressureRising: pressureMatch ? `${pressureMatch.home.name} sob pressão` : "Pressão de rodada",
    mostDiscussed: narrativeMatch ? `${narrativeMatch.home.name} x ${narrativeMatch.away.name}` : "Narrativas da rodada",
    indexes: {
      pressureIndex: pressureMatch?.metrics.pressureIndex || 58,
      fanHeat: heatMatch?.metrics.fanHeat || 62,
      narrativeScore: narrativeMatch?.metrics.narrativeScore || 61,
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

async function enrichFixtures(fixtures) {
  const fixtureIds = fixtures.map((item) => item.fixture?.id).filter(Boolean).slice(0, 12);
  if (!fixtureIds.length) return fixtures;

  const detailed = await apiFootballFetch("/fixtures", { ids: fixtureIds.join("-") });
  const detailsById = new Map(detailed.map((item) => [item.fixture?.id, item]));

  return fixtures.map((fixture) => {
    const detail = detailsById.get(fixture.fixture?.id);
    if (!detail) return fixture;
    return { ...fixture, events: detail.events || [], intelligenceEvents: extractEvents(detail) };
  });
}

async function fetchFromApiFootball() {
  const season = activeSeason();
  const leagueIds = brazilLeagueIds();
  const now = new Date();
  const today = new Date(isoDate(now));
  const recentStart = addDays(today, -21);
  const upcomingEnd = addDays(today, 45);

  const [liveRawAll, recentRaw, upcomingWindowRaw] = await Promise.all([
    apiFootballFetch("/fixtures", { live: "all" }).catch(() => []),
    settledFixtures(leagueIds.map((league) => apiFootballFetch("/fixtures", {
      league,
      season,
      from: isoDate(recentStart),
      to: isoDate(today),
      status: "FT-AET-PEN"
    }))),
    settledFixtures(leagueIds.map((league) => apiFootballFetch("/fixtures", {
      league,
      season,
      from: isoDate(today),
      to: isoDate(upcomingEnd)
    })))
  ]);

  const liveRaw = liveRawAll
    .filter((fixture) => isRelevantBrazilianFixture(fixture, leagueIds));

  let upcomingRaw = dedupeFixtures(upcomingWindowRaw)
    .filter((fixture) => isFutureFixture(fixture, now) && isRelevantBrazilianFixture(fixture, leagueIds))
    .sort(sortByKickoffAsc);

  if (!upcomingRaw.length) {
    const nextRaw = await settledFixtures(leagueIds.map((league) => apiFootballFetch("/fixtures", {
      league,
      season,
      next: 8
    })));
    upcomingRaw = dedupeFixtures(nextRaw)
      .filter((fixture) => isFutureFixture(fixture, now) && isRelevantBrazilianFixture(fixture, leagueIds))
      .sort(sortByKickoffAsc);
  }

  if (!upcomingRaw.length) {
    const datedUpcomingRaw = await fixturesByDates(today, 10);
    upcomingRaw = dedupeFixtures(datedUpcomingRaw)
      .filter((fixture) => isFutureFixture(fixture, now) && isRelevantBrazilianFixture(fixture, leagueIds))
      .sort(sortByKickoffAsc);
  }

  let recentWindow = dedupeFixtures(recentRaw)
    .filter((fixture) => isFinishedFixture(fixture) && isBetweenFixtureDates(fixture, recentStart, addDays(today, 1)) && isRelevantBrazilianFixture(fixture, leagueIds))
    .sort(sortByKickoffDesc);

  if (!recentWindow.length) {
    const datedRecentRaw = await fixturesByDates(addDays(today, -5), 6);
    recentWindow = dedupeFixtures(datedRecentRaw)
      .filter((fixture) => isFinishedFixture(fixture) && isBetweenFixtureDates(fixture, addDays(today, -5), addDays(today, 1)) && isRelevantBrazilianFixture(fixture, leagueIds))
      .sort(sortByKickoffDesc);
  }

  const [live, recent] = await Promise.all([
    enrichFixtures(liveRaw.slice(0, 6)),
    enrichFixtures(recentWindow.slice(0, 8))
  ]);

  const liveMatches = live.map((fixture) => mapFixture(fixture, "live"));
  const recentResults = recent.map((fixture) => mapFixture(fixture, "result"));
  const upcomingFixtures = upcomingRaw.slice(0, 8).map((fixture) => mapFixture(fixture, "upcoming"));

  return {
    summary: {
      ...summarize(liveMatches, recentResults, upcomingFixtures),
      season,
      leagueIds,
      dateWindow: {
        recentFrom: isoDate(recentStart),
        upcomingTo: isoDate(upcomingEnd)
      },
      queryMode: {
        primary: "league-window",
        fallback: "date-window-brazil-filter",
        cacheTtlMs: CACHE_TTL_MS
      }
    },
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

function demoFixture({ id, mode, home, away, homeGoals = 0, awayGoals = 0, elapsed, status, dateOffset = 0, competition = "Brasileirão Série A", redCards = { home: 0, away: 0 } }) {
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
    goals: { home: homeGoals, away: awayGoals },
    intelligenceEvents: {
      goals: homeGoals + awayGoals ? [{ minute: elapsed || 45, team: homeGoals >= awayGoals ? home.name : away.name, player: "Atacante em destaque", detail: "Gol" }] : [],
      cards: redCards.home + redCards.away ? [{ minute: elapsed || 72, team: redCards.home ? home.name : away.name, player: "Defensor", detail: "Red Card" }] : [],
      redCards
    }
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
    demoFixture({ id: 9002, mode: "live", home: corinthians, away: saoPaulo, homeGoals: 0, awayGoals: 1, elapsed: 54, status: "2H", redCards: { home: 1, away: 0 } })
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
