import Swal from 'sweetalert2'
import { useThemeStore } from '@/stores/themeStore.js'

export function useSwal() {
  const themeStore = useThemeStore()
  const backdropColor = themeStore.theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'
  const showAlert = async (options) => {
    return await Swal.fire(options)
  }

  const showSuccess = async (message) => {
    return await showAlert({
      position: 'top-end',
      icon: 'success',
      title: message,
      theme: themeStore.theme,
      backdrop: backdropColor,
      showConfirmButton: false,
      timer: 1500,
    })
  }

  const showError = async (message) => {
    return await showAlert({
      position: 'top-end',
      icon: 'error',
      title: message,
      theme: themeStore.theme,
      backdrop: backdropColor,
      showConfirmButton: false,
      timer: 2500,
    })
  }

  const showConfirm = async (message) => {
    return await showAlert({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      theme: themeStore.theme,
      backdrop: backdropColor,
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
      theme: themeStore.theme,
      backdrop: backdropColor,
      title: message,
      showConfirmButton: true
    })
  }

  const showConfirmBorrowStatus = async (dueDate, onConfirm) => {
    return await showAlert({
      title: `This book has been reserved. Due date: ${dueDate}`,
      text: "Do you want to pick up this book now?",
      position: 'top-end',
      theme: themeStore.theme,
      backdrop: backdropColor,
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

