<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button 
        @click="goBack" 
        class="btn-back" 
        aria-label="Regresar a la lista de clientes"
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>{{ isEditMode ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
      <p class="text-muted">
        {{ isEditMode ? 'Modifique los campos necesarios' : 'Complete todos los campos requeridos' }}
      </p>
    </div>

    <div v-if="loadingData" class="loading-container d-flex flex-column align-items-center py-5">
      <Icon icon="mdi:loading" width="48" class="spinner text-primary"></Icon>
      <p class="mt-3 text-muted">Cargando datos...</p>
    </div>
    <form v-else @submit.prevent="handleSubmit" class="cliente-form" novalidate>
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              
              <p class="text-muted small mb-4">
                <span class="text-danger">*</span> Campos obligatorios
              </p>
              <!-- Identificación -->
              <div class="mb-4">
                <label for="identificacion" class="form-label fw-semibold">
                  Número de Identificación <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="identificacion"
                  v-model="formData.identificacion"
                  class="form-control"
                  :class="{ 'is-invalid': errors.identificacion }"
                  placeholder="Ej: 1712345678"
                  maxlength="13"
                  required
                />
                <div v-if="errors.identificacion" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.identificacion }}
                </div>
              </div>

              <!-- Nombre -->
              <div class="mb-4">
                <label for="nombre" class="form-label fw-semibold">
                  Nombre Completo / Razón Social <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  v-model="formData.nombre"
                  class="form-control"
                  :class="{ 'is-invalid': errors.nombre }"
                  placeholder="Ej: Juan Pérez"
                  maxlength="100"
                  required
                />
                <div v-if="errors.nombre" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.nombre }}
                </div>
              </div>

              <!-- Teléfono -->
              <div class="mb-4">
                <label for="telefono" class="form-label fw-semibold">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  v-model="formData.telefono"
                  class="form-control"
                  :class="{ 'is-invalid': errors.telefono }"
                  placeholder="Ej: 0991234567"
                  maxlength="10"
                />
                <div v-if="errors.telefono" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.telefono }}
                </div>
              </div>

              <!-- Celular -->
              <div class="mb-4">
                <label for="celular" class="form-label fw-semibold">
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  v-model="formData.celular"
                  class="form-control"
                  :class="{ 'is-invalid': errors.celular }"
                  placeholder="Ej: 099123456"
                  maxlength="9"
                />
                <div v-if="errors.celular" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.celular }}
                </div>
              </div>

              <!-- Email -->
              <div class="mb-4">
                <label for="email" class="form-label fw-semibold">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="ejemplo@correo.com"
                  maxlength="100"
                />
                <div v-if="errors.email" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.email }}
                </div>
              </div>

               <!-- Ciudad -->
              <div class="mb-4">
                <label for="ciudad" class="form-label fw-semibold">
                  Ciudad <span class="text-danger">*</span>
                </label>
                <select
                  id="ciudad"
                  v-model="formData.ciudad"
                  class="form-select"
                  :class="{ 'is-invalid': errors.ciudad }"
                  required
                  :disabled="loadingCiudades"
                >
                  <option value="">Seleccione una ciudad</option>
                  <option
                    v-for="ciudad in ciudades"
                    :key="ciudad.ct_codigo"
                    :value="ciudad.ct_codigo"
                  >
                    {{ ciudad.ct_descripcion }}
                  </option>
                </select>
                <div v-if="errors.ciudad" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.ciudad }}
                </div>
              </div>

              <!-- Dirección -->
              <div class="mb-4">
                <label for="direccion" class="form-label fw-semibold">
                  Dirección
                </label>
                <textarea
                  id="direccion"
                  v-model="formData.direccion"
                  class="form-control"
                  :class="{ 'is-invalid': errors.direccion }"
                  placeholder="Dirección completa"
                  rows="3"
                  maxlength="200"
                ></textarea>
                <div v-if="errors.direccion" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.direccion }}
                </div>
              </div>

              <!-- Separador visual -->
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
                  aria-label="Guardar cliente"
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
import { CiudadService } from '../../../api/ciudad.service.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos'
});

