<template>
  <AccessibilityMenu/>
    <main class="main-content form-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>
          <p class="subtitle">
            {{ isLogin ? 'Ingresa tus credenciales para continuar' : 'Completa el formulario para registrarte' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">
              <Icon icon="mdi:email" class="label-icon" />
              Correo Electrónico
              <span class="required" aria-label="requerido">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-control"
              placeholder="ejemplo@correo.com"
              required
              autocomplete="email"
              :aria-invalid="errors.email ? 'true' : 'false'"
              :aria-describedby="errors.email ? 'email-error' : null"
            />
            <span v-if="errors.email" id="email-error" class="error-message" role="alert">
              {{ errors.email }}
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">
              <Icon icon="mdi:lock" class="label-icon" />
              Contraseña
              <span class="required" aria-label="requerido">*</span>
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Ingresa tu contraseña"
                required
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                :aria-invalid="errors.password ? 'true' : 'false'"
                :aria-describedby="errors.password ? 'password-error' : null"
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
            <span v-if="errors.password" id="password-error" class="error-message" role="alert">
              {{ errors.password }}
            </span>
          </div>

          <!-- Registro: RUC/Cédula -->
          <div v-if="!isLogin" class="form-group">
            <label for="ruc" class="form-label">
              <Icon icon="mdi:card-account-details" class="label-icon" />
              RUC o Cédula
              <span class="required" aria-label="requerido">*</span>
            </label>
            <div class="input-with-button">
              <input
                id="ruc"
                v-model="formData.cli_ruc_ced"
                type="text"
                class="form-control"
                placeholder="0999999999"
                required
                maxlength="13"
                :aria-invalid="errors.cli_ruc_ced ? 'true' : 'false'"
                :aria-describedby="errors.cli_ruc_ced ? 'ruc-error' : null"
              />
              <button
                type="button"
                class="btn-search"
                @click="buscarCliente"
                :disabled="loading || !formData.cli_ruc_ced"
                :aria-label="'Buscar cliente por ' + (formData.cli_ruc_ced || 'RUC o cédula')"
              >
                <Icon icon="mdi:magnify" />
                Buscar
              </button>
            </div>
            <span v-if="errors.cli_ruc_ced" id="ruc-error" class="error-message" role="alert">
              {{ errors.cli_ruc_ced }}
            </span>
          </div>

          <!-- Datos de Cliente (solo si no existe) -->
          <div v-if="!isLogin && mostrarDatosCliente" class="client-data-section">
            <h3 class="section-title">
              <Icon icon="mdi:account-plus" />
              Datos del Cliente
            </h3>

            <div class="form-group">
              <label for="cli_nombre" class="form-label">
                <Icon icon="mdi:account" class="label-icon" />
                Razón Social
                <span class="required" aria-label="requerido">*</span>
              </label>
              <input
                id="cli_nombre"
                v-model="formData.cliente.cli_nombre"
                type="text"
                class="form-control"
                placeholder="Razón Social"
                required
                :aria-invalid="errors.cli_nombre ? 'true' : 'false'"
              />
              <span v-if="errors.cli_nombre" class="error-message" role="alert">
                {{ errors.cli_nombre }}
              </span>
            </div>

            <div class="form-group">
              <label for="cli_ruc_ced_readonly" class="form-label">
                <Icon icon="mdi:card-account-details" class="label-icon" />
                RUC/Cédula
                <span class="required" aria-label="requerido">*</span>
              </label>
              <input
                id="cli_ruc_ced_readonly"
                :value="formData.cli_ruc_ced"
                type="text"
                class="form-control"
                readonly
                disabled
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cli_telefono" class="form-label">
                  <Icon icon="mdi:phone" class="label-icon" />
                  Teléfono
                  <span class="required" aria-label="requerido">*</span>
                </label>
                <input
                  id="cli_telefono"
                  v-model="formData.cliente.cli_telefono"
                  type="tel"
                  class="form-control"
                  placeholder="0999999999"
                  maxlength="10"
                  @input="validarTelefono"
                  required
                  :aria-invalid="errors.cli_telefono ? 'true' : 'false'"
                />
                <span v-if="errors.cli_telefono" class="error-message" role="alert">
                  {{ errors.cli_telefono }}
                </span>
              </div>

              <div class="form-group">
                <label for="cli_celular" class="form-label">
                  <Icon icon="mdi:cellphone" class="label-icon" />
                  Celular
                  <span class="required" aria-label="requerido">*</span>
                </label>
                <input
                  id="cli_celular"
                  v-model="formData.cliente.cli_celular"
                  type="tel"
                  class="form-control"
                  placeholder="099999999"
                  maxlength="9"
                  @input="validarCelular"
                  required
                  :aria-invalid="errors.cli_celular ? 'true' : 'false'"
                />
                <span v-if="errors.cli_celular" class="error-message" role="alert">
                  {{ errors.cli_celular }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="ct_codigo" class="form-label">
                <Icon icon="mdi:city" class="label-icon" />
                Ciudad
                <span class="required" aria-label="requerido">*</span>
              </label>
              <select
                id="ct_codigo"
                v-model="formData.cliente.ct_codigo"
                class="form-control"
                required
                :aria-invalid="errors.ct_codigo ? 'true' : 'false'"
              >
                <option value="" disabled>Selecciona una ciudad</option>
                <option
                  v-for="ciudad in ciudades"
                  :key="ciudad.ct_codigo"
                  :value="ciudad.ct_codigo.trim()"
                >
                  {{ ciudad.ct_descripcion.trim() }}
                </option>
              </select>
              <span v-if="errors.ct_codigo" class="error-message" role="alert">
                {{ errors.ct_codigo }}
              </span>
            </div>

            <div class="form-group">
              <label for="cli_direccion" class="form-label">
                <Icon icon="mdi:map-marker" class="label-icon" />
                Dirección
                <span class="required" aria-label="requerido">*</span>
              </label>
              <textarea
                id="cli_direccion"
                v-model="formData.cliente.cli_direccion"
                class="form-control"
                placeholder="Av. Siempre Viva 123"
                rows="3"
                required
                :aria-invalid="errors.cli_direccion ? 'true' : 'false'"
              ></textarea>
              <span v-if="errors.cli_direccion" class="error-message" role="alert">
                {{ errors.cli_direccion }}
              </span>
            </div>
          </div>

          <!-- Botones -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
              :aria-busy="loading"
            >
              <Icon v-if="!loading" :icon="isLogin ? 'mdi:login' : 'mdi:account-plus'" />
              <Icon v-else icon="mdi:loading" class="spin" />
              {{ loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse') }}
            </button>
          </div>

          <div class="form-footer">
            <button
              type="button"
              class="btn-link"
              @click="toggleMode"
            >
              {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
            </button>
          </div>
        </form>
      </div>
    </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { Icon } from '@iconify/vue';
import { toast } from '@/utils/toast';
import AccessibilityMenu from '../components/AccessibilityMenu.vue'

const isLogin = ref(true);
const loading = ref(false);
const showPassword = ref(false);
const mostrarDatosCliente = ref(false);
const clienteExistente = ref(false);
const ciudades = ref([]);

const formData = reactive({
  email: '',
  password: '',
  cli_ruc_ced: '',
  cliente: {
    ct_codigo: '',
    cli_nombre: '',
    cli_telefono: '',
    cli_celular: '',
    cli_direccion: ''
  }
});

const errors = reactive({
  email: '',
  password: '',
  cli_ruc_ced: '',
  ct_codigo: '',
  cli_nombre: '',
  cli_telefono: '',
  cli_celular: '',
  cli_direccion: ''
});

onMounted(async () => {
  await cargarCiudades();
});

const cargarCiudades = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND}ecom/ciudad/`);
    ciudades.value = data;
  } catch (error) {
    console.error('Error al cargar ciudades:', error);
    toast.error('No se pudieron cargar las ciudades');
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  resetForm();
};

const resetForm = () => {
  formData.email = '';
  formData.password = '';
  formData.cli_ruc_ced = '';
  formData.cliente = {
    ct_codigo: '',
    cli_nombre: '',
    cli_telefono: '',
    cli_celular: '',
    cli_direccion: ''
  };
  mostrarDatosCliente.value = false;
  clienteExistente.value = false;
  clearErrors();
};

const clearErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
};

const validarTelefono = (event) => {
  const value = event.target.value;
  formData.cliente.cli_telefono = value.replace(/[^\d]/g, '');
  
  if (value && formData.cliente.cli_telefono.length !== 10) {
    errors.cli_telefono = 'El teléfono debe tener exactamente 10 dígitos';
  } else {
    errors.cli_telefono = '';
  }
};

const validarCelular = (event) => {
  const value = event.target.value;
  formData.cliente.cli_celular = value.replace(/[^\d]/g, '');
  
  if (value && formData.cliente.cli_celular.length !== 9) {
    errors.cli_celular = 'El celular debe tener exactamente 9 dígitos';
  } else {
    errors.cli_celular = '';
  }
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!formData.email) {
    errors.email = 'El correo electrónico es obligatorio';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Ingresa un correo electrónico válido';
    isValid = false;
  }

  if (!formData.password) {
    errors.password = 'La contraseña es obligatoria';
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }

  if (!isLogin.value) {
    if (!formData.cli_ruc_ced) {
      errors.cli_ruc_ced = 'El RUC o cédula es obligatorio';
      isValid = false;
    } else if (formData.cli_ruc_ced.length < 10) {
      errors.cli_ruc_ced = 'Ingresa un RUC o cédula válido';
      isValid = false;
    }

    if (mostrarDatosCliente.value) {
      if (!formData.cliente.ct_codigo) {
        errors.ct_codigo = 'La ciudad es obligatoria';
        isValid = false;
      }
      if (!formData.cliente.cli_nombre) {
        errors.cli_nombre = 'La razón social es obligatoria';
        isValid = false;
      }
      if (formData.cliente.cli_telefono && formData.cliente.cli_telefono.length !== 10) {
        errors.cli_telefono = 'El teléfono debe tener exactamente 10 dígitos';
        isValid = false;
      }
      if (formData.cliente.cli_celular && formData.cliente.cli_celular.length !== 9) {
        errors.cli_celular = 'El celular debe tener exactamente 9 dígitos';
        isValid = false;
      }
      if (!formData.cliente.cli_direccion) {
        errors.cli_direccion = 'La dirección es obligatoria';
        isValid = false;
      }
    }
  }

  return isValid;
};

const buscarCliente = async () => {
  if (!formData.cli_ruc_ced) {
    toast.warning('Ingresa un RUC o cédula para buscar');
    return;
  }

  loading.value = true;
  
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND}ecom/auth/client/${formData.cli_ruc_ced}`
    );
    
    if (data.message) {
      toast.info(data.message);
    }
    
    clienteExistente.value = true;
    mostrarDatosCliente.value = false;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Error al buscar cliente';
      
      toast.info(message);
      
      if (status === 404) {
        mostrarDatosCliente.value = true;
        clienteExistente.value = false;
      } else if (status === 409) {
        mostrarDatosCliente.value = false;
        clienteExistente.value = true;
      }
    } else {
      toast.error('Error de conexión. Intenta nuevamente.');
    }
  } finally {
    loading.value = false;
  }
};

const handleLogin = async () => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND}ecom/auth/login`,
      {
        email: formData.email,
        password: formData.password
      }
    );
    localStorage.setItem('client', JSON.stringify({
      token: data.token,
    }));
    toast.success(data.message || 'Inicio de sesión exitoso');
      
    setTimeout(() => {
      window.location.href = '/';
    }, 10);
  } catch (error) {
    const message = error.response?.data?.message || 'Error al iniciar sesión';
    toast.error(message);
  }
};

const handleRegister = async () => {
  try {
    const payload = {
      email: formData.email,
      password: formData.password,
      cli_ruc_ced: formData.cli_ruc_ced
    };

    if (mostrarDatosCliente.value) {
      payload.cliente = {
        ct_codigo: formData.cliente.ct_codigo,
        cli_nombre: formData.cliente.cli_nombre,
        cli_telefono: formData.cliente.cli_telefono,
        cli_celular: formData.cliente.cli_celular,
        cli_direccion: formData.cliente.cli_direccion
      };
    }

    console.log(payload);

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND}ecom/auth/register`,
      payload
    );

    console.log(data);

    toast.success(data.message || 'Registro exitoso');
    
    setTimeout(() => {
      isLogin.value = true;
      resetForm();
    }, 2000);
  } catch (error) {
    const message = error.response?.data?.message || 'Error al registrarse';
    toast.error(message);
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.warning('Por favor, completa todos los campos requeridos');
    return;
  }

  if (!isLogin.value && !clienteExistente.value && !mostrarDatosCliente.value) {
    toast.warning('Debes buscar el cliente antes de continuar');
    return;
  }

  loading.value = true;

  try {
    if (isLogin.value) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(148, 64, 0, 0.1);
  max-width: 600px;
  width: 100%;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h2 {
  color: #944000;
  font-size: 2rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.required {
  color: #dc3545;
  font-weight: 600;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-control:disabled,
.form-control:read-only {
  background-color: #f5f5f5;
  opacity: 0.7;
}

.form-control[aria-invalid="true"] {
  border-color: #dc3545;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #944000;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.input-with-button .form-control {
  flex: 1;
}

.btn-search {
  background-color: #944000;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-search:hover:not(:disabled) {
  background-color: #7a3400;
  transform: translateY(-1px);
}

.btn-search:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.high-contrast .btn-search:hover {
  background-color: white !important;
  color: #000;
}

.high-contrast .btn-search:focus {
  background-color: white !important;
  color: #000;
}

.client-data-section {
  padding: 24px;
  border-radius: 8px;
  border: 2px dashed #944000;
}

.high-contrast .client-data-section {
  border: 2px dashed #fff
}

.section-title {
  color: #944000;
  font-size: 1.1rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 576px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-actions {
  margin-top: 8px;
}

.btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #944000;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #7a3400;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(148, 64, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.btn-link {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 0.95rem;
  text-decoration: underline;
  padding: 8px;
  transition: color 0.2s ease;
}

.high-contrast .btn-link {
  color: #ff0;
}


.high-contrast .btn-link:hover {
  border: #ff0;
  color: #ff0
}

.high-contrast .btn-link:focus {
  border: #ff0;
  color: #ff0
}


textarea.form-control {
  resize: vertical;
  min-height: 80px;
}
</style>