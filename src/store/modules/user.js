import { login, logout, getInfo, auth, getProfile } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  // removeRefreshToken,
  getExpiresInToken,
  setExpiresInToken
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import _ from 'lodash'

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  expiresInToken: getExpiresInToken(),
  user: {},
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_EXPIRES_IN_TOKEN: (state, value) => {
    state.expiresInToken = value
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user auth Laravel Passport
  auth({ commit, dispatch }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      auth({ username: username.trim(), password: password }).then(response => {
        // const { data } = response
        // console.log(response)
        commit('SET_TOKEN', response.access_token)
        commit('SET_REFRESH_TOKEN', response.refresh_token)
        commit('SET_EXPIRES_IN_TOKEN', response.expires_in)
        setToken(response.access_token)
        setRefreshToken(response.refresh_token)
        setExpiresInToken(response.expires_in)
        // dispatch('getProfile')
        resolve()
      }).catch(error => {
        // console.log(error)
        reject(error)
      })
    })
  },

  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getProfile({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfile(state.token).then(response => {
        const data = response.data
        const roles = _.map(_.filter(response.included, ['type', 'roles']), 'attributes.name')

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_USER', data)
        commit('SET_ROLES', roles)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
