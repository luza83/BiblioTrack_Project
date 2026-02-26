import api from '@/services/api'

export default {
    async getUserFavorites(userId) {
        try {
            const response =  await api.get( `/userFavoriteBook/allFavoriteBooks?userId=${encodeURIComponent(userId)}`);
            if (!response.data.isSuccess) throw new Error('Failed to get users favorites') 
            return response.data.result; 

            } 
        catch (error) {
                console.error('Error getting users favorites:', error)
                throw error
            }
        },
    async addBookToUserFavorites(bookId) {
        try {
            const response = await api.post(`/userFavoriteBook/${bookId}`)

            if (!response.data.isSuccess) throw new Error('Failed to set book as favorite') 
            return true;
            
    }     catch (error) {

                console.error('Error setting book as favorite:', error)
                throw error
            }
        },
    async removeBookFromUserFavorites(bookId) {
        try {
            const response = await api.delete(`/userFavoriteBook/${bookId}`)
            if (!response.data.isSuccess) throw new Error('Failed to remove book from favorites') 
            return true;

            }
        catch (error) {
                console.error('Error removing book from favorites:', error)
                throw error
            }   
        }

    }

