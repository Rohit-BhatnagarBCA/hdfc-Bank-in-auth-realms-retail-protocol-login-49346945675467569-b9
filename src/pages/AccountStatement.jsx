// Account Statement page: pick a period, "prepare" the statement (progress popup),
// download it as PDF / Excel / CSV / Text, and see it listed under "Recently Downloaded Statements".
// Also shows a JSON-driven transaction list card (JsonStatementCard) with its own filter/search/sort.
import { useState, useMemo, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  Download, Mail, ChevronDown, CalendarDays, X, CheckCircle2,
  UserSquare, FileText, ScrollText, ShieldAlert, Info,
} from "lucide-react";
import PageHero from "../components/banking/PageHero";
import QuickLinks from "../components/banking/QuickLinks";
import JsonStatementCard from "../components/banking/JsonStatementCard";
import { ACCOUNT, formatAmount, formatDate, formatDMY } from "../data/demoAccount";
import { getMonthlyTransactions, calculateMonthlySummary, getBalanceBefore, getCurrentBalance } from "../data/demoTransactions";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const FORMATS = [
  { value: "pdf", label: "PDF", ext: "pdf" },
  { value: "xlsx", label: "Excel", ext: "xlsx" },
  { value: "csv", label: "CSV", ext: "csv" },
  { value: "txt", label: "Text", ext: "txt" },
];

// true  = PDF option gives your own PDF from the /public folder.
// false = PDF option generates the demo PDF with jsPDF (uses the fictional data).
const USE_OWN_PDF = true;
const OWN_PDF_URL = `${import.meta.env.BASE_URL}demo-statement.pdf`;

function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function saveOwnPdf(fileName) {
  const link = document.createElement("a");
  link.href = OWN_PDF_URL;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function buildRows(transactions, opening) {
  let balance = opening;
  return transactions.map((t) => {
    balance = Math.round((balance + (t.type === "Credit" ? t.amount : -t.amount)) * 100) / 100;
    return {
      Date: formatDMY(t.date),
      Narration: t.narration || t.description,
      "Ref No.": t.reference || "",
      "Debit (INR)": t.type === "Debit" ? t.amount : "",
      "Credit (INR)": t.type === "Credit" ? t.amount : "",
      "Balance (INR)": balance,
    };
  });
}

function saveExcel(label, transactions, opening, fileName) {
  const sheet = XLSX.utils.json_to_sheet(buildRows(transactions, opening));
  sheet["!cols"] = [{ wch: 12 }, { wch: 60 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 16 }];
  const info = XLSX.utils.aoa_to_sheet([
    ["DEMO STATEMENT - FICTIONAL DATA"],
    ["Account", ACCOUNT.masked],
    ["Period", label],
    ["Not issued by any bank. Not valid as financial proof."],
  ]);
  info["!cols"] = [{ wch: 50 }, { wch: 24 }];
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Statement");
  XLSX.utils.book_append_sheet(book, info, "Info");
  XLSX.writeFile(book, fileName);
}

function saveCsv(transactions, opening, fileName) {
  const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(buildRows(transactions, opening)));
  saveBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), fileName);
}

function saveText(label, transactions, opening, fileName) {
  const rows = buildRows(transactions, opening);
  const lines = [
    "DEMO STATEMENT - FICTIONAL DATA (NOT ISSUED BY ANY BANK)",
    `Account: ${ACCOUNT.masked}`,
    `Period : ${label}`,
    "",
    ["Date".padEnd(12), "Narration".padEnd(54), "Debit".padStart(12), "Credit".padStart(12), "Balance".padStart(14)].join(" "),
    ...rows.map((r) =>
      [
        r.Date.padEnd(12),
        r.Narration.slice(0, 54).padEnd(54),
        String(r["Debit (INR)"]).padStart(12),
        String(r["Credit (INR)"]).padStart(12),
        String(r["Balance (INR)"]).padStart(14),
      ].join(" ")
    ),
  ];
  saveBlob(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }), fileName);
}

