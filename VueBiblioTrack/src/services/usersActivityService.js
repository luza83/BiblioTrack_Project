import api from '@/services/api'

export default {
    async getUsersActivity(getUsersActivityFilter) {
        try {
            const response = await api.get('/userActivity', { params: getUsersActivityFilter })

            if (!response.data.isSuccess) throw new Error('Failed to get users activity') 
            return response.data.result; 

            } 
        catch (error) {
                console.error('Error getting users activity:', error)
                throw error
            }
        },
    async getCurrentUserActivity() {
        try {
            const response = await api.get('/userActivity/userOverview')
            if (!response.data.isSuccess) throw new Error('Failed to get user activity by user ID')
            
            return response.data.result;
        } 
        catch (error) {
            console.error('Error getting user activity by user ID:', error)
            throw error
        }
    }
    }