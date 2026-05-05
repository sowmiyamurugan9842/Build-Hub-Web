import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useCustomers, isAutoArchived, daysSinceActivity } from "../store/CustomerContext";

const SearchIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevronRight = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ArchiveIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);
const RestoreIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

function initials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
const avatarColors = ["orange", "blue", "green", "orange", "blue"];

const TYPE_LABELS = {
  contractor: { bg: "#eef2ff", color: "#4f46e5", label: "Contractor" },
  builder:    { bg: "#fff7ed", color: "#ea580c", label: "Builder" },
  engineer:   { bg: "#ecfdf5", color: "#059669", label: "Engineer" },
};

/* ── Add Customer Modal ── */
function AddCustomerModal({ open, onClose, onConfirm }) {
  const [form, setForm] = useState({ name: "", phone: "", gstin: "", city: "", type: "contractor" });
  function set(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  if (!open) return null;

  const phoneOk = /^\d{10}$/.test(form.phone);
  const canSubmit = form.name.trim() && phoneOk && form.city.trim();

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onConfirm(form);
    setForm({ name: "", phone: "", gstin: "", city: "", type: "contractor" });
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
      backdropFilter: "blur(4px)", zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      animation: "fadeIn .15s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "white", borderRadius: 16, padding: 24,
        maxWidth: 520, width: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        animation: "scaleIn .2s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
          Add New Customer
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Create a customer account</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
          Customer will appear in your list with ₹0 opening balance.
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div className="form-group">
            <label className="form-label">Customer / Company Name *</label>
            <input
              className="form-control"
              autoFocus
              placeholder="e.g. Bharath Constructions"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                className="form-control"
                type="tel"
                placeholder="10 digits"
                maxLength={10}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                className="form-control"
                placeholder="e.g. Vandalur"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-control" value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="contractor">Contractor</option>
                <option value="builder">Builder</option>
                <option value="engineer">Engineer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">GSTIN (optional)</label>
              <input
                className="form-control"
                placeholder="33AABC..."
                style={{ fontFamily: "monospace", fontSize: 13 }}
                value={form.gstin}
                onChange={(e) => set("gstin", e.target.value.toUpperCase())}
                maxLength={15}
              />
            </div>
          </div>

          <div style={{
            background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8,
            padding: "10px 12px", fontSize: 11, color: "#4338ca", marginBottom: 14,
          }}>
            💡 Add deliveries / payments later — they'll auto-link to this customer's ledger.
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary"
              style={{ flex: 2, opacity: canSubmit ? 1 : 0.5 }}
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Success popup ── */
function SuccessPopup({ popup, onClose }) {
  if (!popup) return null;
  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon" style={{ background: popup.iconBg || "linear-gradient(135deg,#ecfdf5,#d1fae5)" }}>
          {popup.icon || (
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div className="success-title" style={{ color: popup.color || "#059669" }}>{popup.title}</div>
        <div className="success-sub">{popup.message}</div>
        <button className="btn btn-primary btn-full" onClick={onClose} autoFocus>Done</button>
      </div>
    </div>
  );
}

export default function CustomerList() {
  const navigate = useNavigate();
  const { customers, addCustomer, archiveCustomer, unarchiveCustomer } = useCustomers();

  const [tab, setTab]       = useState("active");
  const [q, setQ]           = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [popup, setPopup]   = useState(null);

  /* Partition active vs archived */
  const archivedList = useMemo(() => customers.filter(isAutoArchived), [customers]);
  const activeList   = useMemo(() => customers.filter((c) => !isAutoArchived(c)), [customers]);

  const list = tab === "active" ? activeList : tab === "archived" ? archivedList : customers;
  const filtered = list.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.city.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q)
  );

  const totalOutstanding = activeList.reduce((s, c) => s + c.balance, 0);
  const archivableCount  = customers.filter((c) => c.archived === undefined && c.balance === 0 && c.lastActivity && (new Date("2026-05-05") - new Date(c.lastActivity)) / 86400000 >= 30).length;

  const tabs = [
    { id: "active",   label: "Active",   count: activeList.length,   color: "#10b981" },
    { id: "archived", label: "Archived", count: archivedList.length, color: "#94a3b8" },
    { id: "all",      label: "All",      count: customers.length,    color: "#6366f1" },
  ];

  return (
    <Layout
      title="Customers"
      subtitle={`${activeList.length} active · ₹${(totalOutstanding / 100000).toFixed(1)}L outstanding · ${archivedList.length} archived`}
      actions={
        <button
          onClick={() => setAddOpen(true)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            color: "white", border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 800,
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Customer
        </button>
      }
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              border: tab === t.id ? `1px solid ${t.color}` : "1px solid #e2e8f0",
              background: tab === t.id ? `${t.color}15` : "white",
              color: tab === t.id ? t.color : "#64748b",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 7,
            }}
          >
            {t.id === "archived" && <ArchiveIcon size={13} />}
            {t.label}
            <span style={{
              background: tab === t.id ? t.color : "#f1f5f9",
              color: tab === t.id ? "white" : "#94a3b8",
              fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 800,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Auto-archive notice */}
      {tab === "active" && archivableCount > 0 && (
        <div style={{
          background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 10,
          padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#4338ca",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>🗃</span>
          <span>{archivableCount} fully-paid customer{archivableCount > 1 ? "s have" : " has"} been auto-archived after 30 days of inactivity. View them under <strong>Archived</strong>.</span>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <div className="search-wrap">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="search-input"
            placeholder="Search by name, city, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="card">
        <div className="card-body">
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{tab === "archived" ? "🗃" : "🔍"}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {tab === "archived" ? "No archived customers yet" : "No customers found"}
              </div>
              <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>
                {tab === "archived"
                  ? "Customers with ₹0 balance and 30+ days of inactivity appear here."
                  : "Try a different search term."}
              </div>
            </div>
          ) : (
            filtered.map((c, i) => {
              const archived = isAutoArchived(c);
              const days = daysSinceActivity(c);
              const typeMeta = TYPE_LABELS[c.type] || TYPE_LABELS.contractor;

              return (
                <div
                  key={c.id}
                  className="list-item"
                  style={{ opacity: archived ? 0.85 : 1, position: "relative" }}
                >
                  <div className={`avatar ${avatarColors[i % 5]}`} style={{ filter: archived ? "grayscale(0.4)" : "none" }}>
                    {initials(c.name)}
                  </div>
                  <div className="list-content" onClick={() => navigate(`/customers/${c.id}`)} style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span className="list-name">{c.name}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4,
                        background: typeMeta.bg, color: typeMeta.color,
                        letterSpacing: "0.04em", textTransform: "uppercase",
                      }}>{typeMeta.label}</span>
                      {archived && (
                        <span style={{
                          fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4,
                          background: "#f1f5f9", color: "#64748b",
                          letterSpacing: "0.04em", textTransform: "uppercase",
                          display: "flex", alignItems: "center", gap: 4,
                        }}>
                          <ArchiveIcon size={10} /> Archived
                        </span>
                      )}
                    </div>
                    <div className="list-sub">
                      {c.city} · {c.phone}
                      {days != null && (
                        <span style={{
                          marginLeft: 8,
                          color: days >= 30 ? "#94a3b8" : days >= 14 ? "#d97706" : "#64748b",
                        }}>
                          · last activity {days} day{days === 1 ? "" : "s"} ago
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="list-right" onClick={() => navigate(`/customers/${c.id}`)} style={{ cursor: "pointer" }}>
                    {c.balance > 0
                      ? <div className="amount-due">₹{c.balance.toLocaleString("en-IN")}</div>
                      : <div className="amount-zero">Nil</div>}
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>outstanding</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 8 }}>
                    {archived ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unarchiveCustomer(c.id);
                          setPopup({
                            title: "Customer restored",
                            message: `${c.name} is now active again. Last activity reset to today.`,
                          });
                        }}
                        style={{
                          background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
                          padding: "5px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                          whiteSpace: "nowrap",
                        }}
                        title="Restore to Active"
                      >
                        <RestoreIcon size={11} /> Restore
                      </button>
                    ) : c.balance === 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveCustomer(c.id);
                          setPopup({
                            title: "Customer archived",
                            message: `${c.name} moved to Archived. Restore anytime.`,
                            iconBg: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
                            color: "#475569",
                            icon: (
                              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
                              </svg>
                            ),
                          });
                        }}
                        style={{
                          background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0",
                          padding: "5px 9px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                          whiteSpace: "nowrap",
                        }}
                        title="Archive"
                      >
                        <ArchiveIcon size={11} /> Archive
                      </button>
                    ) : null}
                    <span style={{ alignSelf: "center", color: "#cbd5e1" }}><ChevronRight /></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <AddCustomerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={(data) => {
          addCustomer(data);
          setPopup({
            title: "Customer added",
            message: `${data.name} has been added to your list. Phone: ${data.phone} · ${data.city}`,
          });
        }}
      />
      <SuccessPopup popup={popup} onClose={() => setPopup(null)} />
    </Layout>
  );
}
