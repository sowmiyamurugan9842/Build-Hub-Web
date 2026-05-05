import { createContext, useContext, useState, useCallback } from "react";
import { supplierShops } from "../data/fakeData";

/* ──────────────────────────────────────────────────────────────
   StockContext — single source of truth for inventory.
   Used by:
     • Supplier StockManagement page (read + write)
     • Engineer FindSuppliers (read min-rate / available count)
     • Engineer SupplierShop (read live stock + availability)
   ────────────────────────────────────────────────────────────── */

const StockContext = createContext(null);

/* Build initial map keyed by supplierId → { materialId: { stock, rate, available, threshold } } */
function buildInitialStock() {
  const map = {};
  supplierShops.forEach((shop) => {
    map[shop.id] = {};
    shop.catalog.forEach((c) => {
      map[shop.id][c.materialId] = {
        materialId: c.materialId,
        name: c.name,
        unit: c.unit,
        rate: c.rate,
        stock: c.stock,
        available: c.available,
        threshold: 50,        // low-stock threshold (tons)
        capacity: 400,        // total holding capacity
      };
    });
  });
  return map;
}

export function StockProvider({ children }) {
  const [stock, setStock] = useState(buildInitialStock());
  const [movements, setMovements] = useState([
    { id: "MV-0008", supplierId: "SUP-001", materialId: 2, type: "in",     qty: 80,  reason: "Restock from quarry",     date: "2026-04-29 09:15" },
    { id: "MV-0007", supplierId: "SUP-001", materialId: 4, type: "out",    qty: 12,  reason: "Order INV-2026-0142",     date: "2026-04-29 10:30" },
    { id: "MV-0006", supplierId: "SUP-001", materialId: 3, type: "out",    qty: 8,   reason: "Order INV-2026-0140",     date: "2026-04-28 16:45" },
    { id: "MV-0005", supplierId: "SUP-001", materialId: 1, type: "adjust", qty: -3,  reason: "Wastage / spillage",      date: "2026-04-28 11:20" },
    { id: "MV-0004", supplierId: "SUP-001", materialId: 2, type: "out",    qty: 25,  reason: "Order INV-2026-0138",     date: "2026-04-27 14:10" },
    { id: "MV-0003", supplierId: "SUP-001", materialId: 7, type: "in",     qty: 50,  reason: "Restock from Vel Quarry", date: "2026-04-26 08:00" },
    { id: "MV-0002", supplierId: "SUP-001", materialId: 3, type: "in",     qty: 100, reason: "Restock from quarry",     date: "2026-04-25 07:30" },
    { id: "MV-0001", supplierId: "SUP-001", materialId: 5, type: "adjust", qty: -8,  reason: "Damaged in transit",      date: "2026-04-24 15:50" },
  ]);

  /* ── Actions ── */

  const addStock = useCallback((supplierId, materialId, qty, reason = "Restock") => {
    setStock((prev) => {
      const next = { ...prev, [supplierId]: { ...prev[supplierId] } };
      const item = next[supplierId][materialId];
      if (!item) return prev;
      const newStock = item.stock + qty;
      next[supplierId][materialId] = {
        ...item,
        stock: newStock,
        available: newStock > 0,
      };
      return next;
    });
    setMovements((prev) => [{
      id: "MV-" + String(prev.length + 1).padStart(4, "0"),
      supplierId, materialId, type: "in", qty, reason,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    }, ...prev]);
  }, []);

  const reduceStock = useCallback((supplierId, materialId, qty, reason = "Sale") => {
    setStock((prev) => {
      const next = { ...prev, [supplierId]: { ...prev[supplierId] } };
      const item = next[supplierId][materialId];
      if (!item) return prev;
      const newStock = Math.max(0, item.stock - qty);
      next[supplierId][materialId] = {
        ...item,
        stock: newStock,
        available: newStock > 0,
      };
      return next;
    });
    setMovements((prev) => [{
      id: "MV-" + String(prev.length + 1).padStart(4, "0"),
      supplierId, materialId, type: "out", qty, reason,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    }, ...prev]);
  }, []);

  const adjustStock = useCallback((supplierId, materialId, delta, reason = "Adjustment") => {
    setStock((prev) => {
      const next = { ...prev, [supplierId]: { ...prev[supplierId] } };
      const item = next[supplierId][materialId];
      if (!item) return prev;
      const newStock = Math.max(0, item.stock + delta);
      next[supplierId][materialId] = {
        ...item,
        stock: newStock,
        available: newStock > 0,
      };
      return next;
    });
    setMovements((prev) => [{
      id: "MV-" + String(prev.length + 1).padStart(4, "0"),
      supplierId, materialId, type: "adjust", qty: delta, reason,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
    }, ...prev]);
  }, []);

  const updateRate = useCallback((supplierId, materialId, newRate) => {
    setStock((prev) => {
      const next = { ...prev, [supplierId]: { ...prev[supplierId] } };
      const item = next[supplierId][materialId];
      if (!item) return prev;
      next[supplierId][materialId] = { ...item, rate: newRate };
      return next;
    });
  }, []);

  const toggleAvailable = useCallback((supplierId, materialId) => {
    setStock((prev) => {
      const next = { ...prev, [supplierId]: { ...prev[supplierId] } };
      const item = next[supplierId][materialId];
      if (!item) return prev;
      next[supplierId][materialId] = { ...item, available: !item.available };
      return next;
    });
  }, []);

  /* Create a brand-new material in this supplier's catalog */
  const createMaterial = useCallback((supplierId, data) => {
    let newId;
    setStock((prev) => {
      const allIds = Object.values(prev).flatMap((s) => Object.keys(s).map(Number));
      newId = Math.max(0, ...allIds) + 1;
      return {
        ...prev,
        [supplierId]: {
          ...(prev[supplierId] || {}),
          [newId]: {
            materialId: newId,
            name: data.name,
            unit: data.unit || "ton",
            rate: Number(data.rate),
            stock: Number(data.stock) || 0,
            available: Number(data.stock) > 0,
            threshold: Number(data.threshold) || 50,
            capacity: Number(data.capacity) || 400,
          },
        },
      };
    });
    if (Number(data.stock) > 0) {
      setMovements((prev) => [{
        id: "MV-" + String(prev.length + 1).padStart(4, "0"),
        supplierId, materialId: newId, type: "in", qty: Number(data.stock),
        reason: "New material added: " + data.name,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
      }, ...prev]);
    }
    return newId;
  }, []);

  return (
    <StockContext.Provider value={{
      stock, movements,
      addStock, reduceStock, adjustStock, updateRate, toggleAvailable, createMaterial,
    }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStock must be used within StockProvider");
  return ctx;
}

/* Helper: get live catalog for a supplier — merges fakeData shop catalog
   with live stock + appends any brand-new materials added via createMaterial */
export function useSupplierCatalog(supplierId) {
  const { stock } = useStock();
  const shop = supplierShops.find((s) => s.id === supplierId);
  if (!shop || !stock[supplierId]) return shop;

  const liveStock = stock[supplierId];
  const existingIds = new Set(shop.catalog.map((c) => c.materialId));

  const existing = shop.catalog.map((c) => {
    const live = liveStock[c.materialId];
    if (!live) return c;
    return { ...c, stock: live.stock, rate: live.rate, available: live.available };
  });

  // Brand-new materials added via createMaterial
  const newItems = Object.values(liveStock)
    .filter((it) => !existingIds.has(it.materialId))
    .map((it) => ({
      materialId: it.materialId,
      name: it.name,
      unit: it.unit,
      rate: it.rate,
      stock: it.stock,
      available: it.available,
    }));

  return {
    ...shop,
    catalog: [...existing, ...newItems],
  };
}
