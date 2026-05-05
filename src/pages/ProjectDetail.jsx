import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import Layout from "../components/Layout";
import { getProject, customers } from "../data/fakeData";

function fmtL(n) {
  if (Math.abs(n) >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (Math.abs(n) >= 1000)   return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n.toLocaleString("en-IN");
}

const PHASE_COLORS = {
  "completed":   { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", icon: "✓" },
  "in-progress": { bg: "#eef2ff", color: "#4f46e5", border: "#c7d2fe", icon: "◐" },
  "pending":     { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0", icon: "○" },
};

const MATERIAL_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#0ea5e9", "#a855f7"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "white", border: "1px solid #e2e8f0", borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, color: "#334155", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#64748b" }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "#0f172a" }}>{fmtL(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getProject(id);

  if (!project) {
    return (
      <Layout title="Project not found" back="/projects">
        <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
          Project {id} not found.
        </div>
      </Layout>
    );
  }

  const customer = customers.find((c) => c.id === project.customerId);
  const remaining = project.budget - project.spent;
  const burnPct = (project.spent / project.budget) * 100;
  const overBudget = remaining < 0;

  /* Pie data — material % spend (keep full name to avoid duplicates like "Blue Metal") */
  const pieData = project.materials.map((m, i) => ({
    id: m.materialId,
    name: m.name.replace(" (Manufactured)", "").trim(),
    value: m.used * m.rate,
    color: MATERIAL_COLORS[i % MATERIAL_COLORS.length],
  })).filter((d) => d.value > 0);
  const totalSpent = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <Layout title={project.name} subtitle={`${project.id} · ${project.location}`} back="/projects">

      {/* ── Hero strip ── */}
      <div style={{
        background: "linear-gradient(135deg,#312e81 0%,#4f46e5 50%,#6366f1 100%)",
        borderRadius: 16, padding: "22px 24px", marginBottom: 16, color: "white",
        boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -60, right: 80, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75, marginBottom: 6 }}>
              {project.type} · {project.area}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 14 }}>
              <span style={{ background: "rgba(255,255,255,0.18)", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>
                {project.status === "active" ? "● ACTIVE" : "✓ COMPLETED"}
              </span>
              <span style={{ marginLeft: 10 }}>👤 {customer?.name}</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>OVERALL PROGRESS</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${project.progress}%`,
                  background: "linear-gradient(90deg,#fbbf24,#10b981)",
                  borderRadius: 4, transition: "width 1.5s cubic-bezier(.16,1,.3,1)",
                }} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900 }}>{project.progress}%</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>BUDGET</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{fmtL(project.budget)}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>Total allocated</div>
          </div>

          <div>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>SPENT</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>{fmtL(project.spent)}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{burnPct.toFixed(1)}% utilized</div>
          </div>

          <div>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>{overBudget ? "OVER BY" : "REMAINING"}</div>
            <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: overBudget ? "#fda4af" : "#86efac" }}>
              {fmtL(Math.abs(remaining))}
            </div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
              📅 Due {new Date(project.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase tracker ── */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Construction Phases</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Phase-wise budget allocation and progress</div>
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            {project.phases.filter(p => p.status === "completed").length} of {project.phases.length} completed
          </div>
        </div>

        {/* Phase timeline */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, position: "relative" }}>
          {project.phases.map((ph, i) => {
            const c = PHASE_COLORS[ph.status];
            return (
              <div key={ph.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {/* Connector */}
                {i < project.phases.length - 1 && (
                  <div style={{
                    position: "absolute", top: 14, left: "60%", right: "-40%", height: 2,
                    background: project.phases[i + 1].status !== "pending" ? "#10b981" : "#e2e8f0",
                    zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: c.bg, border: `2px solid ${c.border}`, color: c.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, position: "relative", zIndex: 1,
                  ...(ph.status === "in-progress" && {
                    animation: "pulseRing 2s infinite",
                    boxShadow: "0 0 0 0 rgba(99,102,241,0.4)",
                  }),
                }}>
                  {c.icon}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginTop: 6, textAlign: "center" }}>{ph.name}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{fmtL(ph.allocated)}</div>
              </div>
            );
          })}
        </div>

        {/* Phase rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {project.phases.map((ph) => {
            const c = PHASE_COLORS[ph.status];
            const variance = ph.spent - ph.allocated;
            return (
              <div key={ph.name} style={{
                display: "grid", gridTemplateColumns: "180px 1fr 100px 100px",
                gap: 14, alignItems: "center",
                padding: "10px 14px", border: "1px solid #f1f5f9", borderRadius: 10,
                background: ph.status === "in-progress" ? "#fafafe" : "white",
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{ph.name}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: c.color, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
                    {ph.status.replace("-", " ")}
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{ph.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${ph.progress}%`,
                      background: ph.status === "completed" ? "#10b981" : ph.status === "in-progress" ? "#6366f1" : "#cbd5e1",
                      borderRadius: 3, transition: "width 1s cubic-bezier(.16,1,.3,1)",
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>SPENT</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{ph.spent ? fmtL(ph.spent) : "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>VARIANCE</div>
                  <div style={{
                    fontSize: 12, fontWeight: 800,
                    color: ph.spent === 0 ? "#cbd5e1" : variance > 0 ? "#e11d48" : "#10b981",
                  }}>
                    {ph.spent === 0 ? "—" : (variance > 0 ? "+" : "") + fmtL(variance)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, marginBottom: 16 }}>

        {/* Monthly spend chart */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Planned vs Actual Spend</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Monthly cost burn</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={project.monthlySpend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => fmtL(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="planned" name="Planned" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 3" fill="url(#gPlanned)" dot={false} />
              <Bar dataKey="actual" name="Actual" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#64748b", marginTop: 6, paddingLeft: 50 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 12, height: 2, background: "#94a3b8", display: "inline-block", borderTop: "2px dashed #94a3b8" }} /> Planned
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#6366f1", display: "inline-block" }} /> Actual
            </span>
          </div>
        </div>

        {/* Material spend pie */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Material Mix</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Spend distribution</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ResponsiveContainer width="50%" height={170}>
              <PieChart>
                <Pie
                  data={pieData} dataKey="value" nameKey="name"
                  innerRadius={42} outerRadius={68} paddingAngle={2}
                  stroke="white" strokeWidth={2}
                >
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length
                      ? <div style={{ background: "white", padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11 }}>
                          <strong>{payload[0].name}</strong>: {fmtL(payload[0].value)}
                        </div>
                      : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {pieData.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: "#475569", fontWeight: 600 }}>{d.name}</span>
                  <span style={{ color: "#94a3b8" }}>{((d.value / totalSpent) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Materials table ── */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Material Consumption</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Allocated vs used quantities</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Material","Allocated","Used","Remaining","Progress","Cost"].map((h) => (
                  <th key={h} style={{
                    padding: "10px 12px",
                    textAlign: h === "Material" ? "left" : h === "Progress" ? "left" : "right",
                    color: "#64748b", fontWeight: 700, fontSize: 11,
                    borderBottom: "2px solid #e2e8f0",
                    letterSpacing: "0.03em", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {project.materials.map((m, i) => {
                const usedPct = (m.used / m.allocated) * 100;
                const cost = m.used * m.rate;
                const color = MATERIAL_COLORS[i % MATERIAL_COLORS.length];
                return (
                  <tr key={m.materialId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 12px", fontWeight: 600, color: "#0f172a" }}>
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: color, marginRight: 8, verticalAlign: "middle" }} />
                      {m.name}
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", color: "#64748b" }}>{m.allocated} {m.unit}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>{m.used} {m.unit}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right", color: m.allocated - m.used < 5 ? "#e11d48" : "#10b981", fontWeight: 600 }}>
                      {m.allocated - m.used} {m.unit}
                    </td>
                    <td style={{ padding: "12px 12px", minWidth: 140 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${usedPct}%`, background: color,
                            borderRadius: 3, transition: "width 1s cubic-bezier(.16,1,.3,1)",
                          }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", minWidth: 32 }}>
                          {usedPct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 800, color: "#4f46e5" }}>{fmtL(cost)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent deliveries ── */}
      {project.deliveries.length > 0 && (
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Recent Deliveries to Site</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Last {project.deliveries.length} loads</div>
            </div>
            <button
              onClick={() => navigate("/orders/new")}
              style={{
                padding: "7px 12px", borderRadius: 8,
                background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe",
                cursor: "pointer", fontSize: 11, fontWeight: 700,
              }}
            >+ New Delivery</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {project.deliveries.map((d, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "100px 1fr 100px 120px",
                gap: 14, alignItems: "center",
                padding: "10px 14px", border: "1px solid #f1f5f9", borderRadius: 10,
              }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                  {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🚛</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{d.material}</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", textAlign: "right" }}>{d.qty} loads</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#4f46e5", textAlign: "right" }}>{fmtL(d.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .layout [style*="grid-template-columns: 2fr 1fr 1fr 1fr"],
          .layout [style*="grid-template-columns: 1.5fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}
