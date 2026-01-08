<script setup>
import { useLogin } from '../../assets/js/admin/login.controller'

const { user, password, login } = useLogin()
</script>

<template>
    <div class="login-container">
        <div class="login-panel">
            <h2>Ingreso de Usuarios</h2>

            <label>Login</label>
            <input v-model="user" type="text" />

            <label>Contraseña</label>
            <input v-model="password" type="password" />

            <button @click="login">Ingresar</button>
        </div>
    </div>
</template>

<style scoped src="src/assets/css/admin/admin-body.css" />