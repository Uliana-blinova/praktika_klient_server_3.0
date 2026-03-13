<template>
  <div class="auth-form">
    <h2>Вход в систему</h2>
    <form @submit.prevent="login">
      <div :class="{ 'form-group': true, error: errors.email }">
        <input
            v-model="form.email"
            type="email"
            placeholder="Email"
        />
        <div v-if="errors.email" class="error-mesg">{{ errors.email }}</div>
      </div>

      <div :class="{ 'form-group': true, error: errors.password }">
        <input
            v-model="form.password"
            type="password"
            placeholder="Пароль"
        />
        <div v-if="errors.password" class="error-mesg">{{ errors.password }}</div>
      </div>

      <button type="submit">Войти</button>
    </form>

    <p>Нет аккаунта? <router-link to="/register">Регистрация</router-link></p>
    <p><router-link to="/">Назад</router-link></p>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  methods: {
    validate() {
      this.errors = {}

      if (!this.form.email) {
        this.errors.email = 'Введите email'
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Некорректный email'
      }

      if (!this.form.password) {
        this.errors.password = 'Введите пароль'
      }

      return Object.keys(this.errors).length === 0
    },

    async login() {
      if (!this.validate()) {
        return
      }

      try {
        const response = await api.login(this.form)
        this.$store.commit('SET_TOKEN', response.data.data.user_token)
        this.$router.push('/')
      } catch (e) {
        if (e.response && e.response.status === 401) {
          this.errors.password = 'Неверный логин или пароль'
        } else {
          this.errors.email = 'Ошибка подключения к серверу'
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
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.error input {
  border: 2px solid #f40000;
}

.error-mesg {
  color: #f40000;
  font-size: 25px;
  display: block;
  margin-top: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #deea44;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

p {
  text-align: center;
  margin-top: 15px;
}

a {
  color: #42b983;
  text-decoration: none;
}

</style>