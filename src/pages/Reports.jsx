import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import Layout from "../components/Layout";
import { monthlyPL, customers, crushers, dashboardStats } from "../data/fakeData";

/* ── helpers ── */
function fmtL(n) { return "₹" + (n / 100000).toFixed(2) + "L"; }
function fmtShort(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + (n / 1000).toFixed(0) + "K";
}
function fmtINR(n) { return "₹" + n.toLocaleString("en-IN"); }

const chartData = monthlyPL.map((m) => ({
  month: m.month.split(" ")[0].slice(0, 3),
  Sales: m.sales,
  Purchases: m.purchases,
  Profit: m.profit,
  Margin: +((m.profit / m.sales) * 100).toFixed(1),
}));

const current = monthlyPL[monthlyPL.length - 1];
const prev    = monthlyPL[monthlyPL.length - 2];
const salesGrowth = (((current.sales - prev.sales) / prev.sales) * 100).toFixed(1);
const profitGrowth = (((current.profit - prev.profit) / prev.profit) * 100).toFixed(1);

const topCustomers = [...customers]
  .filter((c) => c.balance > 0)
  .sort((a, b) => b.balance - a.balance)
  .slice(0, 6);

const topCrushers = [...crushers]
  .sort((a, b) => b.balance - a.balance)
  .slice(0, 5);

const maxCustBal   = topCustomers[0]?.balance || 1;
const maxCrushBal  = topCrushers[0]?.balance  || 1;
const totalCustBal = customers.reduce((s, c) => s + c.balance, 0);
const totalCrushBal = crushers.reduce((s, c) => s + c.balance, 0);

