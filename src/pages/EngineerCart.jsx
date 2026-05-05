import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EngineerLayout from "../components/EngineerLayout";
import { useCart } from "../store/CartContext";
import { useStock } from "../store/StockContext";
import { useOrders } from "../store/OrdersContext";
import { engineerProjects, supplierShops } from "../data/fakeData";

function fmtINR(n) { return "₹" + Number(n).toLocaleString("en-IN"); }

const CartIcon = () => (
  <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const TrashIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const CheckIcon = () => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function EngineerCart() {
  const navigate = useNavigate();
  const { items, itemsBySupplier, totalItems, totalValue, supplierCount, linkedProject, setLinkedProject, updateQty, removeItem, clearCart } = useCart();
  const { stock, reduceStock } = useStock();
  const { addOrders } = useOrders();
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);

  const cgst = Math.round(totalValue * 0.025);
  const sgst = Math.round(totalValue * 0.025);
  const grandTotal = totalValue + cgst + sgst;

  function handleSubmit() {
    if (!linkedProject || items.length === 0) return;

    const project = engineerProjects.find((p) => p.id === linkedProject);
    const newOrders = [];

    Object.entries(itemsBySupplier).forEach(([supplierId, group]) => {
      group.items.forEach((item) => {
        /* Reduce live stock */
        const shopStock = stock[supplierId];
        if (shopStock && shopStock[item.materialId]) {
          reduceStock(supplierId, item.materialId, item.qty, `Sold to ${project?.name || "engineer"}`);
        }
        /* Create order record */
        const orderId = "EORD-2026-" + String(Math.floor(Math.random() * 9000) + 1000);
        const order = {
          id: orderId,
          date: new Date().toISOString().slice(0, 10),
          supplierId,
          projectId: linkedProject,
          material: item.name,
          materialId: item.materialId,
          qty: item.qty,
          rate: item.rate,
          total: item.qty * item.rate,
          status: "pending",
        };
        newOrders.push({ ...order, supplierName: item.supplierName });
      });
    });

    addOrders(newOrders.map(({ supplierName: _s, ...o }) => o)); // strip UI-only field before persisting
    setPlacedOrders(newOrders);
    setShowSuccess(true);
    clearCart();
  }

  /* ── Empty state ── */
  if (items.length === 0 && !showSuccess) {
    return (
      <EngineerLayout title="My Cart" subtitle="Items from multiple shops" back="/engineer/suppliers">
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: 360, gap: 16, color: "#94a3b8", textAlign: "center",
        }}>
          <CartIcon />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>Your cart is empty</div>
            <div style={{ fontSize: 13 }}>Browse suppliers and add materials to get started</div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/engineer/suppliers")}
            style={{ marginTop: 8 }}
          >
            Browse Suppliers
          </button>
        </div>
      </EngineerLayout>
    );
  }

  return (
    <EngineerLayout title="My Cart" subtitle={`${totalItems} items from ${supplierCount} supplier${supplierCount !== 1 ? "s" : ""}`} back="/engineer/suppliers">

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }} className="cart-grid">

        {/* ── Left: grouped items ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.entries(itemsBySupplier).map(([supplierId, group]) => {
            const shop = supplierShops.find((s) => s.id === supplierId);
            const groupTotal = group.items.reduce((s, i) => s + i.qty * i.rate, 0);
            return (
              <div key={supplierId} style={{
                background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden",
              }}>
                {/* Supplier header */}
                <div style={{
                  padding: "12px 18px", background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, color: "white",
                    }}>
                      🏪
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{group.supplierName}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {shop?.area}, {shop?.city} · {group.items.length} item{group.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#4f46e5" }}>{fmtINR(groupTotal)}</div>
                </div>

                {/* Items */}
                <div style={{ padding: "8px 0" }}>
                  {group.items.map((item) => {
                    const lineTotal = item.qty * item.rate;
                    const availableStock = stock[supplierId]?.[item.materialId]?.stock ?? item.stock;
                    const isOverStock = item.qty > availableStock;

                    return (
                      <div key={item.materialId} style={{
                        display: "grid", gridTemplateColumns: "1fr auto auto",
                        gap: 12, alignItems: "center",
                        padding: "12px 18px",
                        borderBottom: "1px solid #f8fafc",
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                            {fmtINR(item.rate)}/{item.unit}
                            {isOverStock && (
                              <span style={{ color: "#e11d48", fontWeight: 700, marginLeft: 8 }}>
                                ⚠ Only {availableStock} in stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Qty stepper */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button
                            onClick={() => updateQty(supplierId, item.materialId, item.qty - 1)}
                            style={{
                              width: 28, height: 28, borderRadius: 6,
                              border: "1px solid #e2e8f0", background: "white",
                              cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#64748b",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >−</button>
                          <input
                            type="number"
                            min={1}
                            max={availableStock}
                            value={item.qty}
                            onChange={(e) => updateQty(supplierId, item.materialId, e.target.value)}
                            style={{
                              width: 50, textAlign: "center",
                              border: isOverStock ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                              borderRadius: 6, padding: "4px 6px",
                              fontSize: 13, fontWeight: 700, color: "#0f172a",
                            }}
                          />
                          <button
                            onClick={() => updateQty(supplierId, item.materialId, item.qty + 1)}
                            style={{
                              width: 28, height: 28, borderRadius: 6,
                              border: "1px solid #e2e8f0", background: "white",
                              cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#64748b",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >+</button>
                        </div>

                        {/* Line total + remove */}
                        <div style={{ textAlign: "right", minWidth: 80 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{fmtINR(lineTotal)}</div>
                          <button
                            onClick={() => removeItem(supplierId, item.materialId)}
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: "#ef4444", marginTop: 4, padding: "2px 4px",
                              display: "inline-flex", alignItems: "center", gap: 3,
                              fontSize: 11,
                            }}
                          >
                            <TrashIcon /> Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Clear cart */}
          {items.length > 0 && (
            <button
              onClick={clearCart}
              style={{
                background: "none", border: "1px solid #fecaca", color: "#ef4444",
                padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                fontSize: 12, fontWeight: 600, alignSelf: "flex-start",
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* ── Right: summary + project linker ── */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          position: "sticky", top: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>
            Order Summary
          </div>

          {/* Supplier breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: "1px dashed #e2e8f0" }}>
            {Object.entries(itemsBySupplier).map(([supplierId, group]) => (
              <div key={supplierId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                <span style={{ color: "#0f172a", fontWeight: 600 }}>{group.supplierName}</span>
                <span>{fmtINR(group.items.reduce((s, i) => s + i.qty * i.rate, 0))}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
              <span>Subtotal</span>
              <span style={{ color: "#0f172a", fontWeight: 600 }}>{fmtINR(totalValue)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
              <span>CGST (2.5%)</span>
              <span>{fmtINR(cgst)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
              <span>SGST (2.5%)</span>
              <span>{fmtINR(sgst)}</span>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 8, paddingTop: 12, borderTop: "1px solid #e2e8f0",
              fontSize: 15, fontWeight: 800,
            }}>
              <span style={{ color: "#0f172a" }}>Grand Total</span>
              <span style={{ color: "#4f46e5", fontSize: 20 }}>{fmtINR(grandTotal)}</span>
            </div>
          </div>

          {/* Project linker */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", display: "block", marginBottom: 6 }}>
              Link to Project *
            </label>
            <select
              className="form-control"
              value={linkedProject}
              onChange={(e) => setLinkedProject(e.target.value)}
              style={{ fontSize: 13 }}
            >
              <option value="">Select project…</option>
              {engineerProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.location}</option>
              ))}
            </select>
            {!linkedProject && (
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                You must link this order to a project
              </div>
            )}
          </div>

          {/* Multi-supplier info */}
          {supplierCount > 1 && (
            <div style={{
              background: "#eef2ff", border: "1px solid #c7d2fe",
              borderRadius: 8, padding: "10px 12px", marginBottom: 16,
              fontSize: 11, color: "#4338ca", fontWeight: 600, lineHeight: 1.5,
            }}>
              🚀 This order will go to <strong>{supplierCount} suppliers</strong> simultaneously, reducing stock at each shop instantly.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!linkedProject || items.length === 0}
            style={{
              width: "100%",
              background: linkedProject && items.length > 0
                ? "linear-gradient(135deg,#6366f1,#4f46e5)"
                : "#e2e8f0",
              color: linkedProject && items.length > 0 ? "white" : "#94a3b8",
              border: "none", padding: "12px 16px", borderRadius: 10,
              fontSize: 14, fontWeight: 800, cursor: linkedProject && items.length > 0 ? "pointer" : "not-allowed",
              boxShadow: linkedProject && items.length > 0 ? "0 4px 12px rgba(99,102,241,0.35)" : "none",
              transition: "all .2s",
            }}
          >
            Place {supplierCount > 1 ? `${supplierCount} Orders` : "Order"} · {fmtINR(grandTotal)}
          </button>
          <button
            onClick={() => navigate("/engineer/suppliers")}
            style={{
              width: "100%", marginTop: 8,
              background: "none", border: "1px solid #e2e8f0",
              color: "#64748b", padding: "10px 16px", borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            + Add More Items
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Success overlay ── */}
      {showSuccess && (
        <div className="success-overlay" onClick={() => { setShowSuccess(false); navigate("/engineer/orders"); }}>
          <div className="success-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="success-icon"><CheckIcon /></div>
            <div className="success-title">Orders Placed!</div>
            <div className="success-sub" style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                {placedOrders.length} order{placedOrders.length !== 1 ? "s" : ""} sent to {new Set(placedOrders.map((o) => o.supplierId)).size} supplier{new Set(placedOrders.map((o) => o.supplierId)).size !== 1 ? "s" : ""}.
                Total: <strong style={{ color: "#4f46e5" }}>{fmtINR(placedOrders.reduce((s, o) => s + o.total, 0))}</strong>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {placedOrders.map((o) => (
                  <div key={o.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", background: "#f8fafc", borderRadius: 8,
                    border: "1px solid #e2e8f0", fontSize: 12,
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{o.material}</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>{o.supplierName} · {o.qty} {o.qty === 1 ? "load" : "loads"}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: "#4f46e5" }}>{fmtINR(o.total)}</div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: 16, marginBottom: 10 }}
              onClick={() => { setShowSuccess(false); navigate("/engineer/orders"); }}
            >
              View Order History
            </button>
            <button
              className="btn btn-outline btn-full"
              onClick={() => { setShowSuccess(false); navigate("/engineer/suppliers"); }}
            >
              Shop More
            </button>
          </div>
        </div>
      )}
    </EngineerLayout>
  );
}
