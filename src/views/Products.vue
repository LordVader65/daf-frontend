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
              <button class="btn-cart">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AccessibilityMenu from '../components/AccessibilityMenu.vue'
import productoService from '../api/ecom/producto.service'

const router = useRouter()
const loading = ref(true)
const error = ref(null)

const products = ref([])
const filters = ref({
  query: '',
  minPrice: null,
  maxPrice: null
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
      maxPrice: filters.value.maxPrice
    })
    
    // Mapear campos del backend al formato esperado por el UI
    products.value = response.data.map(p => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion_corta,
      price: parseFloat(p.precio),
      image: p.imagen || '/images/placeholder-product.jpg',
      stock: p.stock,
      categoria: p.categoria
    }))
  } catch (err) {
    console.error('Error cargando productos:', err)
    error.value = 'No se pudieron cargar los productos. Intenta nuevamente.'
    products.value = []
  } finally {
    loading.value = false
  }
}

// Debounce para búsqueda
let searchTimeout = null
watch(() => filters.value.query, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
})

// Cargar productos al montar
onMounted(() => {
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
</style>
