import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page narrow">
      <div className="panel">
        <h1>404</h1>
        <p>Esse sinal saiu do radar.</p>
        <Link className="primaryLink" to="/">Voltar aos mercados</Link>
      </div>
    </div>
  );
}
