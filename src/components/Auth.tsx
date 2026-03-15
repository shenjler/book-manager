import React, { useState } from 'react'
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  Link
} from '@mui/material'
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon
} from '@mui/icons-material'
import { supabase } from '../utils/supabaseClient'

interface AuthProps {
  onLoginSuccess: () => void
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 登录表单状态
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // 注册表单状态
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      })

      if (error) throw error

      if (data.user) {
        onLoginSuccess()
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (registerPassword !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (registerPassword.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword
      })

      if (error) throw error

      setSuccessMessage('注册成功！请检查您的邮箱完成验证，然后登录。')
      setTimeout(() => {
        setSuccessMessage(null)
        setTab(0)
        setRegisterEmail('')
        setRegisterPassword('')
        setConfirmPassword('')
      }, 3000)
    } catch (err: any) {
      setError(err.message || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchTab = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab)
    setError(null)
    setSuccessMessage(null)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={8}>
          <CardContent>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              图书管理系统
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" mb={3}>
              管理您的个人藏书
            </Typography>

            <Tabs
              value={tab}
              onChange={handleSwitchTab}
              centered
              sx={{ mb: 3 }}
            >
              <Tab
                label="登录"
                icon={<LoginIcon />}
                iconPosition="start"
              />
              <Tab
                label="注册"
                icon={<RegisterIcon />}
                iconPosition="start"
              />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {tab === 0 ? (
              // 登录表单
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="邮箱"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="current-email"
                />
                <TextField
                  fullWidth
                  label="密码"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="current-password"
                />
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link
                    href="/forgot-password"
                    underline="hover"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    忘记密码？
                  </Link>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </form>
            ) : (
              // 注册表单
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="邮箱"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="email"
                />
                <TextField
                  fullWidth
                  label="密码"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="new-password"
                  helperText="密码长度至少 6 位"
                />
                <TextField
                  fullWidth
                  label="确认密码"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? '注册中...' : '注册'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
