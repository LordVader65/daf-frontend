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
        <select
          id="motivo"
          v-model="form.motivo"
          required
        >
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

const router = useRouter()

const form = reactive({
  nombre: '',
  email: '',
  motivo: '',
  mensaje: ''
})

const enviarFormulario = () => {
  if (Object.values(form).some(v => !v)) {
    alert('Complete todos los campos')
    return
  }

  alert('Mensaje enviado correctamente')

  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

const cancelar = () => {
  router.push('/')
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

/* Tarjeta */
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

/* Inputs */
input,
select,
textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  background-color: #fff;
  color: #000;
}

/* Focus accesible */
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

/* Enviar */
button[type="submit"] {
  width: 100%;
  background-color: #c2410c;
  color: #fff;
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

/* Cancelar */
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
  color: #fff;
}

/* Focus botones */
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.35);
}
</style>
