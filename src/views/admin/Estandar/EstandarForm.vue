<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button 
        @click="goBack" 
        class="btn-back" 
        aria-label="Regresar a la lista de estándares"
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>
    <div class="form-header text-center mb-4">
      <h2>{{ pageTitle }}</h2>
      <p class="text-muted">{{ pageSubtitle }}</p>
      <!-- Indicador de estado (H1: Visibilidad del estado) -->
      <span v-if="isEditMode" :class="['badge', 'badge-lg', estadoBadgeClass]">
        {{ estadoLabel }}
      </span>
    </div>

    <div v-if="loadingData" class="loading-container d-flex flex-column align-items-center py-5">
      <Icon icon="mdi:loading" width="48" class="spinner text-primary"></Icon>
      <p class="mt-3 text-muted">Cargando datos...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="estandar-form" novalidate>
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              
              <p class="text-muted small mb-4">
                <span class="text-danger">*</span> Campos obligatorios
              </p>

              <!-- ========== SECCIÓN CABECERA ========== -->
              <div class="section-header">
                <Icon icon="mdi:file-document" width="24" class="me-2"/>
                Información del Estándar
              </div>

              <div class="row">
                <!-- Código (solo en modo edición) -->
                <div v-if="isEditMode" class="col-md-4 mb-4">
                  <label class="form-label fw-semibold">Código</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="formData.est_cod"
                    disabled
                    aria-describedby="codigo_help"
                  />
                  <div id="codigo_help" class="form-text">
                    Código generado automáticamente
                  </div>
                </div>

                <!-- Producto -->
                <div :class="isEditMode ? 'col-md-8 mb-4' : 'col-12 mb-4'">
                  <label for="producto" class="form-label fw-semibold">
                    Producto <span class="text-danger">*</span>
                  </label>
                  <select
                    id="producto"
                    v-model="formData.prd_codigo"
                    class="form-select"
                    :class="{ 'is-invalid': errors.prd_codigo }"
                    required
                    :disabled="loadingProductos || isEditMode || isReadOnly"
                    aria-describedby="producto_help"
                  >
                    <option value="">Seleccione un producto</option>
                    <option
                      v-for="producto in productos"
                      :key="producto.prd_codigo"
                      :value="producto.prd_codigo.trim()"
                    >
                      {{ producto.prd_codigo.trim() }} - {{ producto.prd_nombre.trim() }}
                    </option>
                  </select>
                  <div v-if="errors.prd_codigo" class="invalid-feedback d-block">
                    <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                    {{ errors.prd_codigo }}
                  </div>
                  <div id="producto_help" class="form-text">
                    <template v-if="isEditMode">
                      El producto no puede modificarse después de crear el estándar
                    </template>
                    <template v-else>
                      Seleccione el producto para este estándar
                    </template>
                  </div>
                </div>
              </div>

              <!-- ========== SECCIÓN DETALLES ========== -->
              <div class="section-header mt-4">
                <Icon icon="mdi:format-list-bulleted" width="24" class="me-2"/>
                Materias Primas
                <span class="badge badge-count ms-2">{{ detalles.length }}</span>
              </div>

              <!-- Mensaje de error para detalles vacíos -->
              <div v-if="errors.detalles" class="alert alert-danger d-flex align-items-center mb-3">
                <Icon icon="mdi:alert-circle" width="20" class="me-2"/>
                {{ errors.detalles }}
              </div>

              <!-- Tabla de detalles -->
              <div class="detalles-container">
                <div v-if="detalles.length === 0" class="empty-detalles">
                  <Icon icon="mdi:package-variant" width="48" class="text-muted"/>
                  <p class="text-muted mt-2">No hay materias primas agregadas</p>
                  <button 
                    v-if="!isReadOnly"
                    type="button" 
                    @click="openAddDetalleModal"
                    class="btn btn-outline-primary mt-2"
                  >
                    <Icon icon="mdi:plus" width="20" class="me-1"/>
                    Agregar primera materia prima
                  </button>
                </div>

                <div v-else class="table-responsive">
                  <table class="table table-detalles">
                    <thead>
                      <tr>
                        <th style="width: 50%;">Materia Prima</th>
                        <th style="width: 30%;">Cantidad</th>
                        <th v-if="!isReadOnly" style="width: 20%;">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(detalle, index) in detalles" :key="detalle.mp_codigo">
                        <td>
                          <div class="d-flex align-items-center">
                            <code class="codigo me-2">{{ detalle.mp_codigo }}</code>
                            <span v-if="detalle.mp_descripcion" class="text-muted small">
                              {{ detalle.mp_descripcion }}
                            </span>
                          </div>
                        </td>
                        <td>
                          <input
                            v-if="!isReadOnly"
                            type="number"
                            v-model.number="detalle.mxp_cantidad"
                            class="form-control form-control-sm cantidad-input"
                            :class="{ 'is-invalid': detalleErrors[index]?.cantidad }"
                            min="1"
                            step="1"
                            @change="validateDetalle(index)"
                            :aria-label="'Cantidad de ' + detalle.mp_codigo"
                          />
                          <span v-else class="cantidad-display">{{ detalle.mxp_cantidad }}</span>
                          <div v-if="detalleErrors[index]?.cantidad" class="invalid-feedback d-block">
                            {{ detalleErrors[index].cantidad }}
                          </div>
                        </td>
                        <td v-if="!isReadOnly">
                          <button
                            type="button"
                            @click="confirmDeleteDetalle(index)"
                            class="btn btn-sm btn-danger"
                            :aria-label="'Eliminar ' + detalle.mp_codigo"
                            title="Eliminar materia prima"
                          >
                            <Icon icon="mdi:delete" width="18"/>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Botón agregar detalle -->
                <div v-if="!isReadOnly && detalles.length > 0" class="add-detalle-section">
                  <button 
                    type="button" 
                    @click="openAddDetalleModal"
                    class="btn btn-outline-primary"
                  >
                    <Icon icon="mdi:plus" width="20" class="me-1"/>
                    Agregar Materia Prima
                  </button>
                </div>
              </div>

              <!-- Separador visual -->
              <hr class="my-4">

              <!-- Botones de acción (H3: Control y libertad) -->
              <div class="d-flex justify-content-between flex-wrap gap-3">
                <div>
                  <button
                    type="button"
                    @click="goBack"
                    class="btn btn-outline-secondary"
                    :disabled="submitting"
                    aria-label="Cancelar y volver a la lista"
                  >
                    <Icon icon="mdi:close" width="20" class="me-1"></Icon>
                    {{ isReadOnly ? 'Cerrar' : 'Cancelar' }}
                  </button>
                </div>
                
                <div v-if="!isReadOnly" class="d-flex gap-2 flex-wrap">
                  <!-- Botón Aprobar (solo en edición con estado PEN) -->
                  <button
                    v-if="isEditMode && estadoActual === 'PEN'"
                    type="button"
                    @click="aprobarEstandar"
                    class="btn btn-success"
                    :disabled="submitting"
                    aria-label="Aprobar estándar"
                  >
                    <Icon icon="mdi:check-circle" width="20" class="me-1"/>
                    Aprobar
                  </button>
                  
                  <!-- Botón Anular (solo en edición con estado PEN) -->
                  <button
                    v-if="isEditMode && estadoActual === 'PEN'"
                    type="button"
                    @click="anularEstandar"
                    class="btn btn-warning"
                    :disabled="submitting"
                    aria-label="Anular estándar"
                  >
                    <Icon icon="mdi:cancel" width="20" class="me-1"/>
                    Anular
                  </button>

                  <!-- Botón Guardar -->
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="submitting || !isFormValid"
                    aria-label="Guardar estándar"
                  >
                    <Icon
                      v-if="submitting"
                      icon="mdi:loading"
                      width="20"
                      class="spinner me-1"
                    ></Icon>
                    <Icon v-else icon="mdi:content-save" width="20" class="me-1"></Icon>
                    {{ submitting ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Modal para agregar detalle -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Agregar Materia Prima</h3>
          <button @click="closeAddModal" class="btn-close-modal" aria-label="Cerrar">
            <Icon icon="mdi:close" width="24"/>
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="nueva_mp" class="form-label fw-semibold">
              Materia Prima <span class="text-danger">*</span>
            </label>
            <select
              id="nueva_mp"
              v-model="nuevoDetalle.mp_codigo"
              class="form-select"
              :class="{ 'is-invalid': nuevoDetalleErrors.mp_codigo }"
              :disabled="loadingMateriasPrimas"
            >
              <option value="">Seleccione una materia prima</option>
              <option
                v-for="mp in materiasPrimas"
                :key="mp.mp_codigo"
                :value="mp.mp_codigo.trim()"
              >
                {{ mp.mp_codigo.trim() }} - {{ mp.mp_descripcion?.trim() }}
              </option>
            </select>
            <div v-if="nuevoDetalleErrors.mp_codigo" class="invalid-feedback d-block">
              {{ nuevoDetalleErrors.mp_codigo }}
            </div>
          </div>
          <div class="mb-3">
            <label for="nueva_cantidad" class="form-label fw-semibold">
              Cantidad <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              id="nueva_cantidad"
              v-model.number="nuevoDetalle.mxp_cantidad"
              class="form-control"
              :class="{ 'is-invalid': nuevoDetalleErrors.mxp_cantidad }"
              min="1"
              step="1"
              placeholder="Ingrese la cantidad"
            />
            <div v-if="nuevoDetalleErrors.mxp_cantidad" class="invalid-feedback d-block">
              {{ nuevoDetalleErrors.mxp_cantidad }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="closeAddModal" class="btn btn-outline-secondary">
            Cancelar
          </button>
          <button type="button" @click="addDetalle" class="btn btn-primary">
            <Icon icon="mdi:plus" width="20" class="me-1"/>
            Agregar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="closeDeleteModal" class="btn-close-modal" aria-label="Cerrar">
            <Icon icon="mdi:close" width="24"/>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea eliminar esta materia prima del estándar?</p>
          <p class="item-name" v-if="detalleToDelete !== null">
            {{ detalles[detalleToDelete]?.mp_codigo }}
          </p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-outline-secondary">Cancelar</button>
          <button @click="deleteDetalle" class="btn btn-danger">
            <Icon icon="mdi:delete" width="20" class="me-1"/>
            Eliminar
          </button>
        </div>
      </div>
    </div>
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
  name: 'EstandarForm',
  data() {
    return {
      isEditMode: false,
      loadingData: false,
      loadingProductos: false,
      loadingMateriasPrimas: false,
      submitting: false,
      productos: [],
      materiasPrimas: [],
      estadoActual: 'PEN',
      formData: {
        est_cod: '',
        prd_codigo: ''
      },
      detalles: [],
      detallesOriginales: [], // Para tracking de cambios
      detallesEliminados: [], // Para enviar DELETE
      errors: {},
      detalleErrors: [],
      // Modal agregar detalle
      showAddModal: false,
      nuevoDetalle: {
        mp_codigo: '',
        mxp_cantidad: 1
      },
      nuevoDetalleErrors: {},
      // Modal eliminar
      showDeleteModal: false,
      detalleToDelete: null
    };
  },
  computed: {
    isReadOnly() {
      return this.estadoActual === 'APR' || this.estadoActual === 'ANU';
    },
    isFormValid() {
      if (!this.formData.prd_codigo) return false;
      if (this.detalles.length === 0) return false;
      
      // Validar que todas las cantidades sean válidas
      for (const detalle of this.detalles) {
        if (!detalle.mxp_cantidad || detalle.mxp_cantidad < 1) {
          return false;
        }
      }
      
      return true;
    },
    pageTitle() {
      if (this.isReadOnly) return 'Ver Estándar';
      if (this.isEditMode) return 'Editar Estándar';
      return 'Nuevo Estándar';
    },
    pageSubtitle() {
      if (this.isReadOnly) return 'Visualización de estándar (solo lectura)';
      if (this.isEditMode) return 'Modifique los detalles del estándar';
      return 'Complete todos los campos requeridos';
    },
    estadoLabel() {
      const labels = {
        'PEN': 'Pendiente',
        'APR': 'Aprobado',
        'ANU': 'Anulado'
      };
      return labels[this.estadoActual] || this.estadoActual;
    },
    estadoBadgeClass() {
      const classes = {
        'PEN': 'badge-warning',
        'APR': 'badge-success',
        'ANU': 'badge-danger'
      };
      return classes[this.estadoActual] || 'badge-secondary';
    }
  },
  async mounted() {
    await this.loadProductos();
    await this.loadMateriasPrimas();

    const codigo = this.$route.params.id;
    if (codigo) {
      this.isEditMode = true;
      await this.loadEstandar(codigo);
    }
  },
  methods: {
    async loadProductos() {
      this.loadingProductos = true;
      try {
        const token = obtainToken();
        const { data } = await api.get('/producto/type', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.productos = data || [];
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar productos';
        toast.error(errorMsg);
      } finally {
        this.loadingProductos = false;
      }
    },

    async loadMateriasPrimas() {
      this.loadingMateriasPrimas = true;
      try {
        const token = obtainToken();
        const { data } = await api.get('/materiaprima/type', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.materiasPrimas = data || [];
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar materias primas';
        toast.error(errorMsg);
      } finally {
        this.loadingMateriasPrimas = false;
      }
    },

    async loadEstandar(codigo) {
      this.loadingData = true;
      try {
        const token = obtainToken();
        const { data } = await api.get(`/estandar/${codigo}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.formData = {
          est_cod: data.est_cod?.trim() || '',
          prd_codigo: data.prd_codigo?.trim() || ''
        };
        
        this.estadoActual = data.est_estado?.trim() || 'PEN';
        
        // Cargar detalles
        this.detalles = (data.detalles || []).map(d => ({
          mp_codigo: d.mp_codigo?.trim() || '',
          mxp_cantidad: parseInt(d.mxp_cantidad) || 0,
          mp_descripcion: this.getMateriaDescripcion(d.mp_codigo?.trim()),
          isOriginal: true
        }));
        
        // Guardar copia original para tracking
        this.detallesOriginales = JSON.parse(JSON.stringify(this.detalles));
        
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar el estándar';
        toast.error(errorMsg);
        this.goBack();
      } finally {
        this.loadingData = false;
      }
    },

    getMateriaDescripcion(codigo) {
      const mp = this.materiasPrimas.find(m => m.mp_codigo?.trim() === codigo);
      return mp?.mp_descripcion?.trim() || '';
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.prd_codigo) {
        this.errors.prd_codigo = 'El producto es requerido';
      }

      if (this.detalles.length === 0) {
        this.errors.detalles = 'Debe agregar al menos una materia prima';
      }

      // Validar cada detalle
      this.detalleErrors = [];
      this.detalles.forEach((detalle, index) => {
        const errorObj = {};
        if (!detalle.mxp_cantidad || detalle.mxp_cantidad < 1) {
          errorObj.cantidad = 'La cantidad debe ser mayor a 0';
        }
        this.detalleErrors[index] = errorObj;
      });

      const hasDetalleErrors = this.detalleErrors.some(e => Object.keys(e).length > 0);

      return Object.keys(this.errors).length === 0 && !hasDetalleErrors;
    },

    validateDetalle(index) {
      if (!this.detalleErrors[index]) {
        this.detalleErrors[index] = {};
      }
      
      const detalle = this.detalles[index];
      if (!detalle.mxp_cantidad || detalle.mxp_cantidad < 1) {
        this.detalleErrors[index].cantidad = 'La cantidad debe ser mayor a 0';
      } else {
        delete this.detalleErrors[index].cantidad;
      }
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        toast.warning('Por favor, corrija los errores en el formulario');
        return;
      }

      this.submitting = true;

      try {
        const token = obtainToken();

        if (this.isEditMode) {
          // Modo edición: usar PUT para detalles y DELETE si hay eliminados
          await this.updateDetalles(token);
        } else {
          // Modo creación: POST completo
          const createData = {
            prd_codigo: this.formData.prd_codigo,
            detalles: this.detalles.map(d => ({
              mp_codigo: d.mp_codigo,
              mxp_cantidad: d.mxp_cantidad
            }))
          };

          await api.post('/estandar/', createData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          toast.success('Estándar creado correctamente');
        }

        this.$router.push('/admin/estandar');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al guardar el estándar';
        
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach(error => {
            toast.error(error);
          });
        } else {
          toast.error(errorMsg);
        }
      } finally {
        this.submitting = false;
      }
    },

    async updateDetalles(token) {
      // Primero eliminar los detalles marcados para eliminación
      if (this.detallesEliminados.length > 0) {
        await api.delete(`/estandar/${this.formData.est_cod}/detalle`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            materiasprimas: this.detallesEliminados
          }
        });
      }

      // Luego actualizar/insertar los detalles actuales
      if (this.detalles.length > 0) {
        await api.put(`/estandar/${this.formData.est_cod}/detalle`, {
          detalles: this.detalles.map(d => ({
            mp_codigo: d.mp_codigo,
            mxp_cantidad: d.mxp_cantidad
          }))
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      toast.success('Estándar actualizado correctamente');
    },

    async aprobarEstandar() {
      if (!confirm('¿Está seguro de aprobar este estándar? Esta acción no se puede deshacer.')) {
        return;
      }

      this.submitting = true;
      try {
        const token = obtainToken();
        const { message } = await api.put(`/estandar/${this.formData.est_cod}/aprobar`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        toast.success(message);
        this.$router.push('/admin/estandar');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al aprobar el estándar';
        toast.error(errorMsg);
      } finally {
        this.submitting = false;
      }
    },

    async anularEstandar() {
      if (!confirm('¿Está seguro de anular este estándar? Esta acción no se puede deshacer.')) {
        return;
      }

      this.submitting = true;
      try {
        const token = obtainToken();
        const { message } = await api.put(`/estandar/${this.formData.est_cod}/anular`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        toast.success(message);
        this.$router.push('/admin/estandar');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al anular el estándar';
        toast.error(errorMsg);
      } finally {
        this.submitting = false;
      }
    },

    openAddDetalleModal() {
      this.nuevoDetalle = {
        mp_codigo: '',
        mxp_cantidad: 1
      };
      this.nuevoDetalleErrors = {};
      this.showAddModal = true;
    },

    closeAddModal() {
      this.showAddModal = false;
    },

    addDetalle() {
      this.nuevoDetalleErrors = {};

      if (!this.nuevoDetalle.mp_codigo) {
        this.nuevoDetalleErrors.mp_codigo = 'Seleccione una materia prima';
        return;
      }

      // Validar que no esté duplicado
      const existe = this.detalles.some(d => d.mp_codigo === this.nuevoDetalle.mp_codigo);
      if (existe) {
        this.nuevoDetalleErrors.mp_codigo = 'Esta materia prima ya está agregada';
        toast.warning('Esta materia prima ya existe en la lista');
        return;
      }

      if (!this.nuevoDetalle.mxp_cantidad || this.nuevoDetalle.mxp_cantidad < 1) {
        this.nuevoDetalleErrors.mxp_cantidad = 'La cantidad debe ser mayor a 0';
        return;
      }

      this.detalles.push({
        mp_codigo: this.nuevoDetalle.mp_codigo,
        mxp_cantidad: this.nuevoDetalle.mxp_cantidad,
        mp_descripcion: this.getMateriaDescripcion(this.nuevoDetalle.mp_codigo),
        isOriginal: false
      });

      this.closeAddModal();
      toast.success('Materia prima agregada');
    },

    // Modal eliminar detalle
    confirmDeleteDetalle(index) {
      this.detalleToDelete = index;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.detalleToDelete = null;
    },

    deleteDetalle() {
      if (this.detalleToDelete !== null) {
        const detalle = this.detalles[this.detalleToDelete];
        
        // Si es un detalle original, agregarlo a la lista de eliminados para el DELETE
        if (detalle.isOriginal) {
          this.detallesEliminados.push(detalle.mp_codigo);
        }
        
        this.detalles.splice(this.detalleToDelete, 1);
        toast.info('Materia prima eliminada');
      }
      this.closeDeleteModal();
    },

    goBack() {
      this.$router.push('/admin/estandar');
    }
  }
};
</script>

<style src="../../../assets/css/form.css"/>
<style src="../../../assets/css/admin/crud-form.css"></style>

<style scoped>
.estandar-form {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #944000;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0a060;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.badge-lg {
  padding: 8px 20px;
  font-size: 16px;
}

.badge-count {
  background-color: #944000;
  color: white;
  padding: 2px 10px;
  font-size: 12px;
}

.badge-warning {
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
  background-color: #e2e3e5;
  color: #383d41;
}

.detalles-container {
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.empty-detalles {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.table-detalles {
  width: 100%;
  background-color: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table-detalles thead {
  background-color: #944000;
  color: white;
}

.table-detalles th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
}

.table-detalles td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

.table-detalles tbody tr:hover {
  background-color: #fff5e6;
}

.table-detalles tbody tr:last-child td {
  border-bottom: none;
}

.codigo {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  color: #944000;
  font-size: 13px;
}

.cantidad-input {
  max-width: 120px;
  text-align: center;
}

.cantidad-display {
  font-weight: 500;
  color: #333;
}

.add-detalle-section {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.alert {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Estilos de botones */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #944000;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #7a3400;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
}

.btn-warning {
  background-color: #ffc107;
  color: #333;
}

.btn-warning:hover:not(:disabled) {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-outline-secondary {
  background-color: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #6c757d;
  color: white;
}

.btn-outline-primary {
  background-color: transparent;
  color: #944000;
  border: 2px solid #944000;
}

.btn-outline-primary:hover:not(:disabled) {
  background-color: #944000;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #944000;
  font-size: 18px;
}

.btn-close-modal {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-close-modal:hover {
  background-color: #f0f0f0;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.item-name {
  font-weight: bold;
  color: #944000;
  margin: 16px 0;
  font-size: 16px;
}

/* Utilidades */
.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.align-items-center {
  align-items: center;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 16px;
}

.me-1 {
  margin-right: 4px;
}

.me-2 {
  margin-right: 8px;
}

.ms-2 {
  margin-left: 8px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 16px;
}

.mt-4 {
  margin-top: 24px;
}

.mb-3 {
  margin-bottom: 16px;
}

.mb-4 {
  margin-bottom: 24px;
}

.my-4 {
  margin-top: 24px;
  margin-bottom: 24px;
}

.py-5 {
  padding-top: 48px;
  padding-bottom: 48px;
}

.p-4 {
  padding: 24px;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: #666;
}

.text-danger {
  color: #dc3545;
}

.small {
  font-size: 14px;
}

.fw-semibold {
  font-weight: 600;
}

.table-responsive {
  overflow-x: auto;
}

.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  background-color: white;
}

.form-select:focus {
  outline: none;
  border-color: #944000;
}

.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-select.is-invalid {
  border-color: #dc3545;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
}

.form-control:focus {
  outline: none;
  border-color: #944000;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control-sm {
  padding: 6px 10px;
  font-size: 14px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  color: #333;
}

.form-text {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 13px;
  margin-top: 4px;
}

.d-block {
  display: block;
}

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.shadow-sm {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12px;
}

.col-12 {
  width: 100%;
  padding: 0 12px;
}

.col-md-4 {
  width: 33.333%;
  padding: 0 12px;
}

.col-md-8 {
  width: 66.666%;
  padding: 0 12px;
}

.col-lg-10 {
  width: 83.333%;
  padding: 0 12px;
}

@media (max-width: 992px) {
  .col-lg-10 {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .col-md-4, .col-md-8 {
    width: 100%;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 16px;
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
