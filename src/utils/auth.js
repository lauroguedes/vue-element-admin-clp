// Get header Accept of API
export function getHeaderAccept() {
  return process.env.VUE_APP_HEADER_ACCEPT
}

// Get token Laravel Passport of LocalStorage
export function getToken() {
  return localStorage.getItem('token')
}

// Set token Laravel Passport of LocalStorage
export function setToken(token) {
  localStorage.setItem('token', token)
}

// Get refresh token Laravel Passport of LocalStorage
export function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

// Set refres token Laravel Passport of LocalStorage
export function setRefreshToken(token) {
  localStorage.setItem('refresh_token', token)
}

// Get expires_in token Laravel Passport of LocalStorage
export function getExpiresInToken() {
  return localStorage.getItem('expires_in')
}

// Set expires_in token Laravel Passport of LocalStorage
export function setExpiresInToken(value) {
  localStorage.setItem('expires_in', value)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function removeRefreshToken() {
  localStorage.removeItem('refresh_token')
}
