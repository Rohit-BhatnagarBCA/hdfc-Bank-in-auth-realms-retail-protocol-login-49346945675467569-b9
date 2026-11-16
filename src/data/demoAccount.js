// Shared fictional account info + formatting helpers used by all banking pages.
// Everything here is DEMO data. Change it in one place and every page updates.

// Same logo URL as the login page.
export const LOGO_URL =
  "https://now.hdfc.bank.in/auth/resources/7ih90/login/hdfc-retail-web/assets/hdfc-bank-logo.svg";

export const ACCOUNT = {
  type: "Savings A/C",
  masked: "**** **** **66 98", // fictional
  openingBalance: 45000, // fictional
};

export const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (date) =>
  date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// dd-mm-yyyy, the format shown in the statement date boxes.
export const formatDMY = (date) =>
  `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
