import { UNIVERSITIES } from "../../data/content";

export default function Universities() {
  const items = [...UNIVERSITIES, ...UNIVERSITIES, ...UNIVERSITIES, ...UNIVERSITIES];
  return (
    <section id="universities" className="py-20 overflow-hidden" style={{ background:"var(--bg-secondary)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <div className="pill mb-5 mx-auto" style={{ display:"inline-flex" }}>Partner Universities</div>
        <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"var(--text-primary)" }}>
          Our Students Get Into <span className="gradient-text">The World's Best</span>
        </h2>
      </div>
      <div className="relative">
        <div className="absolute left-0 inset-y-0 w-32 z-10 pointer-events-none"
             style={{ background:"linear-gradient(to right, var(--bg-secondary), transparent)" }} />
        <div className="absolute right-0 inset-y-0 w-32 z-10 pointer-events-none"
             style={{ background:"linear-gradient(to left, var(--bg-secondary), transparent)" }} />
        <div className="overflow-hidden">
          <div className="marquee-track gap-3">
            {items.map((u, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full mr-3 text-[13px] font-semibold cursor-default transition-all duration-300"
                   style={{ background:"var(--bg-card)", border:"1px solid var(--border)", color:"var(--text-secondary)" }}
                   onMouseEnter={e => { e.currentTarget.style.borderColor="var(--pumpkin)"; e.currentTarget.style.color="var(--pumpkin)"; }}
                   onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-secondary)"; }}>
                🎓 {u}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
