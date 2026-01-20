<template>
  <div class="container-fluid">
    <!-- CABECERA -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h4 class="mb-1">
              No. Factura: {{ facCodigo === 'NUEVA' ? 'NUEVA' : facCodigo }}
            </h4> 
            <span
              class="badge"
              :class="factura.fac_estado === 'PEN' ? 'bg-warning' : 'bg-success'"
            >
              {{ factura.fac_estado }}
            </span>
            
            <!-- CABECERA FACTURA NUEVA (AÑADIDO) -->
            <div v-if="isNueva" class="row mt-3 g-3">
              <div class="col-md-6">
                <label class="form-label">Cliente</label>
                <select v-model="clienteSeleccionado" class="form-select">
                  <option value="">Seleccione cliente</option>
                  <option
                    v-for="c in clientes"
                    :key="c.cli_codigo"
                    :value="c"
                  >
                    {{ c.cli_ruc }} - {{ c.cli_razon_social }}
                  </option>
                </select>
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
              class="btn btn-primary me-2"
              v-if="isEditable"
              :disabled="!hasChanges || loading"
              @click="guardarDetalle"
            >
              Guardar
            </button>

            <button
              class="btn btn-success me-2"
              :disabled="factura.fac_estado !== 'PEN' || loading"
              @click="aprobarFactura"
            >
              Aprobar
            </button>

            <button
              class="btn btn-danger"
              :disabled="factura.fac_estado !== 'PEN' || loading"
              @click="anularFactura"
            >
              Anular
            </button>
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
              :disabled="loading"
            />
          </div>

          <div class="col-md-3 d-grid">
            <button
              class="btn btn-primary"
              :disabled="!canAddDetalle"
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

            <tr v-for="d in detalle" :key="d.pxfa_codigo">
              <td>{{ getProductoLabel(d.prd_codigo) }}</td>

              <td>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  v-model.number="d.pxfa_cantidad"
                  :disabled="!isEditable || loading"
                  @change="markChanged"
                />
              </td>

              <td>{{ money(d.prd_precio_venta) }}</td>
              <td>{{ money(Number(d.prd_precio_venta) * Number(d.pxfa_cantidad)) }}</td>

              <td class="text-center">
              <button
                class="btn btn-sm btn-danger"
                @click="console.log('CLICK OK')"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/utils/toast'

import FacturaService from '@/api/admin/factura.service'
import { ProductoService } from '@/api/admin/producto.service'
import ClienteService from '@/api/admin/cliente.service'



console.log('FacturaService methods:', FacturaService)


const route = useRoute()
const router = useRouter()

// ✅ AÑADIDO: soporte para pantalla NUEVA
const facCodigo = computed(() => route.params.id)
const isNueva = computed(() => facCodigo.value === 'NUEVA')

// ✅ AÑADIDO: cabecera (cliente) para FACTURA NUEVA
const clientes = ref([])
const clienteSeleccionado = ref(null)

const loading = ref(false)
const hasChanges = ref(false)

const factura = ref({
  fac_codigo: '',
  fac_estado: 'PEN',
  fac_descripcion: ''
})

const detalle = ref([])

const productos = ref([])

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
    console.log('➡️ loadClientes ejecutado')

    const res = await ClienteService.getAll()

    console.log('📦 RESPUESTA COMPLETA CLIENTES:', res)
    console.log('📦 res.data:', res.data)
    console.log('📦 res.data.data:', res.data?.data)

    clientes.value = res.data?.data ?? res.data ?? []

    console.log('✅ clientes.value FINAL:', clientes.value)
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

const isEditable = computed(() =>
  factura.value.fac_estado?.trim() === 'PEN'
)

const canAddDetalle = computed(() => {
  if (loading.value) return false
  if (!isEditable.value) return false
  if (!nuevoDetalle.value.prd_codigo) return false
  if (!nuevoDetalle.value.pxfa_cantidad || nuevoDetalle.value.pxfa_cantidad <= 0) return false
  return true
})

const subtotal = computed(() => {
  return detalle.value.reduce((acc, d) => {
    const precio = Number(d.prd_precio_venta || 0)
    const cantidad = Number(d.pxfa_cantidad || 0)
    return acc + precio * cantidad
  }, 0)
})

const iva = computed(() => subtotal.value * 0.15)
const total = computed(() => subtotal.value + iva.value)

/* ===========================
   LOADERS
=========================== */

const loadFactura = async () => {
  // ✅ CASO FACTURA NUEVA (NO LLAMA BACKEND)
  if (isNueva.value) {
    factura.value = {
      ...factura.value,
      fac_codigo: null,
      fac_estado: 'PEN',
      fac_descripcion: factura.value.fac_descripcion || ''
    }
    detalle.value = []
    return
  }

  loading.value = true
  try {
    const facCodigoStr = facCodigo.value
    const { data } = await FacturaService.getByCodigo(facCodigoStr)
    factura.value = data.factura
    detalle.value = data.detalle ?? []
  } catch (e) {
    toast.error('Error al cargar factura')
  } finally {
    loading.value = false
  }
}


/* ===========================
   ACTIONS
=========================== */

const addDetalle = async () => {
  loading.value = true
  try {
    await FacturaService.addDetalle({
      fac_codigo: factura.value.fac_codigo,
      prd_codigo: nuevoDetalle.value.prd_codigo,
      pxfa_cantidad: nuevoDetalle.value.pxfa_cantidad
    })

    await loadFactura()
    nuevoDetalle.value = { prd_codigo: '', pxfa_cantidad: 1 }
    hasChanges.value = true
    toast.success('Detalle agregado')
  } catch (e) {
    toast.error(e.response?.data?.message || 'Error al agregar detalle')
  } finally {
    loading.value = false
  }
}

const eliminarDetalle = async (d) => {
  loading.value = true
  console.log('DETALLE A ELIMINAR:', d)
  console.log('pxfa_codigo:', d.pxfa_codigo)

  try {
    await FacturaService.deleteDetalle(d.pxfa_codigo)
    await loadFactura()
    hasChanges.value = true
  } catch {
    toast.error('Error al eliminar detalle')
  } finally {
    loading.value = false
  }
}


// ✅ AÑADIDO: guardar cabecera de factura (solo para NUEVA)
const guardarFactura = async () => {
  if (!isNueva.value) return
  if (!clienteSeleccionado.value) {
    toast.error('Debe seleccionar un cliente')
    return
  }

  loading.value = true
  try {
    const payload = {
      cli_ruc_cedula: clienteSeleccionado.value.cli_ruc_cedula,
      cli_nombre: clienteSeleccionado.value.cli_nombre,
      fac_descripcion: factura.value.fac_descripcion
    }

    const { data } = await FacturaService.create(payload)
    toast.success('Factura creada correctamente')

    // redirigir a la factura real creada
    const nuevoCodigo = data?.fac_codigo ?? data?.data?.fac_codigo
    if (nuevoCodigo) {
      router.replace(`/admin/factura/${nuevoCodigo}`)
    } else {
      // si backend retorna diferente, se verá en consola del network
      toast.error('No se recibió fac_codigo al crear factura')
    }
  } catch (e) {
    toast.error(e?.response?.data?.message || 'Error al crear factura')
  } finally {
    loading.value = false
  }
}
const guardarDetalle = async () => {
  loading.value = true
  try {
    for (const d of detalle.value) {
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
