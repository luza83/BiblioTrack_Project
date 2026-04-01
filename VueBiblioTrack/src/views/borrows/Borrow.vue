<template>
  <div class="container px-3">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary-subtle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="mb-4">
        <h2 class="h5 text-primary-subtle">Our book selection</h2>
        <p class="mb-0 text-muted small">Borrow books from BiblioTrack</p>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="row g-3">
          <div>
            <button class="btn btn-primary btn-sm me-2" @click="showFilters = !showFilters">
              🔍 Search
            </button>
            <button class="btn btn-primary btn-sm me-2"
              @click="getBooksFilter.getAvailableOnly = !getBooksFilter.getAvailableOnly; onFilterChange()">
              {{ getBooksFilter.getAvailableOnly ? 'Show All' : 'Show Available Only' }}
            </button>

            <button class="btn btn-outline-secondary btn-sm" @click="resetFilters" v-if="showFilters">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div v-if="showFilters" class="mb-3">
        <div class="row g-3">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <input type="text" class="form-control form-control-sm" placeholder="Search by Title"
              @input="onFilterChange()" v-model="getBooksFilter.title" />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <input type="text" class="form-control form-control-sm" placeholder="Search byAuthor"
              @input="onFilterChange()" v-model="getBooksFilter.author" />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <input type="text" class="form-control form-control-sm" placeholder="Search by ISBN" @input="onFilterChange()"
              v-model="getBooksFilter.isbn" />
          </div>
          <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <input type="text" class="form-control form-control-sm" placeholder="Search by Publisher"
              @input="onFilterChange()" v-model="getBooksFilter.publisher" />
          </div>
        </div>
      </div>

      <div class="row g-3" v-if="availableBooks.length > 0">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="book in availableBooks" :key="book.bookId">
          <div class="card h-100 shadow-sm">
            <div class="position-relative">
              <img 
                :src="book.imageUrl" 
                class="card-img-top object-fit-cover" 
                alt="Book" 
                @click="showBookDetails(book.bookId)" 
                style="height: 200px; cursor: pointer;" />
              <div class="position-absolute top-0 end-0 m-2" v-if="book.totalCopies > 0">
                <button class="btn btn-sm btn-primary" type="button" @click="borrowBook(book)">
                   Borrow
                </button>
              </div>
            </div>

            <div class="card-body" >
              <div class="position-absolute bottom-0 end-0 m-2">
                <i :class="book.isUserFavorite ? 'bi bi-heart-fill fs-5 text-danger' : 'bi bi-heart fs-5 text-muted'"
                  :id="'favoritesBtn' + book.bookId.toString()" title="Add to favorites" @click="toggleFavorites(book)"
                  style="cursor: pointer"></i>
              </div>
              <h6 class="card-title">{{ book.title }}</h6>
              <p class="card-text mb-1"><strong>Author:</strong> {{ book.author }}</p>
              <p class="card-text mb-1"><strong>Publisher:</strong> {{ book.publisher }}</p>
              <span class="badge bg-primary-subtle bg-opacity-10 text-primary-subtle">{{ book.category }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column align-items-center justify-content-center">
            <i class="bi bi-book  fs-1 text-primary-subtle mb-3"></i>
            <h5 class="card-title text-primary-subtle">No books found</h5>
            <p class="card-text text-muted">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        </div>
      </div>
      <!-- Pagination -->
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
          <button :disabled="getBooksFilter.pageNumber === totalPages" @click="changePage(getBooksFilter.pageNumber + 1)">
            <i class="bi bi-arrow-right fs-6"></i>
          </button>
        </div>
      </div>
      <BookModal 
        :show="showModal" 
        :book-id="selectedBook"
         @borrow="borrowBook"
         @favorite="toggleFavorites"
         @close="closeModal"
          />
    </div>
  </div>
</template>



<script setup>
import booksService from '@/services/booksService.js'
import userFavoritesService from '@/services/userFavoritesService.js'
import borrowBookService from '@/services/borrowBookService.js'
import BookModal from '@/components/modals/BookModal.vue'
import { useAuthStore } from "@/stores/authStore";
import { ref, onMounted, reactive } from 'vue'
import { BORROW_DUE_DATE } from '@/constants/constants'
import { useSwal } from '@/composables/swal'
const { showError, showBorrowed } = useSwal()
const availableBooks = reactive([])
const loading = ref(false)
const pickUpTime = 2 //hours
const dueDate = new Date()
const showFilters = ref(false);
const authStore = useAuthStore()
const showModal = ref(false)
const selectedBook = ref(null)
dueDate.setDate(dueDate.getDate() + BORROW_DUE_DATE)
const getBooksFilter = reactive({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  category: '',
  includeUserFavorites: true,
  getAvailableOnly: false,
  pageNumber: 1,
  pageSize: 8,
})

const totalPages = ref(1)
let debounceTimer = ref(null)
let userFavoriteBookRequest = {
  userId: authStore.currentUserId,
  bookId: null
}


const showBookDetails = (bookId) => {
  selectedBook.value = bookId
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
const fetchAvailableBooks = async () => {
  availableBooks.length = 0
  loading.value = true
  try {
    var result = await booksService.getBorrowableBooks(getBooksFilter)
    availableBooks.push(...result.data)
    totalPages.value = result.totalPages
  } catch (error) {
    console.log('Error fetch available books:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAvailableBooks)

const borrowBook = async (book) => {
  try {
    loading.value = true
    let request = {
      bookId: book.bookId,
      userId: authStore.currentUserId
    }
    const response = await borrowBookService.borrowBook(request)
    if (!response) {
      showError(response.message || 'Failed to borrow book.')
    }
    showBorrowed(`${book.title} is now reserved and will be ready to pick up in ${pickUpTime} hours \u{1F4D6}\u{1F60A} \nReturn by \n` + dueDate.toLocaleDateString())
    fetchAvailableBooks()

  } catch (error) {
    console.log('Error borrowing book:', error)
  } finally {
    loading.value = false
  }
}


const toggleFavorites = (book) => {
  if (book.isUserFavorite) {
    removeFromFavorites(book.bookId, selectedBook);
    book.isUserFavorite = false;
  } else {
    addToFavorites(book.bookId, selectedBook);
    book.isUserFavorite = true;
  }
}

const addToFavorites = (bookId) => {
  userFavoriteBookRequest.bookId = bookId
  if (userFavoritesService.addBookToUserFavorites(userFavoriteBookRequest)) {
     availableBooks.find(b => b.bookId === bookId).isUserFavorite = true
  }

}
const removeFromFavorites = (bookId, selectedBook) => {
  userFavoriteBookRequest.bookId = bookId
  if (userFavoritesService.removeBookFromUserFavorites(userFavoriteBookRequest)) {
    availableBooks.find(b => b.bookId === bookId).isUserFavorite = false
  }
}
function changePage(page) {
  getBooksFilter.pageNumber = page
  fetchAvailableBooks()
}

function onFilterChange() {
  getBooksFilter.pageNumber = 1
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    fetchAvailableBooks()
  }, 1500)
}

function resetFilters() {
  getBooksFilter.title = ''
  getBooksFilter.author = ''
  getBooksFilter.isbn = ''
  getBooksFilter.publisher = ''
  getBooksFilter.category = ''
  getBooksFilter.pageNumber = 1
  fetchAvailableBooks()
}


</script>

<style scoped>
.card-img-top {
  object-fit: cover;
}
</style>@/services/userFavoritesService.js