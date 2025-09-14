<template>
  <div class="dashboard-container">
    <!-- Welcome Banner -->
    <div class="welcome-banner mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="text-white mb-2">Welcome back, {{ currentUser.name }}!</h2>
            <p class="text-white-50 mb-0">
              {{ isCounselor ? 'Continue providing professional mental health support for youth' : 'Continue your mental health growth journey' }}
            </p>
          </div>
          <div class="col-md-4 text-end">
            <div class="user-avatar">
              <span class="avatar-text">{{ currentUser.name.charAt(0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalSessions }}</h3>
              <p class="stat-label">Counseling Sessions</p>
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
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalArticles }}</h3>
              <p class="stat-label">Mental Health Articles</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalAssessments }}</h3>
              <p class="stat-label">Mental Assessments</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Recent Sessions -->
        <div class="col-12 col-lg-8 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-gradient-primary text-white">
              <h5 class="mb-0">
                {{ isCounselor ? 'Recent Counseling Sessions' : 'My Counseling Records' }}
              </h5>
            </div>
            <div class="card-body">
              <div v-if="userSessions.length === 0" class="text-center py-4">
                <div class="empty-state">
                  <div class="empty-icon">💬</div>
                  <h6 class="text-muted">No counseling records yet</h6>
                  <p class="text-muted small">
                    {{ isCounselor ? 'Start providing counseling services for youth' : 'Book your first counseling session' }}
                  </p>
                  <router-link to="/community" class="btn btn-primary">
                    {{ isCounselor ? 'View Session Requests' : 'Book Session' }}
                  </router-link>
                </div>
              </div>
              <div v-else>
                <div v-for="session in userSessions.slice(0, 5)" :key="session.id" class="session-item">
                  <div class="session-header">
                    <div class="session-info">
                      <h6 class="mb-1">{{ session.topic }}</h6>
                      <p class="text-muted small mb-0">
                        {{ isCounselor ? `Student: ${session.studentName}` : `Counselor: ${session.counselorName}` }}
                      </p>
                    </div>
                    <div class="session-status">
                      <span :class="getStatusBadgeClass(session.status)">
                        {{ getStatusText(session.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="session-details">
                    <p class="text-muted small mb-2">{{ session.description }}</p>
                    <div class="session-meta">
                      <span class="text-muted small">
                        📅 {{ formatDate(session.date) }}
                      </span>
                      <span v-if="session.rating" class="text-warning small">
                        ⭐ {{ session.rating }}/5
                      </span>
                    </div>
                  </div>
                </div>
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
                <router-link to="/community" class="quick-action-item">
                  <div class="action-icon">💬</div>
                  <div class="action-text">
                    <h6>Book Session</h6>
                    <p class="small text-muted">Connect with professional counselors</p>
                  </div>
                </router-link>
                
                <router-link to="/assessments" class="quick-action-item">
                  <div class="action-icon">📋</div>
                  <div class="action-text">
                    <h6>Mental Assessment</h6>
                    <p class="small text-muted">Understand your mental health status</p>
                  </div>
                </router-link>
                
                <router-link to="/resources" class="quick-action-item">
                  <div class="action-icon">📚</div>
                  <div class="action-text">
                    <h6>Mental Health Resources</h6>
                    <p class="small text-muted">Read professional articles and resources</p>
                  </div>
                </router-link>
                
                <div v-if="isCounselor" class="quick-action-item">
                  <div class="action-icon">👥</div>
                  <div class="action-text">
                    <h6>Manage Students</h6>
                    <p class="small text-muted">View and manage student information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mental Health Tips -->
          <div class="card shadow-sm mt-4">
            <div class="card-header bg-gradient-info text-white">
              <h5 class="mb-0">💡 Mental Health Tips</h5>
            </div>
            <div class="card-body">
              <div class="tip-content">
                <h6>Today's Tip</h6>
                <p class="small text-muted">
                  Maintain a regular sleep schedule and ensure 7-8 hours of sleep daily, which is crucial for mental health.
                </p>
                <div class="tip-footer">
                  <small class="text-muted">Updated {{ formatDate(new Date()) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mental Health Articles -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-gradient-warning text-white">
              <h5 class="mb-0">📖 Recommended Reading</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="article in articles.slice(0, 3)" :key="article.id" class="col-md-4 mb-3">
                  <div class="article-card">
                    <div class="article-image">
                      <div class="image-placeholder">{{ article.category }}</div>
                    </div>
                    <div class="article-content">
                      <h6 class="article-title">{{ article.title }}</h6>
                      <p class="article-excerpt">{{ article.excerpt }}</p>
                      <div class="article-meta">
                        <span class="text-muted small">📅 {{ formatDate(article.date) }}</span>
                        <span class="text-primary small">👁️ {{ article.views }} reads</span>
                      </div>
                    </div>
                  </div>
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
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()

    const currentUser = computed(() => store.state.currentUser)
    const isCounselor = computed(() => store.getters.isCounselor)
    const isStudent = computed(() => store.getters.isStudent)

    const totalSessions = computed(() => store.getters.totalSessions)
    const averageRating = computed(() => store.getters.averageSessionRating)
    const totalArticles = computed(() => store.state.articles.length)
    const totalAssessments = computed(() => store.state.assessments.length)

    const userSessions = computed(() => {
      if (isCounselor.value) {
        return store.getters.counselorSessions(currentUser.value.id)
      } else {
        return store.getters.userSessions(currentUser.value.id)
      }
    })

    const articles = computed(() => store.state.articles)

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

    onMounted(() => {
      // Can load user-specific data here
    })

    return {
      currentUser,
      isCounselor,
      isStudent,
      totalSessions,
      averageRating,
      totalArticles,
      totalAssessments,
      userSessions,
      articles,
      formatDate,
      getStatusBadgeClass,
      getStatusText
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  border-radius: 0 0 20px 20px;
}

.user-avatar {
  display: inline-block;
}

.avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  color: white;
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

.session-item {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
}

.session-item:last-child {
  border-bottom: none;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.session-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.quick-action-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
  text-decoration: none;
  color: inherit;
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

.empty-state {
  padding: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.article-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-image {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.article-content {
  padding: 1rem;
}

.article-title {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.article-excerpt {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tip-content h6 {
  color: #17a2b8;
  margin-bottom: 0.5rem;
}

.tip-footer {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .welcome-banner {
    text-align: center;
  }
  
  .user-avatar {
    margin-top: 1rem;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
}
</style>
