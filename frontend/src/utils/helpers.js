// src/utils/helpers.js

/**
 * Formatea una fecha a string legible
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('es-ES')
  } catch {
    return 'N/A'
  }
}

/**
 * Obtiene el nombre completo del usuario
 */
export const getFullName = (user) => {
  if (!user) return 'Usuario'
  return `${user.name} ${user.lastname || ''}`.trim() || user.email
}

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Trunca un texto a una longitud máxima
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}