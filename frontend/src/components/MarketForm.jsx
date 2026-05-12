import { useEffect, useState } from "react";
import styles from "./MarketForm.module.css";

const blank = {
  title: "",
  description: "",
  category: "Brasileirão",
  deadline: "",
  status: "open",
  result: "",
  resolutionSource: "",
  resolutionCriteria: "",
  pointsValue: 100
};

export default function MarketForm({ initial, onSubmit, saving }) {
  const [form, setForm] = useState(blank);
  useEffect(() => {
    if (initial) {
      setForm({
        ...blank,
        ...initial,
        deadline: initial.deadline ? new Date(initial.deadline).toISOString().slice(0, 16) : "",
        result: initial.result || ""
      });
    }
  }, [initial]);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({ ...form, pointsValue: Number(form.pointsValue), result: form.result || null });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>Título<input name="title" value={form.title} onChange={update} required minLength="8" /></label>
      <label>Descrição<textarea name="description" value={form.description} onChange={update} required minLength="20" rows="4" /></label>
      <div className={styles.grid}>
        <label>Categoria<input name="category" value={form.category} onChange={update} required /></label>
        <label>Fechamento<input type="datetime-local" name="deadline" value={form.deadline} onChange={update} required /></label>
        <label>Pontos<input type="number" name="pointsValue" value={form.pointsValue} onChange={update} min="1" max="1000" required /></label>
        <label>Status<select name="status" value={form.status} onChange={update}><option value="open">Aberto</option><option value="closed">Fechado</option></select></label>
      </div>
      <label>Fonte de resolução<input name="resolutionSource" value={form.resolutionSource} onChange={update} required /></label>
      <label>Critério de resolução<textarea name="resolutionCriteria" value={form.resolutionCriteria} onChange={update} required minLength="20" rows="4" /></label>
      <button className="primary" disabled={saving}>{saving ? "Salvando..." : "Salvar mercado"}</button>
    </form>
  );
}
