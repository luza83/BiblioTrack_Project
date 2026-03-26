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
                            <th>Due Date</th>
                            <th>Actions</th>
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
                            <td>{{ formatDate(item.book.dueDate) }}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-2">Renew</button>
                                <button class="btn btn-sm btn-outline-danger">Return</button>
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
                            <th>Actions</th>
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
                            <td>{{ formatDate(item.book.borrowDate) }}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger me-2">Remove</button>
                                <button class="btn btn-sm btn-outline-primary">Pick Up</button>
                            </td>
                        </tr>
                    </tbody>

                </table>
                <p v-else class="text-muted justify-content-center align-items-center text-center">No reserved books</p>
            </section>

            <!-- Overdue Books -->
            <section class="card overdue mb-3 p-3 border-3">
                <h4>Overdue Books</h4>
                <table v-if="userOverview.overdueBooks.length" class="table-responsive table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in userOverview.overdueBooks" :key="item.book.id">
                            <td class="ps-3 mb-3">
                                <div class="d-flex align-items-center">
                                    <img :src="item.book.imageUrl" alt="Book" class="rounded object-fit-cover me-2 p-2"
                                        style="width: 50px; height: 50px" />
                                    <div>
                                        <div class="fw-semibold small">{{ item.book.title }}</div>
                                    </div>
                                </div>
                            </td>
                            <td>{{ formatDate(item.book.dueDate) }}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary">Return</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else class="text-muted justify-content-center align-items-center text-center">No overdue books 🎉</p>
            </section>

            <!-- Favorite Books -->
            <section class="card mb-3 p-3 border-3">
                <h4>Favorite Books</h4>
                <table v-if="userOverview.favoriteBooks.length" class="table-responsive table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Actions</th>
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
                            <td>
                                <button class="btn btn-sm btn-outline-danger me-2">Remove</button>
                                <button class="btn btn-sm btn-outline-primary" v-if="item.isBorrowable">Borrow</button>
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
import moment from 'moment';

const loading = ref(true);

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
        console.log('Fetched user activity:', response);
        console.log('Fetched user overview:', userOverview);
    } catch (error) {
        console.error('Error fetching my books:', error);
        loading.value = false;
    } finally {
        loading.value = false;
    }
};
</script>