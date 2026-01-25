<template>
  <AccessibilityMenu/>
  <div class="products-page">
    <main class="flex-grow">
      <!-- Título -->
      <div id="productos" class="text-center mt-5 text-orange-custom">
        <h1 class="display-4 fw-bold">Nuestros Productos</h1>
        <p class="opacity-70">Explora todo lo que tenemos para ti</p>
      </div>

      <!-- Filtros -->
      <section class="container mt-5">
        <div class="filter-section">
          <div class="filter-grid">
            <div>
              <label>Buscar</label>
              <input
                v-model="filters.query"
                type="text"
                placeholder="Producto"
              />
            </div>

            <div>
              <label>Precio mín.</label>
              <input
                v-model.number="filters.minPrice"
                type="number"
                min="0"
                placeholder="0.00"
              />
            </div>

            <div>
              <label>Precio máx.</label>
              <input
                v-model.number="filters.maxPrice"
                type="number"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="container my-5">
        <div class="loading-box text-center p-5 rounded">
          <div class="display-1 mb-3">⏳</div>
          <p class="h5 fw-semibold">Cargando...</p>
          <p class="small opacity-75">Preparando productos...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="container my-5">
        <div class="error-box text-center p-5 rounded">
          <div class="display-1 mb-3">⚠️</div>
          <p class="h5 fw-semibold text-danger">{{ error }}</p>
          <button @click="loadProducts" class="btn btn-primary mt-3">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Productos -->
      <section v-else class="container my-5">
        <div v-if="filteredProducts.length === 0" class="text-center p-5">
          <div class="display-1 mb-3">🔍</div>
          <p class="h5 fw-semibold">No se encontraron productos</p>
          <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
        </div>
        
        <div v-else class="products-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="product-image"
            />

            <div class="product-info">
              <h5 class="product-title">{{ product.name }}</h5>
              <p class="product-description">{{ product.description }}</p>
              <p class="product-price">${{ product.price.toFixed(2) }}</p>
            </div>

            <div class="product-actions">
              <button class="btn-detail" @click="navigateToDetail(product.id)">
                Detalle
              </button>
              <button class="btn-cart"
                @click="addToCart(product.id)">
                <Icon icon="flowbite:cart-plus-alt-solid" width="30px" height="30px" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div
        v-if="pagination.totalPages > 1"
        class="pagination-bar"
      >
        <button
          class="page-btn"
          :disabled="pagination.page === 1"
          @click="goToFirst"
          title="Primera página"
        >
          |&lt;
        </button>

        <button
          class="page-btn"
          :disabled="pagination.page === 1"
          @click="goToPrev"
          title="Página anterior"
        >
          &lt;
        </button>

        <span class="page-info">
          {{ pagination.page }} / {{ pagination.totalPages }}
        </span>

        <button
          class="page-btn"
          :disabled="pagination.page === pagination.totalPages"
          @click="goToNext"
          title="Página siguiente"
        >
          &gt;
        </button>

        <button
          class="page-btn"
          :disabled="pagination.page === pagination.totalPages"
          @click="goToLast"
          title="Última página"
        >
          &gt;|
        </button>
      </div>

      <!-- Auth Logic Modal -->
      <div v-if="showAuthModal" class="modal-overlay">
        <div class="modal-content-custom">
           <div class="text-center mb-4">
              <i class="bi bi-exclamation-circle text-warning display-1"></i>
           </div>
           <h3 class="fw-bold text-center mb-3">¡Atención!</h3>
           <p class="text-center text-muted mb-4 fs-5">
             No estás registrado. Para agregar este producto necesito estar registrado al sistema.
           </p>
           <div class="d-grid gap-2">
              <button class="btn btn-primary" @click="goToRegister">Registrarme</button>
              <button class="btn btn-outline-secondary" @click="showAuthModal = false">Cancelar / Seguir viendo</button>
           </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AccessibilityMenu from '../components/AccessibilityMenu.vue'
import productoService from '../api/ecom/producto.service'
import { useCartStore } from '../stores/cart.store'
import { useClientStore } from '../stores/client.store'
// import axios from 'axios'; // Ya no se usa directamente
import { toast } from '../utils/toast.js'


const router = useRouter()
const route = useRoute()
const loading = ref(true)
const error = ref(null)

const products = ref([])
const filters = ref({
  query: '',
  minPrice: null,
  maxPrice: null
})

const pagination = ref({
  page: 1,
  limit: 20,
  totalPages: 1,
  totalCount: 0
})

