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
            <h2 class="h5 text-primary-subtle">Books</h2>
            <p class="mb-0 text-muted small">Manage books from BiblioTrack</p>
          </div>
          <button
            class="btn btn-primary-subtle btn-sm gap-2 rounded-1 px-4 py-2"
            @click="router.push({ name: APP_ROUTE_NAMES.CREATE_BOOK })"
          >
            <i class="bi bi-plus-square"></i> &nbsp;
            <span>Add Book</span>
          </button>
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
                  <th class="pe-3 text-end small text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in books" :key="book.bookId">
                  <td class="ps-3">
                    <div class="d-flex align-items-center">
                      <img
                        :src="book.imageUrl"
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
                        @click="
                          router.push({
                            name: APP_ROUTE_NAMES.EDIT_BOOK,
                            params: { bookId: book.bookId },
                          })
                        "
                      >
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="handleBookDelete(book.bookId)"
                      >
                        <i class="bi bi-trash-fill"></i>
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
import booksService from '@/services/booksService.js'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
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
    var result = await booksService.getBooks()
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
    console.log(confirmResult)
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