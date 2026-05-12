import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return <AuthForm title="Entrar" form={form} setForm={setForm} submit={submit} error={error} button="Entrar no painel" footer={<Link to="/signup">Criar uma conta</Link>} />;
}

function AuthForm({ title, form, setForm, submit, error, button, footer, signup }) {
  return (
    <div className="page narrow">
      <form className="authPanel" onSubmit={submit}>
        <h1>{title}</h1>
        {signup && <label>Nome<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>}
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>Senha<input type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
        {error && <div className="error">{error}</div>}
        <button className="primary">{button}</button>
        {footer}
      </form>
    </div>
  );
}

export { AuthForm };
