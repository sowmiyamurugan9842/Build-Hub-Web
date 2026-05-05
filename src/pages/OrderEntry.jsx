import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { materials, lorries, getCurrentSupplierId } from "../data/fakeData";
import { useStock } from "../store/StockContext";
import { useCustomers } from "../store/CustomerContext";

const CheckIcon = () => (
  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function OrderEntry() {
  const navigate = useNavigate();
  const { stock, reduceStock } = useStock();
  const { customers } = useCustomers();
  const MY_ID = getCurrentSupplierId();
  const [form, setForm] = useState({ customer: "", material: "", quantity: "", rate: "", lorry: "", notes: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

  const myStock = stock[MY_ID] || {};
  const currentStockItem = form.material ? myStock[Number(form.material)] : null;
  const stockAvailable = currentStockItem?.stock || 0;
  const insufficientStock = currentStockItem && form.quantity && Number(form.quantity) > stockAvailable;
  const stockAfter = currentStockItem && form.quantity
    ? Math.max(0, stockAvailable - Number(form.quantity))
    : null;

  function set(k, v) {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "material") {
        const m = materials.find((m) => m.id === Number(v));
        if (m) next.rate = String(m.defaultRate);
      }
      return next;
    });
  }

  const total = form.quantity && form.rate ? Number(form.quantity) * Number(form.rate) : 0;
  const cgst = Math.round(total * 0.025);
  const sgst = Math.round(total * 0.025);
  const grandTotal = total + cgst + sgst;
  const canSubmit = form.customer && form.material && form.quantity && form.rate && form.lorry && !insufficientStock;

  function handleSubmit(e) {
    e.preventDefault();
    const matId = Number(form.material);
    const qty = Number(form.quantity);
    if (matId && qty && myStock[matId]) {
      const customerName = customers.find((c) => c.id === Number(form.customer))?.name;
      reduceStock(MY_ID, matId, qty, `Sold to ${customerName || "customer"}`);
    }
    const id = "INV-2026-0" + (143 + Math.floor(Math.random() * 10));
    setInvoiceId(id);
    setShowSuccess(true);
  }

  const selectedLorry = lorries.find((l) => l.id === Number(form.lorry));
  const selectedCustomer = customers.find((c) => c.id === Number(form.customer));
  const selectedMaterial = materials.find((m) => m.id === Number(form.material));

  return (
    <Layout title="New Sale Order" subtitle="Record a delivery to customer" back="/dashboard">
      <form onSubmit={handleSubmit}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 340px",
          gap: 16,
          alignItems: "start",
        }} className="order-grid">
          {/* ── Left: form ── */}
          <div style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            animation: "fadeUp .4s cubic-bezier(.16,1,.3,1) .1s both",
          }}>
            <div style={{ padding: "22px 22px 0" }}>
              <div className="form-section-title">Order Details</div>

              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select className="form-control" value={form.customer} onChange={(e) => set("customer", e.target.value)}>
                  <option value="">Select customer…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
                  ))}
                </select>
              </div>

              {selectedCustomer && selectedCustomer.balance > 0 && (
                <div style={{
                  background: "#fff1f2", border: "1px solid #fecdd3",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 14,
                  fontSize: 13, display: "flex", gap: 8, alignItems: "center",
                }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div>
                    Outstanding balance: <strong style={{ color: "#e11d48" }}>₹{selectedCustomer.balance.toLocaleString("en-IN")}</strong>
                  </div>
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
                  <label className="form-label">Quantity (Loads) *</label>
                  <input className="form-control" type="number" placeholder="e.g. 5" min="1" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rate (₹/load) *</label>
                  <input className="form-control" type="number" placeholder="e.g. 2300" value={form.rate} onChange={(e) => set("rate", e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Lorry *</label>
                <select className="form-control" value={form.lorry} onChange={(e) => set("lorry", e.target.value)}>
                  <option value="">Select lorry…</option>
                  {lorries.map((l) => (
                    <option key={l.id} value={l.id}>{l.number} — {l.driver} ({l.capacity})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ paddingBottom: 6 }}>
                <label className="form-label">Notes (optional)</label>
                <input className="form-control" placeholder="Site name, delivery instructions…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
            </div>

            <div style={{ padding: "16px 22px 22px", display: "flex", gap: 12, borderTop: "1px solid #f1f5f9" }}>
              <button type="submit" className="btn btn-primary" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5, flex: 2 }}>
                Save & Generate Invoice
              </button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
            </div>
          </div>

          {/* ── Right: live summary ── */}
          <div style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: 20,
            position: "sticky", top: 8,
            animation: "fadeUp .4s cubic-bezier(.16,1,.3,1) .2s both",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>
              Order Summary
            </div>

            {/* Customer block */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>BILL TO</div>
              {selectedCustomer ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{selectedCustomer.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{selectedCustomer.city} · {selectedCustomer.phone}</div>
                  {selectedCustomer.gstin && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontFamily: "monospace" }}>{selectedCustomer.gstin}</div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic" }}>Select a customer…</div>
              )}
            </div>

            {/* Item block */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>ITEM</div>
              {selectedMaterial ? (
                <div style={{
                  background: "#eef2ff", border: "1px solid #c7d2fe",
                  borderRadius: 8, padding: "10px 12px",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#3730a3" }}>{selectedMaterial.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#4338ca" }}>
                    <span>{form.quantity || 0} loads × ₹{Number(form.rate || 0).toLocaleString("en-IN")}</span>
                    <span style={{ fontWeight: 700 }}>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  {currentStockItem && (
                    <div style={{
                      marginTop: 8, paddingTop: 8, borderTop: "1px dashed #c7d2fe",
                      display: "flex", justifyContent: "space-between", fontSize: 11,
                    }}>
                      <span style={{ color: "#6366f1" }}>📦 In stock:</span>
                      <span style={{
                        color: insufficientStock ? "#e11d48" : "#059669",
                        fontWeight: 700,
                      }}>
                        {stockAvailable} {currentStockItem.unit}s
                        {form.quantity > 0 && (
                          <> → {stockAfter} after sale</>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic" }}>Select a material…</div>
              )}
              {insufficientStock && (
                <div style={{
                  marginTop: 8, padding: "8px 12px",
                  background: "#fff1f2", border: "1px solid #fecdd3",
                  borderRadius: 8, fontSize: 11, color: "#e11d48", fontWeight: 600,
                }}>
                  ⚠ Insufficient stock — only {stockAvailable} {currentStockItem.unit}s available
                </div>
              )}
            </div>

            {/* Lorry block */}
            {selectedLorry && (
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>DELIVERY</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🚛</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{selectedLorry.number}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{selectedLorry.driver} · {selectedLorry.capacity}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>Sub-total</span>
                <span style={{ color: "#0f172a", fontWeight: 600 }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>CGST (2.5%)</span>
                <span style={{ color: "#0f172a" }}>₹{cgst.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>SGST (2.5%)</span>
                <span style={{ color: "#0f172a" }}>₹{sgst.toLocaleString("en-IN")}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginTop: 8, paddingTop: 12, borderTop: "1px solid #e2e8f0",
                fontSize: 14, fontWeight: 800,
              }}>
                <span style={{ color: "#0f172a" }}>Grand Total</span>
                <span style={{ color: "#4f46e5", fontSize: 18 }}>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Mobile collapse */}
      <style>{`
        @media (max-width: 900px) {
          .order-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon"><CheckIcon /></div>
            <div className="success-title">Order Saved!</div>
            <div className="success-sub">
              {invoiceId} created.<br />
              Delivery recorded for {selectedCustomer?.name}.
            </div>
            <button className="btn btn-primary btn-full" style={{ marginBottom: 10 }} onClick={() => { setShowSuccess(false); navigate(`/invoice/${invoiceId}`); }}>
              View Invoice
            </button>
            <button className="btn btn-outline btn-full" onClick={() => { setShowSuccess(false); setForm({ customer: "", material: "", quantity: "", rate: "", lorry: "", notes: "" }); }}>
              New Order
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
