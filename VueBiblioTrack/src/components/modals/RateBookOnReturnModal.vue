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
                        <span>Rate this book</span>
                    </h5>
                    <button type="button" class="btn-close" aria-label="Close book details" @click="close"></button>
                </div>

                <div class="modal-body p-3 p-sm-4 overflow-auto">
                    <div class="row g-3 g-sm-4">
                        <div class="col-12 col-md-4">
                            <div class="position-relative justify-content-center d-flex align-items-top h-100">
                                <img :src="book.imageUrl" class="rounded-4 w-80 object-fit-cover"
                                    style="max-height: 200px; min-height: 100px" />

                            </div>
                        </div>
                        <div class="col-12 col-md-8">
                            <div class="d-flex flex-column gap-3 gap-sm-4">
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
                                    <Rating  @rate="onRateItem" :bookId="book.bookId" :rating="book.averageRating"   />
                                </div>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 px-3 px-sm-4 pb-3 pb-sm-4 sticky-bottom bg-body">
                    <button type="button" @click="close" class="btn btn-outline-secondary  px-3 px-sm-4 w-30 m-2">
                        Continue without rating
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Rating from '../shared/Rating.vue'
import { ref, watch, onMounted, reactive } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  book: {
    type: Object,
    required: true
  }
})
const book  = props.book.value;

const emit = defineEmits(['close', 'rate']);
const close = () => {
    emit('close')
}


const onRateItem = (bookId, rating) => {
  emit('rate', bookId, rating)
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