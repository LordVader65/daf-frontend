<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button 
        @click="goBack" 
        class="btn-back" 
        aria-label="Regresar a la lista de kardex"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>Nuevo registro de Kardex Producto</h2>
      <p class="text-muted">Registre un movimiento de inventario de producto terminado</p>
    </div>

    <form @submit.prevent="handleSubmit" class="product-form" novalidate>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              
              <p class="text-muted small mb-4">
                <span class="text-danger">*</span> Campos obligatorios
              </p>

              <!-- Producto -->
              <div class="mb-4">
                <label for="producto" class="form-label fw-semibold">
                  Producto <span class="text-danger">*</span>
                </label>
                <select
                  id="producto"
                  v-model="formData.producto"
                  class="form-select"
                  :class="{ 'is-invalid': errors.producto }"
                  required
                  :disabled="loadingProductos"
                >
                  <option value="">Seleccione un producto</option>
                  <option
                    v-for="prod in productos"
                    :key="prod.prd_codigo"
                    :value="prod.prd_codigo"
                  >
                    {{ prod.prd_nombre }}
                  </option>
                </select>
                <div v-if="errors.producto" class="invalid-feedback d-block">
                  {{ errors.producto }}
                </div>
              </div>

              <!-- Transacción -->
              <div class="mb-4">
                <label for="transaccion" class="form-label fw-semibold">
                  Transacción <span class="text-danger">*</span>
                </label>
                <select
                  id="transaccion"
                  v-model="formData.transaccion"
                  class="form-select"
                  :class="{ 'is-invalid': errors.transaccion }"
                  required
                  :disabled="loadingTransaccion"
                >
                  <option value="">Seleccione una transacción</option>
                  <option
                    v-for="trn in transacciones"
                    :key="trn.trn_cod"
                    :value="trn.trn_cod"
                  >
                    {{ trn.trn_descripcion }}
                  </option>
                </select>
                <div v-if="errors.transaccion" class="invalid-feedback d-block">
                  {{ errors.transaccion }}
                </div>
              </div>

              <!-- Estándar (CONDICIONAL) -->
              <div v-if="showEstandarField" class="mb-4 animate-fade-in">
                <label for="estandar" class="form-label fw-semibold text-primary">
                  Estándar Asociado <span class="text-danger">*</span>
                </label>
                <select
                  id="estandar"
                  v-model="formData.estandar"
                  class="form-select border-primary"
                  :class="{ 'is-invalid': errors.estandar }"
                  :required="showEstandarField"
                  :disabled="loadingEstandares"
                >
                  <option value="">Seleccione un estándar aprobado</option>
                  <option
                    v-for="est in estandaresFiltrados"
                    :key="est.est_cod"
                    :value="est.est_cod"
                  >
                   {{ est.prd_nombre || 'Estándar' }} (Cod: {{ est.est_cod }})
                  </option>
                </select>
                 <div class="form-text text-muted">
                    Seleccione el estándar de producción que justifica esta salida.
                </div>
                <div v-if="errors.estandar" class="invalid-feedback d-block">
                  {{ errors.estandar }}
                </div>
              </div>

              <!-- Cantidad -->
              <div class="mb-4">
                <label for="cantidad" class="form-label fw-semibold">
                  Cantidad <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="cantidad"
                  v-model.number="formData.cantidad"
                  class="form-control"
                  :class="{ 'is-invalid': errors.cantidad }"
                  placeholder="0"
                  min="1"
                  step="1"
                  required
                />
                <div v-if="errors.cantidad" class="invalid-feedback d-block">
                  {{ errors.cantidad }}
                </div>
              </div>

              <!-- Razón -->
              <div class="mb-4">
                <label for="razon" class="form-label fw-semibold">
                  Razón
                </label>
                <input
                  type="text"
                  id="razon"
                  v-model="formData.razon"
                  class="form-control"
                  :class="{ 'is-invalid': errors.razon }"
                  placeholder="Motivo del movimiento..."
                  maxlength="60"
                />
                <div v-if="errors.razon" class="invalid-feedback d-block">
                  {{ errors.razon }}
                </div>
              </div>

              <hr class="my-4">

              <!-- Botones -->
              <div class="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  @click="goBack"
                  class="btn btn-outline-secondary"
                  :disabled="submitting"
                >
                  <Icon icon="mdi:close" width="20" class="me-1"></Icon>
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  <Icon v-if="submitting" icon="mdi:loading" width="20" class="spinner me-1"></Icon>
                  <Icon v-else icon="mdi:content-save" width="20" class="me-1"></Icon>
                  {{ submitting ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { obtainToken } from '../../../utils/obtain-token.js';
import { toast } from '../../../utils/toast.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos'
});

