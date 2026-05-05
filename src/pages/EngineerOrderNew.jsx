import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EngineerLayout from "../components/EngineerLayout";
import {
  supplierShops, engineerProjects, materials,
} from "../data/fakeData";
import { useSupplierCatalog, useStock } from "../store/StockContext";

function fmtINR(n) { return "₹" + n.toLocaleString("en-IN"); }

const CheckIcon = () => (
  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function EngineerOrderNew() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [supplierId, setSupplierId] = useState(params.get("supplier") || "");
  const [materialId, setMaterialId] = useState(params.get("material") || "");
  const [projectId, setProjectId]   = useState("");
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const shop = useSupplierCatalog(supplierId); // live stock
  const { reduceStock } = useStock();
  const catalogItem = shop?.catalog.find((c) => c.materialId === Number(materialId));
  const rate = catalogItem?.rate || 0;
  const project = engineerProjects.find((p) => p.id === projectId);

  const subtotal = qty && rate ? Number(qty) * rate : 0;
  const cgst = Math.round(subtotal * 0.025);
  const sgst = Math.round(subtotal * 0.025);
  const grandTotal = subtotal + cgst + sgst;
  const canSubmit = supplierId && materialId && projectId && qty && Number(qty) > 0;

  /* If supplier changes, reset material */
  useEffect(() => { setMaterialId(params.get("material") || ""); }, [supplierId, params]);

  function handleSubmit(e) {
    e.preventDefault();
    const matId = Number(materialId);
    const q = Number(qty);
    if (supplierId && matId && q && shop) {
      reduceStock(supplierId, matId, q, `Engineer order from ${shop.name}`);
    }
    const id = "EORD-2026-00" + (30 + Math.floor(Math.random() * 10));
    setOrderId(id);
    setSuccess(true);
  }

  return (
    <EngineerLayout title="New Order Request" subtitle="Place a material order linked to a project" back="/engineer/suppliers">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 16, alignItems: "start" }} className="order-grid">

          {/* ── Form ── */}
          <div style={{
            background: "white", borderRadius: 16, border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            animation: "fadeUp .4s cubic-bezier(.16,1,.3,1) .1s both",
          }}>
            <div style={{ padding: "22px 22px 0" }}>

              {/* Supplier */}
              <div className="form-section-title">Step 1 — Choose Supplier</div>
              <div className="form-group">
                <label className="form-label">Supplier *</label>
                <select className="form-control" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                  <option value="">Select a supplier…</option>
                  {supplierShops.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.area} ({s.distance} km)</option>
                  ))}
                </select>
              </div>

              {shop && (
                <div style={{
                  background: "#eef2ff", border: "1px solid #c7d2fe",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 18,
                  fontSize: 12, display: "flex", justifyContent: "space-between",
                }}>
                  <span style={{ color: "#4338ca" }}>
                    ⭐ {shop.rating} · {shop.responseTime} · {shop.onTimeRate}% on-time
                  </span>
                  <span style={{ color: "#4338ca", fontWeight: 700 }}>📞 {shop.phone}</span>
                </div>
              )}

              {/* Material */}
              <div className="form-section-title" style={{ marginTop: 8 }}>Step 2 — Select Material</div>
              <div className="form-group">
                <label className="form-label">Material *</label>
                <select className="form-control" value={materialId} onChange={(e) => setMaterialId(e.target.value)} disabled={!shop}>
                  <option value="">Select material…</option>
                  {shop?.catalog.map((c) => (
                    <option key={c.materialId} value={c.materialId} disabled={!c.available}>
                      {c.name} — ₹{c.rate}/{c.unit} {c.available ? "" : "(out of stock)"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity (Loads) *</label>
                  <input className="form-control" type="number" placeholder="e.g. 10" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rate (locked)</label>
                  <input className="form-control" value={rate ? "₹" + rate.toLocaleString("en-IN") + " / " + catalogItem.unit : "—"} readOnly style={{ background: "#f8fafc", color: "#64748b" }} />
                </div>
              </div>

              {catalogItem && qty && (
                <div style={{
                  background: "#fffbeb", border: "1px solid #fde68a",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 18,
                  fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ color: "#92400e" }}>
                    📦 {qty} {catalogItem.unit}s × {fmtINR(rate)} = <strong>{fmtINR(subtotal)}</strong>
                  </span>
                  <span style={{ color: "#a16207", fontSize: 11 }}>
                    Stock: {catalogItem.stock - Number(qty || 0)} {catalogItem.unit}s left
                  </span>
                </div>
              )}

              {/* Project */}
              <div className="form-section-title" style={{ marginTop: 8 }}>Step 3 — Link to Project</div>
              <div className="form-group">
                <label className="form-label">Project / Site *</label>
                <select className="form-control" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                  <option value="">Select a project…</option>
                  {engineerProjects.filter((p) => p.status === "active").map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.phase} ({p.progress}%)</option>
                  ))}
                </select>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>
                  💡 All material costs will be tracked under this project.
                </div>
              </div>

              {project && (
                <div style={{
                  background: "#ecfdf5", border: "1px solid #a7f3d0",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 14,
                  fontSize: 12,
                }}>
                  <div style={{ color: "#059669", fontWeight: 700 }}>📍 {project.location} · {project.area}</div>
                  <div style={{ color: "#065f46", marginTop: 4 }}>
                    Currently in <strong>{project.phase}</strong> phase · {project.progress}% complete · Spent {fmtINR(project.spent)} of {fmtINR(project.budget)}
                  </div>
                </div>
              )}

              <div className="form-group" style={{ paddingBottom: 6 }}>
                <label className="form-label">Notes (optional)</label>
                <input className="form-control" placeholder="Site contact, delivery time preferences…" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <div style={{ padding: "16px 22px 22px", display: "flex", gap: 12, borderTop: "1px solid #f1f5f9" }}>
              <button type="submit" className="btn btn-primary" disabled={!canSubmit} style={{ opacity: canSubmit ? 1 : 0.5, flex: 2 }}>
                Send Order Request
              </button>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate("/engineer/suppliers")}>
                Cancel
              </button>
            </div>
          </div>

          {/* ── Live summary ── */}
          <div style={{
            background: "white", borderRadius: 16, border: "1px solid #e2e8f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            padding: 20, position: "sticky", top: 8,
            animation: "fadeUp .4s cubic-bezier(.16,1,.3,1) .2s both",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 }}>
              Order Summary
            </div>

            {/* Supplier block */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>SUPPLIER</div>
              {shop ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{shop.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>📍 {shop.area} · 🚚 {shop.distance} km</div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic" }}>Select a supplier…</div>
              )}
            </div>

            {/* Material block */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>ITEM</div>
              {catalogItem ? (
                <div style={{
                  background: "#eef2ff", border: "1px solid #c7d2fe",
                  borderRadius: 8, padding: "10px 12px",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#3730a3" }}>{catalogItem.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#4338ca" }}>
                    <span>{qty || 0} {catalogItem.unit} × {fmtINR(rate)}</span>
                    <span style={{ fontWeight: 700 }}>{fmtINR(subtotal)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic" }}>Select a material…</div>
              )}
            </div>

            {/* Project block */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>LINKED TO PROJECT</div>
              {project ? (
                <div style={{
                  background: "#ecfdf5", border: "1px solid #a7f3d0",
                  borderRadius: 8, padding: "8px 10px",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#065f46" }}>📐 {project.name}</div>
                  <div style={{ fontSize: 10, color: "#059669", marginTop: 2 }}>{project.phase} · {project.area}</div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic" }}>Choose a project…</div>
              )}
            </div>

            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>Sub-total</span>
                <span style={{ color: "#0f172a", fontWeight: 600 }}>{fmtINR(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>CGST (2.5%)</span>
                <span style={{ color: "#0f172a" }}>{fmtINR(cgst)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>SGST (2.5%)</span>
                <span style={{ color: "#0f172a" }}>{fmtINR(sgst)}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginTop: 8, paddingTop: 12, borderTop: "1px solid #e2e8f0",
                fontSize: 14, fontWeight: 800,
              }}>
                <span style={{ color: "#0f172a" }}>Grand Total</span>
                <span style={{ color: "#4f46e5", fontSize: 18 }}>{fmtINR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .order-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {success && (
        <div className="success-overlay" onClick={() => setSuccess(false)}>
          <div className="success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon"><CheckIcon /></div>
            <div className="success-title">Order Sent!</div>
            <div className="success-sub">
              {orderId} · {fmtINR(grandTotal)}<br />
              Sent to {shop?.name}. They'll confirm shortly.
            </div>
            <button className="btn btn-primary btn-full" style={{ marginBottom: 10 }} onClick={() => navigate(`/engineer/projects/${projectId}`)}>
              View Project
            </button>
            <button className="btn btn-outline btn-full" onClick={() => navigate("/engineer/orders")}>
              View All Orders
            </button>
          </div>
        </div>
      )}
    </EngineerLayout>
  );
}
