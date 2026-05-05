import { createContext, useContext, useState } from "react";
import { engineerOrders as seedOrders } from "../data/fakeData";

// ─────────────────────────────────────────────────────────────────────────────
// ORDER SERVICE — all storage/transport is isolated here.
//
// To integrate a real backend:
//   1. Remove sessionStorage calls from each method
//   2. Replace with fetch() / axios calls to your API endpoints
//   3. Make the context functions async and add loading/error state
//   4. The component API (acceptOrder, rejectOrder, etc.) stays identical
//
// Endpoint map (for reference when wiring up):
//   load()          → GET    /api/orders
//   persist()       → (replaced by per-action calls below)
//   addOrders()     → POST   /api/orders  (bulk)
//   acceptOrder()   → PATCH  /api/orders/:id  { status: "in-transit" }
//   rejectOrder()   → PATCH  /api/orders/:id  { status: "rejected", rejectReason }
//   markDelivered() → PATCH  /api/orders/:id  { status: "delivered" }
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "buildhub_orders_v1";

const OrderService = {
  load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    // First load — seed from fake data (deep-clone so mutations don't hit module const)
    const seed = seedOrders.map((o) => ({ ...o }));
    this.persist(seed);
    return seed;
  },
  persist(orders) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  },
};

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => OrderService.load());

  function save(updated) {
    setOrders(updated);
    OrderService.persist(updated);
  }

  /** Add one or more new orders. Backend: POST /api/orders */
  function addOrders(newOrders) {
    save([...newOrders, ...orders]);
  }

  /** Accept a pending order → in-transit. Backend: PATCH /api/orders/:id */
  function acceptOrder(id) {
    save(
      orders.map((o) =>
        o.id === id
          ? { ...o, status: "in-transit", acceptedAt: new Date().toISOString() }
          : o
      )
    );
  }

  /** Reject an order with optional reason. Backend: PATCH /api/orders/:id */
  function rejectOrder(id, reason = "") {
    save(
      orders.map((o) =>
        o.id === id
          ? { ...o, status: "rejected", rejectReason: reason, rejectedAt: new Date().toISOString() }
          : o
      )
    );
  }

  /** Mark an in-transit order as delivered. Backend: PATCH /api/orders/:id */
  function markDelivered(id) {
    save(
      orders.map((o) =>
        o.id === id
          ? { ...o, status: "delivered", deliveredAt: new Date().toISOString() }
          : o
      )
    );
  }

  function getOrdersForSupplier(supplierId) {
    return orders.filter((o) => o.supplierId === supplierId);
  }

  function getPendingCountForSupplier(supplierId) {
    return orders.filter((o) => o.supplierId === supplierId && o.status === "pending").length;
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrders,
        acceptOrder,
        rejectOrder,
        markDelivered,
        getOrdersForSupplier,
        getPendingCountForSupplier,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used inside OrdersProvider");
  return ctx;
}
