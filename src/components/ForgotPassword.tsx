import React, { useState } from 'react'
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
  LockReset as LockResetIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { supabase } from '../utils/supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || '发送失败，请重试')
    } finally {
      setLoading(false)
    }
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
                  重置邮件已发送！
                </Alert>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  请检查您的邮箱 {email}，点击邮件中的链接来重置密码。
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  如果没有收到邮件，请检查垃圾邮件文件夹。
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  href="/"
                  startIcon={<ArrowBackIcon />}
                >
                  返回登录
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  请输入您注册时使用的邮箱地址。我们将向该邮箱发送一封包含重置密码链接的邮件。
                </Typography>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || !email.trim()}
                    sx={{ mt: 2 }}
                  >
                    {loading ? '发送中...' : '发送重置邮件'}
                  </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link href="/" underline="hover">
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
