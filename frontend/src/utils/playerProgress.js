const isResolvedVote = (item) => item?.isCorrect === true || item?.isCorrect === false;

export function getPlayerProgress(history = [], ranking = [], user = null) {
  const validHistory = Array.isArray(history)
    ? history.filter((item) => item?.prediction)
    : [];
  const pendingVotes = validHistory.filter((item) => !isResolvedVote(item));
  const resolvedVotes = validHistory.filter(isResolvedVote);
  const correctTotal = resolvedVotes.filter((item) => item.isCorrect).length;
  const incorrectTotal = resolvedVotes.length - correctTotal;
  const userId = user?._id || user?.id;
  const currentRank = userId && Array.isArray(ranking)
    ? ranking.find((entry) => String(entry.id) === String(userId)) || null
    : null;

  return {
    totalVotes: validHistory.length,
    resolvedTotal: resolvedVotes.length,
    pendingTotal: pendingVotes.length,
    correctTotal,
    incorrectTotal,
    accuracy: resolvedVotes.length
      ? Math.round((correctTotal / resolvedVotes.length) * 100)
      : null,
    currentRank,
    isTopThree: Boolean(currentRank && currentRank.rank <= 3),
    pending: pendingVotes.slice(0, 4),
    results: resolvedVotes.slice(0, 4)
  };
}
