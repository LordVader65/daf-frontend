import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Contacto from '../views/Contacto.vue'

// RUTAS ADMIN
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

// RUTAS CRUD
import MateriaPrimaView from '@/views/admin/MateriaPrima/MateriaPrimaView.vue'
import MateriaPrimaForm from '@/views/admin/MateriaPrima/MateriaPrimaForm.vue'
import KardexMPView from '@/views/admin/KardexMP/KardexMPView.vue'
import KardexMPForm from '@/views/admin/KardexMP/KardexMPForm.vue'

const routes = [
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
    path: '/contact',
    name: 'Contacto',
    component: Contacto
  },
  /* Rutas de Administrador */
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/materia-prima',
    name: 'MateriaPrima',
    component: MateriaPrimaView
  },
  {
    path: '/admin/materia-prima/form',
    name: 'MateriaPrimaForm',
    component: MateriaPrimaForm
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
