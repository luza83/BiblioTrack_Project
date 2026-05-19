<template>
    <div class="container-fluid ">
        <div v-if="loading" class="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <div class="mb-3">
                <div class="book-loader"></div>
            </div>
            <div>
                <h5>{{ loadingMessage }}</h5>
            </div>
        </div>
        <div class="dashboard" v-else>
            <section class="app-header">
                <div class="title-group d-flex flex-column">
                    <h1 class="app-title">BiblioTrack: </h1>
                    <p>From shelf to reader, made simple.</p>
                </div>
            </section>
            <section class="features" v-if="!authStore.isAdmin">
                <div v-for="card in featuredCards" :key="card.title" class="col-12 col-sm-6 col-lg-4">
                    <div class="feature-card">
                        <div class="glow-blob"
                            :style="{ background: `radial-gradient(circle at 30% 30%, ${card.color}33 0%, transparent 50%)` }">
                            <div class="card-body-inner">
                                <h4>
                                    <span :class="card.icon" :style="{ color: card.color }"></span>
                                    &nbsp;{{ card.title }}
                                </h4>
                                <p>{{ card.description }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <section class="features" v-else>
                <div v-for="card in featuredCardsAdmin" :key="card.title" class="col-12 col-sm-6 col-lg-4">
                    <div class="feature-card" @click="router.push({ name: card.linkTo })" style="cursor:pointer;">
                        <div class="glow-blob"
                            :style="{ background: `radial-gradient(circle at 30% 30%, ${card.color}33 0%, transparent 50%)` }">
                            <div class="card-body-inner">
                                <h4>
                                    <span :class="card.icon" :style="{ color: card.color }"></span>
                                    &nbsp;{{ card.title }}
                                </h4>
                                <p>{{ card.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="hero flex" v-if="!authStore.isAdmin && stats.bookOfTheDay">
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
            <section class="book-row mb-5" v-if="!authStore.isAdmin && stats.trendingBooks.length > 0">
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
            <section class="book-row" v-if="!authStore.isAdmin">
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
            <section class="row g-3 my-3">
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card h-100 border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center gap-3 p-4">
                            <div class="stat-icon-wrap bg-primary bg-opacity-10 text-primary rounded-3 p-3">
                                <i class="bi bi-journal-bookmark-fill fs-3"></i>
                            </div>
                            <div>
                                <div class="stat-value fw-bold fs-2 lh-1 mb-1">{{ stats.bookCount }}</div>
                                <div class="stat-label text-muted small text-uppercase fw-semibold ls-1">Library Collection
                                </div>
                            </div>
                        </div>
                        <div class="stat-accent bg-primary"></div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card h-100 border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center gap-3 p-4">
                            <div class="stat-icon-wrap bg-success bg-opacity-10 text-success rounded-3 p-3">
                                <i class="bi bi-arrow-left-right fs-3"></i>
                            </div>
                            <div>
                                <div class="stat-value fw-bold fs-2 lh-1 mb-1">{{ stats.borrowedBookCount }}</div>
                                <div class="stat-label text-muted small text-uppercase fw-semibold">Books Borrowed</div>
                            </div>
                        </div>
                        <div class="stat-accent bg-success"></div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card h-100 border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center gap-3 p-4">
                            <div class="stat-icon-wrap bg-danger bg-opacity-10 text-danger rounded-3 p-3">
                                <i class="bi bi-heart-fill fs-3"></i>
                            </div>
                            <div>
                                <div class="stat-value fw-bold fs-2 lh-1 mb-1">{{ stats.favoriteBookCount }}</div>
                                <div class="stat-label text-muted small text-uppercase fw-semibold">Reader Favorites</div>
                            </div>
                        </div>
                        <div class="stat-accent bg-danger"></div>
                    </div>
                </div>

                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="card stat-card h-100 border-0 shadow-sm">
                        <div class="card-body d-flex align-items-center gap-3 p-4">
                            <div class="stat-icon-wrap bg-warning bg-opacity-10 text-warning rounded-3 p-3">
                                <i class="bi bi-bookmark-check-fill fs-3"></i>
                            </div>
                            <div>
                                <div class="stat-value fw-bold fs-2 lh-1 mb-1">{{ stats.reservedBookCount }}</div>
                                <div class="stat-label text-muted small text-uppercase fw-semibold">Book Reservations
                                </div>
                            </div>
                        </div>
                        <div class="stat-accent bg-warning"></div>
                    </div>
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
const loadingMessage = ref("LibraTrack Waking Up...");
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
        icon: 'bi bi-book bi-book-fill',
        title: 'Borrow Books',
        description: 'Reserve books online and pick them up in 2 hours.',
        color: '#eab308'
    },
    {
        icon: 'bi bi-heart bi-heart-fill',
        title: 'Save Favorites',
        description: 'Create your personal reading list.',
        color: '#f97316'
    },
    {
        icon: 'bi bi-bookmark bi-bookmark-fill',
        title: 'Manage Books',
        description: 'Track borrowed books and returns.',
        color: '#22c55e'
    },
    {
        icon: 'bi bi-clock bi-clock-fill',
        title: 'Quick Pickup',
        description: 'Reserve and collect books easily.',
        color: '#a855f7'
    }
]
const featuredCardsAdmin = [
    {
        icon: 'bi bi-book bi-book-fill',
        title: 'Manage Books',
        description: 'Add, delete or edit library books.',
        color: '#eab308',
        linkTo: APP_ROUTE_NAMES.BOOKS
    },
    {
        icon: 'bi bi-bookshelf bi-bookshelf-fill',
        title: 'Manage Book Stock',
        description: 'Add, delete or edit book copies.',
        color: '#f97316',
        linkTo: APP_ROUTE_NAMES.BOOK_STOCK
    },
    {
        icon: 'bi bi-person-vcard bi-person-vcard-fill',
        title: 'Manage User Books',
        description: 'Track user borrows, returns and favorites.',
        color: '#22c55e',
        linkTo: APP_ROUTE_NAMES.USERS
    },
    {
        icon: 'bi bi-person bi-person-fill',
        title: 'Manage Users',
        description: 'Add, delete or edit library users',
        color: '#a855f7',
        linkTo: APP_ROUTE_NAMES.USERS
    }
]
let userFavoriteBookRequest = {
    userId: authStore.currentUserId,
    bookId: null
}

const fetchDashboardData = async (retryCount = 0) => {
    const messageTimeouts = messages.map(message =>
        setTimeout(() => {
            loadingMessage.value = message.text;
        }, message.time)
    );
    try {

        loading.value = true;
        const data = await dashboardService.getDashboardData();

        stats.bookCount = data.bookCount;
        stats.borrowedBookCount = data.borrowedBookCount;
        stats.favoriteBookCount = data.favoriteBookCount;
        stats.reservedBookCount = data.reservedBookCount;
        stats.bookOfTheDay = data.bookOfTheDay;
        stats.trendingBooks = data.trendingBooks;
        stats.newBooks = data.newBooks;
    } catch (error) {
        errorMessage.value =
            "The server is waking up. Please try again in a few seconds.";
    } finally {
        messageTimeouts.forEach(clearTimeout);
        loading.value = false;
    }

};
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

const messages = [
    { time: 0, text: "Opening the library..." },
    { time: 2000, text: "Organizing the shelves..." },
    { time: 4000, text: "Gathering books..." },
    { time: 6000, text: "Almost ready..." }
];

</script>

<style scoped>
.dashboard {
    padding: 40px;
    max-width: 1400px;
    margin: auto;
    align-items: center;
    justify-content: center;
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
    gap: 10px;
    margin-bottom: 20px;
}

.feature-card {
    position: relative;
    overflow: hidden;
    border-radius: 2%;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    transition: background 0.2s ease;
    min-height: 180px;
    min-width: 280px;

}

.glow-blob {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: 1rem;
    align-items: center;
    justify-content: center;
    padding: 10%;
}

.icon-wrap {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    flex-shrink: 0;
    font-size: large;
}

.card-body-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
}

.stat-icon-wrap {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
}

.stat-value {
    font-variant-numeric: tabular-nums;
}

.stat-label {
    letter-spacing: 0.04em;
}

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

.book-loader {
    width: 40px;
    height: 40px;
    border: 4px solid #ccc;
    border-top: 4px solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 991px) {
    .dashboard {
        padding: 24px;
    }

    .features,
    .stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .hero {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
    }

    .hero-cover {
        width: 50%;
        max-width: 50%;
        height: auto;
    }

    .hero-info h1 {
        font-size: 28px;
    }

    .description {
        max-width: 100%;
    }
}

@media (max-width: 767px) {
    .dashboard {
        padding: 16px;
    }

    .features,
    .stats {
        grid-template-columns: 1fr;
    }

    .feature-card,
    .stat-card {
        padding: 18px;
        min-height: 150px;
    }

    .card-title {
        font-size: 0.9rem;
    }

    .card-desc {
        font-size: 0.75rem;
    }

    .scroll-row {
        gap: 12px;
        padding-top: 8px;
    }

    .book-card {
        min-width: 120px;
    }

    .hero-info h1 {
        font-size: 24px;
    }
}
</style>