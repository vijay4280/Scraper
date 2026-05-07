import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  nav: {
    borderBottom: "1px solid var(--border)",
    background: "var(--bg)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 24px",
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "var(--font-mono)",
    fontWeight: 600,
    fontSize: 15,
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoAccent: {
    color: "var(--accent)",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
};

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        padding: "5px 12px",
        borderRadius: "var(--radius)",
        color: active ? "var(--accent)" : "var(--text-muted)",
        background: active ? "var(--accent-glow)" : "transparent",
        border: active ? "1px solid rgba(255,102,0,0.2)" : "1px solid transparent",
        transition: "var(--transition)",
        letterSpacing: "0.03em",
      }}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoAccent}>▲</span> HN<span style={{ color: "var(--text-muted)" }}>/feed</span>
        </Link>
        <div style={styles.links}>
          <NavLink to="/" active={location.pathname === "/"}>stories</NavLink>
          {isAuthenticated && (
            <NavLink to="/bookmarks" active={location.pathname === "/bookmarks"}>bookmarks</NavLink>
          )}
          {isAuthenticated ? (
            <>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", padding: "0 8px" }}>
                {user.username}
              </span>
              <button
                onClick={logout}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "5px 12px",
                  borderRadius: "var(--radius)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" active={location.pathname === "/login"}>login</NavLink>
              <NavLink to="/register" active={location.pathname === "/register"}>register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
