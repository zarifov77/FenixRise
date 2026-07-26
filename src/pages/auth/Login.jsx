import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Flame, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "../../stores/useAuthStore";
import TermsModal from "../../components/ui/TermsModal";
import logo from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login    = useAuthStore(s => s.login);
  const from     = location.state?.from?.pathname || "/dashboard";

  const [form, setForm]           = useState({ email: "", password: "" });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your email and password.");
    } finally { setLoading(false); }
  };

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

        {/* Left panel */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
          style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
          <motion.div 
            animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="glow-orb w-96 h-96 -top-20 -right-20" 
            style={{ background: "var(--pumpkin-glow)" }} />

          <Link to="/" className="flex items-center gap-3 relative z-10">
            <img src={logo} alt="" className="h-9 w-9 object-contain" />
            <span className="font-display text-[20px]" style={{ fontWeight: 800, color: "var(--text-primary)" }}>
              Fenix<span style={{ color: "var(--pumpkin)" }}>Rise</span>
            </span>
          </Link>

          <div className="relative z-10">
            <h2 className="font-display text-[38px] leading-[1.1] mb-5" style={{ fontWeight: 800, color: "var(--text-primary)" }}>
              Your Dream University<br />
              <span className="gradient-text">Isn't a Dream.</span><br />
              It's a Roadmap.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Join thousands of students using AI-powered preparation to get into the world's best universities.
            </p>
          </div>
          <p className="text-[12px] relative z-10" style={{ color: "var(--text-muted)" }}>© 2025 FenixRise</p>
        </motion.div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-[400px]">
            <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
              <img src={logo} alt="" className="h-8 w-8 object-contain" />
              <span className="font-display text-[18px]" style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                Fenix<span style={{ color: "var(--pumpkin)" }}>Rise</span>
              </span>
            </Link>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-display text-[26px] font-bold mb-1.5" 
              style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              Welcome back
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-[14px] mb-8" 
              style={{ color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--pumpkin)" }}>
                Create one free
              </Link>
            </motion.p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[13px] px-4 py-3 rounded-xl mb-5"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", color: "#ef4444" }}>
                {error}
              </motion.div>
            )}

            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={submit} 
              className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>
                  Email
                </label>
                <input name="email" type="email" value={form.email} onChange={handle} required
                       placeholder="your@email.com" className="form-input" />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>
                  Password
                </label>
                <div className="relative">
                  <input name="password" type={showPass ? "text" : "password"} value={form.password}
                         onChange={handle} required placeholder="••••••••"
                         className="form-input" style={{ paddingRight: "44px" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: "var(--text-muted)" }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className="btn-primary justify-center mt-1 disabled:opacity-60">
                {loading
                  ? <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
                  : <><Flame size={15} /> Sign In <ArrowRight size={15} /></>}
              </motion.button>
            </motion.form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-[12px] text-center mt-7" 
              style={{ color: "var(--text-muted)" }}>
              By signing in you agree to our{" "}
              <button onClick={() => setShowTerms(true)} className="hover:underline" style={{ color: "var(--text-secondary)" }}>
                Terms
              </button>{" "}and{" "}
              <Link to="/privacy" className="hover:underline" style={{ color: "var(--text-secondary)" }}>Privacy Policy</Link>.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
