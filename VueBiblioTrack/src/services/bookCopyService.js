import api from '@/services/api'

export default {
    async getBooks() {
    try {
      const response = await api.get('/bookCopies')

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
  async getBookCopies() {
    try {
      const response = await api.get(`/bookCopies/copies/${bookId}`)

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch book copies')
      }
    } catch (error) {
      console.error('Error fetching book copiess:', error)
      throw error
    }
  },
  async getBookCopyById(copyId) {
    try {
      const response = await api.get(`/bookCopies/${copyId}`)

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
  async addBookCopy(data) {
    try {
      const response = await api.post('/bookCopies', data)

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
  async updateBookCopy(copyId, data) {
    try {
      const response = await api.put(`/bookCopies/${copyId}`, data)

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
  async deleteBookCopy(copyId) {
    try {
      const response = await api.delete(`/bookCopies?copyId=${copyId}`)

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