import { useState } from "react";
import Layout from "../components/Layout";
import { getCurrentSupplierId, getEngineerProject, currentEngineer } from "../data/fakeData";
import { useOrders } from "../store/OrdersContext";

function fmtINR(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function fmtDate(d) {
  const date = new Date(d);
  const today = new Date();
  const diff = Math.floor((today - date) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const STATUS_CFG = {
  pending:      { bg: "#eff6ff", color: "#2563eb", border: "#93c5fd", label: "Pending",     dot: "#2563eb", icon: "🕐" },
  "in-transit": { bg: "#fff7ed", color: "#c2410c", border: "#fdba74", label: "In Transit",  dot: "#ea580c", icon: "🚚" },
  delivered:    { bg: "#f0fdf4", color: "#15803d", border: "#86efac", label: "Delivered",   dot: "#059669", icon: "✓" },
  rejected:     { bg: "#fef2f2", color: "#dc2626", border: "#fca5a5", label: "Rejected",    dot: "#dc2626", icon: "✕" },
};

const TABS = [
  { key: "all",        label: "All" },
  { key: "pending",    label: "Pending",    urgent: true },
  { key: "in-transit", label: "In Transit" },
  { key: "delivered",  label: "Delivered" },
  { key: "rejected",   label: "Rejected" },
];

export default function IncomingOrders() {
  const MY_ID = getCurrentSupplierId();
  const { getOrdersForSupplier, acceptOrder, rejectOrder, markDelivered } = useOrders();
  const allOrders = getOrdersForSupplier(MY_ID);

  const [activeTab, setActiveTab] = useState("all");
  const [expandRejectId, setExpandRejectId] = useState(null);
  const [rejectReasons, setRejectReasons] = useState({});
  const [deliverConfirmId, setDeliverConfirmId] = useState(null);
  const [toast, setToast] = useState("");

  const displayed = activeTab === "all" ? allOrders : allOrders.filter((o) => o.status === activeTab);
  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? allOrders.length : allOrders.filter((o) => o.status === t.key).length;
    return acc;
  }, {});

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleAccept(order) {
    acceptOrder(order.id);
    showToast(`✓ Accepted — "${order.material}" is now In Transit`);
  }

  function handleRejectConfirm(order) {
    const reason = (rejectReasons[order.id] || "").trim();
    rejectOrder(order.id, reason);
    setExpandRejectId(null);
    setRejectReasons((p) => { const n = { ...p }; delete n[order.id]; return n; });
    showToast(`Order for "${order.material}" rejected${reason ? ` · Reason sent to engineer` : ""}`);
  }

  function handleDeliverConfirm(order) {
    markDelivered(order.id);
    setDeliverConfirmId(null);
    showToast(`✓ Delivered — "${order.material}" marked as delivered`);
  }

  return (
    <Layout title="Incoming Orders" subtitle="Review and manage purchase requests from engineers" back="/dashboard">

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: "#0f172a", color: "white",
          padding: "13px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideInRight .3s cubic-bezier(.16,1,.3,1) both",
          maxWidth: 360,
        }}>
          <span style={{ fontSize: 16 }}>🔔</span> {toast}
        </div>
      )}

      {/* ── Tab strip ── */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 20,
        background: "white", border: "1px solid #e2e8f0",
        borderRadius: 14, overflow: "hidden",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        {TABS.map((t, i) => {
          const active = activeTab === t.key;
          const cfg = STATUS_CFG[t.key];
          const cnt = counts[t.key];
          const isPending = t.urgent && cnt > 0;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, padding: "14px 10px",
                border: "none", borderRight: i < TABS.length - 1 ? "1px solid #f1f5f9" : "none",
                cursor: "pointer", transition: "all .15s",
                background: active
                  ? (t.key === "all" ? "#0f172a" : cfg?.bg || "#f8fafc")
                  : isPending ? "#fffbeb" : "white",
                color: active
                  ? (t.key === "all" ? "white" : cfg?.color || "#0f172a")
                  : isPending ? "#d97706" : "#64748b",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>
                {cnt}
                {isPending && !active && (
                  <span style={{
                    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                    background: "#ef4444", marginLeft: 3, marginBottom: 4,
                    animation: "pulse 1.5s infinite",
                  }} />
                )}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 3, letterSpacing: "0.02em" }}>
                {t.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {displayed.length === 0 && (
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "64px 40px", textAlign: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
            No {activeTab === "all" ? "" : activeTab} orders
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Orders placed by engineers will appear here
          </div>
        </div>
      )}

      {/* ── Order cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {displayed.map((order) => {
          const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
          const proj = getEngineerProject(order.projectId);
          const isPending = order.status === "pending";
          const isTransit = order.status === "in-transit";
          const rejectExpanded = expandRejectId === order.id;
          const isDeliverConfirm = deliverConfirmId === order.id;

          return (
            <div key={order.id} style={{
              background: "white",
              border: `1px solid ${isPending ? "#bfdbfe" : "#e2e8f0"}`,
              borderRadius: 16,
              boxShadow: isPending
                ? "0 4px 16px rgba(37,99,235,0.1)"
                : "0 1px 4px rgba(0,0,0,0.04)",
              overflow: "hidden",
              transition: "box-shadow .2s",
            }}>

              {/* Card header */}
              <div style={{
                padding: "12px 20px",
                background: isPending
                  ? "linear-gradient(135deg,#eff6ff,#dbeafe)"
                  : isTransit ? "linear-gradient(135deg,#fff7ed,#fed7aa22)"
                  : "#fafafa",
                borderBottom: `1px solid ${cfg.border}22`,
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: cfg.color,
                  }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
                        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                        letterSpacing: "0.04em", textTransform: "uppercase",
                      }}>
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{order.id}</span>
                    </div>
                    {order.rejectReason && (
                      <div style={{ fontSize: 11, color: "#dc2626", marginTop: 3, fontStyle: "italic" }}>
                        Reason sent: "{order.rejectReason}"
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                  {fmtDate(order.date)}
                  {order.acceptedAt && (
                    <span style={{ marginLeft: 10, color: "#ea580c" }}>· Accepted {fmtDate(order.acceptedAt)}</span>
                  )}
                  {order.deliveredAt && (
                    <span style={{ marginLeft: 10, color: "#059669" }}>· Delivered {fmtDate(order.deliveredAt)}</span>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 20px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1.5fr",
                  gap: 16, alignItems: "start",
                }} className="iorder-grid">

                  {/* Material */}
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Material</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{order.material}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      {order.qty} loads × {fmtINR(order.rate)}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Amount</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#4f46e5" }}>{fmtINR(order.total)}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>+GST applicable</div>
                  </div>

                  {/* Engineer / Project */}
                  <div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Engineer / Project</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0,
                      }}>
                        {currentEngineer.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{currentEngineer.name}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>{currentEngineer.role}</div>
                      </div>
                    </div>
                    {proj && (
                      <div style={{
                        fontSize: 11, color: "#4f46e5", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 4, marginTop: 2,
                      }}>
                        <span style={{ fontSize: 12 }}>📐</span>
                        {proj.name} · {proj.location?.split(",")[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Action buttons (pending only) ── */}
                {isPending && !rejectExpanded && (
                  <div style={{
                    display: "flex", gap: 10, marginTop: 18,
                    paddingTop: 16, borderTop: "1px dashed #e2e8f0",
                  }}>
                    <button
                      onClick={() => setExpandRejectId(order.id)}
                      style={{
                        flex: 1, padding: "11px 16px", borderRadius: 10,
                        border: "1.5px solid #fca5a5", background: "white",
                        color: "#dc2626", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", transition: "all .15s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
                    >
                      <span style={{ fontSize: 15 }}>✕</span> Reject with Reason
                    </button>
                    <button
                      onClick={() => handleAccept(order)}
                      style={{
                        flex: 2, padding: "11px 16px", borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg,#059669,#10b981)",
                        color: "white", fontSize: 13, fontWeight: 800,
                        cursor: "pointer", transition: "all .15s",
                        boxShadow: "0 4px 12px rgba(5,150,105,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(5,150,105,0.45)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.35)"; }}
                    >
                      <span style={{ fontSize: 16 }}>✓</span> Accept Order
                    </button>
                  </div>
                )}

                {/* ── Inline reject form ── */}
                {isPending && rejectExpanded && (
                  <div style={{
                    marginTop: 18, paddingTop: 16,
                    borderTop: "1px dashed #fca5a5",
                    animation: "fadeUp .2s cubic-bezier(.16,1,.3,1) both",
                  }}>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{
                        fontSize: 12, fontWeight: 700, color: "#dc2626",
                        display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
                      }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#fee2e2", display: "inline-flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: 11,
                        }}>✕</span>
                        Reason for Rejection
                        <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>(visible to engineer)</span>
                      </label>
                      <textarea
                        autoFocus
                        rows={3}
                        placeholder="e.g. Item out of stock — will be available next week. Please re-order after 12 May."
                        value={rejectReasons[order.id] || ""}
                        onChange={(e) => setRejectReasons((p) => ({ ...p, [order.id]: e.target.value }))}
                        style={{
                          width: "100%", padding: "10px 14px",
                          border: "1.5px solid #fca5a5", borderRadius: 10,
                          fontSize: 13, color: "#0f172a", resize: "vertical",
                          outline: "none", lineHeight: 1.5, boxSizing: "border-box",
                          background: "#fffafa",
                          fontFamily: "inherit",
                          transition: "border .15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#f87171"; e.target.style.boxShadow = "0 0 0 3px rgba(248,113,113,0.15)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#fca5a5"; e.target.style.boxShadow = "none"; }}
                      />
                      {(rejectReasons[order.id] || "").trim().length === 0 && (
                        <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          ⚠ A reason helps the engineer understand and re-order
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => { setExpandRejectId(null); setRejectReasons((p) => { const n = { ...p }; delete n[order.id]; return n; }); }}
                        style={{
                          flex: 1, padding: "10px", borderRadius: 10,
                          border: "1px solid #e2e8f0", background: "white",
                          color: "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        ← Cancel
                      </button>
                      <button
                        onClick={() => handleRejectConfirm(order)}
                        style={{
                          flex: 2, padding: "10px", borderRadius: 10,
                          border: "none",
                          background: (rejectReasons[order.id] || "").trim()
                            ? "linear-gradient(135deg,#dc2626,#ef4444)"
                            : "#e2e8f0",
                          color: (rejectReasons[order.id] || "").trim() ? "white" : "#94a3b8",
                          fontSize: 12, fontWeight: 800, cursor: "pointer",
                          transition: "all .15s",
                          boxShadow: (rejectReasons[order.id] || "").trim() ? "0 3px 10px rgba(220,38,38,0.3)" : "none",
                        }}
                      >
                        Confirm Rejection →
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Mark Delivered (in-transit) ── */}
                {isTransit && !isDeliverConfirm && (
                  <div style={{
                    marginTop: 16, paddingTop: 14,
                    borderTop: "1px dashed #fdba74",
                    display: "flex", justifyContent: "flex-end",
                  }}>
                    <button
                      onClick={() => setDeliverConfirmId(order.id)}
                      style={{
                        padding: "10px 22px", borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                        color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 3px 10px rgba(79,70,229,0.3)",
                        display: "flex", alignItems: "center", gap: 7,
                      }}
                    >
                      🚚 Mark as Delivered
                    </button>
                  </div>
                )}

                {/* ── Deliver confirm inline ── */}
                {isTransit && isDeliverConfirm && (
                  <div style={{
                    marginTop: 16, paddingTop: 14,
                    borderTop: "1px dashed #fdba74",
                    background: "#fff7ed", borderRadius: 10, padding: 14,
                    animation: "fadeUp .2s cubic-bezier(.16,1,.3,1) both",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", marginBottom: 10 }}>
                      🚚 Confirm delivery of <strong>{order.material}</strong> to {currentEngineer.name}?
                    </div>
                    <div style={{ fontSize: 11, color: "#9a3412", marginBottom: 12 }}>
                      {fmtINR(order.total)} will be added to your receivables.
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => setDeliverConfirmId(null)}
                        style={{
                          flex: 1, padding: "9px", borderRadius: 9,
                          border: "1px solid #fed7aa", background: "white",
                          color: "#9a3412", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeliverConfirm(order)}
                        style={{
                          flex: 2, padding: "9px", borderRadius: 9,
                          border: "none",
                          background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                          color: "white", fontSize: 12, fontWeight: 800, cursor: "pointer",
                          boxShadow: "0 3px 8px rgba(79,70,229,0.3)",
                        }}
                      >
                        ✓ Yes, Mark Delivered
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @media (max-width: 760px) {
          .iorder-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .iorder-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
