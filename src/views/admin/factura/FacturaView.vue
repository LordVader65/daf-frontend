<template>
  <div class="crud-container">
    <!-- TOP BAR -->
    <div class="top-bar">
      <button @click="router.push('/admin/dashboard')" class="btn-back" aria-label="Regresar">
        <Icon icon="mdi:arrow-left" width="24" />
        Regresar
      </button>
    </div>

    <!-- HEADER -->
    <div class="page-header">
      <h1>Gestión de Facturación</h1>
      <p class="text-muted">Administre el registro de sus facturas emitidas</p>
    </div>

    <!-- BUSCADOR Y ACCIONES -->
    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Buscar por código o cliente..."
        />
      </div>
      <button @click="goNuevaFactura" class="btn-create">
        <Icon icon="mdi:plus" width="20" />
        Nueva factura
      </button>
    </div>

    <!-- TABLA -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <Icon icon="mdi:loading" class="spinner" width="48" />
        <p>Cargando datos...</p>
      </div>

      <div v-else-if="facturas.length === 0" class="empty-state">
        <Icon icon="mdi:invoice-list-outline" width="64" />
        <p>No se encontraron facturas</p>
      </div>

      <div v-else class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th style="width: 120px;">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="fac in facturas" :key="fac.fac_codigo">
              <td>
                <span class="codigo">{{ fac.fac_codigo }}</span>
              </td>
              <td>{{ fac.cli_nombre?.trim() }}</td>
              <td>{{ formatter.format(new Date(fac.fac_fecha)) }}</td>
              <td>${{ fac.fac_total }}</td>
              <td>
                <span class="badge" :class="badgeClass(fac.fac_estado)">
                  {{ fac.fac_estado }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="btn-action btn-edit" 
                    @click="verFactura(fac.fac_codigo)"
                    title="Ver detalle"
                  >
                    Ver
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINACIÓN -->
    <div class="pagination">
      <button 
        class="btn-pagination" 
        :disabled="page === 1"
        @click="changePage(1)"
        title="Primera página"
      >
        <Icon icon="mdi:chevron-double-left" />
      </button>
      <button 
        class="btn-pagination" 
        :disabled="page === 1"
        @click="changePage(page - 1)"
        title="Anterior"
      >
        <Icon icon="mdi:chevron-left" />
      </button>
      
      <span class="page-info">
        Página {{ page }} de {{ totalPages }}
      </span>

      <button 
        class="btn-pagination" 
        :disabled="page === totalPages"
        @click="changePage(page + 1)"
        title="Siguiente"
      >
        <Icon icon="mdi:chevron-right" />
      </button>
      <button 
        class="btn-pagination" 
        :disabled="page === totalPages"
        @click="changePage(totalPages)"
        title="Última página"
      >
        <Icon icon="mdi:chevron-double-right" />
      </button>
    </div>

    <div class="text-center text-muted small mt-2">
      Mostrando {{ facturas.length }} de {{ totalRows }} facturas
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
const loading = ref(false)

// Paginación
const page = ref(1)
const limit = ref(10)
const totalRows = ref(0)
const totalPages = ref(0)



// -----------------------------
// LOAD
// -----------------------------

const loadFacturas = async () => {
  loading.value = true
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
  } finally {
    loading.value = false
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
const searchTimeout = ref(null)

watch(search, () => {
    page.value = 1
    if (searchTimeout.value) clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
        loadFacturas()
    }, 500)
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
    PEN: 'badge-warn', // Ajustado para crud-view si existe o personalizado abajo
    APR: 'badge-success',
    ANU: 'badge-danger'
  }[estado] || 'badge-secondary'
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

<style scoped src="../../../assets/css/admin/crud-view.css"></style>

<style scoped>
/* Ajustes específicos para Factura que no están en crud-view.css */
.badge-warn {
  background-color: #fff3cd;
  color: #856404;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.badge-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
}

.codigo {
  font-family: inherit;
  font-weight: 600;
  color: #944000;
}
</style>
