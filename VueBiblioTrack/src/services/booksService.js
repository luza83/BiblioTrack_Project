import api from '@/services/api'

export default {
  async getBooks() {
    try {
      const response = await api.get('/books')

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
}