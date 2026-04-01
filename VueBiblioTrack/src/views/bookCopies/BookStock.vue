<template>
  <div class="container px-3">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary-subtle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div>
        <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3">
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
                  <th class="ps-3 small text-muted"
                    style=" max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Title</th>
                  <th class="small text-muted">Author</th>
                  <th class="small text-muted">ISBN</th>
                  <th class="small text-muted">Copies</th>
                  <th class="small text-muted"></th>
                </tr>
                <tr>
                  <th class="small text-muted">
                    <input type="text" v-model="getBooksFilter.title" @input="onFilterChange"
                      placeholder="Search by Title" class="form-control form-control-sm" />
                  </th>
                  <th class="small text-muted">
                    <input type="text" v-model="getBooksFilter.author" @input="onFilterChange"
                      placeholder="Search by Author" class="form-control form-control-sm" />
                  </th>
                  <th class="small text -muted">
                    <input type="text" v-model="getBooksFilter.isbn" @input="onFilterChange" placeholder="Search by ISBN"
                      class="form-control form-control-sm" />
                  </th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="books.length > 0" v-for="book in books" :key="book.bookId">
                  <td class="ps-3">
                    <div class="d-flex align-items-center">
                      <img :src="book.imageUrl" alt="Book" class="rounded object-fit-cover me-2"
                        style="width: 50px; height: 50px" />
                      <div>
                        <div class="fw-semibold small"
                          style=" max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                          :title="book.title">
                          {{ book.title }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="fw-semibold small">{{ book.author }}</td>
                  <td class="fw-semibold small">{{ book.isbn }}</td>
                  <td class="fw-semibold small text-center">{{ book.totalCopies }}</td>
                  <td class="fw-semibold small text-end text-primary-subtle" @click="
                    router.push({
                      name: APP_ROUTE_NAMES.BOOK_COPIES,
                      params: { bookId: book.bookId },
                    })
                    " style="cursor: pointer"><i class="bi bi-list-ul fs-6" title="Show Copy List"></i>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="5" class="text-center py-5">
                    <div class="card h-100 shadow-sm">
                      <div class="card-body d-flex flex-column align-items-center justify-content-center">
                        <i class="bi bi-book fs-1 text-primary-subtle mb-3"></i>
                        <h5 class="card-title text-primary-subtle">No books found</h5>
                        <p class="card-text text-muted">Try adjusting your search or filters to find what you're looking for.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="d-flex justify-content-center gap-2 my-3">
          <div class="text-center text-primary-subtle">
            <button :disabled="getBooksFilter.pageNumber === 1" @click="changePage(getBooksFilter.pageNumber - 1)">
              <i class="bi bi-arrow-left fs-6"></i>
            </button>
          </div>
          <div class="text-center">
            <p>Page {{ getBooksFilter.pageNumber }} of {{ totalPages }}</p>
          </div>
          <div class="text-center text-primary-subtle">
            <button :disabled="getBooksFilter.pageNumber === totalPages"
              @click="changePage(getBooksFilter.pageNumber + 1)">
              <i class="bi bi-arrow-right fs-6"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import booksService from '@/services/booksService.js'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'
const { showConfirm, showError, showSuccess } = useSwal()
const books = reactive([])
const loading = ref(false)
const router = useRouter()
const getBooksFilter = reactive({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  category: '',
  pageNumber: 1,
  pageSize: 10,
})

const totalPages = ref(1)
let debounceTimer = ref(null)
const fetchBooks = async () => {
  books.length = 0
  loading.value = true
  try {
    var result = await booksService.getBorrowableBooks(getBooksFilter)
    books.push(...result.data)
    totalPages.value = result.totalPages
  } catch (error) {
    console.log('Error fetch menu items:', error)
  } finally {
    loading.value = false
  }
}
function changePage(page) {
  getBooksFilter.pageNumber = page
  fetchBooks()
}

function onFilterChange() {
  getBooksFilter.pageNumber = 1
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    fetchBooks()
  }, 1500)
}

function resetFilters() {
  getBooksFilter.title = ''
  getBooksFilter.author = ''
  getBooksFilter.isbn = ''
  getBooksFilter.publisher = ''
  getBooksFilter.category = ''
  getBooksFilter.pageNumber = 1
  fetchBooks()
}

onMounted(fetchBooks)


</script>