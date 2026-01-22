<template>
  <div class="container-fluid">
    <!-- CABECERA -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6" v-if="!isNueva">
             <h4 class="mb-1">
               No. Factura: {{ facCodigo }}
             </h4> 
             <span
               class="badge mb-2"
               :class="factura.fac_estado === 'PEN' ? 'bg-warning' : (factura.fac_estado === 'APR' ? 'bg-success' : 'bg-danger')"
             >
               {{ factura.fac_estado }}
             </span>

             <div class="small mt-2">
               <div><strong>Fecha:</strong> {{ formatter.format(new Date(factura.fac_fecha)) }}</div>
               <div><strong>Cliente:</strong> {{ factura.cli_nombre }}</div>
               <div><strong>RUC/CED:</strong> {{ factura.cli_ruc_ced }}</div>
             </div>
           </div>
           
           <!-- CABECERA NUEVA -->
           <div class="col-md-6" v-if="isNueva">
             <h4 class="mb-1">Nueva Factura</h4>
             <span class="badge bg-warning">PEN</span>
            
            <!-- CABECERA FACTURA NUEVA (AÑADIDO) -->
            <div v-if="isNueva" class="row mt-3 g-3">
              <div class="col-md-6">
                <label class="form-label">Cliente</label>
               <select v-model="clienteSeleccionado" class="form-select">
                <option :value="null">Seleccione cliente</option>
                <option
                  v-for="c in clientes"
                  :key="c.cli_codigo"
                  :value="c"
                >
                  {{ c.cli_ruc_ced }} - {{ c.cli_nombre }}
                </option>
              </select>

              <div v-if="clienteSeleccionado" class="mt-2">
                <p><strong>RUC / Cédula:</strong> {{ factura.cli_ruc_ced || '-' }}</p>
                <p><strong>Cliente:</strong> {{ factura.cli_nombre || '-' }}</p>
              </div>

              </div>
              <div class="col-md-6">
                <label class="form-label">Descripción</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="factura.fac_descripcion"
                  placeholder="Descripción de la factura"
                />
              </div>
              <div class="col-12">
                
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="loading || !clienteSeleccionado"
                  @click="guardarFactura"
                >
                  Guardar Factura
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-end">
           
            <button
            class="btn btn-secondary me-2"
            @click="router.push('/admin/factura')"
            >
            Regresar
            </button>

             <!-- BOTÓN IMPRIMIR -->
             <button
              v-if="!isNueva && factura.fac_codigo"
              class="btn btn-dark me-2"
              @click="openPrintModal"
            >
              Imprimir
            </button>

            <template v-if="isPEN && !isNueva">
          
            <button class="btn btn-success" 
            :disabled="!puedeAprobar" 
            @click="aprobarFactura"
            > 
            Aprobar
            </button>

            <button class="btn btn-danger ms-2" 
            :disabled="!puedeAnular"
            @click="anularFactura"
            >
            Anular
            </button> 

            </template>

          </div>
        </div>
      </div>
    </div>

    <!-- AGREGAR PRODUCTO -->
    <div class="card mb-3" v-if="isEditable">
      <div class="card-body">
        <div class="row align-items-end">
          <div class="col-md-6">
            <label class="form-label">Producto</label>
            <select v-model="nuevoDetalle.prd_codigo" class="form-select">
              <option value="">Seleccione producto</option>
              <option v-for="p in productos" :key="p.prd_codigo" :value="p.prd_codigo">
                {{ p.prd_descripcion }}
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">Cantidad</label>
            <input
              type="number"
              class="form-control"
              min="1"
              v-model.number="nuevoDetalle.pxfa_cantidad"
              :disabled="!puedeEditarDetalle"
            />
          </div>

          <div class="col-md-3 d-grid">
            <button
              class="btn btn-primary mb-2"
              :disabled="!puedeGuardar"
              @click="guardarDetalle"
            >
              Guardar Detalle
            </button>

            <button
              class="btn btn-info"
              style="width: 100%"
              :disabled="!puedeEditarDetalle"
              @click="addDetalle"
            >
              Agregar producto
            </button>

          </div>
        </div>
      </div>
    </div>

    <!-- DETALLE -->
    <div class="card">
      <div class="card-body table-responsive">
        <table class="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th style="width: 140px">Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th> 
              <th style="width: 80px"></th> 
            </tr>
          </thead>

          <tbody>
            <tr v-if="detalle.length === 0">
              <td colspan="5" class="text-center">
                Sin detalle
              </td>
            </tr>

            <tr v-for="(d, index) in detalle" :key="d.pxfa_codigo ?? index">
              <td>{{ getProductoLabel(d.prd_codigo) }}</td>

              <td>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  v-model.number="d.pxfa_cantidad"
                  :disabled="!puedeEditarDetalle"
                />
              </td>

              <td>{{ money(d.prd_precio_venta) }}</td>
              <td>{{ money(Number(d.prd_precio_venta) * Number(d.pxfa_cantidad)) }}</td>
              <td class="text-center">
                <button
                  class="btn btn-danger btn-sm"
                  @click="eliminarDetalle(index)"
                  :disabled="!puedeEditarDetalle"
                >
                  X
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- TOTALES -->
        <div class="row justify-content-end mt-3">
          <div class="col-md-4">
            <table class="table">
            <tbody>
              <tr>
                <th>Subtotal</th>
                <td class="text-end">{{ money(subtotal) }}</td>
              </tr>
              <tr>
                <th>IVA (15%)</th>
                <td class="text-end">{{ money(iva) }}</td>
              </tr>
              <tr>
                <th>Total</th>
                <td class="text-end">{{ money(total) }}</td>
              </tr>
            </tbody>
          </table>

          </div>
        </div>
      </div>
    </div>
    <!-- MODAL IMPRESIÓN -->
    <div
      class="modal fade"
      id="printModal"
      tabindex="-1"
      aria-hidden="true"
      ref="printModalRef"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vista Previa de Factura</h5>
            <button
              type="button"
              class="btn-close"
              @click="closePrintModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body bg-light">
             <div id="element-to-print">
               <FacturaDocumento
                 v-if="printModalOpen"
                 :factura="factura"
                 :items="itemsImpresion"
               />
             </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closePrintModal"
            >
              Cerrar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="exportToPDF"
              :disabled="printing"
            >
              {{ printing ? 'Generando PDF...' : 'Exportar a PDF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import { formatter } from '@/utils/timestamp-formatter'

import FacturaService from '@/api/admin/factura.service'
import { ProductoService } from '@/api/admin/producto.service'
import ClienteService from '@/api/admin/cliente.service'

import FacturaDocumento from '@/components/factura/FacturaDocumento.vue'
import { Modal } from 'bootstrap'
import html2pdf from 'html2pdf.js'



// ✅ ESTADO NORMALIZADO (Fuente de verdad única)
const normalizedEstado = computed(() => {
  const est = factura.value.fac_estado || factura.value.estado || 'PEN'
  return est.toString().trim()
})

const isPEN = computed(() => normalizedEstado.value === 'PEN')


const route = useRoute()
const router = useRouter()

// ✅ AÑADIDO: soporte para pantalla NUEVA
const facCodigo = computed(() => route.params.id)
const isNueva = computed(() => facCodigo.value === 'NUEVA')

// ✅ AÑADIDO: cabecera (cliente) para FACTURA NUEVA
const clientes = ref([])
const clienteSeleccionado = ref(null)

watch(clienteSeleccionado, (cli) => {
  if (!cli) return

  factura.value.cli_codigo = cli.cli_codigo
  factura.value.cli_ruc_ced = cli.cli_ruc_ced
  factura.value.cli_nombre = cli.cli_nombre

  
})


const loading = ref(false)
const hasChanges = ref(false)

const factura = ref({
  fac_codigo: 'NUEVA',
  fac_estado: 'PEN',
  fac_descripcion: '',

  // cliente
  cli_codigo: null,
  cli_ruc_ced: '',
  cli_nombre: '',

  // valores
  fac_subtotal: 0,
  fac_iva: 0,
  fac_total: 0,

  // fecha
  fac_fecha: new Date().toISOString()
})


const detalle = ref([])
const detalles = detalle
const productos = ref([])



/* ===========================
   PRINT / PDF LOGIC
=========================== */
const printModalRef = ref(null)
const printModalInstance = ref(null)
const printModalOpen = ref(false)
const printing = ref(false)

const itemsImpresion = computed(() => {
  return detalle.value.map(d => ({
    ...d,
    descripcion: getProductoLabel(d.prd_codigo),
    key: d.pxfa_codigo || d.prd_codigo
  }))
})

const openPrintModal = () => {
  if (!printModalInstance.value) {
    printModalInstance.value = new Modal(printModalRef.value)
  }
  printModalOpen.value = true
  printModalInstance.value.show()
}

const closePrintModal = () => {
  printModalOpen.value = false
  printModalInstance.value?.hide()
}

const exportToPDF = () => {
  const element = document.getElementById('element-to-print')
  if (!element) return

  printing.value = true
  
  const opt = {
    margin:       [10, 10], 
    filename:     `Factura_${factura.value.fac_codigo}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(element).save().finally(() => {
    printing.value = false
  })
}

const getProductoNombre = (prdCodigo) => {
  const codigo = clean(prdCodigo)
  const p = productos.value.find(x => clean(x.prd_codigo) === codigo)
  return p?.prd_descripcion || codigo
}

 const getProductoLabel = (prdCodigo) => {
  const code = clean(prdCodigo)
  const p = productos.value?.find(x => clean(x.prd_codigo) === code)
  // En tu BD el texto es prd_descripcion (no prd_nombre)
  return p ? clean(p.prd_descripcion) : code
}


const loadClientes = async () => {
  try {
    

    const res = await ClienteService.getAll()

    clientes.value = res.data?.data ?? res.data ?? []
    
  } catch (e) {
    console.error('❌ Error cargando clientes', e)
  }
}


const loadProductos = async () => {
  try {
    const res = await ProductoService.getAll()
    productos.value = res.data.data   // ✅ AQUÍ está el array real
  } catch (e) {
    toast.error('Error al cargar productos')
    productos.value = []
  }

 } 

onMounted(async () => {
  await loadProductos()
  if (isNueva.value) {
    await loadClientes()
  }
  await loadFactura()

})


const nuevoDetalle = ref({
  prd_codigo: '',
  pxfa_cantidad: 1
})

/* ===========================
   COMPUTED
=========================== */

const esPendiente = computed(() => isPEN.value)
const puedeGuardar = computed(() => isPEN.value)
const puedeAprobar = computed(() => isPEN.value)
const puedeAnular  = computed(() => isPEN.value)
const isEditable = computed(() => isPEN.value)   
const puedeEditarDetalle = computed(() => isPEN.value)



const canAddDetalle = computed(() => {
  if (loading.value) return false
  if (!puedeEditarDetalle.value) return false
  if (!nuevoDetalle.value.prd_codigo) return false
  if (!nuevoDetalle.value.pxfa_cantidad || nuevoDetalle.value.pxfa_cantidad <= 0) return false
  return true
})

const subtotal = computed(() => {
  return detalle.value.reduce((acc, d) => {
    const precio = Number(d.prd_precio_venta || d.prd_precio || 0)
    const cantidad = Number(d.pxfa_cantidad || 0)
    return acc + precio * cantidad
  }, 0)
})



const iva = computed(() => subtotal.value * 0.15)
const total = computed(() => subtotal.value + iva.value)

watch(
  () => [subtotal.value, iva.value, total.value],
  () => {
    factura.value.fac_subtotal = subtotal.value
    factura.value.fac_iva = iva.value
    factura.value.fac_total = total.value
  }
)


/* ===========================
   LOADERS
=========================== */

const loadFactura = async () => {
  if (isNueva.value) {
    factura.value = {
      fac_codigo: null,
      estado: 'PEN', 
      fac_descripcion: factura.value.fac_descripcion || ''
    }
    detalle.value = []
    return
  }

  loading.value = true 
  try {
  const facCodigoStr = facCodigo.value
  const res = await FacturaService.getByCodigo(facCodigoStr)

  if (!res || !res.data) {
    throw new Error('Respuesta inválida del backend')
  }

  const facturaApi = res.data.factura.factura
  const detalleApi = res.data.detalle

  if (!facturaApi) {
    throw new Error('Factura no encontrada')
  }

  factura.value = {
  ...facturaApi,
  fac_codigo: facturaApi.fac_codigo,
  estado: facturaApi.fac_estado?.toString().trim() || 'PEN'
}

  console.log('FAC_CODIGO EN STATE:', factura.value.fac_codigo)

  detalle.value = Array.isArray(detalleApi)
  ? detalleApi.map(d => ({
      ...d,
      pxfa_codigo: d.pxfa_codigo
        ? d.pxfa_codigo.toString().trim()
        : null
    }))
  : []


  nextTick(() => {
    factura.value.fac_subtotal = subtotal.value
    factura.value.fac_iva = iva.value
    factura.value.fac_total = total.value
  })

} catch (e) {
  console.error('ERROR loadFactura:', e)
  toast.error('Error al cargar factura')
}

}
console.log('LOAD FACTURA → fac_codigo:', factura.value.fac_codigo)

/* ===========================
   ACTIONS
=========================== */

const addDetalle = async () => {
  loading.value = true
  try {
    const producto = productos.value.find(
      p => p.prd_codigo === nuevoDetalle.value.prd_codigo
    )

    if (!producto) {
      toast.error('Producto inválido')
      return
    }

    // CASO 1: Factura Nueva (Solo Frontend)
    if (isNueva.value) {
        detalle.value.push({
            prd_codigo: producto.prd_codigo,
            pxfa_cantidad: nuevoDetalle.value.pxfa_cantidad,
            prd_precio_venta: producto.prd_precio_venta,
            pxfa_subtotal: Number(producto.prd_precio_venta) * Number(nuevoDetalle.value.pxfa_cantidad),
            pxfa_codigo: null // Indicador de que es local
        })
        
        nuevoDetalle.value = { prd_codigo: '', pxfa_cantidad: 1 }
        toast.success('Detalle agregado (Local)')
        loading.value = false
        return
    }

    // CASO 2: Factura Existente (Backend)
    const res = await FacturaService.addDetalle({
      fac_codigo: factura.value.fac_codigo,
      prd_codigo: nuevoDetalle.value.prd_codigo,
      pxfa_cantidad: nuevoDetalle.value.pxfa_cantidad
    })

    // Actualizar estado con respuesta del backend
    if (res.data.factura) factura.value = res.data.factura
    if (res.data.detalle) detalle.value = res.data.detalle

    nuevoDetalle.value = { prd_codigo: '', pxfa_cantidad: 1 }
    hasChanges.value = true

    toast.success('Detalle agregado')
  } catch (e) {
    console.error('ERROR ADD DETALLE:', e)
    toast.error(e.response?.data?.message || e.message || 'Error al agregar detalle')
  } finally {
    loading.value = false
  }
}

const onCantidadChange = (item) => {
  item.pxfa_subtotal =
    Number(item.prd_precio_venta) * Number(item.pxfa_cantidad)
}


const eliminarDetalle = async (index) => {
  const item = detalle.value[index]

  // CASO 1: aún no está en BD (factura nueva)
  if (!item.pxfa_codigo) {
    detalle.value.splice(index, 1)
    toast.success('Detalle eliminado')
    return
  }

  // CASO 2: ya existe en BD (edición)
  try {
    const res = await FacturaService.deleteDetalle(item.pxfa_codigo)

    // Actualizar estado con respuesta del backend
    if (res.data.factura) factura.value = res.data.factura
    if (res.data.detalle) detalle.value = res.data.detalle

    toast.success('Detalle eliminado')
  } catch (e) {
    toast.error(e.response?.data?.message || 'Error al eliminar detalle')
  }
}




// ✅ AÑADIDO: guardar cabecera de factura (solo para NUEVA)

const guardarFactura = async () => { 
  if (!isNueva.value) return

  if (!clienteSeleccionado.value) {
    toast.error('Debe seleccionar un cliente')
    return
  }

  if (!detalle.value || detalle.value.length === 0) {
    toast.error('Debe agregar al menos un producto al detalle') 
    return
  }

  loading.value = true

  try {
    // 1) Crear cabecera (SIN fac_codigo)
    const payload = {
      cli_codigo: factura.value.cli_codigo,
      fac_descripcion: factura.value.fac_descripcion,
      fac_subtotal: factura.value.fac_subtotal,
      fac_iva: factura.value.fac_iva,
      fac_total: factura.value.fac_total,
      fac_fecha: factura.value.fac_fecha,
      estado: 'PEN'
    }

    const { data } = await FacturaService.create(payload)
    const nuevoCodigo = data?.fac_codigo ?? data?.data?.fac_codigo

    if (!nuevoCodigo) {
      toast.error('No se recibió fac_codigo al crear factura')
      return
    }

    // 2) Insertar detalle en BD (uno por uno)
    for (const d of detalle.value) {
      await FacturaService.addDetalle({
        fac_codigo: nuevoCodigo,
        prd_codigo: d.prd_codigo,
        pxfa_cantidad: d.pxfa_cantidad
      })
    }

    toast.success('Factura y detalle guardados correctamente')

    // 3) Redirigir a la factura ya creada
    router.replace(`/admin/factura/${nuevoCodigo}`)

  } catch (e) {
    toast.error(e?.response?.data?.message || 'Error al crear factura')
  } finally {
    loading.value = false
  }
}



const guardarDetalle = async () => {
  console.log(
  'GUARDAR DETALLE → fac_codigo:',
  factura.value.fac_codigo,
  'isNueva:',
  isNueva.value
)

  loading.value = true
  try {
    for (const d of detalle.value) {
      console.log(
        'GUARDAR DETALLE → fac_codigo:',
        factura.value.fac_codigo,
        'isNueva:',
        isNueva.value
      )
      await FacturaService.updateDetalle(d.pxfa_codigo, {
        pxfa_cantidad: d.pxfa_cantidad
      })
    }
    hasChanges.value = false
    toast.success('Cambios guardados')
    await loadFactura()
  } catch {
    toast.error('Error al guardar cambios')
  } finally {
    loading.value = false
  }
}

const aprobarFactura = async () => {
  await FacturaService.aprobar(factura.value.fac_codigo)
  toast.success('Factura aprobada')
  router.push('/admin/factura')
}

const anularFactura = async () => {
  await FacturaService.anular(factura.value.fac_codigo)
  toast.success('Factura anulada')
  router.push('/admin/factura')
}

const markChanged = () => {
  hasChanges.value = true
}

/* ===========================
   UTILS
=========================== */

const money = v => `$${Number(v).toFixed(2)}`
const clean = v => (v || '').trim()

/* ===========================
   INIT
=========================== */


</script>
