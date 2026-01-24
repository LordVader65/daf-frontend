<template>
  <div v-if="show" class="modal-backdrop fade show"></div>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    aria-labelledby="printModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header d-print-none">
          <h5 class="modal-title" id="printModalLabel">Vista Previa de Impresión</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>
        
        <div class="modal-body p-0" id="factura-print-content">
          <!-- Reutilizamos el mismo componente que el POS -->
          <FacturaDocumento 
            :factura="factura"
            :items="normalizedItems"
          />
        </div>

        <div class="modal-footer d-print-none">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Cerrar
          </button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="exportToPDF"
            :disabled="generating"
          >
            <span v-if="generating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Exportar a PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import FacturaDocumento from './factura/FacturaDocumento.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  factura: {
    type: Object,
    required: true
  },
  detalle: {
    type: Array, // Checkout lo manda como 'detalle' o 'items'
    default: () => []
  },
  items: { 
    type: Array, // Soporte para nombre alternativo
    default: () => []
  }
})

const emit = defineEmits(['close'])
const generating = ref(false)

// Unificar items de detalle
const normalizedItems = computed(() => {
    // Si viene 'items' (CheckoutView actualizado lo manda así, aunque mapeado)
    if (props.items && props.items.length > 0) return props.items
    
    // Si viene 'detalle' (FacturaForm lo manda así) lo mapeamos
    // Pero FacturaDocumento espera { descripcion, pxfa_cantidad, prd_precio_venta, pxfa_subtotal, key }
    return props.detalle.map(d => ({
        ...d,
        descripcion: d.descripcion || d.prd_nombre || d.prd_codigo,
        key: d.pxfa_codigo || d.prd_codigo
    }))
})

const exportToPDF = () => {
  generating.value = true
  
  const element = document.getElementById('factura-print-content')
  const opt = {
    margin:       10,
    filename:     `Factura-${props.factura.fac_codigo}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // New Promise-based usage:
  html2pdf().set(opt).from(element).save().then(() => {
    generating.value = false
  }).catch((err) => {
     console.error(err)
     generating.value = false
  })
}
</script>

<style scoped>
.modal-backdrop {
  opacity: 0.5;
}
</style>