function buildPeriodOptions() {
  const now = new Date();
  const opts = [{ value: "recent", label: "Recent Transactions" }];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    opts.push({ value: `m:${d.getFullYear()}-${d.getMonth()}`, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}` });
  }
  opts.push({ value: "cfy", label: "Current Financial Year" });
  opts.push({ value: "pfy", label: "Previous Financial Year" });
  opts.push({ value: "custom", label: "Custom Date" });
  return opts;
}

function resolveRange(period, customFrom, customTo) {
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  if (period === "recent") return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
  if (period.startsWith("m:")) {
    const [y, m] = period.slice(2).split("-").map(Number);
    return { from: new Date(y, m, 1), to: new Date(y, m + 1, 0) };
  }
  if (period === "cfy") return { from: new Date(fyStart, 3, 1), to: now };
  if (period === "pfy") return { from: new Date(fyStart - 1, 3, 1), to: new Date(fyStart, 2, 31) };
  return { from: new Date(customFrom), to: new Date(customTo) };
}

function getTransactionsInRange(from, to) {
  const list = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  while (cursor <= to) {
    list.push(...getMonthlyTransactions(cursor.getMonth() + 1, cursor.getFullYear()));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59);
  return list.filter((t) => t.date >= from && t.date <= end).sort((a, b) => a.date - b.date);
}

function buildPdf(label, transactions, opening) {
  const summary = calculateMonthlySummary(transactions);
  const closing = opening + summary.credit - summary.debit;
  const pdf = new jsPDF("p", "mm", "a4");
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  let y = 20;

  function watermark() {
    pdf.setTextColor(235, 225, 225);
    pdf.setFontSize(25);
    pdf.setFont("helvetica", "bold");
    pdf.text("DEMO - NOT A BANK STATEMENT", W / 2, H / 2, { align: "center", angle: 35 });
    pdf.setTextColor(35, 45, 60);
  }

  function header() {
    pdf.setFillColor(7, 65, 125);
    pdf.rect(0, 0, W, 39, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(19);
    pdf.setFont("helvetica", "bold");
    pdf.text("BLUEBANK DEMO", 15, 17);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("FICTIONAL DIGITAL BANKING EXPERIENCE", 15, 25);
    pdf.text("SAMPLE DOCUMENT", W - 15, 17, { align: "right" });
    pdf.setTextColor(35, 45, 60);
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    pdf.text("ACCOUNT STATEMENT", 15, 53);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Statement Period: ${label}`, 15, 61);
    pdf.text("Account Holder: DEMO USER", 15, 70);
    pdf.text(`Account Number: ${ACCOUNT.masked}`, 15, 77);
    y = 91;
  }

  function tableHeader() {
    pdf.setFillColor(7, 65, 125);
    pdf.rect(15, y, W - 30, 10, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("DATE", 18, y + 7);
    pdf.text("DESCRIPTION", 49, y + 7);
    pdf.text("TYPE", 113, y + 7);
    pdf.text("AMOUNT (INR)", 151, y + 7);
    pdf.setTextColor(35, 45, 60);
    y += 10;
  }

  watermark();
  header();

  pdf.setFillColor(240, 245, 251);
  pdf.roundedRect(15, y, W - 30, 39, 3, 3, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("OPENING BALANCE", 20, y + 10);
  pdf.text("TOTAL CREDIT", 82, y + 10);
  pdf.text("TOTAL DEBIT", 145, y + 10);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(formatAmount(opening), 20, y + 23);
  pdf.text(formatAmount(summary.credit), 82, y + 23);
  pdf.text(formatAmount(summary.debit), 145, y + 23);
  y += 50;
  pdf.text(`CLOSING BALANCE: ${formatAmount(closing)}`, 15, y);
  y += 13;
  tableHeader();

  transactions.forEach((t, i) => {
    if (y > H - 27) {
      pdf.setFontSize(8);
      pdf.text("DEMO DOCUMENT - NOT VALID FOR BANKING PURPOSES", 15, H - 12);
      pdf.addPage();
      watermark();
      header();
      tableHeader();
    }
    if (i % 2 === 0) {
      pdf.setFillColor(244, 247, 250);
      pdf.rect(15, y, W - 30, 10, "F");
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(formatDate(t.date), 18, y + 6.5);
    pdf.text(t.description, 49, y + 6.5);
    pdf.text(t.type.toUpperCase(), 113, y + 6.5);
    pdf.setTextColor(t.type === "Credit" ? 20 : 190, t.type === "Credit" ? 135 : 55, t.type === "Credit" ? 75 : 55);
    pdf.text(formatAmount(t.amount), W - 18, y + 6.5, { align: "right" });
    pdf.setTextColor(35, 45, 60);
    y += 10;
  });

  if (y > H - 27) {
    pdf.addPage();
    watermark();
    header();
    y = 110;
  }
  pdf.setDrawColor(210, 220, 230);
  pdf.line(15, y + 5, W - 15, y + 5);
  pdf.setFontSize(8);
  pdf.setTextColor(110, 120, 130);
  pdf.text("This document contains fictional data for software demonstration only.", W / 2, y + 13, { align: "center" });
  pdf.text("NOT ISSUED BY ANY BANK | NOT VALID AS FINANCIAL PROOF", W / 2, y + 20, { align: "center" });
  return pdf;
}

export default function AccountStatement({ setPage }) {
  const options = useMemo(() => buildPeriodOptions(), []);
  const [period, setPeriod] = useState("pfy");
  const [format, setFormat] = useState("pdf");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [recent, setRecent] = useState([]);

  const isCustom = period === "custom";
  const range = resolveRange(period, customFrom, customTo);
  const rangeValid = !isNaN(range.from) && !isNaN(range.to) && range.from <= range.to;
  const label = rangeValid ? `${formatDMY(range.from)} to ${formatDMY(range.to)}` : "";

  const available = getCurrentBalance();

  const timerRef = useRef(null);
  useEffect(() => () => clearInterval(timerRef.current), []);

  function downloadForPeriod(snap) {
    const fmt = FORMATS.find((f) => f.value === snap.format) || FORMATS[0];
    const fileName = `Statement-${formatDMY(snap.from)}-to-${formatDMY(snap.to)}.${fmt.ext}`;
    const transactions = getTransactionsInRange(snap.from, snap.to);
    const opening = getBalanceBefore(snap.from);

    if (fmt.value === "pdf") {
      if (USE_OWN_PDF) saveOwnPdf(fileName);
      else buildPdf(snap.label, transactions, opening).save(fileName);
    } else if (fmt.value === "xlsx") {
      saveExcel(snap.label, transactions, opening, fileName);
    } else if (fmt.value === "csv") {
      saveCsv(transactions, opening, fileName);
    } else {
      saveText(snap.label, transactions, opening, fileName);
    }
  }

  function finishDownload(snap) {
    downloadForPeriod(snap);
    setRecent((list) => [snap, ...list]);
    setPreparing(false);
    setSuccess(true);
  }

  function startDownload() {
    if (!rangeValid) {
      alert("Please select a valid From and To date.");
      return;
    }
    const snap = { label, from: range.from, to: range.to, format };
    let value = 0;
    setSuccess(false);
    setProgress(0);
    setPreparing(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) {
        clearInterval(timerRef.current);
        finishDownload(snap);
      }
    }, 200);
  }

  function cancelPreparing() {
    clearInterval(timerRef.current);
    setPreparing(false);
  }

  function redownload(item) {
    downloadForPeriod(item);
  }

  const demoAlert = (what) => () => alert(`${what} is not available in this demo.`);

  const links = [
    { label: "Go to Account Details", icon: UserSquare, onClick: () => setPage("accounts") },
    { label: "Forms Center", icon: FileText, onClick: demoAlert("Forms Center") },
    { label: "Download Interest Certificate", icon: ScrollText, onClick: demoAlert("Interest certificate") },
    { label: "Download Balance Certificate", icon: ScrollText, onClick: demoAlert("Balance certificate") },
    { label: "Raise Dispute and Report Fraud", icon: ShieldAlert, onClick: demoAlert("Dispute") },
  ];

  return (
    <div>
      <PageHero title="Account Statement" onBack={() => setPage("accounts")} compact />

      <div className="mx-auto -mt-20 grid max-w-7xl gap-6 px-4 pb-10 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {success && (
            <div className="flex items-start justify-between rounded-lg border border-green-300 bg-green-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 text-green-600" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Download Successful</p>
                  <p className="text-xs text-slate-600">Statement downloaded successfully.</p>
                </div>
              </div>
              <button type="button" onClick={() => setSuccess(false)} aria-label="Close"><X size={18} /></button>
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-5 font-semibold text-2xl text-slate-800">Select Account and Statement Period</h2>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <p className="text-1xl text-slate-900">{ACCOUNT.type} {ACCOUNT.masked}</p>
               <p>Navin kukreja</p> 
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-slate-800">{formatAmount(available)}</p>
                  <p className="text-[14px] text-slate-500">Available Balance</p>
                </div>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-lg border-2 border-blue-700 bg-white p-3 text-sm outline-none"
              >
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              <DateBox disabled={!isCustom} label="From Date" value={isCustom ? customFrom : rangeValid ? toInput(range.from) : ""} onChange={setCustomFrom} />
              <DateBox disabled={!isCustom} label="To Date" value={isCustom ? customTo : rangeValid ? toInput(range.to) : ""} onChange={setCustomTo} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-slate-100 p-3">
              <p className="w-40 text-xs text-slate-500">Download / Email statement for selected period</p>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white p-3 text-sm"
              >
                {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <button type="button" onClick={startDownload} className="flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-900">
                <Download size={16} /> Download
              </button>
              <button type="button" onClick={demoAlert("Email")} className="flex items-center gap-2 rounded-lg border border-blue-800 bg-white px-6 py-3 text-sm font-semibold text-blue-800">
                <Mail size={16} /> Email (PDF)
              </button>
            </div>

            <p className="mt-6 text-xs font-semibold text-slate-600">Note:</p>
            <ul className="mt-1 list-disc pl-5 text-1xl text-slate-700">
              <li>'Recent transactions' is for View only. To download or email a statement, choose any other option from the dropdown menu.’</li>
            </ul>
          </div>

          {/* JSON-driven transaction list: list/grid toggle, category filter, search, newest-first */}
          <JsonStatementCard />

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="font-semibold text-slate-800">Recently Downloaded Statements</h2>
            <p className="mt-1 text-xs text-slate-500">Statements downloaded in this session are listed here.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-slate-100 text-xs text-slate-500">
                  <tr><th className="p-3">Statement Period</th><th className="p-3">Format</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody>
                  {recent.length === 0 && (
                    <tr><td colSpan={3} className="p-4 text-xs text-slate-400">No statements downloaded yet.</td></tr>
                  )}
                  {recent.map((item, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="p-3">{item.label}</td>
                      <td className="p-3">{(FORMATS.find((f) => f.value === item.format) || FORMATS[0]).label}</td>
                      <td className="p-3">
                        <button type="button" onClick={() => redownload(item)} className="flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white">
                          <Download size={14} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
            <Info size={18} className="text-black-100" />
           
Found a suspicious transaction in the last 60 days? 


          </div>
        </div>

        <QuickLinks links={links} />
      </div>

      {preparing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Preparing your Statement...</h3>
              <button type="button" onClick={cancelPreparing} aria-label="Close"><X size={18} /></button>
            </div>
            <div className="mt-5 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-blue-700 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-600">It might take a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}

function toInput(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function DateBox({ label, value, onChange, disabled }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border p-3 ${disabled ? "border-slate-200 bg-slate-100" : "border-slate-300 bg-white"}`}>
      <CalendarDays size={16} className="text-slate-500" />
      <input
        type="date"
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none"
      />
    </div>
  );
}