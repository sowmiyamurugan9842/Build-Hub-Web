# 🏗️ BuildHub — Construction Materials Platform

A centralized two-sided marketplace connecting construction-material **suppliers** (aggregates, hardware, electrical, plumbing, steel, cement, tools, paints, safety) with **engineer-buyers** (Civil, Electrical, MEP, Site, etc.). Built as a working POC with React + Vite.

> **Status:** Frontend-only POC with realistic fake data. All state lives in React Context with `localStorage` / `sessionStorage` persistence, designed for a clean swap to a real backend.

---

## 📦 Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Charts | Recharts v3 |
| State | React Context API (4 stores) |
| Persistence | `localStorage` (auth) + `sessionStorage` (orders) |
| Styling | CSS custom properties + inline styles for component-scoped UI |

---

## 🧭 Architecture — Two-Sided App

The same React app serves two completely different personas. Login routes the user to one of the two layouts.

```
┌────────────────────────────────┬────────────────────────────────┐
│        SUPPLIER APP            │         ENGINEER APP            │
├────────────────────────────────┼────────────────────────────────┤
│ /dashboard                     │ /engineer/home                  │
│ /orders/incoming   ← NEW       │ /engineer/suppliers             │
│ /stock                         │ /engineer/suppliers/:id         │
│ /customers                     │ /engineer/cart       ← NEW      │
│ /customers/:id                 │ /engineer/projects              │
│ /orders/new                    │ /engineer/projects/:id          │
│ /purchases/new                 │ /engineer/orders                │
│ /reports                       │                                 │
└────────────────────────────────┴────────────────────────────────┘
```

---

## 🔐 Authentication & Onboarding

- **3-step login flow** — Role select → Category/Specialty → Phone + OTP
- **Engineer roles:** Civil · Electrical · MEP · Site · Mechanical · Architect · Contractor (each with a `relevant[]` category list driving "FOR YOU" filters)
- **Supplier categories (9):** Aggregates · Cement · Steel · Hardware · Electrical · Plumbing · Paints · Tools · Safety
- **Session storage:** `localStorage.currentSupplierId` / `currentSupplierCategory`
- **Hero panel** with rotating feature pitches, stats, and a customer quote
- **Logout** clears localStorage and returns to `/login`

---

## 🏪 Supplier App Features

### Dashboard
- KPI cards: revenue, profit, payables, customers
- 6-month P&L line chart
- Recent orders list with status badges
- Quick-action launcher to other pages

### Stock Management 🆕 LIVE
Material inventory tied to engineer-side browsing (changes appear instantly across both apps).
- **Add stock** — record supplier purchase, increases inventory
- **Remove stock** — record sale or shrinkage
- **Adjust stock** — set absolute count with reason note
- **Create new material** — extend the catalog at runtime
- **Toggle availability** — show/hide an item without deleting it
- **Update rate** — live price changes reflect on engineer side
- **History feed** — every transaction logged with timestamp + reason
- All operations show a centered success popup

### Customer Management
- List view with search, archive filter
- Per-customer ledger page (ledger entries, balance, contact)
- **Add new customer** modal
- **Archive** auto-suggestion if customer paid fully + inactive 30+ days
- **Unarchive** flow

### New Sale Order
- 2-column layout: form + live order summary
- Live stock validation (insufficient-stock guard)
- GST calculation (CGST 2.5% + SGST 2.5%)
- Stock auto-reduces on submit
- Auto-generates invoice with linkable ID

### Purchase Entry (from crushers)
- Records purchase, increases stock
- Stock impact preview ("Current 120 → After 170 tons")
- Crusher payables banner
- GST computation (5%)

### Incoming Orders 🆕
**The order acceptance flow** — supplier sees engineer requests and decides what to do.
- **Tab strip** — All · Pending (pulses red when unread) · In Transit · Delivered · Rejected — with live counts
- **Pending order cards** show:
  - Material + qty × rate
  - Total amount
  - Engineer name + project + location
  - Two action buttons: **✓ Accept Order** (green) and **✕ Reject with Reason** (outlined red)
