<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button
        @click="goBack"
        class="btn-back"
        aria-label="Regresar a la lista de órdenes"
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24"></Icon>
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>{{ isEditMode ? "Orden de Compra" : "Nueva Orden de Compra" }}</h2>
      <p class="text-muted">
        {{ isEditMode ? "Gestione los detalles y el estado" : "Seleccione el proveedor para crear la orden" }}
      </p>
    </div>

    <div v-if="loadingData" class="loading-container d-flex flex-column align-items-center py-5">
      <Icon icon="mdi:loading" width="48" class="spinner text-primary"></Icon>
      <p class="mt-3 text-muted">Cargando datos...</p>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <p class="text-muted small mb-4">
              <span class="text-danger">*</span> Campos obligatorios
            </p>

            <!-- CABECERA -->
            <div class="row g-3">
              <!-- Proveedor -->
              <div class="col-12 col-md-6">
                <label class="form-label fw-semibold">
                  Proveedor <span class="text-danger">*</span>
                </label>

                <select
                  v-model="formCabecera.prv_codigo"
                  class="form-select"
                  :class="{ 'is-invalid': errors.prv_codigo }"
                  :disabled="isEditMode"
                >
                  <option value="">Seleccione un proveedor</option>
                  <option v-for="p in proveedores" :key="p.prv_codigo" :value="p.prv_codigo.trim()">
                    {{ p.prv_razonsocial || p.prv_nombre || p.prv_codigo }}
                  </option>
                </select>

                <div v-if="errors.prv_codigo" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                  {{ errors.prv_codigo }}
                </div>

                <div class="form-text">
                  {{ isEditMode ? "No se puede cambiar el proveedor en una orden creada" : "Seleccione el proveedor de la orden" }}
                </div>
              </div>

              <!-- Estado -->
              <div class="col-12 col-md-3" v-if="isEditMode">
                <label class="form-label fw-semibold">Estado</label>
                <input class="form-control" :value="estadoLabel(cabecera?.oc_estado)" disabled />
              </div>

              <!-- Código OC -->
              <div class="col-12 col-md-3" v-if="isEditMode">
                <label class="form-label fw-semibold">Código</label>
                <input class="form-control" :value="cabecera?.oc_codigo" disabled />
              </div>

              <!-- Totales -->
              <div class="col-12 col-md-4" v-if="isEditMode">
                <label class="form-label fw-semibold">Subtotal</label>
                <input class="form-control" :value="money(cabecera?.oc_subtotal)" disabled />
              </div>
              <div class="col-12 col-md-4" v-if="isEditMode">
                <label class="form-label fw-semibold">IVA</label>
                <input class="form-control" :value="money(cabecera?.oc_iva)" disabled />
              </div>
              <div class="col-12 col-md-4" v-if="isEditMode">
                <label class="form-label fw-semibold">Total</label>
                <input class="form-control" :value="money(cabecera?.oc_total)" disabled />
              </div>
            </div>

            <hr class="my-4" />

            <!-- ACCIÓN CREATE -->
            <div v-if="!isEditMode" class="d-flex justify-content-end gap-3">
              <button
                type="button"
                class="btn btn-primary"
                :disabled="submitting || !formCabecera.prv_codigo"
                @click="crearOrden"
              >
                <Icon v-if="submitting" icon="mdi:loading" width="20" class="spinner me-1"></Icon>
                <Icon v-else icon="mdi:content-save" width="20" class="me-1"></Icon>
                {{ submitting ? "Creando..." : "Crear Orden" }}
              </button>
            </div>

            <!-- DETALLES (solo si ya existe OC) -->
            <div v-if="isEditMode">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="mb-0">Detalle de Orden</h5>

                <div class="d-flex gap-2">
                  <button
                    v-if="cabecera?.oc_estado === 'PEN'"
                    class="btn btn-success"
                    type="button"
                    @click="confirmApprove"
                    :disabled="submittingEstado"
                  >
                    <Icon icon="mdi:check" width="18" class="me-1"></Icon>
                    Aprobar
                  </button>

                  <button
                    v-if="cabecera?.oc_estado === 'PEN'"
                    class="btn btn-danger"
                    type="button"
                    @click="confirmAnular"
                    :disabled="submittingEstado"
                  >
                    <Icon icon="mdi:cancel" width="18" class="me-1"></Icon>
                    Anular
                  </button>
                </div>
              </div>

              <p class="text-muted mb-3">
                {{ isEditable ? "Agregue materias primas y cantidades. Al aprobar se actualiza el stock." : "La orden no está en estado Pendiente, no se puede editar." }}
              </p>

              <!-- Form agregar item -->
              <div class="row g-3 align-items-end">
                <div class="col-12 col-md-7">
                  <label class="form-label fw-semibold">Materia Prima <span class="text-danger">*</span></label>
                  <select
                    v-model="detalleForm.mp_codigo"
                    class="form-select"
                    :disabled="!isEditable || loadingMateriasPrimas"
                    :class="{ 'is-invalid': errors.mp_codigo }"
                  >
                    <option value="">Seleccione una materia prima</option>
                    <option v-for="mp in materiasPrimas" :key="mp.mp_codigo" :value="mp.mp_codigo.trim()">
                      {{ mp.mp_descripcion.trim() }}
                    </option>
                  </select>
                  <div v-if="errors.mp_codigo" class="invalid-feedback d-block">
                    <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                    {{ errors.mp_codigo }}
                  </div>
                </div>

                <div class="col-12 col-md-3">
                  <label class="form-label fw-semibold">Cantidad <span class="text-danger">*</span></label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="detalleForm.pxoc_cantidad"
                    min="1"
                    step="1"
                    :disabled="!isEditable"
                    :class="{ 'is-invalid': errors.pxoc_cantidad }"
                  />
                  <div v-if="errors.pxoc_cantidad" class="invalid-feedback d-block">
                    <Icon icon="mdi:alert-circle" width="16" class="me-1"></Icon>
                    {{ errors.pxoc_cantidad }}
                  </div>
                </div>

                <div class="col-12 col-md-2 d-grid">
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="upsertDetalle"
                    :disabled="!isEditable || submittingDetalle"
                  >
                    <Icon v-if="submittingDetalle" icon="mdi:loading" width="18" class="spinner me-1"></Icon>
                    <Icon v-else icon="mdi:plus" width="18" class="me-1"></Icon>
                    {{ submittingDetalle ? "Guardando" : "Agregar" }}
                  </button>
                </div>
              </div>

              <!-- Tabla detalle -->
              <div class="table-container mt-4">
                <div v-if="detalles.length === 0" class="empty-state">
                  <Icon icon="mdi:package-variant" width="64"/>
                  <p>No hay detalles agregados</p>
                </div>

                <div class="table-scroll" v-else>
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th style="width: 520px;">Materia Prima</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Estado</th>
                        <th v-if="isEditable">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="d in detalles" :key="d.mp_codigo">
                        <td>{{ d.mp_descripcion }}</td>
                        <td>{{ d.pxoc_cantidad }}</td>
                        <td>{{ money(d.pxoc_subtotal) }}</td>
                        <td>{{ d.pxoc_estado }}</td>
                        <td v-if="isEditable">
                          <button
                            class="btn-action btn-delete"
                            @click="confirmDeleteDetalle(d)"
                            :aria-label="'Eliminar ' + d.mp_descripcion"
                          >
                            <Icon icon="mdi:delete" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <!-- MODAL eliminar detalle -->
            <div v-if="showDeleteDetalleModal" class="modal-overlay" @click="closeModals">
              <div class="modal-content" @click.stop>
                <div class="modal-header">
                  <h3>Confirmar Eliminación</h3>
                  <button @click="closeModals" class="btn-close" aria-label="Cerrar">
                    <iconify-icon icon="mdi:close" width="24"></iconify-icon>
                  </button>
                </div>
                <div class="modal-body">
                  <p>¿Está seguro que desea eliminar el detalle?</p>
                  <p class="item-name">{{ itemDetalleSelected?.mp_descripcion }}</p>
                </div>
                <div class="modal-footer">
                  <button @click="closeModals" class="btn-cancel">Cancelar</button>
                  <button @click="deleteDetalle" class="btn-confirm-delete">
                    <iconify-icon icon="mdi:delete" width="20"></iconify-icon>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- MODAL aprobar/anular -->
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
                  <p class="item-name">{{ cabecera?.oc_codigo }}</p>
                  <p class="warning-text">Esta acción actualizará inventario.</p>
                </div>
                <div class="modal-footer">
                  <button @click="closeModals" class="btn-cancel">Cancelar</button>
                  <button @click="aprobar" class="btn-confirm-delete" style="background:#198754;">
                    <iconify-icon icon="mdi:check" width="20"></iconify-icon>
                    Aprobar
                  </button>
                </div>
              </div>
            </div>

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
                  <p class="item-name">{{ cabecera?.oc_codigo }}</p>
                </div>
                <div class="modal-footer">
                  <button @click="closeModals" class="btn-cancel">Cancelar</button>
                  <button @click="anular" class="btn-confirm-delete">
                    <iconify-icon icon="mdi:cancel" width="20"></iconify-icon>
                    Anular
                  </button>
                </div>
              </div>
            </div>

            <!-- FIN CARD -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { obtainToken } from "../../../utils/obtain-token.js";
