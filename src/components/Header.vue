<script setup>
  import { ref, onMounted } from 'vue';
  import { Icon } from "@iconify/vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const isMenuOpen = ref(false);
  const isAuthenticated = ref(false);

  onMounted(() => {
    const token = localStorage.getItem("client");
    isAuthenticated.value = !!token;
  });

  const logout = () => {
    localStorage.removeItem("client");
    isAuthenticated.value = false;
    router.push('/');
  };

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
      <nav :class="{ 'open': isMenuOpen }" aria-label="Navegación principal">
        <router-link to="/" @click="isMenuOpen = false">Home</router-link>
        <router-link to="/products" @click="isMenuOpen = false">Productos</router-link>
        <router-link to="/contacto" @click="isMenuOpen = false">Contáctanos</router-link>
        <div class="dropdown">
          <a class="cart-btn" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
            <Icon icon="mingcute:user-1-line" width="32px" height="32px" />
          </a>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li v-if="!isAuthenticated">
              <router-link class="dropdown-item" to="/login">
                Registrarse
              </router-link>
            </li>

            <!-- Usuario Registrado -->
            <template v-else>
              <li>
                <router-link class="dropdown-item" to="/profile">
                  Mi Perfil
                </router-link>
              </li>

              <li>
                <router-link class="dropdown-item" to="/carrito">
                  Mi Carrito
                </router-link>
              </li>

              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                  Cerrar Sesión
                </a>
              </li>
            </template>

          </ul>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li><router-link class="dropdown-item" to="/login">Registrarse</router-link></li>
            <li><a class="dropdown-item" href="#">Mi Carrito</a></li>
          </ul>
        </div>
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
  outline: none;
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
    display: none;
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