import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'
import Reviews from '../views/Reviews.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: Reviews
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards for authentication and role-based access
router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = store.getters.isAuthenticated
  const isAdmin = store.getters.isAdmin

  // Routes that require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  // Routes that require admin role
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!isAdmin) {
      next('/dashboard')
      return
    }
  }

  // Guest routes (login/register) - redirect if already authenticated
  if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
