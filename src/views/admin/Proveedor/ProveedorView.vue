<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from "@iconify/vue";
import { ProveedorService } from '@/api/proveedor.service';
import { toast } from '@/utils/toast';

const router = useRouter();
const proveedores = ref([]);
const search = ref('');
const loading = ref(false);
const error = ref(null);

// Modal state
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

/* ===============================
   NAVEGACIÓN
   =============================== */
const goBack = () => router.push('/admin/dashboard');
const goCreate = () => router.push('/admin/proveedor/form');
const goEdit = (id) => router.push(`/admin/proveedor/form/${id}`);

/* ===============================
   CARGA DE DATOS
   =============================== */
const load = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await ProveedorService.getAll();
    proveedores.value = response.data;
  } catch (err) {
    error.value = 'Error al cargar proveedores';
    toast.error('Error al cargar proveedores');
  } finally {
    loading.value = false;
  }
};

onMounted(load);


/* ===============================
   FILTRO
   =============================== */
const filtered = computed(() => {
  if (!search.value) return proveedores.value;
  const s = search.value.toLowerCase();
  return proveedores.value.filter(
    (p) =>
      p.prv_razonsocial.toLowerCase().includes(s) ||
      p.prv_ruc.includes(s)
  );
});

/* ============================
   ACCIONES
============================ */
const confirmRemove = (item) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = null;
};

const remove = async () => {
  if (!itemToDelete.value) return;

  try {
    await ProveedorService.remove(itemToDelete.value.prv_codigo);
    toast.success('Proveedor inactivado correctamente');
    load();
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      router.push('/admin/login');
    } else {
      toast.error('Error al inactivar el proveedor');
      console.error(err);
    }
  } finally {
    closeDeleteModal();
  }
};
</script>

<template>
  <div class="crud-container">
    <div class="top-bar">
      <button @click="goBack" class="btn-back" aria-label="Regresar">
        <Icon icon="mdi:arrow-left" width="24" />
        Regresar
      </button>
    </div>

    <div class="page-header">
      <h1>Gestión de Proveedores</h1>
      <p class="text-muted">Administre el registro de sus proveedores</p>
    </div>

    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="search"
          type="text"
          class="search-input"
          placeholder="Buscar por razón social o RUC..."
          aria-label="Buscar proveedor"
          :disabled="loading"
        />
      </div>
      <button @click="goCreate" class="btn-create" :disabled="loading">
        <Icon icon="mdi:plus" width="20" />
        Crear Proveedor
      </button>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <Icon icon="mdi:loading" class="spinner" width="48" />
        <p>Cargando datos...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon icon="mdi:alert-circle" width="48" />
        <p>{{ error }}</p>
        <button @click="load" class="btn-retry">Reintentar</button>
      </div>

      <div v-else-if="filtered.length === 0" class="empty-state">
        <Icon icon="mdi:account-group-outline" width="64" />
        <p>No se encontraron proveedores</p>
      </div>

      <div v-else class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Razón Social</th>
              <th>RUC</th>
              <th>Celular</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p.prv_codigo">
              <td>{{ p.prv_razonsocial }}</td>
              <td>
                <span class="codigo">{{ p.prv_ruc }}</span>
              </td>
              <td>{{ p.prv_celular }}</td>
             <td>{{ p.ciudad_nombre || 'Sin ciudad' }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    class="btn-action btn-edit"
                    @click="goEdit(p.prv_codigo)"
                    title="Editar"
                    aria-label="Editar"
                  >
                    <Icon icon="mdi:pencil" width="20" />
                  </button>
                  <button
                    class="btn-action btn-delete"
                    @click="confirmRemove(p)"
                    title="Inactivar"
                    aria-label="Inactivar"
                  >
                    <Icon icon="mdi:delete" width="20" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Inactivación</h3>
          <button @click="closeDeleteModal" class="btn-close-modal" aria-label="Cerrar">
            <Icon icon="mdi:close" width="24" />
          </button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de inactivar este proveedor?</p>
          <p class="item-name" v-if="itemToDelete">
            {{ itemToDelete.prv_razonsocial }}
          </p>
          <p class="text-muted small mt-2">Esta acción no elimina el registro, solo lo marca como inactivo.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn btn-outline-secondary">Cancelar</button>
          <button @click="remove" class="btn btn-danger">
            <Icon icon="mdi:delete" width="20" class="me-1" />
            Inactivar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../../assets/css/admin/crud-view.css"></style>

