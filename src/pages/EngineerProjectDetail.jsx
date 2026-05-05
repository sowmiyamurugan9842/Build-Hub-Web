import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
  ReferenceLine,
} from "recharts";
import EngineerLayout from "../components/EngineerLayout";
import {
  getEngineerProject, getEngineerOrdersForProject,
  getSupplierShop,
} from "../data/fakeData";
import { useAttendance } from "../store/AttendanceContext";

/* ── constants & helpers ── */
const TODAY = "2026-05-05";
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ROLES = ["Mason","Carpenter","Helper","Supervisor","Foreman","Electrician","Plumber","Driver","Other"];

const ATT_STATUS = {
  present:    { label: "✓ Present",   bg: "#ecfdf5", color: "#059669" },
  absent:     { label: "✕ Absent",    bg: "#fef2f2", color: "#dc2626" },
  "half-day": { label: "◑ Half Day",  bg: "#fffbeb", color: "#d97706" },
  leave:      { label: "○ On Leave",  bg: "#f8fafc", color: "#64748b" },
};

function computeHours(ci, co) {
  if (!ci || !co) return null;
  const [hi, mi] = ci.split(":").map(Number);
  const [ho, mo] = co.split(":").map(Number);
  const diff = (ho * 60 + mo) - (hi * 60 + mi);
  if (diff <= 0) return null;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekDates(weekOffset) {
  const base = new Date(TODAY);
  base.setDate(base.getDate() + weekOffset * 7);
  const dow = base.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(base);
  mon.setDate(base.getDate() + diff);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function fmtDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtL(n) {
  if (Math.abs(n) >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (Math.abs(n) >= 1000)   return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n.toLocaleString("en-IN");
}
function fmtINR(n) { return "₹" + n.toLocaleString("en-IN"); }

const STATUS = {
  delivered:    { bg: "#ecfdf5", color: "#059669", label: "✓ Delivered" },
  "in-transit": { bg: "#fff7ed", color: "#ea580c", label: "⟳ In Transit" },
  pending:      { bg: "#eff6ff", color: "#2563eb", label: "◌ Pending" },
};

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

const EMPTY_FORM = { workerName: "", role: "Mason", status: "present", checkIn: "07:30", checkOut: "17:00", notes: "" };

export default function EngineerProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = getEngineerProject(id);
  const { getForProject, addRecord, updateRecord, deleteRecord } = useAttendance();

  /* tab state */
  const [activeTab, setActiveTab]       = useState("overview");
  const [weekOffset, setWeekOffset]     = useState(0);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [addForm, setAddForm]           = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!project) {
    return (
      <EngineerLayout title="Project not found" back="/engineer/projects">
        <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
          Project {id} not found.
        </div>
      </EngineerLayout>
    );
  }

  const orders = getEngineerOrdersForProject(project.id);
  const remaining = project.budget - project.spent;
  const burnPct = (project.spent / project.budget) * 100;

  /* attendance data */
  const weekDates = getWeekDates(weekOffset);
  const dayRecords = getForProject(project.id, selectedDate);

  const attSummary = {
    total:    dayRecords.length,
    present:  dayRecords.filter((r) => r.status === "present").length,
    absent:   dayRecords.filter((r) => r.status === "absent").length,
    halfDay:  dayRecords.filter((r) => r.status === "half-day").length,
    leave:    dayRecords.filter((r) => r.status === "leave").length,
  };

  function handleAddSubmit(e) {
    e.preventDefault();
    if (!addForm.workerName.trim()) return;
    addRecord({ ...addForm, projectId: project.id, date: selectedDate });
    setAddForm(EMPTY_FORM);
    setShowAddForm(false);
  }

  /* Pie data — material % spend (planned cost = used × rate) */
  const pieData = project.materials.map((m, i) => ({
    id: m.materialId,
    name: m.name.replace(" (Manufactured)", "").trim(),
    value: m.used * m.rate,
    color: MATERIAL_COLORS[i % MATERIAL_COLORS.length],
  })).filter((d) => d.value > 0);
  const pieTotal = pieData.reduce((s, d) => s + d.value, 0);

  /* Supplier breakdown from orders */
  const supplierMap = {};
  orders.forEach((o) => {
    if (!supplierMap[o.supplierId]) supplierMap[o.supplierId] = { id: o.supplierId, total: 0, count: 0 };
    supplierMap[o.supplierId].total += o.total;
    supplierMap[o.supplierId].count += 1;
  });
  const supplierBreakdown = Object.values(supplierMap)
    .map((s) => ({ ...s, shop: getSupplierShop(s.id) }))
    .sort((a, b) => b.total - a.total);

  return (
    <EngineerLayout title={project.name} subtitle={`${project.id} · ${project.location}`} back="/engineer/projects">

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#312e81 0%,#4f46e5 50%,#6366f1 100%)",
        borderRadius: 16, padding: "22px 24px", marginBottom: 16, color: "white",
        boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -50, right: 80, width: 120, height: 120, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 24 }} className="hero-grid">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75, marginBottom: 6 }}>
              {project.type} · {project.area}
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(255,255,255,0.18)", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>
                {project.status === "active" ? "● ACTIVE" : "✓ COMPLETED"}
              </span>
              <span style={{ background: "rgba(251,191,36,0.25)", color: "#fde68a", padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 700 }}>
                Phase: {project.phase}
              </span>
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
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{fmtL(project.budget)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>SPENT</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{fmtL(project.spent)}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{burnPct.toFixed(0)}% utilized</div>
          </div>
          <div>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>REMAINING</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4, color: "#86efac" }}>{fmtL(remaining)}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>📅 Due {new Date(project.endDate).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}</div>
          </div>
        </div>
      </div>

      {/* Quick action + Tab strip row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
        {/* Tab strip */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 10, padding: 4 }}>
          {[
            { id: "overview",   label: "📋 Overview" },
            { id: "attendance", label: "👷 Attendance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 18px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                background: activeTab === tab.id ? "white" : "transparent",
                color: activeTab === tab.id ? "#4f46e5" : "#64748b",
                boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all .15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate(`/engineer/order/new?project=${project.id}`)}
          style={{
            padding: "9px 16px", borderRadius: 8,
            background: "linear-gradient(135deg,#10b981,#059669)",
            color: "white", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700,
            boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          🛒 Order Material
        </button>
      </div>

      {/* ══════════ OVERVIEW TAB ══════════ */}
      {activeTab === "overview" && (
        <>
          {/* ── Construction Phases ── */}
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
                  }} className="phase-row">
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

          {/* ── Charts row: Planned vs Actual + Material Mix ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, marginBottom: 16 }} className="charts-grid">
            {/* Planned vs Actual */}
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

            {/* Material Mix donut */}
            <div style={{
              background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
              padding: "20px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Material Mix</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Spend distribution</div>
              </div>
              {pieData.length > 0 ? (
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
                        <span style={{ color: "#94a3b8" }}>{((d.value / pieTotal) * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: 40, textAlign: "center", color: "#cbd5e1", fontStyle: "italic" }}>
                  No materials consumed yet.
                </div>
              )}
            </div>
          </div>

          {/* ── Material Consumption table ── */}
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

          {/* Suppliers used */}
          {supplierBreakdown.length > 0 && (
            <div style={{
              background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
              padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Suppliers Used on This Site</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{supplierBreakdown.length} unique suppliers</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                {supplierBreakdown.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/engineer/suppliers/${s.id}`)}
                    style={{
                      padding: "12px 14px", border: "1px solid #f1f5f9", borderRadius: 10,
                      cursor: "pointer", transition: "all .15s",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 800, flexShrink: 0,
                    }}>
                      {s.shop?.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.shop?.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>
                        {s.count} orders · {fmtL(s.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order history */}
          <div style={{
            background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
            padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Order History</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>All material purchases for this site</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#4f46e5" }}>{fmtINR(orders.reduce((s, o) => s + o.total, 0))}</div>
            </div>
            {orders.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Date","Order ID","Supplier","Material","Qty","Rate","Total","Status"].map((h, i) => (
                        <th key={h} style={{
                          padding: "10px 12px",
                          textAlign: i >= 4 && i !== 7 ? "right" : "left",
                          color: "#64748b", fontWeight: 700, fontSize: 11,
                          borderBottom: "2px solid #e2e8f0",
                          letterSpacing: "0.03em", textTransform: "uppercase",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const sup = getSupplierShop(o.supplierId);
                      const status = STATUS[o.status];
                      return (
                        <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: "#475569" }}>
                            {new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </td>
                          <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>{o.id}</td>
                          <td style={{ padding: "10px 12px", color: "#0f172a", fontWeight: 600 }}>{sup?.name}</td>
                          <td style={{ padding: "10px 12px", color: "#475569" }}>{o.material}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: "#64748b" }}>{o.qty}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", color: "#64748b" }}>{fmtINR(o.rate)}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#4f46e5" }}>{fmtINR(o.total)}</td>
                          <td style={{ padding: "10px 12px" }}>
                            {status && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                                background: status.bg, color: status.color,
                              }}>{status.label}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                No orders yet for this project.
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════ ATTENDANCE TAB ══════════ */}
      {activeTab === "attendance" && (
        <>
          {/* Week navigation strip */}
          <div style={{
            background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
            padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Site Attendance Register</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Daily worker log — click a day to view or record</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setWeekOffset((w) => w - 1)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0",
                    background: "white", cursor: "pointer", fontSize: 16, display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#475569",
                  }}
                >‹</button>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", minWidth: 100, textAlign: "center" }}>
                  {(() => {
                    const wk = getWeekDates(weekOffset);
                    return `${wk[0].getDate()} ${MONTH_NAMES[wk[0].getMonth()]} – ${wk[5].getDate()} ${MONTH_NAMES[wk[5].getMonth()]}`;
                  })()}
                </span>
                <button
                  onClick={() => setWeekOffset((w) => w + 1)}
                  disabled={weekOffset >= 0}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0",
                    background: weekOffset >= 0 ? "#f8fafc" : "white",
                    cursor: weekOffset >= 0 ? "default" : "pointer",
                    fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    color: weekOffset >= 0 ? "#cbd5e1" : "#475569",
                  }}
                >›</button>
              </div>
            </div>

            {/* Day tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {weekDates.map((date) => {
                const iso = toISO(date);
                const dayRecs = getForProject(project.id, iso);
                const presentCnt = dayRecs.filter((r) => r.status === "present").length;
                const totalCnt = dayRecs.length;
                const isToday = iso === TODAY;
                const isSel = iso === selectedDate;
                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDate(iso)}
                    style={{
                      padding: "10px 6px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                      border: isSel ? "2px solid #6366f1" : "1px solid #e2e8f0",
                      background: isSel ? "#eef2ff" : isToday ? "#fafafe" : "white",
                      transition: "all .12s",
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: isSel ? "#4f46e5" : "#94a3b8", marginBottom: 2 }}>
                      {DAY_NAMES[date.getDay()].toUpperCase()}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: isSel ? "#4f46e5" : "#0f172a", lineHeight: 1.1 }}>
                      {date.getDate()}
                    </div>
                    {isToday && (
                      <div style={{ fontSize: 8, fontWeight: 800, color: "#6366f1", letterSpacing: "0.06em", marginTop: 2 }}>TODAY</div>
                    )}
                    {totalCnt > 0 ? (
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#059669" }}>{presentCnt} present</span>
                        {totalCnt - presentCnt > 0 && (
                          <span style={{ fontSize: 9, color: "#94a3b8" }}>{totalCnt - presentCnt} other</span>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: 6, fontSize: 9, color: "#cbd5e1" }}>no data</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day detail panel */}
          <div style={{
            background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
            padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            {/* Date heading + summary chips */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{fmtDate(selectedDate)}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  {attSummary.total === 0 ? "No records yet — add workers below" : `${attSummary.total} workers logged`}
                </div>
              </div>

              {attSummary.total > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "Total", val: attSummary.total, bg: "#f1f5f9", color: "#475569" },
                    { label: "Present", val: attSummary.present, bg: "#ecfdf5", color: "#059669" },
                    { label: "Absent", val: attSummary.absent, bg: "#fef2f2", color: "#dc2626" },
                    { label: "Half Day", val: attSummary.halfDay, bg: "#fffbeb", color: "#d97706" },
                    { label: "On Leave", val: attSummary.leave, bg: "#f8fafc", color: "#64748b" },
                  ].filter((c) => c.val > 0 || c.label === "Total").map((c) => (
                    <div key={c.label} style={{
                      padding: "6px 12px", borderRadius: 20,
                      background: c.bg, display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: c.color }}>{c.val}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: c.color }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Worker table */}
            {dayRecords.length > 0 ? (
              <div style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Worker","Role","Status","Check In","Check Out","Hours",""].map((h, i) => (
                        <th key={i} style={{
                          padding: "9px 10px", textAlign: "left",
                          color: "#64748b", fontWeight: 700, fontSize: 11,
                          borderBottom: "2px solid #e2e8f0",
                          letterSpacing: "0.03em", textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dayRecords.map((rec) => {
                      const hrs = computeHours(rec.checkIn, rec.checkOut);
                      const st = ATT_STATUS[rec.status] || ATT_STATUS.present;
                      const isDeleting = deleteConfirmId === rec.id;
                      return (
                        <tr key={rec.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 10px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                            {rec.workerName}
                          </td>
                          <td style={{ padding: "10px 10px" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                              background: "#f1f5f9", color: "#475569",
                            }}>{rec.role}</span>
                          </td>
                          <td style={{ padding: "10px 10px" }}>
                            <select
                              value={rec.status}
                              onChange={(e) => updateRecord(rec.id, { status: e.target.value })}
                              style={{
                                padding: "4px 8px", borderRadius: 6, border: "none",
                                background: st.bg, color: st.color,
                                fontSize: 11, fontWeight: 700, cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              <option value="present">✓ Present</option>
                              <option value="absent">✕ Absent</option>
                              <option value="half-day">◑ Half Day</option>
                              <option value="leave">○ On Leave</option>
                            </select>
                          </td>
                          <td style={{ padding: "10px 10px" }}>
                            <input
                              type="time"
                              value={rec.checkIn}
                              onChange={(e) => updateRecord(rec.id, { checkIn: e.target.value })}
                              style={{
                                padding: "4px 6px", borderRadius: 6, border: "1px solid #e2e8f0",
                                fontSize: 12, color: "#0f172a", background: "white",
                                width: 90,
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px 10px" }}>
                            <input
                              type="time"
                              value={rec.checkOut}
                              onChange={(e) => updateRecord(rec.id, { checkOut: e.target.value })}
                              style={{
                                padding: "4px 6px", borderRadius: 6, border: "1px solid #e2e8f0",
                                fontSize: 12, color: "#0f172a", background: "white",
                                width: 90,
                              }}
                            />
                          </td>
                          <td style={{ padding: "10px 10px", fontWeight: 700, color: hrs ? "#4f46e5" : "#cbd5e1", whiteSpace: "nowrap" }}>
                            {hrs || "—"}
                          </td>
                          <td style={{ padding: "10px 10px" }}>
                            {isDeleting ? (
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>Remove?</span>
                                <button
                                  onClick={() => { deleteRecord(rec.id); setDeleteConfirmId(null); }}
                                  style={{
                                    padding: "3px 8px", borderRadius: 5, border: "none",
                                    background: "#dc2626", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer",
                                  }}
                                >Yes</button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  style={{
                                    padding: "3px 8px", borderRadius: 5, border: "1px solid #e2e8f0",
                                    background: "white", color: "#64748b", fontSize: 11, cursor: "pointer",
                                  }}
                                >No</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(rec.id)}
                                title="Remove"
                                style={{
                                  width: 28, height: 28, borderRadius: 6, border: "1px solid #fee2e2",
                                  background: "#fef2f2", color: "#dc2626", cursor: "pointer",
                                  fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                              >🗑</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                padding: "32px 20px", textAlign: "center", color: "#94a3b8",
                border: "1px dashed #e2e8f0", borderRadius: 10, marginBottom: 16,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>No attendance recorded for this day</div>
                <div style={{ fontSize: 12 }}>Use the form below to add workers</div>
              </div>
            )}

            {/* Add Worker form */}
            {showAddForm ? (
              <form onSubmit={handleAddSubmit} style={{
                background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12,
                padding: "16px 18px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
                  Add Worker — {fmtDate(selectedDate)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }} className="att-form-grid">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>WORKER NAME *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramu Kumar"
                      value={addForm.workerName}
                      onChange={(e) => setAddForm((f) => ({ ...f, workerName: e.target.value }))}
                      required
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 7,
                        border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a",
                        background: "white", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>ROLE</label>
                    <select
                      value={addForm.role}
                      onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 7,
                        border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a",
                        background: "white", boxSizing: "border-box",
                      }}
                    >
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>STATUS</label>
                    <select
                      value={addForm.status}
                      onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 7,
                        border: "1px solid #e2e8f0", fontSize: 13, background: "white",
                        color: ATT_STATUS[addForm.status]?.color || "#0f172a",
                        fontWeight: 700, boxSizing: "border-box",
                      }}
                    >
                      <option value="present">✓ Present</option>
                      <option value="absent">✕ Absent</option>
                      <option value="half-day">◑ Half Day</option>
                      <option value="leave">○ On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>CHECK IN</label>
                    <input
                      type="time"
                      value={addForm.checkIn}
                      onChange={(e) => setAddForm((f) => ({ ...f, checkIn: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 7,
                        border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a",
                        background: "white", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>CHECK OUT</label>
                    <input
                      type="time"
                      value={addForm.checkOut}
                      onChange={(e) => setAddForm((f) => ({ ...f, checkOut: e.target.value }))}
                      style={{
                        width: "100%", padding: "8px 10px", borderRadius: 7,
                        border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a",
                        background: "white", boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setAddForm(EMPTY_FORM); }}
                    style={{
                      padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0",
                      background: "white", color: "#64748b", fontSize: 13, cursor: "pointer",
                    }}
                  >Cancel</button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 20px", borderRadius: 8, border: "none",
                      background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                      color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}
                  >+ Add to Register</button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 10,
                  border: "1px dashed #c7d2fe", background: "#f5f3ff",
                  color: "#4f46e5", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all .12s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.borderColor = "#818cf8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
              >
                + Add Worker for This Day
              </button>
            )}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hero-grid, .charts-grid { grid-template-columns: 1fr !important; }
          .phase-row { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .att-form-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70%  { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
      `}</style>
    </EngineerLayout>
  );
}
