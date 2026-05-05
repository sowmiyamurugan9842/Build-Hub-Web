export const supplier = {
  name: "Sri Murugan Aggregates",
  gstin: "33AABCS1429B1ZB",
  phone: "9876543210",
  address: "No. 45, Arcot Road, Vandalur, Chennai - 600048",
  state: "Tamil Nadu",
  pincode: "600048",
};

export const customers = [
  { id: 1,  name: "Karthik Constructions",   phone: "9443211234", gstin: "33AABCK1429B1ZB", city: "Tambaram",      balance: 87500,  type: "contractor", lastActivity: "2026-04-29" },
  { id: 2,  name: "Raja Engineering Works",  phone: "9500012345", gstin: "33AABCR1234B1ZB", city: "Pallavaram",    balance: 145000, type: "contractor", lastActivity: "2026-04-27" },
  { id: 3,  name: "Senthil Builders",        phone: "9994433221", gstin: "",                city: "Chromepet",     balance: 32000,  type: "builder",    lastActivity: "2026-04-26" },
  { id: 4,  name: "Annadurai & Sons",        phone: "9876501234", gstin: "33AABCA9876B1ZB", city: "Vandalur",      balance: 210000, type: "contractor", lastActivity: "2026-04-29" },
  { id: 5,  name: "Priya Civil Works",       phone: "9443399887", gstin: "",                city: "Guduvanchery",  balance: 18500,  type: "engineer",   lastActivity: "2026-04-22" },
  { id: 6,  name: "Vijay Infrastructure",    phone: "9500056789", gstin: "33AABCV5678B1ZB", city: "Urapakkam",     balance: 67000,  type: "contractor", lastActivity: "2026-04-28" },
  { id: 7,  name: "Murugan & Co",            phone: "9994412345", gstin: "",                city: "Perungalathur", balance: 92500,  type: "builder",    lastActivity: "2026-04-24" },
  { id: 8,  name: "AKS Engineers",           phone: "9876598765", gstin: "33AABCA5432B1ZB", city: "Tambaram",      balance: 0,      type: "engineer",   lastActivity: "2026-03-14" },
  { id: 9,  name: "Balaji Constructions",    phone: "9443256789", gstin: "33AABCB2345B1ZB", city: "Pallavaram",    balance: 155000, type: "contractor", lastActivity: "2026-04-28" },
  { id: 10, name: "Krishnaswamy Builders",   phone: "9500023456", gstin: "",                city: "Chitlapakkam",  balance: 44000,  type: "builder",    lastActivity: "2026-04-25" },
  { id: 11, name: "Sri Ram Civil",           phone: "9994445678", gstin: "33AABCS6789B1ZB", city: "Vandalur",      balance: 78000,  type: "contractor", lastActivity: "2026-04-27" },
  { id: 12, name: "Lakshmi Constructions",   phone: "9876567890", gstin: "",                city: "Chromepet",     balance: 23500,  type: "builder",    lastActivity: "2026-04-23" },
  { id: 13, name: "Ganesh Engineering",      phone: "9443278901", gstin: "33AABCG7890B1ZB", city: "Guduvanchery",  balance: 312000, type: "contractor", lastActivity: "2026-04-29" },
  { id: 14, name: "Saravanan & Brothers",    phone: "9500034567", gstin: "",                city: "Tambaram",      balance: 56000,  type: "contractor", lastActivity: "2026-04-21" },
  { id: 15, name: "Selvam Constructions",    phone: "9994467890", gstin: "33AABCS8901B1ZB", city: "Urapakkam",     balance: 14000,  type: "builder",    lastActivity: "2026-04-26" },
  { id: 16, name: "TN Roads & Buildings",    phone: "9876589012", gstin: "33AABCT9012B1ZB", city: "Chennai",       balance: 425000, type: "contractor", lastActivity: "2026-04-29" },
  { id: 17, name: "Pandi Works",             phone: "9443290123", gstin: "",                city: "Perungalathur", balance: 0,      type: "engineer",   lastActivity: "2026-02-18" },
  { id: 18, name: "Sundar Civil Contractors",phone: "9500045678", gstin: "33AABCS0123B1ZB", city: "Pallavaram",    balance: 190000, type: "contractor", lastActivity: "2026-04-30" },
];

export const crushers = [
  { id: 1, name: "Sri Vinayaga Quarry", phone: "9443100001", gstin: "33AABCS1111B1ZB", city: "Thiruporur", balance: 68000 },
  { id: 2, name: "Murugan Stone Crusher", phone: "9443100002", gstin: "33AABCM2222B1ZB", city: "Sriperumbudur", balance: 125000 },
  { id: 3, name: "Vel Aggregates Pvt Ltd", phone: "9443100003", gstin: "33AABCV3333B1ZB", city: "Madurantakam", balance: 45000 },
  { id: 4, name: "Annai Quarry Works", phone: "9443100004", gstin: "33AABCA4444B1ZB", city: "Kancheepuram", balance: 92000 },
  { id: 5, name: "SSK Blue Metal", phone: "9443100005", gstin: "33AABCS5555B1ZB", city: "Chengalpattu", balance: 37500 },
];

export const materials = [
  { id: 1, name: "River Sand", unit: "ton", defaultRate: 3200 },
  { id: 2, name: "M-Sand (Manufactured)", unit: "ton", defaultRate: 1800 },
  { id: 3, name: "Blue Metal (40mm)", unit: "ton", defaultRate: 2100 },
  { id: 4, name: "Blue Metal (20mm)", unit: "ton", defaultRate: 2300 },
  { id: 5, name: "Blue Metal (12mm)", unit: "ton", defaultRate: 2500 },
  { id: 6, name: "Jelly (6mm)", unit: "ton", defaultRate: 2700 },
  { id: 7, name: "Quarry Dust", unit: "ton", defaultRate: 1200 },
];

export const lorries = [
  { id: 1, number: "TN 01 AB 1234", driver: "Murugesan", capacity: "10 ton" },
  { id: 2, number: "TN 01 CD 5678", driver: "Selvakumar", capacity: "12 ton" },
  { id: 3, number: "TN 22 EF 9012", driver: "Rajan", capacity: "10 ton" },
  { id: 4, number: "TN 22 GH 3456", driver: "Suresh", capacity: "8 ton" },
  { id: 5, number: "TN 77 IJ 7890", driver: "Arumugam", capacity: "12 ton" },
];

export const customerLedgers = {
  1: [
    { id: 1, date: "2026-04-28", desc: "Blue Metal 20mm – 5 loads", type: "sale", amount: 57500, balance: 87500 },
    { id: 2, date: "2026-04-25", desc: "Payment received – NEFT", type: "payment", amount: -50000, balance: 30000 },
    { id: 3, date: "2026-04-22", desc: "M-Sand – 8 loads", type: "sale", amount: 72000, balance: 80000 },
    { id: 4, date: "2026-04-18", desc: "River Sand – 3 loads", type: "sale", amount: 48000, balance: 8000 },
    { id: 5, date: "2026-04-15", desc: "Payment received – Cash", type: "payment", amount: -40000, balance: -40000 },
    { id: 6, date: "2026-04-10", desc: "Blue Metal 40mm – 4 loads", type: "sale", amount: 42000, balance: 0 },
  ],
  2: [
    { id: 1, date: "2026-04-27", desc: "River Sand – 10 loads", type: "sale", amount: 160000, balance: 145000 },
    { id: 2, date: "2026-04-20", desc: "Payment received – Cheque", type: "payment", amount: -100000, balance: -15000 },
    { id: 3, date: "2026-04-15", desc: "M-Sand – 12 loads", type: "sale", amount: 86400, balance: 85000 },
    { id: 4, date: "2026-04-08", desc: "Payment received – NEFT", type: "payment", amount: -80000, balance: -1400 },
    { id: 5, date: "2026-04-02", desc: "Blue Metal 20mm – 7 loads", type: "sale", amount: 80500, balance: 78600 },
  ],
  4: [
    { id: 1, date: "2026-04-29", desc: "M-Sand – 15 loads", type: "sale", amount: 135000, balance: 210000 },
    { id: 2, date: "2026-04-24", desc: "Blue Metal 40mm – 6 loads", type: "sale", amount: 63000, balance: 75000 },
    { id: 3, date: "2026-04-18", desc: "Payment received – Cash", type: "payment", amount: -25000, balance: 12000 },
    { id: 4, date: "2026-04-12", desc: "Quarry Dust – 10 loads", type: "sale", amount: 60000, balance: 37000 },
    { id: 5, date: "2026-04-05", desc: "Payment received – NEFT", type: "payment", amount: -23000, balance: -23000 },
  ],
};

function getDefaultLedger(customerId) {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return [];
  const balance = customer.balance;
  return [
    { id: 1, date: "2026-04-26", desc: "M-Sand – 4 loads", type: "sale", amount: Math.round(balance * 0.4), balance },
    { id: 2, date: "2026-04-20", desc: "Blue Metal 20mm – 3 loads", type: "sale", amount: Math.round(balance * 0.3), balance: Math.round(balance * 0.6) },
    { id: 3, date: "2026-04-14", desc: "Payment received – Cash", type: "payment", amount: -Math.round(balance * 0.2), balance: Math.round(balance * 0.3) },
    { id: 4, date: "2026-04-08", desc: "River Sand – 2 loads", type: "sale", amount: Math.round(balance * 0.3), balance: Math.round(balance * 0.5) },
    { id: 5, date: "2026-04-02", desc: "Opening balance", type: "opening", amount: Math.round(balance * 0.2), balance: Math.round(balance * 0.2) },
  ];
}

