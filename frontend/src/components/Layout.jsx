import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/futetrends-logo.svg";
import styles from "./Layout.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand} aria-label="FuteTrends - início">
          <img src={logo} alt="FuteTrends" />
        </NavLink>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="/#markets">Mercados</a>
          <NavLink to="/ranking">Ranking</NavLink>
          <a href="/#how-it-works">Como funciona</a>
          <a href="/#community">Comunidade</a>
          <NavLink to="/about">Sobre</NavLink>
          {user && <NavLink to="/dashboard">Painel</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <NavLink to="/profile" className={styles.profileLink}>{user.name}</NavLink>
              <button type="button" onClick={handleLogout}>Sair</button>
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
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <img src={logo} alt="FuteTrends" />
            <p>Previsões coletivas para descobrir quem realmente entende o futebol brasileiro.</p>
          </div>
          <div>
            <strong>Produto</strong>
            <a href="/#markets">Mercados</a>
            <NavLink to="/ranking">Ranking</NavLink>
            <a href="/#how-it-works">Como funciona</a>
          </div>
          <div>
            <strong>FuteTrends</strong>
            <a href="/#community">Comunidade</a>
            <NavLink to="/rules">Regras</NavLink>
            <NavLink to="/about">Sobre</NavLink>
          </div>
          <div>
            <strong>Legal</strong>
            <NavLink to="/privacy">Privacidade</NavLink>
            <NavLink to="/terms">Termos</NavLink>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 FuteTrends</span>
          <span>Gratuito. Sem apostas. Sem dinheiro envolvido.</span>
        </div>
      </footer>
    </div>
  );
}
