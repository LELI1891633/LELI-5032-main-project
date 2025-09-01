import { createStore } from 'vuex'

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user'
  }
]

const mockReviews = [
  {
    id: 1,
    userId: 2,
    userName: 'Regular User',
    rating: 5,
    comment: 'Great application! Very user-friendly.',
    date: '2024-01-15'
  },
  {
    id: 2,
    userId: 1,
    userName: 'Admin User',
    rating: 4,
    comment: 'Good features, but could use some improvements.',
    date: '2024-01-14'
  }
]

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    reviews: mockReviews,
    products: [
      { id: 1, name: 'Product A', price: 29.99, rating: 4.5 },
      { id: 2, name: 'Product B', price: 49.99, rating: 4.2 },
      { id: 3, name: 'Product C', price: 19.99, rating: 4.8 }
    ]
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    isAdmin: state => state.user && state.user.role === 'admin',
    isUser: state => state.user && state.user.role === 'user',
    averageRating: state => {
      if (state.reviews.length === 0) return 0
      const total = state.reviews.reduce((sum, review) => sum + review.rating, 0)
      return (total / state.reviews.length).toFixed(1)
    },
    totalReviews: state => state.reviews.length
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    ADD_REVIEW(state, review) {
      state.reviews.push({
        ...review,
        id: state.reviews.length + 1,
        date: new Date().toISOString().split('T')[0]
      })
    },
    UPDATE_PRODUCT_RATING(state, { productId, newRating }) {
      const product = state.products.find(p => p.id === productId)
      if (product) {
        product.rating = newRating
      }
    }
  },
  
  actions: {
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
          const user = mockUsers.find(u => 
            u.email === credentials.email && u.password === credentials.password
          )
          
          if (user) {
            // Remove password from user object for security
            const { password, ...userWithoutPassword } = user
            commit('SET_USER', userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            resolve(userWithoutPassword)
          } else {
            reject(new Error('Invalid credentials'))
          }
        }, 500)
      })
    },
    
    register({ commit }, userData) {
      return new Promise((resolve, reject) => {
        // Simulate API call
        setTimeout(() => {
          const existingUser = mockUsers.find(u => u.email === userData.email)
          
          if (existingUser) {
            reject(new Error('User already exists'))
            return
          }
          
          const newUser = {
            id: mockUsers.length + 1,
            ...userData,
            role: 'user' // Default role
          }
          
          // Remove password from user object for security
          const { password, ...userWithoutPassword } = newUser
          commit('SET_USER', userWithoutPassword)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword))
          resolve(userWithoutPassword)
        }, 500)
      })
    },
    
    logout({ commit }) {
      commit('SET_USER', null)
      localStorage.removeItem('user')
    },
    
    initializeAuth({ commit }) {
      const user = localStorage.getItem('user')
      if (user) {
        commit('SET_USER', JSON.parse(user))
      }
    },
    
    addReview({ commit }, review) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('ADD_REVIEW', review)
          resolve()
        }, 300)
      })
    }
  }
})
