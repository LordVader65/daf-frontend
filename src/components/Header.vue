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
  }

  .menu-toggle {
    display: block;
  }

  nav {
    display: none; /* Hidden by default on mobile */
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