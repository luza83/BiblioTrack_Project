<template>
  <div class="container px-3">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary-subtle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="mb-4">
        <h2 class="h5 text-primary-subtle">Available Books</h2>
        <p class="mb-0 text-muted small">Borrow books from BiblioTrack</p>
      </div>

      <div class="row g-3">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="book in availableBooks"
          :key="book.bookCopyId"
        >
          <div class="card h-100 shadow-sm">
            <div class="position-relative">
              <img
                :src="book.imageUrl"
                class="card-img-top object-fit-cover"
                alt="Book"
                style="height: 200px;"
              />
              <div class="position-absolute top-0 end-0 m-2">
                <button
                  class="btn btn-sm btn-light rounded-circle"
                  type="button"
                  @click="borrowBook(book)"><i class="bi bi-plus fs-6" title="Borrow Book"></i>
                </button>
              </div>          
            </div>

            <div class="card-body">
              <div class="position-absolute bottom-0 end-0 m-2">
                  <i
                    class="bi bi-heart fs-5"
                    :id="'favoritesBtn' + book.bookId.toString()"
                    title="Add to favorites"
                    @click="toggleFavorites(book)"
                    style="cursor: pointer"
                  ></i>
              </div>
              <h6 class="card-title">{{ book.title }}</h6>
              <p class="card-text mb-1"><strong>Author:</strong> {{ book.author }}</p>
              <p class="card-text mb-1"><strong>Publisher:</strong> {{ book.publisher }}</p>
              <span class="badge bg-primary-subtle bg-opacity-10 text-primary-subtle">{{ book.category }}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>



<script setup>
import bookCopyService from '@/services/bookCopyService.js'
import borrowBookService from '@/services/borrowBookService.js'
import { ref, onMounted, reactive } from 'vue'
import { BORROW_DUE_DATE } from '@/constants/constants'
import { useSwal } from '@/composables/swal'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
const { showConfirm, showError, showSuccess, showBorrowed } = useSwal()
const authStore = useAuthStore();
const availableBooks = reactive([])
const favorites = reactive([])
const loading = ref(false)
const router = useRouter()
const pickUpTime = 2 //hours
const dueDate = new Date()
dueDate.setDate(dueDate.getDate() + BORROW_DUE_DATE)
const newBorrow = reactive({
  BookId: "",
  UserId: "",
})
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

const borrowBook = async (book) => {
  try {
    
    newBorrow.BookId = Number(book.bookId);
    newBorrow.UserId = String(authStore.currentUserId);
    const response = await borrowBookService.borrowBook(newBorrow)
    console.log(response)
    if (!response) {
        showError(response.message || 'Failed to borrow book.')
    }
    showBorrowed(`Book will be ready to pick up in ${pickUpTime} hours \u{1F4D6}\u{1F60A} \nReturn by \n` + dueDate.toLocaleDateString())
    fetchAvailableBooks()

  } catch (error) {
    console.log('Error borrowing book:', error)
  } finally {
    loading.value = false
  }
}

const toggleFavorites = (book) => {

  const favoritesBtn = document.getElementById('favoritesBtn' + book.bookId.toString());
  if (favoritesBtn.classList.contains('text-danger')) {
    favoritesBtn.classList.remove('text-danger');
    removeFromFavorites(book);
  } else {
    favoritesBtn.classList.add('text-danger');
    addToFavorites(book);
  }
}

const addToFavorites = (book) => {
 
}
const removeFromFavorites = (book) => {

}
</script>

<style scoped>
.card-img-top {
  object-fit: cover;
}
</style>