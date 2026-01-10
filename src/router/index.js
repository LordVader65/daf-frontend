import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Contacto from '../views/Contacto.vue'

// RUTAS ADMIN
import AdminLogin from '../views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

<<<<<<< HEAD
=======
// RUTAS CRUD
import MateriaPrimaView from '@/views/admin/MateriaPrima/MateriaPrimaView.vue'
import MateriaPrimaForm from '@/views/admin/MateriaPrima/MateriaPrimaForm.vue'

>>>>>>> 05c91180713e35fab725d2bc32f6c2da45f0cede
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
<<<<<<< HEAD
=======
  /* Rutas de Administrador */
>>>>>>> 05c91180713e35fab725d2bc32f6c2da45f0cede
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
<<<<<<< HEAD
=======
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
>>>>>>> 05c91180713e35fab725d2bc32f6c2da45f0cede
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
