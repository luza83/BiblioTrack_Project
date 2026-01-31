<template>
    <div v-if="bookCopy"
        class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-50"
        style="z-index: 1050">
        <div class="bg-body p-4 rounded-4 shadow-lg mx-3 overflow-auto"
            style="max-width: 800px; width: 100%; max-height: 90vh">
            <div class="modal-content border-0 rounded-4 bg-body">
                <div class="sticky-top bg-body p-3 p-sm-4 border-bottom">
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-2">
                        <div class="d-flex align-items-center">
                            <h5 v-if="bookCopy.copyId" class="mb-0 fs-5 text-primary-subtle">Copy #{{ bookCopy.copyId }}</h5>
                            <h5 v-else class="mb-0 fs-5 text-primary-subtle">New Book Copy</h5>
                        </div>
                        <button @click="closeModal" class="btn-close ms-auto ms-sm-0" aria-label="Close modal"></button>
                    </div>

                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                        <span class="badge rounded-pill px-3 py-2" :class="{
                            'bg-success-subtle text-success-emphasis': bookCopy.status === COPY_STATUS_AVAILABLE,
                            'bg-warning-subtle text-warning-emphasis': bookCopy.status === COPY_STATUS_RESERVED,
                            'bg-warning-subtle text-warning-emphasis': bookCopy.status === COPY_STATUS_BORROWED,
                            'bg-danger-subtle text-danger-emphasis': bookCopy.status === COPY_STATUS_LOST,
                            'bg-danger-subtle text-danger-emphasis': bookCopy.status === COPY_STATUS_DAMAGED,
                        }">
                            {{ bookCopy.status }}
                        </span>
                    </div>
                </div>

                <div class="modal-body-scrollable p-3 p-sm-4" style="max-height: 70vh; overflow-y: auto">
                    <div class="row g-3 g-md-4 mb-2">
                        <div class="col-12 col-md-6">
                            <div class="card border-0 shadow-sm h-100">
                                <div class="card-body p-3">
                                    <div class="d-flex align-items-center mb-3">
                                        <i class="bi bi-bookshelf text-primary-subtle me-2" width="20"></i>
                                        <h6 class="card-title mb-0">Copy Location</h6>
                                    </div>

                                    <!-- Location Input -->
                                    <div class="mb-3">
                                        <input id="locationInput" type="text" class="form-control"
                                            v-model="copyObj.location" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- Order Status -->
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-3">
                            <div class="d-flex align-items-center mb-3">
                                <i class="bi bi-gear text-success me-2" width="20"></i>
                                <h6 class="card-title mb-0">Copy Status</h6>
                            </div>

                            <!-- Status Flow Buttons -->
                            <div class="mb-3">
                                <label for="statusSelect" class="form-label">Status</label>
                                <select id="statusSelect" class="form-select" v-model="copyObj.status">
                                    <option disabled value="">Select status</option>
                                    <option v-for="status in statuses" :key="status" :value="status">
                                        {{ status }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Modal Footer -->
                <div class="modal-footer d-flex justify-content-center gap-3">
                    <!-- Cancel Button -->
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        data-bs-dismiss="modal"
                        @click="closeModal"
                    >
                        Cancel
                    </button>

                    <!-- Update Button -->
                    <div v-if="bookCopy.copyId">
                      <button 
                        type="button" 
                        class="btn btn-primary"
                        @click="updateBookCopy()"
                      >
                        Update
                      </button>
                    </div>
                    <div v-else>
                       <button 
                        type="button" 
                        class="btn btn-primary"
                        @click="addBookCopy(bookId)"
                      >
                        Add Copy
                      </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import {
  COPY_STATUS,
    COPY_STATUS_AVAILABLE,
    COPY_STATUS_BORROWED,
    COPY_STATUS_RESERVED,
    COPY_STATUS_LOST,
    COPY_STATUS_DAMAGED
} from '@/constants/constants'
import bookCopyService from '@/services/bookCopyService.js'
import { useSwal } from '@/composables/swal'
import { reactive, watch } from 'vue'
const { showSuccess } = useSwal()

const copyObj = reactive({
  status: '',
  location: '',
})

const props = defineProps({
  bookCopy: {
    type: Object,
    required: false,
    default: () => ({
      copyId: '',
      bookId: '',
      status: '',
      location: '',
    }),
  },
   bookId: {
      type: [Number, String],
      required: true
    }
})

watch(
  () => props.bookCopy,
  (newVal) => {
    if (!newVal) return

    copyObj.status = newVal.status
    copyObj.location = newVal.location
  },
  { immediate: true }
)

const emit = defineEmits(['close', 'status-updated'])
const closeModal = () => {
  emit('close')
}


const updateBookCopy = async () => {
  if (!props.bookCopy) return
  
  const payload = {}

  if (copyObj.status !== props.bookCopy.status) {
    payload.status = copyObj.status
  }

  if (copyObj.location !== props.bookCopy.location) {
    payload.location = copyObj.location
  }

  if (Object.keys(payload).length === 0) {
    // nothing changed
    closeModal()
    return
  }
  try {

    await bookCopyService.updateBookCopy(props.bookCopy.copyId, payload)

    showSuccess('Book copy updated successfully')
    closeModal()
    emit('status-updated')
  } catch (error) {
    console.error('Error updating book copy', error)
  }
}

const addBookCopy = async (bookId) => {
  if (!props.bookCopy) return

  const payload = {
    bookId: bookId,
    status: copyObj.status,
    location: copyObj.location,
  }

  try {

    await bookCopyService.addBookCopy(payload)

    showSuccess('Book copy added successfully')
    closeModal()
    emit('status-updated')
  } catch (error) {
    console.error('Error adding book copy', error)
  }
}

const statuses = [
  COPY_STATUS_AVAILABLE,
  COPY_STATUS_BORROWED,
  COPY_STATUS_RESERVED,
  COPY_STATUS_LOST,
  COPY_STATUS_DAMAGED
]
const isStatusDisabled = (status) => {
  const statusCopy = [
    COPY_STATUS_AVAILABLE,
    COPY_STATUS_BORROWED,
    COPY_STATUS_RESERVED,
    COPY_STATUS_LOST,
    COPY_STATUS_DAMAGED
  ]

  const currentIndex = statusCopy.indexOf(props.bookCopy.status)
  const targetIndex = statusCopy.indexOf(status)

  if (targetIndex <= currentIndex) {
    return true
  }

  //cannot set a damaged or lost copy to available 
  if (props.bookCopy.status === COPY_STATUS_LOST && status === COPY_STATUS_AVAILABLE) {
    return true
  }
  if (props.bookCopy.status === COPY_STATUS_DAMAGED && status === COPY_STATUS_AVAILABLE) {
    return true
  }

  return false
}
</script>

