import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { errorMessage } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthForm } from "./Login.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo?.startsWith("/markets/") ? location.state.returnTo : "/dashboard";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      await signup(form);
      navigate(returnTo, { replace: true, state: { choice: location.state?.choice } });
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return <AuthForm signup title="Criar conta" form={form} setForm={setForm} submit={submit} error={error} button="Criar conta" footer={<Link to="/login" state={location.state}>Já tenho conta</Link>} />;
}
