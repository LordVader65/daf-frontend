<template>
    <AccessibilityMenu/>
  <div class="perfil-page"> 
    <main class="main-content form-container">
      <div class="perfil-container">
        <div class="perfil-header">
          <Icon icon="mdi:account-circle" class="perfil-icon" />
          <h2>Mi Perfil</h2>
          <p class="subtitle">Administra tu información personal y configuración de cuenta</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <Icon icon="mdi:loading" class="spin" />
          <p>Cargando información...</p>
        </div>

        <!-- Profile Content -->
        <div v-else-if="usuario" class="perfil-content">
          <!-- Información de Cuenta -->
          <section class="perfil-section">
            <h3 class="section-title">
              <Icon icon="mdi:email" />
              Información de Cuenta
            </h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:email" class="label-icon" />
                  Correo Electrónico
                </label>
                <p class="info-value">{{ limpiarTexto(usuario.usr_email) }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:calendar" class="label-icon" />
                  Fecha de Registro
                </label>
                <p class="info-value">{{ formatearFecha(usuario.usr_fecha_registro) }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:check-circle" class="label-icon" />
                  Estado de la Cuenta
                </label>
                <p class="info-value">
                  <span :class="['badge', usuario.cli_estado === 'ACT' ? 'badge-success' : 'badge-danger']">
                    {{ usuario.cli_estado === 'ACT' ? 'Activa' : 'Inactiva' }}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <!-- Información del Cliente -->
          <section class="perfil-section">
            <h3 class="section-title">
              <Icon icon="mdi:account-details" />
              Información Personal
            </h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:account" class="label-icon" />
                  Razón Social / Nombre
                </label>
                <p class="info-value">{{ limpiarTexto(usuario.cli_nombre) }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:card-account-details" class="label-icon" />
                  RUC / Cédula
                </label>
                <p class="info-value">{{ limpiarTexto(usuario.cli_ruc_ced) }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:phone" class="label-icon" />
                  Teléfono
                </label>
                <p class="info-value">{{ limpiarTexto(usuario.cli_telefono) || 'No registrado' }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">
                  <Icon icon="mdi:cellphone" class="label-icon" />
                  Celular
                </label>
                <p class="info-value">{{ limpiarTexto(usuario.cli_celular) || 'No registrado' }}</p>
              </div>
              <div class="info-item full-width">
                <label class="info-label">
                  <Icon icon="mdi:map-marker" class="label-icon" />
                  Dirección
                </label>
                <p class="info-value">{{ limpiarTexto(usuario.cli_direccion) }}</p>
              </div>
            </div>
          </section>

          <!-- Cambiar Contraseña -->
          <section class="perfil-section">
            <h3 class="section-title">
              <Icon icon="mdi:lock-reset" />
              Cambiar Contraseña
            </h3>
            <form @submit.prevent="cambiarContrasena" class="password-form">
              <div class="form-group">
                <label for="new-password" class="form-label">
                  <Icon icon="mdi:lock" class="label-icon" />
                  Nueva Contraseña
                  <span class="required" aria-label="requerido">*</span>
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="new-password"
                    v-model="nuevaPassword"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Ingresa tu nueva contraseña"
                    :aria-invalid="passwordError ? 'true' : 'false'"
                    :aria-describedby="passwordError ? 'password-error' : null"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                    :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                    :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  >
                    <Icon :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
                  </button>
                </div>
                <span v-if="passwordError" id="password-error" class="error-message" role="alert">
                  {{ passwordError }}
                </span>
                <small v-else class="form-text text-muted">
                  <i class="bi bi-info-circle me-1"></i>La contraseña debe tener al menos 6 caracteres
                </small>
              </div>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loadingPassword"
                :aria-busy="loadingPassword"
                title="Guardar la nueva contraseña"
              >
                <Icon v-if="!loadingPassword" icon="mdi:content-save" />
                <Icon v-else icon="mdi:loading" class="spin" />
                {{ loadingPassword ? 'Guardando...' : 'Actualizar Contraseña' }}
              </button>
            </form>
          </section>

          <!-- Zona de Peligro -->
          <section class="perfil-section danger-zone">
            <h3 class="section-title">
              <Icon icon="mdi:alert-circle" />
              Zona de Peligro
            </h3>
            <div class="danger-content">
              <div class="danger-info">
                <h4>Eliminar Cuenta</h4>
                <p>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.</p>
              </div>
              <button
                type="button"
                class="btn btn-danger"
                @click="confirmarEliminarCuenta"
                :disabled="loadingDelete"
                title="Eliminar permanentemente tu cuenta y todos tus datos"
              >
                <Icon v-if="!loadingDelete" icon="mdi:delete-forever" />
                <Icon v-else icon="mdi:loading" class="spin" />
                {{ loadingDelete ? 'Eliminando...' : 'Eliminar Cuenta' }}
              </button>
            </div>
          </section>
        </div>

        <!-- Error State -->
        <div v-else class="error-state">
          <Icon icon="mdi:alert-circle" class="error-icon" />
          <p>No se pudo cargar la información del perfil</p>
          <button type="button" class="btn btn-primary" @click="cargarPerfil">
            <Icon icon="mdi:refresh" />
            Reintentar
          </button>
        </div>
      </div>
    </main>

    <!-- Modal de Confirmación -->
    <div v-if="showModal" class="modal-overlay" @click="cerrarModal">
      <div class="modal-content" @click.stop role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div class="modal-header">
          <h3 id="modal-title">
            <Icon icon="mdi:alert" class="modal-icon" />
            Confirmar Eliminación
          </h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar tu cuenta?</p>
          <p class="modal-warning">Esta acción no se puede deshacer y perderás toda tu información.</p>
        </div>
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="cerrarModal"
            :disabled="loadingDelete"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="eliminarCuenta"
            :disabled="loadingDelete"
          >
            <Icon v-if="!loadingDelete" icon="mdi:delete-forever" />
            <Icon v-else icon="mdi:loading" class="spin" />
            {{ loadingDelete ? 'Eliminando...' : 'Sí, Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Icon } from '@iconify/vue';
import { toast } from '@/utils/toast';
import { useRouter } from 'vue-router';
import AccessibilityMenu from '../components/AccessibilityMenu.vue'

const router = useRouter();

const usuario = ref(null);
const loading = ref(true);
const loadingPassword = ref(false);
const loadingDelete = ref(false);
const showPassword = ref(false);
const showModal = ref(false);
const nuevaPassword = ref('');
const passwordError = ref('');

onMounted(async () => {
  await cargarPerfil();
});

const cargarPerfil = async () => {
  loading.value = true;
  
  try {
    const token = JSON.parse(localStorage.getItem('client')).token;
    
    if (!token) {
      toast.error('No has iniciado sesión');
      router.push('/login');
      return;
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND}ecom/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    usuario.value = data;
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    const message = error.response?.data?.message || 'Error al cargar el perfil';
    toast.error(message);
  } finally {
    loading.value = false;
  }
};

const limpiarTexto = (texto) => {
  return texto ? texto.trim() : '';
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  
  const date = new Date(fecha);
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('es-EC', opciones);
};

const cambiarContrasena = async () => {
  passwordError.value = '';

  if (!nuevaPassword.value) {
    passwordError.value = 'La contraseña es obligatoria';
    return;
  }

  if (nuevaPassword.value.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  loadingPassword.value = true;

  try {
    const token = JSON.parse(localStorage.getItem('client')).token;

    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND}ecom/auth/password`,
      {
        password: nuevaPassword.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success(data.message || 'Contraseña actualizada exitosamente');
    nuevaPassword.value = '';
    showPassword.value = false;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar la contraseña';
    toast.error(message);
  } finally {
    loadingPassword.value = false;
  }
};

const confirmarEliminarCuenta = () => {
  showModal.value = true;
};

const cerrarModal = () => {
  if (!loadingDelete.value) {
    showModal.value = false;
  }
};

const eliminarCuenta = async () => {
  loadingDelete.value = true;

  try {
    const token = JSON.parse(localStorage.getItem('client')).token;

    const { data } = await axios.delete(
      `${import.meta.env.VITE_BACKEND}ecom/auth/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success(data.message || 'Cuenta eliminada exitosamente');
    localStorage.removeItem('client');
    
    setTimeout(() => {
      router.push('/login');
    });
  } catch (error) {
    const message = error.response?.data?.message || 'Error al eliminar la cuenta';
    toast.error(message);
    loadingDelete.value = false;
  }
};
</script>

<style scoped>
.perfil-page {
  min-height: 100vh;
}

main {
  padding: 40px 20px;
}

.perfil-container {
  max-width: 900px;
  margin: 0 auto;
}

.perfil-header {
  text-align: center;
  margin-bottom: 40px;
}

.perfil-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.perfil-header h2 {
  color: #944000;
  font-size: 2rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-state p,
.error-state p {
  margin-top: 16px;
  font-size: 1.1rem;
}

.error-icon {
  font-size: 3rem;
  color: #dc3545;
}

.spin {
  animation: spin 1s linear infinite;
  font-size: 2.5rem;
  color: #944000;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Profile Sections */
.perfil-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.perfil-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 12px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  font-size: 1rem;
}

.info-value {
  font-size: 1.05rem;
  padding: 10px 14px;
  border-radius: 6px;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}

/* Password Form */
.password-form {
  max-width: 500px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
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

.form-control:focus {
  outline: none;
  border-color: #944000;
  box-shadow: 0 0 0 3px rgba(148, 64, 0, 0.1);
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

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Danger Zone */
.danger-zone {
  border: 2px solid #dc3545;
  background: #fff5f5;
}

.danger-zone .section-title {
  color: #dc3545;
  border-bottom-color: #dc3545;
}

.danger-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.danger-info h4 {
  color: #dc3545;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.danger-info p {
  color: #666;
  font-size: 0.95rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  color: #dc3545;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.modal-icon {
  font-size: 1.5rem;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.modal-warning {
  color: #dc3545;
  font-weight: 600;
}

.modal-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-actions .btn {
  min-width: 120px;
}

/* Responsive */
@media (max-width: 768px) {
  .perfil-section {
    padding: 24px 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .danger-content {
    flex-direction: column;
    align-items: stretch;
  }

  .danger-content .btn {
    width: 100%;
  }
}
</style>