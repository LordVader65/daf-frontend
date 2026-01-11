<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button @click="goBack" class="btn-back" aria-label="Regresar">
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header">
      <h2>{{ isEditMode ? 'Editar Materia Prima' : 'Nueva Materia Prima' }}</h2>
    </div>

    <div v-if="loadingData" class="loading-container">
      <Icon icon="mdi:loading" width="48" class="spinner"></Icon>
      <p>Cargando datos...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="materia-prima-form">
      <div class="form-group">
        <label for="unidad_medida" class="form-label">
          Unidad de Medida <span class="required">*</span>
        </label>
        <select
          id="unidad_medida"
          v-model="formData.unidad_medida"
          class="form-control"
          :class="{ 'is-invalid': errors.unidad_medida }"
          style="max-width: 300px;"
          required
          :disabled="loadingUnidades"
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
        <span v-if="errors.unidad_medida" class="error-message">
          {{ errors.unidad_medida }}
        </span>
      </div>

      <!-- Descripción -->
      <div class="form-group">
        <label for="descripcion" class="form-label">
          Descripción <span class="required">*</span>
        </label>
        <input
          type="text"
          id="descripcion"
          v-model="formData.descripcion"
          style="width: 500px;"
          class="form-control"
          :class="{ 'is-invalid': errors.descripcion }"
          placeholder="Ingrese la descripción"
          maxlength="60"
          required
        />
        <span v-if="errors.descripcion" class="error-message">
          {{ errors.descripcion }}
        </span>
        <small class="form-text">{{ formData.descripcion.length }}/60 caracteres</small>
      </div>

      <!-- Precio de Compra -->
      <div class="form-group">
        <label for="costo" class="form-label">
          Precio de Compra <span class="required">*</span>
        </label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input
            type="number"
            id="costo"
            style="max-width: 200px;"
            v-model.number="formData.costo"
            class="form-control"
            :class="{ 'is-invalid': errors.costo }"
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required/>
        </div>
        <span v-if="errors.costo" class="error-message">
          {{ errors.costo }}
        </span>
      </div>

      <!-- Cantidad -->
      <div class="form-group">
        <label for="cantidad" class="form-label">
          Cantidad <span class="required">*</span>
        </label>
        <input
          type="number"
          id="cantidad"
          style="max-width: 200px;"
          v-model.number="formData.cantidad"
          class="form-control"
          :class="{ 'is-invalid': errors.cantidad }"
          placeholder="0"
          min="0"
          step="1"
          required
        />
        <span v-if="errors.cantidad" class="error-message">
          {{ errors.cantidad }}
        </span>
      </div>

      <!-- Prioridad -->
      <div class="form-group">
        <label for="prioridad" class="form-label">
          Prioridad <span class="required">*</span>
        </label>
        <select
          id="prioridad"
          v-model="formData.prioridad"
          class="form-control"
          :class="{ 'is-invalid': errors.prioridad }"
          style="max-width: 300px;"
          required
        >
          <option value="">Seleccione una prioridad</option>
          <option value="L">LIFO (Last In, First Out)</option>
          <option value="F">FIFO (First In, First Out)</option>
        </select>
        <span v-if="errors.prioridad" class="error-message">
          {{ errors.prioridad }}
        </span>
      </div>

      <!-- Botones de acción -->
      <div class="form-actions">
        <button
          type="button"
          @click="goBack"
          class="btn btn-secondary"
          :disabled="submitting"
        >
          <Icon icon="mdi:close" width="20"></Icon>
          Cancelar
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting || !isFormValid"
        >
          <icon
            v-if="submitting"
            icon="mdi:loading"
            width="20"
            class="spinner"
          ></Icon>
          <Icon v-else icon="mdi:content-save" width="20"></Icon>
          {{ submitting ? 'Guardando...' : 'Guardar' }}
        </button>
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