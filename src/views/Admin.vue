<template>
  <div class="admin-container">
    <!-- Counselor Panel Header -->
    <div class="admin-header mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="text-white mb-2">Counselor Management Panel</h2>
            <p class="text-white-50 mb-0">Professional management of youth mental health services</p>
          </div>
          <div class="col-md-4 text-end">
            <div class="admin-stats">
              <span class="stat-badge">👥 {{ totalUsers }} Users</span>
              <span class="stat-badge">💬 {{ totalSessions }} Sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <!-- Statistics Overview -->
      <div class="row mb-4">
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalUsers }}</h3>
              <p class="stat-label">Registered Users</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalSessions }}</h3>
              <p class="stat-label">Counseling Sessions</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ completedSessions }}</h3>
              <p class="stat-label">Completed</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ averageRating.toFixed(1) }}</h3>
              <p class="stat-label">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- User Management -->
        <div class="col-12 col-lg-8 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Student Management</h5>
              <button @click="refreshData" class="btn btn-light btn-sm">
                🔄 Refresh
              </button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Age</th>
                      <th>Registration Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in students" :key="user.id">
                      <td>
                        <div class="user-info">
                          <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                          <span>{{ user.name }}</span>
                        </div>
                      </td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.age }} years</td>
                      <td>{{ formatDate(user.registrationDate) }}</td>
                      <td>
                        <span class="badge bg-success">Active</span>
                      </td>
                      <td>
                        <button @click="viewUserDetails(user)" class="btn btn-outline-primary btn-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 col-lg-4 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-gradient-success text-white">
              <h5 class="mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button @click="createArticle" class="quick-action-item">
                  <div class="action-icon">📝</div>
                  <div class="action-text">
                    <h6>Publish Article</h6>
                    <p class="small text-muted">Share mental health knowledge</p>
                  </div>
                </button>
                
                <button @click="viewPendingSessions" class="quick-action-item">
                  <div class="action-icon">⏰</div>
                  <div class="action-text">
                    <h6>Pending Sessions</h6>
                    <p class="small text-muted">View pending session requests</p>
                  </div>
                </button>
                
                <button @click="generateReport" class="quick-action-item">
                  <div class="action-icon">📊</div>
                  <div class="action-text">
                    <h6>Generate Report</h6>
                    <p class="small text-muted">View service statistics report</p>
                  </div>
                </button>
                
                <button @click="manageAssessments" class="quick-action-item">
                  <div class="action-icon">📋</div>
                  <div class="action-text">
                    <h6>Manage Assessments</h6>
                    <p class="small text-muted">Set up mental assessment tools</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="card shadow-sm mt-4">
            <div class="card-header bg-gradient-info text-white">
              <h5 class="mb-0">System Status</h5>
            </div>
            <div class="card-body">
              <div class="system-status">
                <div class="status-item">
                  <span class="status-label">Server Status</span>
                  <span class="status-value online">Online</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Database Connection</span>
                  <span class="status-value online">Normal</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Security Status</span>
                  <span class="status-value online">Secure</span>
                </div>
                <div class="status-item">
                  <span class="status-label">Last Updated</span>
                  <span class="status-value">{{ formatDate(new Date()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Counseling Sessions -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-gradient-warning text-white">
              <h5 class="mb-0">Recent Counseling Sessions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="session in recentSessions" :key="session.id" class="col-md-6 col-lg-4 mb-3">
                  <div class="session-card">
                    <div class="session-header">
                      <h6 class="session-topic">{{ session.topic }}</h6>
                      <span :class="getStatusBadgeClass(session.status)">
                        {{ getStatusText(session.status) }}
                      </span>
                    </div>
                    <div class="session-details">
                      <p class="student-name">Student: {{ session.studentName }}</p>
                      <p class="session-description">{{ session.description }}</p>
                      <div class="session-meta">
                        <span class="text-muted small">📅 {{ formatDate(session.date) }}</span>
                        <span v-if="session.rating" class="text-warning small">
                          ⭐ {{ session.rating }}/5
                        </span>
                      </div>
                    </div>
                    <div class="session-actions">
                      <button @click="viewSessionDetails(session)" class="btn btn-outline-primary btn-sm">
                        View Details
                      </button>
                      <button v-if="session.status === 'pending'" @click="confirmSession(session)" class="btn btn-success btn-sm">
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div class="modal fade" id="userDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Student Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row">
              <div class="col-md-4 text-center">
                <div class="user-avatar-large">{{ selectedUser.name.charAt(0) }}</div>
                <h5 class="mt-3">{{ selectedUser.name }}</h5>
                <p class="text-muted">{{ selectedUser.email }}</p>
              </div>
              <div class="col-md-8">
                <h6>Basic Information</h6>
                <ul class="list-unstyled">
                  <li><strong>Age:</strong> {{ selectedUser.age }} years</li>
                  <li><strong>Registration Date:</strong> {{ formatDate(selectedUser.registrationDate) }}</li>
                  <li><strong>User Type:</strong> {{ selectedUser.role === 'student' ? 'Student' : 'Counselor' }}</li>
                </ul>
                
                <h6 class="mt-3">Counseling History</h6>
                <div v-if="userSessions.length > 0">
                  <div v-for="session in userSessions.slice(0, 3)" :key="session.id" class="session-summary">
                    <p class="mb-1"><strong>{{ session.topic }}</strong></p>
                    <p class="text-muted small mb-1">{{ formatDate(session.date) }}</p>
                    <span :class="getStatusBadgeClass(session.status)">
                      {{ getStatusText(session.status) }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-muted">No counseling records</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button @click="contactUser" class="btn btn-primary">Contact Student</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Admin',
  setup() {
    const store = useStore()
    const { requireCounselor, redirectToForbidden } = useAuth()
    const selectedUser = ref(null)

    // Statistics data
    const totalUsers = computed(() => store.getters.totalUsers)
    const totalSessions = computed(() => store.getters.totalSessions)
    const completedSessions = computed(() => store.getters.completedSessions)
    const averageRating = computed(() => store.getters.averageSessionRating)

    // User data - get from mockUsers in store
    const students = computed(() => {
      // Since mockUsers is not in state, we'll create a mock list for demo
      // In a real app, this would come from an API call
      return [
        {
          id: 2,
          name: 'Alex Chen',
          email: 'student@example.com',
          age: 20,
          role: 'student',
          registrationDate: '2024-01-01'
        },
        {
          id: 3,
          name: 'Emma Wilson',
          email: 'emma@example.com',
          age: 18,
          role: 'student',
          registrationDate: '2024-01-05'
        },
        {
          id: 4,
          name: 'David Lee',
          email: 'david@example.com',
          age: 22,
          role: 'student',
          registrationDate: '2024-01-10'
        }
      ]
    })

    // Session data
    const recentSessions = computed(() => 
      store.state.sessions.slice(0, 6)
    )

    const userSessions = computed(() => {
      if (!selectedUser.value) return []
      return store.getters.userSessions(selectedUser.value.id)
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        'pending': 'badge bg-warning',
        'confirmed': 'badge bg-info',
        'completed': 'badge bg-success',
        'cancelled': 'badge bg-danger'
      }
      return classes[status] || 'badge bg-secondary'
    }

    const getStatusText = (status) => {
      const texts = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      }
      return texts[status] || status
    }

    // Action methods
    const refreshData = () => {
      // Simulate data refresh
      console.log('Refreshing data...')
    }

    const viewUserDetails = (user) => {
      selectedUser.value = user
      const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'))
      modal.show()
    }

    const contactUser = () => {
      alert('Contact feature under development...')
    }

    const createArticle = () => {
      alert('Article publishing feature under development...')
    }

    const viewPendingSessions = () => {
      alert('Pending sessions feature under development...')
    }

    const generateReport = () => {
      alert('Report generation feature under development...')
    }

    const manageAssessments = () => {
      alert('Assessment management feature under development...')
    }

    const viewSessionDetails = (session) => {
      alert(`View session details: ${session.topic}`)
    }

    const confirmSession = (session) => {
      // Update session status
      store.commit('UPDATE_SESSION', {
        id: session.id,
        status: 'confirmed'
      })
      alert('Session confirmed')
    }

    onMounted(() => {
      // Ensure user is counselor using the composable
      requireCounselor(() => {
        // Load Bootstrap JS
        if (typeof window !== 'undefined' && !window.bootstrap) {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
          document.head.appendChild(script)
        }
      })
    })

    return {
      selectedUser,
      totalUsers,
      totalSessions,
      completedSessions,
      averageRating,
      students,
      recentSessions,
      userSessions,
      formatDate,
      getStatusBadgeClass,
      getStatusText,
      refreshData,
      viewUserDetails,
      contactUser,
      createArticle,
      viewPendingSessions,
      generateReport,
      manageAssessments,
      viewSessionDetails,
      confirmSession
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  border-radius: 0 0 20px 20px;
}

.admin-stats {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #667eea;
}

.stat-label {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  border: none;
  padding: 1rem 1.5rem;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2rem;
  margin: 0 auto;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-action-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  background: none;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.quick-action-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.action-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.action-text h6 {
  margin: 0;
  font-weight: 600;
}

.action-text p {
  margin: 0;
}

.system-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.status-item:last-child {
  border-bottom: none;
}

.status-value.online {
  color: #28a745;
  font-weight: 600;
}

.session-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  transition: transform 0.3s ease;
}

.session-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.session-topic {
  margin: 0;
  font-weight: 600;
}

.session-details {
  margin-bottom: 1rem;
}

.student-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.session-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.session-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-actions {
  display: flex;
  gap: 0.5rem;
}

.session-summary {
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .admin-header {
    text-align: center;
  }
  
  .admin-stats {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
}
</style>
