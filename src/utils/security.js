export function sanitizeInput(str, max = 300) {
  if (!str) return ''
  const s = String(str).slice(0, max)
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;')
}

// Additional security validation functions
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password) {
  // At least 8 characters, uppercase, lowercase, and number/special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function validateRating(rating) {
  const num = Number(rating)
  return !isNaN(num) && num >= 1 && num <= 5 && Number.isInteger(num)
}

export function validateInputLength(input, maxLength) {
  return input && input.length <= maxLength
}

// Prevent common XSS patterns
export function preventXSS(input) {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
}
