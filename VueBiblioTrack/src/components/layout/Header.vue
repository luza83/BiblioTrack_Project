<template>
    <nav class="navbar navbar-expand-md rounded-3 mx-auto my-2 w-100 bg-primary-subtle bg-opacity-10 text-primary-subtle">
        <div class="container-fluid">
            <router-link class="navbar-brand" :to="APP_ROUTE_NAMES.DASHBOARD">
                <img src="@/assets/logo.png" alt="Logo" height="64px" class="d-inline-block align-text-top me-2">
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" aria-current="page" :to="APP_ROUTE_NAMES.DASHBOARD">Dashboard
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="!authStore.isAdmin">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.BORROW_BOOK }">Library
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="authStore.isAuthenticated && !authStore.isAdmin">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.MY_BOOKS }">My Books
                        </router-link>
                    </li>
                    <li class="nav-item dropdown" v-if="authStore.isAdmin">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.BOOKS }">Books
                        </router-link>
                    </li>
                    <li class="nav-item dropdown" v-if="authStore.isAdmin">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.BOOK_STOCK }">Book
                            Stock
                        </router-link>
                    </li>
                    <li class="nav-item dropdown" v-if="authStore.isAdmin">
                        <hr class="dropdown-divider">
                    </li>
                    <li class="nav-item dropdown" v-if="authStore.isAdmin">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.USERS }">Users
                        </router-link>
                    </li>
                    
                </ul>
                <ul class="navbar-nav ms-auto align-items-center small">
                    <li class="nav-item" v-if="!authStore.isAuthenticated">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.SIGN_IN }"
                            title="Sign In">Sign In</router-link>
                    </li>
                    <li class="nav-item" v-if="!authStore.isAuthenticated">
                        <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.SIGN_UP }"
                            title="Sign Up">Sign Up</router-link>
                    </li>
                    <li class="nav-item" v-if="authStore.isAuthenticated">
                        <button class="nav-link px-2" aria-current="page" title="Logout" @click="authStore.signOut()">
                            Sign Out
                        </button>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-laptop"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <button class="dropdown-item" aria-current="page" @click="themeStore.setTheme('light')">
                                    <i class="bi bi-sun"></i> Light
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item" aria-current="page" @click="themeStore.setTheme('dark')">
                                    <i class="bi bi-moon-fill"></i> Dark
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const themeStore = useThemeStore()

</script>