import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import StudentProfile from './pages/StudentProfile/StudentProfile';
import AddStudent from './pages/AddStudent/AddStudent';
import Departments from './pages/Departments/Departments';
import Courses from './pages/Courses/Courses';
import Attendance from './pages/Attendance/Attendance';
import Results from './pages/Results/Results';
import Settings from './pages/Settings/Settings';
import HelpSupport from './pages/HelpSupport/HelpSupport';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#fff',
              fontSize: '13px',
              borderRadius: '8px',
            },
            success: {
              iconTheme: {
                primary: '#0F766E',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC2626',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside AppLayout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<StudentProfile />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="courses" element={<Courses />} />
            <Route path="departments" element={<Departments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="results" element={<Results />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help-support" element={<HelpSupport />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
