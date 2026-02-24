<template>
  <div class="d-flex justify-content-center align-items-center" v-if="loading">
    <div class="spinner-grow text-success" style="width: 2.5rem; height: 2.5rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div class="container" v-else>
    <div class="mx-auto">
      <div class="mb-4 border-bottom d-flex justify-content-between align-items-center py-3">
        <h3 class="fw-semibold text-success"> {{ bookIdForUpdate ? 'Edit' : 'New' }} Book</h3>
        <div class="d-flex gap-3">
          <button
            type="submit"
            form="menuForm"
            class="btn btn-success btn-sm gap-2 rounded-1 px-4 py-2"
            @click="router.push({ name: APP_ROUTE_NAMES.CREATE_BOOK })"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
            {{ bookIdForUpdate ? 'Update' : 'Create' }} Book
          </button>

          <button
            type="button"
            class="btn btn-outline border btn-sm gap-2 rounded-1 px-4 py-2"
            @click="router.push({ name: APP_ROUTE_NAMES.BOOKS })"
          >
            Cancel
          </button>
        </div>
      </div>
      <div class="alert alert-danger pb-0" v-if="errorList.length > 0">
        Please fix the following errors:
        <ul>
          <li v-for="error in errorList" :key="error">{{ error }}</li>
        </ul>
      </div>
      <form
        enctype="multipart/form-data"
        class="needs-validation"
        id="menuForm"
        @submit="onFormSubmit"
      >
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="d-flex flex-column g-12">
              <div class="mb-3">
                <label for="Title" class="form-label">Title</label>
                <input
                  id="name"
                  type="text"
                  v-model="bookObj.title"
                  class="form-control"
                  placeholder="Enter book title"
                />
              </div>

              <div class="mb-3">
                <label for="Author" class="form-label">Author</label>
                <input
                  id="Author"
                  class="form-control"
                  placeholder="Enter book author"
                  v-model="bookObj.author"
                  />
              </div>

              <div class="mb-3">
                <label for="ISBN" class="form-label">ISBN</label>
                <input
                  id="ISBN"
                  type="text"
                  class="form-control"
                  v-model="bookObj.isbn"
                />
              </div>
            <div class="mb-3">
                <label for="Publisher" class="form-label">Publisher</label>
                <input id="Publisher" class="form-control" v-model="bookObj.publisher" />
              </div>

              <div class="mb-3">
                <label for="Category" class="form-label">Category</label>
                <select id="Category" class="form-select" v-model="bookObj.category">
                  <option value="" selected disabled>--Select a category--</option>
                  <option v-for="category in CATEGROIES" :key="category">{{ category }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div>
              <img
                v-if="bookIdForUpdate > 0 && bookObj.imageUrl"
                :src="bookObj.imageUrl"
                class="img-fluid w-100 mb-3 rounded"
                style="aspect-ratio: 1/1; object-fit: cover"
              />
              <div class="mb-3">
                <label for="image" class="form-label">Book Image</label>
                <input id="image" class="form-control" v-model="bookObj.imageUrl" />
                <div class="form-text">Leave empty to keep existing image</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { CATEGROIES } from '@/constants/constants'
import booksService from '@/services/booksService.js'
import { useSwal } from '@/composables/swal'
const { showError, showSuccess, showConfirm } = useSwal()
const router = new useRouter()
const route = new useRoute()
const loading = ref(false)
const isProcessing = ref(false)
const errorList = reactive([])
const bookIdForUpdate = route.params.bookId
const bookObj = reactive({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  category: 0.0,
  imageUrl: '',
})
const formData = new FormData()

onMounted(async () => {
  if (!bookIdForUpdate) return
  loading.value = true
  try {
    const result = await booksService.getBookById(bookIdForUpdate)
    Object.assign(bookObj, result)
    console.log("bookObj:", bookObj)
  } catch (err) {
    console.log('Error while fetching book', err)
  } finally {
    loading.value = false
  }
})


const onFormSubmit = async (event) => {
  event.preventDefault()
  isProcessing.value = true
  errorList.length = 0 //clear it

  //validations
  if (bookObj.title.length < 3) {
    errorList.push('Title should be at least 3 char long.')
  }
  if (bookObj.author <= 0) {
    errorList.push('Author should be greater than 0.')
  }
  if (bookObj.isbn === '') {
    errorList.push('ISBN must be selected.')
  }
  if (bookObj.publisher === '') {
    errorList.push('Publisher must be selected.')
  }
  if (bookObj.category === '') {
    errorList.push('Category must be selected.')
  }
  if (bookObj.imageUrl === '') {
   errorList.push('Image url must be provided.')
  } 
  if (!errorList.length) {
    //no errors
    Object.entries(bookObj).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (!bookIdForUpdate || bookIdForUpdate == 0) {
      booksService
        .addBook(formData)
        .then(() => {
          showSuccess('Book created successfully.')
          router.push({ name: APP_ROUTE_NAMES.BOOKS })
        })
        .catch((err) => {
          isProcessing.value = false
          showError(errorList.join(', ') || 'Book creation failed.')
          console.log('erro list:',errorList)
        })
    } else {
      //update
      booksService
        .updateBook(bookIdForUpdate, formData)
        .then(() => {
          showSuccess('Book updated successfully.')
          router.push({ name: APP_ROUTE_NAMES.BOOKS })
        })
        .catch((err) => {
          isProcessing.value = false
          showError('Book update failed.')
          console.log('update Failed', err)
        })
    }
    console.log(formData)
  }
  isProcessing.value = false
}
</script>