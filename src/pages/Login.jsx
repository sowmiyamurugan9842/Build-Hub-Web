import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categories, engineerSpecialties, getDefaultSupplierForCategory } from "../data/fakeData";

/* ── Shared hero with feature highlights ── */
function LoginHero() {
  return (
    <div className="login-hero">
      <div className="login-logo">🏗️</div>
      <h1>BuildHub</h1>
      <p>Tamil Nadu's centralized construction marketplace — connecting suppliers, contractors and engineers in one place.</p>

      <div className="login-pitch">
        <div className="login-pitch-row">
          <div className="login-pitch-icon">🏪</div>
          <div>
            <strong>14 verified shops</strong> across Chennai &amp; Coimbatore — aggregates to electricals, all in one app
          </div>
        </div>
        <div className="login-pitch-row">
          <div className="login-pitch-icon">⚡</div>
          <div>
            <strong>Live stock visibility</strong> — supplier updates flow to engineer's view in real-time
          </div>
        </div>
        <div className="login-pitch-row">
          <div className="login-pitch-icon">📐</div>
          <div>
            <strong>Site-wise costing</strong> — track every load tagged to a project, with phase-by-phase budgets
          </div>
        </div>
      </div>

      <div className="login-stats">
        <div className="login-stat">
          <div className="login-stat-num">9</div>
          <div className="login-stat-lbl">categories</div>
        </div>
        <div className="login-stat">
          <div className="login-stat-num">79+</div>
          <div className="login-stat-lbl">products</div>
        </div>
        <div className="login-stat">
          <div className="login-stat-num">7</div>
          <div className="login-stat-lbl">specialties</div>
        </div>
      </div>

      <div className="login-quote">
        <span className="login-quote-mark">"</span>
        <div>
          Replaced our paper ledger and 6 WhatsApp groups with one app. Stock and invoices stay in sync now.
          <div style={{ marginTop: 6, opacity: 0.7, fontSize: 11 }}>— Murugan, Sri Murugan Aggregates · Vandalur</div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState("role");        // role | specialty | phone | otp
  const [role, setRole] = useState(null);          // "supplier" | "engineer"
  const [specialty, setSpecialty] = useState(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  function chooseRole(r) {
    setRole(r);
    setStep("specialty");
  }

  function chooseSpecialty(s) {
    setSpecialty(s);
    setStep("phone");
  }

  function handleSendOtp(e) {
    e.preventDefault();
    if (phone.length === 10) setStep("otp");
  }

  function handleOtpChange(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) otpRefs[i + 1].current?.focus();
  }

  function handleOtpKey(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  }

  function handleVerify(e) {
    e.preventDefault();
    if (role === "supplier") {
      const supplierId = getDefaultSupplierForCategory(specialty);
      window.localStorage.setItem("currentSupplierId", supplierId);
      window.localStorage.setItem("currentSupplierCategory", specialty || "");
    } else {
      window.localStorage.setItem("currentEngineerSpecialty", specialty || "");
    }
    navigate(role === "engineer" ? "/engineer/home" : "/dashboard");
  }

  /* ── Role selector ── */
  if (step === "role") {
    return (
      <div className="login-page">
        <LoginHero />
        <div className="login-card">
          <div className="login-card-inner">
            <h2 style={{ marginBottom: 6 }}>Choose your role</h2>
            <p style={{ marginBottom: 22 }}>How will you use BuildHub?</p>

            <button
              onClick={() => chooseRole("engineer")}
              style={{
                width: "100%", textAlign: "left",
                background: "linear-gradient(135deg,#eef2ff,#fff)",
                border: "2px solid #c7d2fe", borderRadius: 14,
                padding: "18px 18px",
                marginBottom: 12, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all .2s cubic-bezier(.16,1,.3,1)",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(99,102,241,0.18)"; e.currentTarget.style.borderColor = "#6366f1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: "white",
                boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              }}>
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22h20" /><path d="M5 22V8l7-5 7 5v14" /><path d="M9 22v-6h6v6" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>I'm a Buyer / Engineer</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>Civil, Site, Electrical, MEP — find any construction shop, order materials, track costs</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4,
                background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#78350f",
                letterSpacing: "0.05em",
              }}>NEW</span>
            </button>

            <button
              onClick={() => chooseRole("supplier")}
              style={{
                width: "100%", textAlign: "left",
                background: "white",
                border: "2px solid #e2e8f0", borderRadius: 14,
                padding: "18px 18px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 14,
                transition: "all .2s cubic-bezier(.16,1,.3,1)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#94a3b8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: "linear-gradient(135deg,#f59e0b,#ea580c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: "white",
                boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
              }}>
                <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>I'm a Supplier / Shop</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>Aggregates, hardware, electricals, plumbing — manage orders, stock, invoices</div>
              </div>
            </button>

            <p className="hint" style={{ marginTop: 18, textAlign: "center" }}>
              Demo mode — both roles use sample data
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Specialty / Category step ── */
  if (step === "specialty") {
    const isEngineer = role === "engineer";
    const options = isEngineer ? engineerSpecialties : categories;

    return (
      <div className="login-page">
        <LoginHero />
        <div className="login-card">
          <div className="login-card-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 5,
                background: isEngineer ? "#eef2ff" : "#fff7ed",
                color: isEngineer ? "#4f46e5" : "#ea580c",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                Step 2 of 3 · {isEngineer ? "Buyer" : "Supplier"}
              </span>
            </div>
            <h2 style={{ marginBottom: 6 }}>
              {isEngineer ? "What's your specialty?" : "What category is your shop?"}
            </h2>
            <p style={{ marginBottom: 22 }}>
              {isEngineer
                ? "We'll prioritize suppliers most relevant to your work."
                : "Choose what your shop primarily sells. You can list more later."}
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10,
            }}>
              {options.map((o) => {
                const color = isEngineer ? "#6366f1" : (o.color || "#6366f1");
                const bg = isEngineer ? "#eef2ff" : (o.bg || "#eef2ff");
                const border = isEngineer ? "#c7d2fe" : (o.border || "#c7d2fe");
                return (
                  <button
                    key={o.id}
                    onClick={() => chooseSpecialty(o.id)}
                    style={{
                      padding: "16px 14px", borderRadius: 14,
                      background: bg, border: `1.5px solid ${border}`,
                      cursor: "pointer", textAlign: "left",
                      transition: "all .2s cubic-bezier(.16,1,.3,1)",
                      position: "relative", overflow: "hidden",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 22px ${color}33`; e.currentTarget.style.borderColor = color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = border; }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, marginBottom: 10,
                      boxShadow: `0 2px 6px ${color}22`,
                    }}>{o.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 3 }}>{o.name}</div>
                    {!isEngineer && o.desc && (
                      <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.35 }}>{o.desc}</div>
                    )}
                    {isEngineer && o.relevant && (
                      <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.35 }}>
                        {o.relevant.length} relevant categories
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              style={{ background: "none", border: "none", color: "#6366f1", fontSize: 13, cursor: "pointer", display: "block", margin: "20px auto 0", fontWeight: 700 }}
              onClick={() => setStep("role")}
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Phone / OTP ── */
  const accent = role === "engineer"
    ? { primary: "#6366f1", bg: "#eef2ff", label: "Buyer" }
    : { primary: "#f59e0b", bg: "#fff7ed", label: "Supplier" };
  const specialtyMeta = role === "engineer"
    ? engineerSpecialties.find((s) => s.id === specialty)
    : categories.find((c) => c.id === specialty);

  return (
    <div className="login-page">
      <LoginHero />
      <div className="login-card">
        <div className="login-card-inner" style={{ maxWidth: 460 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{
              display: "inline-block", fontSize: 10, fontWeight: 800,
              padding: "3px 9px", borderRadius: 5,
              background: accent.bg, color: accent.primary,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {accent.label}
            </span>
            {specialtyMeta && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontWeight: 700,
                padding: "3px 9px", borderRadius: 5,
                background: "#f1f5f9", color: "#475569",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                <span>{specialtyMeta.icon}</span>{specialtyMeta.name}
              </span>
            )}
            <span style={{
              fontSize: 10, fontWeight: 700,
              padding: "3px 9px", borderRadius: 5,
              background: "#f1f5f9", color: "#94a3b8",
              letterSpacing: "0.04em", textTransform: "uppercase",
              marginLeft: "auto",
            }}>
              Step 3 of 3
            </span>
          </div>

          {step === "phone" ? (
            <>
              <h2>Welcome back</h2>
              <p>Enter your mobile number to continue</p>
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="form-control"
                      style={{ width: 56, textAlign: "center", flexShrink: 0 }}
                      value="+91"
                      readOnly
                    />
                    <input
                      className="form-control"
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      autoFocus
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={phone.length !== 10}>
                  Send OTP
                </button>
              </form>
              <p className="hint" style={{ marginTop: 16 }}>
                Demo: enter any 10-digit number
              </p>
              <button
                style={{ background: "none", border: "none", color: accent.primary, fontSize: 13, cursor: "pointer", display: "block", margin: "12px auto 0", fontWeight: 600 }}
                onClick={() => setStep("specialty")}
              >
                ← Change {role === "engineer" ? "specialty" : "category"}
              </button>
            </>
          ) : (
            <>
              <h2>Verify OTP</h2>
              <p>Enter the 4-digit code sent to +91 {phone}</p>
              <form onSubmit={handleVerify}>
                <div className="otp-inputs">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      className="otp-input"
                      type="tel"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKey(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <button type="submit" className="btn btn-primary">
                  Verify &amp; Login
                </button>
              </form>
              <p className="hint" style={{ marginTop: 16 }}>
                Demo: enter any 4 digits
              </p>
              <button
                style={{ background: "none", border: "none", color: accent.primary, fontSize: 13, cursor: "pointer", display: "block", margin: "12px auto 0", fontWeight: 600 }}
                onClick={() => setStep("phone")}
              >
                ← Change number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
