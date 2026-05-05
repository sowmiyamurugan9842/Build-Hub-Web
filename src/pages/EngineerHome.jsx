import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import EngineerLayout from "../components/EngineerLayout";
import {
  currentEngineer, cities, supplierShops, engineerProjects,
  engineerOrders, categories, getSupplierShop, getEngineerProject,
  getSpecialty,
} from "../data/fakeData";

function fmtL(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (n >= 1000)   return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n.toLocaleString("en-IN");
}

const STATUS_BADGE = {
  delivered:    { bg: "#ecfdf5", color: "#059669", label: "✓ Delivered" },
  "in-transit": { bg: "#fff7ed", color: "#ea580c", label: "⟳ In Transit" },
  pending:      { bg: "#eff6ff", color: "#2563eb", label: "◌ Pending" },
};

const sparkData = [
  { d: "W1", v: 285000 }, { d: "W2", v: 320000 },
  { d: "W3", v: 412000 }, { d: "W4", v: 510000 },
];

export default function EngineerHome() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(currentEngineer.city.toLowerCase());

  const recentOrders = engineerOrders.slice(0, 4);
  const activeProjects = engineerProjects.filter((p) => p.status === "active");
  const pendingDeliveries = engineerOrders.filter((o) => o.status !== "delivered").length;
  const monthSpend = engineerOrders.reduce((s, o) => s + o.total, 0);

  return (
    <EngineerLayout title={`Welcome, ${currentEngineer.name.split(" ")[0]}`} subtitle={`${currentEngineer.company} · ${currentEngineer.role}`}>

      {/* ── Hero / location ── */}
      <div style={{
        background: "linear-gradient(135deg,#312e81 0%,#4f46e5 50%,#6366f1 100%)",
        borderRadius: 16, padding: "20px 22px", marginBottom: 16,
        boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -50, right: 100, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 8 }}>
            📍 Browsing Suppliers In
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white", padding: "10px 14px",
                borderRadius: 10, fontSize: 16, fontWeight: 800,
                cursor: "pointer", outline: "none",
                appearance: "none", backdropFilter: "blur(8px)",
              }}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id} style={{ color: "#0f172a" }}>
                  {c.name}, {c.state}
                </option>
              ))}
            </select>
            <button
              onClick={() => navigate(`/engineer/suppliers?city=${selectedCity}`)}
              style={{
                background: "white", color: "#4f46e5",
                border: "none", padding: "10px 18px", borderRadius: 10,
                fontSize: 13, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              Browse Shops →
            </button>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
            {(() => {
              const cityShops = supplierShops.filter((s) => s.city === selectedCity);
              const cats = new Set(cityShops.map((s) => s.category)).size;
              const items = cityShops.reduce((s, sh) => s + sh.catalog.length, 0);
              return (
                <>
                  <div style={{ color: "white", fontSize: 13 }}>
                    <span style={{ opacity: 0.7 }}>🏪 </span>
                    <strong>{cityShops.length}</strong> verified suppliers
                  </div>
                  <div style={{ color: "white", fontSize: 13 }}>
                    <span style={{ opacity: 0.7 }}>🏷️ </span>
                    <strong>{cats}</strong> categories
                  </div>
                  <div style={{ color: "white", fontSize: 13 }}>
                    <span style={{ opacity: 0.7 }}>📦 </span>
                    <strong>{items}+</strong> products
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12, marginBottom: 16,
      }}>
        <div style={{
          background: "linear-gradient(135deg,#eef2ff,#fff)", border: "1px solid #c7d2fe",
          borderRadius: 14, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Spend</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#4f46e5", marginTop: 4 }}>{fmtL(monthSpend)}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>This month · {engineerOrders.length} orders</div>
          <div style={{ height: 36, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id="sparkA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={1.8} fill="url(#sparkA)" dot={false} />
                <Tooltip content={({ active, payload }) =>
                  active && payload?.length
                    ? <div style={{ fontSize: 10, background: "white", padding: "3px 7px", borderRadius: 6, fontWeight: 700, border: "1px solid #e2e8f0" }}>{fmtL(payload[0].value)}</div>
                    : null
                } />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={{
          background: "linear-gradient(135deg,#ecfdf5,#fff)", border: "1px solid #a7f3d0",
          borderRadius: 14, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Active Projects</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#059669", marginTop: 4 }}>{activeProjects.length}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Ongoing sites</div>
          <button
            onClick={() => navigate("/engineer/projects")}
            style={{
              marginTop: 10, fontSize: 11, fontWeight: 700, color: "#059669",
              background: "transparent", border: "none", cursor: "pointer", padding: 0,
            }}
          >View all →</button>
        </div>
        <div style={{
          background: "linear-gradient(135deg,#fff7ed,#fff)", border: "1px solid #fed7aa",
          borderRadius: 14, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pending Deliveries</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#ea580c", marginTop: 4 }}>{pendingDeliveries}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Lorries en route</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg,#fef3c7,#fff)", border: "1px solid #fde68a",
          borderRadius: 14, padding: "16px 18px",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Avg. Savings</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#d97706", marginTop: 4 }}>8.4%</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>By rate comparison</div>
        </div>
      </div>

      {/* ── Browse by Category ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Browse by Category</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Everything you need for construction — from raw aggregates to finishing materials
            </div>
          </div>
          <button
            onClick={() => navigate(`/engineer/suppliers?city=${selectedCity}`)}
            style={{
              fontSize: 12, color: "#6366f1", fontWeight: 700, background: "none",
              border: "none", cursor: "pointer",
            }}
          >View all shops →</button>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 10,
        }}>
          {categories.map((c) => {
            const count = supplierShops.filter((s) => s.city === selectedCity && s.category === c.id).length;
            const specialty = getSpecialty(currentEngineer.specialtyId);
            const isRelevant = specialty?.relevant.includes(c.id);
            const dim = count === 0;
            return (
              <button
                key={c.id}
                disabled={dim}
                onClick={() => navigate(`/engineer/suppliers?city=${selectedCity}&category=${c.id}`)}
                style={{
                  background: dim ? "#fafbfc" : c.bg,
                  border: dim ? "1px solid #f1f5f9" : `1px solid ${c.border}`,
                  borderRadius: 12, padding: "14px 12px",
                  cursor: dim ? "not-allowed" : "pointer",
                  textAlign: "left", position: "relative", overflow: "hidden",
                  transition: "all .2s cubic-bezier(.16,1,.3,1)",
                  opacity: dim ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!dim) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 24px ${c.color}33`; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {isRelevant && !dim && (
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
                    background: c.color, color: "white",
                    letterSpacing: "0.04em",
                  }}>FOR YOU</span>
                )}
                <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: dim ? "#94a3b8" : c.color, marginBottom: 2 }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.3, marginBottom: 8, minHeight: 26 }}>
                  {c.desc}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: dim ? "#cbd5e1" : c.color }}>
                  {count > 0 ? `${count} shop${count > 1 ? "s" : ""} →` : "Coming soon"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Find Suppliers",   path: "/engineer/suppliers", color: "#6366f1", bg: "#eef2ff", icon: "🏪" },
          { label: "Place New Order",  path: "/engineer/suppliers", color: "#10b981", bg: "#ecfdf5", icon: "🛒" },
          { label: "My Projects",      path: "/engineer/projects",  color: "#f59e0b", bg: "#fffbeb", icon: "🏗️" },
          { label: "Order History",    path: "/engineer/orders",    color: "#0ea5e9", bg: "#f0f9ff", icon: "📋" },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => navigate(q.path)}
            style={{
              background: q.bg, border: `1px solid ${q.color}33`, borderRadius: 12,
              padding: "14px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700,
              color: q.color, display: "flex", alignItems: "center", gap: 10,
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span style={{ fontSize: 20 }}>{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>

      {/* ── Two columns: projects + orders ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="home-grid">

        {/* Active projects */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Active Projects</div>
            <button
              onClick={() => navigate("/engineer/projects")}
              style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
            >View all →</button>
          </div>
          {activeProjects.slice(0, 3).map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/engineer/projects/${p.id}`)}
              style={{
                padding: "12px 12px", marginBottom: 8, border: "1px solid #f1f5f9",
                borderRadius: 10, cursor: "pointer", transition: "all .15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>📍 {p.location}</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                  background: "#eef2ff", color: "#4f46e5",
                }}>{p.phase}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div style={{ flex: 1, height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p.progress}%`, background: "linear-gradient(90deg,#6366f1,#10b981)", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{p.progress}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
                <span style={{ color: "#94a3b8" }}>Spent {fmtL(p.spent)}</span>
                <span style={{ color: "#475569", fontWeight: 600 }}>of {fmtL(p.budget)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Recent Orders</div>
            <button
              onClick={() => navigate("/engineer/orders")}
              style={{ fontSize: 11, color: "#6366f1", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
            >View all →</button>
          </div>
          {recentOrders.map((o) => {
            const sup = getSupplierShop(o.supplierId);
            const proj = getEngineerProject(o.projectId);
            const status = STATUS_BADGE[o.status];
            return (
              <div
                key={o.id}
                style={{
                  padding: "10px 12px", marginBottom: 6, border: "1px solid #f1f5f9",
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{o.material}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sup?.name} · {o.qty} loads</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#4f46e5" }}>{fmtL(o.total)}</div>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                      background: status.bg, color: status.color, marginTop: 2, display: "inline-block",
                    }}>{status.label}</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>
                  📐 {proj?.name} · 📅 {new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </EngineerLayout>
  );
}
