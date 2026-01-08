<template>
  <div>
    <!-- Header -->
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
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#000000" d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"/></svg>
        </router-link>
      </nav>
    </header>
  </div>
</template>