- **Inline reject form** — clicking Reject expands a textarea inline (no modal). Confirm button activates only when a reason is typed. Reason is shown to the engineer in their order history.
- **Inline deliver confirm** — In-transit orders have a "🚚 Mark as Delivered" button that expands a confirmation block inline.
- **Live red badge** on the sidebar nav showing pending count, auto-hides when reaching zero.
- **Toast notifications** for every action.

### Reports
- P&L breakdown
- Top customers, top materials charts
- Time-period filters

---

## 👷 Engineer App Features

### Home
- Hero with live counts (suppliers, categories, products)
- "Browse by Category" 9-tile grid with category-colored backgrounds
- **"FOR YOU" badges** on tiles relevant to the engineer's specialty
- Recent projects strip with progress bars
- Recent orders preview

### Find Suppliers
- City + category filters
- Category chip filter strip showing only categories with available shops
- Supplier cards with category-colored avatar icons, ratings, distance, response time, on-time %
- Quick browse by location (defaults to engineer's city)

### Supplier Shop (per-shop unique content)
Each of 14 shops has unique data — not template-cloned.
- Hero with category icon, shop name, owner photo, **tagline** (italic quote), **established year**, ratings, response time
- **About** section — narrative paragraph specific to the shop
- **Certifications** chips (ISO, TNPCB, MSME, etc.)
- **⭐ Featured by Owner** — owner's hand-picked top items
- **Material catalog** with:
  - Live stock from StockContext
  - Market average comparison ("save ₹35 vs avg")
  - Out-of-stock indicator
  - **+ Add to Cart** button with flash feedback ("✓ Added!")
  - Quantity-in-cart pill ("🛒 In Cart (3)")
- **Past orders with this shop** — filtered history

### Multi-Supplier Cart 🆕
The headline feature — engineers can shop across multiple suppliers in one session and check out with one action.
- **Live cart badge** in topbar, mobile header, and bottom nav
- **Items grouped by supplier** in the cart page
- Per-item qty stepper with stock validation
- Per-supplier subtotals, then global subtotal + GST + grand total
- **Link to Project** dropdown (mandatory before submit)
- **Multi-supplier explainer** banner: *"This order will go to N suppliers simultaneously, reducing stock at each shop instantly"*
- **Single submit fans out** to N orders (one per supplier), each reducing the right shop's stock
- **Success overlay** lists each placed order grouped by supplier with line totals

### My Projects
- Project list with progress bars, budget vs spent
- **Per-project detail page** with:
  - Hero with type, area, location, dates
  - **Construction Phases** timeline (Foundation → Slab → Walls → Roofing → Finishing) with allocated vs spent variance
  - **Planned vs Actual** ComposedChart (monthly)
  - **Material Mix** pie chart
  - **Material Consumption** table (allocated, used, remaining)
  - **Suppliers Used** grid
  - **Order History** for this project

### Order History
- Filters: search · supplier · project · status
- Status badges: ✓ Delivered · ⟳ In Transit · ◌ Pending · ✕ Rejected
- Supplier-wise spend AreaChart
- Status distribution PieChart
- Click row → opens supplier shop or project detail

---

## 🔄 Cross-Cutting Live Behavior

| Flow | What syncs across the apps |
|---|---|
| Supplier adds 50 tons stock | Engineer's shop view shows updated stock instantly |
| Engineer places order via cart | Supplier's "Incoming Orders" badge increments, new pending card appears |
| Supplier accepts order | Engineer's order status flips `pending → in-transit` |
| Supplier rejects with reason | Engineer's order shows status `rejected` and the reason in the row |
| Supplier marks delivered | Engineer's order shows `delivered` with timestamp |

---

## 🧰 State Management (4 Stores)

All in `src/store/`. Each store is a thin React Context with a clear external API.

### `StockContext.jsx`
Live inventory per supplier shop.
```js
useStock() → { stock, addStock, reduceStock, adjustStock, updateRate, toggleAvailable, createMaterial }
useSupplierCatalog(shopId) → merged catalog (fakeData + live stock + runtime-created materials)
```

### `CustomerContext.jsx`
Supplier's customer ledger.
```js
useCustomers() → { customers, addCustomer, archiveCustomer, unarchiveCustomer }
```

### `CartContext.jsx`
Engineer's active cart, grouped by supplier.
```js
useCart() → { items, itemsBySupplier, totalItems, totalValue, supplierCount,
              linkedProject, setLinkedProject, addToCart, updateQty, removeItem, clearCart }
```

### `OrdersContext.jsx` 🆕
All engineer orders + supplier acceptance flow. **Designed for clean backend swap.**
```js
useOrders() → { orders, addOrders, acceptOrder, rejectOrder, markDelivered,
                getOrdersForSupplier, getPendingCountForSupplier }
```

Inside, an isolated `OrderService` object handles persistence. To go live with a backend, replace its three methods with `fetch()` calls — every line is annotated with the corresponding REST endpoint.

```
load()          → GET    /api/orders
persist()       → (replaced by per-action calls below)
addOrders()     → POST   /api/orders
acceptOrder()   → PATCH  /api/orders/:id  { status: "in-transit" }
rejectOrder()   → PATCH  /api/orders/:id  { status: "rejected", rejectReason }
markDelivered() → PATCH  /api/orders/:id  { status: "delivered" }
```

**Provider hierarchy in `main.jsx`:**
```jsx
<StockProvider>
  <CustomerProvider>
    <OrdersProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </OrdersProvider>
  </CustomerProvider>
</StockProvider>
```

---

## 📊 Data Model (Fake but Realistic)

Located in `src/data/fakeData.js`.

| Entity | Count | Notes |
|---|---|---|
| Supplier shops | 14 | Across 9 categories, all with unique tagline/about/certs/featured items |
| Engineer specialties | 7 | Each with a `relevant[]` category array |
| Categories | 9 | Each with icon, color, gradient |
| Customers | 18 | With balances, ledgers, archive states |
| Crushers (suppliers' suppliers) | 5 | For purchase flow |
| Lorries | 5 | With drivers + capacity |
| Engineer projects | 4 | With phases, materials, monthly P&L |
| Engineer orders (seed) | 40+ | Across all categories and statuses |
| Materials (base) | 7 | Plus per-shop runtime additions |

---

## 🛣️ Backend Integration Path

The codebase is structured so that swapping to a real backend touches **one file per concern**:

| To replace | Edit |
|---|---|
| Order persistence + status changes | `src/store/OrdersContext.jsx` (the `OrderService` block) |
| Stock state | `src/store/StockContext.jsx` |
| Customer list | `src/store/CustomerContext.jsx` |
| Auth/session | `src/pages/Login.jsx` + `getCurrentSupplier()` helpers |

Components consume context APIs only — no direct storage calls — so once the service-layer functions are swapped, **no component needs changes**.

---

## ▶️ Running the Project

```bash
cd construction-poc
npm install
npm run dev
```

Then open `http://localhost:5173`.

**Logging in:**
- Pick **Supplier** → choose any category → enter any phone → use OTP `123456`
- Pick **Engineer** → choose any specialty → enter any phone → use OTP `123456`

To switch personas, log out and log in as the other role.

---

## 🗺️ Feature Build Timeline

| Phase | Built |
|---|---|
| **Phase 1** | Supplier-side core: Dashboard, Customers, Sales, Purchases, Reports, basic Login |
| **Phase 2 — Engineer side** | Home, Find Suppliers, Supplier Shop, Order, Projects, Order History |
| **Phase 2.5** | Stock Management linked to engineer-side shop views (live sync) |
| **Phase 2.6** | Multi-category expansion (9 categories), engineer specialties, FOR YOU filter |
| **Phase 2.7** | Per-shop unique data (taglines, about, certifications, featured items) |
| **Phase 2.8** | Login redesign — fill empty hero with feature content + stats |
| **Phase 3 — Multi-Supplier Cart** | CartContext + Cart page + multi-supplier checkout |
| **Phase 4 — Order Acceptance** | OrdersContext + IncomingOrders page (Accept / Reject with reason / Mark Delivered) |

---

## 🎯 What's NOT Built Yet (Possible Next Steps)

- Real authentication (currently any phone + OTP `123456` works)
- Real-time push (engineer needs to refresh to see status flips — context updates in same tab only)
- Photos/images on materials and shops
- Reviews & ratings flow
- Payment integration / invoices PDF download
- Map view of suppliers (currently text-only addresses)
- Engineer chat with supplier
- Notification center
- Analytics dashboard for platform-level metrics
