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
            <h2 class="text-center mb-2">Ingreso de Usuarios</h2>
            <p class="text-muted text-center mb-4">Ingrese sus credenciales para acceder al sistema</p>

            <form @submit.prevent="login" novalidate>
                <!-- Usuario -->
                <div class="mb-3">
                    <label for="user" class="form-label fw-semibold">
                        Usuario <span class="text-danger">*</span>
                    </label>
                    <input 
                        id="user"
                        v-model="user" 
                        type="text" 
                        class="form-control admin-input" 
                        placeholder="Ingrese su nombre de usuario"
                        required
                        autocomplete="username"
                        aria-describedby="user_help"
                    />
                    <div id="user_help" class="form-text">
                        Su nombre de usuario asignado
                    </div>
                </div>

                <!-- Contraseña -->
                <div class="mb-4">
                    <label for="password" class="form-label fw-semibold">
                        Contraseña <span class="text-danger">*</span>
                    </label>
                    <input 
                        id="password"
                        v-model="password" 
                        type="password" 
                        class="form-control admin-input" 
                        placeholder="Ingrese su contraseña"
                        required
                        autocomplete="current-password"
                        aria-describedby="password_help"
                    />
                    <div id="password_help" class="form-text">
                        Su contraseña de acceso
                    </div>
                </div>

                <hr class="my-4">

                <!-- Botones -->
                <div class="d-flex flex-column flex-md-row gap-3 button-group">
                    <button 
                        type="button"
                        @click="cancel" 
                        class="admin-button btn-cancel"
                        aria-label="Cancelar y volver al inicio"
                    >
                        <Icon icon="mingcute:close-line" />
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        class="admin-button btn-login"
                        aria-label="Iniciar sesión"
                    >
                        <Icon icon="solar:user-bold" />
                        Ingresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: flex-end;
    justify-content: space-between;
}

.admin-button {
    flex: 1;
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
    background-color: #c2410c;
    color: white;
}

.btn-login:hover {
    background-color: #9a3412;
}
</style>

<style scoped src="src/assets/css/admin/admin-body.css" />