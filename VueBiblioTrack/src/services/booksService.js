import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore.js'

export default {
  async getBooks(filter) {
    try {
      const cleanFilter = {}
      for (const key in filter) {
        if (filter[key]) {
          cleanFilter[key] = filter[key]
        }
      }
      const response = await api.get('/books', { params: cleanFilter })

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch books')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },
  async getBookById(id) {
    try {
      const response = await api.get(`/books/${id}`)

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch book')
      }
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  },
  async addBook(data) {
    const authStore = useAuthStore();
    if (authStore.isAdmin && authStore.isDemo) {
      alert('Unauthorized: Demo admin can not add books')
      throw new Error('Unauthorized: Demo admin can not add books')
    }
    try {
      const response = await api.post('/books', data)

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to create book')
      }
    } catch (error) {
      console.error('Error creating book:', error)
      throw error
    }
  },
  async updateBook(bookId, data) {
    const authStore = useAuthStore();
    if (authStore.isAdmin && authStore.isDemo) {
      alert('Unauthorized: Demo admin can not update books') 
      throw new Error('Unauthorized: Demo admin can not add books')
    }
    try {
      const response = await api.put(`/books/${bookId}`, data)

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to update book')
      }
    } catch (error) {
      console.error('Error updating book:', error)
      throw error
    }
  },
  async deleteBook(bookId) {
    const authStore = useAuthStore();
    if (authStore.isAdmin && authStore.isDemo) {
      alert('Unauthorized: Demo admin can not delete books')
      throw new Error('Unauthorized: Demo admin can not delete books')
    }
    try {
      const response = await api.delete(`/books?bookId=${bookId}`)

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      throw error
    }
  },
  async getBorrowableBooks(getBooksFilter) {

    try {
      const response = await api.get('books/borrowable', { params: getBooksFilter })

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch books')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },
  async getBorrowableBookById(bookId) {
    try {
      const response = await api.get(`/books/borrowable/${bookId}`)
      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch book')
      }
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  },
  async rateBook(data) {
  try {
    const response = await api.put('/books/rate', data)

    if (response.data.isSuccess) {
      return true;
    } else {
      throw new Error('Failed to update book')
    }
  } catch (error) {
    console.error('Error updating book:', error)
    throw error
  }
  },

}