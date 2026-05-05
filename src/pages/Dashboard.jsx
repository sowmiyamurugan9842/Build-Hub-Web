import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import Layout from "../components/Layout";
import { dashboardStats, recentOrders, monthlyPL } from "../data/fakeData";
import { useCountUp } from "../hooks/useCountUp";

/* ── weekly sparkline data (simulated from monthly trend) ── */
const weeklyData = [
  { d: "Mon", v: 218000 },
  { d: "Tue", v: 295000 },
  { d: "Wed", v: 241000 },
  { d: "Thu", v: 312000 },
  { d: "Fri", v: 267000 },
  { d: "Sat", v: 284500 },
];

const chartData = monthlyPL.map((m) => ({
  month: m.month.split(" ")[0].slice(0, 3),
  Sales: m.sales,
  Profit: m.profit,
}));

function fmtVal(n, prefix = "₹") {
  if (n >= 100000) return prefix + (n / 100000).toFixed(1) + "L";
  if (n >= 1000)   return prefix + (n / 1000).toFixed(0) + "K";
  return prefix + n;
}

/* ── sparkline mini chart ── */
function Sparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
          fill={`url(#spark-${color.replace("#","")})`} dot={false}
        />
        <Tooltip
          content={({ active, payload }) =>
            active && payload?.length
              ? <div style={{ fontSize: 10, background: "white", border: "1px solid #e2e8f0", padding: "3px 7px", borderRadius: 6, fontWeight: 700 }}>
                  {fmtVal(payload[0].value)}
                </div>
              : null
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── stat card ── */
function StatCard({ accent, bg, label, target, prefix = "₹", suffix = "", sub, subColor, delay = 0, sparkColor, change }) {
  const val = useCountUp(target, 1400, delay);
  return (
    <div style={{
      background: bg || "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: "18px 18px 10px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: accent, borderRadius: "16px 16px 0 0",
      }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
        {fmtVal(val, prefix)}{suffix}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: subColor || "#64748b" }}>{sub}</div>
        {change && (
          <div style={{
            fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
            background: change > 0 ? "#ecfdf5" : "#fff1f2",
            color: change > 0 ? "#059669" : "#e11d48",
          }}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
          </div>
        )}
      </div>
      {sparkColor && (
        <div style={{ marginTop: 6 }}>
          <Sparkline data={weeklyData} color={sparkColor} />
        </div>
      )}
    </div>
  );
}

/* ── icon set ── */
const icons = {
  sales: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  truck: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
};

const quickBtns = [
  { color: "#6366f1", bg: "#eef2ff", label: "New Sale Order", path: "/orders/new", icon: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  )},
  { color: "#10b981", bg: "#ecfdf5", label: "New Purchase", path: "/purchases/new", icon: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )},
  { color: "#f97316", bg: "#fff7ed", label: "Customers", path: "/customers", icon: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )},
  { color: "#0ea5e9", bg: "#f0f9ff", label: "Reports", path: "/reports", icon: (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
];

function statusBadge(s) {
  if (s === "delivered") return <span className="badge badge-green">✓ Delivered</span>;
  if (s === "in-transit") return <span className="badge badge-orange">⟳ In Transit</span>;
  return <span className="badge badge-blue">◌ Pending</span>;
}

function addRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  const rect = btn.getBoundingClientRect();
  circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${e.clientX - rect.left - radius}px;top:${e.clientY - rect.top - radius}px;`;
  circle.classList.add("ripple");
  btn.querySelector(".ripple")?.remove();
  btn.appendChild(circle);
}

/* ── monthly chart tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, color: "#334155", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#64748b" }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "#0f172a" }}>{fmtVal(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout title="Dashboard" subtitle="Good morning, Vinoth 👋">

      {/* ── Stat cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12, marginBottom: 16,
      }}>
        <StatCard
          accent="linear-gradient(90deg,#6366f1,#818cf8)"
          bg="linear-gradient(135deg,#eef2ff 0%,#fff 60%)"
          label="Today's Sales"
          target={dashboardStats.todaySales}
          sub="vs ₹2.54L yesterday"
          subColor="#6366f1"
          change={12}
          delay={0}
          sparkColor="#6366f1"
        />
        <StatCard
          accent="#f43f5e"
          bg="linear-gradient(135deg,#fff1f2 0%,#fff 60%)"
          label="Pending Collections"
          target={dashboardStats.pendingCollections}
          sub="18 customers overdue"
          subColor="#f43f5e"
          delay={80}
        />
        <StatCard
          accent="#f59e0b"
          bg="linear-gradient(135deg,#fffbeb 0%,#fff 60%)"
          label="Today's Payables"
          target={dashboardStats.todayPayables}
          sub="3 crushers due today"
          subColor="#d97706"
          delay={160}
        />
        <StatCard
          accent="#10b981"
          bg="linear-gradient(135deg,#ecfdf5 0%,#fff 60%)"
          label="Month Profit"
          target={dashboardStats.monthProfit}
          sub="Apr 2026 · 32.0% margin"
          subColor="#059669"
          change={0.7}
          delay={240}
        />
      </div>

      {/* ── 6-month chart ── */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "18px 18px 12px", marginBottom: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Sales vs Profit</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>6-month performance</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#64748b" }}>
            {[["#6366f1","Sales"],["#10b981","Profit"]].map(([c,l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
                {l}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dbSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dbProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => fmtVal(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="Sales"  stroke="#6366f1" strokeWidth={2.5} fill="url(#dbSales)"  dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2.5} fill="url(#dbProfit)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Quick actions ── */}
      <div className="section-head">Quick Actions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {quickBtns.map((q) => (
          <button
            key={q.path}
            onClick={(e) => { addRipple(e); navigate(q.path); }}
            style={{
              background: q.bg,
              border: `1px solid ${q.color}22`,
              borderRadius: 12,
              padding: "14px 10px",
              cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              fontSize: 12, fontWeight: 600, color: q.color,
              transition: "transform .15s, box-shadow .15s",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ color: q.color }}>{q.icon}</div>
            {q.label}
          </button>
        ))}
      </div>

      {/* ── Recent orders ── */}
      <div className="section-head">Recent Orders</div>
      <div className="card">
        {recentOrders.map((order) => (
          <div key={order.id} className="list-item" onClick={() => navigate(`/invoice/${order.id}`)}>
            <div className="avatar orange">{icons.truck}</div>
            <div className="list-content">
              <div className="list-name">{order.customer}</div>
              <div className="list-sub">{order.material} · {order.qty} loads · {order.date.split(" ")[1]}</div>
              <div style={{ marginTop: 5 }}>{statusBadge(order.status)}</div>
            </div>
            <div className="list-right">
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>₹{order.total.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{order.id}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
