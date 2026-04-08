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

        <div class="grid container my-4">
            <!-- Borrowed Books -->
            <section class="card mb-3 p-3 border-3">
                <h4>Borrowed Books</h4>
                <table v-if="userOverview.borrowedBooks.length" class="table-responsive table-striped table-hover">
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
                            <td class="ps-3 mb-3">
                                <div class="d-flex align-items-center">
                                    <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2 p-2"
                                        style="width: 50px; height: 50px" />
                                    <div>
                                        <div class="fw-semibold small">{{ item.book.title }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ formatDate(item.borrowDate) }}</td>
                            <td :class="item.isOverdue ? 'text-danger' : ''">{{ item.isOverdue ? formatDate(item.dueDate) + ' ⚠' : formatDate(item.dueDate) }}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-2" v-if="!item.isOverdue && renewable(item)"
                                    @click="updateUserBook(BORROW_STATUS_BORROWED, item, true)">Renew</button>
                                <button class="btn btn-sm btn-outline-danger"
                                    @click="updateUserBook(BORROW_STATUS_RETURNED, item, false)">Return</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="text-muted justify-content-center align-items-center text-center">No borrowed books</p>
            </section>

            <!-- Reserved Books -->
            <section class="card mb-3 p-3 border-3">
                <h4>Reserved Books</h4>
                <table v-if="userOverview.reservedBooks.length" class="table-responsive table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Reserved Date</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in userOverview.reservedBooks" :key="item.book.id">
                            <td class="ps-3 mb-3">
                                <div class="d-flex align-items-center">
                                    <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2 p-2"
                                        style="width: 50px; height: 50px" />
                                    <div>
                                        <div class="fw-semibold small">{{ item.book.title }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ formatDate(item.borrowDate) }}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-danger me-2"
                                    @click="updateUserBook(BORROW_STATUS_AVAILABLE, item, false)">Remove</button>
                                <button class="btn btn-sm btn-outline-primary"
                                    @click="updateUserBook(BORROW_STATUS_BORROWED, item, false)">Pick Up</button>
                            </td>
                        </tr>
                    </tbody>

                </table>
                <p v-else class="text-muted justify-content-center align-items-center text-center">No reserved books</p>
            </section>

            <!-- Favorite Books -->
            <section class="card mb-3 p-3 border-3">
                <h4>Favorite Books</h4>
                <table v-if="userOverview.favoriteBooks.length" class="table-responsive table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in userOverview.favoriteBooks" :key="item.book.id">
                            <td class="ps-3 mb-3">
                                <div class="d-flex align-items-center">
                                    <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2 p-2"
                                        style="width: 50px; height: 50px" />
                                    <div>
                                        <div class="fw-semibold small">{{ item.book.title }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-danger me-2"
                                    @click="removeFromFavorites(item.book.bookId)">Remove</button>
                                <button class="btn btn-sm btn-outline-primary"
                                    @click="borrowFavoriteBook(BORROW_STATUS_RESERVED, item.bookId)"
                                    v-if="item.isBorrowable">Borrow</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="text-muted justify-content-center align-items-center text-center">No favorite books</p>
            </section>
        </div>
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
    BORROW_STATUS_RETURNED
} from '@/constants/constants'
import borrowBookService from '@/services/borrowBookService.js'
import userFavoritesService from '@/services/userFavoritesService.js'
import { useSwal } from '@/composables/swal'
import moment from 'moment';

const { showConfirm, showError, showSuccess, showConfirmBorrowStatus,showBorrowed } = useSwal();
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
const renewable = (borrow) =>{
      if (!borrow?.dueDate) return false;

    const diffDays = moment(borrow.dueDate).diff(moment(), 'days');

    return diffDays <= 3 && diffDays >= 0;
}
const updateUserBook = async (newStatus, borrow, renew = false) => {
    try {
        if (borrow.status != newStatus || renew) {
            updateUserBookRequest.borrowId = borrow.borrowId
            let successTxt = 'Book updated successfully!'
            if (borrow.isOverdue) {
                successTxt = 'Returned overdue book successfully! You will receive a notification if there are any fines to be paid.'
            }
            if (renew && !borrow.isOverdue) {
                successTxt = 'Book renewed successfully! New due date is in 7 days.'
                updateUserBookRequest.dueDate = new Date(new Date().setDate(new Date().getDate() + BORROW_RENEWAL_DAYS));
            }else{
                updateUserBookRequest.dueDate = borrow.dueDate
            }
            
            updateUserBookRequest.newBorrowStatus = newStatus


            const response = await borrowBookService.updateBorrowingStatus(updateUserBookRequest);
            if (!response) {
                showError(response.message || 'Failed to update user book.')
            } else {

                showBorrowed(successTxt)
                fetchMyBooks();
                updateUserBookRequest.borrowId = null
                updateUserBookRequest.dueDate = null
                updateUserBookRequest.newBorrowStatus = null
            }

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
        
            await borrowBookService.updateBorrowingStatus( updateUserBookRequest)
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


</script>