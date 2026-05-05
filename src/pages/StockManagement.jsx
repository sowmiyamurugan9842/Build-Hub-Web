import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Layout from "../components/Layout";
import { useStock } from "../store/StockContext";
import { supplierShops, getCurrentSupplierId } from "../data/fakeData";

function fmtINR(n) { return "₹" + n.toLocaleString("en-IN"); }
function fmtL(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (n >= 1000)   return "₹" + (n / 1000).toFixed(0) + "K";
  return "₹" + n;
}

const MOVE_COLORS = {
  in:     { bg: "#ecfdf5", color: "#059669", icon: "↓", label: "Stock In" },
  out:    { bg: "#fff7ed", color: "#ea580c", icon: "↑", label: "Stock Out" },
  adjust: { bg: "#eff6ff", color: "#2563eb", icon: "⇄", label: "Adjustment" },
};

/* ── Success popup (matches OrderEntry/PurchaseEntry style) ── */
const VARIANT_STYLES = {
  success: {
    iconBg: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    titleColor: "#059669",
    icon: (
      <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  info: {
    iconBg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    titleColor: "#4f46e5",
    icon: (
      <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    iconBg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    titleColor: "#d97706",
    icon: (
      <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
};

function SuccessPopup({ popup, onClose }) {
  if (!popup) return null;
  const v = VARIANT_STYLES[popup.variant || "success"];

  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon" style={{ background: v.iconBg }}>
          {v.icon}
        </div>
        <div className="success-title" style={{ color: v.titleColor }}>{popup.title}</div>
        <div className="success-sub">{popup.message}</div>
        <button
          className="btn btn-primary btn-full"
          onClick={onClose}
          autoFocus
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ── New material modal ── */
function NewMaterialModal({ open, onClose, onConfirm }) {
  const [form, setForm] = useState({ name: "", unit: "ton", rate: "", stock: "", capacity: "400", threshold: "50" });

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  if (!open) return null;

  const canSubmit = form.name.trim() && form.rate && form.capacity;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onConfirm({
      name: form.name.trim(),
      unit: form.unit,
      rate: Number(form.rate),
      stock: Number(form.stock) || 0,
      capacity: Number(form.capacity),
      threshold: Number(form.threshold),
    });
    setForm({ name: "", unit: "ton", rate: "", stock: "", capacity: "400", threshold: "50" });
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "fadeIn .15s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 16, padding: 24,
        maxWidth: 520, width: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        animation: "scaleIn .2s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
          Add New Material
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Add a new SKU to your catalog</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
          Engineers browsing your shop will see this material immediately.
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label className="form-label">Material Name *</label>
            <input
              className="form-control"
              autoFocus
              placeholder="e.g. Granite Chips (10mm)"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Unit *</label>
              <select className="form-control" value={form.unit} onChange={(e) => set("unit", e.target.value)}>
                <option value="ton">Ton</option>
                <option value="load">Load</option>
                <option value="cuft">Cubic Feet</option>
                <option value="bag">Bag (50kg)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Rate (₹/{form.unit}) *</label>
              <input
                className="form-control"
                type="number"
                placeholder="e.g. 2200"
                value={form.rate}
                onChange={(e) => set("rate", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Initial Stock ({form.unit}s)</label>
              <input
                className="form-control"
                type="number"
                placeholder="e.g. 100"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Capacity *</label>
              <input
                className="form-control"
                type="number"
                placeholder="e.g. 400"
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Low-stock Alert at ({form.unit}s)</label>
            <input
              className="form-control"
              type="number"
              placeholder="e.g. 50"
              value={form.threshold}
              onChange={(e) => set("threshold", e.target.value)}
              min="0"
            />
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>
              You'll see a "LOW STOCK" warning when stock drops below this number.
            </div>
          </div>

          <div style={{
            background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8,
            padding: "10px 12px", fontSize: 11, color: "#4338ca", marginBottom: 14,
          }}>
            💡 This material will become orderable by engineers as soon as you save it.
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary"
              style={{ flex: 2, opacity: canSubmit ? 1 : 0.5 }}
            >
              Add Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Stock action modal (Add / Remove / Adjust) ── */
function StockActionModal({ open, onClose, item, type, onConfirm }) {
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");

  if (!open) return null;

  const config = {
    in:     { title: "Add Stock",    label: "Quantity to add",       reasonPh: "e.g. Restock from Vel Quarry", btn: "Add Stock", color: "#059669" },
    out:    { title: "Reduce Stock", label: "Quantity sold/removed", reasonPh: "e.g. Manual delivery",         btn: "Reduce",    color: "#ea580c" },
    adjust: { title: "Adjust Stock", label: "Delta (+ or −)",        reasonPh: "e.g. Audit correction / wastage", btn: "Apply",  color: "#2563eb" },
  }[type];

  function handleSubmit(e) {
    e.preventDefault();
    const n = Number(qty);
    if (!n) return;
    onConfirm(n, reason || config.title);
    setQty(""); setReason("");
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "fadeIn .15s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 16, padding: 24,
        maxWidth: 420, width: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        animation: "scaleIn .2s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: config.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
          {config.title}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
          Current stock: <strong>{item.stock} {item.unit}s</strong>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label className="form-label">{config.label} *</label>
            <input
              className="form-control"
              type="number"
              autoFocus
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder={type === "adjust" ? "e.g. +10 or −5" : "e.g. 50"}
              {...(type === "adjust" ? {} : { min: "1" })}
            />
            {type === "adjust" && (
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>
                Use a positive number to add stock or a negative number to subtract (e.g. -3 for spillage).
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <input
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={config.reasonPh}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, background: config.color }}>
              {config.btn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Rate edit modal ── */
function RateModal({ open, onClose, item, onConfirm }) {
  const [rate, setRate] = useState(item?.rate || "");

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const n = Number(rate);
    if (!n) return;
    onConfirm(n);
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 16, padding: 24,
        maxWidth: 380, width: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        animation: "scaleIn .2s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
          Update Rate
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{item.name}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
          Current rate: <strong>{fmtINR(item.rate)} per {item.unit}</strong>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label className="form-label">New rate (₹/{item.unit}) *</label>
            <input
              className="form-control"
              type="number"
              autoFocus
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8,
            padding: "10px 12px", fontSize: 11, color: "#92400e", marginBottom: 14,
          }}>
            ⚠️ This rate will be visible immediately to all engineers browsing your shop.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              Save Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StockManagement() {
  const { stock, movements, addStock, reduceStock, adjustStock, updateRate, toggleAvailable, createMaterial } = useStock();
  const MY_ID = getCurrentSupplierId();
  const myStock = stock[MY_ID] || {};
  const myMovements = movements.filter((m) => m.supplierId === MY_ID);

  const [modalAction, setModalAction] = useState(null); // { type, item }
  const [rateModal, setRateModal]     = useState(null);
  const [newMaterialOpen, setNewMaterialOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [popup, setPopup]             = useState(null);

  function notify(title, message, variant = "success") {
    setPopup({ title, message, variant });
  }

  const items = Object.values(myStock);
  const filtered = items.filter((it) => !search || it.name.toLowerCase().includes(search.toLowerCase()));

  /* KPIs */
  const totalValue = items.reduce((s, it) => s + it.stock * it.rate, 0);
  const lowCount   = items.filter((it) => it.stock < it.threshold).length;
  const outCount   = items.filter((it) => it.stock === 0).length;
  const totalUnits = items.reduce((s, it) => s + it.stock, 0);

  /* Movement chart — last 7 movements grouped by day for chart */
  const chartData = useMemo(() => {
    const buckets = {};
    myMovements.slice(0, 30).forEach((m) => {
      const day = m.date.slice(5, 10); // MM-DD
      if (!buckets[day]) buckets[day] = { date: day, in: 0, out: 0 };
      if (m.type === "in") buckets[day].in += Math.abs(m.qty);
      if (m.type === "out") buckets[day].out += Math.abs(m.qty);
      if (m.type === "adjust" && m.qty > 0) buckets[day].in  += m.qty;
      if (m.type === "adjust" && m.qty < 0) buckets[day].out += Math.abs(m.qty);
    });
    return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
  }, [myMovements]);

  /* Top materials by value */
  const topByValue = [...items].sort((a, b) => (b.stock * b.rate) - (a.stock * a.rate)).slice(0, 5);
  const maxValue = topByValue[0] ? topByValue[0].stock * topByValue[0].rate : 1;

  return (
    <Layout title="Stock Management" subtitle="Live inventory · changes flow to engineer app instantly">

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "linear-gradient(135deg,#eef2ff,#fff)", border: "1px solid #c7d2fe", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Inventory Value</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#4f46e5", marginTop: 4 }}>{fmtL(totalValue)}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{items.length} SKUs</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#ecfdf5,#fff)", border: "1px solid #a7f3d0", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Tonnage</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#059669", marginTop: 4 }}>{totalUnits}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>tons in stock</div>
        </div>
        <div style={{ background: lowCount > 0 ? "linear-gradient(135deg,#fffbeb,#fff)" : "linear-gradient(135deg,#f8fafc,#fff)", border: `1px solid ${lowCount > 0 ? "#fde68a" : "#e2e8f0"}`, borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Low Stock</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: lowCount > 0 ? "#d97706" : "#94a3b8", marginTop: 4 }}>{lowCount}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{lowCount > 0 ? "needs restock" : "all healthy"}</div>
        </div>
        <div style={{ background: outCount > 0 ? "linear-gradient(135deg,#fff1f2,#fff)" : "linear-gradient(135deg,#f8fafc,#fff)", border: `1px solid ${outCount > 0 ? "#fecdd3" : "#e2e8f0"}`, borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Out of Stock</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: outCount > 0 ? "#e11d48" : "#94a3b8", marginTop: 4 }}>{outCount}</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{outCount > 0 ? "marked unavailable" : "none"}</div>
        </div>
      </div>

      {/* Two-col: chart + top materials */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, marginBottom: 16 }} className="stock-grid">
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px 12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Stock Movement</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Daily inflow vs outflow (tons)</div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: 8, fontSize: 11 }}>
                      <strong>2026-{label}</strong>
                      {payload.map((p) => (
                        <div key={p.name} style={{ color: p.color, fontWeight: 700, marginTop: 3 }}>
                          {p.name === "in" ? "↓ In" : "↑ Out"}: {p.value} tons
                        </div>
                      ))}
                    </div>
                  ) : null
                } />
                <Bar dataKey="in"  name="in"  fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Bar dataKey="out" name="out" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: 30, textAlign: "center", color: "#cbd5e1", fontStyle: "italic" }}>No movements yet</div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Top by Value</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Highest-value SKUs</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {topByValue.map((it) => {
              const value = it.stock * it.rate;
              const pct = (value / maxValue) * 100;
              return (
                <div key={it.materialId}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                    <span style={{ color: "#475569", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                      {it.name.replace(" (Manufactured)", "")}
                    </span>
                    <span style={{ color: "#0f172a", fontWeight: 800 }}>{fmtL(value)}</span>
                  </div>
                  <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#10b981)", borderRadius: 3, transition: "width 1s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 14, gap: 10, flexWrap: "wrap",
      }}>
        <input
          className="form-control"
          placeholder="🔍 Search materials…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360, flex: "1 1 200px" }}
        />
        <button
          onClick={() => setNewMaterialOpen(true)}
          style={{
            padding: "10px 18px", borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            color: "white", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 800,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(99,102,241,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Material
        </button>
      </div>

      {/* Inventory grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 14, marginBottom: 16,
      }}>
        {filtered.map((it) => {
          const isLow  = it.stock < it.threshold;
          const isOut  = it.stock === 0;
          const value  = it.stock * it.rate;
          const fillPct = Math.min((it.stock / it.capacity) * 100, 100);

          return (
            <div key={it.materialId} style={{
              background: "white",
              border: isOut ? "1px solid #fecdd3" : isLow ? "1px solid #fde68a" : "1px solid #e2e8f0",
              borderRadius: 14, padding: 16,
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Top accent */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: isOut ? "linear-gradient(90deg,#f43f5e,#fb7185)"
                          : isLow ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                          :         "linear-gradient(90deg,#10b981,#34d399)",
              }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>ID: M-{String(it.materialId).padStart(3, "0")}</div>
                </div>
                {isOut && <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4, background: "#fee2e2", color: "#991b1b" }}>OUT OF STOCK</span>}
                {!isOut && isLow && <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4, background: "#fef3c7", color: "#92400e" }}>LOW STOCK</span>}
                {!isLow && it.available && <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4, background: "#ecfdf5", color: "#059669" }}>● LIVE</span>}
              </div>

              {/* Stock fill bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>Capacity</span>
                  <span style={{ color: "#0f172a", fontWeight: 800 }}>
                    {it.stock} <span style={{ color: "#94a3b8", fontWeight: 500 }}>/ {it.capacity} {it.unit}s</span>
                  </span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", width: `${fillPct}%`,
                    background: isOut ? "#f43f5e" : isLow ? "#f59e0b" : "linear-gradient(90deg,#10b981,#34d399)",
                    borderRadius: 4, transition: "width 1s cubic-bezier(.16,1,.3,1)",
                  }} />
                  {/* Threshold marker */}
                  <div style={{
                    position: "absolute", top: -2, bottom: -2,
                    left: `${(it.threshold / it.capacity) * 100}%`,
                    width: 1, background: "#94a3b8",
                  }} title={`Low threshold: ${it.threshold} ${it.unit}s`} />
                </div>
              </div>

              {/* Rate + value */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                padding: "10px 0", borderTop: "1px dashed #e2e8f0", borderBottom: "1px dashed #e2e8f0",
                marginBottom: 12,
              }}>
                <div>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>RATE</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#4f46e5", marginTop: 2 }}>₹{it.rate.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>per {it.unit}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>VALUE</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#059669", marginTop: 2 }}>{fmtL(value)}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>in inventory</div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 6 }}>
                <button
                  onClick={() => setModalAction({ type: "in", item: it })}
                  style={{
                    background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
                    padding: "8px 0", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >+ Add</button>
                <button
                  onClick={() => setModalAction({ type: "out", item: it })}
                  disabled={it.stock === 0}
                  style={{
                    background: it.stock === 0 ? "#f1f5f9" : "#fff7ed",
                    color: it.stock === 0 ? "#cbd5e1" : "#ea580c",
                    border: it.stock === 0 ? "1px solid #e2e8f0" : "1px solid #fed7aa",
                    padding: "8px 0", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    cursor: it.stock === 0 ? "not-allowed" : "pointer",
                  }}
                >− Remove</button>
                <button
                  onClick={() => setModalAction({ type: "adjust", item: it })}
                  style={{
                    background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe",
                    padding: "8px 0", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >⇄ Adjust</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <button
                  onClick={() => setRateModal(it)}
                  style={{
                    background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0",
                    padding: "7px 0", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >Edit Rate</button>
                <button
                  onClick={() => {
                    toggleAvailable(MY_ID, it.materialId);
                    notify(
                      it.available ? "Hidden from shop" : "Visible in shop",
                      `${it.name} is now ${it.available ? "hidden from" : "visible in"} the engineer-side catalog.`,
                      it.available ? "warning" : "success",
                    );
                  }}
                  style={{
                    background: it.available ? "#fff1f2" : "#ecfdf5",
                    color: it.available ? "#e11d48" : "#059669",
                    border: it.available ? "1px solid #fecdd3" : "1px solid #a7f3d0",
                    padding: "7px 0", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    cursor: "pointer",
                  }}
                >{it.available ? "Hide from Shop" : "Show in Shop"}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movement log */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Stock Movement Log</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{myMovements.length} entries · most recent first</div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Date","ID","Type","Material","Qty","Reason"].map((h) => (
                  <th key={h} style={{
                    padding: "10px 12px", textAlign: h === "Qty" ? "right" : "left",
                    color: "#64748b", fontWeight: 700, fontSize: 11,
                    borderBottom: "2px solid #e2e8f0",
                    letterSpacing: "0.03em", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myMovements.slice(0, 12).map((m) => {
                const meta = MOVE_COLORS[m.type];
                const matName = myStock[m.materialId]?.name || "—";
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 12px", color: "#475569", fontWeight: 600 }}>{m.date.slice(5)}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>{m.id}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5,
                        background: meta.bg, color: meta.color,
                      }}>{meta.icon} {meta.label}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#0f172a", fontWeight: 600 }}>{matName}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: meta.color }}>
                      {m.type === "out" ? "−" : m.qty > 0 ? "+" : ""}{Math.abs(m.qty)} tons
                    </td>
                    <td style={{ padding: "10px 12px", color: "#64748b", fontStyle: "italic" }}>{m.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success popup */}
      <SuccessPopup popup={popup} onClose={() => setPopup(null)} />

      {/* Modals */}
      <StockActionModal
        open={!!modalAction}
        item={modalAction?.item || {}}
        type={modalAction?.type}
        onClose={() => setModalAction(null)}
        onConfirm={(qty, reason) => {
          const item = modalAction.item;
          const q = Math.abs(qty);
          if (modalAction.type === "in") {
            addStock(MY_ID, item.materialId, q, reason);
            notify(
              "Stock added",
              `+${q} ${item.unit}s added to ${item.name}. New total: ${item.stock + q} ${item.unit}s.`,
              "success",
            );
          }
          if (modalAction.type === "out") {
            reduceStock(MY_ID, item.materialId, q, reason);
            notify(
              "Stock reduced",
              `−${q} ${item.unit}s removed from ${item.name}. New total: ${Math.max(0, item.stock - q)} ${item.unit}s.`,
              "info",
            );
          }
          if (modalAction.type === "adjust") {
            adjustStock(MY_ID, item.materialId, qty, reason);
            const sign = qty > 0 ? "+" : "−";
            notify(
              "Stock adjusted",
              `${sign}${Math.abs(qty)} ${item.unit}s ${qty > 0 ? "added to" : "removed from"} ${item.name}. New total: ${Math.max(0, item.stock + qty)} ${item.unit}s.`,
              qty >= 0 ? "success" : "info",
            );
          }
        }}
      />
      <RateModal
        open={!!rateModal}
        item={rateModal || {}}
        onClose={() => setRateModal(null)}
        onConfirm={(rate) => {
          const oldRate = rateModal.rate;
          updateRate(MY_ID, rateModal.materialId, rate);
          const diff = rate - oldRate;
          const pct = ((diff / oldRate) * 100).toFixed(1);
          notify(
            "Rate updated",
            `${rateModal.name} is now ₹${rate.toLocaleString("en-IN")}/${rateModal.unit} (${diff > 0 ? "+" : ""}${pct}%). Engineers see this immediately.`,
            "success",
          );
        }}
      />
      <NewMaterialModal
        open={newMaterialOpen}
        onClose={() => setNewMaterialOpen(false)}
        onConfirm={(data) => {
          createMaterial(MY_ID, data);
          notify(
            "Material added",
            `${data.name} (${data.stock} ${data.unit}s @ ₹${data.rate}/${data.unit}) is now live in your shop. Engineers can order it immediately.`,
            "success",
          );
        }}
      />

      <style>{`
        @media (max-width: 900px) {
          .stock-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
