import { createRouter, createWebHistory } from 'vue-router'
import NoAccess from '@/views/auth/NoAccess.vue'
import NotFound from '@/views/auth/NotFound.vue'
import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'
import Home from '@/views/home/Home.vue'
import Books from '@/views/books/Books.vue'
import BookUpsert from '@/views/books/BookUpsert.vue'
import BookStock from '@/views/bookCopies/BookStock.vue'
import BookCopies from '@/views/bookCopies/BookCopies.vue'
import BookCopyUpsert from '@/views/bookCopies/BookCopyUpsert.vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTE_NAMES.HOME,
      component: Home,
    },
    {
      path: '/no-access',
      name: APP_ROUTE_NAMES.NO_ACCESSS,
      component: NoAccess,
    },
     {
      path: '/sign-in',
      name: APP_ROUTE_NAMES.SIGN_IN,
      component: SignIn,
    },
     {
      path: '/sign-up',
      name: APP_ROUTE_NAMES.SIGN_UP,
      component: SignUp,
    },
    {
      path: '/admin/manage-books',
      name: APP_ROUTE_NAMES.BOOKS,
      component: Books,
    },
    {
      path: '/admin/manage-books/create',
      name: APP_ROUTE_NAMES.CREATE_BOOK,
      component: BookUpsert,
      // beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-books/update/:bookId',
      name: APP_ROUTE_NAMES.EDIT_BOOK,
      component: BookUpsert,
      props: true,
      // beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-book-stock',
      name: APP_ROUTE_NAMES.BOOK_STOCK,
      component: BookStock,
    },
    {
      path: '/admin/manage-book-copies/:bookId',
      name: APP_ROUTE_NAMES.BOOK_COPIES,
      component: BookCopies,
    },
    // {
    //   path: '/admin/manage-book-copies/create',
    //   name: APP_ROUTE_NAMES.CREATE_BOOK_COPY,
    //   component: BookCopyUpsert,
    //   // beforeEnter: [requireAdmin],
    // },
    // {
    //   path: '/admin/manage-book-copies/update/:bookCopyId',
    //   name: APP_ROUTE_NAMES.EDIT_BOOK_COPY,
    //   component: BookCopyUpsert,
    //   props: true,
    //   // beforeEnter: [requireAdmin],
    // },
    {
      path: '/:catchAll(.*)*',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
    },
  ],
})

export default router
