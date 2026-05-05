import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { crushers, materials, lorries, getCurrentSupplierId } from "../data/fakeData";
import { useStock } from "../store/StockContext";

const CheckIcon = () => (
  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PurchaseEntry() {
  const navigate = useNavigate();
  const { stock, addStock } = useStock();
  const MY_ID = getCurrentSupplierId();
  const [form, setForm] = useState({ crusher: "", material: "", quantity: "", rate: "", lorry: "", invoiceNo: "", notes: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const myStock = stock[MY_ID] || {};
  const currentStockItem = form.material ? myStock[Number(form.material)] : null;
  const newStockAfter = currentStockItem && form.quantity
    ? currentStockItem.stock + Number(form.quantity)
    : null;

  function handleSubmit(e) {
    e.preventDefault();
    const matId = Number(form.material);
    const qty = Number(form.quantity);
    if (matId && qty && myStock[matId]) {
      addStock(MY_ID, matId, qty, `Purchased from ${selectedCrusher?.name || "crusher"}`);
    }
    setShowSuccess(true);
  }

  function set(k, v) {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "material") {
        const m = materials.find((m) => m.id === Number(v));
        if (m) next.rate = String(Math.round(m.defaultRate * 0.65));
      }
      return next;
    });
  }

  const total = form.quantity && form.rate ? Number(form.quantity) * Number(form.rate) : 0;
  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;
  const canSubmit = form.crusher && form.material && form.quantity && form.rate && form.lorry;
  const selectedCrusher = crushers.find((c) => c.id === Number(form.crusher));

  return (
    <Layout title="New Purchase Entry" subtitle="Record purchase from crusher" back="/dashboard">
      <form onSubmit={handleSubmit}>
        <div className="form-wrap">
          <div className="form-section">
            {/* Total payables banner */}
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>⚠ Total Crusher Payables</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#dc2626" }}>₹3,67,500</div>
            </div>

            <div className="form-section-title">Purchase Details</div>

            <div className="form-group">
              <label className="form-label">Crusher (Supplier) *</label>
              <select className="form-control" value={form.crusher} onChange={(e) => set("crusher", e.target.value)}>
                <option value="">Select crusher…</option>
                {crushers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
                ))}
              </select>
            </div>

            {selectedCrusher && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>Current Payable to {selectedCrusher.name}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#dc2626" }}>₹{selectedCrusher.balance.toLocaleString("en-IN")}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>GSTIN: {selectedCrusher.gstin}</div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Material *</label>
              <select className="form-control" value={form.material} onChange={(e) => set("material", e.target.value)}>
                <option value="">Select material…</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Loads Received *</label>
                <input className="form-control" type="number" placeholder="e.g. 10" min="1" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Rate (₹/load) *</label>
                <input className="form-control" type="number" placeholder="e.g. 1200" value={form.rate} onChange={(e) => set("rate", e.target.value)} />
              </div>
            </div>

            {total > 0 && (
              <div className="total-row" style={{ marginBottom: 14, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#15803d" }}>Purchase Amount</div>
                  <div style={{ fontSize: 11, color: "#166534", marginTop: 2 }}>+ GST 5% = ₹{gst.toLocaleString("en-IN")}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#16a34a" }}>₹{grandTotal.toLocaleString("en-IN")}</div>
              </div>
            )}

            {/* Stock impact preview */}
            {currentStockItem && form.quantity > 0 && (
              <div style={{
                background: "#eef2ff", border: "1px solid #c7d2fe",
                borderRadius: 10, padding: "12px 14px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#4338ca", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12 }}>📦</span> STOCK IMPACT
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#64748b", fontSize: 11 }}>Current</div>
                    <div style={{ fontWeight: 800, color: "#475569" }}>{currentStockItem.stock} {currentStockItem.unit}s</div>
                  </div>
                  <div style={{ color: "#10b981", fontSize: 22, fontWeight: 900 }}>→</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#64748b", fontSize: 11 }}>After Purchase</div>
                    <div style={{ fontWeight: 800, color: "#059669", fontSize: 16 }}>
                      {newStockAfter} {currentStockItem.unit}s
                      <span style={{ fontSize: 11, color: "#10b981", marginLeft: 6, fontWeight: 700 }}>+{form.quantity}</span>
                    </div>
                  </div>
                </div>
                {/* Bar */}
                <div style={{ marginTop: 10, height: 6, background: "#e0e7ff", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min((currentStockItem.stock / 400) * 100, 100)}%`,
                    background: "#94a3b8",
                  }} />
                  <div style={{
                    position: "absolute", top: 0, height: "100%",
                    left: `${Math.min((currentStockItem.stock / 400) * 100, 100)}%`,
                    width: `${Math.min(((newStockAfter - currentStockItem.stock) / 400) * 100, 100 - (currentStockItem.stock / 400) * 100)}%`,
                    background: "linear-gradient(90deg,#10b981,#34d399)",
                    transition: "width .3s",
                  }} />
                </div>
                <div style={{ fontSize: 10, color: "#6366f1", marginTop: 6, fontStyle: "italic" }}>
                  Engineers browsing your shop will see the new stock instantly.
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Lorry *</label>
              <select className="form-control" value={form.lorry} onChange={(e) => set("lorry", e.target.value)}>
                <option value="">Select lorry…</option>
                {lorries.map((l) => (
                  <option key={l.id} value={l.id}>{l.number} — {l.driver}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Crusher Invoice No. (optional)</label>
              <input className="form-control" placeholder="e.g. QRY-2026-0089" value={form.invoiceNo} onChange={(e) => set("invoiceNo", e.target.value)} />
            </div>

            <div className="form-group" style={{ paddingBottom: 6 }}>
              <label className="form-label">Notes</label>
              <input className="form-control" placeholder="Weight slip no., remarks…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-green" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5, flex: 2 }}>
              Record Purchase
            </button>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
          </div>
        </div>
      </form>

      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon"><CheckIcon /></div>
            <div className="success-title">Purchase Recorded!</div>
            <div className="success-sub">
              ₹{grandTotal.toLocaleString("en-IN")} added to payables.<br />
              {currentStockItem && (
                <span style={{ color: "#059669", fontWeight: 700 }}>
                  📦 Stock updated: +{form.quantity} {currentStockItem.unit}s of {currentStockItem.name}
                </span>
              )}
            </div>
            <button className="btn btn-primary btn-full" style={{ marginBottom: 10 }} onClick={() => { setShowSuccess(false); navigate("/dashboard"); }}>
              Go to Dashboard
            </button>
            <button className="btn btn-outline btn-full" onClick={() => { setShowSuccess(false); setForm({ crusher: "", material: "", quantity: "", rate: "", lorry: "", invoiceNo: "", notes: "" }); }}>
              New Purchase
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
