<script setup>
  import { Icon } from "@iconify/vue";
</script>

<script>
import axios from 'axios';
import { obtainToken } from '../../../utils/obtain-token.js';
import { toast } from '../../../utils/toast.js';
import { formatter } from '../../../utils/timestamp-formatter.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + 'pos'
});

export default {
  name: 'KardexMPList',
  data() {
    return {
      kardexMP: [],
      loading: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      showDeleteModal: false,
      itemToDelete: null,
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
          ? `kardexmp/search?name=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}`
          : `kardexmp?page=${this.currentPage}`;

        const { data } = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(data);

        this.kardexMP = data.data || [];
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

    performSearch() {
      this.currentPage = 1;
      this.loadData();
    },

    nextPage() {
      if (this.kardexMP.length >= 20) {
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
      this.$router.push('/admin/kardex/materia-prima/form');
    },

    goToEdit(codigo) {
      this.$router.push(`/admin/kardex/materia-prima/form/${codigo}`);
    },

    confirmDelete(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.itemToDelete = null;
    },

    async deleteItem() {
      try {
        const token = obtainToken();
        await api.delete(`/kardexmp/${this.itemToDelete.krd_codigo}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast.success('Kardex eliminado correctamente');
        this.closeDeleteModal();
        this.loadData();
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al eliminar el registro de kardex';
        toast.error(errorMsg);
      }
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

    <div class="search-section">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Buscar por descripción de materia prima..."
          class="search-input"
          aria-label="Buscar por nombre de materia prima"
        />
      </div>
      <button @click="goToCreate" class="btn-create">
        <Icon icon="mdi:plus" width="20"/>
        Crear
      </button>
    </div>

    <!-- Tabla de datos -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <Icon icon='mdi:loading'/>
        <p>Cargando datos...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon icon="mdi:alert-circle" />
        <p>{{ error }}</p>
        <button @click="loadData" class="btn-retry">Reintentar</button>
      </div>

      <div v-else-if="kardexMP.length === 0" class="empty-state">
        <Icon icon="mdi:package-variant" width="64"/>
        <p>No se encontraron registros de Kardex</p>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 500px;">Materia Prima</th>
              <th>Órden de Compra</th>
              <th>Cantidad</th>
              <th>Razón</th>
              <th>Usuario</th>
              <th>Fecha y Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in kardexMP" :key="item.krd_codigo">
              <td>{{ item.mp_descripcion }}</td>
              <td>{{ (item.oc_codigo)? item.oc_codigo : "NA" }}</td>
              <td>{{ item.krd_cantidad }}</td>
              <td>{{ item.krd_razon }}</td>
              <td>{{ item.usr_id }}</td>
              <td>{{ formatter.format(new Date(item.krd_fechahora)) }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="goToEdit(item.krd_codigo)"
                    class="btn-action btn-edit"
                    :aria-label="'Editar ' + item.mp_descripcion"
                  >
                    <Icon icon="mdi:pencil" width="20"></Icon>
                  </button>
                  <button
                    @click="confirmDelete(item)"
                    class="btn-action btn-delete"
                    :aria-label="'Eliminar ' + item.mp_descripcion"
                  >
                    <Icon icon="mdi:delete"/>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && kardexMP.length > 0" class="pagination">
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
        :disabled="currentPage >= totalPages || kardexMP.length < 20"
        class="btn-pagination"
        aria-label="Página siguiente"
      >
        <Icon icon="mdi:chevron-right" width="20"></Icon>
      </button>
      <button
        @click="goToLastPage"
        :disabled="currentPage >= totalPages || kardexMP.length < 20"
        class="btn-pagination"
        aria-label="Última página"
      >
       <Icon icon="mdi:chevron-double-right" width="20"/>
      </button>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="closeDeleteModal" class="btn-close" aria-label="Cerrar">
            <iconify-icon icon="mdi:close" width="24"></iconify-icon>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea eliminar el registro de Kardex?</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="deleteItem" class="btn-confirm-delete">
            <iconify-icon icon="mdi:delete" width="20"></iconify-icon>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../../assets/css/admin/crud-view.css"></style>