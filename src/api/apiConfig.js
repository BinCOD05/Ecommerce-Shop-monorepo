export const API_BASE = 'http://localhost:8081/api'

export const getAuthToken = () => sessionStorage.getItem('accessToken') || ''

export const getHeaders = (isMultipart = false) => {
  const token = getAuthToken()
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isMultipart) headers['Content-Type'] = 'application/json'
  return headers
}
