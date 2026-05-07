import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "calc(100vh - 52px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="page-enter"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "36px 32px",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            sign in
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            access your bookmarks and more
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField
            label="email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            placeholder="you@example.com"
          />
          <FormField
            label="password"
            type="password"
            value={form.password}
            onChange={(v) => setForm((f) => ({ ...f, password: v }))}
            placeholder="••••••••"
          />

          {error && (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--red)" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: "10px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--accent)",
              background: loading ? "transparent" : "var(--accent)",
              color: loading ? "var(--accent)" : "#000",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all var(--transition)",
            }}
          >
            {loading ? "signing in..." : "sign in →"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 20, textAlign: "center" }}>
          no account?{" "}
          <Link to="/register" style={{ color: "var(--accent)" }}>register</Link>
        </p>
      </div>
    </main>
  );
}

function FormField({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-muted)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        style={{
          padding: "9px 12px",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          background: "var(--bg-3)",
          color: "var(--text)",
          fontSize: 14,
          transition: "border-color var(--transition)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--border-hover)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}
