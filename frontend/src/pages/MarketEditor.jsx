import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, errorMessage } from "../api/client.js";
import MarketForm from "../components/MarketForm.jsx";

export default function MarketEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [market, setMarket] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) api.get(`/api/predictions/${id}`).then(({ data }) => setMarket(data.prediction)).catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function save(payload) {
    setSaving(true);
    setError("");
    try {
      if (id) await api.put(`/api/predictions/${id}`, payload);
      else await api.post("/api/predictions", payload);
      navigate("/admin");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (id && !market && !error) return <div className="page"><div className="notice">Carregando mercado...</div></div>;
  return <div className="page"><h1>{id ? "Editar mercado" : "Criar mercado"}</h1>{error && <div className="error">{error}</div>}<MarketForm initial={market} onSubmit={save} saving={saving} /></div>;
}
