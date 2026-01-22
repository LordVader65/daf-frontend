<template>
  <AccessibilityMenu />
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="card shadow-sm p-5">
          <div class="mb-4">
            <i class="bi bi-credit-card fs-1 text-success"></i>
          </div>
          <h2 class="fw-bold mb-3">Checkout (Pasarela de Pago)</h2>
          <p class="text-muted mb-4">
            Aquí iría la integración con la pasarela de pagos (ej: Stripe, PayPal, o formulario de envío).
            Esta vista simula el siguiente paso después del carrito.
          </p>
          <div class="alert alert-info">
            <strong>Nota:</strong> Funcionalidad en desarrollo.
          </div>
          <router-link to="/products" class="btn btn-primary mt-3">
            Seguir Comprando
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AccessibilityMenu from '../../components/AccessibilityMenu.vue'
</script>
