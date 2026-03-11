import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Response interceptor — auto logout on 401
import { DEV_MODE } from "../config"

api.interceptors.response.use(
  res => res,
  err => {

    if (!DEV_MODE && err.response?.status === 401) {
      logout()
    }

    return Promise.reject(err)
  }
)

export default api
