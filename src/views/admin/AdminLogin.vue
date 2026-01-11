<script setup>
import { useRouter } from 'vue-router'
import { useLogin } from '../../assets/js/admin/login.controller'
import { Icon } from "@iconify/vue";

const router = useRouter()
const { user, password, login } = useLogin()

const cancel = () => {
    router.push('/')
}
</script>

<template>
    <div class="login-container">
        <div class="login-panel">
            <h2>Ingreso de Usuarios</h2>

            <label>Login</label>
            <input v-model="user" type="text" class="admin-input" />

            <label>Contraseña</label>
            <input v-model="password" type="password" class="admin-input" />

            <div class="d-flex flex-column flex-md-row gap-2 button-group">
                <button @click="cancel" class="admin-button btn-cancel">
                    <Icon icon="mingcute:close-line" />
                    Cancelar
                </button>
                <button @click="login" class="admin-button btn-login">
                    <Icon icon="solar:user-bold" />
                    Ingresar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Inline styles to ensure we meet the requirement without modifying the external CSS file */
.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: flex-end; /* Or space-between, user said Left and Right */
    justify-content: space-between; /* To keep them apart or just in flow */
}

.admin-button {
    flex: 1; /* Make them equal width if desired, or auto */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    border: none;
}

.btn-cancel {
    background-color: #e5e7eb;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-cancel:hover {
    background-color: #d1d5db;
}

.btn-login {
    background-color: #c2410c; /* Matching the orange theme */
    color: white;
}

.btn-login:hover {
    background-color: #9a3412;
}
</style>

<style scoped src="src/assets/css/admin/admin-body.css" />