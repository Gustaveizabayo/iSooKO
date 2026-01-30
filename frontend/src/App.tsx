import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import CoursePlayer from './pages/CoursePlayer';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourseEditor from './pages/InstructorCourseEditor';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import Contact from './pages/Contact';
import VerifyEmail from './pages/VerifyEmail';
import CheckEmail from './pages/CheckEmail';
import InstructorGradebook from './pages/InstructorGradebook';
import AdminStudents from './pages/AdminStudents';
import AdminInstructors from './pages/AdminInstructors';
import AdminSettings from './pages/AdminSettings';
import AttendancePage from './pages/AttendancePage';
import MyCourses from './pages/MyCourses';
import Notifications from './pages/Notifications';
import HelpSupport from './pages/HelpSupport';
import LandingPreloader from './components/layout/LandingPreloader';
import ProtectedRoute from './components/auth/ProtectedRoute';
import InstructorApplication from './pages/InstructorApplication';
import InstructorPending from './pages/InstructorPending';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import Exams from './pages/Exams';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import FAQs from './pages/FAQs';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Press from './pages/Press';
import Community from './pages/Community';
import Accessibility from './pages/Accessibility';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster
          richColors
          position="bottom-right"
          closeButton
          duration={5000}
          expand={true}
          toastOptions={{
            style: {
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            className: 'font-bold',
          }}
        />
        <AnimatePresence mode="wait">
          {loading ? (
            <LandingPreloader key="preloader" onComplete={() => setLoading(false)} />
          ) : (
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
                {/* Student Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/attendance" element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <AttendancePage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/courses" element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <MyCourses />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/notifications" element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/help" element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <HelpSupport />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/exams" element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <Exams />
                  </ProtectedRoute>
                } />

                {/* Instructor Application Routes - Public */}
                <Route path="/instructor/apply" element={<InstructorApplication />} />

                {/* Footer Routes */}
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/press" element={<Press />} />
                <Route path="/community" element={<Community />} />
                <Route path="/accessibility" element={<Accessibility />} />

                <Route path="/instructor/pending" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'STUDENT']}>
                    <InstructorPending />
                  </ProtectedRoute>
                } />

                {/* Protected Instructor Routes */}
                <Route path="/instructor" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/instructor/courses" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <MyCourses />
                  </ProtectedRoute>
                } />
                <Route path="/instructor/attendance" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <AttendancePage />
                  </ProtectedRoute>
                } />
                <Route path="/instructor/gradebook" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <InstructorGradebook />
                  </ProtectedRoute>
                } />
                <Route path="/instructor/notifications" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/instructor/help" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <HelpSupport />
                  </ProtectedRoute>
                } />
                <Route path="/instructor/Pencil/:id" element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR']} requireApproval={true}>
                    <InstructorCourseEditor />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/students" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminStudents />
                  </ProtectedRoute>
                } />
                <Route path="/admin/instructors" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminInstructors />
                  </ProtectedRoute>
                } />
                <Route path="/admin/courses" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <MyCourses />
                  </ProtectedRoute>
                } />
                <Route path="/admin/attendance" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AttendancePage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/security" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <HelpSupport />
                  </ProtectedRoute>
                } />
                <Route path="/admin/notifications" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/admin/help" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <HelpSupport />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<Contact />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/check-email" element={<CheckEmail />} />

                {/* Public Course Routes */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:id" element={<CourseDetails />} />

                {/* Learning Routes */}
                <Route path="/learn/:id" element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                    <CoursePlayer />
                  </ProtectedRoute>
                } />

                {/* Profile Route - Accessible by all authenticated users */}
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          )}
        </AnimatePresence>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

