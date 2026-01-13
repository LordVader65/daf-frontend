<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button 
        @click="goBack" 
        class="btn-back" 
        aria-label="Regresar a la lista de materias primas"
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>{{ isEditMode ? 'Editar Materia Prima' : 'Nueva Materia Prima' }}</h2>
      <p class="text-muted">
        {{ isEditMode ? 'Modifique los campos necesarios' : 'Complete todos los campos requeridos' }}
      </p>
    </div>

    <div v-if="loadingData" class="loading-container d-flex flex-column align-items-center py-5">
      <Icon icon="mdi:loading" width="48" class="spinner text-primary"></Icon>
      <p class="mt-3 text-muted">Cargando datos...</p>
    </div>
    <form v-else @submit.prevent="handleSubmit" class="materia-prima-form" novalidate>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              
              <p class="text-muted small mb-4">
                <span class="text-danger">*</span> Campos obligatorios
              </p>
              <div class="mb-4">
                <label for="unidad_medida" class="form-label fw-semibold">
                  Unidad de Medida <span class="text-danger">*</span>
                </label>
                <select
                  id="unidad_medida"
                  v-model="formData.unidad_medida"
                  class="form-select"
                  :class="{ 'is-invalid': errors.unidad_medida }"
                  required
                  :disabled="loadingUnidades"
                  aria-describedby="unidad_medida_help"
                >
                  <option value="">Seleccione una unidad</option>
                  <option
                    v-for="unidad in unidadesMedida"
                    :key="unidad.um_codigo"
                    :value="unidad.um_codigo.trim()"
                  >
                    {{ unidad.um_descripcion.trim() }}
                  </option>
                </select>
                <div v-if="errors.unidad_medida" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.unidad_medida }}
                </div>
                <div id="unidad_medida_help" class="form-text">
                  Seleccione la unidad en la que se mide esta materia prima
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-4">
                <label for="descripcion" class="form-label fw-semibold">
                  Descripción <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="descripcion"
                  v-model="formData.descripcion"
                  class="form-control"
                  :class="{ 'is-invalid': errors.descripcion }"
                  placeholder="Ej: Harina de trigo, Azúcar refinada..."
                  maxlength="60"
                  required
                  aria-describedby="descripcion_help"
                />
                <div v-if="errors.descripcion" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.descripcion }}
                </div>
                <div id="descripcion_help" class="form-text d-flex justify-content-between">
                  <span>Nombre descriptivo del material</span>
                  <span :class="{ 'text-warning': formData.descripcion.length > 50, 'text-danger': formData.descripcion.length >= 60 }">
                    {{ formData.descripcion.length }}/60
                  </span>
                </div>
              </div>

              <!-- Precio de Compra -->
              <div class="mb-4">
                <label for="costo" class="form-label fw-semibold">
                  Precio de Compra <span class="text-danger">*</span>
                </label>
                <div class="input-group" :class="{ 'has-validation': errors.costo }">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    id="costo"
                    v-model.number="formData.costo"
                    class="form-control"
                    :class="{ 'is-invalid': errors.costo }"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                    aria-describedby="costo_help"
                  />
                  <div v-if="errors.costo" class="invalid-feedback d-block">
                    <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                    {{ errors.costo }}
                  </div>
                </div>
                <div id="costo_help" class="form-text">
                  Costo unitario por unidad de medida
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
                  min="0"
                  step="1"
                  required
                  aria-describedby="cantidad_help"
                />
                <div v-if="errors.cantidad" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.cantidad }}
                </div>
                <div id="cantidad_help" class="form-text">
                  Cantidad inicial en inventario
                </div>
              </div>

              <!-- Prioridad -->
              <div class="mb-4">
                <label for="prioridad" class="form-label fw-semibold">
                  Prioridad <span class="text-danger">*</span>
                </label>
                <select
                  id="prioridad"
                  v-model="formData.prioridad"
                  class="form-select"
                  :class="{ 'is-invalid': errors.prioridad }"
                  required
                  aria-describedby="prioridad_help"
                >
                  <option value="">Seleccione una prioridad</option>
                  <option value="L">LIFO (Last In, First Out)</option>
                  <option value="F">FIFO (First In, First Out)</option>
                </select>
                <div v-if="errors.prioridad" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.prioridad }}
                </div>
                <div id="prioridad_help" class="form-text">
                  Método para gestionar el uso de inventario
                </div>
              </div>

              <!-- Separador visual -->
              <hr class="my-4">

              <!-- Botones de acción con espaciado (H3: Control y libertad) -->
              <div class="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  @click="goBack"
                  class="btn btn-outline-secondary"
                  :disabled="submitting"
                  aria-label="Cancelar y volver a la lista"
                >
                  <Icon icon="mdi:close" width="20" class="me-1"></Icon>
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting || !isFormValid"
                  aria-label="Guardar materia prima"
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
  name: 'MateriaPrimaForm',
  data() {
    return {
      isEditMode: false,
      loadingData: false,
      loadingUnidades: false,
      submitting: false,
      unidadesMedida: [],
      materiaPrima: {},
      formData: {
        unidad_medida: '',
        descripcion: '',
        costo: 0,
        cantidad: 0,
        prioridad: ''
      },
      errors: {}
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.unidad_medida &&
        this.formData.descripcion.trim() &&
        this.formData.costo > 0 &&
        this.formData.cantidad >= 0 &&
        this.formData.prioridad
      );
    }
  },
  async mounted() {
    await this.loadUnidadesMedida();

    const codigo = this.$route.params.id;
    if (codigo) {
      this.isEditMode = true;
      await this.loadMateriaPrima(codigo);
    }
  },
  methods: {
    async loadUnidadesMedida() {
      this.loadingUnidades = true;
      try {
        const token = obtainToken();
        const { data } = await api.get('/unidadmedida', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.unidadesMedida = data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar unidades de medida';
        toast.error(errorMsg);
      } finally {
        this.loadingUnidades = false;
      }
    },

    async loadMateriaPrima(codigo) {
      this.loadingData = true;
      try {
        const token = obtainToken();
        const { data } = await api.get(`/materiaprima/${codigo}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.materiaPrima = data;
        this.formData = {
          unidad_medida: data.um_compra.trim(),
          descripcion: data.mp_descripcion.trim(),
          costo: parseFloat(data.mp_precio_compra),
          cantidad: data.mp_cantidad,
          prioridad: data.mp_prioridad
        };
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar la materia prima';
        toast.error(errorMsg);
        this.goBack();
      } finally {
        this.loadingData = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.unidad_medida) {
        this.errors.unidad_medida = 'La unidad de medida es requerida';
      }

      if (!this.formData.descripcion.trim()) {
        this.errors.descripcion = 'La descripción es requerida';
      } else if (this.formData.descripcion.trim().length < 3) {
        this.errors.descripcion = 'La descripción debe tener al menos 3 caracteres';
      }

      if (!this.formData.costo || this.formData.costo <= 0) {
        this.errors.costo = 'El costo debe ser mayor a 0';
      }

      if (this.formData.cantidad < 0) {
        this.errors.cantidad = 'La cantidad no puede ser negativa';
      }

      if (!this.formData.prioridad) {
        this.errors.prioridad = 'La prioridad es requerida';
      }

      return Object.keys(this.errors).length === 0;
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
          // Actualizar
          const updateData = {
            um_compra: this.formData.unidad_medida,
            mp_descripcion: this.formData.descripcion,
            mp_precio_compra: this.formData.costo,
            mp_cantidad: this.formData.cantidad,
            mp_prioridad: this.formData.prioridad
          };

          await api.put(
            `/materiaprima/${this.materiaPrima.mp_codigo}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          toast.success('Materia prima actualizada correctamente');
        } else {
          // Crear
          const createData = {
            unidad_medida: this.formData.unidad_medida,
            descripcion: this.formData.descripcion,
            costo: this.formData.costo,
            cantidad: this.formData.cantidad,
            prioridad: this.formData.prioridad
          };

          await api.post('/materiaprima', createData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          toast.success('Materia prima creada correctamente');
        }

        // Regresar a la lista
        this.$router.push('/admin/materia-prima');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al guardar la materia prima';
        
        // Manejar errores de validación del backend
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

    goBack() {
      this.$router.push('/admin/materia-prima');
    }
  }
};
</script>

<style src="../../../assets/css/form.css"/>

<style src="../../../assets/css/admin/crud-form.css"></style>