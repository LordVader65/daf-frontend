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
              <label class="form-label font-weight-semibold text-white">Buscar</label>
              <input
                placeholder="Producto"
                v-model="filters.query"
                type="text"
                class="form-control rounded-3"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label font-weight-semibold text-white">Precio min.</label>
              <input
                placeholder="0.00"
                v-model.number="filters.minPrice"
                type="number"
                min="0"
                class="form-control rounded-3"
              />
            </div>

            <div class="col-md-3">
              <label class="form-label font-weight-semibold text-white">Precio max.</label>
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
        <div class="row g-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="col-md-4"
          >
            <div class="card h-100 shadow-sm">
              <img
                :src="product.image"
                :alt="product.name"
                class="card-img-top"
                style="height: 250px; object-fit: cover;"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">{{ product.description }}</p>
                <p class="h5 text-orange-custom mt-auto">
                  ${{ product.price }}
                </p>
                <button class="btn btn-custom-dark mt-3">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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

.btn-custom-dark {
  background-color: #8f3e00;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-custom-dark:hover {
  background-color: #4d2100;
  color: white;
}

.products-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
