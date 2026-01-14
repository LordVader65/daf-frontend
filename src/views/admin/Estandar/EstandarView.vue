<script setup>
  import { Icon } from "@iconify/vue";
</script>

<script>
import axios from 'axios';
import { obtainToken } from '../../../utils/obtain-token.js';
import { toast } from '../../../utils/toast.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos'
});

export default {
  name: 'EstandarView',
  data() {
    return {
      estandares: [],
      loading: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      searchTimeout: null
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = null;

      try {
        const token = obtainToken();
        const endpoint = this.searchQuery
          ? `estandar/search?name=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}`
          : `estandar?page=${this.currentPage}`;

        const { data } = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.estandares = data.data || [];
        this.totalPages = Math.ceil(data.count / parseInt(data.limit || 20));
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al cargar los datos';
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadData();
      }, 500);
    },

    nextPage() {
      if (this.estandares.length >= 20) {
        this.currentPage++;
        this.loadData();
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadData();
      }
    },

    goToFirstPage() {
      this.currentPage = 1;
      this.loadData();
    },

    goToLastPage() {
      this.currentPage = this.totalPages;
      this.loadData();
    },

    goBack() {
      this.$router.push('/admin/dashboard');
    },

    goToCreate() {
      this.$router.push('/admin/estandar/form');
    },

    goToEdit(codigo) {
      this.$router.push(`/admin/estandar/form/${codigo.trim()}`);
    },

    getEstadoLabel(estado) {
      const estados = {
        'PEN': 'Pendiente',
        'APR': 'Aprobado',
        'ANU': 'Anulado'
      };
      return estados[estado?.trim()] || estado;
    },

    getEstadoClass(estado) {
      const clases = {
        'PEN': 'badge-warning',
        'APR': 'badge-success',
        'ANU': 'badge-danger'
      };
      return clases[estado?.trim()] || 'badge-secondary';
    }
  }
};
</script>

<template>
  <div class="crud-container">
    <div class="top-bar">
      <button @click="goBack" class="btn-back" aria-label="Regresar">
        <Icon icon="mdi:arrow-left" />
        Regresar
      </button>
    </div>

    <div class="page-header">
      <h1>Gestión de Estándares</h1>
      <p class="text-muted">Administre los estándares de productos y sus materias primas</p>
    </div>

    <div class="search-section">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Buscar por código o producto..."
          class="search-input"
          aria-label="Buscar estándar"
        />
      </div>
      <button @click="goToCreate" class="btn-create">
        <Icon icon="mdi:plus" width="20"/>
        Crear Estándar
      </button>
    </div>

    <!-- Tabla de datos -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <Icon icon="mdi:loading" class="spinner" width="48"/>
        <p>Cargando datos...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon icon="mdi:alert-circle" width="48"/>
        <p>{{ error }}</p>
        <button @click="loadData" class="btn-retry">Reintentar</button>
      </div>

      <div v-else-if="estandares.length === 0" class="empty-state">
        <Icon icon="mdi:clipboard-list-outline" width="64"/>
        <p>No se encontraron estándares</p>
        <button @click="goToCreate" class="btn-create mt-3">
          <Icon icon="mdi:plus" width="20"/>
          Crear primer estándar
        </button>
      </div>

      <div v-else class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Total</th>
              <th>Costo Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in estandares" :key="item.est_cod">
              <td>{{ item.prd_codigo?.trim() }}</td>
              <td class="text-end">{{ item.est_qty_total }}</td>
              <td class="text-end">${{ parseFloat(item.est_costo_total || 0).toFixed(2) }}</td>
              <td>
                <span :class="['badge', getEstadoClass(item.est_estado)]">
                  {{ getEstadoLabel(item.est_estado) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="goToEdit(item.est_cod)"
                    class="btn-action btn-edit"
                    :aria-label="item.est_estado?.trim() === 'PEN' ? 'Editar estándar' : 'Ver estándar'"
                    :title="item.est_estado?.trim() === 'PEN' ? 'Editar' : 'Ver detalles'"
                  >
                    <Icon :icon="item.est_estado?.trim() === 'PEN' ? 'mdi:pencil' : 'mdi:eye'" width="20"/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && estandares.length > 0" class="pagination">
      <button
        @click="goToFirstPage"
        :disabled="currentPage === 1"
        class="btn-pagination"
        aria-label="Primera página"
      >
        <Icon icon="mdi:chevron-double-left" width="20"/>
      </button>
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="btn-pagination"
        aria-label="Página anterior"
      >
        <Icon icon="mdi:chevron-left" width="20"/>
      </button>
      <span class="page-info">{{ currentPage }}/{{ totalPages || 1 }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages || estandares.length < 20"
        class="btn-pagination"
        aria-label="Página siguiente"
      >
        <Icon icon="mdi:chevron-right" width="20"/>
      </button>
      <button
        @click="goToLastPage"
        :disabled="currentPage >= totalPages || estandares.length < 20"
        class="btn-pagination"
        aria-label="Última página"
      >
        <Icon icon="mdi:chevron-double-right" width="20"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
@import '../../../assets/css/admin/crud-view.css';

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  color: #944000;
  margin-bottom: 4px;
}

.text-muted {
  color: #666;
}

.codigo {
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  color: #944000;
}

.text-end {
  text-align: right;
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

.mt-3 {
  margin-top: 16px;
}
</style>