export default {
  name: 'KardexProductForm',
  data() {
    return {
      loadingProductos: false,
      loadingTransaccion: false,
      loadingEstandares: false,
      submitting: false,
      
      productos: [],
      transacciones: [],
      estandares: [],
      
      formData: {
        producto: '',
        transaccion: '',
        estandar: '',
        cantidad: 0,
        razon: ''
      },
      errors: {}
    };
  },
  computed: {
    // Lógica para mostrar el campo estándar
    showEstandarField() {
        if (!this.formData.transaccion || !this.formData.producto) return false;
        
        // Buscar la transacción seleccionada
        const trn = this.transacciones.find(t => t.trn_cod === this.formData.transaccion);
        
        if (!trn) return false;

        // Comprobar si es Salida. 
        // Buscamos "SALIDA" en la descripción o código "ESA" (usuario mencionó ESI/ESA)
        const descUpper = trn.trn_descripcion.toUpperCase();
        const codeUpper = trn.trn_cod.trim().toUpperCase();
        
        // Ajustar según los códigos reales de tu base de datos.
        // Asumo ESA (Egreso Stock/Salida) o ESI (Egreso Stock Interno?) o simplemente que contenga SALIDA
        return descUpper.includes('SALIDA') || codeUpper.startsWith('S') || codeUpper.includes('ESA') || codeUpper.includes('ESI');
    },
    
    // Filtrar estándares: Solo APROBADOS.
    // Opcional: Filtrar también por el producto seleccionado si la relación existe en los datos
    estandaresFiltrados() {
        return this.estandares.filter(e => {
            const estado = e.est_estado ? e.est_estado.trim().toUpperCase() : '';
            const isActive = estado === 'APROBADO' || estado === 'APR';
            
            // Si el estándar tiene prd_codigo, filtramos para que coincida con el producto seleccionado
            const matchesProduct = e.prd_codigo ? e.prd_codigo.trim() === this.formData.producto.trim() : true;
            
            return isActive && matchesProduct;
        });
    }
  },
  watch: {
    // Si se oculta el campo estándar, limpiamos su valor
    showEstandarField(newVal) {
        if (!newVal) {
            this.formData.estandar = '';
        }
    }
  },
  async mounted() {
    await Promise.all([
        this.loadProductos(),
        this.loadTransacciones(),
        this.loadEstandares()
    ]);
  },
  methods: {
    async loadProductos() {
      this.loadingProductos = true;
      try {
        const token = obtainToken();
        // Usamos endpoint de producto
        const { data } = await api.get('/producto', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.productos = data.data || data; // Ajustar según estructura de respuesta
      } catch (err) {
        toast.error('Error al cargar productos');
      } finally {
        this.loadingProductos = false;
      }
    },
    async loadTransacciones() {
      this.loadingTransaccion = true;
      try {
        const token = obtainToken();
        const { data } = await api.get('/transaccion', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.transacciones = data;
      } catch (err) {
        toast.error('Error al cargar transacciones');
      } finally {
        this.loadingTransaccion = false;
      }
    },
    async loadEstandares() {
      this.loadingEstandares = true;
      try {
        const token = obtainToken();
        // Cargamos todos los estándares para luego filtrar en el cliente
        // Idealmente el backend debería filtrar, pero hacemos fetch all por ahora
        const { data } = await api.get('/estandar', {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 1000 } // Traer suficientes
        });
        this.estandares = data.data || [];
      } catch (err) {
        console.error("Error loading standards", err);
        // No mostramos error invasivo si falla esto, solo no aparecerán
      } finally {
        this.loadingEstandares = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.producto) this.errors.producto = 'Seleccione un producto';
      if (!this.formData.transaccion) this.errors.transaccion = 'Seleccione una transacción';
      if (this.formData.cantidad <= 0) this.errors.cantidad = 'La cantidad debe ser mayor a 0';
      
      if (this.showEstandarField && !this.formData.estandar) {
          this.errors.estandar = 'Para salidas, debe asociar un estándar aprobado';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        toast.warning('Corrija los errores antes de guardar');
        return;
      }

      this.submitting = true;
      try {
        const token = obtainToken();
        const payload = {
            prd_codigo: this.formData.producto,
            trn_cod: this.formData.transaccion,
            krd_prd_cantidad: this.formData.cantidad,
            krd_razon: this.formData.razon,
            est_cod: this.formData.estandar || null
        };

        await api.post('/kardex-producto', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('Movimiento registrado correctamente');
        this.goBack();
      } catch (err) {
        const msg = err.response?.data?.message || 'Error al guardar movimiento';
        toast.error(msg);
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      this.$router.push('/admin/kardex/producto');
    }
  }
};
</script>

<style src="../../../assets/css/form.css"/>
<style src="../../../assets/css/admin/crud-form.css"></style>
<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
.border-primary {
    border-color: #944000 !important; /* Color primario del proyecto */
}
.text-primary {
    color: #944000 !important;
}
</style>
