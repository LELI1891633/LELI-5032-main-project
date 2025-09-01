<template>
  <div class="admin">
    <div class="row">
      <!-- Admin Header -->
      <div class="col-12 mb-4">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h2 class="card-title">🔧 Admin Panel</h2>
            <p class="card-text">Manage users, reviews, and application settings</p>
          </div>
        </div>
      </div>

      <!-- Admin Stats -->
      <div class="col-md-3 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">👥 Total Users</h5>
            <h2 class="text-primary">{{ totalUsers }}</h2>
            <p class="text-muted">Registered users</p>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">⭐ Total Reviews</h5>
            <h2 class="text-success">{{ totalReviews }}</h2>
            <p class="text-muted">User reviews</p>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">📊 Avg Rating</h5>
            <h2 class="text-info">{{ averageRating }}</h2>
            <p class="text-muted">Overall rating</p>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">🛍️ Products</h5>
            <h2 class="text-warning">{{ products.length }}</h2>
            <p class="text-muted">Available products</p>
          </div>
        </div>
      </div>

      <!-- User Management -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">👥 User Management</h5>
            <button @click="refreshUsers" class="btn btn-outline-primary btn-sm">Refresh</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span :class="user.role === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                        {{ user.role }}
                      </span>
                    </td>
                    <td>
                      <button 
                        @click="toggleUserRole(user.id)" 
                        class="btn btn-outline-warning btn-sm"
                        :disabled="user.id === currentUser?.id"
                      >
                        {{ user.role === 'admin' ? 'Make User' : 'Make Admin' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Management -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">⭐ Review Management</h5>
            <button @click="refreshReviews" class="btn btn-outline-primary btn-sm">Refresh</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="review in reviews" :key="review.id">
                    <td>{{ review.userName }}</td>
                    <td>
                      <span class="text-warning">
                        <span v-for="star in 5" :key="star" :class="star <= review.rating ? 'text-warning' : 'text-muted'">
                          ★
                        </span>
                      </span>
                    </td>
                    <td>{{ formatDate(review.date) }}</td>
                    <td>
                      <button @click="viewReview(review)" class="btn btn-outline-info btn-sm me-1">
                        View
                      </button>
                      <button @click="deleteReview(review.id)" class="btn btn-outline-danger btn-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- System Settings -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">⚙️ System Settings</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Application Name</label>
              <input type="text" class="form-control" v-model="settings.appName" />
            </div>
            <div class="mb-3">
              <label class="form-label">Maintenance Mode</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="settings.maintenanceMode" />
                <label class="form-check-label">Enable maintenance mode</label>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Max Reviews Per User</label>
              <input type="number" class="form-control" v-model="settings.maxReviewsPerUser" min="1" max="100" />
            </div>
            <button @click="saveSettings" class="btn btn-primary">Save Settings</button>
          </div>
        </div>
      </div>

      <!-- Security Logs -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">🛡️ Security Logs</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div v-for="log in securityLogs" :key="log.id" class="border-bottom pb-2 mb-2">
                <div class="d-flex justify-content-between">
                  <span class="small">{{ log.action }}</span>
                  <span class="small text-muted">{{ formatTime(log.timestamp) }}</span>
                </div>
                <div class="small text-muted">{{ log.details }}</div>
              </div>
            </div>
            <button @click="clearLogs" class="btn btn-outline-secondary btn-sm">Clear Logs</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Detail Modal -->
    <div class="modal fade" id="reviewModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Review Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedReview">
            <div class="mb-3">
              <strong>User:</strong> {{ selectedReview.userName }}
            </div>
            <div class="mb-3">
              <strong>Rating:</strong>
              <span class="text-warning">
                <span v-for="star in 5" :key="star" :class="star <= selectedReview.rating ? 'text-warning' : 'text-muted'">
                  ★
                </span>
              </span>
            </div>
            <div class="mb-3">
              <strong>Comment:</strong>
              <p class="mt-2">{{ selectedReview.comment }}</p>
            </div>
            <div class="mb-3">
              <strong>Date:</strong> {{ formatDate(selectedReview.date) }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Admin',
  setup() {
    const store = useStore()
    const router = useRouter()

    const selectedReview = ref(null)
    const settings = reactive({
      appName: 'Vue.js 3 Application',
      maintenanceMode: false,
      maxReviewsPerUser: 10
    })

    const securityLogs = ref([
      { id: 1, action: 'User Login', details: 'admin@example.com logged in', timestamp: new Date() },
      { id: 2, action: 'Review Deleted', details: 'Review #3 deleted by admin', timestamp: new Date(Date.now() - 3600000) },
      { id: 3, action: 'User Role Changed', details: 'User role updated to admin', timestamp: new Date(Date.now() - 7200000) }
    ])

    const currentUser = computed(() => store.getters.currentUser)
    const isAdmin = computed(() => store.getters.isAdmin)
    const users = computed(() => [
      { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { id: 2, name: 'Regular User', email: 'user@example.com', role: 'user' }
    ])
    const reviews = computed(() => store.state.reviews)
    const products = computed(() => store.state.products)
    const totalUsers = computed(() => users.value.length)
    const totalReviews = computed(() => reviews.value.length)
    const averageRating = computed(() => store.getters.averageRating)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const refreshUsers = () => {
      console.log('Refreshing users...')
    }

    const refreshReviews = () => {
      console.log('Refreshing reviews...')
    }

    const toggleUserRole = (userId) => {
      console.log(`Toggling role for user ${userId}`)
      // In a real app, this would make an API call
    }

    const viewReview = (review) => {
      selectedReview.value = review
      const modal = new bootstrap.Modal(document.getElementById('reviewModal'))
      modal.show()
    }

    const deleteReview = (reviewId) => {
      if (confirm('Are you sure you want to delete this review?')) {
        console.log(`Deleting review ${reviewId}`)
        // In a real app, this would make an API call
      }
    }

    const saveSettings = () => {
      console.log('Saving settings:', settings)
      alert('Settings saved successfully!')
    }

    const clearLogs = () => {
      if (confirm('Are you sure you want to clear all security logs?')) {
        securityLogs.value = []
        alert('Security logs cleared!')
      }
    }

    onMounted(() => {
      // Ensure user is authenticated and is admin
      if (!store.getters.isAuthenticated) {
        router.push('/login')
        return
      }

      if (!store.getters.isAdmin) {
        router.push('/dashboard')
        return
      }

      // Load Bootstrap JS if not available
      if (typeof window !== 'undefined' && !window.bootstrap) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
        document.head.appendChild(script)
      }
    })

    return {
      currentUser,
      isAdmin,
      users,
      reviews,
      products,
      totalUsers,
      totalReviews,
      averageRating,
      selectedReview,
      settings,
      securityLogs,
      formatDate,
      formatTime,
      refreshUsers,
      refreshReviews,
      toggleUserRole,
      viewReview,
      deleteReview,
      saveSettings,
      clearLogs
    }
  }
}
</script>

<style scoped>
.admin {
  min-height: 80vh;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.table {
  font-size: 0.875rem;
}

.table th {
  border-top: none;
  font-weight: 600;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
