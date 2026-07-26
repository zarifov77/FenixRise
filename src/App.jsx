import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./stores/useAuthStore";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOnlyRoute from "./components/AdminOnlyRoute";

import Home            from "./pages/Home";
import Login           from "./pages/auth/Login";
import Register        from "./pages/auth/Register";
import AboutUs         from "./pages/public/AboutUs";
import TermsPage       from "./pages/public/TermsPage";
import Pricing         from "./pages/Pricing";

import Dashboard       from "./pages/dashboard/Dashboard";
import Roadmap         from "./pages/dashboard/Roadmap";
import Universities    from "./pages/dashboard/Universities";
import Notebook        from "./pages/dashboard/Notebook";
import Whiteboard      from "./pages/dashboard/Whiteboard";
import WhiteboardList  from "./pages/dashboard/WhiteboardList";
import Advisor         from "./pages/dashboard/Advisor";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard    from "./pages/admin/Dashboard";
import AdminTests         from "./pages/admin/Tests";
import AdminQuestions     from "./pages/admin/Questions";
import AdminUsers         from "./pages/admin/Users";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminAnalytics     from "./pages/admin/AdminDashboard";

import BugReports       from "./pages/admin/BugReports";
import VideoManagement   from "./pages/admin/VideoManagement";
import UserContentReview from "./pages/admin/UserContentReview";
import QuestionBank      from "./pages/admin/QuestionBank";
import { Progress, Settings, CoursesList } from "./pages/dashboard/DashboardPages";
import Profile from "./pages/dashboard/Profile";

import TestsCollection from "./pages/tests/TestsCollection";
import TestDetail      from "./pages/tests/TestDetail";
import TestSession     from "./pages/tests/TestSession";
import TestReview      from "./pages/tests/TestReview";
import CourseDetail    from "./pages/courses/CourseDetail";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Only redirect away from auth pages AFTER loading is done
function AuthRoute({ children }) {
  const { isAuthed, isLoading } = useAuthStore();
  if (isLoading) return null; // don't redirect while checking
  if (isAuthed)  return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const init = useAuthStore(s => s.init);

  useEffect(() => {
    init();
    const saved = localStorage.getItem("fenixrise-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public — always accessible, landing page is default */}
        <Route path="/"        element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about"   element={<AboutUs />} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/terms"   element={<TermsPage />} />
        <Route path="/privacy" element={<TermsPage />} />

        {/* Auth pages — redirect to dashboard if already logged in */}
        <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* Protected dashboard */}
        <Route path="/dashboard"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/roadmap"      element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/dashboard/universities" element={<ProtectedRoute><Universities /></ProtectedRoute>} />
        <Route path="/dashboard/notebook"     element={<ProtectedRoute><Notebook /></ProtectedRoute>} />
        <Route path="/dashboard/whiteboard"           element={<ProtectedRoute><WhiteboardList /></ProtectedRoute>} />
        <Route path="/dashboard/whiteboard/:boardId"  element={<ProtectedRoute><Whiteboard /></ProtectedRoute>} />
        <Route path="/dashboard/advisor"              element={<ProtectedRoute><Advisor /></ProtectedRoute>} />
        <Route path="/dashboard/progress"     element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/dashboard/settings"     element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/dashboard/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminOnlyRoute><AdminLayout /></AdminOnlyRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="bugs" element={<BugReports />} />
          <Route path="videos" element={<VideoManagement />} />
          <Route path="content" element={<UserContentReview />} />
          <Route path="questionbank" element={<QuestionBank />} />
        </Route>

        {/* Legacy Admin Routes (redirect to new admin panel) */}
        <Route path="/dashboard/admin" element={<Navigate to="/admin" replace />} />
        <Route path="/dashboard/admin/bugs" element={<Navigate to="/admin/bugs" replace />} />
        <Route path="/dashboard/admin/videos" element={<Navigate to="/admin/videos" replace />} />
        <Route path="/dashboard/admin/content" element={<Navigate to="/admin/content" replace />} />
        <Route path="/dashboard/admin/questions" element={<Navigate to="/admin/questions" replace />} />
        <Route path="/profile"                element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard/courses"      element={<ProtectedRoute><CoursesList /></ProtectedRoute>} />

        <Route path="/dashboard/tests"                   element={<ProtectedRoute><TestsCollection /></ProtectedRoute>} />
        <Route path="/dashboard/tests/:slug"             element={<ProtectedRoute><TestDetail /></ProtectedRoute>} />
        <Route path="/dashboard/tests/:slug/session"     element={<ProtectedRoute><TestSession /></ProtectedRoute>} />
        <Route path="/dashboard/tests/review/:attemptId" element={<ProtectedRoute><TestReview /></ProtectedRoute>} />
        <Route path="/dashboard/courses/:id"             element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
