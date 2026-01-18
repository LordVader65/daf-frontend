import { createRouter, createWebHistory } from 'vue-router'

// ===============================
// RUTAS PÚBLICAS
// ===============================
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Contacto from '../views/Contacto.vue'
import Login from '@/views/Login.vue'

// ===============================
// RUTAS ADMIN
// ===============================
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

// ===============================
// RUTAS CRUD - MATERIA PRIMA
// ===============================
import MateriaPrimaView from '@/views/admin/MateriaPrima/MateriaPrimaView.vue'
import MateriaPrimaForm from '@/views/admin/MateriaPrima/MateriaPrimaForm.vue'
import KardexMPView from '@/views/admin/KardexMP/KardexMPView.vue'
import KardexMPForm from '@/views/admin/KardexMP/KardexMPForm.vue'
import EstandarView from '@/views/admin/Estandar/EstandarView.vue'
import EstandarForm from '@/views/admin/Estandar/EstandarForm.vue'
import PerfilView from '@/views/PerfilView.vue'

// ===============================
// RUTAS CRUD - PROVEEDOR
// ===============================
import ProveedorView from '@/views/admin/Proveedor/ProveedorView.vue'
import ProveedorForm from '@/views/admin/Proveedor/ProveedorForm.vue'

// ===============================
// RUTAS CRUD - PRODUCTO
// ===============================
import ProductoView from '@/views/admin/Producto/ProductoView.vue'
import ProductoForm from '@/views/admin/Producto/ProductoForm.vue'
// RUTAS CRUD - CLIENTE
// ===============================
import ClienteView from '@/views/admin/Cliente/ClienteView.vue'
import ClienteForm from '@/views/admin/Cliente/ClienteForm.vue'


const routes = [
  /* ===============================
     RUTAS PÚBLICAS
     =============================== */
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: Contacto
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    component: PerfilView
  },

  /* Rutas de Administrador */
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },

  /* ===============================
     CRUD MATERIA PRIMA
     =============================== */
  {
    path: '/admin/materia-prima',
    name: 'MateriaPrima',
    component: MateriaPrimaView
  },
  {
    path: '/admin/materia-prima/form/:id?',
    name: 'MateriaPrimaForm',
    component: MateriaPrimaForm
  },
  {
    path: '/admin/kardex/materia-prima',
    name: 'KardexMPView',
    component: KardexMPView
  },
  {
    path: '/admin/kardex/materia-prima/form',
    name: 'KardexMPForm',
    component: KardexMPForm
  },
  {
    path: '/admin/kardex/materia-prima/form/:id?',
    name: 'KardexMPForms',
    component: KardexMPForm
  },
  {
    path: '/admin/estandar',
    name: 'EstandarView',
    component: EstandarView
  },
  {
    path: '/admin/estandar/form',
    name: 'EstandarFormNew',
    component: EstandarForm
  },
  {
    path: '/admin/estandar/form/:id?',
    name: 'EstandarForm',
    component: EstandarForm
  },


  /* ==============================
     CRUD PROVEEDOR
     ============================== */
  {
    path: '/admin/proveedor',
    name: 'Proveedor',
    component: ProveedorView
  },
  {
    path: '/admin/proveedor/form/:id?',
    name: 'ProveedorForm',
    component: ProveedorForm
  },

  /* ===============================
   CRUD PRODUCTO
   =============================== */
  {
    path: '/admin/producto',
    name: 'Producto',
    component: ProductoView
  },
  {
    path: '/admin/producto/form/:id?',
    name: 'ProductoForm',
    component: ProductoForm
  },
  /* ==============================
     CRUD CLIENTE
     ============================== */
  {
    path: '/admin/cliente',
    name: 'Cliente',
    component: ClienteView
  },
  {
    path: '/admin/cliente/form/:id?',
    name: 'ClienteForm',
    component: ClienteForm
  },

]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// ===============================
// GUARD GLOBAL DE AUTENTICACIÓN
// ===============================
import { obtainToken } from '@/utils/obtain-token';

router.beforeEach((to, from, next) => {
  const token = obtainToken();

  const isAdminRoute = to.path.startsWith('/admin');
  const isLoginRoute = to.path === '/admin';

  // 1. Rutas admin requieren token
  if (isAdminRoute && !isLoginRoute && !token) {
    return next('/admin');
  }

  // 2. Si ya está logueado, no mostrar login
  if (isLoginRoute && token) {
    return next('/admin/dashboard');
  }

  next();
});

export default router
