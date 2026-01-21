<template>
  <div class="container px-5">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary-subtle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div>
        <div
          class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3"
        ><div>
            <div>
                <img
                    :src="CONFIG_IMAGE_URL + book.imageUrl"
                    alt="Book"
                    class="rounded object-fit-cover me-2"
                    style="width: 100px; height: 100px"
                    />
                <h2 class="h5 text-primary-subtle">{{ book.title }}</h2>
                <p class="mb-0 text-muted small">Manage book copies</p>
            </div>
           
          </div>
          <button
            class="btn btn-primary-subtle btn-sm gap-2 rounded-1 px-4 py-2"
            @click="router.push({ name: APP_ROUTE_NAMES.CREATE_BOOK_COPY })"
          >
            <i class="bi bi-plus-square"></i> &nbsp;
            <span>Add Book Copy</span>
          </button>
        </div>
        <div class="card-body p-5">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="small text-muted">Copy ID</th>  
                  <th class="small text-muted">Status</th>
                  <th class="small text-muted">Location</th>
                  <th class="small text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="copy in bookCopies" :key="copy.copyId">
                  <td class="fw-semibold small">{{ copy.copyId }}</td>
                  <td class="fw-semibold small">{{ copy.status }}</td>
                  <td class="fw-semibold small">{{ copy.location }}</td>
                  <td>
                   <div class="d-flex gap-3">
                        <button
                        class="btn btn-secondary btn-sm"
                        @click="
                           viewBookCopyDetails(copy)
                        "
                        >
                        <i class="bi bi-pencil"></i>
                        </button>
                            <button
                        class="btn btn-danger btn-sm"
                        @click="handleBookCopyDelete(copy.copyId)"
                        >
                        <i class="bi bi-trash"></i>
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
    <BookCopyUpsertModal
      :bookCopy="selectedBookCopy"
      @close="closeBookCopyModal"
      @status-updated="fetchBookCopies"
    ></BookCopyUpsertModal>
  </div>
</template>
<script setup>
import booksService from '@/services/booksService.js'
import bookCopyService from '@/services/bookCopyService.js'
import { ref, onMounted, reactive } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { CONFIG_IMAGE_URL } from '@/constants/config'   
import { useSwal } from '@/composables/swal'
import { useRouter, useRoute } from 'vue-router'
import BookCopyUpsertModal from '@/components/modals/BookCopyUpsertModal.vue'
const { showConfirm, showError, showSuccess } = useSwal()
const book =  reactive({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  category: 0.0,
  imageUrl: '',
})
const bookCopies = reactive([]);
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const selectedBookCopy = ref(null);
console.log("Params:", route.params);
const bookId = route.params.bookId;
const fetchBookAndCopies = async () => {
  loading.value = true
  try {
    var result = await booksService.getBookById(bookId)
    Object.assign(book, result)
    fetchBookCopies(bookId);
  } catch (error) {
    console.log('Error fetch menu items:', error)
  } finally {
    loading.value = false
  }
}

const fetchBookCopies = async () => {
    bookCopies.length = 0
  loading.value = true
  try {
    var result = await bookCopyService.getBookCopies(bookId)
    bookCopies.push(...result)
  } catch (error) {
    console.log('Error fetch menu items:', error)
  } finally {
    loading.value = false
  }
}

const viewBookCopyDetails = (bookCopy) => {
  selectedBookCopy.value = { ...bookCopy }
}

const closeBookCopyModal = () => {
  selectedBookCopy.value = null
}

onMounted(() => {
  fetchBookAndCopies();
});

const handleBookCopyDelete = async (copyId) => {
  try {
    const confirmResult = await showConfirm('Are you sure you want to delete this copy?')
    console.log(confirmResult)
    if (confirmResult.isConfirmed) {
      loading.value = true
      await bookCopyService.deleteBookCopy(copyId)
      showSuccess('Book copy deleted successfully')
      fetchBookCopies()
    }
  } catch (error) {
    console.log('Error deleting book copy:', error)
  } finally {
    loading.value = false
  }
}
</script>