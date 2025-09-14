<template>
  <div class="register-container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 col-xl-6">
        <div class="card shadow">
          <div class="card-header text-center bg-gradient-success text-white">
            <h4 class="mb-0">Join Mental Health Community</h4>
            <p class="mb-0 small">Start your mental health growth journey</p>
          </div>
          <div class="card-body p-4">
            <div class="mb-3">
              <small class="text-muted">
                <span class="text-danger">*</span> indicates required fields
              </small>
            </div>
            <form @submit.prevent="handleRegister" novalidate>
              <!-- Name Field -->
              <div class="mb-4">
                <label for="name" class="form-label">Full Name <span class="text-danger">*</span></label>
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

              <!-- Age Field -->
              <div class="mb-4">
                <label for="age" class="form-label">Age <span class="text-danger">*</span></label>
                <input
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors.age, 'is-valid': !errors.age && form.age }"
                  id="age"
                  v-model="form.age"
                  @blur="validateAge"
                  @input="clearError('age')"
                  placeholder="Enter your age"
                  min="13"
                  max="25"
                  required
                />
                <div v-if="errors.age" class="invalid-feedback">
                  {{ errors.age }}
                </div>
                <div class="form-text">
                  This platform is designed for youth aged 13-25
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
                  placeholder="Set your password"
                  required
                />
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
                <div class="form-text">
                  Password must be at least 8 characters with uppercase, lowercase, and numbers
                </div>
              </div>

              <!-- Confirm Password Field -->
              <div class="mb-4">
                <label for="confirmPassword" class="form-label">Confirm Password <span class="text-danger">*</span></label>
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

              <!-- User Type Selection -->
              <div class="mb-4">
                <label class="form-label">User Type <span class="text-danger">*</span></label>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="student"
                    v-model="form.userType"
                    value="student"
                    @change="clearError('userType')"
                  />
                  <label class="form-check-label" for="student">
                    Student - Seeking mental health support
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="counselor"
                    v-model="form.userType"
                    value="counselor"
                    @change="clearError('userType')"
                  />
                  <label class="form-check-label" for="counselor">
                    Counselor - Providing professional services
                  </label>
                </div>
                <div v-if="errors.userType" class="invalid-feedback d-block">
                  {{ errors.userType }}
                </div>
              </div>

              <!-- Privacy Policy -->
              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    :class="{ 'is-invalid': errors.privacy }"
                    type="checkbox"
                    id="privacy"
                    v-model="form.privacy"
                    @change="clearError('privacy')"
                    required
                  />
                  <label class="form-check-label" for="privacy">
                    I have read and agree to the <a href="#" @click.prevent="showPrivacy">Privacy Policy</a> and <a href="#" @click.prevent="showTerms">Terms of Service</a> <span class="text-danger">*</span>
                  </label>
                  <div v-if="errors.privacy" class="invalid-feedback">
                    {{ errors.privacy }}
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
                Sign In Now
              </router-link>
            </div>

            <!-- Why Choose Us -->
            <div class="mt-4 p-3 bg-success bg-opacity-10 rounded">
              <h6 class="text-success">🌟 Why Choose Us?</h6>
              <ul class="small text-muted mb-0">
                <li>Professional team of mental health counselors</li>
                <li>Safe and confidential privacy protection</li>
                <li>Personalized mental health support</li>
                <li>24/7 online service support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div class="modal fade" id="privacyModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Privacy Policy</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <h6>1. Information Collection</h6>
            <p>We only collect necessary personal information for providing mental health services.</p>
            
            <h6>2. Information Protection</h6>
            <p>All personal information is encrypted and your privacy is strictly protected.</p>
            
            <h6>3. Information Usage</h6>
            <p>Your information is only used for providing mental health services and will not be used for other commercial purposes.</p>
            
            <h6>4. Information Sharing</h6>
            <p>We will not share your personal information with third parties unless required by law.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms of Service Modal -->
    <div class="modal fade" id="termsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Terms of Service</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <h6>1. Service Content</h6>
            <p>We provide professional mental health assessment, counseling, and educational services.</p>
            
            <h6>2. User Responsibilities</h6>
            <p>Users should provide accurate information and comply with platform usage guidelines.</p>
            
            <h6>3. Service Limitations</h6>
            <p>This platform does not provide emergency mental health crisis intervention. Please call relevant hotlines for emergencies.</p>
            
            <h6>4. Disclaimer</h6>
            <p>Platform services cannot replace professional medical diagnosis and treatment.</p>
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
import { validateEmail, validatePassword, preventXSS } from '@/utils/security'

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
      age: '',
      password: '',
      confirmPassword: '',
      userType: '',
      privacy: false
    })

    const errors = reactive({
      name: '',
      email: '',
      age: '',
      password: '',
      confirmPassword: '',
      userType: '',
      privacy: ''
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

    const validateEmailField = () => {
      if (!form.email) {
        errors.email = 'Email is required'
      } else if (!validateEmail(form.email)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
    }

    const validateAge = () => {
      const age = parseInt(form.age)
      if (!form.age) {
        errors.age = 'Age is required'
      } else if (age < 13 || age > 25) {
        errors.age = 'Age must be between 13-25 years'
      } else {
        errors.age = ''
      }
    }

    const validatePasswordField = () => {
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (!validatePassword(form.password)) {
        errors.password = 'Password must be at least 8 characters with uppercase, lowercase and numbers'
      } else {
        errors.password = ''
      }
      
      // Re-validate confirm password
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
      return form.name && form.email && form.age && form.password && 
             form.confirmPassword && form.userType && form.privacy && 
             !errors.name && !errors.email && !errors.age && !errors.password && 
             !errors.confirmPassword && !errors.userType && !errors.privacy
    })

    const showPrivacy = () => {
      const modal = new bootstrap.Modal(document.getElementById('privacyModal'))
      modal.show()
    }

    const showTerms = () => {
      const modal = new bootstrap.Modal(document.getElementById('termsModal'))
      modal.show()
    }

    const handleRegister = async () => {
      // Validate all fields
      validateName()
      validateEmailField()
      validateAge()
      validatePasswordField()
      validateConfirmPassword()
      
      if (!form.userType) {
        errors.userType = 'Please select user type'
      } else {
        errors.userType = ''
      }

      if (!form.privacy) {
        errors.privacy = 'Please agree to the privacy policy and terms of service'
      } else {
        errors.privacy = ''
      }

      if (!isFormValid.value) {
        return
      }

      isLoading.value = true
      registerError.value = ''

      try {
        // Sanitize inputs before sending to store
        const sanitizedUserData = {
          name: preventXSS(form.name.trim()),
          email: preventXSS(form.email.trim().toLowerCase()),
          age: parseInt(form.age),
          password: form.password,
          role: form.userType
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
      // Load Bootstrap JS dynamically
      if (typeof window !== 'undefined' && !window.bootstrap) {
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
      validateEmail: validateEmailField,
      validateAge,
      validatePassword: validatePasswordField,
      validateConfirmPassword,
      clearError,
      showPrivacy,
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  border-radius: 15px 15px 0 0 !important;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 500;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}
</style>
