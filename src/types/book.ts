export interface Book {
  id: string
  user_id: string
  title: string
  author: string
  isbn?: string
  genre?: string
  publish_date?: string
  publisher?: string
  rating?: number
  notes?: string
  read_status: boolean
  created_at: string
  updated_at: string
}

export interface BookFormData {
  title: string
  author: string
  isbn?: string
  genre?: string
  publish_date?: string
  publisher?: string
  rating?: number
  notes?: string
  read_status: boolean
}