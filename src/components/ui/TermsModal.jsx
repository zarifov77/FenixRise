import { useEffect } from "react";
import { X, Shield } from "lucide-react";

export default function TermsModal({ onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#28292A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FE7F2D]/10 flex items-center justify-center">
              <Shield size={17} className="text-[#FE7F2D]" />
            </div>
            <div>
              <h2 className="font-display text-[17px] font-bold text-[#F5F4F2]" style={{ fontWeight: 700 }}>
                Terms of Service
              </h2>
              <p className="text-[11px] text-[#9B9C9E]">Last updated: April 2025</p>
            </div>
          </div>
          <button onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#9B9C9E] hover:text-[#F5F4F2] transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5 text-[13px] text-[#9B9C9E] leading-relaxed">

          <Section title="1. Acceptance of Terms">
            By creating an account and using FenixRise ("Platform", "we", "our"), you agree to these Terms of Service.
            If you do not agree, please do not use our services. These terms apply to all users including students, mentors, and visitors.
          </Section>

          <Section title="2. Description of Service">
            FenixRise is an educational technology platform providing SAT and IELTS preparation courses, AI-powered university
            admission roadmaps, practice tests, and mentorship services. We are based in Tashkent, Uzbekistan and serve
            students globally.
          </Section>

          <Section title="3. User Accounts">
            You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality
            of your login credentials and for all activity under your account. You agree to provide accurate, current, and
            complete information during registration. FenixRise reserves the right to suspend accounts that violate these terms.
          </Section>

          <Section title="4. Subscription Plans">
            FenixRise offers Free, Rise, and Phoenix subscription tiers. Paid plans are billed monthly in Uzbekistani Som (UZS).
            You may cancel at any time. Refunds are available within 7 days of purchase if you have not accessed more than
            20% of the paid content. No refunds are issued after this period.
          </Section>

          <Section title="5. Intellectual Property">
            All content on FenixRise — including video lessons, practice questions, articles, and roadmap templates —
            is owned by FenixRise or its licensors. You may not copy, distribute, sell, or create derivative works from
            our content without written permission. Your personal data and submitted essays remain your property.
          </Section>

          <Section title="6. Acceptable Use">
            You agree not to: share your account credentials with others, attempt to reverse-engineer our platform,
            upload harmful or illegal content, impersonate other users or mentors, or use automated tools to scrape
            our question bank or course content.
          </Section>

          <Section title="7. Privacy">
            We collect and process personal data in accordance with our Privacy Policy. We do not sell your personal
            data to third parties. Your test scores, roadmap data, and progress are used solely to personalise your
            experience on the platform.
          </Section>

          <Section title="8. Disclaimer of Warranties">
            FenixRise is provided "as is." We do not guarantee specific score improvements or university admissions.
            Our AI roadmap and recommendations are tools to support your preparation — final results depend on
            your effort, test performance, and university decisions.
          </Section>

          <Section title="9. Limitation of Liability">
            To the maximum extent permitted by law, FenixRise shall not be liable for indirect, incidental, or
            consequential damages arising from your use of the platform. Our total liability shall not exceed
            the amount you paid for your subscription in the preceding 3 months.
          </Section>

          <Section title="10. Changes to Terms">
            We may update these terms at any time. We will notify users of material changes via email or an
            in-app notice. Continued use of the platform after changes constitutes acceptance of the new terms.
          </Section>

          <Section title="11. Contact">
            For questions about these terms, contact us at:{" "}
            <a href="mailto:legal@fenixrise.uz" className="text-[#FE7F2D] hover:underline">legal@fenixrise.uz</a>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button onClick={onClose} className="btn-primary w-full justify-center !py-3">
            I Understand — Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-[13px] font-bold text-[#F5F4F2] mb-1.5">{title}</h3>
      <p>{children}</p>
    </div>
  );
}
