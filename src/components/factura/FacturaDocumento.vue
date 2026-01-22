<template>
  <div class="factura-documento p-4 bg-white" id="factura-doc">
    <!-- HEADER -->
    <div class="row mb-4">
      <div class="col-6">
        <h3 class="mb-0 text-primary fw-bold">FACTURA</h3>
        <p class="mb-0 text-muted small">Documento no válido como comprobante tributario</p>
      </div>
      <div class="col-6 text-end">
        <h4 class="mb-1">No. {{ factura.fac_codigo }}</h4>
        <span
          class="badge"
          :class="{
            'bg-warning text-dark': factura.fac_estado === 'PEN',
            'bg-success': factura.fac_estado === 'APR',
            'bg-danger': factura.fac_estado === 'ANU'
          }"
        >
          {{ factura.fac_estado }}
        </span>
      </div>
    </div>

    <!-- CLIENT & DATE -->
    <div class="row mb-4 border-bottom pb-3">
      <div class="col-8">
        <h6 class="text-uppercase text-secondary mb-2 small fw-bold">Datos del Cliente</h6>
        <div class="mb-1"><strong>Nombre:</strong> {{ factura.cli_nombre || 'Consumidor Final' }}</div>
        <div><strong>RUC/CI:</strong> {{ factura.cli_ruc_ced || '9999999999999' }}</div>
      </div>
      <div class="col-4 text-end">
        <h6 class="text-uppercase text-secondary mb-2 small fw-bold">Fecha de Emisión</h6>
        <div>{{ formatDate(factura.fac_fecha) }}</div>
      </div>
    </div>

    <!-- DESCRIPTION (OPTIONAL) -->
    <div v-if="factura.fac_descripcion" class="row mb-4">
      <div class="col-12">
        <h6 class="text-uppercase text-secondary mb-2 small fw-bold">Descripción</h6>
        <p class="mb-0">{{ factura.fac_descripcion }}</p>
      </div>
    </div>

    <!-- DETAIL TABLE -->
    <div class="table-responsive mb-4">
      <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th class="py-2">Producto</th>
            <th class="py-2 text-center" style="width: 100px;">Cant.</th>
            <th class="py-2 text-end" style="width: 120px;">P. Unit</th>
            <th class="py-2 text-end" style="width: 120px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0">
            <td colspan="4" class="text-center py-3 text-muted">Sin detalles</td>
          </tr>
          <tr v-for="item in items" :key="item.key">
            <td>{{ item.descripcion }}</td>
            <td class="text-center">{{ item.pxfa_cantidad }}</td>
            <td class="text-end">{{ money(item.prd_precio_venta) }}</td>
            <td class="text-end fw-bold">{{ money(Number(item.prd_precio_venta) * Number(item.pxfa_cantidad)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TOTALS -->
    <div class="row justify-content-end">
      <div class="col-5">
        <table class="table table-sm table-borderless">
          <tbody>
            <tr>
              <td class="text-end fw-bold">Subtotal:</td>
              <td class="text-end" style="width: 120px;">{{ money(factura.fac_subtotal) }}</td>
            </tr>
            <tr>
              <td class="text-end fw-bold">IVA (15%):</td>
              <td class="text-end">{{ money(factura.fac_iva) }}</td>
            </tr>
            <tr class="border-top">
              <td class="text-end h5 pt-2">Total:</td>
              <td class="text-end h5 pt-2 text-primary">{{ money(factura.fac_total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatter } from '@/utils/timestamp-formatter'

const props = defineProps({
  factura: {
    type: Object,
    required: true,
    default: () => ({})
  },
  items: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formatDate = (date) => {
  if (!date) return '-'
  return formatter.format(new Date(date))
}

const money = (val) => {
  return '$' + Number(val || 0).toFixed(2)
}
</script>

<style scoped>
/* Estilos específicos para impresión/PDF si es necesario */
.factura-documento {
  font-family: 'Arial', sans-serif;
  color: #333;
}
.table th {
  font-size: 0.9rem;
  font-weight: 600;
}
.table td {
  font-size: 0.9rem;
}
</style>
