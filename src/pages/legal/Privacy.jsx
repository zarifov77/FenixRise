import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly: your name, email address, password, and optional profile details such as your city, phone number, target universities, and current test scores. We also collect usage data automatically — such as which tests you take, your scores, time spent on lessons, and device information — to personalise and improve your experience.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use your data to create and manage your account, generate your personalised AI roadmap, track your progress across tests and courses, send you relevant notifications about deadlines and new content, improve our AI models and platform features, and communicate with you about your account and subscription.",
  },
  {
    title: "3. Data Sharing",
    content:
      "We do not sell your personal data. We may share data with trusted service providers who help us operate the platform (such as cloud hosting and email services) under strict confidentiality agreements. We may disclose data if required by law or to protect the rights and safety of our users.",
  },
  {
    title: "4. Data Storage and Security",
    content:
      "Your data is stored on secure servers using industry-standard encryption. Passwords are hashed using bcrypt and are never stored in plain text. We use HTTPS for all data transmission. While we take security seriously, no system is 100% secure — please use a strong, unique password for your account.",
  },
  {
    title: "5. Cookies",
    content:
      "FenixRise uses essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, but this may affect the functionality of the platform.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access the personal data we hold about you, request corrections to inaccurate data, request deletion of your account and associated data, and export your data in a portable format. To exercise any of these rights, contact us at hello@fenixrise.uz.",
  },
  {
    title: "7. Data Retention",
    content:
      "We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law. Anonymised, aggregated data (such as overall test score averages) may be retained for analytical purposes.",
  },
  {
    title: "8. Children's Privacy",
    content:
      "FenixRise is intended for users aged 13 and above. Users under 18 must have parental consent to use the platform. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, please contact us immediately.",
  },
  {
    title: "9. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify registered users of material changes by email or an in-app notification. Continued use of FenixRise after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions about this Privacy Policy or how we handle your data, please contact our team at hello@fenixrise.uz. We aim to respond within 2 business days.",
  },
];

export default function Privacy() {
  return (
    <div className="bg-[#212223] min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">

        <div className="text-center mb-14">
          <div className="w-14 h-14 rounded-2xl bg-[#FE7F2D]/10 flex items-center justify-center mx-auto mb-5">
            <Lock size={26} className="text-[#FE7F2D]" />
          </div>
          <div className="pill mb-4 mx-auto w-fit">Legal</div>
          <h1 className="font-display text-[40px] md:text-[52px] font-extrabold text-[#F5F4F2] mb-4" style={{ fontWeight: 800 }}>
            Privacy Policy
          </h1>
          <p className="text-[14px] text-[#9B9C9E]">Last updated: April 2025</p>
        </div>

        <div className="bg-[#FE7F2D]/8 border border-[#FE7F2D]/20 rounded-2xl p-5 mb-10">
          <p className="text-[14px] text-[#F5F4F2] leading-relaxed">
            Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we protect it. If you have any concerns, reach out at{" "}
            <a href="mailto:hello@fenixrise.uz" className="text-[#FE7F2D] hover:underline">hello@fenixrise.uz</a>.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {PRIVACY_SECTIONS.map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="font-display text-[17px] font-bold text-[#F5F4F2] mb-3" style={{ fontWeight: 700 }}>
                {section.title}
              </h2>
              <p className="text-[14px] text-[#9B9C9E] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link to="/terms"    className="btn-ghost !py-2.5 !px-5 !text-[13px]">Terms of Service</Link>
          <Link to="/"         className="btn-ghost !py-2.5 !px-5 !text-[13px]">Back to Home</Link>
          <Link to="/register" className="btn-primary !py-2.5 !px-5 !text-[13px]">Get Started Free</Link>
        </div>
      </div>
    </div>
  );
}
