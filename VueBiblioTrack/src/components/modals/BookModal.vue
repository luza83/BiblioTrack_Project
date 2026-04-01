<template>
    <div v-if="show"
        class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
        style="z-index: 1050">
        <div class="modal-dialog modal-dialog-centered m-0 modal-size d-flex flex-column rounded-4"
            style="pointer-events: auto">
            <div class="modal-content rounded-4 border-0 rounded-0 rounded-md-4 bg-body h-100 d-flex flex-column">
                <!-- Header -->
                <div
                    class="modal-header w-100 d-flex justify-content-between border-0 bg-primary-subtle bg-opacity-10 px-3 px-sm-4 py-3 rounded-top-0 rounded-md-top-4 sticky-top">
                    <h5 class="modal-title d-flex align-items-center gap-2 mb-0 fs-5 fs-sm-4">
                        <i class="bi bi-card-heading"></i>
                        <span>Book Details</span>
                    </h5>
                    <button type="button" class="btn-close" aria-label="Close book details" @click="close"></button>
                </div>

                <!-- Body - Scrollable Content -->
                <div class="modal-body p-3 p-sm-4 overflow-auto">
                    <div class="row g-3 g-sm-4">
                        <!-- Image Column -->
                        <div class="col-12 col-md-4">
                            <div class="position-relative justify-content-center d-flex align-items-center h-100">
                                <img :src="book.imageUrl" class="rounded-4 w-80 object-fit-cover"
                                    style="max-height: 200px; min-height: 100px" />

                            </div>
                        </div>

                        <!-- Details Column -->
                        <div class="col-12 col-md-8">
                            <div class="d-flex flex-column gap-3 gap-sm-4">
                                <!-- Title -->
                                <div>
                                    <div class="text-secondary small mb-1">
                                        <i class="bi bi-card-text"></i>
                                        Title
                                    </div>
                                    <h4 class="fw-bold mb-0 fs-5 fs-sm-4">{{ book.title }}</h4>
                                    <div class="text-secondary small">
                                        <i class="bi bi-journal-text"></i>
                                        Category: {{ book.category }}
                                    </div>
                                </div>
                                <div v-if="book">
                                    <Rating :rating="book.averageRating" :bookId="book.bookId" :readonly="true" />
                                    <span class="text-secondary small">{{ '(' + book.ratingsCount + ')' }}</span>
                                </div>
                                <!-- Author -->
                                <div>
                                    <div class="text-secondary small mb-1">
                                        <i class="bi bi-person-bounding-box"></i>
                                        Author
                                    </div>
                                    <div
                                        class="badge bg-primary-subtle bg-opacity-10 text-primary rounded-pill px-2 px-sm-3 py-1 py-sm-2 fs-6 fs-sm-5">
                                        {{ book.author }}
                                    </div>
                                </div>

                                <!-- Description -->
                                <div>
                                    <div class="text-secondary small mb-1">
                                        <i class="bi bi-card-text"></i>
                                        Description
                                    </div>
                                    <p class="mb-0">{{ book.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-footer border-0 px-3 px-sm-4 pb-3 pb-sm-4 sticky-bottom bg-body">
                    <button type="button" v-if="book.totalCopies > 0" @click="borrow" class="btn btn-primary  px-3 px-sm-4 w-30 mr-2">
                        Borrow
                    </button>
                    <div @click="favorite" class="px-3 px-sm-4 w-30 mr-2">
                        <i :class="book.isUserFavorite ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'" class="me-2"></i>
                        {{ book.isUserFavorite ? 'Unfavorite' : 'Add to Favorites' }}
                    </div>
                    <button type="button" @click="close" class="btn btn-outline-secondary  px-3 px-sm-4 w-30 mr-2">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Rating from '../shared/Rating.vue'
import { ref, watch, onMounted, reactive } from 'vue'
import booksService from '@/services/booksService.js'
const props = defineProps({
    show: Boolean,
    bookId: Number,
})
const book = reactive({})
const fetchBook = async (bookId) => {
    try {
        const response = await booksService.getBorrowableBookById(bookId)
        if (!response) {
            throw new Error('Failed to fetch book details')
        }
        Object.assign(book, response)
    } catch (error) {
        console.error('Error fetching book details:', error)
    }
}


watch(
    () => props.bookId,
    async (newId) => {
        if (!newId) return

        fetchBook(newId)
    },
    { immediate: true } // also runs first time
)

const emit = defineEmits(['close', 'borrow', 'favorite'])

const close = () => {
    emit('close')
}
const borrow = () => {
    emit('borrow', book)
}
const favorite = () => {
    emit('favorite', book)
}

</script>

<style scoped>
@media (max-width: 576px) {
    .modal-size {
        width: 95%;
        height: 95%;
    }
}

@media (min-width: 577px) {
    .modal-size {
        width: 60%;
        height: 65%;
    }
}
</style>