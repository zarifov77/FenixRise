import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, ExternalLink, X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export const UNIVERSITIES = [
  { id:1,  rank:1,  name:"Massachusetts Institute of Technology", short:"MIT",       city:"Cambridge",  country:"USA",         flag:"🇺🇸", fields:["Engineering","Computer Science","Physics"],       satMin:1510, ielts:"7+",   acceptance:"4%",    tuition:"$58K" },
  { id:2,  rank:2,  name:"Stanford University",                   short:"Stanford",   city:"Stanford",   country:"USA",         flag:"🇺🇸", fields:["Computer Science","Business","Engineering"],      satMin:1500, ielts:"7+",   acceptance:"3.68%", tuition:"$56K" },
  { id:3,  rank:3,  name:"Harvard University",                    short:"Harvard",    city:"Cambridge",  country:"USA",         flag:"🇺🇸", fields:["Law","Medicine","Business"],                      satMin:1490, ielts:"7+",   acceptance:"3.19%", tuition:"$54K" },
  { id:4,  rank:4,  name:"California Institute of Technology",    short:"Caltech",    city:"Pasadena",   country:"USA",         flag:"🇺🇸", fields:["Physics","Engineering","Chemistry"],              satMin:1530, ielts:"7+",   acceptance:"3.9%",  tuition:"$57K" },
  { id:5,  rank:5,  name:"University of Oxford",                  short:"Oxford",     city:"Oxford",     country:"UK",          flag:"🇬🇧", fields:["Humanities","Medicine","Law"],                    satMin:null, ielts:"7.5+", acceptance:"17%",   tuition:"£28K" },
  { id:6,  rank:6,  name:"ETH Zurich",                            short:"ETH",        city:"Zurich",     country:"Switzerland", flag:"🇨🇭", fields:["Engineering","Science","Architecture"],           satMin:null, ielts:"7+",   acceptance:"27%",   tuition:"CHF 730" },
  { id:7,  rank:7,  name:"University of Cambridge",               short:"Cambridge",  city:"Cambridge",  country:"UK",          flag:"🇬🇧", fields:["Science","Law","Economics"],                     satMin:null, ielts:"7.5+", acceptance:"21%",   tuition:"£22K" },
  { id:8,  rank:8,  name:"Imperial College London",               short:"Imperial",   city:"London",     country:"UK",          flag:"🇬🇧", fields:["Engineering","Medicine","Science"],               satMin:null, ielts:"6.5+", acceptance:"14%",   tuition:"£32K" },
  { id:9,  rank:9,  name:"University of Chicago",                 short:"UChicago",   city:"Chicago",    country:"USA",         flag:"🇺🇸", fields:["Economics","Law","Social Sciences"],              satMin:1480, ielts:"7+",   acceptance:"6.2%",  tuition:"$61K" },
  { id:10, rank:10, name:"National University of Singapore",      short:"NUS",        city:"Singapore",  country:"Singapore",   flag:"🇸🇬", fields:["Business","Engineering","Law"],                  satMin:null, ielts:"6.5+", acceptance:"5%",    tuition:"S$17K" },
  { id:11, rank:11, name:"TU Munich",                             short:"TUM",        city:"Munich",     country:"Germany",     flag:"🇩🇪", fields:["Engineering","Science","Business"],               satMin:null, ielts:"6.5+", acceptance:"8%",    tuition:"€0"   },
  { id:12, rank:12, name:"University of Edinburgh",               short:"Edinburgh",  city:"Edinburgh",  country:"UK",          flag:"🇬🇧", fields:["Medicine","Humanities","Engineering"],            satMin:null, ielts:"6.5+", acceptance:"12%",   tuition:"£26K" },
  { id:13, rank:13, name:"University of Toronto",                 short:"UofT",       city:"Toronto",    country:"Canada",      flag:"🇨🇦", fields:["Medicine","Engineering","Arts"],                  satMin:null, ielts:"6.5+", acceptance:"43%",   tuition:"C$58K" },
  { id:14, rank:14, name:"Peking University",                     short:"PKU",        city:"Beijing",    country:"China",       flag:"🇨🇳", fields:["Science","Humanities","Law"],                    satMin:null, ielts:"6.5+", acceptance:"2%",    tuition:"¥5K"  },
  { id:15, rank:15, name:"Tsinghua University",                   short:"THU",        city:"Beijing",    country:"China",       flag:"🇨🇳", fields:["Engineering","Science","Economics"],             satMin:null, ielts:"6.5+", acceptance:"2%",    tuition:"¥5K"  },
  { id:16, rank:16, name:"Seoul National University",             short:"SNU",        city:"Seoul",      country:"South Korea", flag:"🇰🇷", fields:["Engineering","Medicine","Law"],                  satMin:null, ielts:"6.5+", acceptance:"20%",   tuition:"₩5M"  },
  { id:17, rank:17, name:"University of Melbourne",               short:"UniMelb",    city:"Melbourne",  country:"Australia",   flag:"🇦🇺", fields:["Medicine","Law","Engineering"],                  satMin:null, ielts:"6.5+", acceptance:"70%",   tuition:"A$45K" },
  { id:18, rank:18, name:"Warwick University",                    short:"Warwick",    city:"Coventry",   country:"UK",          flag:"🇬🇧", fields:["Business","Economics","Engineering"],            satMin:null, ielts:"6.5+", acceptance:"13%",   tuition:"£22K" },
  { id:19, rank:19, name:"University of British Columbia",        short:"UBC",        city:"Vancouver",  country:"Canada",      flag:"🇨🇦", fields:["Science","Business","Arts"],                     satMin:null, ielts:"6.5+", acceptance:"52%",   tuition:"C$42K" },
  { id:20, rank:20, name:"Politecnico di Milano",                 short:"PoliMi",     city:"Milan",      country:"Italy",       flag:"🇮🇹", fields:["Engineering","Architecture","Design"],           satMin:null, ielts:"6.0+", acceptance:"30%",   tuition:"€4K"  },
  { id:21, rank:21, name:"King's College London",                 short:"KCL",        city:"London",     country:"UK",          flag:"🇬🇧", fields:["Law","Medicine","Humanities"],                   satMin:null, ielts:"7.0+", acceptance:"15%",   tuition:"£28K" },
  { id:22, rank:22, name:"Princeton University",                  short:"Princeton",  city:"Princeton",  country:"USA",         flag:"🇺🇸", fields:["Engineering","Economics","Physics"],             satMin:1510, ielts:"7+",   acceptance:"3.98%", tuition:"$57K" },
  { id:23, rank:23, name:"Yale University",                       short:"Yale",       city:"New Haven",  country:"USA",         flag:"🇺🇸", fields:["Law","Medicine","Arts"],                         satMin:1500, ielts:"7+",   acceptance:"4.62%", tuition:"$59K" },
  { id:24, rank:24, name:"Columbia University",                   short:"Columbia",   city:"New York",   country:"USA",         flag:"🇺🇸", fields:["Business","Law","Engineering"],                  satMin:1490, ielts:"7+",   acceptance:"3.73%", tuition:"$65K" },
];

