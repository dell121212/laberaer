import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { AppProvider } from './contexts/AppContext.tsx';
import BottomNavigation from './components/Layout/BottomNavigation.tsx';
import Login from './pages/Auth/Login.tsx';
import Home from './pages/Home/Home.tsx';
import StrainsList from './pages/Strains/StrainsList.tsx';
import MembersList from './pages/Members/MembersList.tsx';
import DutySchedule from './pages/Duty/DutySchedule.tsx';
import MediaList from './pages/Media/MediaList.tsx';
import ThesesList from './pages/Theses/ThesesList.tsx';
import ActivityLogs from './pages/Logs/ActivityLogs.tsx';
import AdminPanel from './pages/Admin/AdminPanel.tsx';
import UserProfile from './pages/Profile/UserProfile.tsx';
import Settings from './pages/Settings/Settings.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-secondary-800 transition-colors duration-300">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" replace />} />
        <Route 
          path="/lab" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/strains" 
          element={
            <ProtectedRoute>
              <StrainsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/members" 
          element={
            <ProtectedRoute>
              <MembersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/duty" 
          element={
            <ProtectedRoute>
              <DutySchedule />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/media" 
          element={
            <ProtectedRoute>
              <MediaList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/theses" 
          element={
            <ProtectedRoute>
              <ThesesList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logs" 
          element={
            <ProtectedRoute>
              <ActivityLogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/lab" replace />} />
      </Routes>
      
      {user && <BottomNavigation />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;