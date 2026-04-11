<template>
    <div class="d-flex justify-content-center align-items-center" v-if="loading">
        <div class="spinner-grow text-success" style="width: 2.5rem; height: 2.5rem" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div class="container" v-else>
        <div class="mx-auto">
            <div class="mb-4 border-bottom d-flex justify-content-between align-items-center py-3">
                <h3 class="fw-semibold text-success"> {{ userIdForUpdate ? 'Edit' : 'New' }} User</h3>
                <div class="d-flex gap-3">
                    <button type="submit" form="userForm" class="btn btn-success btn-sm gap-2 rounded-1 px-4 py-2"
                        @click="router.push({ name: APP_ROUTE_NAMES.CREATE_USER })" :disabled="isProcessing">
                        <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                        {{ userIdForUpdate ? 'Update' : 'Create' }} User
                    </button>

                    <button type="button" class="btn btn-outline border btn-sm gap-2 rounded-1 px-4 py-2"
                        @click="router.push({ name: APP_ROUTE_NAMES.USERS })">
                        Cancel
                    </button>
                </div>
            </div>
            <div class="alert alert-danger pb-0" v-if="errorList.length > 0">
                Please fix the following errors:
                <ul>
                    <li v-for="error in errorList" :key="error">{{ error }}</li>
                </ul>
            </div>
        </div>
        <div class="card-body p-3" style="max-width: 600px; margin: auto">

            <form enctype="multipart/form-data" class="needs-validation" id="userForm" @submit.prevent="onFormSubmit">
                <div class="mb-3">
                    <label for="name" class="form-label">User Name</label>
                    <input type="text" class="form-control" id="name" v-model="userObj.userName" />
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="userObj.email" />
                </div>
                <div class="mb-3" v-if="!userIdForUpdate">
                    <label for="role" class="form-label">Role</label>
                    <select class="form-select" id="role" v-model="userObj.role">
                        <option v-for="role in ROLES" :key="role">{{ role }}</option>
                    </select>
                </div>
                <div v-if="userIdForUpdate">
                    <div>
                        <input type="checkbox" id="resetPassword" v-model="userObj.resetPassword" />
                        <label for="resetPassword" class="form-label">&nbsp; Reset Password</label>
                    </div>

                    <div class="mb-3" v-if="userObj.resetPassword">
                        <label for="password" class="form-label">New Password</label>
                        <input type="password" class="form-control" v-model="userObj.password" id="password" />
                    </div>
                </div>

                <div class="mb-3" v-else>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" v-model="userObj.password" id="password" />
                </div>

                <div class="alert alert-danger" v-if="errorList.length > 0">
                    <span class="d-block" v-for="error in errorList" :key="error"> {{ error }} </span>
                </div>

                <button :disabled="loading" type="submit" class="btn btn-secondary w-100">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ userIdForUpdate ? 'Update' : 'Create' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import authService from '@/services/authService'
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { ROLES } from '@/constants/constants'
import usersService from '@/services/usersService'
import { useSwal } from '@/composables/swal'

const { showError, showSuccess, showConfirm } = useSwal()
const router = new useRouter()
const route = new useRoute()
const loading = ref(false)
const isProcessing = ref(false)
const errorList = reactive([])
const userIdForUpdate = route.params.userId
const userObj = reactive({
    userName: '',
    password: '',
    resetPassword: false,
    email: '',
    role: 'Customer',
   
})
const formData = new FormData()

onMounted(async () => {
    if (!userIdForUpdate) return
    loading.value = true
    try {
        const result = await usersService.getUserById(userIdForUpdate)
        Object.assign(userObj, result)

    } catch (err) {
        console.log('Error while fetching user', err)
    } finally {
        loading.value = false
    }
})

const onFormSubmit = async (event) => {
    event.preventDefault()
    isProcessing.value = true
    errorList.length = 0 
    if (userObj.userName === undefined || userObj.userName.length === 0) {
        errorList.push('Name is required.')
    }
    if (userObj.email === undefined || userObj.email.length === 0) {
        errorList.push('Email is required.')
    }
    if (userObj.resetPassword && (userObj.password === undefined || userObj.password.length === 0)) {
        errorList.push('Password is required when resetting password.')
    }
    if (errorList.length > 0) {
        loading.value = false
        return
    }
    Object.entries(userObj).forEach(([key, value]) => {
      formData.append(key, value)
    })
    if(userIdForUpdate) {
        //update
        try {
            const response = await usersService.updateUser(userIdForUpdate, formData)
            if (response) {
                showSuccess('User updated successfully!') 
                isProcessing.value = false;
            }
               
        } catch (err) {
            errorList.push(err)
        } finally {
            loading.value = false
        }
        return
    }
    else {
        //create

            try {
                const response = await authService.signUp(userObj)
                if (response.success) {
                    showSuccess('User registered successfully!')
                    isProcessing.value = false;
                    router.push({ name: APP_ROUTE_NAMES.USERS }) 
                }
                
            } catch (err) {
                errorList.push(err)
            } finally {
                loading.value = false
            }}

}
</script>