// Fictional transaction generator for the demo app.
// - Every month is generated from a fixed seed, so the same month always gives the same data.
// - Transactions in the future (after today) are hidden, so data always follows the current date.
// - Running balance is continuous from ORIGIN: closing balance of one month = opening of the next.
// All names, numbers and amounts are made up. This is NOT a real bank record.

// First month that has data, and the fictional balance before it starts.
const ORIGIN = { year: 2025, month: 4 };
const OPENING_AT_ORIGIN = 70000;

// Fictional people / shops used in narrations.
const PEOPLE = [
  "AARAV MEHTA", "DIYA PATEL", "KABIR SINGH", "MEERA NAIR", "ROHAN DESAI", "ISHA VERMA",
  "NIKHIL RAO", "ANANYA GUPTA", "VIKRAM JOSHI", "SANYA KAPOOR", "ARJUN MALIK", "TARA IYER",
];
const SHOPS = [
  { name: "FRESHMART GROCERY", category: "Shopping" },
  { name: "QUICKBITES CAFE", category: "Food" },
  { name: "METRO RIDES", category: "Travel" },
  { name: "BOOKNEST STORE", category: "Shopping" },
  { name: "SPICE GARDEN", category: "Food" },
  { name: "PHARMACARE", category: "Health" },
];
const CITIES = ["INDORE", "BHOPAL", "PUNE", "DELHI"];
const MON = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Small seeded random generator (same seed -> same numbers).
function makeRng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n, size = 2) => String(n).padStart(size, "0");
const round2 = (n) => Math.round(n * 100) / 100;

// Build ALL transactions of one month (no future filtering here).
function buildMonth(month, year) {
  const rand = makeRng(year * 100 + month);
  const int = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const ref12 = () => String(int(100000000000, 999999999999));
  const dim = new Date(year, month, 0).getDate();
  const list = [];
  let n = 0;

  const add = (day, type, amount, description, narration, category, reference) => {
    list.push({
      id: `TXN-${year}${pad(month)}-${pad(++n, 3)}`,
      date: new Date(year, month - 1, day),
      description, // short text for tables / PDF
      narration, // long bank-style text for Excel / CSV
      category,
      type,
      amount: round2(amount),
      reference,
    });
  };

  // Fixed monthly items
  add(3, "Debit", 18250, "ACH D - SUNRISE HOUSING FIN", `ACH D- SUNRISE HOUSING FINANCE-LN70356${pad(month)}EMI`, "EMI", `00000${ref12()}`);
  add(5, "Debit", 30000, "NEFT DR - SELF RD", "NEFT DR-DEMO0000321-SELF-RD INSTALMENT", "Transfer", `DEMOH${int(10000000, 99999999)}`);
  add(int(8, 14), "Debit", int(900, 2400) + int(0, 99) / 100, "IB BILLPAY DR - ELECTRICITY", "IB BILLPAY DR-DEMOPAY-ELECTRICITY BOARD-XXXXXX2001", "Bills", `17${ref12()}`);
  add(int(15, 20), "Debit", pick([299, 399, 599]), "IB BILLPAY DR - MOBILE", "IB BILLPAY DR-DEMOPAY-MOBILE RECHARGE-XXXXXX2001", "Bills", `17${ref12()}`);

  // Quarterly interest on 1st of Jan / Apr / Jul / Oct
  if ([1, 4, 7, 10].includes(month)) {
    const prevEnd = new Date(year, month - 1, 0);
    add(1, "Credit", int(40, 140) + int(0, 99) / 100, "INTEREST PAID", `INTEREST PAID TILL ${pad(prevEnd.getDate())}-${pad(prevEnd.getMonth() + 1)}-${prevEnd.getFullYear()}`, "Interest", "000000000000000");
  }

  // UPI payments out (shops and people)
  const upiOut = int(6, 9);
  for (let i = 0; i < upiOut; i++) {
    const amount = pick([40, 60, 85, 120, 150, 199, 250, 320, 450, 600, 899, 1200, 1500]);
    const ref = ref12();
    if (rand() < 0.5) {
      const shop = pick(SHOPS);
      add(int(1, dim), "Debit", amount, `UPI - ${shop.name}`, `UPI-${shop.name}-SHOP${int(100, 999)}@demo-${ref}-PAYMENT FROM PHONE`, shop.category, `0000${ref}`);
    } else {
      const name = pick(PEOPLE);
      add(int(1, dim), "Debit", amount, `UPI - ${name}`, `UPI-${name}-${name.split(" ")[0].toLowerCase()}@demo-${ref}-PAYMENT FROM PHONE`, "Transfer", `0000${ref}`);
    }
  }

  // UPI money received
  const upiIn = int(1, 3);
  for (let i = 0; i < upiIn; i++) {
    const name = pick(PEOPLE);
    const ref = ref12();
    add(int(1, dim), "Credit", pick([500, 1000, 1500, 2000, 3500, 5000]), `UPI - ${name}`, `UPI-${name}-${name.split(" ")[0].toLowerCase()}@demo-${ref}-PAYMENT FROM PHONE`, "Transfer", `0000${ref}`);
  }

  // ATM cash withdrawals (0 to 2 per month)
  const atm = int(0, 2);
  for (let i = 0; i < atm; i++) {
    add(int(1, dim), "Debit", pick([2000, 3000, 5000]), `ATM WDL - ${pick(CITIES)}`, `ATW-4000XXXXXX0000-DEMOATM01-${pick(CITIES)}`, "Cash", `00000000${int(10000000, 99999999)}`);
  }

  // Salary on the last day of the month
  const code = `${MON[month - 1]}${String(year).slice(2)}SALARY`;
  add(dim, "Credit", 64000 + (month % 4) * 1500, "SALARY - NORTHWIND SYSTEMS", `SALARY - NORTHWIND SYSTEMS PVT LTD-${code}`, "Income", code);

  // Keep order by date (sort is stable, so same-day items keep their order)
  return list.sort((a, b) => a.date - b.date);
}

// Public: transactions of a month, only up to TODAY (future days are hidden).
export function getMonthlyTransactions(month, year) {
  // No data before the origin month.
  if (year * 12 + month < ORIGIN.year * 12 + ORIGIN.month) return [];

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return buildMonth(month, year).filter((t) => t.date <= endOfToday);
}

export function calculateMonthlySummary(transactions) {
  const credit = transactions
    .filter((item) => item.type === "Credit")
    .reduce((total, item) => total + item.amount, 0);

  const debit = transactions
    .filter((item) => item.type === "Debit")
    .reduce((total, item) => total + item.amount, 0);

  return { credit: round2(credit), debit: round2(debit) };
}

// Balance at the START of the given date (all transactions before it are included).
export function getBalanceBefore(date) {
  let balance = OPENING_AT_ORIGIN;
  const cursor = new Date(ORIGIN.year, ORIGIN.month - 1, 1);
  while (cursor <= date) {
    for (const t of getMonthlyTransactions(cursor.getMonth() + 1, cursor.getFullYear())) {
      if (t.date < date) balance += t.type === "Credit" ? t.amount : -t.amount;
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return round2(balance);
}

// Balance right now (includes everything up to end of today).
export function getCurrentBalance() {
  const now = new Date();
  return getBalanceBefore(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
}
