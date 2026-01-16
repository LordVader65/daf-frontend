<script setup>
  import { ref } from 'vue';
  import { Icon } from "@iconify/vue";

  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
</script>

<template>
  <div>
    <header>
      <div class="logo-area">
        <img src="/images/logo.jpeg" alt="DAF Logo">
        <h1>Decoraciones de Arreglos Florales</h1>
      </div>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Abrir menú">
        <Icon :icon="isMenuOpen ? 'mingcute:close-line' : 'mingcute:menu-line'" width="32px" height="32px" />
      </button>

      <nav :class="{ 'open': isMenuOpen }" aria-label="Navegación principal">
        <router-link to="/" @click="isMenuOpen = false">Home</router-link>
        <router-link to="/products" @click="isMenuOpen = false">Productos</router-link>
        <router-link to="/contact" @click="isMenuOpen = false">Contáctanos</router-link>
        <router-link class="cart-btn" to="/carrito" @click="isMenuOpen = false">
          <Icon icon="mingcute:user-1-line" width="32px" height="32px" />
        </router-link>
      </nav>
    </header>
  </div>
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

@media (max-width: 768px) {
  header {
    flex-wrap: wrap;
    position: relative;
    padding: 0.5rem 1rem; /* Reduce padding slightly */
  }

  /* User Request: Flex column and reduce text size */
  .logo-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .logo-area img {
    width: 48px; /* Smaller logo */
    height: 48px;
  }

  .logo-area h1 {
    font-size: 0.9rem; /* Reduced text size */
    line-height: 1.1;
  }

  .menu-toggle {
    display: block;
    /* Absolute position to keep it reachable on the right even if logo takes width */
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  nav {
    display: none; /* Hidden by default on mobile */
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    margin-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  nav.open {
    display: flex;
  }
}
</style>
