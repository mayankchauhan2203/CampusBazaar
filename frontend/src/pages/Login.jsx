import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Shield, ArrowRight, Lock, Users, CheckCircle, AlertTriangle } from "lucide-react";

function Login() {
  const { loginWithIITD, currentUser } = useAuth();
  const location = useLocation();

  // If already logged in, redirect to intended page
  if (currentUser) {
    const from = location.state?.from?.pathname || "/marketplace";
    return <Navigate to={from} replace />;
  }

  function handleLogin() {
    // Save the intended destination so callback can redirect correctly
    const from = location.state?.from?.pathname;
    if (from) sessionStorage.setItem("oauth_redirect_after", from);
    loginWithIITD();
  }

  return (
    <div className="login-page">
      <div
        className="login-card"
        style={{
          maxWidth: "460px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* ── Header band ──────────────────────────────────────────────── */}
        <div
          style={{
            background: "var(--accent-gradient)",
            padding: "2rem 2rem 2.5rem",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <ShoppingBag size={36} color="white" />
          </div>
          <h1
            style={{
              color: "#fff",
              margin: "0 0 0.25rem",
              fontSize: "1.6rem",
              fontWeight: 700,
            }}
          >
            PeerMart
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", margin: 0, fontSize: "0.9rem" }}>
            IIT Delhi's student marketplace
          </p>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div style={{ padding: "2rem" }}>
          {/* Security notice */}
          <div className="login-alert" style={{ marginBottom: "1.75rem" }}>
            <Shield size={16} className="alert-icon" style={{ flexShrink: 0 }} />
            <div className="alert-text">
              <p style={{ margin: 0, fontSize: "0.825rem", lineHeight: 1.5 }}>
                Exclusive to <code>@iitd.ac.in</code> accounts. Sign in with
                your official IITD Single Sign-On credentials.
              </p>
            </div>
          </div>

          {/* Network Warning notice */}
          <div style={{
            marginBottom: "1.75rem",
            background: "rgba(220, 38, 38, 0.05)",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            color: "#dc2626",
            borderRadius: "10px",
            padding: "12px 14px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start"
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} color="#dc2626" />
            <div className="alert-text">
              <p style={{ margin: 0, fontSize: "0.825rem", lineHeight: 1.5 }}>
                <strong>Network Issue:</strong> The login portal is currently facing issues on IITD Wi-Fi. Please use an <strong>alternate network</strong> (like mobile data) for a smooth login experience.
              </p>
            </div>
          </div>

          {/* IITD Login button */}
          <button
            id="iitd-login-btn"
            className="login-btn"
            onClick={handleLogin}
            style={{
              background: "var(--accent-gradient)",
              color: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              padding: "0.875rem 1.5rem",
              borderRadius: "12px",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 4px 20px rgba(255,140,66,0.3)",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,140,66,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,140,66,0.3)";
            }}
          >
            <Lock size={18} />
            Login with IITD Credentials
            <ArrowRight size={18} style={{ marginLeft: "auto" }} />
          </button>

          {/* Footer hint */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              marginTop: "1.25rem",
              marginBottom: 0,
              lineHeight: 1.5,
            }}
          >
            You'll be redirected to the IITD portal to verify your identity.
            <br />
            No password is stored by PeerMart.
          </p>
        </div>

        {/* ── Footer band ──────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "0.875rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "var(--bg-secondary)",
          }}
        >
          <Users size={13} color="var(--text-muted)" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Open only to IIT Delhi students &amp; faculty
          </span>
        </div>
      </div>

      {/* Background blobs */}
      <div
        className="hero-bg"
        style={{ pointerEvents: "none", position: "fixed", zIndex: -1 }}
      >
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </div>
    </div>
  );
}

export default Login;
