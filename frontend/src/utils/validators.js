// src/utils/validators.js

/**
 * Valida que el email tenga formato correcto
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida que la contraseña tenga al menos 6 caracteres
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

/**
 * Valida que dos contraseñas coincidan
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword
}

/**
 * Valida que un campo no esté vacío
 */
export const isRequired = (value) => {
  return value && value.trim().length > 0
}

/**
 * Valida que el rol sea válido
 */
export const isValidRole = (role) => {
  const validRoles = ['admin', 'seller', 'customer', 'user']
  return validRoles.includes(role)
}