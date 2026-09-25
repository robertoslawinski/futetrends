export function formatPoints(points) {
  return `${new Intl.NumberFormat("pt-BR").format(Number(points) || 0)} pts`;
}

export function getRankingView(ranking = [], user = null) {
  const userId = user?._id || user?.id;
  const currentUser = userId
    ? ranking.find((entry) => String(entry.id) === String(userId)) || null
    : null;

  return {
    hasRanking: ranking.length > 0,
    leaders: ranking.slice(0, 3),
    currentUser,
    isCurrentUserTopThree: Boolean(currentUser && currentUser.rank <= 3),
  };
}

export function getRankingSignals(entry = {}) {
  const signals = [];

  if (Number.isFinite(entry.streak) && entry.streak > 1) {
    signals.push({ type: "streak", value: `${entry.streak} acertos seguidos` });
  }

  if (Number.isFinite(entry.rankChange) && entry.rankChange !== 0) {
    signals.push({
      type: entry.rankChange > 0 ? "up" : "down",
      value: `${Math.abs(entry.rankChange)} ${Math.abs(entry.rankChange) === 1 ? "posição" : "posições"}`,
    });
  }

  return signals;
}
