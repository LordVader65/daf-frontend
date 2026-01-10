<template>
  <div class="products-page">
    <main class="flex-grow">
      <div id="productos" class="text-center mt-5 text-orange-custom">
        <h1 class="display-4 font-weight-bold">Nuestros Productos</h1>
        <p class="opacity-70">Explora todo lo que tenemos para ti</p>
      </div>

      <section class="container mt-5">
        <div class="filter-section p-4 rounded">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label font-weight-semibold">Buscar</label>
              <input
                placeholder="Producto"
                v-model="filters.query"
                type="text"
                class="form-control rounded-3"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label font-weight-semibold">Precio min.</label>
              <input
                placeholder="0.00"
                v-model.number="filters.minPrice"
                type="number"
                min="0"
                class="form-control rounded-3"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label font-weight-semibold">Precio max.</label>
              <input
                placeholder="0.00"
                v-model.number="filters.maxPrice"
                type="number"
                min="0"
                class="form-control rounded-3"
              />
            </div>
          </div>
        </div>
      </section>

      <div v-if="loading" class="container my-5">
        <div class="loading-box text-center p-5 rounded shadow">
          <div class="display-1 mb-3">⏳</div>
          <p class="h5 font-weight-semibold">Cargando...</p>
          <p class="small opacity-75">Preparando productos...</p>
        </div>
      </div>

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
              <p class="product-price">
                ${{ product.price }}
              </p>
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
  return products.value.filter(product => {
    const matchesQuery =
      !filters.value.query ||
      product.name.toLowerCase().includes(filters.value.query.toLowerCase())

    const matchesMinPrice =
      !filters.value.minPrice ||
      product.price >= filters.value.minPrice

    const matchesMaxPrice =
      !filters.value.maxPrice ||
      product.price <= filters.value.maxPrice

    return matchesQuery && matchesMinPrice && matchesMaxPrice
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

.filter-section {
  background-color: #9a3412;
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #ffffff;
}

.loading-box {
  background-color: #fdcb80;
  color: #9a3412;
}

.products-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* New Grid Layout */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
}

/* Product Card */
.product-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
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
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.product-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #c2410c;
  margin-top: auto;
  margin-bottom: 1rem;
}

/* Action Buttons Container */
.product-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.btn-detail, .btn-cart {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.btn-detail {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-detail:hover {
  background-color: #e5e7eb;
}

.btn-cart {
  background-color: #8f3e00; /* Merging User Preference: Darker Orange/Brown */
  color: white;
}

.btn-cart:hover {
  background-color: #4d2100; /* Merging User Preference Hover */
}
</style>