/* ── custom tooltip ── */
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
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            {p.name === "Margin" ? p.value + "%" : fmtShort(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── KPI card ── */
function KpiCard({ label, value, sub, subColor = "#10b981", accent, bg, border }) {
  return (
    <div style={{
      background: bg || "white",
      border: `1px solid ${border || "#e2e8f0"}`,
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      position: "relative", overflow: "hidden",
    }}>
      {accent && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: accent, borderRadius: "14px 14px 0 0",
        }} />
      )}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 12, fontWeight: 600, color: subColor, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

/* ── rank row ── */
function RankRow({ rank, name, city, balance, max, barColor }) {
  const pct = (balance / max) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        background: rank === 1 ? "#fbbf24" : rank === 2 ? "#94a3b8" : rank === 3 ? "#f97316" : "#e2e8f0",
        color: rank <= 3 ? "white" : "#64748b",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800,
      }}>
        {rank}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
          <div style={{ flex: 1, height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`, background: barColor,
              borderRadius: 3, transition: "width 1s cubic-bezier(.16,1,.3,1)",
            }} />
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{city}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", flexShrink: 0 }}>{fmtShort(balance)}</div>
    </div>
  );
}

export default function Reports() {
  return (
    <Layout title="Reports" subtitle="Financial overview — Apr 2026">

      {/* ── KPI strip ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        marginBottom: 20,
      }}>
        <KpiCard
          label="Apr Sales"
          value={fmtL(current.sales)}
          sub={`↑ ${salesGrowth}% vs Mar`}
          accent="linear-gradient(90deg,#6366f1,#818cf8)"
          bg="linear-gradient(135deg,#eef2ff,#fff)"
          border="#c7d2fe"
        />
        <KpiCard
          label="Apr Purchases"
          value={fmtL(current.purchases)}
          sub="vs ₹27.5L in Mar"
          subColor="#f43f5e"
          accent="#f43f5e"
          bg="linear-gradient(135deg,#fff1f2,#fff)"
          border="#fecdd3"
        />
        <KpiCard
          label="Apr Profit"
          value={fmtL(current.profit)}
          sub={`↑ ${profitGrowth}% vs Mar`}
          accent="#10b981"
          bg="linear-gradient(135deg,#ecfdf5,#fff)"
          border="#a7f3d0"
        />
        <KpiCard
          label="Gross Margin"
          value={((current.profit / current.sales) * 100).toFixed(1) + "%"}
          sub="Healthy — above 30%"
          accent="#f59e0b"
          bg="linear-gradient(135deg,#fffbeb,#fff)"
          border="#fde68a"
        />
        <KpiCard
          label="Receivables"
          value={fmtL(totalCustBal)}
          sub={`${customers.filter(c => c.balance > 0).length} customers`}
          subColor="#f97316"
          accent="#f97316"
          bg="linear-gradient(135deg,#fff7ed,#fff)"
          border="#fed7aa"
        />
        <KpiCard
          label="Payables"
          value={fmtL(totalCrushBal)}
          sub={`${crushers.length} crushers`}
          subColor="#64748b"
          accent="#64748b"
          bg="linear-gradient(135deg,#f8fafc,#fff)"
          border="#e2e8f0"
        />
      </div>

      {/* ── Main area chart ── */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "20px 20px 12px", marginBottom: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Revenue & Profit Trend</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Nov 2025 – Apr 2026</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#64748b" }}>
            {[["#6366f1","Sales"],["#f43f5e","Purchases"],["#10b981","Profit"]].map(([c,l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
                {l}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPurchases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => fmtShort(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={52} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="Sales"     stroke="#6366f1" strokeWidth={2.5} fill="url(#gSales)"     dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="Purchases" stroke="#f43f5e" strokeWidth={2}   fill="url(#gPurchases)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="Profit"    stroke="#10b981" strokeWidth={2.5} fill="url(#gProfit)"    dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Margin chart + P&L table ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, marginBottom: 16 }}>

        {/* Margin % bar chart */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Gross Margin %</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Monthly gross margin trend</div>
          <ResponsiveContainer width="100%" height={170}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[28, 36]} tickFormatter={(v) => v + "%"} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={30} stroke="#e2e8f0" strokeDasharray="4 3" label={{ value: "30%", position: "right", fontSize: 10, fill: "#94a3b8" }} />
              <Bar dataKey="Margin" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Line type="monotone" dataKey="Margin" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* P&L table */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Monthly P&L Statement</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Month", "Sales", "Purchases", "Profit", "Margin"].map((h) => (
                  <th key={h} style={{
                    padding: "8px 10px",
                    textAlign: h === "Month" ? "left" : "right",
                    color: "#64748b", fontWeight: 700, fontSize: 11,
                    borderBottom: "2px solid #e2e8f0",
                    letterSpacing: "0.03em", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...monthlyPL].reverse().map((m, i) => {
                const margin = ((m.profit / m.sales) * 100).toFixed(1);
                const isLatest = i === 0;
                return (
                  <tr key={m.month} style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: isLatest ? "#f8fafc" : "transparent",
                  }}>
                    <td style={{ padding: "9px 10px", fontWeight: isLatest ? 700 : 500, color: isLatest ? "#4f46e5" : "#0f172a" }}>
                      {m.month}
                      {isLatest && <span style={{ marginLeft: 6, fontSize: 9, background: "#eef2ff", color: "#6366f1", padding: "1px 5px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.05em" }}>CURRENT</span>}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: "#6366f1", fontWeight: 600 }}>{fmtL(m.sales)}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: "#f43f5e" }}>{fmtL(m.purchases)}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: "#10b981", fontWeight: 700 }}>{fmtL(m.profit)}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right" }}>
                      <span style={{
                        background: +margin >= 32 ? "#ecfdf5" : +margin >= 30 ? "#fffbeb" : "#fff1f2",
                        color: +margin >= 32 ? "#059669" : +margin >= 30 ? "#d97706" : "#e11d48",
                        padding: "2px 7px", borderRadius: 5, fontWeight: 700, fontSize: 11,
                      }}>{margin}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Receivables + Payables ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>

        {/* Top customers */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 20px 8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Top Receivables</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Customer outstanding dues</div>
            </div>
            <div style={{
              background: "#fff7ed", color: "#f97316", fontSize: 11, fontWeight: 700,
              padding: "4px 10px", borderRadius: 8,
            }}>{fmtShort(totalCustBal)}</div>
          </div>
          {topCustomers.map((c, i) => (
            <RankRow
              key={c.id}
              rank={i + 1}
              name={c.name}
              city={c.city}
              balance={c.balance}
              max={maxCustBal}
              barColor={i === 0 ? "#f97316" : i === 1 ? "#fb923c" : "#fdba74"}
            />
          ))}
        </div>

        {/* Top crushers */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 20px 8px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Top Payables</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Crusher outstanding dues</div>
            </div>
            <div style={{
              background: "#f8fafc", color: "#64748b", fontSize: 11, fontWeight: 700,
              padding: "4px 10px", borderRadius: 8, border: "1px solid #e2e8f0",
            }}>{fmtShort(totalCrushBal)}</div>
          </div>
          {topCrushers.map((c, i) => (
            <RankRow
              key={c.id}
              rank={i + 1}
              name={c.name}
              city={c.city}
              balance={c.balance}
              max={maxCrushBal}
              barColor={i === 0 ? "#6366f1" : i === 1 ? "#818cf8" : "#a5b4fc"}
            />
          ))}
        </div>
      </div>

    </Layout>
  );
}
