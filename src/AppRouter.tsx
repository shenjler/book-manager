import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, Box, Typography } from '@mui/material'
import { useAuth } from './context/AuthContext'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Typography variant="h6">加载中...</Typography>
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Typography variant="h6">加载中...</Typography>
      </Box>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function AppRouter() {
  const { user } = useAuth()

  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* 公开路由 */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth onLoginSuccess={() => {}} />
            </PublicRoute>
          }
        />

        {/* 忘记密码页面 - 请求重置邮件 */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* 密码重置页面 - 通过邮件链接访问 */}
        <Route
          path="/reset"
          element={<ResetPassword />}
        />

        {/* 受保护的路由 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user!} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
