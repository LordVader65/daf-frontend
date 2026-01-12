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
      <h2>{{ isEditMode ? 'Editar Kardex' : 'Nuevo registro de Kardex' }}</h2>
    </div>

    <div v-if="loadingData" class="loading-container">
      <Icon icon="mdi:loading" width="48" class="spinner"></Icon>
      <p>Cargando datos...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="materia-prima-form">
      <div class="form-group">
        <label for="materia_prima" class="form-label">
          Materia Prima <span class="required">*</span>
        </label>
        <select
          id="materia_prima"
          v-model="formData.materiaPrima"
          class="form-control"
          :class="{ 'is-invalid': errors.materiaPrima }"
          style="max-width: 300px;"
          required
          :disabled="loadingMateriasPrimas || isEditMode"
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
        <span v-if="errors.materiaPrima" class="error-message">
          {{ errors.materiaPrima }}
        </span>
      </div>

      <div class="form-group">
        <label for="transaccion" class="form-label">
          Transacción <span class="required">*</span>
        </label>
        <select
          id="transaccion"
          v-model="formData.transaccion"
          class="form-control"
          :class="{ 'is-invalid': errors.transaccion }"
          style="max-width: 300px;"
          required
          :disabled="loadingTransaccion || isEditMode"
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
        <span v-if="errors.transaccion" class="error-message">
          {{ errors.transaccion }}
        </span>
      </div>

      <!-- Razón -->
      <div class="form-group">
        <label for="razon" class="form-label">
          Razón
        </label>
        <input
          type="text"
          id="razon"
          v-model="formData.razon"
          style="width: 500px;"
          class="form-control"
          :class="{ 'is-invalid': errors.razon }"
          placeholder="Ingrese la razón"
          maxlength="60"
        />
        <span v-if="errors.razon" class="error-message">
          {{ errors.razon }}
        </span>
        <small class="form-text">{{ formData.razon.length }}/60 caracteres</small>
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
      submitting: false,
      unidadesMedida: [],
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
          materiaPrima: data.mp_codigo.trim(),
          transaccion: data.trn_cod.trim(),
          razon: (data.krd_razon)? data.krd_razon.trim() : "",
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
            krd_razon: this.formData.razon,
            krd_cantidad: this.formData.cantidad
          };

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