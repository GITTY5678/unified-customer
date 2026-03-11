import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"
import { DEV_MODE } from "../config"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {

    // DEV MODE LOGIN (bypass backend)
    if (DEV_MODE) {
      const fakeUser = {
        id: 1,
        name: "Dev User",
        email: email,
        role: "admin"
      }

      localStorage.setItem("token", "dev-token")
      localStorage.setItem("user", JSON.stringify(fakeUser))

      api.defaults.headers.common["Authorization"] = `Bearer dev-token`

      setUser(fakeUser)

      return fakeUser
    }

    // REAL LOGIN (backend)
    const res = await api.post("/auth/login", { email, password })

    const { access_token } = res.data
    localStorage.setItem("token", access_token)

    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

    // Fetch current user profile
    const meRes = await api.get("/users/me")
    const userData = meRes.data

    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    delete api.defaults.headers.common["Authorization"]

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)