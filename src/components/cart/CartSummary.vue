<template>
  <div class="cart-summary card border-0 bg-light">
    <div class="card-body">
      <h5 class="card-title border-bottom pb-3 mb-3">Resumen del Pedido</h5>
      
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">Subtotal</span>
        <span class="fw-bold">{{ formatCurrency(subtotal) }}</span>
      </div>
      
      <!-- Aquí se podrían agregar impuestos o envío si fuera necesario -->
      
      <div class="d-flex justify-content-between mb-2">
        <span class="text-muted">Envío</span>
        <span class="text-success fw-bold">Gratis</span>
      </div>

      <div class="d-flex justify-content-between mt-4 pt-3 border-top">
        <span class="fs-5 fw-bold">Total</span>
        <span class="fs-5 fw-bold text-orange-custom">{{ formatCurrency(total) }}</span>
      </div>
      
      <button 
        class="btn btn-primary w-100 mt-4 py-2 fw-bold shadow-sm btn-checkout"
        @click="$emit('checkout')"
        :disabled="loading || total <= 0"
        title="Ir a la pasarela de pago para completar tu compra"
        aria-label="Proceder al pago"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ loading ? 'Procesando...' : 'Proceder al pago' }}
      </button>
      <small class="d-block text-center text-muted mt-2">
        <i class="bi bi-info-circle me-1"></i>
        Serás redirigido a la pasarela de pago segura
      </small>

      <div class="mt-3 text-center">
        <router-link to="/products" class="text-decoration-none small text-muted">
          <i class="bi bi-arrow-left me-1"></i> Seguir Comprando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subtotal: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['checkout'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.btn-checkout {
  background-color: #8f3e00;
  border-color: #8f3e00;
  color: #fff;
  transition: background-color 0.2s;
}

.btn-checkout:hover:not(:disabled) {
  background-color: #4d2100;
  border-color: #4d2100;
}

.text-orange-custom {
  color: #c2410c;
}
</style>
