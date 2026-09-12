// src/services/storageService.js
class StorageService {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage
    this.tokenKey = 'auth_token'
    this.userKey = 'user_data'
    this.roleKey = 'user_role'
  }

  setToken(token) {
    return this.setItem(this.tokenKey, token)
  }

  getToken() {
    return this.getItem(this.tokenKey)
  }

  removeToken() {
    return this.removeItem(this.tokenKey)
  }

  setUser(user) {
    return this.setItem(this.userKey, JSON.stringify(user))
  }

  getUser() {
    const user = this.getItem(this.userKey)
    return user ? JSON.parse(user) : null
  }

  removeUser() {
    return this.removeItem(this.userKey)
  }

  setUserRole(role) {
    return this.setItem(this.roleKey, role)
  }

  getUserRole() {
    return this.getItem(this.roleKey)
  }

  clearSession() {
    this.removeToken()
    this.removeUser()
    this.removeUserRole()
  }

  setItem(key, value) {
    try {
      this.storage.setItem(key, value)
      return true
    } catch (error) {
      console.error('Error al guardar en storage:', error)
      return false
    }
  }

  getItem(key) {
    try {
      return this.storage.getItem(key)
    } catch (error) {
      console.error('Error al obtener del storage:', error)
      return null
    }
  }

  removeItem(key) {
    try {
      this.storage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error al eliminar del storage:', error)
      return false
    }
  }

  clear() {
    try {
      this.storage.clear()
      return true
    } catch (error) {
      console.error('Error al limpiar storage:', error)
      return false
    }
  }

  hasItem(key) {
    return this.getItem(key) !== null
  }
}

export default new StorageService('localStorage')