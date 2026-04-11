<template>
    <div class="container px-3" v-if="!authStore.isAdmin">
        <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
            <div class="spinner-grow text-primary-subtle" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div class="dashboard" v-else>

            <!-- APP TITLE / BRAND -->
            <section class="app-header">
                <div class="title-group d-flex flex-column">
                    <h1 class="app-title">BiblioTrack: </h1>
                    <p>From shelf to reader, made simple.</p>
                </div>
            </section>

            <!-- RIGHT: FEATURE CARD -->
            <section class="features d-flex gap-3 mb-5">

                <div v-for="card in featuredCards" :key="card.id" class="feature-card">
                    <span :class="card.icon"></span>
                    <h4>{{ card.title }}</h4>
                    <p>{{ card.description }}</p>
                </div>
            </section>
            <section class="hero flex-fill" v-if="stats.bookOfTheDay">
                <img :src="stats.bookOfTheDay.imageUrl" class="hero-cover"
                    @click="showBookDetails(stats.bookOfTheDay.bookId)" style="cursor:pointer;" />
                <div class="hero-info">
                    <span>Book of the Day <i class="bi bi-star-fill text-warning"></i></span>
                    <h1>{{ stats.bookOfTheDay.title }}</h1>
                    <p class="author">{{ stats.bookOfTheDay.author }}</p>
                    <p class="description">
                        {{ stats.bookOfTheDay.description }}
                    </p>
                </div>
            </section>


            <!-- TRENDING BOOKS (NETFLIX STYLE ROW) -->
            <section class="book-row mb-5" v-if="stats.trendingBooks.length > 0">
                <h3><i class="bi bi-fire"></i> Trending</h3>

                <div class="scroll-row">
                    <div v-for="book in stats.trendingBooks" :key="book.id" class="book-card">
                        <div class="card h-100 shadow-sm">
                            <div class="position-relative">
                                <img :src="book.imageUrl" class="object-fit-cover" alt="Book"
                                    @click="showBookDetails(book.bookId)" style="height: 200px; cursor: pointer;" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- RECENT BOOKS -->
            <section class="book-row">
                <h3><i class="bi bi-clock"></i> Recently Added</h3>

                <div class="scroll-row">
                    <div v-for="book in stats.newBooks" :key="book.id" class="book-card">
                        <div class="card h-100 shadow-sm">
                            <div class="position-relative">
                                <img :src="book.imageUrl" class=" object-fit-cover" alt="Book"
                                    @click="showBookDetails(book.bookId)" style="height: 200px; cursor: pointer;" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <!-- STATS -->
            <section class="stats">
                <div class="stat-card">
                    <h2>{{ stats.bookCount }}</h2>
                    <p>Books in Library</p>
                </div>

                <div class="stat-card">
                    <h2>{{ stats.borrowedBookCount }}</h2>
                    <p>Total Borrows</p>
                </div>

                <div class="stat-card">
                    <h2>{{ stats.favoriteBookCount }}</h2>
                    <p>Favorites Saved</p>
                </div>

                <div class="stat-card">
                    <h2>{{ stats.reservedBookCount }}</h2>
                    <p>Active Reservations</p>
                </div>
            </section>

            <BookModal :show="showModal" :book-id="selectedBook" @borrow="borrowBook" @favorite="toggleFavorites"
                @close="closeModal" />
        </div>
    </div>
    <div class="container px-3" v-else>
        <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
            <div class="spinner-grow text-primary-subtle" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div class="dashboard" v-else>


            <section class="app-header">
                <div class="title-group d-flex flex-column">
                    <h1 class="app-title">BiblioTrack: </h1>
                    <p>From shelf to reader, made simple.</p>
                </div>
            </section>


            <section class="features d-flex gap-3 mb-5">

                <div v-for="card in featuredCardsAdmin" :key="card.id" class="feature-card">
                    <div @click="router.push({ name: card.linkTo })" style="cursor:pointer;">
                        <span :class="card.icon"></span>
                        <h4>{{ card.title }}</h4>
                        <p>{{ card.description }}</p>
                    </div>
                </div>
            </section>

            <!-- STATS ADMIN -->
            <section class="stats">
                <div class="stat-card">
                    <h2>{{ stats.bookCount }}</h2>
                    <p>Books in Library</p>
                </div>

                <div class="stat-card">
                    <h2>{{ stats.borrowedBookCount }}</h2>
                    <p>Total Borrows</p>
                </div>

                <div class="stat-card">
                    <h2>{{ stats.favoriteBookCount }}</h2>
                    <p>Favorites Saved</p>
                </div>

                <div class="stat-card">
                    <h2>{{ stats.reservedBookCount }}</h2>
                    <p>Active Reservations</p>
                </div>
            </section>

            <BookModal :show="showModal" :book-id="selectedBook" @borrow="borrowBook" @favorite="toggleFavorites"
                @close="closeModal" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import dashboardService from '@/services/dashboardService.js'
