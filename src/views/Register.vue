<template>
  <div class="register-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-header text-center bg-success text-white">
            <h4 class="mb-0">Create Account</h4>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleRegister" novalidate>
              <!-- Name Field -->
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name, 'is-valid': !errors.name && form.name }"
                  id="name"
                  v-model="form.name"
                  @blur="validateName"
                  @input="clearError('name')"
                  placeholder="Enter your full name"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

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
                <div class="form-text">
                  Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
                </div>
              </div>

              <!-- Confirm Password Field -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword, 'is-valid': !errors.confirmPassword && form.confirmPassword }"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  @blur="validateConfirmPassword"
                  @input="clearError('confirmPassword')"
                  placeholder="Confirm your password"
                  required
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.terms }"
                    type="checkbox"
                    id="terms"
                    v-model="form.terms"
                    @change="clearError('terms')"
                    required
                  />
                  <label class="form-check-label" for="terms">
                    I agree to the <a href="#" @click.prevent="showTerms">Terms and Conditions</a>
                  </label>
                  <div v-if="errors.terms" class="invalid-feedback">
                    {{ errors.terms }}
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="isLoading || !isFormValid"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="registerError" class="alert alert-danger mt-3">
                {{ registerError }}
              </div>
            </form>

            <hr class="my-4" />

            <div class="text-center">
              <p class="mb-0">Already have an account?</p>
              <router-link to="/login" class="btn btn-outline-primary">
                Login Now
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <div class="modal fade" id="termsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Terms and Conditions</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <h6>1. Account Registration</h6>
            <p>By creating an account, you agree to provide accurate and complete information.</p>
            
            <h6>2. Security</h6>
            <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
            
            <h6>3. Acceptable Use</h6>
            <p>You agree not to use the service for any unlawful purpose or to violate any applicable laws.</p>
            
            <h6>4. Privacy</h6>
            <p>Your personal information will be handled in accordance with our privacy policy.</p>
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
  name: 'Register',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isLoading = ref(false)
    const registerError = ref('')

    const form = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    })

    const errors = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: ''
    })

    // Form validation functions
    const validateName = () => {
      if (!form.name) {
        errors.name = 'Name is required'
      } else if (form.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long'
      } else if (!/^[a-zA-Z\s]+$/.test(form.name)) {
        errors.name = 'Name can only contain letters and spaces'
      } else {
        errors.name = ''
      }
    }

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
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long'
      } else if (!passwordRegex.test(form.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      } else {
        errors.password = ''
      }
      
      // Re-validate confirm password if it exists
      if (form.confirmPassword) {
        validateConfirmPassword()
      }
    }

    const validateConfirmPassword = () => {
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      } else {
        errors.confirmPassword = ''
      }
    }

    const clearError = (field) => {
      errors[field] = ''
      registerError.value = ''
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
      return form.name && form.email && form.password && form.confirmPassword && 
             form.terms && !errors.name && !errors.email && !errors.password && 
             !errors.confirmPassword && !errors.terms
    })

    const showTerms = () => {
      // Bootstrap modal functionality
      const modal = new bootstrap.Modal(document.getElementById('termsModal'))
      modal.show()
    }

    const handleRegister = async () => {
      // Validate all fields
      validateName()
      validateEmail()
      validatePassword()
      validateConfirmPassword()
      
      if (!form.terms) {
        errors.terms = 'You must agree to the terms and conditions'
      } else {
        errors.terms = ''
      }

      if (!isFormValid.value) {
        return
      }

      isLoading.value = true
      registerError.value = ''

      try {
        // Sanitize inputs before sending to store
        const sanitizedUserData = {
          name: sanitizeInput(form.name.trim()),
          email: sanitizeInput(form.email.trim()),
          password: form.password // Don't sanitize password
        }

        await store.dispatch('register', sanitizedUserData)
        router.push('/dashboard')
      } catch (error) {
        registerError.value = error.message || 'Registration failed. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      // Import Bootstrap JS for modal functionality
      if (typeof window !== 'undefined' && window.bootstrap) {
        // Bootstrap is already available
      } else {
        // Load Bootstrap JS dynamically if needed
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
        document.head.appendChild(script)
      }
    })

    return {
      form,
      errors,
      isLoading,
      registerError,
      isFormValid,
      validateName,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      clearError,
      showTerms,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
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
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.btn:disabled {
  cursor: not-allowed;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}
</style>
