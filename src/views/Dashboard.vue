<template>
  <div class="dashboard">
    <div class="row">
      <!-- Welcome Section -->
      <div class="col-12 mb-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h2 class="card-title">Welcome, {{ currentUser?.name || 'User' }}!</h2>
            <p class="card-text">Role: <span class="badge bg-light text-dark">{{ currentUser?.role || 'user' }}</span></p>
          </div>
        </div>
      </div>

      <!-- User Stats -->
      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">📊 Your Reviews</h5>
            <h2 class="text-primary">{{ userReviews.length }}</h2>
            <p class="text-muted">Total reviews submitted</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">⭐ Average Rating</h5>
            <h2 class="text-success">{{ userAverageRating }}</h2>
            <p class="text-muted">Your average review rating</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">🛍️ Products</h5>
            <h2 class="text-info">{{ products.length }}</h2>
            <p class="text-muted">Available products</p>
          </div>
        </div>
      </div>

      <!-- User Reviews -->
      <div class="col-md-8 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Your Recent Reviews</h5>
            <router-link to="/reviews" class="btn btn-outline-primary btn-sm">View All</router-link>
          </div>
          <div class="card-body">
            <div v-if="userReviews.length === 0" class="text-center py-4">
              <p class="text-muted">No reviews yet. <router-link to="/reviews">Write your first review!</router-link></p>
            </div>
            <div v-else>
              <div v-for="review in userReviews.slice(0, 3)" :key="review.id" class="border-bottom pb-3 mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <p class="mb-1">{{ review.comment }}</p>
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

      <!-- Quick Actions -->
      <div class="col-md-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/reviews" class="btn btn-primary">
                Write a Review
              </router-link>
              <button @click="refreshData" class="btn btn-outline-secondary">
                Refresh Data
              </button>
              <button v-if="isAdmin" @click="goToAdmin" class="btn btn-warning">
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Catalog -->
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Product Catalog</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-for="product in products" :key="product.id" class="col-md-4 mb-3">
                <div class="card h-100">
                  <div class="card-body">
                    <h6 class="card-title">{{ product.name }}</h6>
                    <p class="card-text">
                      <span class="badge bg-primary me-2">${{ product.price }}</span>
                      <span class="text-warning">★ {{ product.rating }}</span>
                    </p>
                    <button @click="rateProduct(product.id)" class="btn btn-outline-primary btn-sm">
                      Rate Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Modal -->
    <div class="modal fade" id="ratingModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Rate Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Rating:</label>
              <div class="rating">
                <input type="radio" id="star5" name="rating" value="5" v-model="selectedRating" />
                <label for="star5"></label>
                <input type="radio" id="star4" name="rating" value="4" v-model="selectedRating" />
                <label for="star4"></label>
                <input type="radio" id="star3" name="rating" value="3" v-model="selectedRating" />
                <label for="star3"></label>
                <input type="radio" id="star2" name="rating" value="2" v-model="selectedRating" />
                <label for="star2"></label>
                <input type="radio" id="star1" name="rating" value="1" v-model="selectedRating" />
                <label for="star1"></label>
              </div>
            </div>
            <div class="mb-3">
              <label for="reviewComment" class="form-label">Comment:</label>
              <textarea
                id="reviewComment"
                class="form-control"
                v-model="reviewComment"
                rows="3"
                placeholder="Share your thoughts about this product..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button @click="submitRating" class="btn btn-primary" :disabled="!selectedRating">
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const router = useRouter()

    const selectedRating = ref(0)
    const reviewComment = ref('')
    const selectedProductId = ref(null)

    const currentUser = computed(() => store.getters.currentUser)
    const isAdmin = computed(() => store.getters.isAdmin)
    const products = computed(() => store.state.products)
    const userReviews = computed(() => 
      store.state.reviews.filter(review => review.userId === currentUser.value?.id)
    )
    const userAverageRating = computed(() => {
      if (userReviews.value.length === 0) return '0.0'
      const total = userReviews.value.reduce((sum, review) => sum + review.rating, 0)
      return (total / userReviews.value.length).toFixed(1)
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const refreshData = () => {
      // Simulate data refresh
      console.log('Refreshing data...')
    }

    const goToAdmin = () => {
      router.push('/admin')
    }

    const rateProduct = (productId) => {
      selectedProductId.value = productId
      selectedRating.value = 0
      reviewComment.value = ''
      
      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('ratingModal'))
      modal.show()
    }

    const submitRating = async () => {
      if (!selectedRating.value) {
        alert('Please select a rating')
        return
      }

      try {
        const review = {
          userId: currentUser.value.id,
          userName: currentUser.value.name,
          rating: selectedRating.value,
          comment: reviewComment.value || 'No comment provided',
          productId: selectedProductId.value
        }

        await store.dispatch('addReview', review)
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('ratingModal'))
        modal.hide()
        
        // Reset form
        selectedRating.value = 0
        reviewComment.value = ''
        selectedProductId.value = null
        
        alert('Review submitted successfully!')
      } catch (error) {
        alert('Failed to submit review. Please try again.')
      }
    }

    onMounted(() => {
      // Ensure user is authenticated
      if (!store.getters.isAuthenticated) {
        router.push('/login')
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
      products,
      userReviews,
      userAverageRating,
      selectedRating,
      reviewComment,
      formatDate,
      refreshData,
      goToAdmin,
      rateProduct,
      submitRating
    }
  }
}
</script>

<style scoped>
.dashboard {
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

.rating {
  display: inline-block;
  font-size: 0;
}

.rating input {
  display: none;
}

.rating label {
  float: right;
  padding: 0 0.1em;
  font-size: 1.5em;
  color: #ddd;
  cursor: pointer;
}

.rating label:before {
  content: '★';
}

.rating input:checked ~ label {
  color: #ffd700;
}

.rating label:hover,
.rating label:hover ~ label {
  color: #ffd700;
}
</style>
