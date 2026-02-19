<template>
  <div class="container px-3">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary-subtle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div>
        <div
          class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3"
        >
          <div>
            <h2 class="h5 text-primary-subtle">Users</h2>
            <p class="mb-0 text-muted small">Manage users in BiblioTrack</p>
          </div>
        </div>
        <div class="card-body p-3">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-3 small text-muted">Name</th>
                  <th class="small text-muted">Reserved Books</th>
                  <th class="small text-muted">Borrowed Books</th>
                  <th class="small text-muted">Favorites</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.userId">
                    <td>
                        <span class="badge bg-primary-subtle bg-opacity-10 text-primary-subtle small">
                        {{ user.userName }}
                        </span>
                    </td>
                    <td class="fw-semibold small">{{ user.reservedBooks.length }}</td>
                    <td class="fw-semibold small">{{ user.borrowedBooks.length }}</td>
                    <td class="fw-semibold small">{{ user.favoriteBooks.length }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import usersActivityService from '@/services/usersActivity.js'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'
const { showConfirm, showError, showSuccess } = useSwal()
const books = reactive([])
const loading = ref(false)
const router = useRouter()
const users = reactive([])
const fetchUsers = async () => {
  users.length = 0
  loading.value = true
  try {
    var result = await usersActivityService.getUsersActivity()
    users.push(...result)
  } catch (error) {
    console.log('Error fetch users activity:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

</script>