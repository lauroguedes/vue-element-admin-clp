import request from '@/utils/request'

// Request api Laravel Passport get grant password response
export function auth(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    data: {
      grant_type: 'password',
      client_id: process.env.VUE_APP_PASSPORT_CLIENT_ID,
      client_secret: process.env.VUE_APP_PASSPORT_CLIENT_SECRET,
      username: data.username,
      password: data.password,
      scope: ''
    }
  })
}

// Get data user authenticated
export function getProfile(token) {
  return request({
    url: '/profile?include=roles',
    method: 'get',
    headers: { 'Authorization': `Bearer ${token}` }
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
