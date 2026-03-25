import api from '@/services/api'

export default {
    async getUserFavorites(request) {
        try {
            const response =  await api.get('/userFavoriteBooks', { params: request })
            if (!response.data.isSuccess) throw new Error('Failed to get users favorites') 
            return response.data.result; 

            } 
        catch (error) {
                console.error('Error getting users favorites:', error)
                throw error
            }
        },
    async addBookToUserFavorites(request) {
        try {
            const response = await api.post('/userFavoriteBook', request)

            if (!response.data.isSuccess) throw new Error('Failed to set book as favorite') 
            return true;
            
    }     catch (error) {

                console.error('Error setting book as favorite:', error)
                throw error
            }
        },
    async removeBookFromUserFavorites(request) {
        try {
            const response = await api.delete('/userFavoriteBook', { data: request })
            if (!response.data.isSuccess) throw new Error('Failed to remove book from favorites') 
            return true;

            }
        catch (error) {
                console.error('Error removing book from favorites:', error)
                throw error
            }   
        }

    }

