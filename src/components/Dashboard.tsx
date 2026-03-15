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
  IconButton
} from '@mui/material'
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Book as BookIcon
} from '@mui/icons-material'
import useBooks from '../hooks/useBooks'
import BookForm from './BookForm'
import BookList from './BookList'
import { Book, BookFormData } from '../types/book'

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
    const supabase = require('../utils/supabaseClient').supabase
    await supabase.auth.signOut()
    window.location.reload()
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
            <IconButton color="inherit" onClick={handleSignOut}>
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
    </Box>
  )
}
