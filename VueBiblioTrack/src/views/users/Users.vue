<template>
  <div class="container px-3">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary-subtle" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div>
        <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3">
          <div>
            <h2 class="h5 text-primary-subtle">Users</h2>
            <p class="mb-0 text-muted small">Manage users in BiblioTrack</p>
          </div>
        </div>
        <div class="card-body p-3">

          <div class="mb-3">
            <div class="row g-3">
              <h2>Search User</h2>
            </div>
            <div class="row g-3">
              <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <input type="text" class="form-control form-control-sm" placeholder="Search by User Name"
                  v-model="getUsersActivityFilter.userName" />
              </div>
              <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <input type="text" class="form-control form-control-sm" placeholder="Search by Email"
                  v-model="getUsersActivityFilter.email" />
              </div>
              <div>
                <button class="btn btn-primary btn-sm me-2 mb-4" @click="fetchUsers">
                  🔍 Search
                </button>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table v-if="users.length > 0" class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-3 small text-muted">Name</th>
                  <th class="small text-muted no-cursor"
                    :class="selectedBookList == 'reserved' ? 'bg-primary-subtle bg-opacity-10 text-primary-subtle' : ''">
                    Reserved Books</th>
                  <th class="small text-muted no-cursor"
                    :class="selectedBookList == 'borrowed' ? 'bg-primary-subtle bg-opacity-10 text-primary-subtle' : ''">
                    Borrowed Books</th>
                  <th class="small text-muted no-cursor"
                    :class="selectedBookList == 'favorite' ? 'bg-primary-subtle bg-opacity-10 text-primary-subtle' : ''">
                    Favorites</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="user in users" :key="user.userId">
                  <tr @click="toggleUser(user.userId)" :class="{ 'table-active': selectedUserId === user.userId }">
                    <td>
                      <span class="badge bg-primary-subtle bg-opacity-10 text-primary-subtle small">
                        {{ user.userName }}
                      </span>
                    </td>
                    <td class="fw-semibold small"
                      :class="selectedBookList == 'reserved' ? 'bg-primary-subtle bg-opacity-10 text-primary-subtle' : ''"
                      @click.stop="displayDetails(user.userId, 'reserved', user.reservedBooks)" style="cursor: pointer;">
                      {{ user.reservedBooks.length }}
                    </td>

                    <td class="fw-semibold small"
                      :class="selectedBookList == 'borrowed' ? 'bg-primary-subtle bg-opacity-10 text-primary-subtle' : ''"
                      @click.stop="displayDetails(user.userId, 'borrowed', user.borrowedBooks)" style="cursor: pointer;">
                      {{ user.borrowedBooks.length }}
                    </td>

                    <td class="fw-semibold small"
                      :class="selectedBookList == 'favorite' ? 'bg-primary-subtle bg-opacity-10 text-primary-subtle' : ''"
                      @click.stop="displayDetails(user.userId, 'favorite', user.favoriteBooks)" style="cursor: pointer;">
                      {{ user.favoriteBooks.length }}
                    </td>
                  </tr>
                  <tr v-if="expandedUserId === user.userId" class="table-borderless table-active">
                    <td colspan="4">
                      <table class="table table-sm  mb-0">
                        <thead>
                          <tr>
                            <th class="small text-muted">Title</th>
                            <th class="small text-muted">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in currentDetails" :key="item.id">
                            <td>{{ item.book.title }}</td>
                            <td>
                              <div v-if="selectedBookList == 'reserved'" class="text-start">
                                <button class="btn btn-sm btn-danger me-2"
                                  @click.stop="updateUserBook(BORROW_STATUS_AVAILABLE, item)">
                                  Remove from reserved
                                </button>
                                <button class="btn btn-sm btn-danger me-2" @click.stop="addToFavorites(item.book.bookId)">
                                  Add to favorites
                                </button>
                                <button class="btn btn-sm btn-success"
                                  @click.stop="updateUserBook(BORROW_STATUS_BORROWED, item)">
                                  Pick Up
                                </button>
                              </div>
                              <div v-else-if="selectedBookList == 'borrowed'" class="text-start">
                                <button class="btn btn-sm btn-warning"
                                  @click.stop="updateUserBook(BORROW_STATUS_AVAILABLE, item)">
                                  Return
                                </button>
                              </div>
                              <div v-else class="text-start">
                                <button class="btn btn-sm btn-danger me-2" @click.stop="removeFromFavorites(item.bookId)">
                                  Remove from favorites
                                </button>
                                <button v-if="item.isBorrowable" class="btn btn-sm btn-success" @click.stop="borrowFavoriteBook(BORROW_STATUS_BORROWED, item.bookId)">
                                  Borrow
                                </button>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import usersActivityService from '@/services/usersActivityService.js'
