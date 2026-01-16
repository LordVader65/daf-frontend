<template>
  <AccessibilityMenu />
  <div class="contact-page">
    <main class="contact-wrapper">
      <form
        @submit.prevent="enviarFormulario"
        class="contact-card"
      >
        <h1 class="contact-title">
          Contáctanos <span>🌷</span>
        </h1>

        <label>Nombre completo</label>
        <input v-model="form.nombre" />

        <label>Correo electrónico</label>
        <input type="email" v-model="form.email" />

        <label>Motivo de la consulta</label>
        <select v-model="form.motivo">
          <option value="">Seleccione una opción</option>
          <option>Consulta sobre productos</option>
          <option>Personalización de arreglos</option>
          <option>Evento especial</option>
          <option>Estado de un pedido</option>
        </select>

        <label>Mensaje</label>
        <textarea v-model="form.mensaje" rows="4"></textarea>

        <!-- Acciones -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-cancel"
            @click="cancelar"
          >
            Cancelar
          </button>

          <button type="submit">
            Enviar
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import AccessibilityMenu from '../components/AccessibilityMenu.vue'

const router = useRouter()

const form = reactive({
  nombre: '',
  email: '',
  motivo: '',
  mensaje: ''
})

const enviarFormulario = () => {
  if (!form.nombre || !form.email || !form.motivo || !form.mensaje) {
    alert('Complete todos los campos')
    return
  }

  alert('Mensaje enviado correctamente')
  Object.keys(form).forEach(k => (form[k] = ''))
}

const cancelar = () => {
  router.push('/') // menú principal
}
</script>

<style scoped>
/* Fondo general */
.contact-page {
  background-color: #fff7f2;
  min-height: 100vh;
}

/* Contenedor centrado */
.contact-wrapper {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

/* Tarjeta del formulario */
.contact-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 520px;
}

/* Título */
.contact-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #000;
}

/* Labels */
label {
  font-weight: 600;
  margin-bottom: 0.35rem;
  display: block;
  color: #000;
}

/* Inputs generales */
input,
select,
textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  background-color: #ffffff;
  color: #000000;
}

/* Foco accesible */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #c2410c;
  box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.25);
}

/* Acciones */
.form-actions {
  display: flex;
  gap: 1rem;
}

/* Botón Enviar */
button[type="submit"] {
  width: 100%;
  background-color: #c2410c;
  color: #ffffff;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: 0.6rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

button[type="submit"]:hover {
  background-color: #9a3412;
}

/* Botón Cancelar */
.btn-cancel {
  width: 100%;
  background-color: transparent;
  color: #c2410c;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: 0.6rem;
  border: 2px solid #c2410c;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-cancel:hover {
  background-color: #c2410c;
  color: #ffffff;
}

/* Foco botones */
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.35);
}
</style>
