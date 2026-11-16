// Quick Recharge card: Mobile / FASTag / DTH tabs with a number field and Proceed.
// Has a background image behind the content — change BG_IMAGE below to swap it.
// Visual demo only — no real recharge is performed.
import { useState } from "react";
import { Smartphone, Car, Tv } from "lucide-react";
import quickRechargeBg from "../../assets/quickrecharge-bg.jpg"; // <- put your image here, update filename if needed

const TABS = [
  { id: "mobile", label: "Mobile", icon: Smartphone, placeholder: "Enter Mobile Number" },
  { id: "fastag", label: "FASTag", icon: Car, placeholder: "Enter Vehicle Number" },
  { id: "dth", label: "DTH", icon: Tv, placeholder: "Enter Customer ID" },
];

export default function QuickRecharge() {
  const [tab, setTab] = useState("mobile");
  const [value, setValue] = useState("");
  const active = TABS.find((t) => t.id === tab);

  function proceed() {
    if (!value.trim()) {
      alert(`Please enter a value for ${active.label} recharge.`);
      return;
    }
    alert("This is a demo. No real recharge happens here.");
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-cover bg-center "
      style={{ backgroundImage: `url(${quickRechargeBg})` }}
    >
      {/* Light overlay so text/inputs stay readable over any image */}
      {/* <div className=" inset-0 " />

      {/* Content sits above the overlay/image */}
      {/* <div className="z-10">
        <h2 className="font-semibold text-slate-800">Quick Recharge</h2>

        <div className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setValue(""); }}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-3 text-xs font-semibold ${
                  isActive ? "bg-white text-blue-800 shadow" : "text-slate-500"
                }`}
              >
                <Icon size={18} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs font-semibold text-slate-500">{active.placeholder}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={active.placeholder}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none"
          />
        </div>

        <button type="button" onClick={proceed} className="mt-4 w-full rounded-lg bg-blue-800 py-3 text-sm font-semibold text-white hover:bg-blue-900">
          Proceed
        </button>
      </div> */} 
    </div>
  );
}