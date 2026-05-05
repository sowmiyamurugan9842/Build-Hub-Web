import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

/* Supplier side */
import Dashboard from "./pages/Dashboard";
import CustomerList from "./pages/CustomerList";
import CustomerLedger from "./pages/CustomerLedger";
import OrderEntry from "./pages/OrderEntry";
import Invoice from "./pages/Invoice";
import PurchaseEntry from "./pages/PurchaseEntry";
import Reports from "./pages/Reports";
import StockManagement from "./pages/StockManagement";
import IncomingOrders from "./pages/IncomingOrders";

/* Engineer (buyer) side */
import EngineerHome from "./pages/EngineerHome";
import FindSuppliers from "./pages/FindSuppliers";
import SupplierShop from "./pages/SupplierShop";
import EngineerOrderNew from "./pages/EngineerOrderNew";
import EngineerProjects from "./pages/EngineerProjects";
import EngineerProjectDetail from "./pages/EngineerProjectDetail";
import EngineerOrders from "./pages/EngineerOrders";
import EngineerCart from "./pages/EngineerCart";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Supplier routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id" element={<CustomerLedger />} />
        <Route path="/orders/new" element={<OrderEntry />} />
        <Route path="/invoice/:id" element={<Invoice />} />
        <Route path="/purchases/new" element={<PurchaseEntry />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/stock" element={<StockManagement />} />
        <Route path="/orders/incoming" element={<IncomingOrders />} />

        {/* Engineer routes */}
        <Route path="/engineer" element={<Navigate to="/engineer/home" replace />} />
        <Route path="/engineer/home" element={<EngineerHome />} />
        <Route path="/engineer/suppliers" element={<FindSuppliers />} />
        <Route path="/engineer/suppliers/:id" element={<SupplierShop />} />
        <Route path="/engineer/order/new" element={<EngineerOrderNew />} />
        <Route path="/engineer/projects" element={<EngineerProjects />} />
        <Route path="/engineer/projects/:id" element={<EngineerProjectDetail />} />
        <Route path="/engineer/orders" element={<EngineerOrders />} />
        <Route path="/engineer/cart" element={<EngineerCart />} />
      </Routes>
    </BrowserRouter>
  );
}