import { ref, onMounted, reactive } from 'vue'
import { BORROW_STATUS, BORROW_STATUS_AVAILABLE, BORROW_STATUS_BORROWED, BORROW_STATUS_RESERVED, BORROW_STATUS_OVERDUE } from '@/constants/constants'
import borrowBookService from '@/services/borrowBookService.js'
import userFavoritesService from '@/services/userFavoritesService.js'
import { useSwal } from '@/composables/swal'
import { useRouter } from 'vue-router'
import moment from 'moment'

const { showConfirm, showError, showSuccess, showConfirmBorrowStatus } = useSwal();
const books = reactive([]);
const loading = ref(false);
const router = useRouter();
const users = reactive([]);
const selectedUserId = ref(null);
const expandedUserId = ref(null)
const currentDetails = ref([])
const selectedBookList = ref(null)
const updateUserBookRequest = reactive({
  borrowId: null,
  dueDate: null,
  oldBorrowStatus: null,
  newBorrowStatus: null
})

const borrowStatuses = [BORROW_STATUS_AVAILABLE, BORROW_STATUS_BORROWED, BORROW_STATUS_RESERVED, BORROW_STATUS_OVERDUE]
const getUsersActivityFilter = reactive({
  userName: '',
  email: '',
  pageNumber: 1,
  pageSize: 5,
})
const fetchUsers = async () => {
  users.length = 0
  loading.value = true
  try {
    var result = await usersActivityService.getUsersActivity(getUsersActivityFilter)
    users.push(...result.data)
  } catch (error) {
    console.log('Error fetch users activity:', error)
  } finally {
    loading.value = false
  }
}
function toggleUser(userId) {
  if (selectedUserId.value === userId) {
    selectedUserId.value = null;
  } else {
    selectedUserId.value = userId;
  }
}
function displayDetails(userId, listType, objList) {
  if (expandedUserId.value === userId && selectedBookList.value === listType) {
    // collapse if clicking same list again
    expandedUserId.value = null
    currentDetails.value = []
    selectedBookList.value = null
    return
  }

  expandedUserId.value = userId
  selectedBookList.value = listType
  currentDetails.value = objList
}
const updateUserBook = async (newStatus, borrow) => {
  try {
    if (borrow.status != newStatus) {
      updateUserBookRequest.borrowId = borrow.borrowId
      updateUserBookRequest.dueDate = borrow.dueDate != updateUserBookRequest.dueDate ? new Date(new Date().setDate(new Date().getDate() + 14)) : null
      updateUserBookRequest.newBorrowStatus = newStatus


      const response = await borrowBookService.updateBorrowingStatus(updateUserBookRequest);
      if (!response) {
        showError(response.message || 'Failed to update user book.')
      } else {
        showSuccess('User book updated successfully!')
        fetchUsers();
        expandedUserId.value = null
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

// const borrowBook = async (bookId) => {
//   try {
//     loading.value = true
//     const response = await borrowBookService.borrowBook(bookId)
//     if (!response) {
//       showError(response.message || 'Failed to borrow book.')
//     }
//     showSuccess('Book borrowed successfully!')
//     fetchUsers()
//     expandedUserId.value = null
//   } catch (error) {
//     console.log('Error borrowing book:', error)
//   } finally {
//     loading.value = false
//   }
// }

const borrowFavoriteBook = async (borrowStatus, bookId) => {
  try {
    loading.value = true
    let request = {
      bookId: bookId,
      userId: expandedUserId.value
    }
    const response = await borrowBookService.borrowBook(request,true)
    if (!response) {
      showError(response.message || 'Failed to borrow book.')
    }
    let dueDate = moment(response.dueDate).format('MMMM Do YYYY')
    await showConfirmBorrowStatus(dueDate, async () => {
      updateUserBookRequest.borrowId = response.borrowId
      updateUserBookRequest.dueDate = response.dueDate
      updateUserBookRequest.newBorrowStatus = borrowStatus

      await borrowBookService.updateBorrowingStatus(updateUserBookRequest)
    })
    fetchUsers()
    expandedUserId.value = null
    updateUserBookRequest.borrowId = null
    updateUserBookRequest.dueDate = null
    updateUserBookRequest.newBorrowStatus = null
  } catch (error) {
    console.log('Error borrowing book:', error)
  } finally {
    loading.value = false
  }
}

const addToFavorites = (bookId) => {
  let request = {
    userId: expandedUserId.value,
    bookId: bookId
  }
  if (userFavoritesService.addBookToUserFavorites(request)) {
    fetchUsers()
    expandedUserId.value = null
    //selectedBook.classList.add('text-danger');
  }

}
const removeFromFavorites = (bookId) => {
  let request = {
    userId: expandedUserId.value,
    bookId: bookId
  }
  if (userFavoritesService.removeBookFromUserFavorites(request)) {
    fetchUsers()
    expandedUserId.value = null
    //selectedBook.classList.remove('text-danger');
  }
}

</script>@/services/usersActivityService.js