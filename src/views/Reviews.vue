<template>
  <div class="reviews">
    <div class="row">
      <!-- Header Section -->
      <div class="col-12 mb-4">
        <div class="card bg-info text-white">
          <div class="card-body text-center">
            <h2 class="card-title">⭐ Reviews & Ratings</h2>
            <p class="card-text">See what others are saying about our products</p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">📊 Overall Rating</h5>
            <h2 class="text-primary">{{ averageRating }}</h2>
            <div class="text-warning mb-2">
              <span v-for="star in 5" :key="star" :class="star <= Math.round(averageRating) ? 'text-warning' : 'text-muted'">
                ★
              </span>
            </div>
            <p class="text-muted">Based on {{ totalReviews }} reviews</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">📈 Rating Distribution</h5>
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
            <h5 class="card-title">✍️ Write a Review</h5>
            <p class="card-text">Share your experience with our products</p>
            <button @click="showReviewForm = true" class="btn btn-primary">
              Write Review
            </button>
          </div>
        </div>
      </div>

      <!-- Review Form Modal -->
      <div v-if="showReviewForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Write a Review</h5>
              <button type="button" class="btn-close" @click="closeReviewForm"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitReview">
                <!-- Product Selection -->
                <div class="mb-3">
                  <label for="productSelect" class="form-label">Select Product</label>
                  <select 
                    id="productSelect" 
                    class="form-select" 
                    v-model="reviewForm.productId"
                    required
                  >
                    <option value="">Choose a product...</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }} - ${{ product.price }}
                    </option>
                  </select>
                </div>

                <!-- Rating -->
                <div class="mb-3">
                  <label class="form-label">Rating</label>
                  <div class="rating">
                    <input type="radio" id="star5" name="rating" value="5" v-model="reviewForm.rating" />
                    <label for="star5"></label>
                    <input type="radio" id="star4" name="rating" value="4" v-model="reviewForm.rating" />
                    <label for="star4"></label>
                    <input type="radio" id="star3" name="rating" value="3" v-model="reviewForm.rating" />
                    <label for="star3"></label>
                    <input type="radio" id="star2" name="rating" value="2" v-model="reviewForm.rating" />
                    <label for="star2"></label>
                    <input type="radio" id="star1" name="rating" value="1" v-model="reviewForm.rating" />
                    <label for="star1"></label>
                  </div>
                  <div v-if="reviewForm.rating" class="mt-2">
                    <span class="text-warning">
                      <span v-for="star in 5" :key="star" :class="star <= reviewForm.rating ? 'text-warning' : 'text-muted'">
                        ★
                      </span>
                    </span>
                    <span class="ms-2">{{ reviewForm.rating }} out of 5</span>
                  </div>
                </div>

                <!-- Comment -->
                <div class="mb-3">
                  <label for="reviewComment" class="form-label">Your Review</label>
                  <textarea
                    id="reviewComment"
                    class="form-control"
                    v-model="reviewForm.comment"
                    rows="4"
                    placeholder="Share your thoughts about this product..."
                    required
                  ></textarea>
                  <div class="form-text">
                    {{ reviewForm.comment.length }}/500 characters
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" @click="closeReviewForm">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="!isReviewFormValid || isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">All Reviews</h5>
            <div class="d-flex gap-2">
              <select v-model="sortBy" class="form-select form-select-sm" style="width: auto;">
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
              <select v-model="filterRating" class="form-select form-select-sm" style="width: auto;">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div v-if="filteredReviews.length === 0" class="text-center py-5">
              <p class="text-muted">No reviews found.</p>
            </div>
            <div v-else>
              <div v-for="review in filteredReviews" :key="review.id" class="review-item border-bottom pb-4 mb-4">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1">{{ review.userName }}</h6>
                    <div class="text-warning mb-2">
                      <span v-for="star in 5" :key="star" :class="star <= review.rating ? 'text-warning' : 'text-muted'">
                        ★
                      </span>
                      <span class="ms-2 text-muted">{{ review.rating }}/5</span>
                    </div>
                  </div>
                  <small class="text-muted">{{ formatDate(review.date) }}</small>
                </div>
                <p class="mb-2">{{ review.comment }}</p>
                <div v-if="review.productId" class="small text-muted">
                  Product: {{ getProductName(review.productId) }}
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
  name: 'Reviews',
  setup() {
    const store = useStore()
    const router = useRouter()

    const showReviewForm = ref(false)
    const sortBy = ref('date')
    const filterRating = ref('')
    const isSubmitting = ref(false)

    const reviewForm = reactive({
      productId: '',
      rating: 0,
      comment: ''
    })

    const reviews = computed(() => store.state.reviews)
    const products = computed(() => store.state.products)
    const totalReviews = computed(() => reviews.value.length)
    const averageRating = computed(() => store.getters.averageRating)
    const currentUser = computed(() => store.getters.currentUser)

    const filteredReviews = computed(() => {
      let filtered = [...reviews.value]

      // Filter by rating
      if (filterRating.value) {
        filtered = filtered.filter(review => review.rating === parseInt(filterRating.value))
      }

      // Sort reviews
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'rating':
            return b.rating - a.rating
          case 'name':
            return a.userName.localeCompare(b.userName)
          case 'date':
          default:
            return new Date(b.date) - new Date(a.date)
        }
      })

      return filtered
    })

    const isReviewFormValid = computed(() => {
      return reviewForm.productId && reviewForm.rating > 0 && reviewForm.comment.trim().length > 0
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getRatingCount = (rating) => {
      return reviews.value.filter(review => review.rating === rating).length
    }

    const getRatingPercentage = (rating) => {
      if (totalReviews.value === 0) return 0
      return Math.round((getRatingCount(rating) / totalReviews.value) * 100)
    }

    const getProductName = (productId) => {
      const product = products.value.find(p => p.id === productId)
      return product ? product.name : 'Unknown Product'
    }

    const closeReviewForm = () => {
      showReviewForm.value = false
      // Reset form
      reviewForm.productId = ''
      reviewForm.rating = 0
      reviewForm.comment = ''
    }

    const submitReview = async () => {
      if (!store.getters.isAuthenticated) {
        alert('Please log in to submit a review')
        router.push('/login')
        return
      }

      if (!isReviewFormValid.value) {
        alert('Please fill in all required fields')
        return
      }

      isSubmitting.value = true

      try {
        const review = {
          userId: currentUser.value.id,
          userName: currentUser.value.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
          productId: reviewForm.productId
        }

        await store.dispatch('addReview', review)
        closeReviewForm()
        alert('Review submitted successfully!')
      } catch (error) {
        alert('Failed to submit review. Please try again.')
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
      showReviewForm,
      sortBy,
      filterRating,
      isSubmitting,
      reviewForm,
      reviews,
      products,
      totalReviews,
      averageRating,
      currentUser,
      filteredReviews,
      isReviewFormValid,
      formatDate,
      getRatingCount,
      getRatingPercentage,
      getProductName,
      closeReviewForm,
      submitReview
    }
  }
}
</script>

<style scoped>
.reviews {
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

.review-item:last-child {
  border-bottom: none !important;
}

.progress {
  background-color: #e9ecef;
}

.modal.show {
  display: block;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
