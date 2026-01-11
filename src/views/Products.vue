<template>
  <div class="products-page">
    <main class="flex-grow">
      <!-- Header -->
      <div id="productos" class="text-center mt-5 text-orange-custom">
        <h1 class="display-4 font-weight-bold">Nuestros Productos</h1>
        <p class="opacity-70">Explora todo lo que tenemos para ti</p>
      </div>

      <!-- Filtros -->
      <section class="container mt-5">
        <div class="filter-section p-4 rounded">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Buscar</label>
              <input
                v-model="filters.query"
                type="text"
                placeholder="Producto"
                class="form-control rounded-3"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label fw-semibold">Precio min.</label>
              <input
                v-model.number="filters.minPrice"
                type="number"
                min="0"
                placeholder="0.00"
                class="form-control rounded-3"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label fw-semibold">Precio max.</label>
              <input
                v-model.number="filters.maxPrice"
                type="number"
                min="0"
                placeholder="0.00"
                class="form-control rounded-3"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="container my-5">
        <div class="loading-box text-center p-5 rounded shadow">
          <div class="display-1 mb-3">⏳</div>
          <p class="h5 fw-semibold">Cargando...</p>
          <p class="small opacity-75">Preparando productos...</p>
        </div>
      </div>

      <!-- Productos -->
      <section v-else class="container my-5">
        <div class="products-grid">
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
              <p class="product-price">${{ product.price }}</p>
            </div>

            <div class="product-actions">
              <button
                class="btn-detail"
                @click="navigateToDetail(product.id)"
              >
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)

const products = ref([])
const filters = ref({
  query: '',
  minPrice: null,
  maxPrice: null
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const q = !filters.value.query ||
      p.name.toLowerCase().includes(filters.value.query.toLowerCase())

    const min = filters.value.minPrice == null ||
      p.price >= filters.value.minPrice

    const max = filters.value.maxPrice == null ||
      p.price <= filters.value.maxPrice

    return q && min && max
  })
})

const navigateToDetail = (id) => {
  router.push(`/products/${id}`)
}

onMounted(() => {
  setTimeout(() => {
    products.value = [
      {
        id: 1,
        name: 'Arreglo Simple',
        description: 'Hermoso arreglo floral simple',
        price: 25,
        image: '/images/details/arreglos_simples.jpeg'
      },
      {
        id: 2,
        name: 'Corona de Flores',
        description: 'Corona artesanal con flores naturales',
        price: 45,
        image: '/images/details/corona_flores.jpg'
      },
      {
        id: 3,
        name: 'Pedestal Floral',
        description: 'Pedestal decorativo elegante',
        price: 85,
        image: '/images/details/pedestal_flores.jpg'
      }
    ]
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.text-orange-custom {
  color: #9a3412;
}

.products-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.filter-section {
  background-color: #9a3412;
  color: #fff;
}

.loading-box {
  background-color: #fdcb80;
  color: #9a3412;
}

/* Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Card */
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

.product-info {
  flex-grow: 1;
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

/* Actions */
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
