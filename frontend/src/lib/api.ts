/// <reference types="vite/client" />
import axios from 'axios'

const envApiUrl = (import.meta as any).env?.VITE_API_URL
const rawBaseUrl = envApiUrl !== undefined && envApiUrl !== ''
  ? envApiUrl 
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8000' : '')

const baseURL = rawBaseUrl.endsWith('/api/v1') 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, '')}/api/v1`

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