export function getLedger(customerId) {
  return customerLedgers[customerId] || getDefaultLedger(customerId);
}

export const dashboardStats = {
  todaySales: 284500,
  pendingCollections: 1958500,
  todayPayables: 125000,
  monthSales: 4250000,
  monthPurchases: 2890000,
  monthProfit: 1360000,
};

export const recentOrders = [
  { id: "INV-2026-0142", date: "2026-04-29 10:30", customer: "Annadurai & Sons", material: "M-Sand (Manufactured)", qty: 15, rate: 1800, total: 135000, status: "delivered" },
  { id: "INV-2026-0141", date: "2026-04-29 09:15", customer: "Karthik Constructions", material: "Blue Metal (20mm)", qty: 5, rate: 2300, total: 57500, status: "in-transit" },
  { id: "INV-2026-0140", date: "2026-04-28 16:45", customer: "TN Roads & Buildings", material: "River Sand", qty: 8, rate: 3200, total: 64000, status: "delivered" },
  { id: "INV-2026-0139", date: "2026-04-28 14:00", customer: "Balaji Constructions", material: "Blue Metal (40mm)", qty: 10, rate: 2100, total: 105000, status: "delivered" },
];

export const monthlyPL = [
  { month: "Nov 2025", sales: 2850000, purchases: 1920000, profit: 930000 },
  { month: "Dec 2025", sales: 3120000, purchases: 2100000, profit: 1020000 },
  { month: "Jan 2026", sales: 3680000, purchases: 2480000, profit: 1200000 },
  { month: "Feb 2026", sales: 3290000, purchases: 2190000, profit: 1100000 },
  { month: "Mar 2026", sales: 4100000, purchases: 2750000, profit: 1350000 },
  { month: "Apr 2026", sales: 4250000, purchases: 2890000, profit: 1360000 },
];

/* ── PHASE 2 — Projects (site-wise costing) ── */
export const projects = [
  {
    id: "PRJ-001",
    name: "Vandalur Villa Block-3",
    location: "Vandalur, Chennai",
    type: "Residential Villa",
    customerId: 4, // Annadurai & Sons
    status: "active",
    startDate: "2026-02-15",
    endDate: "2026-08-30",
    budget: 1850000,
    spent: 1240000,
    area: "1,200 sqft",
    progress: 68,
    phases: [
      { name: "Foundation", status: "completed", allocated: 420000, spent: 412000, progress: 100 },
      { name: "Slab",       status: "completed", allocated: 380000, spent: 395000, progress: 100 },
      { name: "Walls",      status: "in-progress", allocated: 540000, spent: 433000, progress: 80 },
      { name: "Roofing",    status: "pending",   allocated: 310000, spent: 0,      progress: 0 },
      { name: "Finishing",  status: "pending",   allocated: 200000, spent: 0,      progress: 0 },
    ],
    materials: [
      { materialId: 2, name: "M-Sand (Manufactured)", allocated: 180, used: 142, unit: "ton", rate: 1800 },
      { materialId: 3, name: "Blue Metal (40mm)",     allocated: 95,  used: 78,  unit: "ton", rate: 2100 },
      { materialId: 4, name: "Blue Metal (20mm)",     allocated: 60,  used: 45,  unit: "ton", rate: 2300 },
      { materialId: 1, name: "River Sand",            allocated: 40,  used: 22,  unit: "ton", rate: 3200 },
    ],
    deliveries: [
      { date: "2026-04-29", material: "M-Sand", qty: 15, amount: 27000 },
      { date: "2026-04-24", material: "Blue Metal 40mm", qty: 6, amount: 12600 },
      { date: "2026-04-12", material: "Quarry Dust", qty: 10, amount: 12000 },
      { date: "2026-04-05", material: "M-Sand", qty: 12, amount: 21600 },
      { date: "2026-03-28", material: "Blue Metal 20mm", qty: 8, amount: 18400 },
    ],
    monthlySpend: [
      { month: "Feb", planned: 280000, actual: 195000 },
      { month: "Mar", planned: 420000, actual: 462000 },
      { month: "Apr", planned: 380000, actual: 583000 },
      { month: "May", planned: 410000, actual: 0 },
      { month: "Jun", planned: 280000, actual: 0 },
      { month: "Jul", planned: 80000,  actual: 0 },
    ],
  },
  {
    id: "PRJ-002",
    name: "TN Highway Bridge - Sec 4",
    location: "GST Road, Chennai",
    type: "Infrastructure",
    customerId: 16, // TN Roads & Buildings
    status: "active",
    startDate: "2026-01-08",
    endDate: "2026-12-15",
    budget: 4250000,
    spent: 1980000,
    area: "320m span",
    progress: 46,
    phases: [
      { name: "Site Prep",  status: "completed",   allocated: 380000,  spent: 372000,  progress: 100 },
      { name: "Foundation", status: "completed",   allocated: 920000,  spent: 941000,  progress: 100 },
      { name: "Pillars",    status: "in-progress", allocated: 1180000, spent: 667000,  progress: 56 },
      { name: "Deck",       status: "pending",     allocated: 1050000, spent: 0,       progress: 0 },
      { name: "Finishing",  status: "pending",     allocated: 720000,  spent: 0,       progress: 0 },
    ],
    materials: [
      { materialId: 3, name: "Blue Metal (40mm)", allocated: 380, used: 198, unit: "ton", rate: 2100 },
      { materialId: 4, name: "Blue Metal (20mm)", allocated: 220, used: 124, unit: "ton", rate: 2300 },
      { materialId: 2, name: "M-Sand",            allocated: 280, used: 156, unit: "ton", rate: 1800 },
      { materialId: 7, name: "Quarry Dust",       allocated: 90,  used: 38,  unit: "ton", rate: 1200 },
    ],
    deliveries: [
      { date: "2026-04-28", material: "River Sand", qty: 8, amount: 64000 },
      { date: "2026-04-20", material: "Blue Metal 40mm", qty: 12, amount: 25200 },
      { date: "2026-04-14", material: "M-Sand", qty: 18, amount: 32400 },
      { date: "2026-04-02", material: "Blue Metal 20mm", qty: 10, amount: 23000 },
    ],
    monthlySpend: [
      { month: "Jan", planned: 420000, actual: 388000 },
      { month: "Feb", planned: 580000, actual: 612000 },
      { month: "Mar", planned: 650000, actual: 595000 },
      { month: "Apr", planned: 480000, actual: 385000 },
      { month: "May", planned: 540000, actual: 0 },
      { month: "Jun", planned: 620000, actual: 0 },
    ],
  },
  {
    id: "PRJ-003",
    name: "Karthik Apartments Phase-1",
    location: "Tambaram, Chennai",
    type: "Residential Apartment",
    customerId: 1, // Karthik Constructions
    status: "active",
    startDate: "2026-03-01",
    endDate: "2026-10-30",
    budget: 2980000,
    spent: 720000,
    area: "8,400 sqft, G+3",
    progress: 24,
    phases: [
      { name: "Foundation", status: "in-progress", allocated: 680000,  spent: 612000, progress: 90 },
      { name: "Ground Slab", status: "in-progress", allocated: 540000, spent: 108000, progress: 20 },
      { name: "Floors 1-3",  status: "pending",     allocated: 1280000, spent: 0,     progress: 0 },
      { name: "Roofing",     status: "pending",     allocated: 280000,  spent: 0,     progress: 0 },
      { name: "Finishing",   status: "pending",     allocated: 200000,  spent: 0,     progress: 0 },
    ],
    materials: [
      { materialId: 2, name: "M-Sand",            allocated: 240, used: 68,  unit: "ton", rate: 1800 },
      { materialId: 3, name: "Blue Metal (40mm)", allocated: 160, used: 42,  unit: "ton", rate: 2100 },
      { materialId: 1, name: "River Sand",        allocated: 80,  used: 18,  unit: "ton", rate: 3200 },
      { materialId: 7, name: "Quarry Dust",       allocated: 40,  used: 12,  unit: "ton", rate: 1200 },
    ],
    deliveries: [
      { date: "2026-04-29", material: "Blue Metal 20mm", qty: 5, amount: 11500 },
      { date: "2026-04-15", material: "M-Sand", qty: 14, amount: 25200 },
      { date: "2026-04-08", material: "Blue Metal 40mm", qty: 8, amount: 16800 },
    ],
    monthlySpend: [
      { month: "Mar", planned: 320000, actual: 285000 },
      { month: "Apr", planned: 480000, actual: 435000 },
      { month: "May", planned: 620000, actual: 0 },
      { month: "Jun", planned: 580000, actual: 0 },
      { month: "Jul", planned: 540000, actual: 0 },
      { month: "Aug", planned: 440000, actual: 0 },
    ],
  },
  {
    id: "PRJ-004",
    name: "Senthil Bungalow",
    location: "Chromepet, Chennai",
    type: "Residential Villa",
    customerId: 3, // Senthil Builders
    status: "completed",
    startDate: "2025-09-10",
    endDate: "2026-03-25",
    budget: 1420000,
    spent: 1395000,
    area: "950 sqft",
    progress: 100,
    phases: [
      { name: "Foundation", status: "completed", allocated: 290000, spent: 285000, progress: 100 },
      { name: "Slab",       status: "completed", allocated: 280000, spent: 295000, progress: 100 },
      { name: "Walls",      status: "completed", allocated: 420000, spent: 408000, progress: 100 },
      { name: "Roofing",    status: "completed", allocated: 240000, spent: 232000, progress: 100 },
      { name: "Finishing",  status: "completed", allocated: 190000, spent: 175000, progress: 100 },
    ],
    materials: [
      { materialId: 2, name: "M-Sand",            allocated: 130, used: 128, unit: "ton", rate: 1800 },
      { materialId: 3, name: "Blue Metal (40mm)", allocated: 70,  used: 72,  unit: "ton", rate: 2100 },
      { materialId: 4, name: "Blue Metal (20mm)", allocated: 45,  used: 44,  unit: "ton", rate: 2300 },
    ],
    deliveries: [],
    monthlySpend: [
      { month: "Sep", planned: 180000, actual: 175000 },
      { month: "Oct", planned: 240000, actual: 248000 },
      { month: "Nov", planned: 280000, actual: 285000 },
      { month: "Dec", planned: 290000, actual: 295000 },
      { month: "Jan", planned: 220000, actual: 218000 },
      { month: "Feb", planned: 150000, actual: 148000 },
      { month: "Mar", planned: 60000,  actual: 26000  },
    ],
  },
];

