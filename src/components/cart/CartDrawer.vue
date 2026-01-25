<template>
  <div class="cart-drawer-wrapper">
    <!-- Backdrop -->
    <div 
      class="drawer-backdrop" 
      :class="{ 'show': cartStore.isCartOpen }"
      @click="cartStore.closeCart()"
    ></div>

    <!-- Drawer Panel -->
    <div class="cart-drawer" :class="{ 'open': cartStore.isCartOpen }">
      
      <!-- Header -->
      <div class="drawer-header px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-white shadow-sm">
        <h5 class="mb-0 fw-bold fs-6 text-uppercase tracking-wider">
            <i class="bi bi-bag me-2"></i>Tu Carrito
            <span class="badge bg-danger rounded-circle ms-2 px-2" style="font-size: 0.75em;">{{ cartStore.totalItems || 0 }}</span>
        </h5>
        <button class="btn-close" @click="cartStore.closeCart()" aria-label="Cerrar carrito"></button>
      </div>

      <!-- Body / Items List -->
      <div class="drawer-body p-3">
        
        <!-- Loading -->
        <div v-if="cartStore.loading && cartStore.isEmpty" class="text-center py-5">
           <div class="spinner-border text-warning" role="status"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="cartStore.isEmpty" class="text-center py-5">
            <i class="bi bi-cart-x fs-1 text-muted mb-3"></i>
            <p class="text-muted">Tu carrito está vacío</p>
            <button class="btn btn-outline-dark btn-sm" @click="cartStore.closeCart()">Seguir Comprando</button>
        </div>

        <!-- Items List -->
        <div v-else class="cart-items-list h-100 d-flex flex-column">
             
            <ul class="list-unstyled flex-grow-1 overflow-auto mb-0">
                <li v-for="item in cartStore.items" :key="item.prd_codigo" class="mb-3 border-bottom pb-3">
                    <div class="d-flex gap-3">
                        <img :src="item.prd_img || '/placeholder.png'" class="drawer-item-img border rounded" alt="img">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold text-dark" style="font-size: 0.95rem;">{{ item.prd_nombre }}</h6>
                            <p class="mb-1 text-danger fw-bold">{{ formatCurrency(item.prd_precio_venta) }}</p>
                            
                            <!-- Controls Mini -->
                            <!-- Controls Amazon Pill Style -->
                            <div class="d-flex align-items-center justify-content-between mt-2">
                                <div class="quantity-pill d-flex align-items-center justify-content-between">
                                    <!-- Delete (if 1) or Minus (if > 1) -->
                                    <button 
                                        v-if="(Number(item.pxca_cantidad) || 1) === 1" 
                                        class="btn-icon text-danger" 
                                        @click="removeItem(item)"
                                        title="Eliminar producto del carrito (esta acción no se puede deshacer)"
                                        aria-label="Eliminar producto del carrito"
                                    >
                                        <!-- SVG Trash -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                        </svg>
                                    </button>
                                    <button 
                                        v-else 
                                        class="btn-icon text-dark" 
                                        @click="updateQty(item, -1)"
                                        title="Disminuir cantidad en 1 unidad"
                                        aria-label="Disminuir cantidad del producto"
                                    >
                                        <!-- SVG Dash -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                                        </svg>
                                    </button>

                                    <!-- Quantity -->
                                    <span class="fw-bold mx-2 user-select-none">{{ item.pxca_cantidad || 1 }}</span>

                                    <!-- Plus -->
                                    <button 
                                        class="btn-icon text-dark" 
                                        @click="updateQty(item, 1)" 
                                        title="Aumentar cantidad en 1 unidad"
                                        aria-label="Aumentar cantidad del producto"
                                    >
                                        <!-- SVG Plus -->
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

             <!-- Subtotal & Actions Footer -->
             <div class="subtotal-section pt-3 border-top mt-auto bg-white sticky-bottom">
                 <p class="fs-5 mb-1 text-center">
                    Subtotal: <span class="fw-bold text-dark">{{ formatCurrency(cartStore.cartInfo?.crr_total || 0) }}</span>
                 </p>
                 <div class="progress mb-2" style="height: 6px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: 100%;"></div>
                 </div>
                 <div class="text-center mb-3">
                    <small class="fw-bold text-success"><i class="bi bi-check-circle-fill me-1"></i>Envío Gratis elegible</small>
                 </div>
                 
                 <button 
                    class="btn btn-warning w-100 fw-bold" 
                    @click="goToCheckout"
                 >
                    Proceder al pago ({{ cartStore.totalItems || 0 }} productos)
                 </button>

                 <button 
                 class="btn btn-outline-secondary w-100 mt-2 btn-sm" 
                 @click="goToCartPage"
                 >
                 Ir al Carrito
                </button>
             </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cart.store'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

