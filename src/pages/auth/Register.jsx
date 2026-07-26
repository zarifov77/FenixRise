import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Flame, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "../../stores/useAuthStore";
import TermsModal from "../../components/ui/TermsModal";
import logo from "../../assets/logo.svg";

const EXAM_OPTIONS = ["SAT", "IELTS", "TOEFL", "Both", "Other"];

export default function Register() {
  const navigate  = useNavigate();
  const register  = useAuthStore(s => s.register);
  const [form, setForm]             = useState({ name:"", email:"", password:"", targetExam:"SAT" });
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [showTerms, setShowTerms]   = useState(false);
  const [agreedTerms, setAgreed]    = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = (() => {
    const p = form.password; let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const SC = ["","#ef4444","#f97316","#eab308","#22c55e"];
  const SL = ["","Weak","Fair","Good","Strong"];

  const submit = async e => {
    e.preventDefault();
    if (!agreedTerms) { setError("Please agree to the Terms of Service."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      <div className="min-h-screen flex" style={{ background:"var(--bg)" }}>
        {/* Left */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
          style={{ background:"var(--bg-card)", borderRight:"1px solid var(--border)" }}>
          <motion.div 
            animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="glow-orb" 
            style={{ width:380, height:380, background:"var(--pumpkin-glow)", top:-60, right:-60 }} />
          <Link to="/" className="flex items-center gap-3 relative z-10">
            <img src={logo} alt="" className="h-9 w-9 object-contain" />
            <span className="font-display text-[20px]" style={{ fontWeight:800, color:"var(--text-primary)" }}>
              Fenix<span style={{ color:"var(--pumpkin)" }}>Rise</span>
            </span>
          </Link>
          <div className="relative z-10">
            <h2 className="font-display text-[36px] leading-[1.1] mb-5" style={{ fontWeight:800, color:"var(--text-primary)" }}>
              Start your journey to <span className="gradient-text">your dream university</span>
            </h2>
            <div className="flex flex-col gap-3.5">
              {["Personalised AI admission roadmap","SAT & IELTS prep courses included","Smart university matching engine","Expert mentor matching"].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:"var(--pumpkin-soft)" }}>
                    <Check size={11} style={{ color:"var(--pumpkin)" }} strokeWidth={3} />
                  </div>
                  <span className="text-[14px]" style={{ color:"var(--text-secondary)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[12px] relative z-10" style={{ color:"var(--text-muted)" }}>© 2025 FenixRise</p>
        </motion.div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-[400px] py-8">
            <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
              <img src={logo} alt="" className="h-8 w-8 object-contain" />
              <span className="font-display text-[18px]" style={{ fontWeight:800, color:"var(--text-primary)" }}>
                Fenix<span style={{ color:"var(--pumpkin)" }}>Rise</span>
              </span>
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-display text-[26px] font-bold mb-1.5" 
              style={{ fontWeight:700, color:"var(--text-primary)" }}>Create your account</motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[14px] mb-8" 
              style={{ color:"var(--text-secondary)" }}>
              Already have one?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color:"var(--pumpkin)" }}>Sign in</Link>
            </motion.p>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[13px] px-4 py-3 rounded-xl mb-5"
                style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.20)", color:"#ef4444" }}>
                {error}
              </motion.div>
            )}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={submit} 
              className="flex flex-col gap-4">
              {[["name","text","Full Name","Your full name"],["email","email","Email","your@email.com"]].map(([name,type,label,ph]) => (
                <div key={name}>
                  <label className="text-[12px] font-bold uppercase tracking-wider block mb-2" style={{ color:"var(--text-muted)" }}>{label}</label>
                  <input name={name} type={type} value={form[name]} onChange={handle} required placeholder={ph} className="form-input" />
                </div>
              ))}
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider block mb-2" style={{ color:"var(--text-muted)" }}>Password</label>
                <div className="relative">
                  <input name="password" type={showPass?"text":"password"} value={form.password} onChange={handle} required placeholder="Min. 8 characters"
                         className="form-input" style={{ paddingRight:44 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                             style={{ background: i<=strength ? SC[strength] : "var(--border)" }} />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color:SC[strength] }}>{SL[strength]}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider block mb-2" style={{ color:"var(--text-muted)" }}>Target Exam</label>
                <div className="flex flex-wrap gap-2">
                  {EXAM_OPTIONS.map(opt => (
                    <button key={opt} type="button" onClick={() => setForm({...form,targetExam:opt})}
                            className="px-4 py-2 rounded-full text-[13px] font-semibold border transition-all"
                            style={{
                              background: form.targetExam===opt ? "var(--pumpkin)" : "var(--bg-input)",
                              borderColor: form.targetExam===opt ? "var(--pumpkin)" : "var(--border)",
                              color: form.targetExam===opt ? "#fff" : "var(--text-secondary)",
                            }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <button type="button" onClick={() => setAgreed(!agreedTerms)}
                        className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                        style={{ background: agreedTerms?"var(--pumpkin)":"transparent", borderColor: agreedTerms?"var(--pumpkin)":"var(--border)" }}>
                  {agreedTerms && <Check size={12} color="#fff" strokeWidth={3} />}
                </button>
                <p className="text-[12px] leading-relaxed" style={{ color:"var(--text-secondary)" }}>
                  I agree to the{" "}
                  <button type="button" onClick={() => setShowTerms(true)} className="font-semibold hover:underline" style={{ color:"var(--pumpkin)" }}>
                    Terms of Service
                  </button>{" "}and{" "}
                  <Link to="/privacy" className="font-semibold hover:underline" style={{ color:"var(--pumpkin)" }}>Privacy Policy</Link>
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading || !agreedTerms} 
                className="btn-primary justify-center mt-1 disabled:opacity-50">
                {loading
                  ? <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"white", borderTopColor:"transparent" }} />
                  : <><Flame size={15}/> Create Account <ArrowRight size={15}/></>}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
