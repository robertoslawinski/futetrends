export function getVoteViewState(market = {}) {
  const hasUserVote = market.userVote === "yes" || market.userVote === "no";
  const isOpen = market.status === "open";
  const totalVotes = Number(market.totalVotes) || 0;

  return {
    hasUserVote,
    isOpen,
    canVote: isOpen && !hasUserVote,
    showCommunity: hasUserVote,
    showVoteCount: hasUserVote && totalVotes >= 10,
  };
}
