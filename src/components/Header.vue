<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header>
    <!-- Logo -->
    <div class="logo-area">
      <img src="/images/logo.jpeg" alt="DAF Logo" />
      <h1>Decoraciones de Arreglos Florales</h1>
    </div>

    <!-- Botón menú móvil -->
    <button
      class="menu-toggle"
      @click="toggleMenu"
      aria-label="Abrir menú"
    >
      <Icon
        :icon="isMenuOpen ? 'mingcute:close-line' : 'mingcute:menu-line'"
        width="32"
        height="32"
      />
    </button>

    <!-- Navegación -->
    <nav
      :class="{ open: isMenuOpen }"
      aria-label="Navegación principal"
    >
      <router-link to="/" @click="closeMenu">Home</router-link>
      <router-link to="/products" @click="closeMenu">Productos</router-link>
      <router-link to="/contact" @click="closeMenu">Contáctanos</router-link>

      <router-link
        class="cart-btn"
        to="/carrito"
        @click="closeMenu"
        aria-label="Usuario"
      >
        <Icon icon="mingcute:user-1-line" width="32" height="32" />
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
/* =========================
   HEADER BASE
   ========================= */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #8f3e00;
  color: #ffffff;
}

/* =========================
   LOGO
   ========================= */
.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-area img {
  width: 48px;
}

.logo-area h1 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

/* =========================
   NAV (NORMAL)
   ========================= */
nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
}

/* Hover */
nav a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Activo */
nav a.router-link-active {
  background-color: #ffffff;
  color: #8f3e00;
}

/* Focus */
nav a:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

/* Evitar doble foco */
nav a.router-link-active:focus-visible {
  outline: none;
}

/* =========================
   HIGH CONTRAST
   ========================= */
.high-contrast header {
  background-color: #000 !important;
}

.high-contrast nav a {
  color: #ffff00 !important;
}

.high-contrast nav a.router-link-active {
  background-color: #000 !important;
  border: 2px solid #ffff00 !important;
  color: #ffff00 !important;
}

.high-contrast nav a:focus-visible {
  outline: 2px solid #ffff00 !important;
  outline-offset: 2px;
}

/* Evitar doble foco en contraste */
.high-contrast nav a.router-link-active:focus-visible {
  outline: none !important;
}

/* =========================
   BOTÓN MENÚ
   ========================= */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

/* =========================
   RESPONSIVE
   ========================= */
@media (max-width: 768px) {
  header {
    flex-wrap: wrap;
  }

  .menu-toggle {
    display: block;
  }

  nav {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  nav.open {
    display: flex;
  }
}
</style>