const COUNTRIES = ["All Countries","USA","UK","Germany","Singapore","Switzerland","Canada","China","South Korea","Australia","Italy"];
const FIELDS    = ["All Fields","Engineering","Computer Science","Medicine","Law","Business","Economics","Science","Physics","Humanities","Architecture"];
const SORT_BY   = ["Rating","Acceptance Rate","Name A-Z"];
const PAGE_SIZE = 9;

const FAV_KEY = "fenixrise_fav_unis";
const loadFavs = () => { try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; } };

export default function Universities() {
  const [searchParams] = useSearchParams();
  const [query,    setQuery]    = useState("");
  const [country,  setCountry]  = useState("All Countries");
  const [field,    setField]    = useState("All Fields");
  const [sortBy,   setSortBy]   = useState("Rating");
  const [page,     setPage]     = useState(1);
  const [favs,     setFavs]     = useState(loadFavs);
  const [showFavs, setShowFavs] = useState(searchParams.get("favs") === "1");
  const [toast,    setToast]    = useState("");

  useEffect(() => { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); }, [favs]);

  const toggleFav = (id) => {
    const isFav = favs.includes(id);
    setFavs(prev => isFav ? prev.filter(f => f !== id) : [...prev, id]);
    const uni = UNIVERSITIES.find(u => u.id === id);
    setToast(isFav ? `Removed ${uni.short} from favourites` : `Added ${uni.short} to favourites ♡`);
    setTimeout(() => setToast(""), 2500);
  };

  const source = showFavs ? UNIVERSITIES.filter(u => favs.includes(u.id)) : UNIVERSITIES;

  const filtered = source
    .filter(u => {
      const q = query.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.short.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q)) return false;
      if (country !== "All Countries" && u.country !== country) return false;
      if (field   !== "All Fields"   && !u.fields.includes(field)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Name A-Z")        return a.name.localeCompare(b.name);
      if (sortBy === "Acceptance Rate") return parseFloat(a.acceptance) - parseFloat(b.acceptance);
      return a.rank - b.rank;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [query, country, field, sortBy, showFavs]);

  return (
    <DashboardLayout>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-[13px] font-semibold shadow-2xl"
            style={{ background: "var(--pumpkin)", color: "#fff" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-[28px] font-extrabold mb-1"
              style={{ fontWeight:800, color:"var(--text-primary)" }}>
            {showFavs ? "My Favourites" : "Explore Universities"}
          </h1>
          <p className="text-[14px]" style={{ color:"var(--text-secondary)" }}>
            {filtered.length} universities{favs.length > 0 && !showFavs ? ` · ${favs.length} saved` : ""}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFavs(v => !v)}
          className="btn-ghost !py-2.5 !px-4 !text-[13px] flex items-center gap-2"
          style={{ borderColor: showFavs ? "var(--pumpkin)" : "var(--border)", color: showFavs ? "var(--pumpkin)" : "var(--text-secondary)" }}>
          <Heart size={15} fill={showFavs ? "currentColor" : "none"} />
          Favourites {favs.length > 0 && `(${favs.length})`}
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="relative mb-4">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:"var(--text-muted)" }} />
        <input value={query} onChange={e => setQuery(e.target.value)}
               placeholder="Search universities, cities, countries…"
               className="form-input !rounded-2xl pl-11 !py-3.5" />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color:"var(--text-muted)" }}>
            <X size={15} />
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex flex-wrap gap-3 mb-7">
        {[
          [COUNTRIES, country, setCountry, 180],
          [FIELDS,    field,   setField,   160],
          [SORT_BY,   sortBy,  setSortBy,  150],
        ].map(([opts, val, setter, w]) => (
          <select key={opts[0]} value={val} onChange={e => setter(e.target.value)}
                  className="form-input !py-2 !text-[13px] !rounded-xl"
                  style={{ width: w, minWidth: w }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        {(country !== "All Countries" || field !== "All Fields" || query) && (
          <button onClick={() => { setQuery(""); setCountry("All Countries"); setField("All Fields"); }}
                  className="btn-ghost !py-2 !px-4 !text-[13px]">
            <X size={13} /> Clear
          </button>
        )}
      </motion.div>

      {/* Empty favourites state */}
      {showFavs && favs.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-20 card">
          <Heart size={40} className="mx-auto mb-4" style={{ color:"var(--text-muted)" }} />
          <p className="text-[16px] font-semibold mb-2" style={{ color:"var(--text-primary)" }}>No favourites yet</p>
          <p className="text-[14px]" style={{ color:"var(--text-secondary)" }}>
            Click the ♡ heart on any university to save it here.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFavs(false)} 
            className="btn-primary mt-6">
            Browse Universities
          </motion.button>
        </motion.div>
      )}

      {/* Grid */}
      {paged.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {paged.map((u, index) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}>
              <UniversityCard u={u} isFav={favs.includes(u.id)} onToggleFav={toggleFav} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-ghost !py-2 !px-3 disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
            <button key={p} onClick={() => setPage(p)}
                    className="w-9 h-9 rounded-full text-[13px] font-semibold border transition-all"
                    style={{ background:page===p?"var(--pumpkin)":"var(--bg-card)", borderColor:page===p?"var(--pumpkin)":"var(--border)", color:page===p?"#fff":"var(--text-secondary)" }}>
              {p}
            </button>
          ))}
          <motion.button 
            whileHover={page !== totalPages ? { scale: 1.1 } : {}}
            whileTap={page !== totalPages ? { scale: 0.9 } : {}}
            onClick={() => setPage(p => Math.min(totalPages,p+1))} 
            disabled={page===totalPages} 
            className="btn-ghost !py-2 !px-3 disabled:opacity-40">
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}

