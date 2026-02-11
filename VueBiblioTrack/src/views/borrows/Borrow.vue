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
            <h2 class="h5 text-primary-subtle">Available Books</h2>
            <p class="mb-0 text-muted small">Borrow books from BiblioTrack</p>
          </div>
        </div>
        <div class="card-body p-3">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-3 small text-muted">Title</th>
                  <th class="small text-muted">Category</th>
                  <th class="small text-muted">Author</th>
                  <th class="small text-muted">Publisher</th>
                  <th class="pe-3 text-end small text-muted"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in availableBooks" :key="book.bookCopyId">
                  <td class="ps-3">
                    <div class="d-flex align-items-center">
                      <img
                        :src="CONFIG_IMAGE_URL + book.imageUrl"
                        alt="Book"
                        class="rounded object-fit-cover me-2"
                        style="width: 50px; height: 50px"
                      />
                      <div>
                        <div class="fw-semibold small">{{ book.title }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-primary-subtle bg-opacity-10 text-primary-subtle small">
                      {{ book.category }}
                    </span>
                  </td>
                  <td class="fw-semibold small">{{ book.author }}</td>
                  <td class="fw-semibold small">{{ book.publisher }}</td>
                  <td class="pe-3 text-end">
                    <div class="d-flex gap-2 justify-content-end">
                      <button
                        class="btn btn-sm btn-outline-primary-subtle"
                       
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                    </div>
                  </td>
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
import bookCopyService from '@/services/bookCopyService.js'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { CONFIG_IMAGE_URL } from '@/constants/config'
import { useSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'
const { showConfirm, showError, showSuccess } = useSwal()
const availableBooks = reactive([])
const loading = ref(false)
const router = useRouter()
const fetchAvailableBooks = async () => {
  availableBooks.length = 0
  loading.value = true
  try {
    var result = await bookCopyService.getBooks(true)
    availableBooks.push(...result)
  } catch (error) {
    console.log('Error fetch available books:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAvailableBooks)

const borrowBook = async (bookCopyId) => {
  try {

  } catch (error) {
    console.log('Error borrowing book:', error)
  } finally {
    loading.value = false
  }
}
</script>