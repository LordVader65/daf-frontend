<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="form-container">
    <div class="top-bar">
      <button
        @click="goBack"
        class="btn-back"
        aria-label="Regresar a la lista de productos"
        title="Volver a la lista"
      >
        <Icon icon="mdi:arrow-left" width="24" />
        Regresar
      </button>
    </div>

    <div class="form-header text-center mb-4">
      <h2>{{ isEditMode ? "Editar Producto" : "Nuevo Producto" }}</h2>
      <p class="text-muted">
        {{ isEditMode ? "Modifique los campos necesarios" : "Complete todos los campos requeridos" }}
      </p>
    </div>

    <div v-if="loadingData" class="loading-container d-flex flex-column align-items-center py-5">
      <Icon icon="mdi:loading" width="48" class="spinner text-primary" />
      <p class="mt-3 text-muted">Cargando datos...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="materia-prima-form" novalidate>
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <p class="text-muted small mb-4">
                <span class="text-danger">*</span> Campos obligatorios
              </p>

              <!-- Nombre -->
              <div class="mb-4">
                <label for="prd_nombre" class="form-label fw-semibold">
                  Nombre <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="prd_nombre"
                  v-model="formData.prd_nombre"
                  class="form-control"
                  :class="{ 'is-invalid': errors.prd_nombre }"
                  placeholder="Ej: Arreglo floral primavera..."
                  maxlength="60"
                  required
                />
                <div v-if="errors.prd_nombre" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.prd_nombre }}
                </div>
                <div class="form-text d-flex justify-content-between">
                  <span>Nombre comercial del producto</span>
                  <span :class="{ 'text-warning': formData.prd_nombre.length > 50, 'text-danger': formData.prd_nombre.length >= 60 }">
                    {{ formData.prd_nombre.length }}/60
                  </span>
                </div>
              </div>

              <!-- Unidad de medida (venta) -->
              <div class="mb-4">
                <label for="um_venta" class="form-label fw-semibold">
                  Unidad de Venta <span class="text-danger">*</span>
                </label>
                <select
                  id="um_venta"
                  v-model="formData.um_venta"
                  class="form-select"
                  :class="{ 'is-invalid': errors.um_venta }"
                  required
                  :disabled="loadingUnidades"
                >
                  <option value="">Seleccione una unidad</option>
                  <option v-for="unidad in unidadesMedida" :key="unidad.um_codigo" :value="unidad.um_codigo.trim()">
                    {{ unidad.um_descripcion.trim() }}
                  </option>
                </select>
                <div v-if="errors.um_venta" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.um_venta }}
                </div>
              </div>

              <!-- Categoría (opcional) -->
              <div class="mb-4">
                <label for="cat_codigo" class="form-label fw-semibold">
                  Categoría <span class="text-muted">(opcional)</span>
                </label>
                <select
                  id="cat_codigo"
                  v-model="formData.cat_codigo"
                  class="form-select"
                  :class="{ 'is-invalid': errors.cat_codigo }"
                  :disabled="loadingCategorias"
                >
                  <option :value="null">Sin categoría</option>
                  <option v-for="cat in categorias" :key="cat.cat_codigo" :value="cat.cat_codigo.trim()">
                    {{ (cat.cat_nombre || cat.cat_descripcion || cat.cat_codigo).trim?.() || cat.cat_codigo }}
                  </option>
                </select>
                <div v-if="errors.cat_codigo" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.cat_codigo }}
                </div>
                <div class="form-text">Si eliges una categoría inválida, el backend rechazará por FK.</div>
              </div>

              <!-- Desc corta -->
              <div class="mb-4">
                <label for="prd_desc_corta" class="form-label fw-semibold">
                  Descripción corta <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="prd_desc_corta"
                  v-model="formData.prd_desc_corta"
                  class="form-control"
                  :class="{ 'is-invalid': errors.prd_desc_corta }"
                  placeholder="Ej: Arreglo mediano con rosas..."
                  maxlength="60"
                  required
                />
                <div v-if="errors.prd_desc_corta" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.prd_desc_corta }}
                </div>
              </div>

              <!-- Desc larga -->
              <div class="mb-4">
                <label for="prd_desc_larga" class="form-label fw-semibold">
                  Descripción larga <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="prd_desc_larga"
                  v-model="formData.prd_desc_larga"
                  class="form-control"
                  :class="{ 'is-invalid': errors.prd_desc_larga }"
                  placeholder="Ej: Incluye flores de temporada..."
                  maxlength="255"
                  required
                />
                <div v-if="errors.prd_desc_larga" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.prd_desc_larga }}
                </div>
              </div>

              <!-- Precio venta -->
              <div class="mb-4">
                <label for="prd_precio_venta" class="form-label fw-semibold">
                  Precio de venta <span class="text-danger">*</span>
                </label>
                <div class="input-group" :class="{ 'has-validation': errors.prd_precio_venta }">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    id="prd_precio_venta"
                    v-model.number="formData.prd_precio_venta"
                    class="form-control"
                    :class="{ 'is-invalid': errors.prd_precio_venta }"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                  <div v-if="errors.prd_precio_venta" class="invalid-feedback d-block">
                    <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                    {{ errors.prd_precio_venta }}
                  </div>
                </div>
              </div>

              <!-- Stock -->
              <div class="mb-4">
                <label for="prd_stock" class="form-label fw-semibold">
                  Stock <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="prd_stock"
                  v-model.number="formData.prd_stock"
                  class="form-control"
                  :class="{ 'is-invalid': errors.prd_stock }"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
                <div v-if="errors.prd_stock" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.prd_stock }}
                </div>
              </div>

              <!-- Prioridad -->
              <div class="mb-4">
                <label for="prd_prioridad" class="form-label fw-semibold">
                  Prioridad <span class="text-danger">*</span>
                </label>
                <select
                  id="prd_prioridad"
                  v-model="formData.prd_prioridad"
                  class="form-select"
                  :class="{ 'is-invalid': errors.prd_prioridad }"
                  required
                >
                  <option value="">Seleccione una prioridad</option>
                  <option value="L">LIFO (Last In, First Out)</option>
                  <option value="F">FIFO (First In, First Out)</option>
                </select>
                <div v-if="errors.prd_prioridad" class="invalid-feedback d-block">
                  <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                  {{ errors.prd_prioridad }}
                </div>
              </div>

              <!-- Imagen (archivo local) -->
            <div class="mb-4">
            <label for="prd_img_file" class="form-label fw-semibold">
                Imagen <span class="text-muted">(opcional)</span>
            </label>

            <input
                type="file"
                id="prd_img_file"
                class="form-control"
                accept="image/*"
                @change="onFileChange"
                :class="{ 'is-invalid': errors.prd_img }"
            />

            <div v-if="errors.prd_img" class="invalid-feedback d-block">
                <Icon icon="mdi:alert-circle" width="16" class="me-1" />
                {{ errors.prd_img }}
            </div>

            <div class="form-text">
                Seleccione una imagen desde su equipo. Por ahora no se guarda en la BD (se enviará NULL).
            </div>

            <!-- Preview -->
            <div v-if="imagePreview" class="mt-3">
                <img
                :src="imagePreview"
                alt="Vista previa"
                style="max-width: 240px; border-radius: 8px;"
                />
                <div class="mt-2">
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="clearImage">
                    <Icon icon="mdi:close" width="18" class="me-1" />
                    Quitar imagen
                </button>
                </div>
            </div>
            </div>

              <hr class="my-4" />

              <div class="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  @click="goBack"
                  class="btn btn-outline-secondary"
                  :disabled="submitting"
                  aria-label="Cancelar y volver a la lista"
                >
                  <Icon icon="mdi:close" width="20" class="me-1" />
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting || !isFormValid"
                  aria-label="Guardar producto"
                >
                  <Icon v-if="submitting" icon="mdi:loading" width="20" class="spinner me-1" />
                  <Icon v-else icon="mdi:content-save" width="20" class="me-1" />
                  {{ submitting ? "Guardando..." : "Guardar" }}
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
import axios from "axios";
import { obtainToken } from "../../../utils/obtain-token.js";
import { toast } from "../../../utils/toast.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND + "pos",
});

