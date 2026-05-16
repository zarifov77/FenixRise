import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play, FileText, BookOpen, Lock, Check,
  ChevronDown, ChevronUp, ChevronLeft,
  Clock, Users, BarChart2, Star,
} from "lucide-react";
import { courseAPI } from "../../lib/api";
import useAuthStore from "../../stores/useAuthStore";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const LESSON_ICONS = {
  video:    <Play size={13} className="text-[#FE7F2D]" />,
  article:  <FileText size={13} className="text-blue-400" />,
  quiz:     <BookOpen size={13} className="text-yellow-400" />,
  practice: <BarChart2 size={13} className="text-green-400" />,
  live:     <span className="text-[10px] font-bold text-purple-400">LIVE</span>,
};

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [openModules, setOpenModules] = useState({ 0: true });
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    // id could be a slug or mongo id — backend handles both in this setup
    courseAPI.get(id)
      .then((r) => {
        setData(r.data.data);
        // Check if already enrolled
        const isEnrolled = user?.enrolledCourses?.some(
          (ec) => ec.course === r.data.data.course._id || ec.course?._id === r.data.data.course._id
        );
        setEnrolled(isEnrolled || r.data.data.hasAccess);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await courseAPI.enroll(data.course._id);
      setEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.error || "Could not enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (idx) =>
    setOpenModules((prev) => ({ ...prev, [idx]: !prev[idx] }));

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center pt-24">
        <div className="w-8 h-8 border-2 border-[#FE7F2D] border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!data) return (
    <DashboardLayout>
      <div className="text-center pt-24 text-[#9B9C9E]">Course not found.</div>
    </DashboardLayout>
  );

  const { course, hasAccess } = data;

  const totalLessons = course.modules?.reduce((s, m) => s + m.lessons.length, 0) || 0;
  const totalDuration = course.modules?.reduce(
    (s, m) => s + m.lessons.reduce((ls, l) => ls + (l.durationMinutes || 0), 0), 0
  ) || 0;

  return (
    <DashboardLayout>
      <Link to="/dashboard/courses"
            className="inline-flex items-center gap-2 text-[13px] text-[#9B9C9E] hover:text-[#FE7F2D] mb-7 transition-colors">
        <ChevronLeft size={15} /> Back to Courses
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* ── Left ── */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Course header */}
          <div className="card p-7">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="pill !text-[10px]">{course.examType}</span>
              <span className="text-[10px] font-bold bg-white/5 text-[#9B9C9E] px-2.5 py-1 rounded-full">{course.level}</span>
              {course.isPremium && (
                <span className="text-[10px] font-bold bg-[#FE7F2D]/10 text-[#FE7F2D] px-2.5 py-1 rounded-full">Premium</span>
              )}
            </div>

            <h1 className="font-display text-[26px] font-bold text-[#F5F4F2] mb-3 leading-tight" style={{ fontWeight: 700 }}>
              {course.title}
            </h1>
            <p className="text-[14px] text-[#9B9C9E] leading-relaxed mb-5">{course.shortDescription}</p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-5 text-[13px] text-[#9B9C9E] border-t border-white/5 pt-5">
              <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-[#FE7F2D]" />{totalLessons} lessons</span>
              <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#FE7F2D]" />{totalDuration} min total</span>
              <span className="flex items-center gap-1.5"><BarChart2 size={13} className="text-[#FE7F2D]" />{course.durationWeeks} weeks</span>
              <span className="flex items-center gap-1.5"><Users size={13} className="text-[#FE7F2D]" />{course.totalEnrolled?.toLocaleString() || 0} enrolled</span>
              {course.averageRating > 0 && (
                <span className="flex items-center gap-1.5"><Star size={13} className="text-yellow-400" fill="currentColor" />{course.averageRating.toFixed(1)}</span>
              )}
            </div>
          </div>

          {/* Active lesson viewer */}
          {activeLesson && (
            <div className="card overflow-hidden">
              {activeLesson.type === "video" && activeLesson.videoUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={activeLesson.videoUrl.includes("youtube.com") || activeLesson.videoUrl.includes("youtu.be")
                      ? `https://www.youtube.com/embed/${activeLesson.videoUrl.split("v=")[1]?.split("&")[0] || activeLesson.videoUrl.split("/").pop()}`
                      : activeLesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="h-48 bg-[#1e1f20] flex items-center justify-center">
                  {LESSON_ICONS[activeLesson.type]}
                  <span className="text-[#9B9C9E] ml-2 text-[14px]">
                    {activeLesson.type === "article" ? "Article content loaded below" : `${activeLesson.type} lesson`}
                  </span>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-display text-[17px] font-bold text-[#F5F4F2] mb-2" style={{ fontWeight: 700 }}>
                  {activeLesson.title}
                </h3>
                {activeLesson.articleContent && (
                  <div className="prose prose-invert max-w-none text-[14px] text-[#9B9C9E] leading-relaxed mt-3">
                    {activeLesson.articleContent}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What you'll learn */}
          {course.learningOutcomes?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-[16px] font-bold text-[#F5F4F2] mb-4" style={{ fontWeight: 700 }}>
                What You'll Learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {course.learningOutcomes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#FE7F2D] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-[13px] text-[#9B9C9E] leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum */}
          <div className="card p-6">
            <h2 className="font-display text-[16px] font-bold text-[#F5F4F2] mb-5" style={{ fontWeight: 700 }}>
              Course Curriculum
            </h2>
            <div className="flex flex-col gap-2">
              {course.modules?.map((mod, mi) => (
                <div key={mi} className="border border-white/7 rounded-xl overflow-hidden">
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(mi)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#FE7F2D]/10 flex items-center justify-center text-[12px] font-bold text-[#FE7F2D]">
                        {mi + 1}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#F5F4F2]">{mod.title}</p>
                        <p className="text-[11px] text-[#9B9C9E]">{mod.lessons.length} lessons</p>
                      </div>
                    </div>
                    {openModules[mi] ? <ChevronUp size={16} className="text-[#5E5F61]" /> : <ChevronDown size={16} className="text-[#5E5F61]" />}
                  </button>

                  {/* Lessons */}
                  {openModules[mi] && (
                    <div className="border-t border-white/5">
                      {mod.lessons.map((lesson, li) => {
                        const canAccess = hasAccess || lesson.isFree;
                        const isActive  = activeLesson?._id === lesson._id || (activeLesson?.title === lesson.title && activeLesson?.order === lesson.order);

                        return (
                          <button
                            key={li}
                            onClick={() => canAccess && setActiveLesson(lesson)}
                            disabled={!canAccess}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 border-t border-white/3 text-left transition-colors
                              ${isActive ? "bg-[#FE7F2D]/8" : canAccess ? "hover:bg-white/3" : "opacity-60 cursor-not-allowed"}`}
                          >
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5">
                              {canAccess ? LESSON_ICONS[lesson.type] : <Lock size={11} className="text-[#5E5F61]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] font-medium truncate ${isActive ? "text-[#FE7F2D]" : "text-[#F5F4F2]"}`}>
                                {lesson.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {lesson.isFree && (
                                <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">Free</span>
                              )}
                              {lesson.durationMinutes > 0 && (
                                <span className="text-[11px] text-[#5E5F61]">{lesson.durationMinutes}m</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: enroll card ── */}
        <div className="flex flex-col gap-5">
          <div className={`card p-6 flex flex-col gap-4 ${!enrolled ? "grad-border-wrap p-0" : ""}`}>
            <div className={!enrolled ? "card bg-[#28292A] p-6 rounded-[20px] flex flex-col gap-4" : ""}>
              <div className="text-center pb-4 border-b border-white/5">
                <p className="text-[11px] text-[#9B9C9E] mb-1">Course Price</p>
                {course.discountPrice != null ? (
                  <div>
                    <p className="font-display text-[28px] font-extrabold text-[#F5F4F2]" style={{ fontWeight: 800 }}>
                      {course.discountPrice === 0 ? "Free" : `${course.discountPrice.toLocaleString()} UZS`}
                    </p>
                    <p className="text-[13px] text-[#5E5F61] line-through">{course.price.toLocaleString()} UZS</p>
                  </div>
                ) : (
                  <p className="font-display text-[28px] font-extrabold text-[#F5F4F2]" style={{ fontWeight: 800 }}>
                    {course.price === 0 ? "Free" : `${course.price.toLocaleString()} UZS`}
                  </p>
                )}
              </div>

              {enrolled ? (
                <div className="flex items-center gap-2 justify-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <Check size={16} className="text-green-400" />
                  <p className="text-[13px] font-semibold text-green-400">You're enrolled!</p>
                </div>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling}
                        className="btn-primary justify-center w-full !py-3.5 disabled:opacity-60">
                  {enrolling
                    ? <span className="w-5 h-5 border-2 border-[#1a1011] border-t-transparent rounded-full animate-spin" />
                    : course.price === 0 ? "Enroll Free" : "Enroll Now"}
                </button>
              )}

              <div className="flex flex-col gap-2 text-[12px] text-[#9B9C9E]">
                {[
                  `${totalLessons} lessons`,
                  `${course.durationWeeks} weeks of content`,
                  `${totalDuration} min of video`,
                  "Certificate on completion",
                  "Lifetime access",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={12} className="text-[#FE7F2D]" strokeWidth={2.5} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className="card p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#5E5F61] mb-3">Instructor</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                     style={{ background: "linear-gradient(135deg,#FE7F2D,#FFAD60)", color: "#1a1011" }}>
                  {course.instructor.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#F5F4F2]">{course.instructor.name}</p>
                  {course.instructor.profile?.bio && (
                    <p className="text-[12px] text-[#9B9C9E] mt-0.5 line-clamp-2">{course.instructor.profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
