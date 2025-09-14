# Youth Mental Health Support Platform

A comprehensive web application built with Vue 3 for youth mental health support, featuring role-based access control, user reviews, and secure authentication. This platform provides a safe and accessible environment for young people to access mental health resources, connect with counselors, and participate in community discussions. The system implements robust security measures and responsive design to ensure a professional user experience across all devices.

## Features

### Authentication System
- **Login/Register**: Email and password authentication with strength validation, password confirmation consistency, and automatic login state persistence
- **User Management**: Support for multiple user accounts with secure password hashing using SHA-256

### Role-Based Access Control (RBAC)
- **Dual Roles**: Provides `counselor` and `student` roles with different authorization levels
- **Page Access Control**: Different roles can access different pages; unauthorized users are redirected to 403 Forbidden page
- **UI-Level Permissions**: Navigation menus and interface elements are dynamically shown/hidden based on user roles

### Rating System
- **User Ratings**: Users can rate resources on a 1-5 star scale and update their ratings
- **Aggregated Statistics**: Displays average ratings, total count, and star distribution with visual progress bars
- **Real-time Updates**: Rating statistics update immediately after user submissions

### Security Measures
- **XSS Protection**: Input sanitization and HTML character escaping to prevent cross-site scripting attacks
- **Form Validation**: Client-side validation for email format, password strength, and field consistency
- **No v-html Usage**: Avoids dangerous HTML injection by not using v-html directive
- **Length Restrictions**: Input length limits to prevent buffer overflow attacks
- **CSP Headers**: Content Security Policy headers to restrict external resource loading

### Responsive Design
- **Bootstrap Grid System**: Utilizes Bootstrap's responsive grid for optimal layout across devices
- **Desktop Layout**: Multi-column display for efficient use of screen space
- **Mobile Layout**: Single-column layout for optimal mobile user experience
- **Adaptive Components**: All UI components adapt seamlessly to different screen sizes

## Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` in your browser.

## Test Accounts

For demonstration and testing purposes, the following accounts are pre-configured:

### Counselor Account
- **Email**: `counselor@example.com`
- **Password**: `counselor123`
- **Access**: Full platform access including Admin Panel

### Student Account
- **Email**: `student@example.com`
- **Password**: `student123`
- **Access**: Dashboard, Community, and Reviews (no Admin Panel access)

## Testing Guide / Feature Verification

### 1. User Registration
1. Navigate to `/register`
2. Try submitting with invalid data → validation errors should appear
3. Fill in valid information → successful registration → automatic redirect to Dashboard
4. Verify user information is displayed correctly

### 2. User Login
1. Navigate to `/login`
2. Try incorrect credentials → error message should appear
3. Use correct credentials → successful login → redirect based on user role
4. Verify user information and navigation menu updates

### 3. Role-Based Access Control (RBAC)
1. Login as student (`student@example.com`)
2. Verify Admin menu is not visible in navigation
3. Manually navigate to `/admin` → should redirect to 403 Forbidden page
4. Login as counselor (`counselor@example.com`)
5. Verify Admin menu is visible and accessible

### 4. Rating System
1. Login as any user
2. Navigate to `/community` (Reviews page)
3. Submit a rating → verify average score updates
4. Submit another rating with same user → should update existing rating, not create new one
5. Verify rating distribution and statistics display correctly

### 5. Security Testing
1. In any text input field, try entering: `<script>alert('XSS')</script>`
2. Verify the script is displayed as text, not executed
3. Check that input length limits are enforced
4. Verify form validation prevents invalid submissions

## Security Implementation

### Input Sanitization & Length Limits
- All user inputs are sanitized using custom `sanitizeInput()` function
- HTML characters are escaped to prevent XSS attacks
- Input length is restricted to prevent buffer overflow

### Form Validation
- Email format validation using regex patterns
- Password strength requirements (8+ characters, uppercase, lowercase, numbers)
- Password confirmation consistency checking
- Real-time validation feedback

### No Sensitive Data Storage
- No API keys stored in frontend code
- Passwords are hashed using SHA-256 before storage
- User sessions are managed securely with localStorage

### Content Security Policy (CSP)
- CSP headers implemented to restrict external resource loading
- Prevents inline script execution
- Limits resource loading to same-origin only

### Safe HTML Rendering
- No use of `v-html` directive to prevent HTML injection
- All dynamic content is properly escaped
- Safe handling of user-generated content

## Technical Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Routing**: Vue Router with navigation guards
- **State Management**: Vuex with persistent storage
- **UI Framework**: Bootstrap 5 with custom styling
- **Security**: Custom input sanitization and validation

## Known Limitations & Future Improvements

### Current Limitations
- Uses localStorage for data persistence (simulation of backend)
- Mock data for demonstration purposes
- No real-time server communication

### Recommended Improvements for Production
- Implement server-side validation and authentication
- Use HttpOnly cookies for session management
- Add database integration for persistent data storage
- Implement real-time features with WebSocket connections
- Add comprehensive logging and monitoring
- Implement rate limiting and DDoS protection
- Add multi-factor authentication (MFA)
- Implement proper backup and disaster recovery procedures

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── composables/         # Composition API utilities
│   └── useAuth.js      # Authentication and authorization logic
├── router/             # Vue Router configuration
│   └── index.js        # Route definitions and guards
├── store/              # Vuex state management
│   └── index.js        # Global state and actions
├── utils/              # Utility functions
│   └── security.js     # Security validation functions
├── views/              # Page components
│   ├── Login.vue       # User login page
│   ├── Register.vue    # User registration page
│   ├── Dashboard.vue   # Main dashboard
│   ├── Admin.vue       # Admin panel (counselor only)
│   ├── Reviews.vue     # Rating and review system
│   └── Forbidden.vue   # 403 error page
└── App.vue             # Root component
```

## Contributing

This project was developed as an academic assignment demonstrating modern web development practices, security implementations, and user experience design principles.