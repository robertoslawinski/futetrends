import { useEffect, useState } from "react";
import { api, errorMessage } from "../api/client.js";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/api/ranking").then(({ data }) => setRanking(data.ranking)).catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <div className="page">
      <h1>Ranking</h1>
      {error && <div className="error">{error}</div>}
      <div className="table">
        {ranking.length ? ranking.map((user) => (
          <div className="row" key={user.id}>
            <strong>#{user.rank} {user.name}</strong>
            <span>{user.points} pts</span>
            <span>{user.accuracy}% aproveitamento</span>
          </div>
        )) : <div className="notice">O ranking atualiza quando os mercados são resolvidos.</div>}
      </div>
    </div>
  );
}