// Computed para aplicar filtros en el frontend (ya que el backend hace la búsqueda principal)
const filteredProducts = computed(() =>
  products.value.filter(p => {
    // El filtro de query ya viene del backend, pero lo mantenemos por si se quiere filtrar más
    const q =
      !filters.value.query ||
      p.name.toLowerCase().includes(filters.value.query.toLowerCase())

    const min =
      filters.value.minPrice == null || p.price >= filters.value.minPrice

    const max =
      filters.value.maxPrice == null || p.price <= filters.value.maxPrice

    return q && min && max
  })
)

const cartStore = useCartStore()
const clientStore = useClientStore()

const showAuthModal = ref(false)

const addToCart = async id => {
  // Verificar sesión
  clientStore.loadFromStorage()
  if (!clientStore.token) {
    showAuthModal.value = true
    return
  }

  try {
    await cartStore.addItem(id, 1)
    toast.success('Producto agregado al carrito')
    cartStore.openCart()
  } catch (err) {
    if (err.response?.status === 401) {
       // Si el token expiró, también mostrar modal o redirigir
       // En este caso, redirigimos al login directo o usamos el modal
       toast.info('Tu sesión ha expirado')
       router.push('/login')
    } else {
      toast.error('No se pudo agregar al carrito')
    }
  }
}

const goToRegister = () => {
  showAuthModal.value = false
  router.push('/login?mode=register')
}


const navigateToDetail = id => {
  router.push(`/products/${id}`)
}

const loadProducts = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await productoService.getAll({
      q: filters.value.query,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
      page: pagination.value.page
    })

    products.value = response.data.map(p => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion_corta,
      price: parseFloat(p.precio),
      image: p.imagen || '/images/placeholder-product.jpg',
      stock: p.stock,
      categoria: p.categoria
    }))

    pagination.value.totalPages = response.pagination.totalPages
    pagination.value.totalCount = response.pagination.totalCount
    pagination.value.limit = response.pagination.limit

  } catch (err) {
    error.value = 'No se pudieron cargar los productos.'
    products.value = []
  } finally {
    loading.value = false
  }
}

const goToFirst = () => {
  if (pagination.value.page !== 1) {
    pagination.value.page = 1
    loadProducts()
  }
}

const goToPrev = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    loadProducts()
  }
}

const goToNext = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    loadProducts()
  }
}

const goToLast = () => {
  if (pagination.value.page !== pagination.value.totalPages) {
    pagination.value.page = pagination.value.totalPages
    loadProducts()
  }
}

// Debounce para búsqueda
let searchTimeout = null

const updateURL = () => {
  router.replace({
    query: {
      ...route.query, // Mantener otros params si existen
      q: filters.value.query || undefined,
      min: filters.value.minPrice || undefined,
      max: filters.value.maxPrice || undefined,
      page: pagination.value.page > 1 ? pagination.value.page : undefined
    }
  })
}

watch(
  () => [filters.value.query, filters.value.minPrice, filters.value.maxPrice],
  () => {
    pagination.value.page = 1
    
    // Debounce
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      loadProducts()
      updateURL()
    }, 500) // 500ms debounce
  }
)

// Cargar productos al montar y leer URL
onMounted(() => {
  // Inicializar desde URL
  const { q, min, max, page } = route.query
  if (q) filters.value.query = q
  if (min) filters.value.minPrice = Number(min)
  if (max) filters.value.maxPrice = Number(max)
  if (page) pagination.value.page = Number(page)

  loadProducts()
})
</script>

<style scoped>
/* ===============================
   GENERAL
   =============================== */
.text-orange-custom {
  color: #9a3412;
}

.products-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===============================
   FILTROS (CENTRADO Y LIMPIO)
   =============================== */
.filter-section {
  display: flex;
  justify-content: center;
  background: transparent;
}

.filter-grid {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
}

.filter-grid label {
  font-weight: 700;
  margin-bottom: 0.3rem;
  display: block;
}

.filter-grid input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #c2410c;
  background: #fff;
  color: #000;
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
   GRID PRODUCTOS
   =============================== */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* ===============================
   CARD PRODUCTO
   =============================== */
.product-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform .2s, box-shadow .2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.product-description {
  color: #666;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #c2410c;
  margin-top: auto;
}

/* ===============================
   ACCIONES
   =============================== */
.product-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-detail,
.btn-cart {
  flex: 1;
  padding: .75rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-detail {
  background: #f3f4f6;
}

.btn-cart {
  background: #8f3e00;
  color: #fff;
}

.btn-cart:hover {
  background: #4d2100;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 3rem;
}

.page-btn {
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-weight: 700;
  color: #9a3412;
  min-width: 80px;
  text-align: center;
}

.page-btn:hover {
  border: 3px solid white;
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
