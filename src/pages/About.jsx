import { Link } from "react-router-dom";
import { Target, Flame, Users, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "../assets/logo.png";

const VALUES = [
  {
    icon: "🎯",
    title: "Radical Clarity",
    description:
      "No vague advice. Every student gets a concrete, week-by-week roadmap built around their exact scores, goals, and timeline.",
  },
  {
    icon: "🔥",
    title: "Rise Mentality",
    description:
      "Like the phoenix, our students rise from uncertainty to confidence. We believe every student from Uzbekistan deserves a shot at the world's best universities.",
  },
  {
    icon: "🤖",
    title: "AI-First, Human-Supported",
    description:
      "Our AI does the heavy lifting — adaptive drills, score predictions, deadline tracking. Our mentors do the rest — motivation, essays, and real talk.",
  },
  {
    icon: "🌍",
    title: "Global Access",
    description:
      "Geography shouldn't limit ambition. We're making world-class university prep accessible to every student in Central Asia.",
  },
];

const TEAM = [
  {
    name: "Javohir",
    role: "Founder & CEO",
    initials: "J",
    bio: "Building FenixRise to give every Uzbek student the roadmap to their dream university.",
  },
];

const STATS = [
  { value: "2,400+", label: "Students Enrolled" },
  { value: "94%",    label: "Admission Rate" },
  { value: "180+",   label: "Partner Universities" },
  { value: "12",     label: "Countries Reached" },
];

export default function About() {
  return (
    <div className="bg-[#212223] min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#FE7F2D]/6 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <img src={logo} alt="FenixRise" className="h-20 w-20 object-contain mx-auto mb-8"
               style={{ filter: "drop-shadow(0 0 40px rgba(254,127,45,0.5))" }} />

          <div className="pill mb-6 mx-auto w-fit">Our Story</div>

          <h1 className="font-display text-[52px] md:text-[68px] font-extrabold text-[#F5F4F2] leading-[1.04] mb-7" style={{ fontWeight: 800 }}>
            Built for Students Who<br />
            <span className="gradient-text">Refuse to Settle.</span>
          </h1>

          <p className="text-[18px] text-[#9B9C9E] leading-relaxed max-w-2xl mx-auto mb-10">
            FenixRise was born in Tashkent with one mission: give every ambitious student in Uzbekistan and Central Asia the exact roadmap, tools, and mentorship they need to get into the world's best universities — not someday, but on a clear, trackable timeline.
          </p>

          <Link to="/register" className="btn-primary !py-4 !px-8 !text-[15px]">
            Join FenixRise <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5 bg-[#1e1f20] py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-[44px] font-extrabold num-shine leading-none mb-2" style={{ fontWeight: 800 }}>{value}</p>
              <p className="text-[13px] font-semibold text-[#5E5F61] uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="pill mb-5">Our Mission</div>
            <h2 className="font-display text-[40px] md:text-[48px] font-extrabold text-[#F5F4F2] leading-[1.1] mb-6" style={{ fontWeight: 800 }}>
              The roadmap every student deserves — but almost no one has.
            </h2>
            <p className="text-[16px] text-[#9B9C9E] leading-relaxed mb-6">
              Most students in Uzbekistan trying to apply to universities abroad face the same problems: no structured plan, no idea which tests to take or when, no one who's been through the process to guide them.
            </p>
            <p className="text-[16px] text-[#9B9C9E] leading-relaxed mb-8">
              FenixRise changes that. We combine AI-powered personalisation with real mentorship to give every student a clear path from where they are today to where they want to be.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Personalised AI roadmap built around your scores and deadlines",
                "Adaptive SAT & IELTS prep that targets your weak spots",
                "Mentors who've been admitted to top universities",
                "University matching based on your real profile",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-[#FE7F2D] flex-shrink-0 mt-0.5" />
                  <p className="text-[14px] text-[#9B9C9E]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-5">
                <span className="text-2xl mb-3 block">{v.icon}</span>
                <h3 className="font-display text-[15px] font-bold text-[#F5F4F2] mb-2" style={{ fontWeight: 700 }}>{v.title}</h3>
                <p className="text-[12px] text-[#9B9C9E] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-[#1e1f20] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="pill mb-5">The Team</div>
            <h2 className="font-display text-[36px] md:text-[44px] font-extrabold text-[#F5F4F2]" style={{ fontWeight: 800 }}>
              Built by people who care about<br />
              <span className="gradient-text">your future.</span>
            </h2>
          </div>

          <div className="flex justify-center">
            {TEAM.map((member) => (
              <div key={member.name} className="card p-7 text-center max-w-xs w-full">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[22px] font-extrabold mx-auto mb-4"
                     style={{ background: "linear-gradient(135deg,#FE7F2D,#FFAD60)", color: "#1a1011", fontWeight: 800 }}>
                  {member.initials}
                </div>
                <h3 className="font-display text-[18px] font-bold text-[#F5F4F2] mb-1" style={{ fontWeight: 700 }}>{member.name}</h3>
                <p className="text-[12px] font-semibold text-[#FE7F2D] uppercase tracking-wider mb-3">{member.role}</p>
                <p className="text-[13px] text-[#9B9C9E] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <Flame size={36} className="text-[#FE7F2D] mx-auto mb-6" />
          <h2 className="font-display text-[36px] md:text-[44px] font-extrabold text-[#F5F4F2] mb-5" style={{ fontWeight: 800 }}>
            Ready to rise?
          </h2>
          <p className="text-[16px] text-[#9B9C9E] mb-8">
            Join thousands of students building their path to the world's top universities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary !py-4 !px-8">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-ghost !py-4 !px-8">Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
