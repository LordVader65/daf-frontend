import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import Contacto from '../views/Contacto.vue'

// RUTAS ADMIN
import AdminLogin from '../views/admin/AdminLogin.vue'

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
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLogin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
