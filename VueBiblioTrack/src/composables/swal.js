import Swal from 'sweetalert2'

export function useSwal() {
  const showAlert = async (options) => {
    return await Swal.fire(options)
  }

  const showSuccess = async (message) => {
    return await showAlert({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    })
  }

  const showError = async (message) => {
    return await showAlert({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    })
  }

  const showConfirm = async (message) => {
    return await showAlert({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })
  }
  const showBorrowed = async (message) => {
    return await showAlert({
      position: 'top-end',
      width: '400px',
      height: 'auto',
      icon: 'success',
      title: message,
      showConfirmButton: true
    })
  }

const showConfirmBorrowStatus = async (dueDate, onConfirm) => {
  return await showAlert({
    title: `This book has been reserved. Due date: ${dueDate}`,
    text: "Do you want to pick up this book now?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (onConfirm) {
        await onConfirm()
      }
      Swal.fire("Success!", 'Book picked up.', "success")
    } else if (result.isDenied) {
      Swal.fire("Reserved!", 'Book is reserved.', "info")
    }
  })
}

  return { showError, showSuccess, showConfirm, showBorrowed, showConfirmBorrowStatus }
}

