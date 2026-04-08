import api from '@/services/api'

export default {
  async getDashboardData() {
    try {
      const response = await api.get('/dashboard')

      if (response.data.isSuccess) {
        return response.data.result
      } else {
        throw new Error('Failed to fetch books')
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  }
}