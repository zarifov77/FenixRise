import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

// ── Shared Terms Content ──────────────────────────────────────────
// Used by both the full page AND the modal in Login/Register
export const TERMS_SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By creating an account or using FenixRise (fenixrise.uz), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We may update these terms from time to time and will notify registered users of significant changes.",
  },
  {
    title: "2. Use of the Platform",
    content:
      "FenixRise provides AI-powered test preparation, university admission guidance, and educational courses. You agree to use the platform only for lawful, personal, non-commercial educational purposes. You must not share your account credentials, attempt to reverse-engineer the platform, or use automated tools to access our services.",
  },
  {
    title: "3. Account Registration",
    content:
      "You must provide accurate information when creating your account. You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account. You must be at least 13 years old to use FenixRise. If you are under 18, you confirm that you have parental or guardian consent.",
  },
  {
    title: "4. Subscriptions and Payments",
    content:
      "FenixRise offers a free plan and paid subscriptions (Rise and Phoenix). Paid plans are billed monthly in Uzbekistani Som (UZS). Payments are non-refundable except in the case of a verified billing error. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "All content on FenixRise — including test questions, course materials, videos, AI-generated roadmaps, and branding — is owned by FenixRise or its licensors. You may not copy, distribute, reproduce, or create derivative works from our content without explicit written permission. Your personal data and answers submitted during tests remain your property.",
  },
  {
    title: "6. Privacy and Data",
    content:
      "We collect information necessary to provide and improve our services, including your name, email, test scores, and usage data. We do not sell your personal data to third parties. Please refer to our Privacy Policy for full details on how we collect, use, and protect your data.",
  },
  {
    title: "7. Disclaimers",
    content:
      "FenixRise provides educational resources and guidance to improve your chances of university admission, but we cannot guarantee admission to any specific university. Our AI roadmaps, score predictions, and university matching are tools to support your journey — final admission decisions rest solely with universities.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, FenixRise shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability for any claim related to the service is limited to the amount you paid us in the three months preceding the claim.",
  },
  {
    title: "9. Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm other users. You may delete your account at any time by contacting us at hello@fenixrise.uz.",
  },
  {
    title: "10. Governing Law",
    content:
      "These terms are governed by the laws of the Republic of Uzbekistan. Any disputes shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to the competent courts of Tashkent, Uzbekistan.",
  },
  {
    title: "11. Contact",
    content:
      "If you have any questions about these Terms, please contact us at hello@fenixrise.uz or write to us at FenixRise, Tashkent, Uzbekistan.",
  },
];

// ── Full Terms Page ───────────────────────────────────────────────
export default function Terms() {
  return (
    <div className="bg-[#212223] min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-14 h-14 rounded-2xl bg-[#FE7F2D]/10 flex items-center justify-center mx-auto mb-5">
            <Shield size={26} className="text-[#FE7F2D]" />
          </div>
          <div className="pill mb-4 mx-auto w-fit">Legal</div>
          <h1 className="font-display text-[40px] md:text-[52px] font-extrabold text-[#F5F4F2] mb-4" style={{ fontWeight: 800 }}>
            Terms of Service
          </h1>
          <p className="text-[14px] text-[#9B9C9E]">
            Last updated: April 2025 · Effective immediately upon registration.
          </p>
        </div>

        {/* Intro box */}
        <div className="bg-[#FE7F2D]/8 border border-[#FE7F2D]/20 rounded-2xl p-5 mb-10">
          <p className="text-[14px] text-[#F5F4F2] leading-relaxed">
            Please read these Terms of Service carefully before using FenixRise. By registering an account or accessing any part of our platform, you agree to be legally bound by these terms. If you have questions, email us at{" "}
            <a href="mailto:hello@fenixrise.uz" className="text-[#FE7F2D] hover:underline">hello@fenixrise.uz</a>.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {TERMS_SECTIONS.map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="font-display text-[17px] font-bold text-[#F5F4F2] mb-3" style={{ fontWeight: 700 }}>
                {section.title}
              </h2>
              <p className="text-[14px] text-[#9B9C9E] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/privacy" className="btn-ghost !py-2.5 !px-5 !text-[13px]">Privacy Policy</Link>
          <Link to="/"        className="btn-ghost !py-2.5 !px-5 !text-[13px]">Back to Home</Link>
          <Link to="/register" className="btn-primary !py-2.5 !px-5 !text-[13px]">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
