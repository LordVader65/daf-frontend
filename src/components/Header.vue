<script setup>
  import { Icon } from "@iconify/vue";
</script>

<template>
  <div>
    <header>
      <div class="logo-area">
        <img src="/images/logo.jpeg" alt="DAF Logo">
        <h1>Decoraciones de Arreglos Florales</h1>
      </div>

      <nav aria-label="Navegación principal">
        <router-link to="/">Home</router-link>
        <router-link to="/products">Productos</router-link>
        <router-link to="/contact">Contáctanos</router-link>
        <router-link class="cart-btn" to="/carrito">
          <Icon icon="mingcute:user-1-line" width="32px" height="32px" />
        </router-link>
      </nav>
    </header>
  </div>
</template>