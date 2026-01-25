<template>
  <div class="checkout-container py-5">
    <AccessibilityMenu />
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm border-0 rounded-3">
            <div class="card-header bg-white border-bottom py-3">
              <h4 class="mb-0 fw-bold text-center">
                <Icon icon="mingcute:card-pay-line" class="me-2" />
                Pasarela de Pago
              </h4>
            </div>
            <div class="card-body p-4">
              
              <!-- Success State -->
              <div v-if="success" class="text-center py-4">
                <Icon icon="mingcute:check-circle-line" class="text-success mb-3" width="64" height="64" />
                <h3 class="fw-bold text-success mb-2">¡Pago Exitoso!</h3>
                <p class="text-muted mb-4">Su compra ha sido procesada correctamente.</p>
                
                <div class="d-grid gap-2">
                  <button 
                    class="btn btn-dark btn-lg" 
                    @click="openInvoiceModal"
                    title="Generar e imprimir el comprobante de su compra"
                  >
                    <Icon icon="mingcute:print-line" class="me-2" />
                    Imprimir Factura
                  </button>
                  <button 
                    class="btn btn-outline-primary" 
                    @click="router.push('/')"
                    title="Regresar a la página principal"
                  >
                    Continuar al Inicio
                  </button>
                </div>
              </div>

              <!-- Payment Form -->
              <div v-else>
                <!-- Resumen Total -->
                <div class="alert alert-light border text-center mb-4">
                  <p class="mb-1 text-muted">Total a Pagar</p>
                  <h2 class="fw-bold text-success display-6">{{ formatCurrency(cartStore.cartInfo?.crr_total || 0) }}</h2>
                  <p class="mb-0 small text-muted">{{ cartStore.totalItems }} productos</p>
                </div>

                <form @submit.prevent="handlePayment">
                  <div class="mb-4">
                    <label for="cardNumber" class="form-label fw-bold">Número de Tarjeta</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-white">
                        <Icon icon="mingcute:bank-card-line" />
                      </span>
                      <input 
                        type="text" 
                        id="cardNumber" 
                        class="form-control" 
                        :value="cardNumber"
                        @input="formatCardNumber"
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                        maxlength="23"
                      />
                    </div>
                    <div class="form-text">Ingrese los 16 dígitos de su tarjeta.</div>
                  </div>

                  <!-- Error Message -->
                  <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                    <Icon icon="mingcute:alert-circle-line" class="me-2" />
                    <div>{{ error }}</div>
                  </div>

                  <!-- Actions -->
                  <div class="d-grid gap-2">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg fw-bold" 
                      :disabled="loading"
                      title="Procesar el pago con los datos ingresados"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Procesando...' : 'Pagar Ahora' }}
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="router.push('/carrito')" 
                      :disabled="loading"
                      title="Cancelar el pago y volver al carrito de compras"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Impresión -->
    <FacturaPrintModal 
      :show="showModal" 
      :factura="invoiceData" 
      :detalle="invoiceItems" 
      :productos="invoiceItems"
      @close="showModal = false" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart.store';
import { useClientStore } from '../../stores/client.store';
import { checkout, validateCard } from '../../api/ecom/payment.service';
import { Icon } from "@iconify/vue";
import FacturaPrintModal from '../../components/FacturaPrintModal.vue';
import AccessibilityMenu from '../../components/AccessibilityMenu.vue';
import axios from 'axios';

const router = useRouter();
const cartStore = useCartStore();
const clientStore = useClientStore();

const cardNumber = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(false);

const showModal = ref(false);
const invoiceData = ref({});
const invoiceItems = ref([]);
const profileData = ref(null); // Datos completos del perfil

let savedCartItems = [];
let savedCartInfo = {};
let generatedFacCodigo = null;

const formatCardNumber = (event) => {
  // 1. Eliminar todo lo que no sea número
  let value = event.target.value.replace(/\D/g, '');
  
  // 2. Limitar a 19 dígitos
  if (value.length > 19) value = value.slice(0, 19);
  
  // 3. Agregar espacios cada 4 dígitos
  // (La regex captura grupos de 4 y pone espacio, trim elimina el final)
  cardNumber.value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

onMounted(async () => {
  // Asegurar que el carrito esté cargado
  await cartStore.fetchCart();
  if (cartStore.isEmpty) {
    router.push('/'); // Redirigir si no hay nada que pagar
  }
  
  // Cargar perfil completo para datos de factura
  await fetchUserProfile();
});

const fetchUserProfile = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('client'))?.token;
    if (!token) return;

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND}ecom/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    profileData.value = data;
  } catch (error) {
    console.error('Error cargando perfil:', error);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

const handlePayment = async () => {
  // Limpiar espacios para validar longitud real
  const cleanNumber = cardNumber.value.replace(/\s+/g, '');
  
  if (!cleanNumber) return;
  
  if (cleanNumber.length < 13) {
    error.value = "El número de tarjeta es muy corto (mínimo 13 dígitos).";
    return;
  }

  loading.value = true;
  error.value = null;

  // 1. Guardar estado del carrito ANTES de pagar (porque el backend lo vacía)
  savedCartItems = JSON.parse(JSON.stringify(cartStore.items));
  savedCartInfo = { ...cartStore.cartInfo };

  try {
    // 2. Validar tarjeta con Backend (Luhn)
    await validateCard(cleanNumber);

    // 3. Si valida, procesar el pago
    const response = await checkout(cleanNumber);
    
    // Éxito
    generatedFacCodigo = response.data.fac_codigo;
    success.value = true;
    
    // Limpiar carrito en frontend (el backend ya lo procesó)
    await cartStore.fetchCart(); 

  } catch (err) {
    console.error(err);
    // Mostrar mensaje específico si viene del backend
    error.value = err.response?.data?.message || 'Ocurrió un error al procesar el pago.';
  } finally {
    loading.value = false;
  }
};

const openInvoiceModal = () => {
  // Usar datos del perfil recién cargados
  const client = profileData.value || clientStore.clientData || {};
  
  invoiceData.value = {
    fac_codigo: generatedFacCodigo,
    fac_fecha: new Date().toISOString(),
    fac_estado: 'APR', // Aprobado
    cli_nombre: client.cli_nombre || client.nombre || client.usr_nombre || 'Consumidor Final',
    cli_ruc_ced: client.cli_ruc_ced || client.usr_cedula || client.cedula || '9999999999',
    fac_subtotal: savedCartInfo.crr_subtotal,
    fac_total: savedCartInfo.crr_total,
    fac_iva: savedCartInfo.crr_total - savedCartInfo.crr_subtotal
  };

  // Mapear items para FacturaDocumento
  invoiceItems.value = savedCartItems.map(item => ({
    ...item,
    descripcion: item.prd_nombre, // FacturaDocumento usa 'descripcion'
    key: item.prd_codigo, // FacturaDocumento usa 'key' para v-for
    pxfa_cantidad: item.pxca_cantidad,
    // Asegurar que el precio esté disponible. Si el backend no lo trae aún, intentar usar subtotal/cantidad
    prd_precio_venta: item.prd_precio_venta || (item.pxca_subtotal / item.pxca_cantidad) 
  }));

  showModal.value = true;
};
</script>

<style scoped>
.checkout-container {
  min-height: 80vh;
  /* El fondo se hereda del body (#fff5e6) */
}
.card {
  overflow: hidden;
}
</style>
