import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getLedger } from "../data/fakeData";
import { useCustomers } from "../store/CustomerContext";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CustomerLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const customer = customers.find((c) => c.id === Number(id));
  const ledger = getLedger(Number(id));

  if (!customer) {
    return <Layout title="Ledger"><div style={{ padding: 32 }}>Customer not found.</div></Layout>;
  }

  return (
    <Layout title="Ledger" subtitle={customer.name} back="/customers">
      <div className="card" style={{ marginBottom: 20 }}>
        {/* Customer summary */}
        <div className="ledger-header">
          <div>
            <div className="ledger-name">{customer.name}</div>
            <div className="ledger-phone">📞 {customer.phone}</div>
            {customer.gstin && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>GSTIN: {customer.gstin}</div>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="ledger-bal-label">Total Outstanding</div>
            <div className="ledger-balance">
              {customer.balance > 0 ? `₹${customer.balance.toLocaleString("en-IN")}` : "₹0 — Settled"}
            </div>
            <span className="badge badge-orange" style={{ fontSize: 10, marginTop: 4, display: "inline-block" }}>{customer.type}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }}>+ Record Payment</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate("/orders/new")}>New Order</button>
        </div>

        {/* Transactions */}
        <div style={{ padding: "12px 18px 4px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Transaction History
        </div>
        {ledger.map((txn) => {
          const dotClass = txn.type === "payment" ? "debit" : txn.type === "opening" ? "opening" : "credit";
          const amtClass = txn.type === "payment" ? "debit" : "credit";
          return (
            <div key={txn.id} className="txn-row">
              <div className={`txn-dot ${dotClass}`} style={{ marginTop: 5 }} />
              <div className="txn-info">
                <div className="txn-desc">{txn.desc}</div>
                <div className="txn-date">{formatDate(txn.date)}</div>
              </div>
              <div className="txn-right">
                <div className={`txn-amount ${amtClass}`}>
                  {txn.type === "payment" ? "−" : "+"} ₹{Math.abs(txn.amount).toLocaleString("en-IN")}
                </div>
                <div className="txn-bal">Bal: ₹{txn.balance.toLocaleString("en-IN")}</div>
              </div>
            </div>
          );
        })}
        <div style={{ padding: "14px 18px", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
          Showing last {ledger.length} transactions
        </div>
      </div>
    </Layout>
  );
}
