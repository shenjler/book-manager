import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link
} from '@mui/material'
import {
  LockReset as LockResetIcon
} from '@mui/icons-material'
import { supabase } from '../utils/supabaseClient'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    // 检查 URL 中是否有重置 token (可能在 hash 或 query params)
    const searchParams = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.slice(1)) // 去掉 # 号

    const accessToken = searchParams.get('access_token') || hashParams.get('access_token')
    const type = searchParams.get('type') || hashParams.get('type')

    if (accessToken && type === 'recovery') {
      setHasToken(true)
    } else {
      setError('无效的重置链接')
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('两次输入的新密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 位')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || '重置失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (!hasToken && !error) {
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
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                正在验证...
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
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
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LockResetIcon sx={{ mr: 1 }} />
              <Typography variant="h4" component="h1">
                重置密码
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success ? (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>
                  密码重置成功！
                </Alert>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  您的密码已成功更新。现在可以使用新密码登录了。
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  href="/"
                >
                  返回登录
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  请输入您的新密码。完成后您将可以使用新密码登录。
                </Typography>

                <form onSubmit={handleResetPassword}>
                  <TextField
                    fullWidth
                    label="新密码"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    required
                    autoComplete="new-password"
                    helperText="密码长度至少 6 位"
                  />
                  <TextField
                    fullWidth
                    label="确认新密码"
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
                    {loading ? '重置中...' : '重置密码'}
                  </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link
                    href="/"
                    underline="hover"
                  >
                    返回登录
                  </Link>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
