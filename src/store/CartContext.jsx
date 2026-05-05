import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [linkedProject, setLinkedProject] = useState("");

  function addToCart({ supplierId, supplierName, materialId, name, unit, qty = 1, rate, stock }) {
    setItems((prev) => {
      const exists = prev.find((i) => i.supplierId === supplierId && i.materialId === materialId);
      if (exists) {
        return prev.map((i) =>
          i.supplierId === supplierId && i.materialId === materialId
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `${supplierId}-${materialId}`,
          supplierId,
          supplierName,
          materialId,
          name,
          unit,
          qty,
          rate,
          stock,
        },
      ];
    });
  }

  function updateQty(supplierId, materialId, qty) {
    const n = Number(qty);
    if (n <= 0) {
      removeItem(supplierId, materialId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.supplierId === supplierId && i.materialId === materialId ? { ...i, qty: n } : i
      )
    );
  }

  function removeItem(supplierId, materialId) {
    setItems((prev) =>
      prev.filter((i) => !(i.supplierId === supplierId && i.materialId === materialId))
    );
  }

  function clearCart() {
    setItems([]);
    setLinkedProject("");
  }

  /* Group items by supplier */
  const itemsBySupplier = items.reduce((acc, item) => {
    if (!acc[item.supplierId]) acc[item.supplierId] = { supplierName: item.supplierName, items: [] };
    acc[item.supplierId].items.push(item);
    return acc;
  }, {});

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalValue = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const supplierCount = Object.keys(itemsBySupplier).length;

  return (
    <CartContext.Provider value={{
      items,
      itemsBySupplier,
      totalItems,
      totalValue,
      supplierCount,
      linkedProject,
      setLinkedProject,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
