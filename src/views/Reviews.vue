<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4">Community Reviews</h2>
    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Leave your rating</h5>
            <div v-if="!user" class="alert alert-warning">Please login to rate.</div>
            <form v-else @submit.prevent="submit" novalidate>
              <div class="mb-3">
                <small class="text-muted">
                  <span class="text-danger">*</span> indicates required fields
                </small>
              </div>
              <div class="mb-4">
                <label class="form-label">Rating (1–5) <span class="text-danger">*</span></label>
                <input class="form-control" type="number" min="1" max="5" v-model.number="rating" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Feedback (optional)</label>
                <textarea class="form-control" v-model.trim="feedback" maxlength="300" rows="3"
                  placeholder="Up to 300 characters"></textarea>
                <div class="form-text">{{ feedback.length }}/300</div>
              </div>
              <button class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ hasExisting ? 'Update rating' : 'Submit rating' }}
              </button>
              <div class="mt-2 text-danger" v-if="error">{{ error }}</div>
              <div class="mt-2 text-success" v-if="ok">{{ ok }}</div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Aggregated score</h5>
            <p class="mb-1 display-6">{{ avg.toFixed(1) }}</p>
            <p class="text-muted">Based on {{ total }} ratings</p>
            <ul class="list-group">
              <li class="list-group-item" v-for="n in [5,4,3,2,1]" :key="n">
                {{ n }} ★
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" :style="{width: pct(n) + '%'}"></div>
                </div>
                <small class="text-muted">{{ counts[n] }} votes</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { sanitizeInput, validateRating, preventXSS } from '@/utils/security'

const store = useStore()
// assume a fixed item to rate for demo
const ITEM_ID = 'community'

const user = computed(() => store.getters.currentUser)
const rating = ref(0)
const feedback = ref('')
const loading = ref(false)
const error = ref('')
const ok = ref('')

const counts = computed(() => store.getters.ratingCountsByItem(ITEM_ID))
const total = computed(() => store.getters.totalRatingsByItem(ITEM_ID))
const avg = computed(() => store.getters.averageRatingByItem(ITEM_ID))
const hasExisting = computed(() => {
  const u = user.value
  if (!u) return false
  // naive check: if any session exists with same item and user
  return store.state.sessions.some(s => s.itemId === ITEM_ID && s.userId === u.id)
})

function pct(n) {
  const t = total.value || 1
  return Math.round(100 * (counts.value[n] || 0) / t)
}

async function submit() {
  error.value = ''; ok.value = ''
  
  // Enhanced validation
  if (!user.value) { 
    error.value = 'Please login to submit a rating'
    return 
  }
  
  if (!validateRating(rating.value)) { 
    error.value = 'Please select a valid rating between 1 and 5'
    return 
  }
  
  // Sanitize and validate feedback
  const cleanFeedback = preventXSS(sanitizeInput(feedback.value, 300))
  
  try {
    loading.value = true
    await store.dispatch('submitRating', {
      itemId: ITEM_ID,
      userId: user.value.id,
      rating: Number(rating.value),
      feedback: cleanFeedback
    })
    ok.value = hasExisting.value ? 'Rating updated successfully!' : 'Rating submitted successfully!'
    
    // Clear form after successful submission
    rating.value = 0
    feedback.value = ''
  } catch (e) {
    error.value = e.message || 'Failed to submit rating. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.card-body {
  padding: 2rem;
}

.card-title {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-control {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 0.75rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.display-6 {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.list-group-item {
  border: none;
  padding: 1rem;
  background: #f8f9fa;
  margin-bottom: 0.5rem;
  border-radius: 10px;
}

.progress {
  background-color: #e9ecef;
  border-radius: 10px;
  margin: 0.5rem 0;
}

.progress-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.alert {
  border-radius: 10px;
  border: none;
}

.alert-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
}

.text-success {
  color: #28a745 !important;
  font-weight: 500;
}

.text-danger {
  color: #dc3545 !important;
  font-weight: 500;
}

.form-text {
  color: #6c757d;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
  
  .display-6 {
    font-size: 2.5rem;
  }
  
  .btn-primary {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>