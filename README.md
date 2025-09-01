# Youth Mental Health Support Platform

A comprehensive Vue.js 3 application designed to provide mental health support for youth aged 13-25. This platform offers counseling services, mental health assessments, educational resources, and community support.

## Features

- **User Authentication**: Secure login and registration system with role-based access
- **Counseling Sessions**: Book and manage counseling sessions with professional counselors
- **Mental Health Assessments**: Take various psychological assessments to understand your mental health status
- **Educational Resources**: Access articles and resources on mental health topics
- **Community Support**: Connect with others and share experiences in a safe environment
- **Responsive Design**: Fully responsive interface that works on all devices

## User Roles

- **Students**: Can book counseling sessions, take assessments, and access resources
- **Counselors**: Can manage sessions, view student information, and provide professional services

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **UI Framework**: Bootstrap 5
- **Build Tool**: Vite

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Demo Credentials

- **Counselor**: counselor@example.com / counselor123
- **Student**: student@example.com / student123

## Security Features

- XSS protection through input sanitization
- Role-based authentication and authorization
- Secure password handling
- Form validation and error handling

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Reusable Vue components
├── router/          # Vue Router configuration
├── store/           # Vuex store and state management
├── views/           # Page components
└── main.js          # Application entry point
```

## Contributing

This project is designed for educational purposes and demonstrates best practices in Vue.js 3 development, including authentication, state management, and responsive design.
