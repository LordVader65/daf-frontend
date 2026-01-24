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
        
        <div class="modal-body p-4" id="factura-print-content">
          <!-- CABECERA DE LA EMPRESA (MOCKUP) -->
          <div class="text-center mb-4">
            <h2 class="fw-bold">MI EMPRESA S.A.</h2>
            <p class="mb-0">Dirección: Av. Principal 123, Ciudad</p>
            <p class="mb-0">RUC: 0999999999001</p>
            <p>Teléfono: (04) 222-3333</p>
          </div>

          <hr />

          <!-- CABECERA DE LA FACTURA -->
          <div class="row mb-4">
            <div class="col-6">
              <h5 class="text-primary fw-bold">FACTURA DE VENTA</h5>
              <h4 class="fw-bold text-danger">{{ factura.fac_codigo }}</h4>
            </div>
            <div class="col-6 text-end">
              <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(factura.fac_fecha) }}</p>
              <p class="mb-1">
                <strong>Estado:</strong> 
                <span class="badge" :class="statusClass(factura.fac_estado)">
                  {{ factura.fac_estado }}
                </span>
              </p>
            </div>
          </div>

          <!-- DATOS DEL CLIENTE -->
          <div class="card mb-4 border-0 bg-light">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-2">
                  <strong>Cliente:</strong> {{ factura.cli_nombre }}
                </div>
                <div class="col-md-6 mb-2">
                   <strong>RUC / Cédula:</strong> {{ factura.cli_ruc_ced }}
                </div>
                <div class="col-12" v-if="factura.fac_descripcion">
                   <strong>Descripción:</strong> {{ factura.fac_descripcion }}
                </div>
              </div>
            </div>
          </div>

          <!-- DETALLE -->
          <table class="table table-striped table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Producto</th>
                <th class="text-end" style="width: 100px">Cant.</th>
                <th class="text-end" style="width: 120px">P. Unit</th>
                <th class="text-end" style="width: 120px">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detalle" :key="index">
                <td>{{ getProductoNombre(item) }}</td>
                <td class="text-end">{{ item.pxfa_cantidad }}</td>
                <td class="text-end">{{ money(item.prd_precio_venta || item.prd_precio) }}</td>
                <td class="text-end">{{ money(item.pxfa_subtotal || (item.prd_precio_venta * item.pxfa_cantidad)) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- TOTALES -->
          <div class="row justify-content-end">
            <div class="col-md-5">
              <table class="table table-sm table-borderless">
                <tr>
                  <td class="text-end"><strong>Subtotal:</strong></td>
                  <td class="text-end">{{ money(factura.fac_subtotal) }}</td>
                </tr>
                <tr>
                  <td class="text-end"><strong>IVA (15%):</strong></td>
                  <td class="text-end">{{ money(factura.fac_iva) }}</td>
                </tr>
                <tr class="border-top border-dark">
                  <td class="text-end"><h5 class="fw-bold">TOTAL:</h5></td>
                  <td class="text-end"><h5 class="fw-bold">{{ money(factura.fac_total) }}</h5></td>
                </tr>
              </table>
            </div>
          </div>
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
import { ref } from 'vue'
import { formatter } from '@/utils/timestamp-formatter'
import html2pdf from 'html2pdf.js'

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
    type: Array,
    required: true
  },
  productos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])
const generating = ref(false)

const getProductoNombre = (item) => {
  // Integramos la lógica para mostrar el nombre si viene del objeto producto o del detalle
  // En el backend: el detalle tiene 'prd_codigo', pero no 'prd_descripcion' anidada directamente a veces
  // Se asume que el padre (FacturaForm) pasa los productos o el detalle ya incluye info necesaria
  // Según el código del padre, se usa 'productos' array para buscar.
  // Intentaremos buscar en la prop productos si está disponible
  
  if (props.productos && props.productos.length > 0) {
     const p = props.productos.find(x => x.prd_codigo === item.prd_codigo)
     if (p) return p.prd_descripcion
  }
  return item.prd_descripcion || item.prd_codigo
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return formatter.format(new Date(dateString))
}

const money = (val) => {
  return `$${Number(val || 0).toFixed(2)}`
}

const statusClass = (status) => {
  if (status === 'APR') return 'bg-success'
  if (status === 'ANU') return 'bg-danger'
  return 'bg-warning'
}

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
