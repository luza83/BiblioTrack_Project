import api from '@/services/api'

export default {
    async borrowBook(bookId) {
        try {
            const response = await api.post(`/borrowings/${bookId}`)

            if (!response.data.isSuccess) throw new Error('Failed to borrow book') 
            return true; 

            } 
        catch (error) {
                console.error('Error borrowing book:', error)
                throw error
            }
        },
    async updateBorrowingStatus(request) {
        try {
            const response = await api.put('/borrowings', request)
            if (!response.data.isSuccess) throw new Error('Failed to update borrowing status')
            return true
        } catch (error) {
            console.error('Error updating borrowing status:', error)
            throw error
        }
        }
    }