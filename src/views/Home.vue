<template>
  <div class="home-page">
    <main class="flex-grow">
      <section id="nosotros" class="container mx-auto px-4 py-5">
        <div class="row g-4">
          <div class="col-md-6 p-3">
            <article>
              <h2 class="text-2xl font-weight-bold mb-4 text-primary-custom">
                NOSOTROS
              </h2>

              <p class="mb-4 text-justify">
                En <strong>DAF - Decoraciones de Arreglos Florales</strong>
                celebramos la belleza natural de las flores con arreglos únicos
                diseñados en Ecuador. Nuestro emprendimiento familiar nació con
                la idea de compartir emociones a través de cada flor, creando
                experiencias memorables para toda ocasión: desde detalles
                románticos hasta eventos empresariales o sociales.
              </p>

              <p class="mb-4 text-justify">
                Trabajamos con flores frescas ecuatorianas y materiales de alta
                calidad para garantizar diseños duraderos y elegantes. En DAF
                creemos que cada arreglo cuenta una historia, y queremos ser
                parte de la tuya.
              </p>

              <div class="d-flex gap-3">
                <router-link
                  to="/contact"
                  class="btn btn-custom-dark"
                >
                  Contáctanos
                </router-link>
              </div>
            </article>
          </div>

          <div
            class="col-md-6 d-flex flex-column justify-content-center align-items-center gap-4"
          >
            <img
              src="/images/index/arreglofloral_nosotros.png"
              alt="Arreglo floral"
              class="img-fluid rounded shadow"
              style="max-width: 320px;"
            />

            <a href="#productos" class="btn btn-custom-orange">
              Ver Productos Destacados
            </a>
          </div>
        </div>
      </section>

      <section id="productos" class="bg-white py-5">
        <div class="container text-center">
          <h4 class="mb-4 text-primary-custom">Algunos de nuestros arreglos florales</h4>
          <h2 class="text-2xl font-weight-bold mb-5 text-primary-custom">NUESTROS PRODUCTOS DESTACADOS</h2>

          <div class="row g-4">
            <div class="col-md-4" v-for="product in featuredProducts" :key="product.id">
              <article class="card h-100 shadow-sm mx-auto">
                <div class="card-body d-flex flex-column">
                  <h3 class="card-title font-weight-semibold mb-3">
                    {{ product.name }}
                  </h3>

                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="img-fluid rounded mb-3"
                    style="width: 192px; height: 192px; object-fit: cover; margin: 0 auto;"
                  />

                  <p class="card-text small mb-3">
                    {{ product.description }}
                  </p>

                  <router-link
                    to="/products"
                    class="btn btn-custom-dark mt-auto"
                  >
                    Ver más
                  </router-link>
                </div>
              </article>
            </div>
          </div>

          <div class="mt-5">
            <router-link
              to="/products"
              class="btn btn-custom-dark btn-lg"
            >
              Ver todos los productos
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const featuredProducts = ref([
  {
    id: 1,
    name: 'Arreglos simples',
    image: '/images/details/arreglos_simples.jpeg',
    description:
      'Diseños frescos y delicados, ideales para regalar o decorar espacios con un toque natural y armonioso.'
  },
  {
    id: 2,
    name: 'Corona de flores',
    image: '/images/details/corona_flores.jpg',
    description:
      'Corona artesanal elaborada con flores naturales, símbolo de amor y respeto para homenajes o celebraciones solemnes.'
  },
  {
    id: 3,
    name: 'Pedestales florales',
    image: '/images/details/pedestal_flores.jpg',
    description:
      'Un elegante pedestal decorativo con flores frescas, perfecto para eventos, recepciones y ceremonias especiales.'
  }
])
</script>

<style scoped>
.text-primary-custom {
  color: #d26e4b;
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

.btn-custom-orange {
  background-color: #c2410c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-custom-orange:hover {
  background-color: #9a3412;
  color: white;
}

.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
