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
      aria-controls="main-navigation"
      :aria-expanded="isMenuOpen.toString()"
    >
      <Icon
        :icon="isMenuOpen ? 'mingcute:close-line' : 'mingcute:menu-line'"
        width="32"
        height="32"
      />
    </button>

    <!-- Navegación -->
    <nav
      id="main-navigation"
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
        aria-label="Carrito"
      >
        <Icon icon="mingcute:user-1-line" width="32" height="32" />
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
}

/* =========================
   RESPONSIVE
   ========================= */
@media (max-width: 768px) {
  header {
    flex-wrap: wrap;
    position: relative;
  }

  .menu-toggle {
    display: block;
  }

  nav {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  nav.open {
    display: flex;
  }
}
</style>
