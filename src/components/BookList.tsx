import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Rating,
  Grid as MuiGrid
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Bookmark as BookIcon
} from '@mui/icons-material'
import { Book } from '../types/book'

interface BookListProps {
  books: Book[]
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export default function BookList({ books, onEdit, onDelete, loading }: BookListProps) {
  if (loading) {
    return <Typography>加载中...</Typography>
  }

  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          还没有添加任何书籍
        </Typography>
      </Box>
    )
  }

  return (
    <MuiGrid container spacing={3}>
      {books.map(book => (
        <MuiGrid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {book.title}
                </Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(book)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(book.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                作者：{book.author}
              </Typography>

              {book.genre && (
                <Chip
                  label={book.genre}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              )}

              <Chip
                label={book.read_status ? '已读' : '未读'}
                size="small"
                color={book.read_status ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />

              {book.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={book.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {book.rating}/5
                  </Typography>
                </Box>
              )}

              {(book.publisher || book.publish_date) && (
                <Typography variant="body2" color="text.secondary">
                  {book.publisher && `出版社：${book.publisher}`}
                  {book.publisher && book.publish_date && ' | '}
                  {book.publish_date && `出版：${book.publish_date}`}
                </Typography>
              )}

              {book.isbn && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ISBN: {book.isbn}
                </Typography>
              )}

              {book.notes && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>笔记：</strong>
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      p: 1,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      fontStyle: 'italic'
                    }}
                  >
                    {book.notes}
                  </Box>
                </Typography>
              )}
            </CardContent>
          </Card>
        </MuiGrid>
      ))}
    </MuiGrid>
  )
}
