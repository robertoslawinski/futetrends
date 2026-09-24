import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/futetrends-brand.png";
import styles from "./Layout.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => setMenuOpen(false), [location]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand} aria-label="FuteTrends - início">
          <img src={logo} alt="FuteTrends" />
        </NavLink>

        <button type="button" className={styles.menuToggle} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        <nav id="primary-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Navegação principal">
          <NavLink to="/palpites" onClick={() => setMenuOpen(false)}>Palpites</NavLink>
          <NavLink to="/ranking">Ranking</NavLink>
          <a href="/#how-it-works" onClick={() => setMenuOpen(false)}>Como funciona</a>
          {user && <NavLink to="/dashboard">Painel</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          <div className={styles.mobileActions}>
            {user ? (
              <><NavLink to="/profile">Meu perfil</NavLink><button type="button" onClick={handleLogout}>Sair</button></>
            ) : (
              <><NavLink to="/login">Entrar</NavLink><NavLink to="/signup" className={styles.cta}>Criar conta grátis</NavLink></>
            )}
          </div>
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
              <NavLink to="/signup" className={styles.cta}>Criar conta grátis</NavLink>
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
            <p>Dê seus palpites, ganhe pontos e prove que entende de futebol brasileiro.</p>
          </div>
          <div>
            <strong>Produto</strong>
            <NavLink to="/palpites">Palpites</NavLink>
            <NavLink to="/ranking">Ranking</NavLink>
            <a href="/#how-it-works">Como funciona</a>
          </div>
          <div>
            <strong>FuteTrends</strong>
            <NavLink to="/ranking">Comunidade</NavLink>
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
          <span>Palpites, pontos e ranking.</span>
        </div>
      </footer>
    </div>
  );
}
