import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

/**
 * Authentication and Authorization Composable
 * Provides reactive authentication state and permission checking utilities
 */
export function useAuth() {
  const store = useStore()
  const router = useRouter()

  // Reactive authentication state
  const isAuthenticated = computed(() => store.getters.isAuthenticated)
  const currentUser = computed(() => store.getters.currentUser)
  const isCounselor = computed(() => store.getters.isCounselor)
  const isStudent = computed(() => store.getters.isStudent)

  // Permission checking functions
  const hasRole = (role) => {
    return computed(() => currentUser.value?.role === role)
  }

  const hasAnyRole = (roles) => {
    return computed(() => roles.includes(currentUser.value?.role))
  }

  const canAccess = (requiredRole) => {
    if (!isAuthenticated.value) return false
    if (!requiredRole) return true
    return currentUser.value?.role === requiredRole
  }

  const canAccessAdmin = () => {
    return canAccess('counselor')
  }

  const canAccessStudentFeatures = () => {
    return canAccess('student') || canAccess('counselor')
  }

  // Navigation helpers
  const redirectToLogin = (redirectPath = null) => {
    const query = redirectPath ? { redirect: redirectPath } : {}
    router.push({ path: '/login', query })
  }

  const redirectToDashboard = () => {
    const path = isCounselor.value ? '/admin' : '/dashboard'
    router.push(path)
  }

  const redirectToForbidden = () => {
    router.push('/403')
  }

  // Action helpers
  const logout = () => {
    store.dispatch('logout')
    router.push('/login')
  }

  const requireAuth = (callback) => {
    if (!isAuthenticated.value) {
      redirectToLogin()
      return false
    }
    return callback()
  }

  const requireRole = (role, callback) => {
    if (!requireAuth(callback)) return false
    
    if (!canAccess(role)) {
      redirectToForbidden()
      return false
    }
    
    return callback()
  }

  const requireCounselor = (callback) => {
    return requireRole('counselor', callback)
  }

  const requireStudent = (callback) => {
    return requireRole('student', callback)
  }

  // UI visibility helpers
  const showForRole = (role) => {
    return computed(() => currentUser.value?.role === role)
  }

  const showForRoles = (roles) => {
    return computed(() => roles.includes(currentUser.value?.role))
  }

  const hideForRole = (role) => {
    return computed(() => currentUser.value?.role !== role)
  }

  const hideForRoles = (roles) => {
    return computed(() => !roles.includes(currentUser.value?.role))
  }

  return {
    // State
    isAuthenticated,
    currentUser,
    isCounselor,
    isStudent,
    
    // Permission checks
    hasRole,
    hasAnyRole,
    canAccess,
    canAccessAdmin,
    canAccessStudentFeatures,
    
    // Navigation
    redirectToLogin,
    redirectToDashboard,
    redirectToForbidden,
    
    // Actions
    logout,
    requireAuth,
    requireRole,
    requireCounselor,
    requireStudent,
    
    // UI helpers
    showForRole,
    showForRoles,
    hideForRole,
    hideForRoles
  }
}

/**
 * Route Guard Helper
 * Can be used in route meta or components
 */
export function createRouteGuard(requiredRole = null) {
  return (to, from, next) => {
    const store = useStore()
    const isAuthenticated = store.getters.isAuthenticated
    const currentUser = store.getters.currentUser

    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    if (requiredRole && currentUser?.role !== requiredRole) {
      next('/403')
      return
    }

    next()
  }
}

/**
 * Permission Directive Helper
 * For use in templates with v-permission directive
 */
export function checkPermission(role) {
  const store = useStore()
  const currentUser = store.getters.currentUser
  return currentUser?.role === role
}
