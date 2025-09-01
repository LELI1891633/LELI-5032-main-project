<template>
  <div class="home">
    <div class="jumbotron bg-primary text-white text-center py-5 mb-4">
      <div class="container">
        <h1 class="display-4">Welcome to Vue.js 3 Application</h1>
        <p class="lead">A comprehensive web application with authentication, role-based access, and review system</p>
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-light btn-lg">
          Get Started
        </router-link>
        <router-link v-else to="/dashboard" class="btn btn-light btn-lg">
          Go to Dashboard
        </router-link>
      </div>
    </div>

    <div class="container">
      <!-- Features Section -->
      <div class="row mb-5">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h5 class="card-title">🔐 Authentication</h5>
              <p class="card-text">Secure login and registration system with role-based access control.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h5 class="card-title">⭐ Reviews & Ratings</h5>
              <p class="card-text">User review system with aggregated rating scores and feedback.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <h5 class="card-title">🛡️ Security</h5>
              <p class="card-text">XSS protection and security best practices implemented.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Data Section -->
      <div class="row mb-5">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">📊 Application Statistics</h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-6">
                  <h3 class="text-primary">{{ totalReviews }}</h3>
                  <p class="text-muted">Total Reviews</p>
                </div>
                <div class="col-6">
                  <h3 class="text-success">{{ averageRating }}</h3>
                  <p class="text-muted">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">🛍️ Product Catalog</h5>
            </div>
            <div class="card-body">
              <div v-for="product in products" :key="product.id" class="d-flex justify-content-between align-items-center mb-2">
                <span>{{ product.name }}</span>
                <div>
                  <span class="badge bg-primary me-2">${{ product.price }}</span>
                  <span class="text-warning">★ {{ product.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews Section -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">💬 Recent Reviews</h5>
              <router-link to="/reviews" class="btn btn-outline-primary btn-sm">View All</router-link>
            </div>
            <div class="card-body">
              <div v-for="review in recentReviews" :key="review.id" class="border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1">{{ review.userName }}</h6>
                    <p class="text-muted mb-2">{{ review.comment }}</p>
                    <small class="text-muted">{{ formatDate(review.date) }}</small>
                  </div>
                  <div class="text-warning">
                    <span v-for="star in 5" :key="star" :class="star <= review.rating ? 'text-warning' : 'text-muted'">
                      ★
                    </span>
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
  name: 'Home',
  setup() {
    const store = useStore()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const totalReviews = computed(() => store.getters.totalReviews)
    const averageRating = computed(() => store.getters.averageRating)
    const products = computed(() => store.state.products)
    const recentReviews = computed(() => store.state.reviews.slice(0, 3))

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(() => {
      // Initialize authentication state
      store.dispatch('initializeAuth')
    })

    return {
      isAuthenticated,
      totalReviews,
      averageRating,
      products,
      recentReviews,
      formatDate
    }
  }
}
</script>

<style scoped>
.jumbotron {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
</style>
