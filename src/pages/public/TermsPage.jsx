import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using FenixRise ("Platform", "Service", "we", "our", "us"), you confirm that you have read,
understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to
these terms, you may not use our services. These terms apply to all visitors, users, and others who access
or use the Service, including students, mentors, and administrators.`,
  },
  {
    id: "service",
    title: "2. Description of Service",
    content: `FenixRise is an educational technology platform headquartered in Tashkent, Uzbekistan, providing:
SAT and IELTS preparation courses with adaptive practice tests, AI-powered personalised university
admission roadmaps, structured video-based learning with expert instructors, mentor matching and 1-on-1
guidance sessions, university matching based on academic profile, and scholarship discovery tools.
We reserve the right to modify, suspend, or discontinue any part of the Service at any time.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `To access most features of FenixRise, you must create an account. You must be at least 13 years old to
register. If you are under 18, you confirm that a parent or guardian has reviewed and agreed to these terms
on your behalf. You are solely responsible for maintaining the confidentiality of your account credentials
and for all activity that occurs under your account. You agree to immediately notify us of any unauthorised
use of your account at security@fenixrise.uz. FenixRise will not be liable for any loss resulting from
someone else using your account.`,
  },
  {
    id: "subscriptions",
    title: "4. Subscriptions and Payments",
    content: `FenixRise offers Free, Rise, and Phoenix subscription plans. Paid plans are billed monthly in Uzbekistani Som (UZS).
All payments are processed securely. Prices are listed inclusive of any applicable taxes.

Cancellation: You may cancel your subscription at any time from your account settings. Your access continues
until the end of the current billing period.

Refunds: We offer a 7-day money-back guarantee on paid plans, provided you have not accessed more than 20%
of the premium content. Refund requests must be submitted to billing@fenixrise.uz. No refunds are issued
after 7 days or if the content access threshold has been exceeded.

We reserve the right to change our pricing with 30 days' notice to existing subscribers.`,
  },
  {
    id: "ip",
    title: "5. Intellectual Property",
    content: `All content on FenixRise — including but not limited to video lessons, written articles, practice questions,
answer explanations, roadmap templates, graphics, logos, and software — is owned by FenixRise or its
content partners and is protected by applicable intellectual property laws.

You are granted a limited, non-exclusive, non-transferable licence to access and use the content for your
own personal, non-commercial educational purposes. You may not: copy, reproduce, or distribute any content;
create derivative works; reverse engineer any part of the platform; use any automated tools to download or
scrape content; or share your account access with others.

Content you submit (such as essay drafts or practice responses) remains your intellectual property. By
submitting it, you grant FenixRise a limited licence to use it to provide and improve the Service.`,
  },
  {
    id: "conduct",
    title: "6. Acceptable Use",
    content: `You agree to use FenixRise only for lawful purposes and in accordance with these Terms. You must not:
share your login credentials or allow others to access the platform through your account; attempt to gain
unauthorised access to any part of the Service or its related systems; upload, post, or transmit any content
that is harmful, offensive, or violates any third-party rights; impersonate any person or entity; interfere
with or disrupt the integrity or performance of the Service; use the platform to engage in any form of
academic dishonesty or fraud; or access the Service for competitive intelligence purposes.

Violation of these rules may result in immediate account suspension without refund.`,
  },
  {
    id: "privacy",
    title: "7. Privacy and Data",
    content: `Your privacy is important to us. Our Privacy Policy (available at fenixrise.uz/privacy) explains how we
collect, use, and protect your personal data. By using FenixRise, you consent to data collection and use
as described in that policy.

We do not sell your personal data to third parties. Your test scores, roadmap progress, and learning data
are used exclusively to personalise your experience and improve our platform.`,
  },
  {
    id: "disclaimer",
    title: "8. Disclaimer of Warranties",
    content: `FenixRise is provided on an "as is" and "as available" basis without warranties of any kind, either express
or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses.

We do not guarantee specific outcomes — including score improvements, university admissions, or scholarship
awards. Our AI-powered roadmap and course content are educational tools designed to support your preparation;
final results depend on your own effort, test performance, and the decisions of universities and scholarship
bodies.`,
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, FenixRise and its officers, directors, employees, and
agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages —
including lost profits, lost data, or loss of goodwill — arising from your use of, or inability to use,
the Service.

In no event shall FenixRise's total liability to you exceed the total amount you paid to us in the three
months immediately preceding the event giving rise to the claim.`,
  },
  {
    id: "termination",
    title: "10. Termination",
    content: `We may suspend or terminate your account at any time, with or without notice, for conduct that we believe
violates these Terms of Service or is otherwise harmful to other users, us, or third parties.

You may terminate your account at any time by contacting support@fenixrise.uz. Upon termination, your right
to use the Service ceases immediately. We may retain your data as required by law or for legitimate business
purposes.`,
  },
  {
    id: "changes",
    title: "11. Changes to These Terms",
    content: `We may update these Terms of Service from time to time. We will notify you of material changes by sending
an email to your registered address or displaying a prominent notice on the platform at least 14 days before
changes take effect. Your continued use of the Service after the effective date constitutes acceptance of
the revised terms.`,
  },
  {
    id: "governing",
    title: "12. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of Uzbekistan.
Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive
jurisdiction of the courts of Tashkent, Uzbekistan.`,
  },
  {
    id: "contact",
    title: "13. Contact Us",
    content: `If you have any questions about these Terms of Service, please contact us:

Email: legal@fenixrise.uz
Address: Tashkent, Uzbekistan
General enquiries: hello@fenixrise.uz`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#212223] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back link */}
          <Link to="/"
                className="inline-flex items-center gap-2 text-[13px] text-[#9B9C9E] hover:text-[#FE7F2D] mb-10 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Header */}
          <div className="flex items-start gap-5 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-[#FE7F2D]/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Shield size={24} className="text-[#FE7F2D]" />
            </div>
            <div>
              <h1 className="font-display text-[42px] font-extrabold text-[#F5F4F2] leading-tight mb-2" style={{ fontWeight: 800 }}>
                Terms of Service
              </h1>
              <p className="text-[14px] text-[#9B9C9E]">
                Last updated: <strong className="text-[#F5F4F2]">April 2025</strong> · Effective immediately for new users
              </p>
            </div>
          </div>

          {/* Intro box */}
          <div className="bg-[#FE7F2D]/8 border border-[#FE7F2D]/20 rounded-2xl p-6 mb-10">
            <p className="text-[14px] text-[#F5F4F2] leading-relaxed">
              <strong>Plain English summary:</strong> FenixRise is an EdTech platform helping students prepare for
              SAT and IELTS exams and get into top universities. By signing up, you agree to use the platform
              fairly, keep your account secure, and understand that we can't guarantee specific exam scores or
              admissions outcomes — but we'll do everything we can to give you the best possible preparation.
            </p>
          </div>

          {/* Table of contents */}
          <div className="card p-6 mb-10">
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#5E5F61] mb-4">Contents</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}
                   className="text-[13px] text-[#9B9C9E] hover:text-[#FE7F2D] transition-colors py-1">
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-[20px] font-bold text-[#F5F4F2] mb-4" style={{ fontWeight: 700 }}>
                  {s.title}
                </h2>
                <div className="text-[14px] text-[#9B9C9E] leading-relaxed whitespace-pre-line border-l-2 border-[#FE7F2D]/20 pl-5">
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-14 pt-8 border-t border-white/5 text-center">
            <p className="text-[13px] text-[#5E5F61]">
              Questions? Email us at{" "}
              <a href="mailto:legal@fenixrise.uz" className="text-[#FE7F2D] hover:underline">
                legal@fenixrise.uz
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
