import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { Dashboard } from './pages/Dashboard/Dashboard';
import { BuilderPage } from './pages/ResumeBuilder/BuilderPage';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { HomePage } from './pages/HomePage/HomePage'; 
import { Navbar } from './components/Navbar'; 
import { Footer } from './components/Footer'; 

// Protect Private Pages using our secure Cookie State
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until the background API finishes checking for the secure cookie session
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-neutral-500 font-mono text-xs">Authenticating route access...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}

// Prevent Logged-In Users from going back to the Login Screen
function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-neutral-500 font-mono text-xs">Verifying authorization parameters...</p>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Global Navbar */}
      <Navbar />
      
      {/* Container expands to keep Footer glued to the bottom */}
      <div className="pt-20 flex-grow">
        <Routes>
          {/* 🏠 Public Root: Now safely guarded! Logged-in users skip this and head to the dashboard automatically */}
          <Route path="/" element={<AuthRoute><HomePage /></AuthRoute>} />
          
          {/* Auth Gate */}
          <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
          
          {/* Private Panels */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/builder/:id" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
          <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
          
          {/* Fallback Catch */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}