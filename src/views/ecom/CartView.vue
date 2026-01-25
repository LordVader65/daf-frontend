<template>
  <AccessibilityMenu />
  <div class="container py-5">
    <h2 class="mb-4 fw-bold">Mi Carrito de Compras</h2>

    <div v-if="cartStore.loading && cartStore.isEmpty" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando tu carrito...</p>
    </div>

    <div v-else-if="cartStore.error" class="alert alert-danger" role="alert">
      {{ cartStore.error }}
      <button 
        class="btn btn-outline-danger btn-sm ms-3" 
        @click="cartStore.fetchCart"
        title="Volver a cargar el contenido del carrito"
      >
        Reintentar
      </button>
    </div>

    <div v-else-if="cartStore.isEmpty" class="text-center py-5 bg-white rounded shadow-sm">
      <i class="bi bi-cart-x display-1 text-muted mb-3 d-block"></i>
      <h3>Tu carrito está vacío</h3>
      <p class="text-muted mb-4">¿No sabes qué comprar? ¡Mira nuestros productos!</p>
      <router-link to="/products" class="btn btn-primary px-4 py-2">
        Ver Productos
      </router-link>
    </div>

    <div v-else class="row g-4">
      <!-- Lista de Productos -->
      <div class="col-lg-8" role="region" aria-label="Lista de productos en el carrito">
        <div class="cart-items">
          <ul class="list-unstyled">
             <li v-for="item in cartStore.items" :key="item.prd_codigo">
                <CartItem 
                  :item="item" 
                />
             </li>
          </ul>
        </div>

        <!-- Paginación -->
        <nav v-if="cartStore.pagination.totalPages > 1" aria-label="Navegación del carrito" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: cartStore.pagination.page === 1 }">
              <button 
                class="page-link" 
                @click="changePage(cartStore.pagination.page - 1)" 
                :disabled="cartStore.pagination.page === 1"
                aria-label="Página anterior"
                title="Ir a la página anterior de productos"
              >
                <i class="bi bi-chevron-left" aria-hidden="true"></i>
              </button>
            </li>
            
            <li class="page-item disabled">
              <span class="page-link">
                Página {{ cartStore.pagination.page }} de {{ cartStore.pagination.totalPages }}
              </span>
            </li>
            
            <li class="page-item" :class="{ disabled: cartStore.pagination.page === cartStore.pagination.totalPages }">
              <button 
                class="page-link" 
                @click="changePage(cartStore.pagination.page + 1)" 
                :disabled="cartStore.pagination.page === cartStore.pagination.totalPages"
                aria-label="Siguiente página"
                title="Ir a la siguiente página de productos"
              >
                <i class="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Resumen de Pago -->
      <div class="col-lg-4" role="region" aria-label="Resumen de compra">
        <div class="position-sticky" style="top: 2rem;">
          <CartSummary 
            :subtotal="Number(cartStore.cartInfo.crr_subtotal)" 
            :total="Number(cartStore.cartInfo.crr_total)" 
            @checkout="handleCheckout"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart.store'
import CartItem from '../../components/cart/CartItem.vue'
import CartSummary from '../../components/cart/CartSummary.vue'
import AccessibilityMenu from '../../components/AccessibilityMenu.vue'

const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
  cartStore.fetchCart(1)
})

const changePage = (page) => {
  if (page >= 1 && page <= cartStore.pagination.totalPages) {
    cartStore.fetchCart(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleCheckout = () => {
  // Lógica para ir al checkout o procesar orden
  // Por ahora redirigimos a una ruta placeholder de checkout
  router.push('/ecom/checkout')
}
</script>
