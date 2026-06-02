import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/futetrends-logo.svg";
import styles from "./Layout.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand}>
          <img src={logo} alt="FuteTrends" />
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/">Mercados</NavLink>
          <NavLink to="/ranking">Ranking</NavLink>
          <NavLink to="/rules">Regras</NavLink>
          {user && <NavLink to="/dashboard">Painel</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className={styles.actions}>
          {user ? (
            <>
              <NavLink to="/profile" className={styles.user}>{user.name}</NavLink>
              <button onClick={() => { logout(); navigate("/"); }}>Sair</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Entrar</NavLink>
              <NavLink to="/signup" className={styles.cta}>Criar conta</NavLink>
            </>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <img src={logo} alt="FuteTrends" />
        <NavLink to="/about">Sobre</NavLink>
        <NavLink to="/privacy">Privacidade</NavLink>
        <NavLink to="/terms">Termos</NavLink>
      </footer>
    </div>
  );
}
