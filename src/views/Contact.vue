<template>
  <div class="contact-page">
    <main class="contact-wrapper">
      <form
        class="contact-card"
        @submit.prevent="enviarFormulario"
        aria-label="Formulario de contacto"
      >
        <h1 class="contact-title">
          Contáctanos <span aria-hidden="true">🌷</span>
        </h1>

        <label for="nombre">Nombre completo</label>
        <input
          id="nombre"
          v-model.trim="form.nombre"
          type="text"
          required
          autocomplete="name"
        />

        <label for="email">Correo electrónico</label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          required
          autocomplete="email"
        />

        <label for="motivo">Motivo de la consulta</label>
        <select id="motivo" v-model="form.motivo" required>
          <option value="">Seleccione una opción</option>
          <option>Consulta sobre productos</option>
          <option>Personalización de arreglos</option>
          <option>Evento especial</option>
          <option>Estado de un pedido</option>
        </select>

        <label for="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          v-model.trim="form.mensaje"
          rows="4"
          required
        ></textarea>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="cancelar">
            Cancelar
          </button>

          <button type="submit">
            Enviar
          </button>
        </div>
      </form>
    </main>

    <!-- OVERLAY DE CARGA -->
    <div v-if="loading" class="loading-overlay" aria-live="assertive">
      <div class="loading-box">
        <div class="dots" aria-hidden="true">
          <span>.</span><span>.</span><span>.</span>
        </div>
        <p>Enviando mensaje</p>
      </div>
    </div>

    <!-- MENSAJE DE ÉXITO -->
    <div v-if="success" class="success-overlay">
      <div class="success-box">
        <h2>¡Mensaje enviado!</h2>
        <p>Gracias por contactarnos 🌷</p>
        <button @click="cerrarExito">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const success = ref(false)

const form = reactive({
  nombre: '',
  email: '',
  motivo: '',
  mensaje: ''
})

const enviarFormulario = async () => {
  if (Object.values(form).some(v => !v)) return

  loading.value = true

  // Simulación de envío real
  await new Promise(resolve => setTimeout(resolve, 2000))

  loading.value = false
  success.value = true
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
   MODO NORMAL (DEFAULT)
   =============================== */
.contact-page {
  background-color: #fff7f2;
  min-height: 100vh;
}

.contact-wrapper {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

.contact-card {
  background: #ffffff; /* CLARO */
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
  color: #000;
}

label {
  font-weight: 700;
  margin-bottom: 0.35rem;
  display: block;
  color: #000;
}

input,
select,
textarea {
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #000000;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #c2410c;
  box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.25);
}

.form-actions {
  display: flex;
  gap: 1rem;
}

button {
  width: 100%;
  padding: 0.9rem;
  font-weight: 700;
  border-radius: 0.6rem;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #c2410c;
  color: #ffffff;
  border: none;
}

button[type="submit"]:hover {
  background-color: #9a3412;
}

.btn-cancel {
  background-color: transparent;
  color: #c2410c;
  border: 2px solid #c2410c;
}

.btn-cancel:hover {
  background-color: #c2410c;
  color: #ffffff;
}

/* ===============================
   OVERLAYS (NEUTROS)
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

/* Animación de puntos */
.dots span {
  font-size: 3rem;
  animation: blink 1.5s infinite;
}

.dots span:nth-child(2) { animation-delay: .2s }
.dots span:nth-child(3) { animation-delay: .4s }

@keyframes blink {
  0% { opacity: 0 }
  50% { opacity: 1 }
  100% { opacity: 0 }
}

.success-box h2 {
  margin-bottom: 1rem;
}

/* ===============================
   FIX MODAL ÉXITO (VISIBLE)
   =============================== */
.success-box {
  background-color: #ffffff !important;
  color: #000000 !important;
  min-width: 300px;
  z-index: 10000;
}

.success-box h2,
.success-box p {
  color: #000000 !important;
}

/* ===============================
   BOTÓN MODAL (FOCUS LIMPIO)
   =============================== */
.success-box button {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: none !important;
  outline: none !important;
}

/* HOVER */
.success-box button:hover {
  background-color: #222 !important;
}

/* FOCUS → SOLO BLANCO, SIN BORDES */
.success-box button:focus,
.success-box button:focus-visible {
  outline: 2px solid #ffffff !important;
  outline-offset: 2px;
  box-shadow: none !important;
  border: none !important;
}
</style>