export default {
  name: "ProductoForm",
  data() {
    return {
      isEditMode: false,
      loadingData: false,
      loadingUnidades: false,
      loadingCategorias: false,
      selectedImageFile: null,
      imagePreview: null,
      submitting: false,
      unidadesMedida: [],
      categorias: [],
      producto: {},
      formData: {
        um_venta: "",
        cat_codigo: null,
        prd_nombre: "",
        prd_desc_corta: "",
        prd_desc_larga: "",
        prd_precio_venta: 0,
        prd_stock: 0,
        prd_prioridad: "",
        prd_img: null,
      },
      errors: {},
    };
  },
  computed: {
    isFormValid() {
      return (
        this.formData.um_venta &&
        this.formData.prd_nombre.trim() &&
        this.formData.prd_desc_corta.trim() &&
        this.formData.prd_desc_larga.trim() &&
        typeof this.formData.prd_precio_venta === "number" &&
        this.formData.prd_precio_venta >= 0 &&
        Number.isInteger(this.formData.prd_stock) &&
        this.formData.prd_stock >= 0 &&
        this.formData.prd_prioridad
      );
    },
  },
  async mounted() {
    await Promise.all([this.loadUnidadesMedida(), this.loadCategorias()]);

    const codigo = this.$route.params.id;
    if (codigo) {
      this.isEditMode = true;
      await this.loadProducto(codigo);
    }
  },
  methods: {
    async loadUnidadesMedida() {
      this.loadingUnidades = true;
      try {
        const token = obtainToken();
        const { data } = await api.get("/unidadmedida", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.unidadesMedida = data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al cargar unidades de medida");
      } finally {
        this.loadingUnidades = false;
      }
    },

    async loadCategorias() {
      this.loadingCategorias = true;
      try {
        const token = obtainToken();
        // Si tu endpoint de categoría es /categoria (según app.js)
        const { data } = await api.get("/categoria", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.categorias = Array.isArray(data?.data) ? data.data : data; // por si viene paginado o lista directa
      } catch (err) {
        // Si en tu proyecto aún no está listo /categoria en frontend, no bloqueamos el form.
        this.categorias = [];
      } finally {
        this.loadingCategorias = false;
      }
    },

    onFileChange(e) {
    const file = e.target.files?.[0] || null;

    if (!file) {
        this.clearImage();
        return;
    }

    // Validación simple: tamaño (ej. 2MB) y tipo
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith("image/")) {
        this.errors.prd_img = "El archivo debe ser una imagen";
        this.clearImage(false); // no limpiar errors aquí si quieres
        return;
    }
    if (file.size > maxBytes) {
        this.errors.prd_img = "La imagen no puede superar 2MB";
        this.clearImage(false);
        return;
    }

    this.errors.prd_img = null;
    this.selectedImageFile = file;

    // Preview
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
    this.imagePreview = URL.createObjectURL(file);
    },

    clearImage(clearErrors = true) {
    this.selectedImageFile = null;
    if (this.imagePreview) {
        URL.revokeObjectURL(this.imagePreview);
    }
    this.imagePreview = null;

    if (clearErrors) {
        delete this.errors.prd_img;
    }

    // si tienes acceso al input, podrías resetearlo con ref
    },
    async loadProducto(codigo) {
      this.loadingData = true;
      try {
        const token = obtainToken();
        const { data } = await api.get(`/producto/${codigo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.producto = data;

        this.formData = {
          um_venta: data.um_venta?.trim?.() || data.um_venta || "",
          cat_codigo: data.cat_codigo ? (data.cat_codigo.trim?.() || data.cat_codigo) : null,
          prd_nombre: data.prd_nombre?.trim?.() || data.prd_nombre || "",
          prd_desc_corta: data.prd_desc_corta?.trim?.() || data.prd_desc_corta || "",
          prd_desc_larga: data.prd_desc_larga?.trim?.() || data.prd_desc_larga || "",
          prd_precio_venta: Number(data.prd_precio_venta ?? 0),
          prd_stock: Number.isInteger(data.prd_stock) ? data.prd_stock : parseInt(data.prd_stock ?? 0, 10),
          prd_prioridad: data.prd_prioridad || "",
          prd_img: data.prd_img ? (data.prd_img.trim?.() || data.prd_img) : null,
        };
      } catch (err) {
        toast.error(err.response?.data?.message || "Error al cargar el producto");
        this.goBack();
      } finally {
        this.loadingData = false;
      }
    },

    validateForm() {
      this.errors = {};

      // um_venta
      if (!this.formData.um_venta) {
        this.errors.um_venta = "La unidad de venta es requerida";
      }

      // cat_codigo opcional
      if (this.formData.cat_codigo !== null && this.formData.cat_codigo !== undefined) {
        if (typeof this.formData.cat_codigo !== "string" || this.formData.cat_codigo.length > 10) {
          this.errors.cat_codigo = "cat_codigo máximo 10 caracteres (o null)";
        }
      }

      // nombre
      if (!this.formData.prd_nombre.trim()) {
        this.errors.prd_nombre = "El nombre es requerido";
      } else if (this.formData.prd_nombre.trim().length > 60) {
        this.errors.prd_nombre = "El nombre no puede superar 60 caracteres";
      }

      // desc corta
      if (!this.formData.prd_desc_corta.trim()) {
        this.errors.prd_desc_corta = "La descripción corta es requerida";
      } else if (this.formData.prd_desc_corta.trim().length > 60) {
        this.errors.prd_desc_corta = "Máximo 60 caracteres";
      }

      // desc larga
      if (!this.formData.prd_desc_larga.trim()) {
        this.errors.prd_desc_larga = "La descripción larga es requerida";
      } else if (this.formData.prd_desc_larga.trim().length > 255) {
        this.errors.prd_desc_larga = "Máximo 255 caracteres";
      }

      // precio
      if (typeof this.formData.prd_precio_venta !== "number" || Number.isNaN(this.formData.prd_precio_venta)) {
        this.errors.prd_precio_venta = "El precio debe ser numérico";
      } else if (this.formData.prd_precio_venta < 0) {
        this.errors.prd_precio_venta = "El precio debe ser mayor o igual a 0";
      }

      // stock
      if (this.formData.prd_stock < 0) {
        this.errors.prd_stock = "El stock debe ser mayor o igual a 0";
      }

      // prioridad
      if (!["L", "F"].includes(this.formData.prd_prioridad)) {
        this.errors.prd_prioridad = "La prioridad solo puede ser L o F";
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        toast.warning("Por favor, corrija los errores en el formulario");
        return;
      }

      this.submitting = true;

      try {
        const token = obtainToken();

        const formData = new FormData();

        formData.append("um_venta", this.formData.um_venta);
        formData.append("cat_codigo", this.formData.cat_codigo ?? "");
        formData.append("prd_nombre", this.formData.prd_nombre);
        formData.append("prd_desc_corta", this.formData.prd_desc_corta);
        formData.append("prd_desc_larga", this.formData.prd_desc_larga);
        formData.append("prd_precio_venta", this.formData.prd_precio_venta);
        formData.append("prd_stock", this.formData.prd_stock);
        formData.append("prd_prioridad", this.formData.prd_prioridad);

        if (this.selectedImageFile) {
          formData.append("prd_img", this.selectedImageFile);
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (this.isEditMode) {
          await api.put(
            `/producto/${this.producto.prd_codigo}`,
            formData,
            config
          );
          toast.success("Producto actualizado correctamente");
        } else {
          await api.post("/producto", formData, config);
          toast.success("Producto creado correctamente");
        }

        this.$router.push("/admin/producto");
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Error al guardar el producto";

        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach((e) => toast.error(e));
        } else {
          toast.error(errorMsg);
        }
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      this.$router.push("/admin/producto");
    },
  },
};
</script>

<style src="../../../assets/css/form.css" />
<style src="../../../assets/css/admin/crud-form.css"></style>
