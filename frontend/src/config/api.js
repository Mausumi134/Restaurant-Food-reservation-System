// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  
  // Menu
  MENU: `${API_BASE_URL}/api/v1/menu`,
  MENU_ITEM: (id) => `${API_BASE_URL}/api/v1/menu/${id}`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/v1/orders`,
  MY_ORDERS: `${API_BASE_URL}/api/v1/orders/my-orders`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/api/v1/orders/${id}`,
  ORDER_STATUS: (id) => `${API_BASE_URL}/api/v1/orders/${id}/status`,
  ORDER_CANCEL: (id) => `${API_BASE_URL}/api/v1/orders/${id}/cancel`,
  
  // Reservations
  RESERVATIONS: `${API_BASE_URL}/api/v1/reservation/send`,
  MY_RESERVATIONS: `${API_BASE_URL}/api/v1/reservation/my-reservations`,
  CANCEL_RESERVATION: (id) => `${API_BASE_URL}/api/v1/reservation/${id}/cancel`,
  
  // Tables
  TABLES: `${API_BASE_URL}/api/v1/tables`,
  TABLE_DETAIL: (id) => `${API_BASE_URL}/api/v1/tables/${id}`,
  
  // Delivery Tracking
  DELIVERY_TRACK: (orderId) => `${API_BASE_URL}/api/v1/delivery/track/${orderId}`,
  
  // Restaurants (if needed)
  RESTAURANTS: `${API_BASE_URL}/api/v1/restaurants`,
  RESTAURANT_DETAIL: (id) => `${API_BASE_URL}/api/v1/restaurants/${id}`,
  RESTAURANT_MENU: (id) => `${API_BASE_URL}/api/v1/menu/restaurant/${id}`,
  RESTAURANT_ORDERS: `${API_BASE_URL}/api/v1/orders/restaurant/orders`
};

export default API_BASE_URL;