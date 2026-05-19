<template>
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
        <div class="spinner-grow text-primary-subtle" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else class="user-books">
        <header class="header">
            <h1>{{ userOverview.userName }}</h1>
        </header>

        <div class="container-fluid px-3">
            <!-- Borrowed Books -->
            <section class="card mb-4 p-3 border-3">
                <h4 class="mb-3">Borrowed Books</h4>
                <div v-if="userOverview.borrowedBooks.length" class="table-responsive">
                    <table class="table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in userOverview.borrowedBooks" :key="item.book.id">
                                <td class="ps-3">
                                    <div class="d-flex align-items-center">
                                        <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2"
                                            style="width: 40px; height: 40px;" />
                                        <div>
                                            <div class="fw-semibold small">{{ item.book.title }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="small">{{ formatDate(item.borrowDate) }}</td>
                                <td class="small" :class="item.isOverdue ? 'text-danger' : ''">{{ item.isOverdue ?
                                    formatDate(item.dueDate) + ' ⚠' : formatDate(item.dueDate) }}</td>
                                <td class="text-end">
                                    <div class="d-flex flex-column flex-sm-row gap-1 gap-sm-2 justify-content-end">
                                        <button class="btn btn-sm btn-outline-primary"
                                            v-if="!item.isOverdue && renewable(item)"
                                            @click="updateUserBook(BORROW_STATUS_BORROWED, item, true)">Renew</button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="updateUserBook(BORROW_STATUS_RETURNED, item, false)">Return</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else class="text-muted text-center py-3 mb-0">No borrowed books</p>
            </section>

            <!-- Reserved Books -->
            <section class="card mb-4 p-3 border-3">
                <h4 class="mb-3">Reserved Books</h4>
                <div v-if="userOverview.reservedBooks.length" class="table-responsive">
                    <table class="table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Reserved Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in userOverview.reservedBooks" :key="item.book.id">
                                <td class="ps-3">
                                    <div class="d-flex align-items-center">
                                        <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2"
                                            style="width: 40px; height: 40px;" />
                                        <div>
                                            <div class="fw-semibold small">{{ item.book.title }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="small">{{ formatDate(item.borrowDate) }}</td>
                                <td class="text-end">
                                    <div class="d-flex flex-column flex-sm-row gap-1 gap-sm-2 justify-content-end">
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="updateUserBook(BORROW_STATUS_AVAILABLE, item, false)">Remove</button>
                                        <button class="btn btn-sm btn-outline-primary"
                                            @click="updateUserBook(BORROW_STATUS_BORROWED, item, false)">Pick Up</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
                <p v-else class="text-muted text-center py-3 mb-0">No reserved books</p>
            </section>

            <!-- Favorite Books -->
            <section class="card mb-4 p-3 border-3">
                <h4 class="mb-3">Favorite Books</h4>
                <div v-if="userOverview.favoriteBooks.length" class="table-responsive">
                    <table class="table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in userOverview.favoriteBooks" :key="item.book.id">
                                <td class="ps-3">
                                    <div class="d-flex align-items-center">
                                        <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2"
                                            style="width: 40px; height: 40px;" />
                                        <div>
                                            <div class="fw-semibold small">{{ item.book.title }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-end">
                                    <div class="d-flex flex-column flex-sm-row gap-1 gap-sm-2 justify-content-end">
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="removeFromFavorites(item.book.bookId)">Remove</button>
                                        <button class="btn btn-sm btn-outline-primary"
                                            @click="borrowFavoriteBook(BORROW_STATUS_RESERVED, item.bookId)"
                                            v-if="item.isBorrowable">Borrow</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else class="text-muted text-center py-3 mb-0">No favorite books</p>
            </section>
        </div>
        <RateBookOnReturnModal :show="showRateModal" :book="selectedBorrowedBook" @close="closeModal" @rate="rateBook" />
    </div>
</template>
<script setup>
import usersActivityService from '@/services/usersActivityService.js'
import { onMounted, reactive, ref } from 'vue'
import {
    BORROW_STATUS,
    BORROW_STATUS_AVAILABLE,
    BORROW_STATUS_BORROWED,
    BORROW_STATUS_RESERVED,
    BORROW_STATUS_OVERDUE,
    BORROW_STATUS_RETURNED,
    MINIMUM_DAYS_FOR_RENEW
} from '@/constants/constants'
import RateBookOnReturnModal from '@/components/modals/RateBookOnReturnModal.vue'
import borrowBookService from '@/services/borrowBookService.js'
import bookService from '@/services/booksService.js'
import userFavoritesService from '@/services/userFavoritesService.js'
import { useSwal } from '@/composables/swal'
import moment from 'moment';
import { useAuthStore } from '@/stores/authStore.js'
const authStore = useAuthStore()

const { showConfirm, showError, showSuccess, showConfirmBorrowStatus, showBorrowed } = useSwal();
const loading = ref(true);
const updateUserBookRequest = reactive({
    borrowId: null,
    dueDate: null,
    newBorrowStatus: null
})
const userOverview = reactive({
    userId: '',
    userName: '',
    borrowedBooks: [],
    reservedBooks: [],
    overdueBooks: [],
    favoriteBooks: []
});
const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY');
}
onMounted(() => {
    fetchMyBooks();
});
const selectedBorrowedBook = reactive({});
const showRateModal = ref(false);

const fetchMyBooks = async () => {
    try {
        loading.value = true;
        const response = await usersActivityService.getCurrentUserActivity();
        Object.assign(userOverview, response);

    } catch (error) {
        console.error('Error fetching my books:', error);
        loading.value = false;
    } finally {
        loading.value = false;
    }
};
const renewable = (borrow) => {
    if (!borrow?.dueDate) return false;

    const diffDays = moment(borrow.dueDate).diff(moment(), 'days');

    return diffDays <= MINIMUM_DAYS_FOR_RENEW && diffDays >= 0;
}
const updateUserBook = async (newStatus, borrow, renew = false) => {
    selectedBorrowedBook.value = borrow.book
    try {
        if (borrow.status != newStatus || renew) {
            updateUserBookRequest.borrowId = borrow.borrowId
            let successTxt = 'Book status updated successfully!'
            if (borrow.isOverdue) {
                successTxt = 'Returned overdue book successfully! You will receive a notification if there are any fines to be paid.'
            }
            if (renew && !borrow.isOverdue) {
                successTxt = 'Book renewed successfully! New due date is in 7 days.'
                updateUserBookRequest.dueDate = new Date(new Date().setDate(new Date().getDate() + BORROW_RENEWAL_DAYS));
            } else {
                updateUserBookRequest.dueDate = borrow.dueDate
            }

            updateUserBookRequest.newBorrowStatus = newStatus

            const response = await borrowBookService.updateBorrowingStatus(updateUserBookRequest);
            if (!response) {
                showError(response.message || 'Failed to update user book.')
            }
            updateUserBookRequest.borrowId = null
            updateUserBookRequest.dueDate = null
            updateUserBookRequest.newBorrowStatus = null
            if(borrow.status === BORROW_STATUS_BORROWED && newStatus === BORROW_STATUS_RETURNED){
                 showRateModal.value = true;
                 successTxt = 'Book returned successfully! Please consider rating this book.'
            }
            showBorrowed(successTxt)
            fetchMyBooks();
            
        }
    }
    catch (error) {
        console.error('Error updating book:', error)
        throw error
    }

}

const borrowFavoriteBook = async (borrowStatus, bookId) => {
    try {
        loading.value = true
        let request = {
            bookId: bookId,
            userId: userOverview.userId
        }
        const response = await borrowBookService.borrowBook(request, true)
        if (!response) {
            showError(response.message || 'Failed to borrow book.')
        }
        let dueDate = moment(response.dueDate).format('MMMM Do YYYY')
        await showConfirmBorrowStatus(dueDate, async () => {
            updateUserBookRequest.borrowId = response.borrowId
            updateUserBookRequest.dueDate = response.dueDate
            updateUserBookRequest.newBorrowStatus = BORROW_STATUS_BORROWED

            await borrowBookService.updateBorrowingStatus(updateUserBookRequest)
        })
        fetchMyBooks()
        updateUserBookRequest.borrowId = null
        updateUserBookRequest.dueDate = null
        updateUserBookRequest.newBorrowStatus = null
    } catch (error) {
        console.log('Error borrowing book:', error)
    } finally {
        loading.value = false
    }
}

const removeFromFavorites = (bookId) => {
    let request = {
        userId: userOverview.userId,
        bookId: bookId
    }
    if (userFavoritesService.removeBookFromUserFavorites(request)) {
        fetchMyBooks()
    }
}

const closeModal = () => {
    showRateModal.value = false
}
const rateBook = async (bookId, rating) => {
    let request = {
        userId: authStore.currentUserId,
        bookId: bookId,
        rating: rating
    }
    try {
        await bookService.rateBook(request)
        showSuccess('Thank you for rating this book!')
        showRateModal.value = false
    } catch (error) {
        console.error('Error rating book:', error)
        showError('Failed to submit your rating. Please try again later.')
    }
}

</script>

<style scoped>
.user-books {
    padding: 20px;
}

.header {
    margin-bottom: 30px;
    text-align: center;
}

@media (max-width: 767px) {
    .user-books {
        padding: 15px;
    }

    .header {
        margin-bottom: 20px;
    }

    .header h1 {
        font-size: 1.5rem;
    }

    .card {
        margin-bottom: 20px !important;
        padding: 15px !important;
    }

    .table-responsive {
        font-size: 0.875rem;
    }

    .table td {
        padding: 0.5rem 0.25rem;
    }

    .table th {
        padding: 0.5rem 0.25rem;
    }
}
</style>