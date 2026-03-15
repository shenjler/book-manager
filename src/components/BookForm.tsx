import React from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Rating,
  Button,
  Grid as MuiGrid
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { BookFormData } from '../types/book'

interface BookFormProps {
  initialData?: BookFormData
  onSubmit: (data: BookFormData) => void
  loading?: boolean
}

const genres = [
  '小说',
  '传记',
  '历史',
  '科技',
  '艺术',
  '哲学',
  '教育',
  '经济',
  '政治',
  '其他'
]

export default function BookForm({ initialData, onSubmit, loading }: BookFormProps) {
  const { control, handleSubmit, reset } = useForm<BookFormData>({
    defaultValues: initialData || {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publish_date: '',
      publisher: '',
      rating: 0,
      notes: '',
      read_status: false
    }
  })

  const submitHandler = (data: BookFormData) => {
    onSubmit(data)
    if (!initialData) {
      reset()
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)} sx={{ mt: 2 }}>
      <MuiGrid container spacing={3}>
        {/* Title */}
        <MuiGrid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="title"
            control={control}
            rules={{ required: '请输入书名' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="书名 *"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </MuiGrid>

        {/* Author */}
        <MuiGrid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="author"
            control={control}
            rules={{ required: '请输入作者' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="作者 *"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </MuiGrid>

        {/* ISBN */}
        <MuiGrid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="isbn"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="ISBN"
                placeholder="国际标准书号"
              />
            )}
          />
        </MuiGrid>

        {/* Genre */}
        <MuiGrid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="genre"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>类型</InputLabel>
                <Select {...field} label="类型">
                  <MenuItem value="">请选择</MenuItem>
                  {genres.map(genre => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </MuiGrid>

        {/* Publish Date */}
        <MuiGrid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="publish_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                label="出版日期"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </MuiGrid>

        {/* Publisher */}
        <MuiGrid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="publisher"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="出版社"
              />
            )}
          />
        </MuiGrid>

        {/* Rating */}
        <MuiGrid size={{ xs: 12 }}>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel sx={{ mr: 2 }}>评分</InputLabel>
                <Rating
                  {...field}
                  value={field.value || null}
                  onChange={(_, value) => field.onChange(value)}
                />
              </Box>
            )}
          />
        </MuiGrid>

        {/* Notes */}
        <MuiGrid size={{ xs: 12 }}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                label="读书笔记"
              />
            )}
          />
        </MuiGrid>

        {/* Read Status */}
        <MuiGrid size={{ xs: 12 }}>
          <Controller
            name="read_status"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="已读"
              />
            )}
          />
        </MuiGrid>

        {/* Submit Button */}
        <MuiGrid size={{ xs: 12 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            size="large"
          >
            {loading ? '保存中...' : initialData ? '更新' : '添加'}
          </Button>
        </MuiGrid>
      </MuiGrid>
    </Box>
  )
}
