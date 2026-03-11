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
    // Send JSON body (matches LoginRequest schema)
    const res = await api.post('/auth/login', { email, password })
    const { access_token, user_id, name, role } = res.data

    localStorage.setItem('token', access_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

    // Backend returns name, role, user_id directly in TokenResponse — no /users/me needed
    const userData = {
      id: user_id,
      email,
      name,
      full_name: name,   // alias so existing UI using full_name still works
      role,
      is_approved: role === 'admin' ? true : true, // backend doesn't track this yet — see note below
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