function UniversityCard({ u, isFav, onToggleFav }) {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className="card flex flex-col overflow-hidden transition-all duration-300"
         style={{ opacity:1 }}>
      {/* Top */}
      <div className="flex items-start justify-between p-5 pb-3"
           style={{ borderBottom:"1px solid var(--border)" }}>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[15px] font-bold leading-tight mb-1"
              style={{ fontWeight:700, color:"var(--text-primary)" }}>{u.name}</h3>
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color:"var(--text-muted)" }}>
            <MapPin size={11} /> {u.flag} {u.city}, {u.country}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <motion.button 
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onToggleFav(u.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background:isFav?"rgba(239,68,68,0.1)":"var(--bg-secondary)", color:isFav?"#ef4444":"var(--text-muted)" }}>
            <Heart size={14} fill={isFav?"currentColor":"none"} />
          </motion.button>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                style={{ background:"var(--pumpkin-soft)", color:"var(--pumpkin)" }}>
            #{u.rank}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Fields */}
        <div className="flex flex-wrap gap-1.5">
          {u.fields.map(f => (
            <span key={f} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg"
                  style={{ background:"var(--bg-secondary)", color:"var(--text-secondary)", border:"1px solid var(--border)" }}>
              {f}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[["SAT MIN", u.satMin?`${u.satMin}+`:"—"],["IELTS",u.ielts],["ACCEPTANCE",u.acceptance],["TUITION/YR",u.tuition]].map(([label,val])=>(
            <div key={label} className="rounded-xl p-3"
                 style={{ background:"var(--bg-secondary)", border:"1px solid var(--border)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color:"var(--text-muted)" }}>{label}</p>
              <p className="font-display text-[16px] font-bold" style={{ fontWeight:700, color:"var(--text-primary)" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggleFav(u.id)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold border transition-all"
            style={{
              background:  isFav ? "rgba(239,68,68,0.08)" : "var(--pumpkin)",
              borderColor: isFav ? "#ef4444" : "var(--pumpkin)",
              color:       isFav ? "#ef4444"  : "#fff",
            }}>
            <Heart size={14} fill={isFav?"currentColor":"none"} />
            {isFav ? "Remove from Favourites" : "♡  Save to Favourites"}
          </motion.button>
          <motion.a 
            whileHover={{ scale: 1.02 }}
            href={u.website || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-ghost justify-center !py-2 !text-[12px] w-full">
            <ExternalLink size={12} /> Visit Website
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
