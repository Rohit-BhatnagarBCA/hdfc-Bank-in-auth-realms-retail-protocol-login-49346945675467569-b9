// React hook for managing component state.
import { useState, useEffect } from "react";
import AccountStatement from "./pages/AccountStatement";

// Pages and layout shown after login.
import Navbar from "./components/banking/Navbar";
import Home from "./pages/Home";
import Accounts from "./pages/Accounts";
import IntroLoader from "./components/IntroLoader";

// Icons used on the login page.
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

// Address-bar path for each page (only the part after localhost:xxxx changes).
const PAGE_PATHS = {
  home: "/retail-app/dashboard",
  accounts: "/retail-app/my-accounts",
  statement: "/retail-app/my-accounts/download-statement",
};

// Find which page belongs to a path. Unknown path (like "/") falls back to home.
function pageFromPath(pathname) {
  const hit = Object.entries(PAGE_PATHS).find(([, path]) => path === pathname);
  return hit ? hit[0] : "home";
}

function Auth({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [bankingType, setBankingType] = useState("personal");
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordStep, setShowPasswordStep] = useState(false);

  // Show the password field when the Customer ID input is clicked.
  function handleCustomerIdClick() {
    if (mode === "login") {
      setShowPasswordStep(true);
    }
  }

  // Return to the Customer ID step.
  function handleChangeId() {
    setShowPasswordStep(false);
    setPassword("");
  }

  // Handle login and registration.
  function handleSubmit(event) {
    event.preventDefault();

    if (!customerId.trim() || !password.trim()) {
      alert("Please enter your demo credentials.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      alert("Please enter your name.");
      return;
    }

    onSuccess({
      name: mode === "register" ? name.trim() : customerId.trim(),
      email: `${customerId.trim()}@demo.local`,
    });
  }

  // Switch between login and registration modes.
  function switchMode(next) {
    setMode(next);
    setShowPasswordStep(false);
    setPassword("");
    setCustomerId("");
    setName("");
    setShowPassword(false);
  }

  const showIdOnlyStep = mode === "login" && !showPasswordStep;

  return (
    <div className="bank-login-page">

      <section className="login-promo-panel">
        <img
          src="https://now.hdfc.bank.in/content/dam/hdfc-bank-cms/assets/corebanking/nb/en/v1/images/login-assets/login.svg"
          alt=""
        />
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">

          <div className="login-brand">
            <img
              src="https://now.hdfc.bank.in/auth/resources/7ih90/login/hdfc-retail-web/assets/hdfc-bank-logo.svg"
              alt=""
            />
          </div>

          <h2 className="login-welcome">
            Welcome to NetBanking
          </h2>

          <div className="banking-tabs">
            <button
              type="button"
              className={bankingType === "personal" ? "banking-tab active" : "banking-tab"}
              onClick={() => setBankingType("personal")}
            >
              Personal Banking
            </button>

            <button
              type="button"
              className={bankingType === "cards" ? "banking-tab active" : "banking-tab"}
              onClick={() => setBankingType("cards")}
            >
              Credit Cards/Loans Only
            </button>
          </div>

          <div className="qr-login-card">
            <div className="qr-placeholder">
              <img
                width="72"
                height="72"
                aria-hidden="true"
                alt="QR"
                src="https://now.hdfc.bank.in/content/dam/hdfc-bank-cms/assets/corebanking/nb/en/v1//images/kavach-assets/QR_Scan.gif"
                loading="lazy"
              />
              <small></small>
            </div>

            <div className="qr-information">
              <h3>
                Login without Password
                <span className="new-tag">NEW</span>
              </h3>

              <p>Scan using your HDFC Bank App secured with Kavach</p>
            </div>

            <span className="qr-arrow">→</span>
          </div>

          <div className="qr-message">
            Click here to Scan QR Code. It's secure &amp; faster!
          </div>

          <div className="or-divider">
            <span></span>
            <p>Or</p>
            <span></span>
          </div>

          {showIdOnlyStep ? (
            // Login Step 1: Customer ID.
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowPasswordStep(true);
              }}
              className="bank-login-form"
            >
              <div className="bank-field">
                <label>Customer ID / User ID</label>

                <input
                  type="text"
                  placeholder=""
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  onClick={handleCustomerIdClick}
                  autoFocus
                  required
                />

                <a href="#demo-help" className="bank-help-link">
                  Get Customer ID
                </a>
              </div>

              <button type="submit" className="bank-submit-button">
                Login
              </button>
            </form>
          ) : (
            // Login Step 2 or complete Registration form.
            <form onSubmit={handleSubmit} className="bank-login-form">

              {mode === "register" && (
                <div className="bank-field">
                  <label>Full Name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="bank-field">
                <label>{bankingType === "personal" ? "Customer ID / User ID" : ""}</label>

                {mode === "login" ? (
                  <div className="bank-password-field">
                    <input type="text" value={customerId} disabled />

                    <button type="button" onClick={handleChangeId}></button>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder=""
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                  />
                )}
              </div>

              <div className="bank-field">
                <label>Password</label>

                <div className="bank-password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="bank-submit-button">
                {mode === "register" ? "Register Now" : "Login"}
              </button>

            </form>
          )}

          <div className="bank-register-link">
            {mode === "login" ? (
              <>
                Not registered for NetBanking?
                <button type="button" onClick={() => switchMode("register")}>
                  Register Now
                </button>
              </>
            ) : (
              <>
                Already registered?
                <button type="button" onClick={() => switchMode("login")}>
                  Login
                </button>
              </>
            )}
          </div>

          <div className="login-security-note">
            <ShieldCheck size={15} />
            © Copyright HDFC Bank Ltd. | Terms and Conditions | Privacy Policy | Compatible Browsers
          </div>

        </div>
      </section>

    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPageState] = useState(() => pageFromPath(window.location.pathname));

  // Change the page AND the address-bar path together (so Back button works too).
  function setPage(next) {
    setPageState(next);
    window.history.pushState({}, "", PAGE_PATHS[next]);
  }

  // Browser Back / Forward buttons: show the page that matches the path.
  useEffect(() => {
    const onPop = () => setPageState(pageFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Show the loader for 5.5s after a successful login, then reveal the dashboard.
  function login(newUser) {
    setLoading(true);
    setTimeout(() => {
      setUser(newUser);
      window.history.replaceState({}, "", PAGE_PATHS[page]);
      setLoading(false);
    }, 5500);
  }

  function logout() {
    setUser(null);
    setPageState("home");
    window.history.pushState({}, "", "/");
  }

  if (loading) {
    return <IntroLoader onDone={() => {}} />;
  }

  if (!user) {
    return <Auth onSuccess={login} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar page={page} setPage={setPage} onLogout={logout} />

      {page === "home" && <Home user={user} setPage={setPage} />}
      {page === "accounts" && <Accounts setPage={setPage} />}
      {page === "statement" && <AccountStatement setPage={setPage} />}

      <footer className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-400">
        Educational demo only • Fictional data • Not an official bank website
      </footer>
    </div>
  );
}