<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from "@iconify/vue"
import { toast } from '@/utils/toast'
import { ProveedorService } from '@/api/proveedor.service'
import { CiudadService } from '@/api/ciudad.service'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const loadingData = ref(false)

const form = ref({
  prv_razonsocial: '',
  prv_ruc: '',
  prv_telefono: '',
  prv_celular: '',
  prv_mail: '',
  prv_direccion: '',
  ct_codigo: ''
})

const errors = ref({})

// ===============================
// CIUDADES
// ===============================
const ciudades = ref([])

const loadCiudades = async () => {
  try {
    const { data } = await CiudadService.getAll()
    ciudades.value = data
  } catch (error) {
    console.error('Error loading cities:', error)
    toast.error('Error al cargar ciudades')
  }
}

// ===============================
// VALIDACIONES
// ===============================
const validateForm = () => {
  let valid = true
  errors.value = {}

  if (!form.value.prv_razonsocial?.trim()) {
    errors.value.prv_razonsocial = 'La razón social es obligatoria'
    valid = false
  }

  if (!form.value.prv_ruc) {
    errors.value.prv_ruc = 'El RUC es obligatorio'
    valid = false
  } else if (!/^\d{13}$/.test(form.value.prv_ruc)) {
    errors.value.prv_ruc = 'El RUC debe tener 13 dígitos numéricos'
    valid = false
  }

  // ciudad: si estás guardando ct_codigo como número
  if (!form.value.ct_codigo) {
    errors.value.ct_codigo = 'Debe seleccionar una ciudad'
    valid = false
  }

  if (form.value.prv_mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.prv_mail)) {
    errors.value.prv_mail = 'Formato de correo electrónico no válido'
    valid = false
  }

  if (form.value.prv_celular && !/^\d+$/.test(form.value.prv_celular)) {
    errors.value.prv_celular = 'El celular solo debe contener números'
    valid = false
  }

  if (form.value.prv_telefono && !/^\d+$/.test(form.value.prv_telefono)) {
    errors.value.prv_telefono = 'El teléfono solo debe contener números'
    valid = false
  }

  if (!valid) {
    toast.warning('Por favor, corrija los errores en el formulario')
  }

  return valid
}

// ===============================
// SUBMIT
// ===============================
const submit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    if (isEdit.value) {
  // ✅ UPDATE CORRECTO
  const payload = {
    ...form.value,
    ct_codigo: form.value.ct_codigo // ← SIN Number()
  }
      console.log('PAYLOAD A ENVIAR:', payload);
      console.log('payload.ct_codigo:', payload.ct_codigo, typeof payload.ct_codigo);

      await ProveedorService.update(route.params.id, payload)
      toast.success('Proveedor actualizado correctamente') 

    } else {
      // 🟢 CREATE (sí enviar prv_fecha_alta)
      const payload = {
        ...form.value, 
        prv_estado: 'ACT',
        prv_fecha_alta: new Date()
      }

      await ProveedorService.create(payload)
      toast.success('Proveedor creado correctamente')
    }

    router.push('/admin/proveedor')

  } catch (error) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.response?.data?.errors) {
      toast.error(JSON.stringify(error.response.data.errors))
    } else {
      toast.error('Ocurrió un error al guardar')
    }
  } finally {
    loading.value = false
  }
}


// ===============================
// ACCIONES
// ===============================
const goBack = () => {
  router.push('/admin/proveedor')
}

const cancel = () => {
  router.push('/admin/proveedor')
}

onMounted(async () => {
  console.log('ProveedorForm onMounted EXECUTED');
 

  loadingData.value = true
  try {
    await loadCiudades();

    if (isEdit.value) {
      const response = await ProveedorService.getById(route.params.id);
      const data = response.data;
      console.log('EDIT ct_codigo RAW:', data.ct_codigo, typeof data.ct_codigo)  
      form.value = {
        prv_razonsocial: data.prv_razonsocial ?? '',
        prv_ruc: data.prv_ruc ?? '',
        prv_telefono: data.prv_telefono ?? '',
        prv_celular: data.prv_celular ?? '',
        prv_mail: data.prv_mail?.trim() ?? '',
        prv_direccion: data.prv_direccion ?? '',
        ct_codigo: data.ct_codigo ? String(data.ct_codigo).trim() : ''



      };
    }
  } catch (error) {
    console.error('ERROR CARGANDO DATOS:', error);
    toast.error('No se pudo cargar la información necesaria');
    router.push('/admin/proveedor');
  } finally {
    loadingData.value = false
  }
});
</script>

