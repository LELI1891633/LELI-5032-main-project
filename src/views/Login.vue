<template>
  <div class="login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header text-center bg-primary text-white">
            <h4 class="mb-0">Login</h4>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleLogin" novalidate>
              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && form.email }"
                  id="email"
                  v-model="form.email"
                  @blur="validateEmail"
                  @input="clearError('email')"
                  placeholder="Enter your email"
                  required
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password, 'is-valid': !errors.password && form.password }"
                  id="password"
                  v-model="form.password"
                  @blur="validatePassword"
                  @input="clearError('password')"
                  placeholder="Enter your password"
                  required
                />
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading || !isFormValid"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="loginError" class="alert alert-danger mt-3">
                {{ loginError }}
              </div>
            </form>

            <hr class="my-4" />

            <div class="text-center">
              <p class="mb-0">Don't have an account?</p>
              <router-link to="/register" class="btn btn-outline-primary">
                Register Now
              </router-link>
            </div>

            <!-- Demo Credentials -->
            <div class="mt-4 p-3 bg-light rounded">
              <h6 class="text-muted">Demo Credentials:</h6>
              <div class="small">
                <strong>Admin:</strong> admin@example.com / admin123<br>
                <strong>User:</strong> user@example.com / user123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoading = ref(false)
    const loginError = ref('')

    const form = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    // Form validation functions
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'Email is required'
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
    }

    const validatePassword = () => {
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
      } else {
        errors.password = ''
      }
    }

    const clearError = (field) => {
      errors[field] = ''
      loginError.value = ''
    }

    // XSS Protection: Sanitize input
    const sanitizeInput = (input) => {
      if (typeof input !== 'string') return input
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
    }

    const isFormValid = computed(() => {
      return form.email && form.password && !errors.email && !errors.password
    })

    const handleLogin = async () => {
      // Validate all fields
      validateEmail()
      validatePassword()

      if (!isFormValid.value) {
        return
      }

      isLoading.value = true
      loginError.value = ''

      try {
        // Sanitize inputs before sending to store
        const sanitizedCredentials = {
          email: sanitizeInput(form.email.trim()),
          password: form.password // Don't sanitize password as it might contain special chars
        }

        await store.dispatch('login', sanitizedCredentials)
        router.push('/dashboard')
      } catch (error) {
        loginError.value = error.message || 'Login failed. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      isLoading,
      loginError,
      isFormValid,
      validateEmail,
      validatePassword,
      clearError,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  border-radius: 10px 10px 0 0 !important;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:disabled {
  cursor: not-allowed;
}
</style>
