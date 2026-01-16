<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import DashboardButton from '@/components/DashboardButton.vue'
    import { obtainToken } from '../../utils/obtain-token.js'

    import '@/assets/css/admin/admin-body.css'

    const loading = ref(true)
    const error = ref(null)
    const enabledModules = ref([])

    const modulesMap = {
    PRODUCTO: [
        { label: 'PRODUCTO', route: '/admin/producto', icon_name: 'fluent-emoji-high-contrast:bouquet' }
    ],
    MATERIA_PRIMA: [
        { label: 'MATERIA PRIMA', route: '/admin/materia-prima', icon_name: 'bi:boxes' }
    ],
    CLIENTE: [
        { label: 'CLIENTE', route: '/admin/cliente', icon_name: 'mdi:account' }
    ],
    PROVEEDOR: [
        { label: 'PROVEEDOR', route: '/admin/proveedor', icon_name: 'streamline-ultimate:warehouse-cart-packages-2' }
    ],
    ESTANDAR: [
        { label: 'ESTÁNDAR', route: '/admin/estandar', icon_name: 'material-symbols-light:build' }
    ],
    FACTURA: [
        { label: 'FACTURA', route: '/admin/factura', icon_name: 'mdi:invoice-list-outline' }
    ],
    ORDENCOMPRA: [
        { label: 'ORDEN DE COMPRA', route: '/admin/orden-compra', icon_name: 'mdi:cart' }
    ],
    BODEGA: [
        { label: 'KARDEX PRODUCTO', route: '/admin/kardex/producto', icon_name: 'mdi:package-variant' },
        { label: 'KARDEX MATERIA PRIMA', route: '/admin/kardex/materia-prima', icon_name: 'mdi:package-variant' }
    ]
    }

    const fetchAccess = async () => {
    try {
        const token = obtainToken()

       const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/pos/access`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
    );

        enabledModules.value = Object.entries(data.access)
        .filter(([_, value]) => value)
        .flatMap(([key]) => modulesMap[key] || [])

    } catch (err) {
        error.value = 'No se pudo cargar el dashboard: ' + err.message
        console.log(err)
    } finally {
        loading.value = false
    }
    }

    onMounted(fetchAccess)
</script>

<template>
  <div class="dashboard-layout">

    <main class="dashboard-content container py-4">
      <h2 class="text-center mb-4 text-primary-custom">
        Dashboard
      </h2>

      <div v-if="loading" class="text-center">
        Cargando...
      </div>

      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <div class="row g-4 justify-content-center">
        <div
            v-for="module in enabledModules"
            :key="module.route"
            class="col-12 col-md-6 col-lg-3">
            <DashboardButton
                :label="module.label"
                :route="module.route"
                :icon_name="module.icon_name">
        </DashboardButton>
        </div>
      </div>
    </main>
  </div>
</template>