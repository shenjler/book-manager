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
  Alert
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import useBooks from './hooks/useBooks'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import { Book, BookFormData } from './types/book'

function App() {
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            我的图书管理
          </Typography>
          <Typography variant="body2">
            共 {books.length} 本书
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

export default App;
