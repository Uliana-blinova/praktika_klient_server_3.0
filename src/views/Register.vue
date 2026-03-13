<template>
  <div class="auth-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="register">
      <div :class="{ 'form-group': true, error: errors.fio }">
        <input
            v-model="form.fio"
            type="text"
            placeholder="ФИО"
        />
        <div v-if="errors.fio" class="error-msg">{{ errors.fio }}</div>
      </div>

      <div :class="{ 'form-group': true, error: errors.email }">
        <input
            v-model="form.email"
            type="email"
            placeholder="Email"
        />
        <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
      </div>

      <div :class="{ 'form-group': true, error: errors.password }">
        <input
            v-model="form.password"
            type="password"
            placeholder="Пароль"
        />
        <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>

    <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
    <p><router-link to="/">Назад</router-link></p>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        fio: '',
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  methods: {
    validate() {
      this.errors = {}

      if (!this.form.fio) {
        this.errors.fio = 'Введите ФИО'
      }

      if (!this.form.email) {
        this.errors.email = 'Введите email'
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Некорректный email'
      }

      if (!this.form.password) {
        this.errors.password = 'Введите пароль'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Пароль должен быть не менее 6 символов'
      }

      return Object.keys(this.errors).length === 0
    },

    async register() {
      if (!this.validate()) {
        return
      }

      try {
        const response = await api.register(this.form)
        this.$store.commit('SET_TOKEN', response.data.data.user_token)
        this.$router.push('/')
      } catch (e) {
        if (e.response && e.response.status === 422) {
          const serverErrors = e.response.data.error.errors
          if (serverErrors.email) {
            this.errors.email = serverErrors.email[0]
          }
          if (serverErrors.fio) {
            this.errors.fio = serverErrors.fio[0]
          }
          if (serverErrors.password) {
            this.errors.password = serverErrors.password[0]
          }
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

.error-msg {
  color: #f40000;
  font-size: 22px;
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