export function getProject(id) {
  return projects.find((p) => p.id === id);
}

/* ══════════════════════════════════════════════════════════════
   ENGINEER (BUYER) SIDE — Phase 2
   ══════════════════════════════════════════════════════════════ */

/* ── Marketplace categories ── */
export const categories = [
  { id: "aggregates",  name: "Aggregates",          icon: "🪨",  desc: "Sand, M-Sand, Blue Metal, Jelly",      color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "cement",      name: "Cement & Concrete",   icon: "🧱",  desc: "OPC, PPC, Ready-mix concrete",         color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
  { id: "steel",       name: "Steel & TMT",         icon: "🔩",  desc: "Rebar, binding wire, structural",      color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { id: "hardware",    name: "Hardware & Tools",    icon: "🔧",  desc: "Nails, screws, fasteners, tools",      color: "#8b5cf6", bg: "#faf5ff", border: "#e9d5ff" },
  { id: "electricals", name: "Electricals",         icon: "⚡",  desc: "Wires, MCBs, switches, lights",        color: "#eab308", bg: "#fefce8", border: "#fef08a" },
  { id: "plumbing",    name: "Plumbing",            icon: "🚿",  desc: "Pipes, fittings, taps, valves",        color: "#06b6d4", bg: "#ecfeff", border: "#a5f3fc" },
  { id: "tiles",       name: "Tiles & Sanitary",    icon: "🛁",  desc: "Floor tiles, marble, sanitary ware",   color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8" },
  { id: "paints",      name: "Paints & Finishing",  icon: "🎨",  desc: "Paint, primers, putty, sealants",      color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
  { id: "wood",        name: "Wood & Boards",       icon: "🪵",  desc: "Plywood, MDF, doors, frames",          color: "#a16207", bg: "#fefce8", border: "#fde68a" },
];

export function getCategory(id) { return categories.find((c) => c.id === id); }

/* ── Engineer / buyer specialties ── */
export const engineerSpecialties = [
  { id: "civil",      name: "Civil Engineer",      icon: "🏗️", relevant: ["aggregates", "cement", "steel"] },
  { id: "site",       name: "Site Engineer",       icon: "📐", relevant: ["aggregates", "cement", "steel", "hardware"] },
  { id: "structural", name: "Structural Engineer", icon: "🏛️", relevant: ["cement", "steel", "aggregates"] },
  { id: "electrical", name: "Electrical Engineer", icon: "⚡", relevant: ["electricals", "hardware"] },
  { id: "mep",        name: "MEP Engineer",        icon: "🔌", relevant: ["electricals", "plumbing", "hardware"] },
  { id: "interior",   name: "Interior Designer",   icon: "🛋️", relevant: ["tiles", "paints", "wood", "hardware"] },
  { id: "contractor", name: "General Contractor",  icon: "👷", relevant: ["aggregates", "cement", "steel", "hardware", "electricals", "plumbing", "tiles", "paints", "wood"] },
];

export function getSpecialty(id) { return engineerSpecialties.find((s) => s.id === id); }

export const currentEngineer = {
  id: "ENG-101",
  name: "Murali Iyer",
  phone: "9444512345",
  email: "murali@iyerconstructions.in",
  company: "Iyer Constructions",
  role: "Civil Engineer",
  specialtyId: "civil",
  city: "Chennai",
  area: "Vandalur",
  joined: "2025-08-15",
  totalSpend: 1845000,
  activeProjects: 3,
};

export const cities = [
  { id: "chennai",       name: "Chennai",       state: "Tamil Nadu", suppliers: 5, materials: 28 },
  { id: "kanchipuram",   name: "Kanchipuram",   state: "Tamil Nadu", suppliers: 3, materials: 18 },
  { id: "coimbatore",    name: "Coimbatore",    state: "Tamil Nadu", suppliers: 4, materials: 22 },
  { id: "madurai",       name: "Madurai",       state: "Tamil Nadu", suppliers: 2, materials: 14 },
  { id: "salem",         name: "Salem",         state: "Tamil Nadu", suppliers: 2, materials: 12 },
  { id: "trichy",        name: "Trichy",        state: "Tamil Nadu", suppliers: 3, materials: 16 },
];

/* Supplier shops the engineer can browse */
export const supplierShops = [
  {
    id: "SUP-001",
    name: "Sri Murugan Aggregates",
    owner: "Murugan",
    category: "aggregates",
    tagline: "Same-day delivery for Vandalur & Tambaram sites",
    about: "Family-run quarry partnering with TN govt projects since 2017. Direct sourcing from Thiruporur quarries means you skip middlemen.",
    established: 2017,
    certifications: ["ISO 9001:2015", "TNPCB Compliant"],
    featuredIds: [2, 4],
    city: "chennai",
    area: "Vandalur",
    distance: 4.2,
    rating: 4.7,
    reviewCount: 128,
    responseTime: "< 30 min",
    onTimeRate: 96,
    yearsActive: 8,
    phone: "9876543210",
    gstin: "33AABCS1429B1ZB",
    verified: true,
    deliveryRadius: 50,
    catalog: [
      { materialId: 1, name: "River Sand",            unit: "ton", rate: 3200, available: true,  stock: 120 },
      { materialId: 2, name: "M-Sand (Manufactured)", unit: "ton", rate: 1800, available: true,  stock: 320 },
      { materialId: 3, name: "Blue Metal (40mm)",     unit: "ton", rate: 2100, available: true,  stock: 180 },
      { materialId: 4, name: "Blue Metal (20mm)",     unit: "ton", rate: 2300, available: true,  stock: 200 },
      { materialId: 5, name: "Blue Metal (12mm)",     unit: "ton", rate: 2500, available: false, stock: 0   },
      { materialId: 7, name: "Quarry Dust",           unit: "ton", rate: 1200, available: true,  stock: 90  },
    ],
    tags: ["Trusted Partner", "GST Invoice", "Cash/UPI"],
  },
  {
    id: "SUP-002",
    name: "Vel Aggregates Pvt Ltd",
    owner: "Velmurugan",
    category: "aggregates",
    tagline: "Bulk orders > 50 tons get up to 7% discount",
    about: "Largest aggregates supplier in Madurantakam region. Owns 3 quarries and 12 lorries — guaranteed availability for highway and apartment projects.",
    established: 2014,
    certifications: ["ISO 9001:2015", "ISI Marked", "GeM Registered"],
    featuredIds: [3, 2],
    city: "chennai",
    area: "Madurantakam",
    distance: 12.8,
    rating: 4.4,
    reviewCount: 86,
    responseTime: "< 1 hr",
    onTimeRate: 91,
    yearsActive: 12,
    phone: "9443100003",
    gstin: "33AABCV3333B1ZB",
    verified: true,
    deliveryRadius: 80,
    catalog: [
      { materialId: 1, name: "River Sand",            unit: "ton", rate: 3100, available: true,  stock: 80  },
      { materialId: 2, name: "M-Sand (Manufactured)", unit: "ton", rate: 1850, available: true,  stock: 250 },
      { materialId: 3, name: "Blue Metal (40mm)",     unit: "ton", rate: 2050, available: true,  stock: 220 },
      { materialId: 4, name: "Blue Metal (20mm)",     unit: "ton", rate: 2280, available: true,  stock: 180 },
      { materialId: 6, name: "Jelly (6mm)",           unit: "ton", rate: 2650, available: true,  stock: 60  },
    ],
    tags: ["Bulk Supplier", "GST Invoice"],
  },
  {
    id: "SUP-003",
    name: "SSK Blue Metal",
    owner: "Sundar",
    category: "aggregates",
    tagline: "Specialist in 12mm & 20mm blue metal at the lowest rate",
    about: "We focus only on blue metal — no sand, no quarry dust. Sharp, clean, well-graded material straight from our crusher in Chengalpattu.",
    established: 2020,
    certifications: ["TNPCB Compliant"],
    featuredIds: [4, 5],
    city: "chennai",
    area: "Chengalpattu",
    distance: 18.5,
    rating: 4.6,
    reviewCount: 64,
    responseTime: "< 45 min",
    onTimeRate: 94,
    yearsActive: 6,
    phone: "9443100005",
    gstin: "33AABCS5555B1ZB",
    verified: true,
    deliveryRadius: 60,
    catalog: [
      { materialId: 3, name: "Blue Metal (40mm)",     unit: "ton", rate: 2080, available: true,  stock: 140 },
      { materialId: 4, name: "Blue Metal (20mm)",     unit: "ton", rate: 2250, available: true,  stock: 160 },
      { materialId: 5, name: "Blue Metal (12mm)",     unit: "ton", rate: 2480, available: true,  stock: 90  },
      { materialId: 7, name: "Quarry Dust",           unit: "ton", rate: 1150, available: true,  stock: 110 },
    ],
    tags: ["Best Rates"],
  },
  {
    id: "SUP-004",
    name: "Annai Quarry Works",
    owner: "Sekar",
    category: "aggregates",
    tagline: "Premium river sand sourced from Cauvery basin",
    about: "Boutique supplier known for clean, screened river sand. Slightly higher rates but trusted by interior contractors and bungalow builders.",
    established: 2022,
    certifications: ["TNPCB Compliant"],
    featuredIds: [1, 6],
    city: "chennai",
    area: "Kancheepuram",
    distance: 24.3,
    rating: 4.2,
    reviewCount: 42,
    responseTime: "1-2 hrs",
    onTimeRate: 88,
    yearsActive: 4,
    phone: "9443100004",
    gstin: "33AABCA4444B1ZB",
    verified: true,
    deliveryRadius: 70,
    catalog: [
      { materialId: 1, name: "River Sand",            unit: "ton", rate: 3250, available: true,  stock: 60  },
      { materialId: 2, name: "M-Sand (Manufactured)", unit: "ton", rate: 1820, available: true,  stock: 180 },
      { materialId: 6, name: "Jelly (6mm)",           unit: "ton", rate: 2700, available: true,  stock: 40  },
      { materialId: 7, name: "Quarry Dust",           unit: "ton", rate: 1180, available: true,  stock: 80  },
    ],
    tags: ["GST Invoice"],
  },
  {
    id: "SUP-005",
    name: "Thiruporur Quarry",
    owner: "Vinayagam",
    category: "aggregates",
    tagline: "Best cash rates — 5% off on UPI within 24 hrs",
    about: "Cost-conscious choice for budget projects. Newer operation, building reputation. Cash-and-carry pricing unmatched in the region.",
    established: 2023,
    certifications: [],
    featuredIds: [3, 7],
    city: "chennai",
    area: "Thiruporur",
    distance: 32.0,
    rating: 4.0,
    reviewCount: 28,
    responseTime: "2 hrs",
    onTimeRate: 84,
    yearsActive: 3,
    phone: "9443100001",
    gstin: "33AABCS1111B1ZB",
    verified: false,
    deliveryRadius: 50,
    catalog: [
      { materialId: 3, name: "Blue Metal (40mm)",     unit: "ton", rate: 2150, available: true,  stock: 80  },
      { materialId: 4, name: "Blue Metal (20mm)",     unit: "ton", rate: 2350, available: true,  stock: 100 },
      { materialId: 7, name: "Quarry Dust",           unit: "ton", rate: 1220, available: true,  stock: 70  },
    ],
    tags: ["Cash Discount"],
  },
  /* Other cities (lighter data) */
  {
    id: "SUP-006",
    name: "Coimbatore Stone Works",
    owner: "Selvam",
    category: "aggregates",
    tagline: "Coimbatore's most-rated supplier for industrial sites",
    about: "Decade-long partnerships with Coimbatore textile mills and industrial parks. Specialized in high-volume orders with predictable scheduling.",
    established: 2016,
    certifications: ["ISO 9001:2015"],
    featuredIds: [3, 4],
    city: "coimbatore",
    area: "Saravanampatti",
    distance: 6.5,
    rating: 4.5,
    reviewCount: 92,
    responseTime: "< 1 hr",
    onTimeRate: 92,
    yearsActive: 10,
    phone: "9443200001",
    gstin: "33AABCC6666B1ZB",
    verified: true,
    deliveryRadius: 60,
    catalog: [
      { materialId: 2, name: "M-Sand (Manufactured)", unit: "ton", rate: 1750, available: true, stock: 280 },
      { materialId: 3, name: "Blue Metal (40mm)",     unit: "ton", rate: 2000, available: true, stock: 220 },
      { materialId: 4, name: "Blue Metal (20mm)",     unit: "ton", rate: 2200, available: true, stock: 180 },
    ],
    tags: ["Verified"],
  },

  /* ── CEMENT & CONCRETE ── */
  {
    id: "SUP-007",
    name: "TN Cement Depot",
    owner: "Ravi Kumar",
    category: "cement",
    tagline: "All major brands under one roof — UltraTech, Ramco, Dalmia",
    about: "Authorized dealer for 5 cement brands. Climate-controlled godown keeps PPC fresh up to 60 days. Bulk pricing kicks in at 100 bags.",
    established: 2014,
    certifications: ["UltraTech Authorized", "Ramco Authorized", "Dalmia Authorized"],
    featuredIds: [101, 104],
    city: "chennai",
    area: "Tambaram",
    distance: 8.5,
    rating: 4.6,
    reviewCount: 156,
    responseTime: "< 30 min",
    onTimeRate: 95,
    yearsActive: 11,
    phone: "9443200007",
    gstin: "33AABCT7777B1ZB",
    verified: true,
    deliveryRadius: 60,
    catalog: [
      { materialId: 101, name: "OPC 53 Grade (Ramco)",  unit: "bag", rate: 420,  available: true,  stock: 1200 },
      { materialId: 102, name: "OPC 43 Grade (Dalmia)", unit: "bag", rate: 395,  available: true,  stock: 800  },
      { materialId: 103, name: "PPC (UltraTech)",       unit: "bag", rate: 380,  available: true,  stock: 950  },
      { materialId: 104, name: "Ready-Mix Concrete M20",unit: "cum", rate: 5200, available: true,  stock: 80   },
      { materialId: 105, name: "Ready-Mix Concrete M25",unit: "cum", rate: 5800, available: true,  stock: 60   },
      { materialId: 106, name: "White Cement (Birla)",  unit: "bag", rate: 850,  available: true,  stock: 220  },
    ],
    tags: ["Brand Authorized", "GST Invoice", "Bulk Discount"],
  },

  /* ── STEEL & TMT ── */
  {
    id: "SUP-008",
    name: "Steelmart Tamil Nadu",
    owner: "Karthikeyan",
    category: "steel",
    tagline: "Pre-cut & pre-bent rebar delivered to site (free)",
    about: "TMT specialists with on-site cutting and bending services. Tata, JSW, SAIL all stocked. Traceable test certificates with every batch.",
    established: 2011,
    certifications: ["Tata Authorized", "JSW Authorized", "SAIL Distributor", "BIS Certified"],
    featuredIds: [203, 204],
    city: "chennai",
    area: "Pallavaram",
    distance: 11.2,
    rating: 4.5,
    reviewCount: 98,
    responseTime: "< 1 hr",
    onTimeRate: 93,
    yearsActive: 14,
    phone: "9443200008",
    gstin: "33AABCS8888B1ZB",
    verified: true,
    deliveryRadius: 80,
    catalog: [
      { materialId: 201, name: "TMT Bar 8mm (Tata)",     unit: "ton", rate: 62000, available: true,  stock: 25 },
      { materialId: 202, name: "TMT Bar 10mm (Tata)",    unit: "ton", rate: 61500, available: true,  stock: 32 },
      { materialId: 203, name: "TMT Bar 12mm (JSW)",     unit: "ton", rate: 61000, available: true,  stock: 40 },
      { materialId: 204, name: "TMT Bar 16mm (JSW)",     unit: "ton", rate: 60500, available: true,  stock: 28 },
      { materialId: 205, name: "TMT Bar 20mm (SAIL)",    unit: "ton", rate: 60000, available: true,  stock: 18 },
      { materialId: 206, name: "Binding Wire 18 SWG",    unit: "kg",  rate: 85,    available: true,  stock: 450 },
      { materialId: 207, name: "MS Angle 50x50x6mm",     unit: "kg",  rate: 78,    available: true,  stock: 380 },
    ],
    tags: ["Tata Authorized", "JSW Authorized", "GST Invoice"],
  },

  /* ── HARDWARE & TOOLS ── */
  {
    id: "SUP-009",
    name: "Velan Hardware Mart",
    owner: "Velan",
    category: "hardware",
    tagline: "18 years serving Chromepet contractors — open Sundays",
    about: "Old-school neighborhood hardware kadai modernized. Stocks 4000+ SKUs across nails, fasteners, and tools. Knowledgeable owner who'll suggest exact specs.",
    established: 2007,
    certifications: ["Stanley Dealer", "Bosch Dealer"],
    featuredIds: [305, 308],
    city: "chennai",
    area: "Chromepet",
    distance: 6.8,
    rating: 4.8,
    reviewCount: 245,
    responseTime: "< 20 min",
    onTimeRate: 97,
    yearsActive: 18,
    phone: "9443200009",
    gstin: "33AABCV9999B1ZB",
    verified: true,
    deliveryRadius: 40,
    catalog: [
      { materialId: 301, name: "Wire Nails 2 inch",           unit: "kg",  rate: 95,   available: true, stock: 120 },
      { materialId: 302, name: "Wire Nails 4 inch",           unit: "kg",  rate: 88,   available: true, stock: 180 },
      { materialId: 303, name: "Galvanized Screws (200pc)",   unit: "box", rate: 320,  available: true, stock: 65  },
      { materialId: 304, name: "Anchor Bolts 12mm",           unit: "pc",  rate: 45,   available: true, stock: 800 },
      { materialId: 305, name: "Hammer (Stanley 1lb)",        unit: "pc",  rate: 480,  available: true, stock: 28  },
      { materialId: 306, name: "Trowel (Plastering)",         unit: "pc",  rate: 280,  available: true, stock: 42  },
      { materialId: 307, name: "Measuring Tape 5m",           unit: "pc",  rate: 180,  available: true, stock: 56  },
      { materialId: 308, name: "Drill Bit Set HSS",           unit: "set", rate: 850,  available: true, stock: 18  },
    ],
    tags: ["All Brands", "Same-day Delivery", "GST Invoice"],
  },

  /* ── ELECTRICALS ── */
  {
    id: "SUP-010",
    name: "Lightning Electrical Stores",
    owner: "Shankar",
    category: "electricals",
    tagline: "Complete house wiring kit — itemized BOM in 10 min",
    about: "Polycab + Havells + Schneider authorized. We prepare exact-quantity electrical BOMs for 1BHK to 4BHK villa projects. Free site survey on orders > ₹50K.",
    established: 2016,
    certifications: ["Polycab Authorized", "Havells Authorized", "Schneider Premium Partner"],
    featuredIds: [402, 405],
    city: "chennai",
    area: "Guduvanchery",
    distance: 14.5,
    rating: 4.7,
    reviewCount: 178,
    responseTime: "< 45 min",
    onTimeRate: 94,
    yearsActive: 9,
    phone: "9443200010",
    gstin: "33AABCL1010B1ZB",
    verified: true,
    deliveryRadius: 60,
    catalog: [
      { materialId: 401, name: "Wire 2.5sqmm (Polycab) — 90m",    unit: "coil", rate: 2400, available: true, stock: 45 },
      { materialId: 402, name: "Wire 4sqmm (Havells) — 90m",      unit: "coil", rate: 3800, available: true, stock: 32 },
      { materialId: 403, name: "Wire 6sqmm (Finolex) — 90m",      unit: "coil", rate: 5500, available: true, stock: 24 },
      { materialId: 404, name: "MCB 16A Single Pole (Schneider)", unit: "pc",   rate: 220,  available: true, stock: 180 },
      { materialId: 405, name: "MCB 32A Double Pole (Legrand)",   unit: "pc",   rate: 580,  available: true, stock: 95  },
      { materialId: 406, name: "Switch 6A (Anchor Roma)",         unit: "pc",   rate: 65,   available: true, stock: 320 },
      { materialId: 407, name: "Socket 16A (Anchor Roma)",        unit: "pc",   rate: 145,  available: true, stock: 180 },
      { materialId: 408, name: "LED Bulb 9W (Philips)",           unit: "pc",   rate: 110,  available: true, stock: 240 },
      { materialId: 409, name: "Distribution Board 8-way",        unit: "pc",   rate: 1850, available: true, stock: 22  },
      { materialId: 410, name: "Conduit Pipe 25mm (PVC)",         unit: "m",    rate: 38,   available: true, stock: 850 },
    ],
    tags: ["ISI Marked", "Brand Authorized", "Bulk Discount"],
  },

  /* ── PLUMBING ── */
  {
    id: "SUP-011",
    name: "AquaFlow Plumbing Mart",
    owner: "Manikandan",
    category: "plumbing",
    tagline: "Astral & Jaquar premium dealer + 5-yr install warranty",
    about: "Bathroom fittings, water tanks, and complete plumbing. We connect you with vetted plumbers who handle install with our material warranty.",
    established: 2013,
    certifications: ["Astral Authorized", "Jaquar Premium Partner", "Cera Dealer"],
    featuredIds: [502, 506],
    city: "chennai",
    area: "Urapakkam",
    distance: 16.8,
    rating: 4.5,
    reviewCount: 134,
    responseTime: "< 1 hr",
    onTimeRate: 92,
    yearsActive: 12,
    phone: "9443200011",
    gstin: "33AABCA1111B1ZB",
    verified: true,
    deliveryRadius: 55,
    catalog: [
      { materialId: 501, name: "PVC Pipe 1\" (Astral) — 6m",  unit: "pc",  rate: 320,  available: true, stock: 180 },
      { materialId: 502, name: "PVC Pipe 2\" (Astral) — 6m",  unit: "pc",  rate: 580,  available: true, stock: 120 },
      { materialId: 503, name: "CPVC Pipe 1/2\" — 3m",        unit: "pc",  rate: 145,  available: true, stock: 240 },
      { materialId: 504, name: "Elbow 90° 1\"",                unit: "pc",  rate: 28,   available: true, stock: 850 },
      { materialId: 505, name: "Tee 1\"",                      unit: "pc",  rate: 35,   available: true, stock: 720 },
      { materialId: 506, name: "Bib Tap (Jaquar)",             unit: "pc",  rate: 1850, available: true, stock: 48  },
      { materialId: 507, name: "Wash Basin Cera",              unit: "pc",  rate: 3200, available: true, stock: 22  },
      { materialId: 508, name: "Water Tank 1000L (Sintex)",    unit: "pc",  rate: 8200, available: true, stock: 14  },
    ],
    tags: ["Astral Authorized", "Jaquar Authorized"],
  },

  /* ── TILES & SANITARY ── */
  {
    id: "SUP-012",
    name: "Ganesh Tiles & Marbles",
    owner: "Ganesh",
    category: "tiles",
    tagline: "Free 3D layout design with every order > ₹1L",
    about: "Walk-in showroom with 200+ tile samples. In-house designer creates 3D room renders so you visualize before you buy. Granite directly from Jalore.",
    established: 2009,
    certifications: ["Kajaria Authorized", "Somany Authorized", "Johnson Tiles Dealer"],
    featuredIds: [602, 604],
    city: "chennai",
    area: "Perungalathur",
    distance: 9.2,
    rating: 4.6,
    reviewCount: 198,
    responseTime: "< 1 hr",
    onTimeRate: 91,
    yearsActive: 16,
    phone: "9443200012",
    gstin: "33AABCG1212B1ZB",
    verified: true,
    deliveryRadius: 70,
    catalog: [
      { materialId: 601, name: "Vitrified Tile 600x600mm (Kajaria)",  unit: "box", rate: 720,  available: true, stock: 280 },
      { materialId: 602, name: "Vitrified Tile 800x800mm (Somany)",   unit: "box", rate: 980,  available: true, stock: 165 },
      { materialId: 603, name: "Wall Tile 300x600mm (Johnson)",       unit: "box", rate: 540,  available: true, stock: 220 },
      { materialId: 604, name: "Granite Slab 2x4 ft (Black Galaxy)",  unit: "sqft", rate: 220, available: true, stock: 480 },
      { materialId: 605, name: "Marble Slab 2x4 ft (Makrana)",        unit: "sqft", rate: 380, available: true, stock: 320 },
      { materialId: 606, name: "Tile Adhesive 20kg (MYK Laticrete)",  unit: "bag", rate: 580,  available: true, stock: 65  },
    ],
    tags: ["Kajaria Authorized", "Free Layout Design"],
  },

  /* ── PAINTS ── */
  {
    id: "SUP-013",
    name: "ColourMax Paints",
    owner: "Bhaskar",
    category: "paints",
    tagline: "Asian Paints color-matching machine + free site sampling",
    about: "We don't just sell paint — our color consultant visits your site, matches existing shades, and recommends primers + putty as a complete system.",
    established: 2012,
    certifications: ["Asian Paints Premium Dealer", "Berger Authorized"],
    featuredIds: [701, 703],
    city: "chennai",
    area: "Tambaram",
    distance: 7.4,
    rating: 4.7,
    reviewCount: 167,
    responseTime: "< 45 min",
    onTimeRate: 95,
    yearsActive: 13,
    phone: "9443200013",
    gstin: "33AABCC1313B1ZB",
    verified: true,
    deliveryRadius: 50,
    catalog: [
      { materialId: 701, name: "Asian Paints Apex Ultima 20L",   unit: "bucket", rate: 5800, available: true, stock: 38 },
      { materialId: 702, name: "Berger Silk Glamour 20L",        unit: "bucket", rate: 4900, available: true, stock: 28 },
      { materialId: 703, name: "Birla White Putty 40kg",         unit: "bag",    rate: 1180, available: true, stock: 56 },
      { materialId: 704, name: "Primer Wall Sealer 20L",         unit: "bucket", rate: 2200, available: true, stock: 42 },
      { materialId: 705, name: "Wood Polish (Pidilite) 1L",      unit: "tin",    rate: 480,  available: true, stock: 65 },
      { materialId: 706, name: "Roller + Tray Set",              unit: "set",    rate: 220,  available: true, stock: 80 },
    ],
    tags: ["Asian Paints Dealer", "Color Mixing Available"],
  },

  /* ── WOOD & BOARDS ── */
  {
    id: "SUP-014",
    name: "Saravana Plywood & Doors",
    owner: "Saravanan",
    category: "wood",
    tagline: "Custom cutting in 30 min — bring your dimensions",
    about: "Two-decade legacy in plywood and ready-made doors. CNC cutting machine handles any size. Teak frames imported from Burma teak.",
    established: 2003,
    certifications: ["Century Authorized", "Greenply Distributor"],
    featuredIds: [801, 804],
    city: "chennai",
    area: "Tambaram",
    distance: 7.8,
    rating: 4.4,
    reviewCount: 89,
    responseTime: "< 2 hrs",
    onTimeRate: 88,
    yearsActive: 22,
    phone: "9443200014",
    gstin: "33AABCS1414B1ZB",
    verified: true,
    deliveryRadius: 45,
    catalog: [
      { materialId: 801, name: "Plywood 19mm 8x4 (Century BWP)",   unit: "sheet", rate: 4200, available: true, stock: 38 },
      { materialId: 802, name: "Plywood 12mm 8x4 (Century MR)",    unit: "sheet", rate: 2800, available: true, stock: 65 },
      { materialId: 803, name: "MDF Board 18mm 8x4",               unit: "sheet", rate: 1850, available: true, stock: 48 },
      { materialId: 804, name: "Flush Door 7x3 ft Standard",       unit: "pc",    rate: 3400, available: true, stock: 22 },
      { materialId: 805, name: "Door Frame Teak Wood 7x3 ft",      unit: "set",   rate: 5800, available: true, stock: 14 },
      { materialId: 806, name: "Veneer Sheet 8x4 (Greenply)",      unit: "sheet", rate: 2400, available: true, stock: 32 },
    ],
    tags: ["Century Authorized", "Custom Cutting"],
  },
];

/* Engineer's projects (sites) */
export const engineerProjects = [
  {
    id: "ESITE-001",
    engineerId: "ENG-101",
    name: "Iyer Residence",
    location: "Vandalur, Chennai",
    type: "Residential Villa",
    area: "1,400 sqft",
    status: "active",
    startDate: "2026-01-20",
    endDate: "2026-09-15",
    budget: 2200000,
    spent: 985000,
    progress: 45,
    phase: "Walls",
    phases: [
      { name: "Foundation", status: "completed",   allocated: 480000, spent: 472000, progress: 100 },
      { name: "Slab",       status: "completed",   allocated: 420000, spent: 435000, progress: 100 },
      { name: "Walls",      status: "in-progress", allocated: 620000, spent: 78000,  progress: 80 },
      { name: "Roofing",    status: "pending",     allocated: 360000, spent: 0,      progress: 0 },
      { name: "Finishing",  status: "pending",     allocated: 320000, spent: 0,      progress: 0 },
    ],
    materials: [
      { materialId: 2, name: "M-Sand (Manufactured)", allocated: 200, used: 120, unit: "ton", rate: 1800 },
      { materialId: 3, name: "Blue Metal (40mm)",     allocated: 100, used: 55,  unit: "ton", rate: 2100 },
      { materialId: 4, name: "Blue Metal (20mm)",     allocated: 70,  used: 40,  unit: "ton", rate: 2300 },
      { materialId: 1, name: "River Sand",            allocated: 50,  used: 15,  unit: "ton", rate: 3200 },
    ],
    monthlySpend: [
      { month: "Feb", planned: 320000, actual: 215000 },
      { month: "Mar", planned: 460000, actual: 478000 },
      { month: "Apr", planned: 420000, actual: 292000 },
      { month: "May", planned: 480000, actual: 0 },
      { month: "Jun", planned: 320000, actual: 0 },
      { month: "Jul", planned: 200000, actual: 0 },
    ],
  },
  {
    id: "ESITE-002",
    engineerId: "ENG-101",
    name: "Mahindra IT Park - Block C",
    location: "Sriperumbudur, Chennai",
    type: "Commercial",
    area: "12,500 sqft",
    status: "active",
    startDate: "2025-11-05",
    endDate: "2026-12-30",
    budget: 8400000,
    spent: 4250000,
    progress: 52,
    phase: "Floors 2-3",
    phases: [
      { name: "Site Prep",  status: "completed",   allocated: 620000,  spent: 615000,  progress: 100 },
      { name: "Foundation", status: "completed",   allocated: 1480000, spent: 1492000, progress: 100 },
      { name: "Floor 1",    status: "completed",   allocated: 1450000, spent: 1422000, progress: 100 },
      { name: "Floors 2-3", status: "in-progress", allocated: 2400000, spent: 721000,  progress: 30 },
      { name: "Finishing",  status: "pending",     allocated: 2450000, spent: 0,       progress: 0 },
    ],
    materials: [
      { materialId: 3, name: "Blue Metal (40mm)", allocated: 480, used: 245, unit: "ton", rate: 2100 },
      { materialId: 4, name: "Blue Metal (20mm)", allocated: 320, used: 168, unit: "ton", rate: 2300 },
      { materialId: 2, name: "M-Sand",            allocated: 540, used: 286, unit: "ton", rate: 1800 },
      { materialId: 7, name: "Quarry Dust",       allocated: 120, used: 48,  unit: "ton", rate: 1200 },
    ],
    monthlySpend: [
      { month: "Nov", planned: 580000,  actual: 542000 },
      { month: "Dec", planned: 920000,  actual: 945000 },
      { month: "Jan", planned: 1080000, actual: 1058000 },
      { month: "Feb", planned: 880000,  actual: 902000 },
      { month: "Mar", planned: 760000,  actual: 458000 },
      { month: "Apr", planned: 620000,  actual: 345000 },
      { month: "May", planned: 920000,  actual: 0 },
      { month: "Jun", planned: 1100000, actual: 0 },
    ],
  },
  {
    id: "ESITE-003",
    engineerId: "ENG-101",
    name: "Vandalur School Extension",
    location: "Vandalur, Chennai",
    type: "Institutional",
    area: "3,200 sqft",
    status: "active",
    startDate: "2026-03-12",
    endDate: "2026-08-20",
    budget: 1850000,
    spent: 380000,
    progress: 22,
    phase: "Foundation",
    phases: [
      { name: "Foundation", status: "in-progress", allocated: 480000, spent: 380000, progress: 78 },
      { name: "Slab",       status: "pending",     allocated: 380000, spent: 0,      progress: 0 },
      { name: "Walls",      status: "pending",     allocated: 540000, spent: 0,      progress: 0 },
      { name: "Roofing",    status: "pending",     allocated: 280000, spent: 0,      progress: 0 },
      { name: "Finishing",  status: "pending",     allocated: 170000, spent: 0,      progress: 0 },
    ],
    materials: [
      { materialId: 2, name: "M-Sand",            allocated: 140, used: 38, unit: "ton", rate: 1800 },
      { materialId: 3, name: "Blue Metal (40mm)", allocated: 80,  used: 18, unit: "ton", rate: 2100 },
      { materialId: 7, name: "Quarry Dust",       allocated: 50,  used: 15, unit: "ton", rate: 1200 },
      { materialId: 1, name: "River Sand",        allocated: 30,  used: 8,  unit: "ton", rate: 3200 },
    ],
    monthlySpend: [
      { month: "Mar", planned: 240000, actual: 192000 },
      { month: "Apr", planned: 320000, actual: 188000 },
      { month: "May", planned: 380000, actual: 0 },
      { month: "Jun", planned: 420000, actual: 0 },
      { month: "Jul", planned: 320000, actual: 0 },
      { month: "Aug", planned: 170000, actual: 0 },
    ],
  },
  {
    id: "ESITE-004",
    engineerId: "ENG-101",
    name: "Krishnan Bungalow",
    location: "Tambaram, Chennai",
    type: "Residential Villa",
    area: "1,150 sqft",
    status: "completed",
    startDate: "2025-06-08",
    endDate: "2026-02-14",
    budget: 1680000,
    spent: 1632000,
    progress: 100,
    phase: "Completed",
    phases: [
      { name: "Foundation", status: "completed", allocated: 320000, spent: 318000, progress: 100 },
      { name: "Slab",       status: "completed", allocated: 310000, spent: 322000, progress: 100 },
      { name: "Walls",      status: "completed", allocated: 480000, spent: 465000, progress: 100 },
      { name: "Roofing",    status: "completed", allocated: 280000, spent: 268000, progress: 100 },
      { name: "Finishing",  status: "completed", allocated: 290000, spent: 259000, progress: 100 },
    ],
    materials: [
      { materialId: 2, name: "M-Sand",            allocated: 140, used: 138, unit: "ton", rate: 1800 },
      { materialId: 3, name: "Blue Metal (40mm)", allocated: 80,  used: 82,  unit: "ton", rate: 2100 },
      { materialId: 4, name: "Blue Metal (20mm)", allocated: 50,  used: 48,  unit: "ton", rate: 2300 },
    ],
    monthlySpend: [
      { month: "Jun", planned: 220000, actual: 218000 },
      { month: "Aug", planned: 290000, actual: 295000 },
      { month: "Oct", planned: 320000, actual: 312000 },
      { month: "Dec", planned: 290000, actual: 282000 },
      { month: "Feb", planned: 260000, actual: 248000 },
    ],
  },
];

/* Engineer's full purchase history */
export const engineerOrders = [
  { id: "EORD-2026-0029", date: "2026-04-29", supplierId: "SUP-001", projectId: "ESITE-001", material: "M-Sand (Manufactured)", qty: 12, rate: 1800, total: 22680, status: "delivered" },
  { id: "EORD-2026-0028", date: "2026-04-28", supplierId: "SUP-003", projectId: "ESITE-002", material: "Blue Metal (40mm)",     qty: 20, rate: 2080, total: 43680, status: "delivered" },
  { id: "EORD-2026-0027", date: "2026-04-26", supplierId: "SUP-001", projectId: "ESITE-001", material: "Blue Metal (20mm)",     qty: 8,  rate: 2300, total: 19320, status: "delivered" },
  { id: "EORD-2026-0026", date: "2026-04-24", supplierId: "SUP-002", projectId: "ESITE-002", material: "M-Sand (Manufactured)", qty: 25, rate: 1850, total: 48563, status: "delivered" },
  { id: "EORD-2026-0025", date: "2026-04-22", supplierId: "SUP-001", projectId: "ESITE-003", material: "Quarry Dust",           qty: 15, rate: 1200, total: 18900, status: "delivered" },
  { id: "EORD-2026-0024", date: "2026-04-20", supplierId: "SUP-003", projectId: "ESITE-002", material: "Blue Metal (12mm)",     qty: 10, rate: 2480, total: 26040, status: "delivered" },
  { id: "EORD-2026-0023", date: "2026-04-18", supplierId: "SUP-001", projectId: "ESITE-001", material: "River Sand",            qty: 5,  rate: 3200, total: 16800, status: "delivered" },
  { id: "EORD-2026-0022", date: "2026-04-15", supplierId: "SUP-004", projectId: "ESITE-001", material: "M-Sand (Manufactured)", qty: 18, rate: 1820, total: 34390, status: "delivered" },
  { id: "EORD-2026-0021", date: "2026-04-29", supplierId: "SUP-001", projectId: "ESITE-001", material: "M-Sand (Manufactured)", qty: 6,  rate: 1800, total: 11340, status: "in-transit" },
  { id: "EORD-2026-0020", date: "2026-04-29", supplierId: "SUP-002", projectId: "ESITE-002", material: "Blue Metal (40mm)",     qty: 15, rate: 2050, total: 32288, status: "pending" },
  { id: "EORD-2026-0019", date: "2026-04-12", supplierId: "SUP-003", projectId: "ESITE-002", material: "Quarry Dust",           qty: 22, rate: 1150, total: 26565, status: "delivered" },
  { id: "EORD-2026-0018", date: "2026-04-10", supplierId: "SUP-001", projectId: "ESITE-003", material: "Blue Metal (40mm)",     qty: 8,  rate: 2100, total: 17640, status: "delivered" },
  { id: "EORD-2026-0017", date: "2026-04-08", supplierId: "SUP-001", projectId: "ESITE-002", material: "M-Sand (Manufactured)", qty: 14, rate: 1800, total: 26460, status: "delivered" },
  { id: "EORD-2026-0016", date: "2026-04-05", supplierId: "SUP-005", projectId: "ESITE-001", material: "Blue Metal (20mm)",     qty: 9,  rate: 2350, total: 22208, status: "delivered" },
  { id: "EORD-2026-0015", date: "2026-04-02", supplierId: "SUP-002", projectId: "ESITE-002", material: "M-Sand (Manufactured)", qty: 30, rate: 1850, total: 58275, status: "delivered" },

  /* ── Cement (SUP-007) ── */
  { id: "EORD-2026-0040", date: "2026-04-28", supplierId: "SUP-007", projectId: "ESITE-001", material: "OPC 53 Grade (Ramco)",     qty: 80,  rate: 420,  total: 35280, status: "delivered" },
  { id: "EORD-2026-0041", date: "2026-04-21", supplierId: "SUP-007", projectId: "ESITE-002", material: "Ready-Mix Concrete M25",   qty: 12,  rate: 5800, total: 73080, status: "delivered" },
  { id: "EORD-2026-0042", date: "2026-04-14", supplierId: "SUP-007", projectId: "ESITE-001", material: "PPC (UltraTech)",          qty: 60,  rate: 380,  total: 23940, status: "delivered" },

  /* ── Steel (SUP-008) ── */
  { id: "EORD-2026-0043", date: "2026-04-26", supplierId: "SUP-008", projectId: "ESITE-002", material: "TMT Bar 12mm (JSW)",       qty: 2,   rate: 61000, total: 128100, status: "delivered" },
  { id: "EORD-2026-0044", date: "2026-04-19", supplierId: "SUP-008", projectId: "ESITE-001", material: "TMT Bar 10mm (Tata)",      qty: 1,   rate: 61500, total: 64575,  status: "delivered" },
  { id: "EORD-2026-0045", date: "2026-04-09", supplierId: "SUP-008", projectId: "ESITE-002", material: "Binding Wire 18 SWG",      qty: 25,  rate: 85,    total: 2231,   status: "delivered" },

  /* ── Hardware (SUP-009) ── */
  { id: "EORD-2026-0046", date: "2026-04-29", supplierId: "SUP-009", projectId: "ESITE-001", material: "Galvanized Screws (200pc)",qty: 8,   rate: 320,  total: 2688,  status: "in-transit" },
  { id: "EORD-2026-0047", date: "2026-04-23", supplierId: "SUP-009", projectId: "ESITE-001", material: "Wire Nails 4 inch",        qty: 15,  rate: 88,   total: 1386,  status: "delivered" },
  { id: "EORD-2026-0048", date: "2026-04-11", supplierId: "SUP-009", projectId: "ESITE-002", material: "Trowel (Plastering)",      qty: 6,   rate: 280,  total: 1764,  status: "delivered" },

  /* ── Electricals (SUP-010) ── */
  { id: "EORD-2026-0049", date: "2026-04-25", supplierId: "SUP-010", projectId: "ESITE-001", material: "Wire 4sqmm (Havells) — 90m",      qty: 4,  rate: 3800, total: 15960, status: "delivered" },
  { id: "EORD-2026-0050", date: "2026-04-16", supplierId: "SUP-010", projectId: "ESITE-001", material: "MCB 16A Single Pole (Schneider)", qty: 12, rate: 220,  total: 2772,  status: "delivered" },
  { id: "EORD-2026-0051", date: "2026-04-04", supplierId: "SUP-010", projectId: "ESITE-002", material: "Conduit Pipe 25mm (PVC)",         qty: 80, rate: 38,   total: 3192,  status: "delivered" },

  /* ── Plumbing (SUP-011) ── */
  { id: "EORD-2026-0052", date: "2026-04-27", supplierId: "SUP-011", projectId: "ESITE-001", material: "PVC Pipe 2\" (Astral) — 6m",  qty: 8,  rate: 580,  total: 4872,  status: "delivered" },
  { id: "EORD-2026-0053", date: "2026-04-13", supplierId: "SUP-011", projectId: "ESITE-001", material: "Bib Tap (Jaquar)",            qty: 4,  rate: 1850, total: 7770,  status: "delivered" },
  { id: "EORD-2026-0054", date: "2026-04-29", supplierId: "SUP-011", projectId: "ESITE-002", material: "Water Tank 1000L (Sintex)",   qty: 2,  rate: 8200, total: 17220, status: "pending" },

  /* ── Tiles (SUP-012) ── */
  { id: "EORD-2026-0055", date: "2026-04-22", supplierId: "SUP-012", projectId: "ESITE-001", material: "Vitrified Tile 600x600mm (Kajaria)", qty: 24, rate: 720,  total: 18144, status: "delivered" },
  { id: "EORD-2026-0056", date: "2026-04-07", supplierId: "SUP-012", projectId: "ESITE-002", material: "Granite Slab 2x4 ft (Black Galaxy)", qty: 60, rate: 220,  total: 13860, status: "delivered" },

  /* ── Paints (SUP-013) ── */
  { id: "EORD-2026-0057", date: "2026-04-24", supplierId: "SUP-013", projectId: "ESITE-001", material: "Asian Paints Apex Ultima 20L",   qty: 3,  rate: 5800, total: 18270, status: "delivered" },
  { id: "EORD-2026-0058", date: "2026-04-12", supplierId: "SUP-013", projectId: "ESITE-001", material: "Birla White Putty 40kg",         qty: 8,  rate: 1180, total: 9912,  status: "delivered" },

  /* ── Wood (SUP-014) ── */
  { id: "EORD-2026-0059", date: "2026-04-17", supplierId: "SUP-014", projectId: "ESITE-001", material: "Plywood 19mm 8x4 (Century BWP)",   qty: 6,  rate: 4200, total: 26460, status: "delivered" },
  { id: "EORD-2026-0060", date: "2026-04-06", supplierId: "SUP-014", projectId: "ESITE-001", material: "Flush Door 7x3 ft Standard",       qty: 4,  rate: 3400, total: 14280, status: "delivered" },
];

export const attendanceSeed = [
  // ESITE-001 — Iyer Residence — Apr 28
  { id: "ATT-E1-001", projectId: "ESITE-001", date: "2026-04-28", workerName: "Ramu Kumar",  role: "Mason",      status: "present",  checkIn: "07:20", checkOut: "17:30" },
  { id: "ATT-E1-002", projectId: "ESITE-001", date: "2026-04-28", workerName: "Selvam P.",   role: "Mason",      status: "present",  checkIn: "07:35", checkOut: "17:00" },
  { id: "ATT-E1-003", projectId: "ESITE-001", date: "2026-04-28", workerName: "Kannan R.",   role: "Mason",      status: "present",  checkIn: "07:30", checkOut: "17:15" },
  { id: "ATT-E1-004", projectId: "ESITE-001", date: "2026-04-28", workerName: "Murugesan",   role: "Carpenter",  status: "present",  checkIn: "07:45", checkOut: "17:30" },
  { id: "ATT-E1-005", projectId: "ESITE-001", date: "2026-04-28", workerName: "Arjun D.",    role: "Carpenter",  status: "absent",   checkIn: "",      checkOut: "" },
  { id: "ATT-E1-006", projectId: "ESITE-001", date: "2026-04-28", workerName: "Babu M.",     role: "Helper",     status: "present",  checkIn: "07:15", checkOut: "17:30" },
  { id: "ATT-E1-007", projectId: "ESITE-001", date: "2026-04-28", workerName: "Senthil K.",  role: "Helper",     status: "half-day", checkIn: "07:30", checkOut: "13:00" },
  { id: "ATT-E1-008", projectId: "ESITE-001", date: "2026-04-28", workerName: "Pandi V.",    role: "Helper",     status: "present",  checkIn: "07:25", checkOut: "17:30" },
  { id: "ATT-E1-009", projectId: "ESITE-001", date: "2026-04-28", workerName: "Kumar S.",    role: "Helper",     status: "present",  checkIn: "07:30", checkOut: "17:00" },
  { id: "ATT-E1-010", projectId: "ESITE-001", date: "2026-04-28", workerName: "Suresh T.",   role: "Supervisor", status: "present",  checkIn: "07:00", checkOut: "18:00" },
  // ESITE-001 — Apr 29
  { id: "ATT-E1-011", projectId: "ESITE-001", date: "2026-04-29", workerName: "Ramu Kumar",  role: "Mason",      status: "present",  checkIn: "07:30", checkOut: "17:30" },
  { id: "ATT-E1-012", projectId: "ESITE-001", date: "2026-04-29", workerName: "Selvam P.",   role: "Mason",      status: "absent",   checkIn: "",      checkOut: "" },
  { id: "ATT-E1-013", projectId: "ESITE-001", date: "2026-04-29", workerName: "Kannan R.",   role: "Mason",      status: "present",  checkIn: "07:20", checkOut: "17:00" },
  { id: "ATT-E1-014", projectId: "ESITE-001", date: "2026-04-29", workerName: "Murugesan",   role: "Carpenter",  status: "present",  checkIn: "07:40", checkOut: "17:30" },
  { id: "ATT-E1-015", projectId: "ESITE-001", date: "2026-04-29", workerName: "Arjun D.",    role: "Carpenter",  status: "present",  checkIn: "07:30", checkOut: "17:00" },
  { id: "ATT-E1-016", projectId: "ESITE-001", date: "2026-04-29", workerName: "Babu M.",     role: "Helper",     status: "present",  checkIn: "07:20", checkOut: "17:30" },
  { id: "ATT-E1-017", projectId: "ESITE-001", date: "2026-04-29", workerName: "Senthil K.",  role: "Helper",     status: "present",  checkIn: "07:30", checkOut: "17:15" },
  { id: "ATT-E1-018", projectId: "ESITE-001", date: "2026-04-29", workerName: "Pandi V.",    role: "Helper",     status: "leave",    checkIn: "",      checkOut: "" },
  { id: "ATT-E1-019", projectId: "ESITE-001", date: "2026-04-29", workerName: "Kumar S.",    role: "Helper",     status: "present",  checkIn: "07:30", checkOut: "17:00" },
  { id: "ATT-E1-020", projectId: "ESITE-001", date: "2026-04-29", workerName: "Suresh T.",   role: "Supervisor", status: "present",  checkIn: "07:00", checkOut: "18:00" },
  // ESITE-001 — May 5 (today)
  { id: "ATT-E1-021", projectId: "ESITE-001", date: "2026-05-05", workerName: "Ramu Kumar",  role: "Mason",      status: "present",  checkIn: "07:15", checkOut: "" },
  { id: "ATT-E1-022", projectId: "ESITE-001", date: "2026-05-05", workerName: "Selvam P.",   role: "Mason",      status: "present",  checkIn: "07:30", checkOut: "" },
  { id: "ATT-E1-023", projectId: "ESITE-001", date: "2026-05-05", workerName: "Kannan R.",   role: "Mason",      status: "half-day", checkIn: "07:30", checkOut: "13:00" },
  { id: "ATT-E1-024", projectId: "ESITE-001", date: "2026-05-05", workerName: "Murugesan",   role: "Carpenter",  status: "present",  checkIn: "07:45", checkOut: "" },
  { id: "ATT-E1-025", projectId: "ESITE-001", date: "2026-05-05", workerName: "Arjun D.",    role: "Carpenter",  status: "present",  checkIn: "07:30", checkOut: "" },
  { id: "ATT-E1-026", projectId: "ESITE-001", date: "2026-05-05", workerName: "Babu M.",     role: "Helper",     status: "absent",   checkIn: "",      checkOut: "" },
  { id: "ATT-E1-027", projectId: "ESITE-001", date: "2026-05-05", workerName: "Senthil K.",  role: "Helper",     status: "present",  checkIn: "07:25", checkOut: "" },
  { id: "ATT-E1-028", projectId: "ESITE-001", date: "2026-05-05", workerName: "Pandi V.",    role: "Helper",     status: "present",  checkIn: "07:30", checkOut: "" },
  { id: "ATT-E1-029", projectId: "ESITE-001", date: "2026-05-05", workerName: "Kumar S.",    role: "Helper",     status: "leave",    checkIn: "",      checkOut: "" },
  { id: "ATT-E1-030", projectId: "ESITE-001", date: "2026-05-05", workerName: "Suresh T.",   role: "Supervisor", status: "present",  checkIn: "07:00", checkOut: "" },
  // ESITE-002 — Mahindra IT Park — Apr 28
  { id: "ATT-E2-001", projectId: "ESITE-002", date: "2026-04-28", workerName: "Rajendran",   role: "Foreman",    status: "present",  checkIn: "06:45", checkOut: "18:00" },
  { id: "ATT-E2-002", projectId: "ESITE-002", date: "2026-04-28", workerName: "Krishnan S.", role: "Mason",      status: "present",  checkIn: "07:00", checkOut: "17:30" },
  { id: "ATT-E2-003", projectId: "ESITE-002", date: "2026-04-28", workerName: "Anbu R.",     role: "Mason",      status: "present",  checkIn: "07:00", checkOut: "17:30" },
  { id: "ATT-E2-004", projectId: "ESITE-002", date: "2026-04-28", workerName: "Palanivel",   role: "Carpenter",  status: "present",  checkIn: "07:15", checkOut: "17:45" },
  { id: "ATT-E2-005", projectId: "ESITE-002", date: "2026-04-28", workerName: "Vel K.",      role: "Helper",     status: "absent",   checkIn: "",      checkOut: "" },
  { id: "ATT-E2-006", projectId: "ESITE-002", date: "2026-04-28", workerName: "Siva M.",     role: "Helper",     status: "present",  checkIn: "07:00", checkOut: "17:30" },
  { id: "ATT-E2-007", projectId: "ESITE-002", date: "2026-04-28", workerName: "Murali D.",   role: "Helper",     status: "half-day", checkIn: "07:00", checkOut: "13:00" },
  { id: "ATT-E2-008", projectId: "ESITE-002", date: "2026-04-28", workerName: "Guna P.",     role: "Helper",     status: "present",  checkIn: "07:00", checkOut: "17:30" },
  // ESITE-002 — May 5 (today)
  { id: "ATT-E2-009", projectId: "ESITE-002", date: "2026-05-05", workerName: "Rajendran",   role: "Foreman",    status: "present",  checkIn: "06:45", checkOut: "" },
  { id: "ATT-E2-010", projectId: "ESITE-002", date: "2026-05-05", workerName: "Krishnan S.", role: "Mason",      status: "present",  checkIn: "07:00", checkOut: "" },
  { id: "ATT-E2-011", projectId: "ESITE-002", date: "2026-05-05", workerName: "Anbu R.",     role: "Mason",      status: "absent",   checkIn: "",      checkOut: "" },
  { id: "ATT-E2-012", projectId: "ESITE-002", date: "2026-05-05", workerName: "Palanivel",   role: "Carpenter",  status: "present",  checkIn: "07:15", checkOut: "" },
  { id: "ATT-E2-013", projectId: "ESITE-002", date: "2026-05-05", workerName: "Vel K.",      role: "Helper",     status: "present",  checkIn: "07:00", checkOut: "" },
  { id: "ATT-E2-014", projectId: "ESITE-002", date: "2026-05-05", workerName: "Siva M.",     role: "Helper",     status: "leave",    checkIn: "",      checkOut: "" },
  { id: "ATT-E2-015", projectId: "ESITE-002", date: "2026-05-05", workerName: "Murali D.",   role: "Helper",     status: "present",  checkIn: "07:00", checkOut: "" },
  { id: "ATT-E2-016", projectId: "ESITE-002", date: "2026-05-05", workerName: "Guna P.",     role: "Helper",     status: "present",  checkIn: "07:00", checkOut: "" },
];

export function getSupplierShop(id) {
  return supplierShops.find((s) => s.id === id);
}

/* Maps the category picked at supplier login → a representative shop. */
export function getDefaultSupplierForCategory(categoryId) {
  return supplierShops.find((s) => s.category === categoryId)?.id || "SUP-001";
}

/* Returns the currently logged-in supplier's id (from localStorage) or SUP-001. */
export function getCurrentSupplierId() {
  if (typeof window === "undefined") return "SUP-001";
  return window.localStorage?.getItem("currentSupplierId") || "SUP-001";
}

export function getCurrentSupplier() {
  return getSupplierShop(getCurrentSupplierId());
}
export function getEngineerProject(id) {
  return engineerProjects.find((p) => p.id === id);
}
export function getEngineerOrdersForProject(projectId) {
  return engineerOrders.filter((o) => o.projectId === projectId);
}
export function getEngineerOrdersForSupplier(supplierId) {
  return engineerOrders.filter((o) => o.supplierId === supplierId);
}
