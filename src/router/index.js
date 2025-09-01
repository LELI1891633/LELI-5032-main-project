import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'
import Community from '../views/Reviews.vue'

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

  // Routes that require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  // Routes that require counselor role
  if (to.matched.some(record => record.meta.requiresCounselor)) {
    if (!isCounselor) {
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
