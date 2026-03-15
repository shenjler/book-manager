import React from 'react'
import { CssBaseline, Box, Typography } from '@mui/material'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <MainContent />
    </AuthProvider>
  )
}

function MainContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">加载中...</Typography>
      </Box>
    )
  }

  return (
    <>
      {!user ? (
        <Auth onLoginSuccess={() => {}} />
      ) : (
        <Dashboard user={user} />
      )}
    </>
  )
}

export default App
