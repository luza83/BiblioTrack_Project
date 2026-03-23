import api from '@/services/api'

export default {
    async borrowBook(request, getResult = false) {
        try {
            const response = await api.post('/borrowings', request)

            if (!response.data.isSuccess) throw new Error('Failed to borrow book')
            if (getResult) {
                return response.data.result;
            }
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