import api from '@/services/api'

export default {
    async borrowBook(borrowObj) {
        try {
            const response = await api.post('/borrowings', borrowObj)

            if (!response.data.isSuccess) throw new Error('Failed to borrow book') 
            return true; 

            } 
        catch (error) {
                console.error('Error borrowing book:', error)
                throw error
            }
        }
    }