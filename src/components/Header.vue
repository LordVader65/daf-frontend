<template>
  <header class="main-header">
    <div class="logo-area">
      <img src="/images/logo.jpeg" alt="DAF Logo" />
      <h1>Decoraciones de Arreglos Florales</h1>
    </div>

    <nav aria-label="Navegación principal" class="main-nav">
      <router-link to="/">Home</router-link>
      <router-link to="/products">Productos</router-link>
      <router-link to="/contact">Contáctanos</router-link>

      <router-link class="cart-btn" to="/carrito" aria-label="Carrito">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2S7.5 4.019 7.5 6.5M20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1z"
          />
        </svg>
      </router-link>
    </nav>
  </header>
</template>

<style scoped>
/* ===============================
   HEADER NORMAL
   =============================== */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #8f3e00; /* color base correcto */
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
.main-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.main-nav a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
}

/* Hover normal */
.main-nav a:hover {
  text-decoration: underline;
}

/* Link activo */
.main-nav a.router-link-active {
  text-decoration: underline;
}

/* Icono carrito */
.cart-btn {
  display: flex;
  align-items: center;
}

.cart-btn svg {
  color: #ffffff;
}
</style>
