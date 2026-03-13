import axios from 'axios'
import store from '@/store'

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(config => {
    const token = store.state.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default {
    login(credentials) {
        return api.post('/login', credentials)
    },

    register(userData) {
        return api.post('/signup', userData)
    },

    logout() {
        return api.get('/logout')
    },

    getProducts() {
        return api.get('/products')
    },

    getCart() {
        return api.get('/cart')
    },

    addToCart(productId) {
        return api.post(`/cart/${productId}`)
    },

    removeFromCart(itemId) {
        return api.delete(`/cart/${itemId}`)
    },

    checkout() {
        return api.post('/order')
    },

    getOrders() {
        return api.get('/order')
    }
}