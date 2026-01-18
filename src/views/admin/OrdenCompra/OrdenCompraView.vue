<script setup>
import { Icon } from "@iconify/vue";
</script>

<script>
import axios from "axios";
import { obtainToken } from "../../../utils/obtain-token.js";
import { toast } from "../../../utils/toast.js";
import { formatter } from "../../../utils/timestamp-formatter.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + "pos",
});

export default {
  name: "OrdenCompraList",
  data() {
    return {
      ordenes: [],
      proveedores: [],
      loading: false,
      error: null,

      // filtros
      estado: "", // "", "PEN", "APR", "ANU"
      searchProveedor: "", // prv_codigo

      currentPage: 1,
      totalPages: 1,

      // modales
      showApproveModal: false,
      showAnularModal: false,
      itemSelected: null,

      searchTimeout: null,
    };
  },
  mounted() {
    this.loadData();
    this.loadProveedores();
  },
  methods: {
    async loadProveedores() {
      try {
        const token = obtainToken();
        const { data } = await api.get("/proveedor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ajustar según estructura de retorno (igual que en el Form)
        this.proveedores = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar proveedores", err);
      }
    },

    getProveedorNombre(codigo) {
      if (!codigo) return "N/A";
      const p = this.proveedores.find(
        (x) => x.prv_codigo?.trim() === codigo?.trim()
      );
      return p ? (p.prv_razonsocial || p.prv_nombre || codigo) : codigo;
    },

    async loadData() {
      this.loading = true;
      this.error = null;

      try {
        const token = obtainToken();

        // si hay búsqueda por proveedor => /ordencompra/search
        let endpoint = "";
        if (this.searchProveedor.trim()) {
          endpoint = `ordencompra/search?prv=${encodeURIComponent(
            this.searchProveedor.trim()
          )}&page=${this.currentPage}`;
        } else {
          endpoint = `ordencompra?page=${this.currentPage}`;
          if (this.estado) endpoint += `&estado=${encodeURIComponent(this.estado)}`;
        }

        const { data } = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.ordenes = data.data || [];

        // count puede venir como string (PG)
        const count = Number(data.count || 0);
        const limit = Number(data.limit || 20);
        this.totalPages = Math.max(1, Math.ceil(count / limit));
      } catch (err) {
        this.error = err.response?.data?.message || "Error al cargar órdenes de compra";
        toast.error(this.error);
        this.ordenes = [];
        this.totalPages = 1;
      } finally {
        this.loading = false;
      }
    },

    handleSearchProveedor() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadData();
      }, 500);
    },

    handleEstadoChange() {
      // limpiar búsqueda por proveedor si cambias estado (opcional)
      this.currentPage = 1;
      this.loadData();
    },

    // paginación
    nextPage() {
      if (this.currentPage < this.totalPages) {
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

    // navegación
    goBack() {
      this.$router.push("/admin/dashboard");
    },
    goToCreate() {
      this.$router.push("/admin/orden-compra/form"); // form create
    },
    goToEdit(ocCodigo) {
      this.$router.push(`/admin/orden-compra/form/${ocCodigo}`);
    },

    // badges
    estadoLabel(e) {
      if (e === "PEN") return "Pendiente";
      if (e === "APR") return "Aprobada";
      if (e === "ANU") return "Anulada";
      return e || "NA";
    },
    estadoBadgeClass(e) {
      // usa tu css existente de badges si aplica, sino cae a clase genérica
      if (e === "PEN") return "badge badge-F"; // amarillo/alerta (ajusta si quieres)
      if (e === "APR") return "badge badge-L"; // verde/ok (ajusta si quieres)
      if (e === "ANU") return "badge badge-ANU";
      return "badge";
    },
    money(v) {
      const n = Number(v);
      if (Number.isNaN(n)) return "$0.00";
      return `$${n.toFixed(2)}`;
    },

    // modales aprobar/anular
    confirmApprove(item) {
      this.itemSelected = item;
      this.showApproveModal = true;
    },
    confirmAnular(item) {
      this.itemSelected = item;
      this.showAnularModal = true;
    },
    closeModals() {
      this.showApproveModal = false;
      this.showAnularModal = false;
      this.itemSelected = null;
    },

    async aprobarOC() {
      try {
        const token = obtainToken();
        await api.post(`/ordencompra/${this.itemSelected.oc_codigo}/aprobar`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Orden aprobada correctamente");
        this.closeModals();
        this.loadData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al aprobar la orden");
      }
    },

    async anularOC() {
      try {
        const token = obtainToken();
        await api.post(`/ordencompra/${this.itemSelected.oc_codigo}/anular`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Orden anulada correctamente");
        this.closeModals();
        this.loadData();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al anular la orden");
      }
    },
  },
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
      <div class="search-bar d-flex gap-2 align-items-center" style="width: 100%;">
        <!-- Buscar por proveedor -->
        <input
          type="text"
          v-model="searchProveedor"
          @input="handleSearchProveedor"
          placeholder="Buscar por código de proveedor (PRV...)"
          class="search-input"
          aria-label="Buscar por proveedor"
        />

        <!-- filtro estado -->
        <select
          v-model="estado"
          @change="handleEstadoChange"
          class="form-select"
          style="max-width: 220px;"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos</option>
          <option value="PEN">Pendiente</option>
          <option value="APR">Aprobada</option>
          <option value="ANU">Anulada</option>
        </select>
      </div>

      <button @click="goToCreate" class="btn-create">
        <Icon icon="mdi:plus" width="20" />
        Crear
      </button>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <Icon icon="mdi:loading" />
        <p>Cargando datos...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon icon="mdi:alert-circle" />
        <p>{{ error }}</p>
        <button @click="loadData" class="btn-retry">Reintentar</button>
      </div>

      <div v-else-if="ordenes.length === 0" class="empty-state">
        <Icon icon="mdi:clipboard-text" width="64" />
        <p>No se encontraron órdenes de compra</p>
      </div>

      <div class="table-scroll" v-else>
        <table class="data-table">
          <thead>
            <tr>
              <th>OC</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Estado</th>
              <th style="width: 220px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ordenes" :key="item.oc_codigo">
              <td>{{ item.oc_codigo }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span class="fw-semibold">{{ getProveedorNombre(item.prv_codigo) }}</span>
                  <small class="text-muted">{{ item.prv_codigo }}</small>
                </div>
              </td>
              <td>{{ item.oc_fecha ? formatter.format(new Date(item.oc_fecha)) : "NA" }}</td>
              <td>{{ money(item.oc_subtotal) }}</td>
              <td>{{ money(item.oc_iva) }}</td>
              <td>{{ money(item.oc_total) }}</td>
              <td>
                <span :class="estadoBadgeClass(item.oc_estado)">
                  {{ estadoLabel(item.oc_estado) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="goToEdit(item.oc_codigo)"
                    class="btn-action btn-edit"
                    :aria-label="'Ver/Editar ' + item.oc_codigo"
                    title="Ver / Editar"
                  >
                    <Icon icon="mdi:pencil" width="20" />
                  </button>

                  <button
                    v-if="item.oc_estado === 'PEN'"
                    @click="confirmApprove(item)"
                    class="btn-action"
                    style="background: #198754; color: white;"
                    :aria-label="'Aprobar ' + item.oc_codigo"
                    title="Aprobar"
                  >
                    <Icon icon="mdi:check" width="20" />
                  </button>

                  <button
                    v-if="item.oc_estado === 'PEN'"
                    @click="confirmAnular(item)"
                    class="btn-action btn-delete"
                    :aria-label="'Anular ' + item.oc_codigo"
                    title="Anular"
                  >
                    <Icon icon="mdi:cancel" width="20" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="!loading && ordenes.length > 0" class="pagination">
      <button @click="goToFirstPage" :disabled="currentPage === 1" class="btn-pagination">
        <Icon icon="mdi:chevron-double-left" width="20" />
      </button>
      <button @click="previousPage" :disabled="currentPage === 1" class="btn-pagination">
        <Icon icon="mdi:chevron-left" width="20" />
      </button>

      <span class="page-info">{{ currentPage }}/{{ totalPages || 1 }}</span>

      <button @click="nextPage" :disabled="currentPage >= totalPages" class="btn-pagination">
        <Icon icon="mdi:chevron-right" width="20" />
      </button>
      <button @click="goToLastPage" :disabled="currentPage >= totalPages" class="btn-pagination">
        <Icon icon="mdi:chevron-double-right" width="20" />
      </button>
    </div>

    <!-- Modal Aprobar -->
    <div v-if="showApproveModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Aprobación</h3>
          <button @click="closeModals" class="btn-close" aria-label="Cerrar">
            <iconify-icon icon="mdi:close" width="24"></iconify-icon>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea aprobar la orden?</p>
          <p class="item-name">{{ itemSelected?.oc_codigo }}</p>
          <p class="warning-text">Esta acción actualizará stock y generará movimientos.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn-cancel">Cancelar</button>
          <button @click="aprobarOC" class="btn-confirm-delete" style="background:#198754;">
            <iconify-icon icon="mdi:check" width="20"></iconify-icon>
            Aprobar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Anular -->
    <div v-if="showAnularModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Anulación</h3>
          <button @click="closeModals" class="btn-close" aria-label="Cerrar">
            <iconify-icon icon="mdi:close" width="24"></iconify-icon>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea anular la orden?</p>
          <p class="item-name">{{ itemSelected?.oc_codigo }}</p>
          <p class="warning-text">Solo se puede anular si está en estado Pendiente.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn-cancel">Cancelar</button>
          <button @click="anularOC" class="btn-confirm-delete">
            <iconify-icon icon="mdi:cancel" width="20"></iconify-icon>
            Anular
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../../../assets/css/admin/crud-view.css"></style>
