import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  IconButton,
  TextField,
  Button
} from '@mui/material'
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Book as BookIcon
} from '@mui/icons-material'
import LockIcon from '@mui/icons-material/Lock'
import useBooks from '../hooks/useBooks'
import BookForm from './BookForm'
import BookList from './BookList'
import { Book, BookFormData } from '../types/book'
import { supabase } from '../utils/supabaseClient'

interface User {
  id: string
  email?: string
}

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  const { books, loading, addBook, updateBook, deleteBook } = useBooks()

  const handleAddBook = async (data: BookFormData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, data)
        setSnackbar({
          open: true,
          message: '书籍更新成功',
          severity: 'success'
        })
      } else {
        await addBook(data)
        setSnackbar({
          open: true,
          message: '书籍添加成功',
          severity: 'success'
        })
      }
      setOpenDialog(false)
      setEditingBook(null)
    } catch (error) {
      setSnackbar({
        open: true,
        message: '操作失败，请重试',
        severity: 'error'
      })
    }
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setOpenDialog(true)
  }

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('确定要删除这本书吗？')) {
      try {
        await deleteBook(id)
        setSnackbar({
          open: true,
          message: '书籍删除成功',
          severity: 'success'
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: '删除失败，请重试',
          severity: 'error'
        })
      }
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingBook(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  // 修改密码对话框
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setSnackbar({ open: false, message: '', severity: 'success' })

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('两次输入的新密码不一致')
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('密码长度至少为 6 位')
      }

      // 首先验证旧密码
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: passwordData.currentPassword
      })

      if (signInError) {
        throw new Error('当前密码错误')
      }

      // 旧密码验证通过，更新为新密码
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setSnackbar({
        open: true,
        message: '密码修改成功',
        severity: 'success'
      })
      handleClosePasswordDialog()
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || '密码修改失败，请重试',
        severity: 'error'
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  // 统计信息
  const totalBooks = books.length
  const readBooks = books.filter(b => b.read_status).length
  const unreadBooks = totalBooks - readBooks

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <BookIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            我的图书管理
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{user.email}</Typography>
            <IconButton color="inherit" onClick={handleOpenPasswordDialog} title="修改密码">
              <LockIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleSignOut} title="退出登录">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 统计卡片 */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <Alert severity="info" sx={{ flexGrow: 1, minWidth: 200 }}>
            总藏书：{totalBooks} 本
          </Alert>
          <Alert severity="success" sx={{ flexGrow: 1, minWidth: 200 }}>
            已读：{readBooks} 本
          </Alert>
          <Alert sx={{ flexGrow: 1, minWidth: 200 }}>
            未读：{unreadBooks} 本
          </Alert>
        </Box>

        <BookList
          books={books}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          loading={loading}
        />
      </Container>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
        onClick={() => setOpenDialog(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingBook ? '编辑书籍' : '添加新书'}
        </DialogTitle>
        <DialogContent>
          <BookForm
            initialData={editingBook || undefined}
            onSubmit={handleAddBook}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* 修改密码对话框 */}
      <Dialog
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          修改密码
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleChangePassword}>
            <TextField
              fullWidth
              label="当前密码"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              margin="normal"
              required
              autoComplete="current-password"
              autoFocus
            />
            <TextField
              fullWidth
              label="新密码"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              margin="normal"
              required
              autoComplete="new-password"
              helperText="密码长度至少 6 位"
            />
            <TextField
              fullWidth
              label="确认新密码"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              margin="normal"
              required
              autoComplete="new-password"
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleClosePasswordDialog}>
                取消
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword}
              >
                {passwordLoading ? '修改中...' : '修改密码'}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
