import API_CONFIG from '../config/api'

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' }
    const token = includeAuth ? this.getToken() : null
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  async handleResponse(response) {
    let data = {}
    try {
      data = await response.json()
    } catch {
      data = {}
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Error HTTP: ${response.status}`)
    }
    return data
  }

  async request(method, endpoint, data, includeAuth) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)
    try {
      const options = {
        method,
        headers: this.getHeaders(includeAuth),
        signal: controller.signal
      }
      if (data !== undefined) options.body = JSON.stringify(data)
      const response = await fetch(`${this.baseURL}${endpoint}`, options)
      return await this.handleResponse(response)
    } finally {
      clearTimeout(timeout)
    }
  }

  get(endpoint, includeAuth = true) {
    return this.request('GET', endpoint, undefined, includeAuth)
  }

  post(endpoint, data, includeAuth = true) {
    return this.request('POST', endpoint, data, includeAuth)
  }

  put(endpoint, data, includeAuth = true) {
    return this.request('PUT', endpoint, data, includeAuth)
  }

  patch(endpoint, data, includeAuth = true) {
    return this.request('PATCH', endpoint, data, includeAuth)
  }

  delete(endpoint, includeAuth = true) {
    return this.request('DELETE', endpoint, undefined, includeAuth)
  }
}

export default new HttpService()
