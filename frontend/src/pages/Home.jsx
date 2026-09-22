import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Trophy, TrendingUp } from "lucide-react";
import { api, errorMessage } from "../api/client.js";
import MarketCard from "../components/MarketCard.jsx";

const currentCategories = new Set(["Brasileirão 2026", "Libertadores 2026"]);

const steps = [
  { icon: MessageCircle, title: "Dê seu palpite", text: "Responda às perguntas antes do prazo." },
  { icon: Trophy, title: "Acerte e ganhe pontos", text: "Quando o resultado for confirmado, você pontua." },
  { icon: TrendingUp, title: "Suba no ranking", text: "Compare seu desempenho com outros torcedores." }
];

function deadlineLabel(deadline) {
  return new Date(deadline).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="homeSection">
      <div className="sectionIntro">
        <div>
          <span className="sectionKicker">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}

function FeaturedPalpite({ market }) {
  if (!market) return <div className="empty">O próximo palpite em destaque aparece em breve.</div>;

  const yesPercent = market.voteBreakdown?.yesPercent || 0;
  const noPercent = market.voteBreakdown?.noPercent || 0;

  return (
    <article className="featuredMarket">
      <div className="featuredMain">
        <div className="featuredTopline">
          <span>{market.category}</span>
          <em>Aberto</em>
        </div>
        <Link to={`/markets/${market._id}`} className="featuredTitle"><h3>{market.title}</h3></Link>
        <div className="featuredMeta">
          <span>Encerra {deadlineLabel(market.deadline)}</span>
          <span>{market.totalVotes || 0} {market.totalVotes === 1 ? "palpite" : "palpites"}</span>
          <span>{market.pointsValue} pontos por acerto</span>
        </div>
      </div>
      <div className="featuredForecast">
        <span>O que a torcida acha</span>
        <div className="featuredPercents">
          <strong>SIM <b>{yesPercent}%</b></strong>
          <strong>NÃO <b>{noPercent}%</b></strong>
        </div>
        <div className="featuredBar" aria-hidden="true">
          <i style={{ width: `${yesPercent}%` }} />
          <b style={{ width: `${noPercent}%` }} />
        </div>
        <div className="featuredActions">
          <Link to={`/markets/${market._id}`} state={{ choice: "yes" }} className="featuredYes">Meu palpite: SIM</Link>
          <Link to={`/markets/${market._id}`} state={{ choice: "no" }} className="featuredNo">Meu palpite: NÃO</Link>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [markets, setMarkets] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/predictions")
      .then(({ data }) => setMarkets(data.predictions.filter((market) => currentCategories.has(market.category))))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
    api.get("/api/ranking")
      .then(({ data }) => setRanking(data.ranking || []))
      .catch(() => setRanking([]));
  }, []);

  const openMarkets = useMemo(() => markets.filter((market) => market.status === "open"), [markets]);
  const featuredMarket = useMemo(
    () => [...openMarkets].sort((a, b) => ((b.totalVotes || 0) + b.pointsValue) - ((a.totalVotes || 0) + a.pointsValue))[0],
    [openMarkets]
  );
  const visibleMarkets = useMemo(() => {
    const candidates = openMarkets.filter((market) => market._id !== featuredMarket?._id);
    const firstBrasileirao = candidates.find((market) => market.category === "Brasileirão 2026");
    const firstLibertadores = candidates.find((market) => market.category === "Libertadores 2026");
    return [firstBrasileirao, firstLibertadores, ...candidates]
      .filter((market, index, list) => market && list.findIndex((item) => item?._id === market._id) === index)
      .slice(0, 3);
  }, [openMarkets, featuredMarket]);

  return (
    <div className="saasHome">
      <section className="saasHero">
        <div className="heroCopy">
          <span className="heroEyebrow">Brasileirão 2026 · Libertadores 2026</span>
          <h1>Fute<strong>Trends</strong></h1>
          <p className="heroChallenge">Você entende de futebol? <strong>Prove.</strong></p>
          <p className="heroDescription">Dê seus palpites, ganhe pontos e suba no ranking.</p>
          <div className="heroActions">
            <a href="#palpites" className="primaryLink">Começar a palpitar</a>
            <a href="#how-it-works" className="secondaryLink">Veja como funciona</a>
          </div>
          <div className="heroTrust">
            <span><i /> Grátis para jogar</span>
            <span>Sem apostas. Sem dinheiro.</span>
          </div>
        </div>
      </section>

      <div className="homeContent">
      {error && <div className="error">{error}</div>}

      <Section id="how-it-works" eyebrow="Como funciona" title="Palpite. Pontue. Suba no ranking.">
        <div className="stepsGrid">
          {steps.map(({ icon: Icon, title, text }) => (
            <article className="stepCard" key={title}>
              <span><Icon size={21} strokeWidth={2.2} aria-hidden="true" /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
        <p className="gamePromise">Sem apostas. Sem dinheiro. Só futebol.</p>
      </Section>

      <Section eyebrow="Palpite em destaque" title="Uma pergunta. Duas escolhas." description="Escolha SIM ou NÃO e veja o que outros torcedores estão pensando.">
        {loading ? <div className="empty">Carregando palpite...</div> : <FeaturedPalpite market={featuredMarket} />}
      </Section>

      <Section id="palpites" eyebrow="Palpites abertos" title="Mostre o que você sabe sobre futebol brasileiro.">
        {loading ? (
          <div className="empty">Carregando palpites...</div>
        ) : visibleMarkets.length ? (
          <div className="marketGrid">
            {visibleMarkets.map((market) => <MarketCard market={market} key={market._id} />)}
          </div>
        ) : (
          <div className="empty">Novos palpites do Brasileirão e da Libertadores chegam em breve.</div>
        )}
        <Link to="/palpites" className="showMore">Ver todos os palpites</Link>
      </Section>

      <Section id="ranking" eyebrow="Ranking FuteTrends" title="Quem entende mais de futebol?">
        {ranking.length ? (
          <div className="rankingRows homeRanking">
            {ranking.slice(0, 3).map((entry) => (
              <div className="rankingRow" key={entry.id}>
                <span className="rankPosition">{entry.rank}º</span>
                <span className="rankAvatar">{entry.name.slice(0, 1).toUpperCase()}</span>
                <strong>{entry.name}</strong>
                <b>{entry.points} pts</b>
              </div>
            ))}
          </div>
        ) : (
          <p className="rankingInvite">O ranking está começando. Faça seus palpites e seja um dos primeiros a chegar ao topo.</p>
        )}
        <Link to="/ranking" className="textLink rankingLink">Ver ranking completo</Link>
      </Section>

      <Section id="community" eyebrow="Comunidade" title="Acerte mais. Suba no ranking." description="Compare seus palpites com a torcida e acompanhe as perguntas da rodada.">
        <div className="communityHighlights">
          {openMarkets.slice(0, 3).map((market) => (
            <Link to={`/markets/${market._id}`} key={market._id}>
              <span>{market.category}</span>
              <strong>{market.title}</strong>
              <small>{market.totalVotes || 0} {market.totalVotes === 1 ? "palpite" : "palpites"}</small>
            </Link>
          ))}
        </div>
      </Section>

      </div>
      <section className="homeFinalCta">
        <div>
          <span>FuteTrends</span>
          <h2>Pronto para provar que entende de futebol?</h2>
          <p>Comece grátis. Leva menos de 1 minuto.</p>
        </div>
        <div className="finalCtaActions">
          <Link to="/signup" className="primaryLink">Criar conta grátis</Link>
          <small>Sem apostas. Sem dinheiro. Só diversão.</small>
        </div>
      </section>
    </div>
  );
}