import { toast } from "../../../utils/toast.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + "pos",
});

export default {
  name: "OrdenCompraForm",
  data() {
    return {
      // modo
      isEditMode: false,

      // loading
      loadingData: false,
      loadingProveedores: false,
      loadingMateriasPrimas: false,

      // submit states
      submitting: false,
      submittingDetalle: false,
      submittingEstado: false,

      // data
      proveedores: [],
      materiasPrimas: [],

      cabecera: null,
      detalles: [],

      // forms
      formCabecera: {
        prv_codigo: "",
      },
      detalleForm: {
        mp_codigo: "",
        pxoc_cantidad: 1,
      },

      // modals
      showDeleteDetalleModal: false,
      itemDetalleSelected: null,
      showApproveModal: false,
      showAnularModal: false,

      errors: {},
    };
  },
  computed: {
    isEditable() {
      return this.isEditMode && this.cabecera?.oc_estado === "PEN";
    },
  },
  async mounted() {
    // load tipos
    await Promise.all([this.loadProveedores(), this.loadMateriasPrimas()]);

    const id = this.$route.params.id;
    if (id) {
      this.isEditMode = true;
      await this.loadOC(id);
    }
  },
  methods: {
    money(v) {
      const n = Number(v);
      if (Number.isNaN(n)) return "$0.00";
      return `$${n.toFixed(2)}`;
    },
    estadoLabel(e) {
      if (e === "PEN") return "Pendiente";
      if (e === "APR") return "Aprobada";
      if (e === "ANU") return "Anulada";
      return e || "NA";
    },

    async loadProveedores() {
      this.loadingProveedores = true;
      try {
        const token = obtainToken();
        // Ajusta según tu endpoint real de proveedor.
        // Si no tienes /proveedor/type, usa /proveedor?page=1 y parsea data.data
        const { data } = await api.get("/proveedor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.proveedores = Array.isArray(data?.data) ? data.data : data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al cargar proveedores");
        this.proveedores = [];
      } finally {
        this.loadingProveedores = false;
      }
    },

    async loadMateriasPrimas() {
      this.loadingMateriasPrimas = true;
      try {
        const token = obtainToken();
        const { data } = await api.get("/materiaprima/type", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.materiasPrimas = data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al cargar materias primas");
        this.materiasPrimas = [];
      } finally {
        this.loadingMateriasPrimas = false;
      }
    },

    async loadOC(id) {
      this.loadingData = true;
      try {
        const token = obtainToken();
        const { data } = await api.get(`/ordencompra/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.cabecera = data.cabecera;
        this.detalles = data.detalles || [];

        this.formCabecera.prv_codigo = this.cabecera?.prv_codigo?.trim?.() || this.cabecera?.prv_codigo || "";
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al cargar la orden");
        this.goBack();
      } finally {
        this.loadingData = false;
      }
    },

    validateCreateCabecera() {
      this.errors = {};
      if (!this.formCabecera.prv_codigo) {
        this.errors.prv_codigo = "Debe seleccionar un proveedor";
      }
      return Object.keys(this.errors).length === 0;
    },

    async crearOrden() {
      if (!this.validateCreateCabecera()) {
        toast.warning("Por favor, corrija los errores");
        return;
      }

      this.submitting = true;
      try {
        const token = obtainToken();
        const { data } = await api.post(
          "/ordencompra",
          { prv_codigo: this.formCabecera.prv_codigo.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Orden creada correctamente");

        // redirigir a edit para manejar detalle
        const oc = data.oc_codigo || data?.cabecera?.oc_codigo;
        this.$router.push(`/admin/orden-compra/form/${oc}`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al crear la orden");
      } finally {
        this.submitting = false;
      }
    },

    validateDetalle() {
      // no borres errores de cabecera si estás editando detalle
      const e = {};
      if (!this.detalleForm.mp_codigo) e.mp_codigo = "Debe seleccionar una materia prima";
      if (!this.detalleForm.pxoc_cantidad || this.detalleForm.pxoc_cantidad <= 0) {
        e.pxoc_cantidad = "La cantidad debe ser mayor a 0";
      }
      this.errors = { ...this.errors, ...e };
      return Object.keys(e).length === 0;
    },

    async upsertDetalle() {
      if (!this.isEditable) return;

      // limpia errores del detalle
      delete this.errors.mp_codigo;
      delete this.errors.pxoc_cantidad;

      if (!this.validateDetalle()) {
        toast.warning("Revise los datos del detalle");
        return;
      }

      this.submittingDetalle = true;
      try {
        const token = obtainToken();
        const oc = this.cabecera.oc_codigo;

        const { data } = await api.post(
          `/ordencompra/${oc}/detalle`,
          {
            mp_codigo: this.detalleForm.mp_codigo.trim(),
            pxoc_cantidad: this.detalleForm.pxoc_cantidad,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // backend devuelve cabecera y detalles actualizados
        this.cabecera = data.cabecera;
        this.detalles = data.detalles || [];

        toast.success("Detalle actualizado");

        // reset input detalle
        this.detalleForm.mp_codigo = "";
        this.detalleForm.pxoc_cantidad = 1;
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al guardar el detalle");
      } finally {
        this.submittingDetalle = false;
      }
    },

    confirmDeleteDetalle(item) {
      this.itemDetalleSelected = item;
      this.showDeleteDetalleModal = true;
    },

    async deleteDetalle() {
      if (!this.isEditable) return;

      try {
        const token = obtainToken();
        const oc = this.cabecera.oc_codigo;
        const mp = this.itemDetalleSelected.mp_codigo;

        const { data } = await api.delete(`/ordencompra/${oc}/detalle/${mp}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.cabecera = data.cabecera;
        this.detalles = data.detalles || [];

        toast.success("Detalle eliminado");
        this.closeModals();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al eliminar el detalle");
      }
    },

    confirmApprove() {
      this.showApproveModal = true;
    },
    confirmAnular() {
      this.showAnularModal = true;
    },

    async aprobar() {
      this.submittingEstado = true;
      try {
        const token = obtainToken();
        const oc = this.cabecera.oc_codigo;

        const { data } = await api.post(`/ordencompra/${oc}/aprobar`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.cabecera = data.cabecera;
        this.detalles = data.detalles || [];

        toast.success("Orden aprobada");
        this.closeModals();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al aprobar la orden");
      } finally {
        this.submittingEstado = false;
      }
    },

    async anular() {
      this.submittingEstado = true;
      try {
        const token = obtainToken();
        const oc = this.cabecera.oc_codigo;

        const { data } = await api.post(`/ordencompra/${oc}/anular`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.cabecera = data.cabecera;
        this.detalles = data.detalles || [];

        toast.success("Orden anulada");
        this.closeModals();
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al anular la orden");
      } finally {
        this.submittingEstado = false;
      }
    },

    closeModals() {
      this.showDeleteDetalleModal = false;
      this.itemDetalleSelected = null;
      this.showApproveModal = false;
      this.showAnularModal = false;
    },

    goBack() {
      this.$router.push("/admin/orden-compra");
    },
  },
};
</script>

<style src="../../../assets/css/form.css"/>
<style src="../../../assets/css/admin/crud-form.css"></style>
<style scoped src="../../../assets/css/admin/crud-view.css"></style>
