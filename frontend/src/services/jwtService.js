// src/services/jwtService.js
class JWTService {
  decodeToken(token) {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1]))
      return payload
    } catch (error) {
      console.error('Error al decodificar token:', error)
      return null
    }
  }

  verifyToken(token) {
    try {
      if (!token) return false
      
      const payload = this.decodeToken(token)
      if (!payload) return false
      
      // Verificar expiración con tolerancia de 5 minutos
      if (payload.exp) {
        const now = Date.now()
        const expTime = payload.exp * 1000
        const tolerance = 5 * 60 * 1000
        
        if (expTime + tolerance < now) {
          console.warn('Token expirado')
          return false
        }
      }
      
      return true
    } catch (error) {
      console.error('Error al verificar token:', error)
      return false
    }
  }

  getTokenRemainingTime(token) {
    try {
      const payload = this.decodeToken(token)
      if (!payload || !payload.exp) return 0
      const remainingTime = (payload.exp * 1000) - Date.now()
      return remainingTime > 0 ? remainingTime : 0
    } catch (error) {
      return 0
    }
  }
}

export default new JWTService()