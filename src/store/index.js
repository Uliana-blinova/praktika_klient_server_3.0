import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('user_token') || '',
    user: null,
    cart: []
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('user_token', token)
      } else {
        localStorage.removeItem('user_token')
      }
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_CART(state, cart) {
      state.cart = cart
    }
  },
  actions: {
    logout({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_USER', null)
    }
  }
})