import borrowBookService from '@/services/borrowBookService.js'
import userFavoritesService from '@/services/userFavoritesService.js'
import BookModal from '@/components/modals/BookModal.vue'
import { BORROW_DUE_DATE, READY_FOR_PICKUP_TIME } from '@/constants/constants'
import { useAuthStore } from "@/stores/authStore";
import { useSwal } from '@/composables/swal';
import { useRouter, useRoute } from 'vue-router';
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

const router = useRouter();
const route = useRoute();
const { showError, showBorrowed } = useSwal()
const authStore = useAuthStore();
const loading = ref();
const stats = reactive({
    bookCount: 0,
    borrowedBookCount: 0,
    favoriteBookCount: 0,
    reservedBookCount: 0,
    bookOfTheDay: null,
    trendingBooks: [],
    newBooks: []
})
const selectedBook = ref(null)
const showModal = ref(false)
const featuredCards = [
    {
        icon: 'bi bi-book bi-book-fill text-success',
        title: 'Borrow Books',
        description: 'Reserve books online and pick them up in 2 hours.'
    },
    {
        icon: 'bi bi-heart bi-heart-fill text-danger',
        title: 'Save Favorites',
        description: 'Create your personal reading list.'
    },
    {
        icon: 'bi bi-bookmark bi-bookmark-fill text-primary',
        title: 'Manage Books',
        description: 'Track borrowed books and returns.'
    },
    {
        icon: 'bi bi-clock bi-clock-fill text-warning',
        title: 'Quick Pickup',
        description: 'Reserve and collect books easily.'
    }
]
const featuredCardsAdmin = [
    {
        icon: 'bi bi-book bi-book-fill text-success',
        title: 'Manage Books',
        description: 'Add, delete or edit library books.',
        linkTo: APP_ROUTE_NAMES.BOOKS
    },
    {
        icon: 'bi bi-bookshelf bi-bookshelf-fill text-primary',
        title: 'Manage Book Stock',
        description: 'Add, delete or edit book copies.',
        linkTo: APP_ROUTE_NAMES.BOOK_STOCK
    },
    {
        icon: 'bi bi-person-vcard bi-person-vcard-fill text-danger',
        title: 'Manage User Books',
        description: 'Track user borrows, returns and favorites.',
        linkTo: APP_ROUTE_NAMES.USERS
    },
    {
        icon: 'bi bi-person bi-person-fill text-danger',
        title: 'Manage Users',
        description: 'Add, delete or edit library users',
        linkTo: APP_ROUTE_NAMES.USERS
    }
]
let userFavoriteBookRequest = {
    userId: authStore.currentUserId,
    bookId: null
}
const fetchDashboardData = async () => {
    try {
        loading.value = true
        await dashboardService.getDashboardData().then(data => {

            stats.bookCount = data.bookCount
            stats.borrowedBookCount = data.borrowedBookCount
            stats.favoriteBookCount = data.favoriteBookCount
            stats.reservedBookCount = data.reservedBookCount
            stats.bookOfTheDay = data.bookOfTheDay
            stats.trendingBooks = data.trendingBooks
            stats.newBooks = data.newBooks
        })

    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    } finally {
        loading.value = false
    }
}
onMounted(() => {
    fetchDashboardData()
})

