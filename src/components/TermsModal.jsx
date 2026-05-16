import { useEffect } from "react";
import { X, Shield } from "lucide-react";
import { TERMS_SECTIONS } from "../pages/legal/Terms";

export default function TermsModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-[#28292A] border border-white/10 rounded-2xl w-full max-w-xl max-h-[82vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/7 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FE7F2D]/10 flex items-center justify-center">
              <Shield size={15} className="text-[#FE7F2D]" />
            </div>
            <div>
              <h2 className="font-display text-[16px] font-bold text-[#F5F4F2]" style={{ fontWeight: 700 }}>
                Terms of Service
              </h2>
              <p className="text-[11px] text-[#5E5F61]">Last updated April 2025</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#5E5F61] hover:text-[#F5F4F2] transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          <div className="bg-[#FE7F2D]/8 border border-[#FE7F2D]/20 rounded-xl p-4 mb-1">
            <p className="text-[13px] text-[#F5F4F2] leading-relaxed">
              By creating an account, you agree to these terms. Questions?{" "}
              <a href="mailto:hello@fenixrise.uz" className="text-[#FE7F2D] hover:underline">
                hello@fenixrise.uz
              </a>
            </p>
          </div>

          {TERMS_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-[13px] font-bold text-[#F5F4F2] mb-1.5">{section.title}</h3>
              <p className="text-[12px] text-[#9B9C9E] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/7 flex-shrink-0 flex items-center justify-between gap-3">
          <p className="text-[11px] text-[#5E5F61]">Scroll up to read all sections.</p>
          <button
            onClick={onClose}
            className="btn-primary !py-2.5 !px-6 !text-[13px]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
