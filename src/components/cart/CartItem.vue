<template>
  <div class="cart-item card mb-3">
    <div class="row g-0 align-items-center">
      <div class="col-md-2 p-2">
        <img 
          :src="item.prd_img || '/placeholder-image.png'" 
          :alt="item.prd_nombre" 
          class="img-fluid rounded-start"
          style="max-height: 100px; object-fit: cover;"
        >
      </div>
      <div class="col-md-10">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div class="item-info flex-grow-1">
            <h5 class="card-title mb-1">{{ item.prd_nombre }}</h5>
            <p class="card-text text-muted small mb-0">{{ item.prd_desc_corta }}</p>
            <p class="card-text fw-bold price-text mt-1">
              {{ formatCurrency(item.prd_precio_venta) }}
            </p>
          </div>
          
          <div class="item-controls d-flex align-items-center gap-4">
            <div class="d-flex flex-column align-items-center">
               <span class="small text-muted mb-1 fw-semibold">Cantidad</span>
               <div class="quantity-control input-group input-group-sm" style="width: 120px;">
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="decrement"
                    :disabled="isUpdating || localQuantity <= 1"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    class="form-control text-center bg-white" 
                    :value="localQuantity" 
                    readonly
                    aria-label="Cantidad del producto"
                  >
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="increment"
                    :disabled="isUpdating"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
               </div>
            </div>
            
            <div class="d-flex flex-column align-items-end" style="min-width: 100px;">
              <span class="small text-muted mb-1 fw-semibold">Total</span>
              <p class="mb-0 fw-bold price-text">{{ formatCurrency(item.pxca_subtotal) }}</p>
            </div>

            <button 
              class="btn btn-link text-danger p-0 ms-2 align-self-end mb-1" 
              @click="removeItem"
              title="Eliminar producto"
              aria-label="Eliminar producto del carrito"
            >
              <i class="bi bi-trash fs-5" aria-hidden="true"></i>
              <!-- Fallback si no hay iconos -->
              <span v-if="!hasIcons">Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCartStore } from '../../stores/cart.store'
import { debounce } from '../../utils/debounce'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const localQuantity = ref(props.item.pxca_cantidad)

// Sincronizar localQuantity si cambia desde fuera (e.g. reload del store)
watch(() => props.item.pxca_cantidad, (newVal) => {
  localQuantity.value = newVal
})

const isUpdating = computed(() => cartStore.updatingItem === props.item.prd_codigo)
const hasIcons = true // Asumimos que bootstrap-icons o similar está cargado, si no, se verá el texto

const debouncedUpdate = debounce((newQty) => {
  cartStore.updateQuantity(props.item.prd_codigo, newQty)
}, 500)

const increment = () => {
  localQuantity.value++
  debouncedUpdate(localQuantity.value)
}

const decrement = () => {
  if (localQuantity.value > 1) {
    localQuantity.value--
    debouncedUpdate(localQuantity.value)
  }
}

const removeItem = () => {
  if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
    cartStore.removeItem(props.item.prd_codigo)
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.cart-item {
  transition: all 0.2s;
}
.cart-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
