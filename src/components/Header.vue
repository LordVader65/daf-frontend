<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div>
    <header>
      <div class="logo-area">
        <img src="/images/logo.jpeg" alt="DAF Logo" />
        <h1>Decoraciones de Arreglos Florales</h1>
      </div>

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

      <nav
        :class="{ open: isMenuOpen }"
        aria-label="Navegación principal"
      >
        <router-link to="/" @click="isMenuOpen = false">Home</router-link>
        <router-link to="/products" @click="isMenuOpen = false">Productos</router-link>
        <router-link to="/contact" @click="isMenuOpen = false">Contáctanos</router-link>

        <router-link
          class="cart-btn"
          to="/carrito"
          @click="isMenuOpen = false"
          aria-label="Carrito"
        >
          <Icon icon="mingcute:user-1-line" width="32" height="32" />
        </router-link>
      </nav>
    </header>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #8f3e00;
  color: #ffffff;
}

/* Logo */
.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-area img {
  width: 48px;
  height: auto;
}

.logo-area h1 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

/* Navegación */
nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

nav a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
}

/* Botón menú */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

/* Responsive */
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
