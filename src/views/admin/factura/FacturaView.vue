<template>
  <div class="admin-container">

    <!-- HEADER -->
    <div class="header">
      <h2>Facturación</h2>

      <div>
        <button class="btn btn-secondary me-2" @click="router.push('/admin/dashboard')">
          Regresar
        </button>
        <button class="btn btn-primary" @click="goNuevaFactura">
          <Icon icon="mdi:plus" />
          Nueva factura
        </button>
      </div>
    </div>

    <!-- BUSCADOR -->
    <div class="filters">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por código o cliente"
        class="input-search"
      />
    </div>

    <!-- TABLA -->
    <div class="table-outer-container shadow-sm border rounded">
      <div class="table-responsive custom-scrollbar">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th style="width: 160px;">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="fac in facturas" :key="fac.fac_codigo">
              <td>{{ fac.fac_codigo }}</td>
              <td>{{ fac.cli_nombre?.trim() }}</td>
              <td>{{ formatter.format(new Date(fac.fac_fecha)) }}</td>
              <td>${{ fac.fac_total }}</td>
              <td>
                  <span class="badge" :class="badgeClass(fac.fac_estado)">
                  {{ fac.fac_estado }}
                  </span>
              </td>
              <td>
                  <button class="btn btn-sm btn-primary" @click="verFactura(fac.fac_codigo)">
                  Ver
                  </button>
              </td>
            </tr>

            <tr v-if="facturas.length === 0">
              <td colspan="6" class="empty">
                No se encontraron facturas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINACIÓN -->
    <div class="pagination-container mt-4 d-flex justify-content-between align-items-center">
      <div class="text-muted small">
        Mostrando {{ facturas.length }} de {{ totalRows }} facturas
      </div>
      <div class="pagination-controls d-flex gap-2">
        <button 
          class="btn btn-outline-secondary btn-sm" 
          :disabled="page === 1"
          @click="changePage(1)"
        >
          <Icon icon="mdi:chevron-double-left" />
        </button>
        <button 
          class="btn btn-outline-secondary btn-sm" 
          :disabled="page === 1"
          @click="changePage(page - 1)"
        >
          <Icon icon="mdi:chevron-left" />
        </button>
        
        <span class="align-self-center px-2 small fw-bold">
          Página {{ page }} de {{ totalPages }}
        </span>

        <button 
          class="btn btn-outline-secondary btn-sm" 
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
        <button 
          class="btn btn-outline-secondary btn-sm" 
          :disabled="page === totalPages"
          @click="changePage(totalPages)"
        >
          <Icon icon="mdi:chevron-double-right" />
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { FacturaService } from '@/api/admin/factura.service'
import { toast } from '@/utils/toast'
import { formatter } from '@/utils/timestamp-formatter'


// -----------------------------
// STATE
// -----------------------------
const router = useRouter()
const facturas = ref([])
const search = ref('')

// Paginación
const page = ref(1)
const limit = ref(10)
const totalRows = ref(0)
const totalPages = ref(0)



// -----------------------------
// LOAD
// -----------------------------

const loadFacturas = async () => {
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      search: search.value // Opcional por ahora si decides filtrar en server
    }
    const { data: res } = await FacturaService.getAll(params)
    
    facturas.value = res.data ?? []
    totalRows.value = res.total ?? 0
    totalPages.value = res.totalPages ?? 0
  } catch (error) {
    toast.error('Error al cargar facturas')
    console.error('loadFacturas:', error)
    facturas.value = []
  }
}

const changePage = (p) => {
  page.value = p
  loadFacturas()
}

const verFactura = (codigo) => {
  router.push(`/admin/factura/${codigo}`)
}


onMounted(loadFacturas)

// -----------------------------
// COMPUTED
// -----------------------------
// -----------------------------
// WATCHERS (OPCIONAL)
// -----------------------------
watch(search, () => {
  page.value = 1
  loadFacturas()
})

// -----------------------------
// ACTIONS
// -----------------------------
const goNuevaFactura = () => {
  router.push('/admin/factura/NUEVA')
}

const goEditarFactura = (codigo) => {
  router.push(`/admin/factura/${codigo}`)
}

const aprobarFactura = async (codigo) => {
  try {
    if (!codigo) return

    await FacturaService.aprobar(codigo)

    toast.success('Factura aprobada correctamente')

    await loadFacturas() // ← IMPORTANTE: await
  } catch (error) {
    console.error('aprobarFactura:', error)

    toast.error(
      error.response?.data?.message ||
      'No se pudo aprobar la factura'
    )
  }
}


const anularFactura = async (codigo) => {
  try {
    await FacturaService.anular(codigo)
    toast.success('Factura anulada')
    loadFacturas()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error al anular factura')
  }
}

const badgeClass = (estado) => {
  return {
    PEN: 'bg-warning',
    APR: 'bg-success',
    ANU: 'bg-danger'
  }[estado] || 'bg-secondary'
}

// -----------------------------
// UI HELPERS
// -----------------------------
const estadoClass = (estado) => {
  return {
    badge: true,
    pen: estado === 'PEN',
    apr: estado === 'APR',
    anu: estado === 'ANU'
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters {
  margin: 15px 0;
}

.input-search {
  width: 300px;
  padding: 8px;
}

.table-outer-container {
  background: white;
  margin-top: 10px;
}

.table-responsive {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: auto;
}

/* Scrollbar personalizada Profesional */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
}

.table thead th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 10;
  box-shadow: inset 0 -1px 0 #ddd;
}

.table th,
.table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 6px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
}

.btn-icon.success {
  color: green;
}

.btn-icon.danger {
  color: red;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.badge.pen {
  background: #fff3cd;
  color: #856404;
}

.badge.apr {
  background: #d4edda;
  color: #155724;
}

.badge.anu {
  background: #f8d7da;
  color: #721c24;
}

.empty {
  text-align: center;
  padding: 20px;
}
</style>
