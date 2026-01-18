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
  name: 'ClienteList',
  data() {
    return {
      clientes: [],
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
          ? `cliente/search?name=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}`
          : `cliente?page=${this.currentPage}`;

        const { data } = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(data);

        this.clientes = data.data || [];
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
      if (this.clientes.length >= 20) {
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
      this.$router.push('/admin/cliente/form');
    },

    goToEdit(id) {
      this.$router.push(`/admin/cliente/form/${id}`);
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
        // Asumiendo que el ID es cli_codigo
        await api.delete(`/cliente/${this.itemToDelete.cli_codigo}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        toast.success('Cliente eliminado correctamente');
        
        // Actualización optimista del frontend (borrado lógico visual)
        this.clientes = this.clientes.filter(c => c.cli_codigo !== this.itemToDelete.cli_codigo);
        
        this.closeDeleteModal();
        
        // Recargar datos por si acaso (opcional si confiamos en el filtro local, pero bueno para sincronizar)
        // this.loadData(); 
        // Comentamos loadData para evitar que reaparezca si el backend aun no lo filtra
        setTimeout(() => this.loadData(), 1000); // Reincronizar con delay
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al eliminar el cliente';
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
          placeholder="Buscar por nombre o identificación..."
          class="search-input"
          aria-label="Buscar cliente"
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

      <div v-else-if="clientes.length === 0" class="empty-state">
        <Icon icon="mdi:account-off" width="64"/>
        <p>No se encontraron clientes</p>
      </div>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Identificación</th>
              <th style="width: 400px;">Nombre Completo</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in clientes" :key="item.cli_codigo">
              <td>{{ item.cli_ruc_ced }}</td> 
              <td>{{ item.cli_nombre }}</td>
              <td>{{ item.cli_telefono }}</td>
              <td>{{ item.cli_mail }}</td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="goToEdit(item.cli_codigo)"
                    class="btn-action btn-edit"
                    :aria-label="'Editar ' + item.cli_nombre"
                  >
                    <Icon icon="mdi:pencil" width="20"></Icon>
                  </button>
                  <button
                    @click="confirmDelete(item)"
                    class="btn-action btn-delete"
                    :aria-label="'Eliminar ' + item.cli_nombre"
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
    <div v-if="!loading && clientes.length > 0" class="pagination">
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
        :disabled="currentPage >= totalPages || clientes.length < 20"
        class="btn-pagination"
        aria-label="Página siguiente"
      >
        <Icon icon="mdi:chevron-right" width="20"></Icon>
      </button>
      <button
        @click="goToLastPage"
        :disabled="currentPage >= totalPages || clientes.length < 20"
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
            <Icon icon="mdi:close" width="24"></Icon>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea eliminar el cliente?</p>
          <p class="item-name">{{ itemToDelete?.cl_nombre }}</p>
          <p class="warning-text">Esta acción cambiará el estado a inactivo.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="deleteItem" class="btn-confirm-delete">
            <Icon icon="mdi:delete" width="20"></Icon>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../../assets/css/admin/crud-view.css"></style>
