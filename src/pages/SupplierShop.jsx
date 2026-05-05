import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EngineerLayout from "../components/EngineerLayout";
import {
  getEngineerOrdersForSupplier,
  engineerProjects, supplierShops, getCategory,
} from "../data/fakeData";
import { useSupplierCatalog } from "../store/StockContext";
import { useCart } from "../store/CartContext";

function fmtINR(n) { return "₹" + n.toLocaleString("en-IN"); }

function StarRating({ value, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(value) ? "#fbbf24" : "#e2e8f0", fontSize: size }}>★</span>
      ))}
    </span>
  );
}

export default function SupplierShop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = useSupplierCatalog(id);
  const { addToCart, items } = useCart();
  const [addedIds, setAddedIds] = useState({}); // materialId → true for flash animation

  function handleAddToCart(item) {
    addToCart({
      supplierId: shop.id,
      supplierName: shop.name,
      materialId: item.materialId,
      name: item.name,
      unit: item.unit,
      qty: 1,
      rate: item.rate,
      stock: item.stock,
    });
    setAddedIds((prev) => ({ ...prev, [item.materialId]: true }));
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [item.materialId]: false })), 1500);
  }

  function cartQtyFor(materialId) {
    return items.find((i) => i.supplierId === id && i.materialId === materialId)?.qty || 0;
  }

  if (!shop) {
    return (
      <EngineerLayout title="Shop not found" back="/engineer/suppliers">
        <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
          Supplier {id} not found.
        </div>
      </EngineerLayout>
    );
  }

  const pastOrders = getEngineerOrdersForSupplier(shop.id);
  const totalSpent = pastOrders.reduce((s, o) => s + o.total, 0);
  const cat = getCategory(shop.category);

  /* Compare rates with other shops in same city */
  function getMarketAvg(materialId) {
    const rates = supplierShops
      .filter((s) => s.city === shop.city && s.id !== shop.id)
      .map((s) => s.catalog.find((c) => c.materialId === materialId)?.rate)
      .filter(Boolean);
    if (rates.length === 0) return null;
    return rates.reduce((s, r) => s + r, 0) / rates.length;
  }

  return (
    <EngineerLayout title={shop.name} subtitle={`${shop.area}, ${shop.city}`} back="/engineer/suppliers">

      {/* ── Header card ── */}
      <div style={{
        background: "linear-gradient(135deg,#312e81 0%,#4f46e5 50%,#6366f1 100%)",
        borderRadius: 16, padding: "22px 24px", marginBottom: 16, color: "white",
        boxShadow: "0 8px 24px rgba(79,70,229,0.25)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center" }} className="shop-hero">
          <div style={{
            width: 80, height: 80, borderRadius: 16,
            background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 42, fontWeight: 900, border: "1px solid rgba(255,255,255,0.3)",
          }}>
            {cat?.icon || shop.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              {cat && (
                <span style={{
                  background: "rgba(255,255,255,0.22)", color: "white",
                  fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 5,
                  border: "1px solid rgba(255,255,255,0.35)",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <span>{cat.icon}</span> {cat.name}
                </span>
              )}
              {shop.verified && (
                <span style={{
                  background: "rgba(16,185,129,0.25)", color: "#86efac",
                  fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 5,
                  border: "1px solid rgba(134,239,172,0.4)",
                }}>✓ Verified</span>
              )}
              <span style={{ fontSize: 11, opacity: 0.8 }}>👤 {shop.owner} · 📞 {shop.phone}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>{shop.name}</div>
            {shop.tagline && (
              <div style={{ fontSize: 13, opacity: 0.95, marginTop: 6, fontStyle: "italic", color: "#fde68a" }}>
                "{shop.tagline}"
              </div>
            )}
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>📍 {shop.area} · 🚚 {shop.distance} km · Delivery up to {shop.deliveryRadius} km{shop.established ? ` · Est. ${shop.established}` : ""}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <StarRating value={shop.rating} />
                <span style={{ fontWeight: 800 }}>{shop.rating}</span>
                <span style={{ opacity: 0.7, fontSize: 12 }}>({shop.reviewCount} reviews)</span>
              </div>
              <span style={{ fontSize: 12, opacity: 0.85 }}>⏱ {shop.responseTime} response</span>
              <span style={{ fontSize: 12, opacity: 0.85 }}>📦 {shop.onTimeRate}% on-time</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>YOUR HISTORY</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{pastOrders.length}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>past orders</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8, color: "#86efac" }}>
              {fmtINR(totalSpent)}
            </div>
          </div>
        </div>
      </div>

      {/* ── About + Certifications ── */}
      {(shop.about || shop.certifications?.length > 0) && (
        <div style={{
          display: "grid",
          gridTemplateColumns: shop.certifications?.length ? "2fr 1fr" : "1fr",
          gap: 12, marginBottom: 16,
        }} className="shop-info-grid">
          {shop.about && (
            <div style={{
              background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
              padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{cat?.icon}</span>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>About {shop.name}</div>
              </div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                {shop.about}
              </div>
            </div>
          )}
          {shop.certifications?.length > 0 && (
            <div style={{
              background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
              padding: "18px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                🛡️ Certifications
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {shop.certifications.map((c) => (
                  <div key={c} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 10px", background: "#ecfdf5", border: "1px solid #a7f3d0",
                    borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#047857",
                  }}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Featured Picks ── */}
      {shop.featuredIds?.length > 0 && (() => {
        const featured = shop.featuredIds
          .map((id) => shop.catalog.find((c) => c.materialId === id))
          .filter((x) => x && x.available);
        if (featured.length === 0) return null;
        return (
          <div style={{
            background: "linear-gradient(135deg,#fef3c7,#fffbeb)",
            border: "1px solid #fde68a", borderRadius: 16,
            padding: "16px 18px", marginBottom: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>⭐</span>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#92400e", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Featured by {shop.owner}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              {featured.map((item) => (
                <div
                  key={item.materialId}
                  style={{
                    background: "white", border: "1px solid #fde68a",
                    borderRadius: 10, padding: "10px 12px",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 14px rgba(245,158,11,0.25)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{item.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#92400e" }}>₹{item.rate.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 10, color: "#a16207" }}>per {item.unit} · {item.stock} in stock</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      width: "100%", marginTop: 8,
                      background: addedIds[item.materialId] ? "#059669" : "#92400e",
                      color: "white", border: "none",
                      padding: "6px 10px", borderRadius: 7,
                      fontSize: 11, fontWeight: 700, cursor: "pointer",
                      transition: "background .2s",
                    }}
                  >
                    {addedIds[item.materialId] ? "✓ Added!" : cartQtyFor(item.materialId) > 0 ? `🛒 In Cart (${cartQtyFor(item.materialId)})` : "+ Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Material catalog ── */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Material Catalog</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Live rates · GST extra · Delivery included</div>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{shop.catalog.length} items</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {shop.catalog.map((item) => {
            const marketAvg = getMarketAvg(item.materialId);
            const savings = marketAvg ? marketAvg - item.rate : 0;
            const savingsPct = marketAvg ? ((savings / marketAvg) * 100).toFixed(1) : 0;

            return (
              <div
                key={item.materialId}
                style={{
                  border: item.available ? "1px solid #e2e8f0" : "1px solid #fecaca",
                  borderRadius: 12,
                  padding: 14,
                  background: item.available ? "white" : "#fef2f2",
                  position: "relative",
                  opacity: item.available ? 1 : 0.7,
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => { if (item.available) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#c7d2fe"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = item.available ? "#e2e8f0" : "#fecaca"; }}
              >
                {/* Badge top-right */}
                {savings > 0 && item.available && (
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
                    fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                  }}>↓ {savingsPct}%</span>
                )}
                {!item.available && (
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "#fee2e2", color: "#991b1b",
                    fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                  }}>OUT OF STOCK</span>
                )}

                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginRight: 60 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {item.available ? `📦 Stock: ${item.stock} ${item.unit}s` : "Currently unavailable"}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#4f46e5" }}>{fmtINR(item.rate)}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>/{item.unit}</span>
                </div>
                {marketAvg && (
                  <div style={{ fontSize: 10, color: savings > 0 ? "#059669" : "#94a3b8", marginTop: 2 }}>
                    Market avg: {fmtINR(Math.round(marketAvg))} {savings > 0 ? `(save ${fmtINR(Math.round(savings))})` : ""}
                  </div>
                )}

                {item.available ? (
                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        flex: 1,
                        background: addedIds[item.materialId]
                          ? "linear-gradient(135deg,#059669,#10b981)"
                          : cartQtyFor(item.materialId) > 0
                          ? "linear-gradient(135deg,#6366f1,#4f46e5)"
                          : "linear-gradient(135deg,#6366f1,#4f46e5)",
                        color: "white", border: "none",
                        padding: "8px 10px", borderRadius: 8,
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
                        transition: "all .2s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      }}
                    >
                      {addedIds[item.materialId] ? (
                        <>✓ Added!</>
                      ) : cartQtyFor(item.materialId) > 0 ? (
                        <>🛒 In Cart ({cartQtyFor(item.materialId)})</>
                      ) : (
                        <>+ Add to Cart</>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    style={{
                      width: "100%", marginTop: 12,
                      background: "#e2e8f0", color: "#94a3b8",
                      border: "none", padding: "8px 12px", borderRadius: 8,
                      fontSize: 12, fontWeight: 700, cursor: "not-allowed",
                    }}
                  >
                    Notify When Available
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Past orders with this shop ── */}
      {pastOrders.length > 0 && (
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
          padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Your Past Orders</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{pastOrders.length} orders · {fmtINR(totalSpent)} total</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pastOrders.slice(0, 5).map((o) => {
              const proj = engineerProjects.find((p) => p.id === o.projectId);
              return (
                <div key={o.id} style={{
                  display: "grid", gridTemplateColumns: "90px 1fr 100px 100px", gap: 12,
                  alignItems: "center", padding: "10px 14px",
                  border: "1px solid #f1f5f9", borderRadius: 10,
                }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                    {new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{o.material}</div>
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>📐 {proj?.name}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", textAlign: "right" }}>{o.qty} × {fmtINR(o.rate)}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#4f46e5", textAlign: "right" }}>{fmtINR(o.total)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .shop-hero { grid-template-columns: 1fr !important; text-align: center; }
          .shop-info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </EngineerLayout>
  );
}
