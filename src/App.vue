<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <span class="brand-icon">🧠</span>
          Youth Mental Health
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/community">Community</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated && isCounselor">
              <router-link class="nav-link" to="/admin">Counselor Panel</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a class="nav-link" href="#" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const isCounselor = computed(() => store.getters.isCounselor)

    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    return {
      isAuthenticated,
      isCounselor,
      logout
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.25rem;
  color: #667eea !important;
}

.brand-icon {
  margin-right: 0.5rem;
  font-size: 1.5rem;
  color: #667eea;
}

.navbar-nav .nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  color: #6c757d !important;
}

.navbar-nav .nav-link:hover {
  transform: translateY(-1px);
  color: #667eea !important;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
