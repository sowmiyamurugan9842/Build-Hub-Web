import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EngineerLayout from "../components/EngineerLayout";
import { cities, supplierShops, categories, getCategory } from "../data/fakeData";
import { useStock } from "../store/StockContext";

/* Helper: merge supplier with live stock + brand-new materials */
function mergeLive(shop, stockMap) {
  const live = stockMap[shop.id];
  if (!live) return shop;
  const existingIds = new Set(shop.catalog.map((c) => c.materialId));
  const existing = shop.catalog.map((c) => {
    const l = live[c.materialId];
    if (!l) return c;
    return { ...c, stock: l.stock, rate: l.rate, available: l.available };
  });
  const newItems = Object.values(live)
    .filter((it) => !existingIds.has(it.materialId))
    .map((it) => ({
      materialId: it.materialId, name: it.name, unit: it.unit,
      rate: it.rate, stock: it.stock, available: it.available,
    }));
  return { ...shop, catalog: [...existing, ...newItems] };
}

function StarRating({ value, size = 12 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} style={{
          color: i <= Math.round(value) ? "#fbbf24" : "#e2e8f0",
          fontSize: size,
        }}>★</span>
      ))}
    </span>
  );
}

function SupplierCard({ shop, onClick }) {
  const minRate = Math.min(...shop.catalog.filter(c => c.available).map(c => c.rate));
  const availCount = shop.catalog.filter(c => c.available).length;
  const cat = getCategory(shop.category);
  // Use the unit of the cheapest available item for the "starting from" line
  const cheapestItem = shop.catalog.filter(c => c.available).sort((a, b) => a.rate - b.rate)[0];
  const unit = cheapestItem?.unit || "unit";

  return (
    <div
      onClick={onClick}
      style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: 18, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all .2s cubic-bezier(.16,1,.3,1)",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.10)"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
    >
      {/* Top row: category badge + verified badge */}
      <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 6, zIndex: 1 }}>
        {cat && (
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 5,
            background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 11 }}>{cat.icon}</span>
            {cat.name}
          </span>
        )}
        {shop.verified && (
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 5,
            background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Header */}
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: cat ? `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` : "linear-gradient(135deg,#6366f1,#4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
          boxShadow: `0 4px 10px ${cat?.color || "#6366f1"}55`,
        }}>
          {cat?.icon || shop.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginRight: 160 }}>
            {shop.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <StarRating value={shop.rating} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{shop.rating}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>({shop.reviewCount})</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            📍 {shop.area} · 🚚 {shop.distance} km away
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "10px 0", borderTop: "1px dashed #e2e8f0", borderBottom: "1px dashed #e2e8f0", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>RESPONSE</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{shop.responseTime}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>ON-TIME</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", marginTop: 2 }}>{shop.onTimeRate}%</div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.05em" }}>EXP.</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{shop.yearsActive} yrs</div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {shop.tags.map((t) => (
          <span key={t} style={{
            fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
            background: "#f1f5f9", color: "#475569",
          }}>{t}</span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
        <div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>STARTING FROM</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#4f46e5" }}>₹{minRate.toLocaleString("en-IN")}<span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>/{unit}</span></div>
          <div style={{ fontSize: 10, color: "#64748b" }}>{availCount} of {shop.catalog.length} items in stock</div>
        </div>
        <button style={{
          background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "white",
          border: "none", padding: "8px 14px", borderRadius: 8,
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
        }}>
          View Catalog →
        </button>
      </div>
    </div>
  );
}

export default function FindSuppliers() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { stock } = useStock();
  const [city, setCity] = useState(params.get("city") || "chennai");
  const [categoryFilter, setCategoryFilter] = useState(params.get("category") || "all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("distance");

  /* Counts per category for the chosen city (live, before category filter) */
  const cityShops = supplierShops.filter((s) => s.city === city);
  const categoryCounts = useMemo(() => {
    const counts = { all: cityShops.length };
    categories.forEach((c) => {
      counts[c.id] = cityShops.filter((s) => s.category === c.id).length;
    });
    return counts;
  }, [city, cityShops]);

  const filtered = useMemo(() => {
    let list = cityShops.map((s) => mergeLive(s, stock));
    if (categoryFilter !== "all") list = list.filter((s) => s.category === categoryFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q));
    }
    list = [...list];
    if (sortBy === "distance") list.sort((a, b) => a.distance - b.distance);
    if (sortBy === "rating")   list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "rate") {
      list.sort((a, b) => {
        const aMin = Math.min(...a.catalog.filter(c => c.available).map(c => c.rate));
        const bMin = Math.min(...b.catalog.filter(c => c.available).map(c => c.rate));
        return aMin - bMin;
      });
    }
    return list;
  }, [city, categoryFilter, search, sortBy, stock, cityShops]);

  const cityInfo = cities.find((c) => c.id === city);

  return (
    <EngineerLayout title="Find Suppliers" subtitle="Browse verified shops near your site">

      {/* ── Category chips (horizontal scroll) ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          🏷️ Filter by Category
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          <button
            onClick={() => setCategoryFilter("all")}
            style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 800,
              border: categoryFilter === "all" ? "1px solid #6366f1" : "1px solid #e2e8f0",
              background: categoryFilter === "all" ? "#eef2ff" : "white",
              color: categoryFilter === "all" ? "#4f46e5" : "#475569",
              cursor: "pointer", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            }}
          >
            All Shops
            <span style={{
              background: categoryFilter === "all" ? "#6366f1" : "#f1f5f9",
              color: categoryFilter === "all" ? "white" : "#94a3b8",
              fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 800,
            }}>{categoryCounts.all}</span>
          </button>
          {categories.filter((c) => categoryCounts[c.id] > 0).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              style={{
                padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                border: categoryFilter === c.id ? `1.5px solid ${c.color}` : "1px solid #e2e8f0",
                background: categoryFilter === c.id ? c.bg : "white",
                color: categoryFilter === c.id ? c.color : "#475569",
                cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 14 }}>{c.icon}</span>
              {c.name}
              <span style={{
                background: categoryFilter === c.id ? c.color : "#f1f5f9",
                color: categoryFilter === c.id ? "white" : "#94a3b8",
                fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 800,
              }}>{categoryCounts[c.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{
        background: "white", border: "1px solid #e2e8f0", borderRadius: 14,
        padding: 16, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
          {/* City */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>📍 Location</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
              style={{ fontWeight: 600 }}
            >
              {cities.map((c) => {
                const count = supplierShops.filter((s) => s.city === c.id).length;
                return <option key={c.id} value={c.id}>{c.name}, {c.state} ({count} shops)</option>;
              })}
            </select>
          </div>
          {/* Sort */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>↕ Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              <option value="distance">Nearest first</option>
              <option value="rating">Highest rated</option>
              <option value="rate">Lowest rate</option>
            </select>
          </div>
        </div>
        <input
          className="form-control"
          placeholder="🔍 Search by shop name or area…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            {filtered.length} {categoryFilter === "all" ? "suppliers" : (getCategory(categoryFilter)?.name + " shops")} in {cityInfo?.name}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            {categoryFilter === "all"
              ? "Across all categories — sand, cement, steel, hardware, electricals, plumbing & more"
              : (getCategory(categoryFilter)?.desc || "")}
          </div>
        </div>
        {filtered.length > 0 && (
          <div style={{
            background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
            padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
          }}>
            🛡️ {filtered.filter(s => s.verified).length} verified
          </div>
        )}
      </div>

      {/* ── Supplier grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
        gap: 14,
      }}>
        {filtered.map((s) => (
          <SupplierCard key={s.id} shop={s} onClick={() => navigate(`/engineer/suppliers/${s.id}`)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: 60, background: "white",
          border: "1px dashed #e2e8f0", borderRadius: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>No suppliers match your filters</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Try a different city or clear filters.</div>
        </div>
      )}
    </EngineerLayout>
  );
}
