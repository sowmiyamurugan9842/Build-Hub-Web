import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentSupplier, getCategory, getCurrentSupplierId } from "../data/fakeData";
import { useOrders } from "../store/OrdersContext";

const HomeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const UsersIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PlusIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const TruckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const BarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const BuildingIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="9" y1="6" x2="9" y2="6" /><line x1="15" y1="6" x2="15" y2="6" />
    <line x1="9" y1="10" x2="9" y2="10" /><line x1="15" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="9" y2="14" /><line x1="15" y1="14" x2="15" y2="14" />
    <path d="M10 22v-4h4v4" />
  </svg>
);
const PackageIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4l-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const InboxIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
const LogoutIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const navItems = [
  { icon: HomeIcon,    label: "Dashboard",        path: "/dashboard" },
  { icon: InboxIcon,  label: "Incoming Orders",   path: "/orders/incoming", pendingBadge: true },
  { icon: PackageIcon,label: "Stock",             path: "/stock", badge: "LIVE" },
  { icon: UsersIcon,  label: "Customers",         path: "/customers" },
  { icon: PlusIcon,   label: "New Sale",          path: "/orders/new" },
  { icon: TruckIcon,  label: "Purchase",          path: "/purchases/new" },
  { icon: BarIcon,    label: "Reports",           path: "/reports" },
];

export default function Layout({ children, title, subtitle, back, actions }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const shop = getCurrentSupplier();
  const { getPendingCountForSupplier } = useOrders();
  const pendingCount = getPendingCountForSupplier(getCurrentSupplierId());
  const cat = getCategory(shop?.category);
  const shopShortName = shop?.name.split(/\s+/).slice(0, 2).join(" ") || "Shop";
  const shopOwner = shop?.owner || "Owner";
  const userInitial = shopOwner.charAt(0).toUpperCase();

  function handleLogout() {
    window.localStorage.removeItem("currentSupplierId");
    window.localStorage.removeItem("currentSupplierCategory");
    navigate("/login");
  }

  return (
    <div className="layout">
      {/* ── Sidebar (desktop only) ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo" style={cat ? {
            background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          } : undefined}>
            {cat?.icon || "🏗️"}
          </div>
          <div>
            <div className="sidebar-name">{shopShortName}</div>
            <div className="sidebar-sub">{cat?.name || "Shop"}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path.split("/").slice(0, 2).join("/")));
            return (
              <button
                key={item.path}
                className={`sidebar-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={18} />
                <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 3,
                    background: "linear-gradient(135deg,#10b981,#059669)",
                    color: "white", letterSpacing: "0.04em",
                  }}>{item.badge}</span>
                )}
                {item.pendingBadge && pendingCount > 0 && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 10,
                    background: "#ef4444", color: "white", minWidth: 18, textAlign: "center",
                  }}>{pendingCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={cat ? { background: `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)` } : undefined}>
              {userInitial}
            </div>
            <div>
              <div className="sidebar-uname">{shopOwner}</div>
              <div className="sidebar-urole">Owner</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <LogoutIcon size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="main-area">
        {/* Top bar (desktop) */}
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
            <div className="topbar-date">📅 Tue, 29 Apr 2026</div>
          </div>
        </header>

        {/* Mobile header */}
        <header className="mobile-header">
          {back ? (
            <button className="header-back" onClick={() => navigate(back)}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          ) : null}
          <div style={{ flex: 1 }}>
            <div className="header-title">{title || shop?.name || "BuildHub"}</div>
            {subtitle && <div className="header-sub">{subtitle}</div>}
          </div>
          {actions}
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{userInitial}</div>
        </header>

        {/* Page content */}
        <div className="page-content">
          {children}
        </div>
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const active = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path.split("/").slice(0, 2).join("/")));
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
      </nav>
    </div>
  );
}
