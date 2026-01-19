import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND + 'ecom/producto';

const api = axios.create({
  baseURL
});

/**
 * Obtener todos los productos públicos con filtros
 * @param {Object} filters - { q, minPrice, maxPrice, cat, page }
 * @returns {Promise} - Lista de productos y paginación
 */
const getAll = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.q) params.append('q', filters.q);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.cat) params.append('cat', filters.cat);
  if (filters.page) params.append('page', filters.page);

  const { data } = await api.get(`/?${params.toString()}`);
  return data;
};

/**
 * Obtener detalle de un producto por ID
 * @param {string} id - ID del producto
 * @returns {Promise} - Datos del producto
 */
const getById = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export default {
  getAll,
  getById
};
