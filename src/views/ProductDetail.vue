<template>
  <AccessibilityMenu />
  <div class="product-detail-page">
    <main class="flex-grow">
      <!-- Loading -->
      <div v-if="loading" class="container my-5">
        <div class="loading-box text-center p-5 rounded">
          <div class="display-1 mb-3">⏳</div>
          <p class="h5 fw-semibold">Cargando producto...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="container my-5">
        <div class="error-box text-center p-5 rounded">
          <div class="display-1 mb-3">⚠️</div>
          <p class="h5 fw-semibold text-danger">{{ error }}</p>
          <button @click="goBack" class="btn btn-custom-dark mt-3">
            Volver al catálogo
          </button>
        </div>
      </div>

      <!-- Product Detail -->
      <section v-else class="container my-5">
        <!-- Back Button -->
        <div class="mb-4">
          <button 
            @click="goBack" 
            class="btn btn-custom-dark"
            title="Volver a la lista de productos"
          >
            <Icon icon="mdi:arrow-left" width="20" />
            Volver al catálogo
          </button>
        </div>

        <!-- Product Content -->
        <div class="row g-4">
          <!-- Image Column -->
          <div class="col-lg-6">
            <div class="product-image-container">
              <img
                :src="product.image || '/images/placeholder-product.jpg'"
                :alt="product.name"
                class="product-detail-image"
              />
            </div>
          </div>

          <!-- Details Column -->
          <div class="col-lg-6">
            <div class="product-details">
              <!-- Category Badge -->
              <div v-if="product.categoria" class="category-badge mb-3">
                {{ product.categoria }}
              </div>

              <!-- Product Name -->
              <h1 class="product-name">{{ product.name }}</h1>

              <!-- Price -->
              <div class="product-price-section my-4">
                <span class="product-price">${{ product.price.toFixed(2) }}</span>
                <span v-if="product.um_descripcion" class="price-unit">
                  / {{ product.um_descripcion }}
                </span>
              </div>

              <!-- Stock Status -->
              <div class="stock-status mb-4">
                <Icon
                  :icon="product.stock > 0 ? 'mdi:check-circle' : 'mdi:alert-circle'"
                  :class="product.stock > 0 ? 'text-success' : 'text-danger'"
                  width="20"
                />
                <span :class="product.stock > 0 ? 'text-success' : 'text-danger'">
                  {{ product.stock > 0 ? `${product.stock} disponibles` : 'Agotado' }}
                </span>
              </div>

              <!-- Short Description -->
              <div class="description-section mb-4">
                <h2 class="section-title">Descripción</h2>
                <p class="description-text">{{ product.descripcion_corta }}</p>
              </div>

              <!-- Long Description -->
              <div v-if="product.descripcion_larga" class="description-section mb-4">
                <h2 class="section-title">Detalles</h2>
                <p class="description-text">{{ product.descripcion_larga }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <button
                  class="btn-add-cart"
                  :disabled="product.stock <= 0"
                  @click="addToCart()"
                  :title="product.stock > 0 ? 'Añadir este producto a tu carrito de compras' : 'Producto no disponible actualmente'"
                >
                  <Icon icon="mdi:cart-plus" width="20" />
                  {{ product.stock > 0 ? 'Agregar al carrito' : 'No disponible' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Auth Logic Modal -->
      <div v-if="showAuthModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div class="modal-content-custom">
           <div class="text-center mb-4">
              <i class="bi bi-exclamation-circle text-warning display-1" aria-hidden="true"></i>
           </div>
           <h3 id="auth-modal-title" class="fw-bold text-center mb-3">¡Atención!</h3>
           <p class="text-center text-muted mb-4 fs-5">
             Para agregar productos al carrito necesitas iniciar sesión o registrarte en el sistema.
           </p>
           <div class="d-grid gap-2">
              <button 
                class="btn btn-primary" 
                @click="goToRegister"
                title="Ir a la página de registro para crear una cuenta"
              >
                Registrarme
              </button>
              <button 
                class="btn btn-outline-secondary" 
                @click="showAuthModal = false"
                title="Cerrar este mensaje y continuar viendo productos"
              >
                Cancelar / Seguir viendo
              </button>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AccessibilityMenu from '../components/AccessibilityMenu.vue'
import productoService from '../api/ecom/producto.service'
import { Icon } from '@iconify/vue'
import { useCartStore } from '../stores/cart.store'
import { useClientStore } from '../stores/client.store'
import { toast } from '../utils/toast.js'

const route = useRoute()
const router = useRouter()

const cartStore = useCartStore()
const clientStore = useClientStore()

const loading = ref(true)
const error = ref(null)
const product = ref({
  id: '',
  name: '',
  descripcion_corta: '',
  descripcion_larga: '',
  price: 0,
  image: '',
  stock: 0,
  categoria: '',
  um_descripcion: ''
})

const showAuthModal = ref(false)

const addToCart = async () => {
  // Verificar sesión
  clientStore.loadFromStorage()
  if (!clientStore.token) {
    showAuthModal.value = true
    return
  }

  try {
    await cartStore.addItem(product.value.id, 1)
    toast.success('Producto agregado al carrito')
    cartStore.openCart()
  } catch (err) {
    if (err.response?.status === 401) {
      toast.info('Tu sesión ha expirado')
      router.push('/login')
    } else {
      console.error(err)
      toast.error('No se pudo agregar al carrito')
    }
  }
}

const goToRegister = () => {
  showAuthModal.value = false
  router.push('/login?mode=register')
}

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const productId = route.params.id
    const data = await productoService.getById(productId)

    product.value = {
      id: data.id,
      name: data.nombre,
      descripcion_corta: data.descripcion_corta,
      descripcion_larga: data.descripcion_larga,
      price: parseFloat(data.precio),
      image: data.imagen,
      stock: data.stock,
      categoria: data.categoria,
      um_descripcion: data.um_descripcion
    }
  } catch (err) {
    console.error('Error cargando producto:', err)
    error.value = 'No se pudo cargar el producto. Puede que no exista o esté agotado.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/products')
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
/* ===============================
   GENERAL
   =============================== */
.product-detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.text-orange-custom {
  color: #9a3412;
}

/* ===============================
   LOADING & ERROR
   =============================== */
.loading-box {
  background-color: #fdcb80;
  color: #9a3412;
}

.error-box {
  background-color: #fee2e2;
  color: #991b1b;
}

/* ===============================
   BACK BUTTON
   =============================== */
.btn-custom-dark {
  background-color: #8f3e00;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid yellow;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-custom-dark:hover {
  background-color: #4d2100;
}

/* ===============================
   IMAGE
   =============================== */
.product-image-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.product-detail-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
}

/* ===============================
   PRODUCT DETAILS
   =============================== */
.product-details {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.category-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #fdcb80;
  color: #9a3412;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1rem 0;
}

.product-price-section {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.product-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #c2410c;
}

.price-unit {
  font-size: 1rem;
  color: #6b7280;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.description-text {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1rem;
}

/* ===============================
   ACTION BUTTONS
   =============================== */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-add-cart {
  flex: 1;
  padding: 1rem 2rem;
  background-color: #8f3e00;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #4d2100;
}

.btn-add-cart:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* ===============================
   RESPONSIVE
   =============================== */
@media (max-width: 768px) {
  .product-name {
    font-size: 1.5rem;
  }

  .product-price {
    font-size: 2rem;
  }

  .product-details {
    padding: 1.5rem;
  }
}

/* ===============================
   HIGH CONTRAST (ACCESSIBILITY)
   =============================== */
.high-contrast .product-details {
  background-color: #000 !important;
  color: #fff !important;
  border: 2px solid #ffffff !important;
}

.high-contrast .product-name,
.high-contrast .section-title {
  color: #ffff00 !important;
}

.high-contrast .description-text {
  color: #fff !important;
}

.high-contrast .category-badge {
  background-color: #000 !important;
  color: #ffff00 !important;
  border: 2px solid #ffff00 !important;
}

.high-contrast .btn-add-cart {
  background-color: #000 !important;
  color: #ffff00 !important;
  border: 2px solid #ffffff !important;
}

.high-contrast .btn-add-cart:hover:not(:disabled) {
  background-color: #333 !important;
}

.high-contrast .btn-back {
  background-color: #000 !important;
  color: #ffff00 !important;
  border: 2px solid #ffffff !important;
}

/* Modal Custom Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.modal-content-custom {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