const showBookDetails = (bookId) => {
    selectedBook.value = bookId
    showModal.value = true
}

const borrowBook = async (book) => {
    if (!authStore.isAuthenticated) {
        //route.push(APP_ROUTE_NAMES.SIGN_IN)
        router.push({
            path: APP_ROUTE_NAMES.SIGN_IN,
            query: { redirect: route.fullPath }
        })

        return
    }
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
        showBorrowed(`${book.title} is now reserved and will be ready to pick up in ${READY_FOR_PICKUP_TIME} hours \u{1F4D6}\u{1F60A} \nReturn by \n` + BORROW_DUE_DATE)

    } catch (error) {
        console.log('Error borrowing book:', error)
    } finally {
        loading.value = false
    }
}
const closeModal = () => {
    showModal.value = false
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
        stats.bookOfTheDay.isUserFavorite = true
        stats.trendingBooks.find(b => b.bookId === bookId).isUserFavorite = true
        stats.newBooks.find(b => b.bookId === bookId).isUserFavorite = true

    }

}
const removeFromFavorites = (bookId, selectedBook) => {
    userFavoriteBookRequest.bookId = bookId
    if (userFavoritesService.removeBookFromUserFavorites(userFavoriteBookRequest)) {
        stats.bookOfTheDay.isUserFavorite = false
        stats.trendingBooks.find(b => b.bookId === bookId).isUserFavorite = false
        stats.newBooks.find(b => b.bookId === bookId).isUserFavorite = false
    }
}
</script>

<style scoped>
.dashboard {
    padding: 40px;
    max-width: 1400px;
    margin: auto;
}

/* HERO */
.app-header {
    display: flex;
    align-items: center;
    justify-self: bottom;
    gap: 16px;
}

.hero {
    display: flex;
    gap: 40px;
    margin-bottom: 50px;
    align-items: center;
}

.hero-cover {
    max-width: 150px;
    max-height: 150px;
    border-radius: 8px;
}

.hero-info h1 {
    font-size: 32px;
    margin-bottom: 5px;
}

.hero-features {
    display: flex;
    gap: 40px;
    height: 300px;
    align-items: center;
}

.author {
    color: gray;
}

.description {
    margin: 15px 0;
    max-width: 500px;
}

.hero-buttons button {
    margin-right: 10px;
}

.features {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    max-height: 2000px;
    gap: 20px;
    margin-bottom: 50px;
    padding: 10px;
}

.feature-card {
    border: 1px solid #4f5051;
    border-style: double;
    padding: 20px;
    border-radius: 5px;
}

.feature-card span {
    font-size: 28px;
}

/* STATS */

.stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 50px;
}

.stat-card {
    background: transparent;
    padding: 25px;
    border: 1px solid #4f5051;
    border-radius: 10px;
    text-align: center;
}


.stat-card h2 {
    color: #dee5f9;
    text-shadow: 2px 2px 2px #0842987b;
    font-weight: bold;
    font-size: 30px;
}

/* BOOK ROWS */

.book-row {
    margin-bottom: 30px;
}

.scroll-row {
    display: flex;
    max-height: 400px;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 20px;
    padding-top: 10px;
}

.book-card {
    min-width: 140px;
    cursor: pointer;
}

.book-card img {
    width: 140px;
    border-radius: 6px;
}

.book-info {
    margin-top: 5px;
}

.title {
    font-weight: bold;
    font-size: 14px;
}

.author {
    font-size: 12px;
}
</style>