const updateQty = (item, change) => {
    cartStore.updateQuantity(item.prd_codigo, Number(item.pxca_cantidad) + change)
}

const removeItem = (item) => {
    if(confirm(`¿Está seguro de eliminar "${item.prd_nombre}" del carrito? Esta acción no se puede deshacer.`)) {
        cartStore.removeItem(item.prd_codigo)
    }
}

const goToCheckout = () => {
    cartStore.closeCart()
    router.push('/ecom/checkout')
}

const goToCartPage = () => {
    cartStore.closeCart()
    router.push('/carrito')
}
</script>

<style scoped>
.cart-drawer-wrapper {
    position: relative;
    z-index: 1050; /* High z-index to overlay everything */
}

.drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
}

.drawer-backdrop.show {
    opacity: 1;
    visibility: visible;
}

.cart-drawer {
    position: fixed;
    top: 0;
    right: -320px; /* Hide off-screen */
    width: 320px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: right 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
}

.cart-drawer.open {
    right: 0;
}

.drawer-header {
    background-color: #fff;
    letter-spacing: 0.5px;
}

.drawer-body {
    flex: 1;
    overflow-y: auto;
}

.drawer-item-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px !important;
}

.quantity-group {
    width: 90px;
}

.btn-warning {
    background-color: #8f3e00;
    border-color: #8f3e00;
    color: #fff;
}

.btn-warning:hover {
    background-color: #4d2100;
    border-color: #4d2100;
    color: #fff;
}

/* Scrollbar styling for a cleaner look */
.drawer-body::-webkit-scrollbar {
  width: 6px;
}
.drawer-body::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
.drawer-body::-webkit-scrollbar-thumb {
  background: #ccc; 
  border-radius: 4px;
}

.cart-items-list h6 {
    font-size: 0.85rem !important;
    line-height: 1.2;
}

.cart-items-list p {
    font-size: 0.9rem !important;
}

/* Amazon-style Pill Control */
.quantity-pill {
    border: 1px solid #d5d9d9;
    border-radius: 20px; /* Pill shape */
    padding: 2px 8px; /* Compact */
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    min-width: 100px;
    height: 32px; /* Fixed height for alignment */
}

/* Hover effect for the whole pill to resemble Amazon interaction */
.quantity-pill:hover {
    background-color: #f7fafa;
}

.btn-icon {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 100%; /* Fill height */
    color: #0F1111;
    transition: all 0.2s ease;
}

.btn-icon:hover {
    background-color: #e7e7e7;
    border-radius: 50%; /* Circular hover */
}

/* Standalone delete button styling */
.btn-delete-standalone {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
}

.btn-delete-standalone:hover {
    background-color: #fee2e2; /* Light red bg */
}

/* Typography refinements */
.cart-items-list h6 {
    font-size: 0.9rem !important;
    line-height: 1.3;
    color: #0F1111; /* Amazon dark */
}

.cart-items-list p {
    font-size: 0.95rem !important;
}

.drawer-item-img {
    width: 70px; /* Slightly larger image */
    height: 70px;
    object-fit: contain; /* Show full product */
    background: #fff;
    padding: 2px;
    border: 1px solid #eee;
}
</style>
