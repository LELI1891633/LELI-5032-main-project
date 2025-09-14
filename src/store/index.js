import { createStore } from 'vuex'

// Security: SHA-256 helper for password hashing
async function sha256(text) {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Mock users with hashed passwords (no plaintext stored)
const mockUsers = [
  {
    id: 1,
    email: 'counselor@example.com',
    passwordHash: '',
    name: 'Dr. Sarah Johnson',
    role: 'counselor'
  },
  {
    id: 2,
    email: 'student@example.com',
    passwordHash: '',
    name: 'Alex Chen',
    role: 'student'
  }
]

// Initialize demo password hashes asynchronously (uses the same demo passwords as UI hints)
;(async () => {
  try {
    if (!mockUsers[0].passwordHash) mockUsers[0].passwordHash = await sha256('counselor123')
    if (!mockUsers[1].passwordHash) mockUsers[1].passwordHash = await sha256('student123')
  } catch (e) {
    // best-effort; if crypto API unavailable, keep empty and login will fail safely
  }
})()

const mockSessions = [
  {
    id: 1,
    userId: 2,
    userName: 'Alex Chen',
    counselorName: 'Dr. Sarah Johnson',
    topic: 'Academic Stress Management',
    status: 'completed',
    rating: 5,
    feedback: 'The counselor was very professional and gave me many practical suggestions.',
    date: '2024-01-15'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Alex Chen',
    counselorName: 'Dr. Michael Brown',
    topic: 'Interpersonal Relationships',
    status: 'scheduled',
    rating: 0,
    feedback: '',
    date: '2024-01-20'
  }
]

const mockArticles = [
  {
    id: 1,
    title: 'How to Effectively Manage Academic Stress',
    category: 'Stress Management',
    content: 'Academic stress is a common issue among youth. This article introduces several effective stress management methods...',
    author: 'Dr. Sarah Johnson',
    views: 1250,
    rating: 4.8,
    date: '2024-01-10'
  },
  {
    id: 2,
    title: 'Practical Techniques for Emotional Regulation',
    category: 'Emotional Regulation',
    content: 'Learning to regulate emotions is an important foundation for mental health. Here are some practical techniques...',
    author: 'Dr. Michael Brown',
    views: 980,
    rating: 4.6,
    date: '2024-01-08'
  },
  {
    id: 3,
    title: 'Communication Skills to Improve Interpersonal Relationships',
    category: 'Interpersonal Relationships',
    content: 'Good interpersonal relationships are crucial for mental health. This article shares effective communication skills...',
    author: 'Dr. Emily Davis',
    views: 1100,
    rating: 4.7,
    date: '2024-01-05'
  }
]

const mockAssessments = [
  {
    id: 1,
    title: 'Stress Level Assessment',
    description: 'Assess your current stress level and understand stress sources',
    questions: 20,
    duration: '10 minutes',
    category: 'Stress Management'
  },
  {
    id: 2,
    title: 'Emotional State Assessment',
    description: 'Understand your emotional state and emotional regulation ability',
    questions: 15,
    duration: '8 minutes',
    category: 'Emotional Regulation'
  },
  {
    id: 3,
    title: 'Interpersonal Relationship Assessment',
    description: 'Assess your interpersonal relationship status and social skills',
    questions: 18,
    duration: '12 minutes',
    category: 'Interpersonal Relationships'
  }
]

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    sessions: mockSessions, // also used to store ratings
    articles: mockArticles,
    assessments: mockAssessments,
    counselors: [
      { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Youth Psychology', rating: 4.8, available: true },
      { id: 2, name: 'Dr. Michael Brown', specialization: 'Academic Stress', rating: 4.7, available: true },
      { id: 3, name: 'Dr. Emily Davis', specialization: 'Interpersonal Relationships', rating: 4.9, available: false }
    ]
  },
  
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    isCounselor: state => state.user && state.user.role === 'counselor',
    isStudent: state => state.user && state.user.role === 'student',
    totalUsers: state => mockUsers.length,
    totalSessions: state => state.sessions.length,
    completedSessions: state => state.sessions.filter(s => s.status === 'completed').length,
    averageSessionRating: state => {
      const completedSessions = state.sessions.filter(s => s.status === 'completed' && s.rating > 0)
      if (completedSessions.length === 0) return 0
      const total = completedSessions.reduce((sum, session) => sum + session.rating, 0)
      return (total / completedSessions.length).toFixed(1)
    },
    userSessions: state => userId => state.sessions.filter(s => s.userId === userId),
    counselorSessions: state => counselorName => state.sessions.filter(s => s.counselorName === counselorName),
    averageRatingByItem: (state) => (itemId) => {
      const rs = state.sessions.filter(s => s.itemId === itemId && s.rating > 0)
      if (!rs.length) return 0
      const sum = rs.reduce((a, b) => a + (b.rating || 0), 0)
      return sum / rs.length
    },
    ratingCountsByItem: (state) => (itemId) => {
      const counts = { 5:0,4:0,3:0,2:0,1:0 }
      state.sessions.forEach(s => {
        if (s.itemId === itemId && s.rating > 0) counts[s.rating]++
      })
      return counts
    },
    totalRatingsByItem: (state, getters) => (itemId) => {
      const c = getters.ratingCountsByItem(itemId)
      return Object.values(c).reduce((a,b)=>a+b,0)
    }
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    ADD_SESSION(state, session) {
      state.sessions.push({
        ...session,
        id: state.sessions.length + 1,
        date: new Date().toISOString().split('T')[0]
      })
    },
    UPDATE_SESSION(state, { sessionId, updates }) {
      const session = state.sessions.find(s => s.id === sessionId)
      if (session) {
        Object.assign(session, updates)
      }
    },
    ADD_ARTICLE(state, article) {
      state.articles.push({
        ...article,
        id: state.articles.length + 1,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        rating: 0
      })
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      const { email, password } = credentials
      const hash = await sha256(password)
      const user = mockUsers.find(u => u.email === email && u.passwordHash === hash)
      if (!user) throw new Error('Invalid email or password')
      const { passwordHash, ...userWithoutPassword } = user
      commit('SET_USER', userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    },

    async register({ commit }, userData) {
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === String(userData.email).toLowerCase())
      if (existingUser) {
        throw new Error('Email already registered')
      }
      const passwordHash = await sha256(userData.password)
      const role = userData.role || 'student'
      const newUser = {
        id: mockUsers.length + 1,
        email: userData.email,
        name: userData.name,
        role,
        passwordHash
      }
      mockUsers.push(newUser)
      const { passwordHash: _omit, ...userWithoutPassword } = newUser
      commit('SET_USER', userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return userWithoutPassword
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
    
    bookSession({ commit }, sessionData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('ADD_SESSION', {
            ...sessionData,
            status: 'scheduled',
            rating: 0,
            feedback: ''
          })
          resolve()
        }, 300)
      })
    },
    
    completeSession({ commit }, { sessionId, rating, feedback }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('UPDATE_SESSION', {
            sessionId,
            updates: {
              status: 'completed',
              rating,
              feedback
            }
          })
          resolve()
        }, 300)
      })
    },

    submitRating({ commit, state }, { itemId, userId, rating, feedback }) {
      // enforce 1..5 range
      const r = Math.min(5, Math.max(1, Number(rating) || 0))
      const existing = state.sessions.find(s => s.itemId === itemId && s.userId === userId)
      if (existing) {
        commit('UPDATE_SESSION', { sessionId: existing.id, updates: { rating: r, feedback } })
      } else {
        commit('ADD_SESSION', { itemId, userId, rating: r, feedback, date: new Date().toISOString() })
      }
    }
  }
})
