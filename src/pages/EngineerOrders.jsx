import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import EngineerLayout from "../components/EngineerLayout";
import {
  supplierShops, engineerProjects,
  getSupplierShop, getEngineerProject,
} from "../data/fakeData";
import { useOrders } from "../store/OrdersContext";

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
  rejected:     { bg: "#fef2f2", color: "#dc2626", label: "✕ Rejected" },
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#0ea5e9", "#a855f7"];

export default function EngineerOrders() {
  const navigate = useNavigate();
  const { orders: engineerOrders } = useOrders();
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return engineerOrders.filter((o) => {
      if (supplierFilter && o.supplierId !== supplierFilter) return false;
      if (projectFilter  && o.projectId  !== projectFilter)  return false;
      if (statusFilter   && o.status     !== statusFilter)   return false;
      if (search) {
        const q = search.toLowerCase();
        const sup = getSupplierShop(o.supplierId);
        if (
          !o.id.toLowerCase().includes(q) &&
          !o.material.toLowerCase().includes(q) &&
          !sup?.name.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [search, supplierFilter, projectFilter, statusFilter]);

  /* Supplier-wise spend for chart */
  const supplierSpend = supplierShops.map((s) => {
    const total = engineerOrders.filter((o) => o.supplierId === s.id).reduce((sum, o) => sum + o.total, 0);
    return { name: s.name.split(" ").slice(0, 2).join(" "), total };
  }).filter((s) => s.total > 0).sort((a, b) => b.total - a.total);

  /* Status pie */
  const statusData = ["delivered", "in-transit", "pending"].map((s) => ({
    name: s,
    value: engineerOrders.filter((o) => o.status === s).length,
    color: s === "delivered" ? "#10b981" : s === "in-transit" ? "#f59e0b" : "#0ea5e9",
  })).filter((d) => d.value > 0);

  /* Project-wise spend */
  const projectSpend = engineerProjects.map((p) => {
    const total = engineerOrders.filter((o) => o.projectId === p.id).reduce((sum, o) => sum + o.total, 0);
    return { name: p.name.split(" ").slice(0, 3).join(" "), total };
  }).filter((p) => p.total > 0).sort((a, b) => b.total - a.total);

  const totalSpend = filtered.reduce((s, o) => s + o.total, 0);
  const totalQty   = filtered.reduce((s, o) => s + o.qty, 0);

  return (
    <EngineerLayout title="Order History" subtitle="Complete record of every material purchase">

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "linear-gradient(135deg,#eef2ff,#fff)", border: "1px solid #c7d2fe", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Orders</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#4f46e5", marginTop: 4 }}>{engineerOrders.length}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>All time</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#ecfdf5,#fff)", border: "1px solid #a7f3d0", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Spend</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#059669", marginTop: 4 }}>{fmtL(engineerOrders.reduce((s, o) => s + o.total, 0))}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#fff7ed,#fff)", border: "1px solid #fed7aa", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>In Transit</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#ea580c", marginTop: 4 }}>{engineerOrders.filter(o => o.status === "in-transit").length}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Pending {engineerOrders.filter(o => o.status === "pending").length}</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#fef3c7,#fff)", border: "1px solid #fde68a", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Avg Order Size</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#d97706", marginTop: 4 }}>{fmtL(engineerOrders.reduce((s, o) => s + o.total, 0) / engineerOrders.length)}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 12, marginBottom: 16 }} className="oh-charts">
        {/* Supplier spend bars */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Spend by Supplier</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Top suppliers by total order value</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={supplierSpend} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmtL(v)} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "6px 10px", borderRadius: 6, fontSize: 11 }}>
                    <strong>{label}</strong>: {fmtINR(payload[0].value)}
                  </div>
                ) : null
              } />
              <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Order Status</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Current breakdown</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={36} outerRadius={58} paddingAngle={3} stroke="white" strokeWidth={2}>
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {statusData.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: "#475569", fontWeight: 600, textTransform: "capitalize" }}>{s.name}</span>
                  <span style={{ color: "#0f172a", fontWeight: 800 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project spend */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Spend by Project</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Material allocation</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {projectSpend.map((p, i) => {
              const max = projectSpend[0].total;
              const pct = (p.total / max) * 100;
              return (
                <div key={p.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#475569", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>{p.name}</span>
                    <span style={{ color: "#0f172a", fontWeight: 800 }}>{fmtL(p.total)}</span>
                  </div>
                  <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 3, transition: "width 1s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 14,
        padding: 14, marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10,
      }} className="filter-grid">
        <input
          className="form-control"
          placeholder="🔍 Search by ID, material, or supplier…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="form-control" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
          <option value="">All suppliers</option>
          {supplierShops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="form-control" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="">All projects</option>
          {engineerProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="delivered">Delivered</option>
          <option value="in-transit">In Transit</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Results */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Showing <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> of {engineerOrders.length} orders
          {filtered.length > 0 && <> · {totalQty} loads · <strong style={{ color: "#4f46e5" }}>{fmtINR(totalSpend)}</strong></>}
        </div>
        {(search || supplierFilter || projectFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(""); setSupplierFilter(""); setProjectFilter(""); setStatusFilter(""); }}
            style={{
              fontSize: 11, color: "#6366f1", fontWeight: 700,
              background: "none", border: "none", cursor: "pointer",
            }}
          >Clear filters</button>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Date","Order ID","Supplier","Project","Material","Qty","Total","Status"].map((h, i) => (
                  <th key={h} style={{
                    padding: "12px 14px",
                    textAlign: i >= 5 && i !== 7 ? "right" : "left",
                    color: "#64748b", fontWeight: 700, fontSize: 11,
                    borderBottom: "2px solid #e2e8f0",
                    letterSpacing: "0.03em", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const sup = getSupplierShop(o.supplierId);
                const proj = getEngineerProject(o.projectId);
                const status = STATUS[o.status];
                return (
                  <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background .15s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#475569" }}>
                      {new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>{o.id}</td>
                    <td style={{ padding: "12px 14px", color: "#0f172a", fontWeight: 600 }}>
                      <span onClick={() => navigate(`/engineer/suppliers/${o.supplierId}`)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#cbd5e1" }}>
                        {sup?.name}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#475569" }}>
                      <span onClick={() => navigate(`/engineer/projects/${o.projectId}`)} style={{ cursor: "pointer", color: "#4f46e5", fontWeight: 600 }}>
                        {proj?.name}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: "#0f172a" }}>{o.material}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", color: "#64748b" }}>{o.qty} loads</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: "#4f46e5" }}>{fmtINR(o.total)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                        background: status.bg, color: status.color,
                      }}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
            No orders match your filters.
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) { .oh-charts { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 700px) {
          .oh-charts, .filter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </EngineerLayout>
  );
}
