import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../../data/content";
import useAuthStore from "../../stores/useAuthStore";
import ThemeToggle from "../ui/ThemeToggle";
import logo from "../../assets/logo.svg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { isAuthed, logout }    = useAuthStore();
  const navigate                = useNavigate();
  const location                = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleNavLink = (href) => {
    setOpen(false);
    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate({ pathname: "/", hash: href });
        return;
      }
      navigate(href);
      return;
    }
    navigate(href);
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--bg-secondary)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        padding: scrolled ? "10px 0" : "18px 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display text-[22px] tracking-tight" style={{ fontWeight: 800, color: "var(--text-primary)" }}>
            Fenix<span style={{ color: "var(--pumpkin)" }}>Rise</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <button key={l.label} type="button"
               onClick={() => handleNavLink(l.href)}
               className="text-[13px] font-semibold transition-colors duration-200 relative group bg-transparent border-none p-0"
               style={{ color: "var(--text-secondary)" }}
               onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
               onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px rounded-full transition-all duration-300 group-hover:w-full"
                    style={{ background: "var(--pumpkin)" }} />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthed ? (
            <>
              <Link to="/dashboard"
                    className="text-[13px] font-semibold transition-colors"
                    style={{ color: "var(--text-secondary)" }}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-ghost !py-2.5 !px-5 !text-[13px]">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-semibold transition-colors"
                    style={{ color: "var(--text-secondary)" }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary !py-2.5 !px-5 !text-[13px]">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} style={{ color: "var(--text-primary)" }}>
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="px-6 py-6 flex flex-col gap-5"
             style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
          {NAV_LINKS.map(l => (
            <button key={l.label} type="button" onClick={() => handleNavLink(l.href)}
               className="text-[15px] font-semibold bg-transparent border-none p-0 text-left"
               style={{ color: "var(--text-primary)" }}>
              {l.label}
            </button>
          ))}
          <hr style={{ borderColor: "var(--border)" }} />
          {isAuthed ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Dashboard</Link>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="btn-ghost justify-center">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}
                    className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary justify-center">Get Started Free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
