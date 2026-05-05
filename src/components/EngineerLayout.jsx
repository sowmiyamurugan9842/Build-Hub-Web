import { useNavigate, useLocation } from "react-router-dom";
import { currentEngineer } from "../data/fakeData";
import { useCart } from "../store/CartContext";

const HomeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const ShopIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9V21H21V9" /><path d="M1 9L4 3H20L23 9" /><line x1="9" y1="13" x2="15" y2="13" />
  </svg>
);
const SiteIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    <path d="M10 22v-4h4v4" />
  </svg>
);
const ListIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="3.5" cy="6" r="1.5" /><circle cx="3.5" cy="12" r="1.5" /><circle cx="3.5" cy="18" r="1.5" />
  </svg>
);
const LogoutIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const CartIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const navItems = [
  { icon: HomeIcon, label: "Home",          path: "/engineer/home" },
  { icon: ShopIcon, label: "Find Suppliers",path: "/engineer/suppliers" },
  { icon: SiteIcon, label: "My Projects",   path: "/engineer/projects" },
  { icon: ListIcon, label: "Order History", path: "/engineer/orders" },
];

export default function EngineerLayout({ children, title, subtitle, back, actions }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { totalItems } = useCart();

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo" style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>👷</div>
          <div>
            <div className="sidebar-name">BuildHub</div>
            <div className="sidebar-sub">Buyer App</div>
          </div>
        </div>

        <div style={{
          margin: "0 14px 14px", padding: "10px 12px",
          background: "rgba(99,102,241,0.15)", borderRadius: 8,
          fontSize: 11, fontWeight: 600, color: "#a5b4fc",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>📍</span>
          <div>
            <div style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{currentEngineer.area}</div>
            <div style={{ color: "#a5b4fc", fontSize: 10 }}>{currentEngineer.city}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = pathname === item.path || (item.path !== "/engineer/home" && pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                className={`sidebar-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
              {currentEngineer.name.charAt(0)}
            </div>
            <div>
              <div className="sidebar-uname">{currentEngineer.name}</div>
              <div className="sidebar-urole">{currentEngineer.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={() => navigate("/login")} title="Logout">
            <LogoutIcon size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            {back && (
              <button className="topbar-back" onClick={() => navigate(back)}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="topbar-title">{title}</h1>
              {subtitle && <p className="topbar-sub">{subtitle}</p>}
            </div>
          </div>
          <div className="topbar-right">
            {actions}
            <button
              onClick={() => navigate("/engineer/cart")}
              style={{
                position: "relative",
                background: totalItems > 0 ? "#eef2ff" : "none",
                border: totalItems > 0 ? "1px solid #c7d2fe" : "1px solid #e2e8f0",
                borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                color: totalItems > 0 ? "#4f46e5" : "#64748b",
                fontWeight: 600, fontSize: 13,
                transition: "all .15s",
              }}
            >
              <CartIcon size={18} />
              {totalItems > 0 && (
                <span style={{
                  background: "#4f46e5", color: "white",
                  fontSize: 10, fontWeight: 800, lineHeight: 1,
                  padding: "2px 6px", borderRadius: 10,
                  minWidth: 18, textAlign: "center",
                }}>{totalItems}</span>
              )}
              {totalItems === 0 && <span>Cart</span>}
            </button>
            <div className="topbar-date">📅 Tue, 29 Apr 2026</div>
          </div>
        </header>

        <header className="mobile-header" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
          {back ? (
            <button className="header-back" onClick={() => navigate(back)}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          ) : null}
          <div style={{ flex: 1 }}>
            <div className="header-title">{title || "BuildHub"}</div>
            {subtitle && <div className="header-sub">{subtitle}</div>}
          </div>
          {actions}
          <button
            onClick={() => navigate("/engineer/cart")}
            style={{
              position: "relative", background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: 8, padding: "6px 8px", cursor: "pointer",
              display: "flex", alignItems: "center", color: "white", flexShrink: 0,
            }}
          >
            <CartIcon size={20} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4,
                background: "#f59e0b", color: "white",
                fontSize: 9, fontWeight: 800, lineHeight: 1,
                padding: "2px 5px", borderRadius: 10,
                minWidth: 16, textAlign: "center",
              }}>{totalItems}</span>
            )}
          </button>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
            {currentEngineer.name.charAt(0)}
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const active = pathname === item.path || (item.path !== "/engineer/home" && pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={22} />
              {item.label}
            </button>
          );
        })}
        <button
          className={`nav-item ${pathname === "/engineer/cart" ? "active" : ""}`}
          onClick={() => navigate("/engineer/cart")}
          style={{ position: "relative" }}
        >
          <span style={{ position: "relative", display: "inline-flex" }}>
            <CartIcon size={22} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute", top: -6, right: -8,
                background: "#f59e0b", color: "white",
                fontSize: 9, fontWeight: 800, lineHeight: 1,
                padding: "2px 5px", borderRadius: 10,
                minWidth: 16, textAlign: "center",
              }}>{totalItems}</span>
            )}
          </span>
          Cart
        </button>
      </nav>
    </div>
  );
}
