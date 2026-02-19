import api from '@/services/api'

export default {
    async getUsersActivity() {
        try {
            const response = await api.get('/userActivity')

            if (!response.data.isSuccess) throw new Error('Failed to get users activity') 
            return response.data.result; 

            } 
        catch (error) {
                console.error('Error getting users activity:', error)
                throw error
            }
        }
    }