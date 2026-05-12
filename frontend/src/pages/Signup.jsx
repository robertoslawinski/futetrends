import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthForm } from "./Login.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return <AuthForm signup title="Criar conta" form={form} setForm={setForm} submit={submit} error={error} button="Entrar no FuteTrends" footer={<Link to="/login">Já tenho conta</Link>} />;
}
