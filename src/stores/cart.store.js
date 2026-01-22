import { defineStore } from 'pinia'
import { getCart, addToCart, updateItemQuantity, removeCartItem } from '../api/ecom/cart.service'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        cartInfo: {
            crr_subtotal: 0,
            crr_total: 0
        },
        pagination: {
            page: 1,
            limit: 10,
            totalPages: 1
        },
        loading: false,
        error: null,
        updatingItem: null, // Para tracking de items específicos siendo actualizados
        isCartOpen: false // Estado para el Drawer lateral
    }),

    getters: {
        totalItems: (state) => state.items.reduce((acc, item) => acc + (Number(item.pxca_cantidad) || 0), 0),
        isEmpty: (state) => state.items.length === 0
    },

    actions: {
        toggleCart() {
            this.isCartOpen = !this.isCartOpen
        },

        openCart() {
            this.isCartOpen = true
        },

        closeCart() {
            this.isCartOpen = false
        },

        async fetchCart(page = 1) {
            this.loading = true
            this.error = null
            try {
                // getCart ya soporta query params? Revisar cart.service.js
                // Asumiremos que getCart acepta config o params
                // Ajustamos cart.service.js si es necesario
                const { data } = await getCart(page)

                // Mapping para asegurar números y nombres de propiedades correctos
                const rawItems = data.detalles || []
                this.items = rawItems.map(item => ({
                    ...item,
                    // El backend devuelve alias "cantidad" y "subtotal"
                    pxca_cantidad: Number(item.cantidad || item.pxca_cantidad),
                    pxca_subtotal: Number(item.subtotal || item.pxca_subtotal),
                    prd_precio_venta: Number(item.prd_precio_venta)
                }))

                this.cartInfo = {
                    crr_subtotal: Number(data.carrito?.subtotal || data.carrito?.crr_subtotal || 0),
                    crr_total: Number(data.carrito?.total || data.carrito?.crr_total || 0),
                    ...data.carrito
                }

                this.pagination = {
                    page: Number(data.page),
                    limit: Number(data.limit),
                    totalPages: Number(data.totalPages)
                }
            } catch (err) {
                console.error('Error fetching cart:', err)
                this.error = 'No se pudo cargar el carrito'
            } finally {
                this.loading = false
            }
        },

        async addItem(prd_codigo, cantidad) {
            this.loading = true;
            this.error = null;
            try {
                await addToCart(prd_codigo, cantidad);
                await this.fetchCart(); // Recargar para tener totales actualizados del backend
            } catch (err) {
                console.error('Error adding item:', err);
                this.error = 'No se pudo agregar el producto';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateQuantity(prd_codigo, cantidad) {
            // Sanitización extra
            const qty = parseInt(cantidad);
            if (isNaN(qty) || qty < 1) return;

            // No seteamos loading global para no bloquear toda la UI, solo indicamos item
            this.updatingItem = prd_codigo
            try {
                await updateItemQuantity(prd_codigo, qty)
                await this.fetchCart() // Recargar para tener el crr_total real
            } catch (err) {
                console.error('Error updating quantity:', err)
                this.error = 'No se pudo actualizar la cantidad'
            } finally {
                this.updatingItem = null
            }
        },

        async removeItem(prd_codigo) {
            this.loading = true
            try {
                await removeCartItem(prd_codigo)
                await this.fetchCart()
            } catch (err) {
                console.error('Error removing item:', err)
                this.error = 'No se pudo eliminar el producto'
            } finally {
                this.loading = false
            }
        }
    }
})
