import { Link } from "react-router-dom";
import { Flame, ArrowRight } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import logo from "../../assets/logo.svg";

const VALUES = [
  {
    icon: "🎯",
    title: "Student First",
    description:
      "Every feature we build starts with one question: does this make the student's path to university clearer and faster?",
  },
  {
    icon: "🤖",
    title: "AI with Purpose",
    description:
      "We use AI not to replace mentors, but to give every student access to the kind of personalised guidance that used to cost thousands.",
  },
  {
    icon: "🌍",
    title: "Global Access",
    description:
      "A student in Tashkent deserves the same preparation quality as a student in New York. We're here to close that gap.",
  },
  {
    icon: "🔥",
    title: "Rise Together",
    description:
      "We succeed only when our students succeed. Our metrics are admissions, scholarships, and life-changing opportunities — not just platform usage.",
  },
];

const TEAM = [
  {
    name: "Javohir",
    role: "Founder & CEO",
    bio: "Passionate about making world-class university education accessible to every student in Central Asia.",
    initials: "JA",
  },
  {
    name: "Coming Soon",
    role: "Head of Education",
    bio: "We're building our team of expert educators, mentors, and engineers. Want to join?",
    initials: "?",
    placeholder: true,
  },
  {
    name: "Coming Soon",
    role: "Lead Engineer",
    bio: "If you're a developer who believes in EdTech for emerging markets, we'd love to hear from you.",
    initials: "?",
    placeholder: true,
  },
];

const STATS = [
  { value: "2025", label: "Founded" },
  { value: "Tashkent", label: "Headquarters" },
  { value: "SAT & IELTS", label: "Core Focus" },
  { value: "Global", label: "Student Reach" },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#212223] flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="glow-orb w-[500px] h-[400px] bg-[#FE7F2D]/8 -top-20 right-0 pointer-events-none" />
        <div className="glow-orb w-[300px] h-[300px] bg-[#FF6B00]/6 bottom-0 -left-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="float-anim inline-block mb-8">
            <img src={logo} alt="FenixRise" className="h-20 w-20 object-contain mx-auto"
                 style={{ filter: "drop-shadow(0 0 40px rgba(254,127,45,0.5))" }} />
          </div>

          <div className="pill mb-6 mx-auto w-fit">
            <Flame size={11} /> Our Story
          </div>

          <h1 className="font-display text-[52px] md:text-[68px] font-extrabold text-[#F5F4F2] leading-[1.04] mb-7" style={{ fontWeight: 800 }}>
            We Exist Because<br />
            <span className="gradient-text">Every Student Deserves</span><br />
            A Clear Path Forward
          </h1>

          <p className="text-[17px] text-[#9B9C9E] leading-relaxed max-w-2xl mx-auto">
            FenixRise was born in Tashkent, Uzbekistan — a city full of ambitious students
            who dream of studying at the world's best universities but often don't know where to start.
            We built the platform we wish we had.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5 bg-[#1e1f20] py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-[26px] font-extrabold num-shine mb-1" style={{ fontWeight: 800 }}>{value}</p>
              <p className="text-[12px] font-semibold text-[#5E5F61] uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="pill mb-5">Our Mission</div>
              <h2 className="font-display text-[38px] font-extrabold text-[#F5F4F2] leading-[1.1] mb-6" style={{ fontWeight: 800 }}>
                Democratise University<br />
                <span className="gradient-text">Admission Preparation</span>
              </h2>
              <p className="text-[15px] text-[#9B9C9E] leading-relaxed mb-5">
                The gap between students who get into top universities and those who don't is rarely talent.
                It's access — access to the right preparation, guidance, and information.
              </p>
              <p className="text-[15px] text-[#9B9C9E] leading-relaxed mb-8">
                FenixRise uses AI to give every student in Uzbekistan and beyond a personalised roadmap,
                world-class test prep, and mentor access — at a fraction of the cost of traditional prep centres.
              </p>
              <Link to="/register" className="btn-primary">
                Join FenixRise <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-5">
                  <span className="text-2xl mb-3 block">{v.icon}</span>
                  <h3 className="font-display text-[14px] font-bold text-[#F5F4F2] mb-2" style={{ fontWeight: 700 }}>
                    {v.title}
                  </h3>
                  <p className="text-[12px] text-[#9B9C9E] leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-20 bg-[#1e1f20]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="pill mb-5">The Story</div>
          <h2 className="font-display text-[36px] font-extrabold text-[#F5F4F2] mb-8 leading-tight" style={{ fontWeight: 800 }}>
            Why We Built This
          </h2>
          <div className="flex flex-col gap-5 text-[15px] text-[#9B9C9E] leading-relaxed">
            <p>
              Every year, thousands of students in Uzbekistan dream of studying at universities like Oxford,
              TU Munich, or NUS Singapore. They have the intelligence. They have the drive. But the path
              to getting there is unclear, expensive, and isolating.
            </p>
            <p>
              Prep centres charge millions of sum for SAT coaching. University consultants are out of reach
              for most families. And online resources — while abundant — are scattered, generic, and not
              built for students navigating the process from Central Asia.
            </p>
            <p>
              FenixRise is our answer. An AI-powered platform that gives every student a clear,
              week-by-week roadmap — from where they are today to the acceptance letter they deserve.
              Like a phoenix, our students rise from wherever they start.
            </p>
            <p className="text-[#F5F4F2] font-semibold">
              We're just getting started. And we'd love for you to rise with us. 🔥
            </p>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="pill mb-5 mx-auto w-fit">The Team</div>
            <h2 className="font-display text-[38px] font-extrabold text-[#F5F4F2]" style={{ fontWeight: 800 }}>
              Built by people who <span className="gradient-text">care deeply</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TEAM.map((member) => (
              <div key={member.name}
                   className={`card p-7 text-center ${member.placeholder ? "opacity-60" : ""}`}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[20px] font-bold mx-auto mb-5"
                     style={{
                       background: member.placeholder
                         ? "rgba(255,255,255,0.05)"
                         : "linear-gradient(135deg,#FE7F2D,#FFAD60)",
                       color: member.placeholder ? "#5E5F61" : "#1a1011",
                     }}>
                  {member.initials}
                </div>
                <h3 className="font-display text-[17px] font-bold text-[#F5F4F2] mb-1" style={{ fontWeight: 700 }}>
                  {member.name}
                </h3>
                <p className="text-[12px] font-semibold text-[#FE7F2D] mb-3">{member.role}</p>
                <p className="text-[13px] text-[#9B9C9E] leading-relaxed">{member.bio}</p>
                {member.placeholder && (
                  <a href="mailto:careers@fenixrise.uz"
                     className="inline-block mt-4 text-[12px] font-semibold text-[#FE7F2D] hover:underline">
                    Apply to join →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#1e1f20]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-[38px] font-extrabold text-[#F5F4F2] mb-5" style={{ fontWeight: 800 }}>
            Ready to <span className="gradient-text">Rise?</span>
          </h2>
          <p className="text-[15px] text-[#9B9C9E] mb-8">
            Join our founding cohort and be part of the first generation of FenixRise students.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary !py-4 !px-8 !text-[15px]">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <a href="mailto:hello@fenixrise.uz" className="btn-ghost !py-4 !px-8 !text-[15px]">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
