import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MiningPage } from './pages/MiningPage';
import { PackagesPage } from './pages/PackagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { WithdrawalPage } from './pages/WithdrawalPage';
import { AuthPage } from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  // Debug logs removed for production

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F3F4F6',
              border: '1px solid #374151',
            },
            success: {
              style: {
                background: '#065F46',
                color: '#D1FAE5',
                border: '1px solid #10B981',
              },
            },
            error: {
              style: {
                background: '#7F1D1D',
                color: '#FEE2E2',
                border: '1px solid #EF4444',
              },
            },
          }}
        />
        
        <Routes>
          {/* Ana sayfa - Landing Page (kullanıcı giriş yapmamışsa) */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            } 
          />
          
          {/* Auth sayfası */}
          <Route 
            path="/auth" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthPage />
              )
            } 
          />
          
          {/* Dashboard ve diğer korumalı sayfalar */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/mining" 
            element={
              <ProtectedRoute>
                <Layout>
                  <MiningPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/packages" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PackagesPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/withdrawal" 
            element={
              <ProtectedRoute>
                <Layout>
                  <WithdrawalPage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 sayfası - bilinmeyen route'lar için */}
          <Route 
            path="*" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
