import { createContext, useContext, useState, useCallback } from "react";
import { customers as initialCustomers } from "../data/fakeData";

/* ──────────────────────────────────────────────────────────────
   CustomerContext — manages the supplier's customer list.
   Features:
     • Add new customer
     • Manual archive / unarchive
     • Auto-archive criteria: balance === 0 AND inactive ≥ 30 days
   Today's date is taken from the supplier's domain ("today" = 2026-05-05)
   ────────────────────────────────────────────────────────────── */

const CustomerContext = createContext(null);

const TODAY = new Date("2026-05-05");
const ARCHIVE_DAYS = 30;

/* Determines if a customer SHOULD be archived (auto rule). */
export function isAutoArchived(c) {
  if (c.archived === true) return true;
  if (c.archived === false) return false; // explicitly unarchived
  if (c.balance > 0) return false;
  if (!c.lastActivity) return false;
  const days = (TODAY - new Date(c.lastActivity)) / (1000 * 60 * 60 * 24);
  return days >= ARCHIVE_DAYS;
}

export function daysSinceActivity(c) {
  if (!c.lastActivity) return null;
  return Math.floor((TODAY - new Date(c.lastActivity)) / (1000 * 60 * 60 * 24));
}

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(initialCustomers);

  const addCustomer = useCallback((data) => {
    setCustomers((prev) => {
      const newId = Math.max(0, ...prev.map((c) => c.id)) + 1;
      const newCustomer = {
        id: newId,
        name: data.name.trim(),
        phone: data.phone.trim(),
        gstin: data.gstin?.trim() || "",
        city: data.city.trim(),
        type: data.type || "contractor",
        balance: 0,
        lastActivity: new Date().toISOString().slice(0, 10),
        archived: false,
      };
      return [newCustomer, ...prev];
    });
  }, []);

  const archiveCustomer = useCallback((id) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, archived: true } : c));
  }, []);

  const unarchiveCustomer = useCallback((id) => {
    setCustomers((prev) => prev.map((c) =>
      c.id === id
        ? { ...c, archived: false, lastActivity: new Date().toISOString().slice(0, 10) }
        : c
    ));
  }, []);

  return (
    <CustomerContext.Provider value={{
      customers, addCustomer, archiveCustomer, unarchiveCustomer,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomers must be used within CustomerProvider");
  return ctx;
}
