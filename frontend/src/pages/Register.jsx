import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            create account
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            join to save and manage bookmarks
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField
            label="username"
            type="text"
            value={form.username}
            onChange={(v) => setForm((f) => ({ ...f, username: v }))}
            placeholder="yourname"
          />
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
            placeholder="min 6 characters"
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
            {loading ? "creating account..." : "create account →"}
          </button>
        </form>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 20, textAlign: "center" }}>
          have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>sign in</Link>
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
