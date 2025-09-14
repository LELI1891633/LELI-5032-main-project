<template>
  <div class="login-container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow">
          <div class="card-header text-center bg-gradient-primary text-white">
            <h4 class="mb-0">Welcome Back</h4>
            <p class="mb-0 small">Start your mental health journey</p>
          </div>
          <div class="card-body p-4">
            <div class="mb-3">
              <small class="text-muted">
                <span class="text-danger">*</span> indicates required fields
              </small>
            </div>
            <form @submit.prevent="handleLogin" novalidate>
              <!-- Email Field -->
              <div class="mb-4">
                <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
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
              <div class="mb-4">
                <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
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

              <!-- Remember Me -->
              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="rememberMe"
                  v-model="form.rememberMe"
                />
                <label class="form-check-label" for="rememberMe">
                  Remember me
                </label>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mb-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading || !isFormValid"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Signing In...' : 'Sign In' }}
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="loginError" class="alert alert-danger">
                {{ loginError }}
              </div>
            </form>

            <hr class="my-3" />

            <div class="text-center mb-3">
              <p class="mb-0">Don't have an account?</p>
              <router-link to="/register" class="btn btn-outline-primary btn-sm">
                Create Account
              </router-link>
            </div>

            <!-- Demo Credentials and Tips Row -->
            <div class="row">
              <div class="col-md-6">
                <div class="demo-credentials">
                  <h6 class="text-muted mb-2">Demo Credentials:</h6>
                  <div class="small text-muted">
                    <div class="mb-1">
                      <strong>Counselor:</strong> counselor@example.com / counselor123
                    </div>
                    <div>
                      <strong>Student:</strong> student@example.com / student123
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mental-health-tips">
                  <h6 class="text-success mb-2">💡 Quick Tips</h6>
                  <ul class="small text-muted mb-0">
                    <li>Practice deep breathing daily</li>
                    <li>Maintain regular sleep schedule</li>
                    <li>Stay connected with others</li>
                  </ul>
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
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { validateEmail, preventXSS } from '@/utils/security'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoading = ref(false)
    const loginError = ref('')

    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    // Form validation functions
    const validateEmailField = () => {
      if (!form.email) {
        errors.email = 'Email is required'
      } else if (!validateEmail(form.email)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
    }

    const validatePassword = () => {
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long'
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
      validateEmailField()
      validatePassword()

      if (!isFormValid.value) {
        return
      }

      isLoading.value = true
      loginError.value = ''

      try {
        // Sanitize inputs before sending to store
        const sanitizedCredentials = {
          email: preventXSS(form.email.trim().toLowerCase()),
          password: form.password // Don't sanitize password
        }

        await store.dispatch('login', sanitizedCredentials)
        
        // Redirect based on user role
        const user = store.getters.currentUser
        if (user.role === 'counselor') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        loginError.value = error.message || 'Login failed. Please check your credentials and try again.'
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
      validateEmail: validateEmailField,
      validatePassword,
      clearError,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 500;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.demo-credentials {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.mental-health-tips {
  background: rgba(40, 167, 69, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #28a745;
}

.mental-health-tips ul {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.mental-health-tips li {
  margin-bottom: 0.25rem;
}

.mental-health-tips li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .card {
    margin: 0;
  }
  
  .demo-credentials,
  .mental-health-tips {
    margin-bottom: 1rem;
  }
}
</style>
