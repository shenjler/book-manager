import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Book, BookFormData } from '../types/book'

export default function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取所有书籍
  const fetchBooks = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 添加书籍
  const addBook = async (bookData: BookFormData) => {
    setLoading(true)
    setError(null)

    try {
      // 过滤掉空字符串的可选字段，避免数据库类型错误
      const cleanedData = {
        ...bookData,
        isbn: bookData.isbn || undefined,
        genre: bookData.genre || undefined,
        publish_date: bookData.publish_date || undefined,
        publisher: bookData.publisher || undefined,
        rating: bookData.rating ? Number(bookData.rating) : undefined,
        notes: bookData.notes || undefined,
        read_status: !!bookData.read_status
      }

      const { data, error } = await supabase
        .from('books')
        .insert(cleanedData)
        .select()
        .single()

      if (error) throw error
      setBooks(prev => [data, ...prev])
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 更新书籍
  const updateBook = async (id: string, updates: Partial<BookFormData>) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('books')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setBooks(prev => prev.map(book => book.id === id ? data : book))
      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 删除书籍
  const deleteBook = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

      if (error) throw error
      setBooks(prev => prev.filter(book => book.id !== id))
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook
  }
}