import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

export default {
    async getUserById(userId) {
        try {
            const response = await api.get(`/user/${userId}`)

            if (!response.data.isSuccess) throw new Error('Failed to get user activity')
            return response.data.result;

        }
        catch (error) {
            console.error('Error getting users activity:', error)
            throw error
        }
    },
    async updateUser(userId, userData) {
        try {
            const response = await api.put(`/user/${userId}`, userData)
            if (!response.data.isSuccess) throw new Error('Failed to update user activity')

            return true;
        }
        catch (error) {
            console.error('Error updating user activity:', error)
            throw error
        }
    },
    async deleteUser(userId) {
        const authStore = useAuthStore();
        if (authStore.isAdmin && authStore.isDemo) {
            alert('Unauthorized: Demo admin can not delete users')
            throw new Error('Unauthorized: Demo admin can not delete users')
        }
        try {
            const response = await api.delete(`/user/${userId}`)
            if (!response.data.isSuccess) return response.data.errorMessages
            return true;
        }
        catch (error) {
            console.error('Error deleting user:', error)
            throw error
        }
    }

}