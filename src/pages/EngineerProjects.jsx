import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EngineerLayout from "../components/EngineerLayout";
import { engineerProjects, getEngineerOrdersForProject } from "../data/fakeData";

function fmtL(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (n >= 1000)   return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n.toLocaleString("en-IN");
}

const TYPE_COLORS = {
  "Residential Villa":     { bg: "#eef2ff", color: "#4f46e5", border: "#c7d2fe" },
  "Commercial":            { bg: "#fdf4ff", color: "#a21caf", border: "#f5d0fe" },
  "Institutional":         { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd" },
  "Infrastructure":        { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
};

const STATUS = {
  active:    { bg: "#ecfdf5", color: "#059669", label: "● Active" },
  completed: { bg: "#f1f5f9", color: "#475569", label: "✓ Completed" },
};

function ProjectCard({ project, onClick }) {
  const orders = getEngineerOrdersForProject(project.id);
  const typeColor = TYPE_COLORS[project.type] || TYPE_COLORS["Residential Villa"];
  const status = STATUS[project.status];
  const burnPct = (project.spent / project.budget) * 100;
  const remaining = project.budget - project.spent;

  return (
    <div
      onClick={onClick}
      style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: 20, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all .2s cubic-bezier(.16,1,.3,1)",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.10)"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: project.status === "completed"
          ? "linear-gradient(90deg,#94a3b8,#cbd5e1)"
          : "linear-gradient(90deg,#6366f1,#10b981)",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 5,
              background: status.bg, color: status.color,
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>{status.label}</span>
            <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>{project.id}</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.2px" }}>{project.name}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>📍 {project.location}</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "4px 9px", borderRadius: 6,
          background: typeColor.bg, color: typeColor.color, border: `1px solid ${typeColor.border}`,
          flexShrink: 0,
        }}>
          {project.type.split(" ")[0]}
        </span>
      </div>

      {/* Phase + progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>
            <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
              {project.phase}
            </span>
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{project.progress}%</span>
        </div>
        <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${project.progress}%`,
            background: project.status === "completed" ? "#10b981" : "linear-gradient(90deg,#6366f1,#10b981)",
            borderRadius: 3, transition: "width 1s cubic-bezier(.16,1,.3,1)",
          }} />
        </div>
      </div>

      {/* Budget */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>BUDGET</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{fmtL(project.budget)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>SPENT</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#6366f1", marginTop: 2 }}>{fmtL(project.spent)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>LEFT</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", marginTop: 2 }}>{fmtL(remaining)}</div>
        </div>
      </div>

      {/* Burn bar */}
      <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${burnPct}%`,
          background: burnPct > 90 ? "#f43f5e" : burnPct > 75 ? "#f59e0b" : "#10b981",
          borderRadius: 2,
        }} />
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12,
        borderTop: "1px dashed #e2e8f0", fontSize: 11, color: "#94a3b8",
      }}>
        <span>📐 {project.area}</span>
        <span>🛒 {orders.length} orders</span>
      </div>
    </div>
  );
}

export default function EngineerProjects() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = engineerProjects.filter((p) => filter === "all" || p.status === filter);
  const totalBudget = engineerProjects.reduce((s, p) => s + p.budget, 0);
  const totalSpent  = engineerProjects.reduce((s, p) => s + p.spent, 0);
  const activeCount = engineerProjects.filter((p) => p.status === "active").length;

  const filters = [
    { id: "all",       label: "All",       count: engineerProjects.length },
    { id: "active",    label: "Active",    count: engineerProjects.filter(p => p.status === "active").length },
    { id: "completed", label: "Completed", count: engineerProjects.filter(p => p.status === "completed").length },
  ];

  return (
    <EngineerLayout title="My Projects" subtitle="All your construction sites in one place">

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "linear-gradient(135deg,#eef2ff,#fff)", border: "1px solid #c7d2fe", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Active Sites</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#4f46e5", marginTop: 4 }}>{activeCount}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#f0f9ff,#fff)", border: "1px solid #bae6fd", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Budget</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#0284c7", marginTop: 4 }}>{fmtL(totalBudget)}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#ecfdf5,#fff)", border: "1px solid #a7f3d0", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Spent</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#059669", marginTop: 4 }}>{fmtL(totalSpent)}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{((totalSpent / totalBudget) * 100).toFixed(0)}% utilized</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#fff7ed,#fff)", border: "1px solid #fed7aa", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Saved</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#ea580c", marginTop: 4 }}>{fmtL(Math.round(totalSpent * 0.084))}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>via rate comparison</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                border: filter === f.id ? "1px solid #6366f1" : "1px solid #e2e8f0",
                background: filter === f.id ? "#eef2ff" : "white",
                color: filter === f.id ? "#4f46e5" : "#64748b",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {f.label}
              <span style={{
                background: filter === f.id ? "#6366f1" : "#f1f5f9",
                color: filter === f.id ? "white" : "#94a3b8",
                fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 800,
              }}>{f.count}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => alert("Phase 2 — New Project flow not yet wired")}
          style={{
            padding: "8px 14px", borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            color: "white", border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 700,
            boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
          }}
        >+ New Project</button>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 14,
      }}>
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => navigate(`/engineer/projects/${p.id}`)} />
        ))}
      </div>
    </EngineerLayout>
  );
}
