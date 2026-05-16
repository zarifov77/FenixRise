import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, FileText, Map,
  TrendingUp, Settings, Settings2, LogOut, Menu, X,
  GraduationCap, BookMarked, PanelLeftClose, PanelLeftOpen, User, // ← add User
} from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import ThemeToggle from "../ui/ThemeToggle";
import BugReport from "../ui/BugReport";
import logo from "../../assets/logo.png";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to:"/dashboard",              icon:"🏠", label:"Dashboard"    },
      { to:"/dashboard/universities", icon:"🎓", label:"Universities" },
    ]
  },
  {
    label: "Organize",
    items: [
      { to:"/dashboard/courses",      icon:"📚", label:"Courses"      },
      { to:"/dashboard/tests",        icon:"🧪", label:"Tests"        },
      { to:"/dashboard/roadmap",      icon:"🗺️", label:"My Roadmap"   },
      { to:"/dashboard/notebook",     icon:"📓", label:"Notebook"     },
      { to:"/dashboard/whiteboard",   icon:"🎨", label:"Whiteboard"   },
      { to:"/dashboard/advisor",      icon:"🤖", label:"AI Advisor"   },
    ]
  },
  {
    label: "Preparation",
    items: [
      { to:"/dashboard/progress",     icon:"📈", label:"Progress"     },
      { to:"/dashboard/settings",     icon:"⚙️", label:"Settings"     },
      { to: "/dashboard/profile",     icon: "👤", label: "My Profile"  },
    ]
  },
];

const Sidebar = ({ isMobile = false, sidebarW, setMobileOpen }) => {
  const isCol = false;

  return (
    <aside
      className={isMobile ? "sidebar-enter" : ""}
      style={{
        width: isMobile ? 220 : sidebarW,
        minWidth: isMobile ? 220 : sidebarW,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--glass-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid var(--glass-border)",
      }}>

      {/* Logo row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"18px 12px", borderBottom:"1px solid var(--glass-border)", minHeight:80, flexShrink:0 }}>
        <NavLink to="/" style={{ display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none" }}>
          <img src={logo} alt="" style={{ height:40, width:40, objectFit:"contain" }}/>
        </NavLink>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{ marginLeft:"auto", color:"var(--text-muted)", background:"none", border:"none", cursor:"pointer" }}>
            <X size={18}/>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:8, overflowY:"auto" }}>
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {/* Section header */}
            {!isCol && (
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.5px",
                color: "var(--pumpkin)",
                padding: "8px 14px 4px 14px",
                textTransform: "uppercase",
              }}>
                {section.label}
              </div>
            )}
            {/* Section items */}
            {section.items.map(({ to, icon, label }) => (
              <NavLink key={to} to={to} end={to==="/dashboard"} title={isCol ? label : undefined}
                className={({ isActive }) => `nav-item ${isActive?"active":""}`}
                style={{
                  justifyContent: isCol ? "center" : "flex-start",
                  padding: "12px 14px",
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: 14,
                }}>
                <span style={{ fontSize: 18, lineHeight: 1, width: 24, textAlign: "center" }}>{icon}</span>
                {!isCol && <span style={{ fontSize:13, whiteSpace:"nowrap" }}>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef                     = useRef(null);
  const { user, logout }               = useAuthStore();
  const navigate                       = useNavigate();
  const location                       = useLocation();

  const handleLogout = async () => { await logout(); navigate("/"); };

  useEffect(() => {
    const fn = e => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Close mobile menu ONLY on route change (desktop sidebar state remains unchanged)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [location.pathname]);

  const initials = user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "?";
  const sidebarW = 220;

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg)" }}>
      {/* Desktop sidebar — fixed */}
      <div className="hidden lg:block" style={{ position:"fixed", inset:"0 auto 0 0", width:sidebarW, zIndex:20, overflow:"hidden" }}>
        <Sidebar sidebarW={sidebarW} setMobileOpen={setMobileOpen} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden" style={{ position:"fixed", inset:0, zIndex:50, display:"flex" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
               onClick={() => setMobileOpen(false)}/>
          <div style={{ position:"relative", zIndex:10, height:"100%" }}>
            <Sidebar isMobile sidebarW={sidebarW} setMobileOpen={setMobileOpen} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", marginLeft:sidebarW, minWidth:0 }}
           className="lg:ml-auto">

        {/* Topbar */}
        <header style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between",
                   padding:"12px 20px", background:"var(--glass-bg)", backdropFilter:"blur(20px)",
                   borderBottom:"1px solid var(--glass-border)", flexShrink:0 }}>
          <div style={{ minWidth:32, display:"flex", alignItems:"center" }}>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden" style={{ color:"var(--text-secondary)", background:"none", border:"none", cursor:"pointer" }}>
              <Menu size={22}/>
            </button>
          </div>

          <span className="font-display" style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%)", fontSize:16, fontWeight:800, color:"var(--text-primary)" }}>
            Fenix<span style={{ color:"var(--pumpkin)" }}>Rise</span>
          </span>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <ThemeToggle/>
            {/* User menu */}
            <div style={{ position:"relative" }} ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(v=>!v)}
                      style={{ display:"flex", alignItems:"center", justifyContent:"center", width:40, height:40, borderRadius:"50%",
                               background:"linear-gradient(135deg,#FE7F2D,#FFAD60)", border:"none", cursor:"pointer",
                               boxShadow:"0 10px 25px rgba(0,0,0,0.12)", transition:"transform 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                      title={user?.name || "Profile"}>
                <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{initials}</span>
              </button>

              {/* Popup */}
              {showUserMenu && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, borderRadius:16, overflow:"hidden",
                              background:"var(--bg-card)", border:"1px solid var(--glass-border)", boxShadow:"0 16px 48px rgba(0,0,0,0.2)", zIndex:100, minWidth:200 }}>
                  <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--glass-border)" }}>
                    <p style={{ fontSize:13, fontWeight:600, color:"var(--text-primary)" }}>{user?.name}</p>
                    <p style={{ fontSize:11, color:"var(--text-muted)" }}>{user?.email}</p>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); navigate("/profile"); }}
                          style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                                   fontSize:13, fontWeight:600, color:"var(--text-primary)", background:"transparent", border:"none", cursor:"pointer", transition:"background 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <User size={16}/> Profile
                  </button>
                  <button onClick={() => { setShowUserMenu(false); navigate("/dashboard/settings"); }}
                          style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                                   fontSize:13, fontWeight:600, color:"var(--text-primary)", background:"transparent", border:"none", cursor:"pointer", transition:"background 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <Settings2 size={16}/> Settings
                  </button>
                  <button onClick={handleLogout}
                          style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                                   fontSize:13, fontWeight:600, color:"#ef4444", background:"transparent", border:"none", cursor:"pointer", transition:"background 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <LogOut size={16}/> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:"32px", overflowY:"auto", background:"var(--bg)" }}>
          {children}
        </main>
        <BugReport />
      </div>
    </div>
  );
}
