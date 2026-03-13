<template>
  <div class="cart">
    <header>
      <h1>Корзина</h1>
      <router-link to="/" class="btn-back">← Назад</router-link>
    </header>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Корзина пуста</p>
      <router-link to="/" class="btn-continue">Продолжить покупки</router-link>
    </div>

    <div v-else>
      <div class="cart-items">
        <div v-for="group in groupedCart" :key="group.product_id" class="cart-item">
          <div class="item-info">
            <h3>{{ group.name }}</h3>
            <p class="item-description">{{ group.description }}</p>
            <p class="item-price">{{ group.price }} ₽ × {{ group.quantity }} = {{ group.total }} ₽</p>
          </div>

          <div class="item-controls">
            <button @click="decreaseQuantity(group.product_id)" class="btn-qty">−</button>
            <p class="quantity">{{ group.quantity }}</p>
            <button @click="increaseQuantity(group.product_id)" class="btn-qty">+</button>
            <button @click="removeItem(group.cart_item_id)" class="btn-remove">Удалить</button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="total">
          <p>Итого:</p>
          <div class="total-price">{{ cartTotal }} ₽</div>
        </div>
        <button @click="checkout" class="btn-checkout">Оформить заказ</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api'

export default {
  name: 'Cart',
  data() {
    return {
      cartItems: []
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    groupedCart() {
      const grouped = {}
      this.cartItems.forEach(item => {
        if (!grouped[item.product_id]) {
          grouped[item.product_id] = {
            product_id: item.product_id,
            cart_item_id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: 0,
            total: 0
          }
        }
        grouped[item.product_id].quantity++
        grouped[item.product_id].total = grouped[item.product_id].quantity * item.price
      })
      return Object.values(grouped)
    },
    cartTotal() {
      return this.groupedCart.reduce((sum, item) => sum + item.total, 0)
    }
  },
  async created() {
    await this.loadCart()
  },
  methods: {
    async loadCart() {
      try {
        const response = await api.getCart()
        this.cartItems = response.data.data
      } catch (e) {
        console.error('Ошибка загрузки корзины:', e)
        alert('Не удалось загрузить корзину')
      }
    },
    async increaseQuantity(productId) {
      try {
        await api.addToCart(productId)
        await this.loadCart()
        alert('Количество увеличено')
      } catch (e) {
        alert('Ошибка изменения количества')
      }
    },
    async decreaseQuantity(productId) {
      const item = this.cartItems.find(i => i.product_id === productId)
      if (item && item.quantity > 1) {
        try {
          await api.removeFromCart(item.id)
          await this.loadCart()
        } catch (e) {
          alert('Ошибка изменения количества')
        }
      }
    },
    async removeItem(cartItemId) {
      if (!confirm('Удалить товар из корзины?')) {
        return
      }
      try {
        await api.removeFromCart(cartItemId)
        await this.loadCart()
        alert('Товар удалён из корзины')
      } catch (e) {
        alert('Ошибка удаления товара')
      }
    },
    async checkout() {
      if (!confirm('Оформить заказ?')) {
        return
      }
      try {
        await api.checkout()
        alert('Заказ успешно оформлен!')
        this.$router.push('/')
      } catch (e) {
        if (e.response && e.response.status === 422) {
          alert('Корзина пуста')
        } else {
          alert('Ошибка оформления заказа')
        }
      }
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
.cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #42b983;
}

.btn-back {
  color: #42b983;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #42b983;
  border-radius: 4px;
}

.empty-cart {
  text-align: center;
  padding: 50px;
  color: #7f8c8d;
}

.btn-continue {
  display: inline-block;
  margin-top: 20px;
  color: #42b983;
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #42b983;
  border-radius: 4px;
}

.cart-items {
  margin-bottom: 30px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  background: #ffffff;
}

.item-info h3 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.item-description {
  color: #7f8c8d;
  font-size: 18px;
  margin-bottom: 5px;
}

.item-price {
  font-weight: bold;
  color: #42b983;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-qty {
  width: 35px;
  height: 35px;
  background-color: #42b983;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 20px;
}

.quantity {
  font-size: 25px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

.btn-remove {
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.cart-summary {
  border-top: 2px solid #42b983;
  padding-top: 20px;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.total-price {
  color: #42b983;
}

.btn-checkout {
  width: 100%;
  background-color: #42b983;
  color: #ffffff;
  border: none;
  padding: 15px;
  border-radius: 4px;
  font-size: 22px;
}

</style>