export default {
  name: 'ClienteForm',
  data() {
    return {
      isEditMode: false,
      loadingData: false,
      loadingCiudades: false,
      submitting: false,
      cliente: {},
      ciudades: [],
      formData: {
        identificacion: '',
        nombre: '',
        telefono: '',
        celular: '',
        email: '',
        direccion: '',
        ciudad: '' // ct_codigo
      },
      errors: {}
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.identificacion.trim() &&
        this.formData.nombre.trim() &&
        this.formData.ciudad
      );
    }
  },
  async mounted() {
    await this.loadCiudades();
    
    const id = this.$route.params.id;
    if (id) {
      this.isEditMode = true;
      await this.loadCliente(id);
    }
  },
  methods: {
    async loadCiudades() {
      this.loadingCiudades = true;
      try {
        const { data } = await CiudadService.getAll();
        // Ajustar si la respuesta viene directa o envuelta
        this.ciudades = Array.isArray(data) ? data : (data.data || []);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
        toast.error('Error al cargar las ciudades');
      } finally {
        this.loadingCiudades = false;
      }
    },

    async loadCliente(id) {
      this.loadingData = true;
      try {
        const token = obtainToken();
        const { data } = await api.get(`/cliente/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.cliente = data;
        // Asumiendo que el backend devuelve cli_ruc_ced, cli_nombre, etc.
        this.formData = {
          identificacion: data.cli_ruc_ced.trim(),
          nombre: data.cli_nombre.trim(),
          telefono: data.cli_telefono.trim(),
          celular: data.cli_celular.trim(),
          email: data.cli_mail.trim(),
          direccion: data.cli_direccion.trim() || '',
          ciudad: data.ct_codigo
        };
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar el cliente';
        toast.error(errorMsg);
        this.goBack();
      } finally {
        this.loadingData = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.identificacion.trim()) {
        this.errors.identificacion = 'El número de identificación (RUC/CED) es requerido';
      } else if (!/^\d+$/.test(this.formData.identificacion)) {
        this.errors.identificacion = 'El identificador debe tener dígitos numéricos';
      }

      if (!this.formData.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido';
      }
      
      if (!this.formData.telefono.trim()) {
        this.errors.telefono = 'El teléfono es requerido';
      } else if (this.formData.telefono.length !== 10 || !/^\d+$/.test(this.formData.telefono)) {
        this.errors.telefono = 'El teléfono debe tener 10 dígitos numéricos';
      }

      if (!this.formData.celular.trim()) {
        this.errors.celular = 'El celular es requerido';
      } else if (this.formData.celular.length !== 9 || !/^\d+$/.test(this.formData.celular)) {
        this.errors.celular = 'El teléfono debe tener 10 dígitos numéricos';
      }

      if (!this.formData.email.trim()) {
        this.errors.email = 'El email es requerido';
      } else if (!this.formData.email.includes('@')) {
        this.errors.email = 'El formato del correo electrónico no es válido';
      }
      
      if (!this.formData.ciudad) {
        this.errors.ciudad = 'La ciudad es requerida';
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
      
        const clientData = {
            cli_ruc_ced: this.formData.identificacion,
            cli_nombre: this.formData.nombre,
            cli_telefono: this.formData.telefono,
            cli_celular: this.formData.celular,
            cli_mail: this.formData.email,
            cli_direccion: this.formData.direccion,
            ct_codigo: this.formData.ciudad
        };

        if (this.isEditMode) {
          // Actualizar
          await api.put(
            `/cliente/${this.cliente.cli_codigo}`, // Asumimos cli_codigo
            clientData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          toast.success('Cliente actualizado correctamente');
        } else {
          // Crear
          await api.post('/cliente', clientData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          toast.success('Cliente creado correctamente');
        }

        // Regresar a la lista
        this.$router.push('/admin/cliente');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al guardar el cliente';
        
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
      this.$router.push('/admin/cliente');
    }
  }
};
</script>

<style src="../../../assets/css/form.css"/>

<style src="../../../assets/css/admin/crud-form.css"></style>
