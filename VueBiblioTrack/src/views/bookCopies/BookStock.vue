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
            <h2 class="h5 text-primary-subtle">Book stock</h2>
            <p class="mb-0 text-muted small">Manage book copies from BiblioTrack stock</p>
          </div>
        </div>
        <div class="card-body p-3">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-3 small text-muted">Title</th>
                  <th class="small text-muted">Author</th>  
                  <th class="small text-muted">Copies</th>
                  <th class="small text-muted"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in books" :key="book.bookId">
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
                  <td class="fw-semibold small">{{ book.author }}</td>
                  <td class="fw-semibold small">{{ book.totalCopies }}</td>
                  <td 
                    class="fw-semibold small"   
                     @click="
                          router.push({
                            name: APP_ROUTE_NAMES.BOOK_COPIES,
                            params: { bookId: book.bookId },
                          })
                        "
                    style="cursor: pointer"><i class="bi bi-pencil-square"></i>
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
import booksService from '@/services/booksService.js'
import bookCopyService from '@/services/bookCopyService.js'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { CONFIG_IMAGE_URL } from '@/constants/config'
import { useSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'
const { showConfirm, showError, showSuccess } = useSwal()
const books = reactive([])
const loading = ref(false)
const router = useRouter()
const fetchBooks = async () => {
  books.length = 0
  loading.value = true
  try {
    var result = await bookCopyService.getBooks()
    books.push(...result)
  } catch (error) {
    console.log('Error fetch menu items:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)

const handleBookDelete = async (bookId) => {
  try {
    const confirmResult = await showConfirm('Are you sure you want to delete this Book?')
    
    if (confirmResult.isConfirmed) {
      loading.value = true
      await booksService.deleteBook(bookId)
      showSuccess('Book deletd sccucessfully')
      fetchBooks()
    }
  } catch (error) {
    console.log('Error deleting book:', error)
  } finally {
    loading.value = false
  }
}
</script>