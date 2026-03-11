import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch { localStorage.clear() }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Send JSON body (matches your LoginRequest schema)
    const res = await api.post('/auth/login', { email, password })
    const { access_token } = res.data
    localStorage.setItem('token', access_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    // Try to get user profile
    let userData
    try {
      const meRes = await api.get('/users/me')
      userData = meRes.data
    } catch {
      // If /users/me doesn't exist, decode JWT payload as fallback
      try {
        const payload = JSON.parse(atob(access_token.split('.')[1]))
        userData = { email, role: payload.role || 'agent', id: payload.sub, is_approved: payload.is_approved ?? true }
      } catch {
        userData = { email, role: 'agent', is_approved: true }
      }
    }

    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    // POST /auth/register with { full_name, email, password, role }
    const res = await api.post('/auth/register', data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
