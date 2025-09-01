<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="jumbotron text-center text-white mb-5">
      <div class="container">
        <h1 class="display-4 mb-4">Youth Mental Health Support Platform</h1>
        <p class="lead mb-4">A safe space for youth to access mental health support, counseling services, and resource sharing</p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/community" class="btn btn-primary btn-lg">
            Start Your Mental Health Journey
          </router-link>
          <router-link to="/dashboard" class="btn btn-outline-light btn-lg">
            Go to Personal Center
          </router-link>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Core Services Section -->
      <div class="row mb-5">
        <div class="col-12 text-center mb-4">
          <h2 class="section-title">Core Services</h2>
          <p class="section-subtitle">Professional mental health support tailored for youth</p>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="service-card text-center">
            <div class="service-icon">🧠</div>
            <h4>Mental Health Assessment</h4>
            <p>Professional psychological assessment tools to help you understand your mental health status and provide personalized recommendations.</p>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="service-card text-center">
            <div class="service-icon">💬</div>
            <h4>Online Counseling</h4>
            <p>Connect with professional counselors for one-on-one sessions, group therapy, and mental health support in a safe, confidential environment.</p>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="service-card text-center">
            <div class="service-icon">📚</div>
            <h4>Mental Health Resources</h4>
            <p>Access a comprehensive library of mental health articles, self-help tools, and educational resources designed specifically for youth.</p>
          </div>
        </div>
      </div>

      <!-- Platform Statistics Section -->
      <div class="row mb-5">
        <div class="col-12 text-center mb-4">
          <h2 class="section-title">Platform Statistics</h2>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="stat-card text-center">
            <h3 class="stat-number">{{ totalUsers }}</h3>
            <p class="stat-label">Registered Users</p>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="stat-card text-center">
            <h3 class="stat-number">{{ totalSessions }}</h3>
            <p class="stat-label">Counseling Sessions</p>
          </div>
        </div>
      </div>

      <!-- Mental Health Topics Section -->
      <div class="row mb-5">
        <div class="col-12 text-center mb-4">
          <h2 class="section-title">Mental Health Topics</h2>
          <p class="section-subtitle">Explore common mental health challenges and find support</p>
        </div>
        
        <div v-for="topic in mentalHealthTopics" :key="topic.id" class="col-md-4 mb-4">
          <div class="topic-card">
            <div class="topic-icon">{{ topic.icon }}</div>
            <h5>{{ topic.title }}</h5>
            <p>{{ topic.description }}</p>
          </div>
        </div>
      </div>

      <!-- User Shares Section -->
      <div class="row">
        <div class="col-12 text-center mb-4">
          <h2 class="section-title">Community Stories</h2>
          <p class="section-subtitle">Real experiences from our community members</p>
        </div>
        
        <div v-for="share in userShares" :key="share.id" class="col-md-6 mb-4">
          <div class="share-card">
            <div class="share-header">
              <div class="user-avatar">{{ share.userName.charAt(0) }}</div>
              <div class="share-info">
                <h6 class="mb-1">{{ share.userName }}</h6>
                <small class="text-muted">{{ formatDate(share.date) }}</small>
              </div>
            </div>
            <p class="share-content">{{ share.content }}</p>
            <div class="share-footer">
              <span class="text-primary">#{{ share.topic }}</span>
            </div>
          </div>
        </div>
        
        <div class="col-12 text-center mt-4">
          <router-link to="/community" class="btn btn-primary">
            View More Stories
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Home',
  setup() {
    const store = useStore()

    const totalUsers = computed(() => store.getters.totalUsers)
    const totalSessions = computed(() => store.getters.totalSessions)

    const mentalHealthTopics = computed(() => [
      {
        id: 1,
        icon: '😰',
        title: 'Anxiety & Stress',
        description: 'Learn coping strategies for managing anxiety, academic stress, and daily pressures.'
      },
      {
        id: 2,
        icon: '😔',
        title: 'Depression & Mood',
        description: 'Understand depression symptoms and find support for improving your mood and emotional well-being.'
      },
      {
        id: 3,
        icon: '👥',
        title: 'Social Relationships',
        description: 'Navigate friendships, family relationships, and social challenges with confidence.'
      },
      {
        id: 4,
        icon: '🎯',
        title: 'Academic Pressure',
        description: 'Manage academic stress, exam anxiety, and find balance between studies and personal life.'
      },
      {
        id: 5,
        icon: '💪',
        title: 'Self-Esteem',
        description: 'Build confidence, develop self-worth, and cultivate a positive self-image.'
      },
      {
        id: 6,
        icon: '🌙',
        title: 'Sleep & Wellness',
        description: 'Improve sleep quality, establish healthy routines, and enhance overall well-being.'
      }
    ])

    const userShares = computed(() => [
      {
        id: 1,
        userName: 'Sarah M.',
        content: 'The counseling sessions helped me understand my anxiety better. I learned practical techniques that I use every day.',
        topic: 'AnxietySupport',
        date: new Date('2024-01-15')
      },
      {
        id: 2,
        userName: 'Alex K.',
        content: 'This platform gave me the courage to talk about my feelings. The community is so supportive and understanding.',
        topic: 'MentalHealthJourney',
        date: new Date('2024-01-10')
      },
      {
        id: 3,
        userName: 'Emma L.',
        content: 'The resources here helped me develop better study habits and manage my academic stress effectively.',
        topic: 'AcademicWellness',
        date: new Date('2024-01-08')
      },
      {
        id: 4,
        userName: 'Jordan P.',
        content: 'I found amazing tools for building self-confidence. The articles and exercises really made a difference.',
        topic: 'SelfEsteem',
        date: new Date('2024-01-05')
      }
    ])

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return {
      totalUsers,
      totalSessions,
      mentalHealthTopics,
      userShares,
      formatDate
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.jumbotron {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 0;
  border-radius: 0 0 30px 30px;
  margin-bottom: 3rem;
}

.section-title {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.topic-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  height: 100%;
}

.topic-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.topic-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.share-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.share-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.share-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.share-content {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.share-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: white;
  color: #667eea;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .jumbotron {
    padding: 2rem 0;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .lead {
    font-size: 1rem;
  }
  
  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
