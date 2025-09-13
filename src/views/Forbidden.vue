<template>
  <div class="forbidden-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg">
          <div class="card-body text-center p-5">
            <!-- Error Icon -->
            <div class="error-icon mb-4">
              <span class="icon-403">🚫</span>
            </div>
            
            <!-- Error Title -->
            <h1 class="error-title mb-3">403 Forbidden</h1>
            <h2 class="error-subtitle mb-4">Access Denied</h2>
            
            <!-- Error Message -->
            <p class="error-message mb-4">
              Sorry, you don't have permission to access this page. 
              This area is restricted to authorized personnel only.
            </p>
            
            <!-- User Role Info -->
            <div class="user-info mb-4" v-if="currentUser">
              <div class="alert alert-info">
                <strong>Current Role:</strong> {{ currentUser.role === 'counselor' ? 'Counselor' : 'Student' }}
                <br>
                <small class="text-muted">You are logged in as: {{ currentUser.name }}</small>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="goBack" class="btn btn-outline-secondary me-3">
                <i class="fas fa-arrow-left me-2"></i>
                Go Back
              </button>
              <router-link to="/dashboard" class="btn btn-primary">
                <i class="fas fa-home me-2"></i>
                Go to Dashboard
              </router-link>
            </div>
            
            <!-- Help Text -->
            <div class="help-text mt-4">
              <p class="text-muted small">
                If you believe this is an error, please contact your administrator or 
                <a href="#" @click.prevent="contactSupport">contact support</a>.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Additional Info Card -->
        <div class="card mt-4">
          <div class="card-body">
            <h5 class="card-title">🔒 Access Control Information</h5>
            <div class="row">
              <div class="col-md-6">
                <h6>Student Access:</h6>
                <ul class="list-unstyled small">
                  <li>✅ Dashboard</li>
                  <li>✅ Community</li>
                  <li>✅ Profile Settings</li>
                  <li>❌ Admin Panel</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6>Counselor Access:</h6>
                <ul class="list-unstyled small">
                  <li>✅ Dashboard</li>
                  <li>✅ Community</li>
                  <li>✅ Admin Panel</li>
                  <li>✅ User Management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Forbidden',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const currentUser = computed(() => store.getters.currentUser)
    
    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/dashboard')
      }
    }
    
    const contactSupport = () => {
      alert('Support contact feature will be implemented in future updates.')
    }
    
    return {
      currentUser,
      goBack,
      contactSupport
    }
  }
}
</script>

<style scoped>
.forbidden-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
}

.icon-403 {
  display: inline-block;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-title {
  font-size: 3rem;
  font-weight: 700;
  color: #dc3545;
  margin: 0;
}

.error-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #6c757d;
  margin: 0;
}

.error-message {
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.6;
}

.user-info .alert {
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.action-buttons .btn {
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}

.help-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.help-text a:hover {
  text-decoration: underline;
}

.card-title {
  color: #667eea;
  font-weight: 600;
}

.list-unstyled li {
  padding: 0.25rem 0;
}

@media (max-width: 768px) {
  .forbidden-container {
    padding: 1rem;
  }
  
  .error-title {
    font-size: 2.5rem;
  }
  
  .error-subtitle {
    font-size: 1.25rem;
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style>
