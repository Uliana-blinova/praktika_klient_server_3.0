<template>
  <div class="catalog">
    <header>
      <h1>Каталог товаров</h1>
      <nav>
        <h1 v-if="isAuthenticated">Привет!</h1>
        <router-link v-if="!isAuthenticated" to="/login">Вход</router-link>
        <router-link v-if="!isAuthenticated" to="/register">Регистрация</router-link>
        <button v-if="isAuthenticated" @click="logout">Выход</button>
        <router-link v-if="isAuthenticated" to="/cart">Корзина</router-link>
      </nav>
    </header>

    <div class="products" v-if="products.length">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="price">{{ product.price }} ₽</p>
        <button v-if="isAuthenticated" @click="addToCart(product.id)">
          В корзину
        </button>
      </div>
    </div>
    <div v-else>Загрузка...</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api'

export default {
  name: 'Catalog',
  data() {
    return { products: [] }
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  async created() {
    try {
      const response = await api.getProducts()
      this.products = response.data.data
    } catch (e) {
      console.error('Ошибка:', e)
    }
  },
  methods: {
    async addToCart(productId) {
      try {
        await api.addToCart(productId)
        alert('Добавлено!')
      } catch (e) {
        alert('Ошибка')
      }
    },
    async logout() {
      await api.logout()
      this.$store.commit('SET_TOKEN', '')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
nav {
  display: flex;
  gap: 15px;
  align-items: center;
}
.nav-link {
  color: #42b983;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #42b983;
  border-radius: 4px;
  transition: all 0.3s ease;
}
.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.product-card {
  border: 1px solid #ffffff;
  padding: 20px;
  border-radius: 8px;
}
.price {
  font-weight: bold;
  color: #42b983; }
button {
  background: #42b983;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
}
</style>