<template>
  <div class="form-container">
    <!-- Top Bar con botón Regresar -->
    <div class="top-bar">
      <button 
        @click="goBack" 
        class="btn-back" 
        aria-label="Regresar a la lista de proveedores"
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>{{ isEdit ? 'Editar Proveedor' : 'Crear Proveedor' }}</h2>
      <p class="text-muted">
        {{ isEdit ? 'Modifique los datos del proveedor' : 'Complete la información para registrar un nuevo proveedor' }}
      </p>
    </div>

    <div v-if="loadingData" class="loading-container d-flex flex-column align-items-center py-5">
      <Icon icon="mdi:loading" width="48" class="spinner text-primary"></Icon>
      <p class="mt-3 text-muted">Cargando datos...</p>
    </div>

    <form v-else @submit.prevent="submit" class="proveedor-form" novalidate>
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              
              <p class="text-muted small mb-4">
                <span class="text-danger">*</span> Campos obligatorios
              </p>

              <!-- Razón Social -->
              <div class="mb-3">
                <label class="form-label fw-semibold">
                  Razón Social <span class="text-danger">*</span>
                </label>
                <input 
                  v-model="form.prv_razonsocial" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.prv_razonsocial }"
                  placeholder="Ingrese el nombre o razón social"
                  required 
                />
                <div v-if="errors.prv_razonsocial" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.prv_razonsocial }}
                </div>
              </div>

              <!-- RUC y Ciudad en grid -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">
                    RUC <span class="text-danger">*</span>
                  </label>
                  <input 
                    v-model="form.prv_ruc" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.prv_ruc }"
                    placeholder="13 dígitos"
                    maxlength="13"
                    required 
                  />
                  <div v-if="errors.prv_ruc" class="invalid-feedback d-block">
                    <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                    {{ errors.prv_ruc }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">
                    Ciudad <span class="text-danger">*</span>
                  </label>
                  
                  <select v-model="form.ct_codigo">
                    <option disabled value="">Seleccione una ciudad</option>

                    <option
                      v-for="c in ciudades"
                      :key="c.ct_codigo"
                      :value="c.ct_codigo"
                    >
                      {{ c.ct_descripcion }}
                    </option>
                  </select> 
                  

                  <div v-if="errors.ct_codigo" class="invalid-feedback d-block">
                     <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                    {{ errors.ct_codigo }}
                  </div>
                </div>
              </div>

              <!-- Contacto -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Teléfono</label>
                  <input 
                    v-model="form.prv_telefono" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.prv_telefono }"
                    placeholder="Ej: 022..."
                  />
                  <div v-if="errors.prv_telefono" class="invalid-feedback d-block">
                    {{ errors.prv_telefono }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Celular</label>
                  <input 
                    v-model="form.prv_celular" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.prv_celular }"
                    placeholder="Ej: 099..."
                  />
                  <div v-if="errors.prv_celular" class="invalid-feedback d-block">
                    {{ errors.prv_celular }}
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label class="form-label fw-semibold">Correo electrónico</label>
                <div class="input-group">
                  <span class="input-group-text">
                     <Icon icon="mdi:email" width="18"></Icon>
                  </span>
                  <input 
                    type="email" 
                    v-model="form.prv_mail" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.prv_mail }"
                    placeholder="ejemplo@correo.com" 
                  />
                </div>
                <div v-if="errors.prv_mail" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.prv_mail }}
                </div>
              </div>

              <!-- Dirección -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Dirección</label>
                <textarea 
                  v-model="form.prv_direccion" 
                  class="form-control" 
                  rows="2"
                  placeholder="Dirección completa"
                ></textarea>
              </div>

              <hr class="my-4">

              <!-- Acciones -->
              <div class="d-flex justify-content-end gap-3">
                <button 
                  class="btn btn-outline-secondary" 
                  type="button" 
                  @click="cancel"
                  :disabled="loading"
                >
                  <Icon icon="mdi:close" width="20" class="me-1"></Icon>
                  Cancelar
                </button>

                <button 
                  class="btn btn-primary" 
                  type="submit" 
                  :disabled="loading"
                >
                  <Icon
                    v-if="loading"
                    icon="mdi:loading"
                    width="20"
                    class="spinner me-1"
                  ></Icon>
                  <Icon v-else icon="mdi:content-save" width="20" class="me-1"></Icon>
                  {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style src="../../../assets/css/form.css"/>
<style src="../../../assets/css/admin/crud-form.css"></style>
