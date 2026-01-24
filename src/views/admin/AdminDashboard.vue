<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'
    import { Icon } from '@iconify/vue'
    import DashboardButton from '@/components/DashboardButton.vue'
    import { obtainToken } from '../../utils/obtain-token.js'
    import { useRouter } from 'vue-router'
    import '@/assets/css/admin/admin-body.css'

    const router = useRouter()
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

    const logout = () => {
      localStorage.removeItem('user')
      router.push('/admin')
    }

    const fetchAccess = async () => {
    try {
        const token = obtainToken()

       const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND}pos/access`,
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

      <div v-if="!loading && !error && enabledModules.length === 0" class="no-access-message text-center py-5">
        <Icon icon="mdi:shield-lock-outline" width="64" class="text-muted mb-3" />
        <h3>Acceso Restringido</h3>
        <p class="text-muted">
          Su usuario no tiene módulos asignados en este momento. 
          <br>
          Por favor, contacte al administrador para verificar sus permisos de base de datos.
        </p>
      </div>

      <div class="row g-4 justify-content-center d-flex mb-5">
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
        <div class="d-flex justify-content-center">
            <button class="btn btn-danger w-50 h-75" @click="logout">Cerrar Sesión</button>
        </div>
    </main>
  </div>
</template>