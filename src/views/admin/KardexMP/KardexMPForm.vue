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
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>{{ isEditMode ? 'Editar Kardex' : 'Nuevo registro de Kardex' }}</h2>
      <p class="text-muted">
        {{ isEditMode ? 'Modifique los campos necesarios' : 'Registre un movimiento de inventario' }}
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

              <!-- Materia Prima -->
              <div class="mb-4">
                <label for="materia_prima" class="form-label fw-semibold">
                  Materia Prima <span class="text-danger">*</span>
                </label>
                <select
                  id="materia_prima"
                  v-model="formData.materiaPrima"
                  class="form-select"
                  :class="{ 'is-invalid': errors.materiaPrima }"
                  required
                  :disabled="loadingMateriasPrimas || isEditMode"
                  aria-describedby="materia_prima_help"
                >
                  <option value="">Seleccione una materia prima</option>
                  <option
                    v-for="mp in materiaPrima"
                    :key="mp.mp_codigo"
                    :value="mp.mp_codigo.trim()"
                  >
                    {{ mp.mp_descripcion.trim() }}
                  </option>
                </select>
                <div v-if="errors.materiaPrima" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.materiaPrima }}
                </div>
                <div id="materia_prima_help" class="form-text">
                  {{ isEditMode ? 'No se puede cambiar en modo edición' : 'Seleccione el material a registrar' }}
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
                  :disabled="loadingTransaccion || isEditMode"
                  aria-describedby="transaccion_help"
                >
                  <option value="">Seleccione una transacción</option>
                  <option
                    v-for="trn in transaccion"
                    :key="trn.trn_cod"
                    :value="trn.trn_cod.trim()"
                  >
                    {{ trn.trn_descripcion.trim() }}
                  </option>
                </select>
                <div v-if="errors.transaccion" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.transaccion }}
                </div>
                <div id="transaccion_help" class="form-text">
                  {{ isEditMode ? 'No se puede cambiar en modo edición' : 'Tipo de movimiento (entrada/salida)' }}
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
                  placeholder="Ej: Compra de proveedor, Ajuste de inventario..."
                  maxlength="60"
                  aria-describedby="razon_help"
                />
                <div v-if="errors.razon" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.razon }}
                </div>
                <div id="razon_help" class="form-text d-flex justify-content-between">
                  <span>Motivo del movimiento (opcional)</span>
                  <span :class="{ 'text-warning': formData.razon.length > 50, 'text-danger': formData.razon.length >= 60 }">
                    {{ formData.razon.length }}/60
                  </span>
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
                  aria-describedby="cantidad_help"
                />
                <div v-if="errors.cantidad" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.cantidad }}
                </div>
                <div id="cantidad_help" class="form-text">
                  Cantidad a registrar en el movimiento
                </div>
              </div>

              <hr class="my-4">

              <!-- Botones de acción -->
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
                  aria-label="Guardar registro de kardex"
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
import { routeLocationKey } from "vue-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos'
});

export default {
  name: 'KardexForm',
  data() {
    return {
      isEditMode: false,
      loadingData: false,
      loadingMateriasPrimas: false,
      loadingTransaccion: false,
      submitting: false,
      unidadesMedida: [],
      materiaPrima: [],
      transaccion: [],
      kardex: {},
      formData: {
        materiaPrima: '',
        transaccion: '',
        razon: '',
        cantidad: 0
      },
      errors: {}
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.materiaPrima &&
        this.formData.transaccion &&
        this.formData.cantidad > 0
      );
    }
  },
  async mounted() {
    await this.loadMateriasPrimas();
    await this.loadTransacciones();

    const codigo = this.$route.params.id;
    if (codigo) {
      this.isEditMode = true;
      
      await this.loadKardex(codigo);
    }
  },
  methods: {
    async loadMateriasPrimas() {
      this.loadingMateriasPrimas = true;
      try {
        const token = obtainToken();
        const { data } = await api.get('/materiaprima/type', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.materiaPrima = data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar las materias primas';
        toast.error(errorMsg);
      } finally {
        this.loadingMateriasPrimas = false;
      }
    },
    async loadTransacciones() {
      this.loadingTransaccion = true;
      try {
        const token = obtainToken();
        const { data } = await api.get('/transaccion', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.transaccion = data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar las transacciones';
        toast.error(errorMsg);
      } finally {
        this.loadingTransaccion = false;
      }
    },

    async loadKardex(codigo) {
      this.loadingData = true;
      console.log("Loading Kardex");
      try {
        const token = obtainToken();
        const { data } = await api.get(`/kardexmp/${codigo}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(data);

        this.kardex = data;
        this.formData = {
          materiaPrima: data.mp_codigo ? data.mp_codigo.trim() : '',
          transaccion: data.trn_cod ? data.trn_cod.trim() : '',
          razon: data.krd_razon ? data.krd_razon.trim() : '',
          cantidad: data.krd_cantidad
        };
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar el kardex';
        console.log(err);
        toast.error(errorMsg);
      } finally {
        this.loadingData = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.materiaPrima) {
        this.errors.materiaPrima = 'La unidad de medida es requerida';
      }

      if (!this.formData.transaccion) {
        this.errors.transaccion = 'Se debe de especificar una transacción';
      }

      if (this.formData.cantidad <= 0) {
        this.errors.cantidad = 'La cantidad no puede ser negativa ni 0';
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
            krd_razon: this.formData.razon,
            krd_cantidad: this.formData.cantidad,
          };

          await api.put(
            `/kardexmp/${this.kardex.krd_codigo}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          toast.success('Kardex actualizado correctamente');
        } else {
          // Crear
          const createData = {
            mp_codigo: this.formData.materiaPrima.trim(),
            trn_cod: this.formData.transaccion.trim(),
            krd_razon: this.formData.razon ? this.formData.razon.trim() : null,
            krd_cantidad: this.formData.cantidad
          };

          if (!createData.mp_codigo || !createData.trn_cod) {
            toast.error('Debe seleccionar una materia prima y una transacción');
            this.submitting = false;
            return;
          }

          console.log(createData);
          await api.post('/kardexmp', createData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          toast.success('Registro de Kardex creado correctamente');
        }

        // Regresar a la lista
        this.$router.push('/admin/kardex/materia-prima');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al guardar el kardex';
        
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
      this.$router.push('/admin/kardex/materia-prima');
    }
  }
};
</script>

<style src="../../../assets/css/form.css"/>

<style src="../../../assets/css/admin/crud-form.css"></style>