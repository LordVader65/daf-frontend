<template>
  <AccessibilityMenu />
  <div class="contact-page">
    <main class="contact-wrapper">
      <form
        class="contact-card"
        @submit.prevent="enviarFormulario"
        aria-labelledby="contact-title"
      >
        <h1 id="contact-title" class="contact-title">
          Contáctanos <span aria-hidden="true">🌷</span>
        </h1>

        <!-- Nombre -->
        <label for="nombre">Nombre completo</label>
        <input
          id="nombre"
          v-model="form.nombre"
          autocomplete="name"
          required
        />

        <!-- Email -->
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          v-model="form.email"
          autocomplete="email"
          required
        />

        <!-- Motivo -->
        <label for="motivo">Motivo de la consulta</label>
        <select id="motivo" v-model="form.motivo" required>
          <option value="">Seleccione una opción</option>
          <option>Consulta sobre productos</option>
          <option>Personalización de arreglos</option>
          <option>Evento especial</option>
          <option>Estado de un pedido</option>
        </select>

        <!-- Mensaje -->
        <label for="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          v-model="form.mensaje"
          rows="4"
          required
        ></textarea>

        <!-- Acciones -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-cancel"
            :disabled="loading"
            @click="cancelar"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-submit"
            :disabled="loading"
          >
            <span v-if="!loading">Enviar</span>
            <span v-else>Enviando…</span>
          </button>
        </div>
      </form>
    </main>

    <!-- OVERLAY DE CARGA -->
    <div
      v-if="loading"
      class="loading-overlay"
      aria-live="assertive"
      aria-busy="true"
    >
      <div class="loading-box">
        <p>Enviando mensaje…</p>
      </div>
    </div>

    <!-- MODAL DE ÉXITO -->
    <div
      v-if="success"
      class="success-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
    >
      <div class="success-box">
        <h2 id="success-title">¡Mensaje enviado!</h2>
        <p>Gracias por contactarnos 🌷</p>
        <button ref="successBtn" @click="cerrarExito">
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import AccessibilityMenu from '../components/AccessibilityMenu.vue'

const router = useRouter()
const loading = ref(false)
const success = ref(false)
const successBtn = ref(null)

const form = reactive({
  nombre: '',
  email: '',
  motivo: '',
  mensaje: ''
})

const enviarFormulario = async () => {
  if (Object.values(form).some(v => !v)) return

  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.value = false
  success.value = true

  await nextTick()
  successBtn.value?.focus()
}

const cerrarExito = () => {
  success.value = false
  Object.keys(form).forEach(k => (form[k] = ''))
}

const cancelar = () => {
  router.push('/')
}
</script>

<style scoped>
/* ===============================
   MODO NORMAL (WCAG AA)
   =============================== */
.contact-page {
  min-height: 100vh;
}

.contact-wrapper {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

.contact-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.contact-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

label {
  font-weight: 700;
  margin-bottom: 0.35rem;
  display: block;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #000000;
  font-size: 0.95rem;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 1px solid #000;
  outline-offset: 2px;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

button {
  width: 100%;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: 0.6rem;
  cursor: pointer;
}

/* Botones normal */
.btn-submit {
  background-color: #c2410c;
  color: #ffffff;
}

.btn-cancel {
  background-color: transparent;
  border: 2px solid #c2410c;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:focus-visible {
  outline: 1px solid #000;
  outline-offset: 3px;
}

/* ===============================
   OVERLAYS
   =============================== */
.loading-overlay,
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-box,
.success-box {
  background: #ffffff;
  padding: 2rem 3rem;
  border-radius: 12px;
  text-align: center;
  color: #000;
}

/* ===============================
   MODAL ÉXITO
   =============================== */
.success-box h2 {
  margin-bottom: 1rem;
}

.success-box button {
  background-color: #000000;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
}

.success-box button:hover {
  background-color: #222;
}

.success-box button:focus-visible {
  outline: 1px solid #ffffff;
  outline-offset: 2px;
}

.high-contrast .form-actions button {
  line-height: 1.2;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
  align-items: center;
  display: flex;
  justify-content: center;
}

</style>
