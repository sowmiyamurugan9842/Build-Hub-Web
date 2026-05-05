import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { recentOrders, supplier, customers } from "../data/fakeData";

function buildInvoiceData(invoiceId) {
  const found = recentOrders.find((o) => o.id === invoiceId);
  if (found) {
    const taxable = found.total;
    const cgst = Math.round(taxable * 0.025);
    const sgst = Math.round(taxable * 0.025);
    const customer = customers.find((c) => c.name === found.customer) || customers[0];
    return { id: found.id, date: found.date.split(" ")[0], customer, material: found.material, qty: found.qty, rate: found.rate, taxable, cgst, sgst, grand: taxable + cgst + sgst, hsn: "2505" };
  }
  const taxable = 115000;
  const cgst = Math.round(taxable * 0.025);
  const sgst = Math.round(taxable * 0.025);
  return { id: invoiceId, date: "2026-04-29", customer: customers[0], material: "M-Sand (Manufactured)", qty: 5, rate: 23000, taxable, cgst, sgst, grand: taxable + cgst + sgst, hsn: "2505" };
}

function toWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
  if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " " + toWords(n%100) : "");
  if (n < 100000) return toWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " " + toWords(n%1000) : "");
  if (n < 10000000) return toWords(Math.floor(n/100000)) + " Lakh" + (n%100000 ? " " + toWords(n%100000) : "");
  return toWords(Math.floor(n/10000000)) + " Crore" + (n%10000000 ? " " + toWords(n%10000000) : "");
}

const ShareIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inv = buildInvoiceData(id);

  function handleWhatsApp() {
    const msg = `*Tax Invoice — ${inv.id}*\n\nFrom: ${supplier.name}\nTo: ${inv.customer.name}\n\nItem: ${inv.material}\nQty: ${inv.qty} loads · Rate: ₹${inv.rate.toLocaleString("en-IN")}/load\n\n*Grand Total: ₹${inv.grand.toLocaleString("en-IN")}* (incl. 5% GST)\n\nPlease make payment at the earliest. Thank you 🙏`;
    window.open(`https://wa.me/91${inv.customer.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const shareBtn = (
    <button
      className="btn"
      style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
    >
      <ShareIcon /> Share
    </button>
  );

  return (
    <Layout title="Invoice" subtitle={inv.id} back="/dashboard" actions={shareBtn}>
      <div className="invoice-outer">
        <div className="invoice-box">
          <div className="invoice-head">
            <h2>TAX INVOICE</h2>
            <p>GST Tax Invoice as per GST Rules</p>
          </div>

          <div className="invoice-meta">
            <div className="invoice-meta-cell">
              <div className="meta-key">Invoice No.</div>
              <div className="meta-val">{inv.id}</div>
            </div>
            <div className="invoice-meta-cell">
              <div className="meta-key">Date</div>
              <div className="meta-val">{new Date(inv.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <div className="invoice-meta-cell">
              <div className="meta-key">HSN Code</div>
              <div className="meta-val">{inv.hsn}</div>
            </div>
            <div className="invoice-meta-cell">
              <div className="meta-key">GST Rate</div>
              <div className="meta-val">5% (CGST 2.5% + SGST 2.5%)</div>
            </div>
          </div>

          <div className="party-section">
            <div className="party-label">Supplier (From)</div>
            <div className="party-name">{supplier.name}</div>
            <div className="party-detail">
              {supplier.address}<br />
              GSTIN: {supplier.gstin} | Ph: {supplier.phone}
            </div>
          </div>

          <div className="party-section">
            <div className="party-label">Buyer (To)</div>
            <div className="party-name">{inv.customer.name}</div>
            <div className="party-detail">
              {inv.customer.city}, Tamil Nadu<br />
              {inv.customer.gstin ? `GSTIN: ${inv.customer.gstin} | ` : ""}Ph: {inv.customer.phone}
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td style={{ fontWeight: 600 }}>{inv.material}</td>
                <td>{inv.qty} loads</td>
                <td>₹{inv.rate.toLocaleString("en-IN")}</td>
                <td style={{ fontWeight: 600 }}>₹{inv.taxable.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          <div className="tax-section">
            <div className="tax-row"><span>Taxable Amount</span><span>₹{inv.taxable.toLocaleString("en-IN")}</span></div>
            <div className="tax-row"><span>CGST @ 2.5%</span><span>₹{inv.cgst.toLocaleString("en-IN")}</span></div>
            <div className="tax-row"><span>SGST @ 2.5%</span><span>₹{inv.sgst.toLocaleString("en-IN")}</span></div>
            <div className="tax-row grand"><span>Grand Total</span><span>₹{inv.grand.toLocaleString("en-IN")}</span></div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, fontStyle: "italic" }}>
              Amount in words: {toWords(inv.grand)} Rupees Only
            </div>
          </div>

          <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "12px 16px" }}>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>
              <strong>Payment Terms:</strong> Due within 7 days of delivery.<br />
              <strong>Bank:</strong> Indian Bank | A/c: 6112345678 | IFSC: IDIB000C123
            </div>
          </div>
        </div>

        <div className="invoice-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-whatsapp" style={{ flex: 2 }} onClick={handleWhatsApp}>
            <WhatsAppIcon /> Share via WhatsApp
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate("/orders/new")}>
            New Order
          </button>
        </div>
      </div>
    </Layout>
  );
}
