<template>
  <div>
    <!-- Admin Access Bar -->
    <div class="admin-access-bar">
      <div class="container">
        <a href="/admin" class="admin-link">Acceder al área de administradores</a>
      </div>
    </div>

    <!-- Main Header -->
    <header>
      <div class="logo-area">
        <img src="/images/logo.jpeg" alt="DAF Logo">
        <h1>Decoraciones de Arreglos Florales</h1>
      </div>

      <nav aria-label="Navegación principal">
        <router-link to="/">Home</router-link>
        <router-link to="/products">Productos</router-link>
        <router-link to="/contact">Contáctanos</router-link>
        <router-link to="/carrito" class="cart-btn">🛒</router-link>
      </nav>
    </header>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-access-bar {
  background-color: #6d2f00;
  padding: 8px 0;
  text-align: center;
}

.admin-link {
  color: #f5f5f5;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
}

.admin-link:hover {
  color: #ffd4a3;
  text-decoration: underline;
}
</style>