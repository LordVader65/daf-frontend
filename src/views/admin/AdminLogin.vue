<script setup>
import { useLogin } from '../../assets/js/admin/login.controller'

import Header from '../../components/Header.vue'
import Footer from '../../components/Footer.vue'
import { Icon } from "@iconify/vue";

const { user, password, login } = useLogin()

const goBack = () => {
  import('../../utils/return-to-menu.js').then(({ returnToMenu }) => {
    returnToMenu()
  })
}
</script>

<template>
    <Header />
    <div class="login-container">
        <div class="login-panel">
            <h2>Ingreso de Usuarios</h2>

            <label>Login</label>
            <input v-model="user" type="text" class="admin-input" />

            <label>Contraseña</label>
            <input v-model="password" type="password" class="admin-input" />

            <div class="d-flex flex-column flex-md-row gap-2">
                <button @click="goBack" class="admin-button">
                    <Icon icon="icon-park-outline:return" />
                    Volver al menú
                </button>
                <button @click="login" class="admin-button">
                    <Icon icon="solar:user-bold" />
                    Ingresar
                </button>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped src="src/assets/css/admin/admin-body.css" />