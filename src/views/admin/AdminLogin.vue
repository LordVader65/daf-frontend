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
    /* Assuming admin-button had some styles, but we want to ensure it looks primary */
    /* We will leave the default admin-button styles for this if they exist, 
       but the user asked simply to add the cancel button. 
       However, since I am replacing the CSS import with a style block OR adding to it, 
       I must be careful.
       
       The file had <style scoped src="..." />. 
       Vue allows multiple style blocks. 
       I will ADD a new style block and KEEP the src import if possible.
       BUT the tool `replace_file_content` replaces a chunk.
       I need to make sure I don't delete the src import if I want to keep other styles.
       
       Wait, `replace_file_content` replaces lines. 
       The target content covers the WHOLE file in my thinking above? 
       No, I should just replace the necessary parts or the whole file. 
       Replacing the whole file is safer to ensure structure.
       
       I will include the src import in the new content correctly.
    */
    background-color: #c2410c; /* Matching the orange theme seen in Products */
    color: white;
}

.btn-login:hover {
    background-color: #9a3412;
}
</style>

<style scoped src="src/assets/css/admin/admin-body.css" />