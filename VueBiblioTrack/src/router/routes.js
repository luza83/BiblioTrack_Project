import { createRouter, createWebHistory } from 'vue-router'
import NoAccess from '@/views/auth/NoAccess.vue'
import NotFound from '@/views/auth/NotFound.vue'
import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import Books from '@/views/books/Books.vue'
import BookUpsert from '@/views/books/BookUpsert.vue'
import BookStock from '@/views/bookCopies/BookStock.vue'
import BookCopies from '@/views/bookCopies/BookCopies.vue'
import Users from '@/views/users/Users.vue'
import Borrow from '@/views/borrows/Borrow.vue'
import MyBooks from '@/views/myBooks/MyBooks.vue'
import { requireAuth } from '@/router/guards'
import { requireAdmin } from '@/router/guards'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTE_NAMES.DASHBOARD,
      component: Dashboard,
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
      beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-books/create',
      name: APP_ROUTE_NAMES.CREATE_BOOK,
      component: BookUpsert,
      beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-books/update/:bookId',
      name: APP_ROUTE_NAMES.EDIT_BOOK,
      component: BookUpsert,
      props: true,
      beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-book-stock',
      name: APP_ROUTE_NAMES.BOOK_STOCK,
      component: BookStock,
      beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-book-copies/:bookId',
      name: APP_ROUTE_NAMES.BOOK_COPIES,
      component: BookCopies,
      beforeEnter: [requireAdmin],
    },
    {
      path: '/admin/manage-users',
      name: APP_ROUTE_NAMES.USERS,
      component: Users,
      beforeEnter: [requireAdmin],
    },
    {
      path: '/borrow-book',
      name: APP_ROUTE_NAMES.BORROW_BOOK,
      component: Borrow,
      beforeEnter: [requireAuth],
    },
    {
      path: '/my-books',
      name: APP_ROUTE_NAMES.MY_BOOKS,
      component: MyBooks,
      beforeEnter: [requireAuth],
    },
    
    {
      path: '/:catchAll(.*)*',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
    },
  ],
})

export default router
