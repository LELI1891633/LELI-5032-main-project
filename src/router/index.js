import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'
import Community from '../views/Reviews.vue'
import Forbidden from '../views/Forbidden.vue'

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
    meta: { requiresAuth: true, requiresCounselor: true }
  },
  {
    path: '/community',
    name: 'Community',
    component: Community,
    meta: { requiresAuth: true }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
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
  const isCounselor = store.getters.isCounselor
  const currentUser = store.getters.currentUser

  // Initialize auth state from localStorage if not already set
  if (!isAuthenticated && localStorage.getItem('user')) {
    store.dispatch('initializeAuth')
  }

  // Routes that require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Store the attempted route for redirect after login
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // Routes that require counselor role
  if (to.matched.some(record => record.meta.requiresCounselor)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    if (!isCounselor) {
      // Redirect to 403 page for unauthorized access
      next('/403')
      return
    }
  }

  // Guest routes (login/register) - redirect if already authenticated
  if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      // Redirect based on user role
      const redirectPath = currentUser?.role === 'counselor' ? '/admin' : '/dashboard'
      next(redirectPath)
      return
    }
  }

  // Prevent access to 403 page if user has proper permissions
  if (to.path === '/403' && isAuthenticated) {
    const redirectPath = isCounselor ? '/admin' : '/dashboard'
    next(redirectPath)
    return
  }

  next()
})

export default router
