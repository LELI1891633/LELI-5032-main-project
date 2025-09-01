<template>
  <div class="community-container">
    <div class="row">
      <!-- Header Section -->
      <div class="col-12 mb-4">
        <div class="card bg-gradient-primary text-white">
          <div class="card-body text-center">
            <h2 class="card-title">💬 Community & Support</h2>
            <p class="card-text">Connect with others and share your mental health journey</p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">📊 Community Rating</h5>
            <h2 class="text-primary">{{ averageRating }}</h2>
            <div class="text-warning mb-2">
              <span v-for="star in 5" :key="star" :class="star <= Math.round(averageRating) ? 'text-warning' : 'text-muted'">
                ★
              </span>
            </div>
            <p class="text-muted">Based on {{ totalSessions }} sessions</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">📈 Session Distribution</h5>
            <div class="rating-distribution">
              <div v-for="rating in 5" :key="rating" class="d-flex align-items-center mb-1">
                <span class="me-2">{{ rating }}★</span>
                <div class="progress flex-grow-1 me-2" style="height: 8px;">
                  <div 
                    class="progress-bar bg-warning" 
                    :style="{ width: getRatingPercentage(rating) + '%' }"
                  ></div>
                </div>
                <span class="small">{{ getRatingCount(rating) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">✍️ Share Experience</h5>
            <p class="card-text">Share your mental health journey with the community</p>
            <button @click="showSessionForm = true" class="btn btn-primary">
              Book Session
            </button>
          </div>
        </div>
      </div>

      <!-- Session Booking Modal -->
      <div v-if="showSessionForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Book a Counseling Session</h5>
              <button type="button" class="btn-close" @click="closeSessionForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitSession">
                <!-- Counselor Selection -->
                <div class="mb-3">
                  <label for="counselorSelect" class="form-label">Select Counselor</label>
                  <select 
                    id="counselorSelect" 
                    class="form-select" 
                    v-model="sessionForm.counselorId"
                    required
                  >
                    <option value="">Choose a counselor...</option>
                    <option v-for="counselor in counselors" :key="counselor.id" :value="counselor.id">
                      {{ counselor.name }} - {{ counselor.specialization }}
                    </option>
                  </select>
                </div>

                <!-- Session Topic -->
                <div class="mb-3">
                  <label for="sessionTopic" class="form-label">Session Topic</label>
                  <input
                    type="text"
                    id="sessionTopic"
                    class="form-control"
                    v-model="sessionForm.topic"
                    placeholder="e.g., Anxiety, Depression, Academic Stress..."
                    required
                  />
                </div>

                <!-- Session Description -->
                <div class="mb-3">
                  <label for="sessionDescription" class="form-label">Session Description</label>
                  <textarea
                    id="sessionDescription"
                    class="form-control"
                    v-model="sessionForm.description"
                    rows="4"
                    placeholder="Briefly describe what you'd like to discuss..."
                    required
                  ></textarea>
                  <div class="form-text">
                    {{ sessionForm.description.length }}/500 characters
                  </div>
                </div>

                <!-- Preferred Date -->
                <div class="mb-3">
                  <label for="sessionDate" class="form-label">Preferred Date</label>
                  <input
                    type="date"
                    id="sessionDate"
                    class="form-control"
                    v-model="sessionForm.date"
                    :min="new Date().toISOString().split('T')[0]"
                    required
                  />
                </div>

                <!-- Submit Button -->
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" @click="closeSessionForm">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="!isSessionFormValid || isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSubmitting ? 'Submitting...' : 'Book Session' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Sessions List -->
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Community Sessions</h5>
            <div class="d-flex gap-2">
              <select v-model="sortBy" class="form-select form-select-sm" style="width: auto;">
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="topic">Sort by Topic</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div v-if="filteredSessions.length === 0" class="text-center py-5">
              <p class="text-muted">No sessions found.</p>
            </div>
            <div v-else>
              <div v-for="session in filteredSessions" :key="session.id" class="session-item border-bottom pb-4 mb-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1">{{ session.topic }}</h6>
                    <p class="text-muted small mb-1">
                      {{ isCounselor ? `Student: ${session.studentName}` : `Counselor: ${session.counselorName}` }}
                    </p>
                    <div v-if="session.rating" class="text-warning mb-2">
                      <span v-for="star in 5" :key="star" :class="star <= session.rating ? 'text-warning' : 'text-muted'">
                        ★
                      </span>
                      <span class="ms-2 text-muted">{{ session.rating }}/5</span>
                    </div>
                  </div>
                  <div class="text-end">
                    <span :class="getStatusBadgeClass(session.status)">
                      {{ getStatusText(session.status) }}
                    </span>
                    <br>
                    <small class="text-muted">{{ formatDate(session.date) }}</small>
                  </div>
                </div>
                <p class="mb-2">{{ session.description }}</p>
                <div v-if="session.feedback" class="small text-muted">
                  <strong>Feedback:</strong> {{ session.feedback }}
                </div>
              </div>
            </div>
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
  name: 'Community',
  setup() {
    const store = useStore()
    const router = useRouter()

    const showSessionForm = ref(false)
    const sortBy = ref('date')
    const filterStatus = ref('')
    const isSubmitting = ref(false)

    const sessionForm = reactive({
      counselorId: '',
      topic: '',
      description: '',
      date: ''
    })

    const sessions = computed(() => store.state.sessions)
    const counselors = computed(() => store.state.users.filter(user => user.role === 'counselor'))
    const totalSessions = computed(() => sessions.value.length)
    const averageRating = computed(() => store.getters.averageSessionRating)
    const currentUser = computed(() => store.getters.currentUser)
    const isCounselor = computed(() => store.getters.isCounselor)

    const filteredSessions = computed(() => {
      let filtered = [...sessions.value]

      // Filter by status
      if (filterStatus.value) {
        filtered = filtered.filter(session => session.status === filterStatus.value)
      }

      // Sort sessions
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)
          case 'topic':
            return a.topic.localeCompare(b.topic)
          case 'date':
          default:
            return new Date(b.date) - new Date(a.date)
        }
      })

      return filtered
    })

    const isSessionFormValid = computed(() => {
      return sessionForm.counselorId && sessionForm.topic.trim() && 
             sessionForm.description.trim() && sessionForm.date
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getRatingCount = (rating) => {
      return sessions.value.filter(session => session.rating === rating).length
    }

    const getRatingPercentage = (rating) => {
      if (totalSessions.value === 0) return 0
      return Math.round((getRatingCount(rating) / totalSessions.value) * 100)
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

    const closeSessionForm = () => {
      showSessionForm.value = false
      // Reset form
      sessionForm.counselorId = ''
      sessionForm.topic = ''
      sessionForm.description = ''
      sessionForm.date = ''
    }

    const submitSession = async () => {
      if (!store.getters.isAuthenticated) {
        alert('Please log in to book a session')
        router.push('/login')
        return
      }

      if (!isSessionFormValid.value) {
        alert('Please fill in all required fields')
        return
      }

      isSubmitting.value = true

      try {
        const counselor = counselors.value.find(c => c.id === sessionForm.counselorId)
        const session = {
          studentId: currentUser.value.id,
          studentName: currentUser.value.name,
          counselorId: sessionForm.counselorId,
          counselorName: counselor.name,
          topic: sessionForm.topic.trim(),
          description: sessionForm.description.trim(),
          date: sessionForm.date,
          status: 'pending'
        }

        await store.dispatch('bookSession', session)
        closeSessionForm()
        alert('Session booked successfully!')
      } catch (error) {
        alert('Failed to book session. Please try again.')
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      // Load Bootstrap JS if not available
      if (typeof window !== 'undefined' && !window.bootstrap) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
        document.head.appendChild(script)
      }
    })

    return {
      showSessionForm,
      sortBy,
      filterStatus,
      isSubmitting,
      sessionForm,
      sessions,
      counselors,
      totalSessions,
      averageRating,
      currentUser,
      isCounselor,
      filteredSessions,
      isSessionFormValid,
      formatDate,
      getRatingCount,
      getRatingPercentage,
      getStatusBadgeClass,
      getStatusText,
      closeSessionForm,
      submitSession
    }
  }
}
</script>

<style scoped>
.community-container {
  min-height: 80vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 15px 15px 0 0;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.session-item:last-child {
  border-bottom: none !important;
}

.progress {
  background-color: #e9ecef;
  border-radius: 10px;
}

.modal.show {
  display: block;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 500;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
