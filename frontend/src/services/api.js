import axios from 'axios';

// Base URLs for microservices
const USER_SERVICE_URL = 'http://localhost:8081/api';
const TABLE_SERVICE_URL = 'http://localhost:8082/api';
const MENU_SERVICE_URL = 'http://localhost:8083/api';
const FEEDBACK_SERVICE_URL = 'http://localhost:8084/api';

// Chef API
export const chefAPI = {
  getAllChefs: () => axios.get(`${USER_SERVICE_URL}/chefs`),
  getActiveChefs: () => axios.get(`${USER_SERVICE_URL}/chefs/active`),
  getChefById: (id) => axios.get(`${USER_SERVICE_URL}/chefs/${id}`),
  createChef: (chef) => axios.post(`${USER_SERVICE_URL}/chefs`, chef),
  updateChef: (id, chef) => axios.put(`${USER_SERVICE_URL}/chefs/${id}`, chef),
  deleteChef: (id) => axios.delete(`${USER_SERVICE_URL}/chefs/${id}`),
  reactivateChef: (id) => axios.put(`${USER_SERVICE_URL}/chefs/${id}/reactivate`)
};

// Table API
export const tableAPI = {
  getAllTables: () => axios.get(`${TABLE_SERVICE_URL}/tables`),
  getAvailableTables: () => axios.get(`${TABLE_SERVICE_URL}/tables/available`),
  getAvailableTablesByCapacity: (capacity) => axios.get(`${TABLE_SERVICE_URL}/tables/available/${capacity}`),
  createTable: (table) => axios.post(`${TABLE_SERVICE_URL}/tables`, table),
  updateTableStatus: (id, status) => axios.put(`${TABLE_SERVICE_URL}/tables/${id}/status?status=${status}`),
  
  // Booking API
  createBooking: (booking) => axios.post(`${TABLE_SERVICE_URL}/tables/book`, booking),
  getAllBookings: () => axios.get(`${TABLE_SERVICE_URL}/tables/bookings`),
  getWaitingBookings: () => axios.get(`${TABLE_SERVICE_URL}/tables/bookings/waiting`),
  seatCustomer: (bookingId, tableId) => axios.put(`${TABLE_SERVICE_URL}/tables/bookings/${bookingId}/seat/${tableId}`),
  completeBooking: (id) => axios.put(`${TABLE_SERVICE_URL}/tables/bookings/${id}/complete`),
  cancelBooking: (id) => axios.delete(`${TABLE_SERVICE_URL}/tables/bookings/${id}`),
  
  // Waiting time API
  getWaitingTimeInfo: () => axios.get(`${TABLE_SERVICE_URL}/tables/waiting-time`),
  getEstimatedWaitTime: (partySize) => axios.get(`${TABLE_SERVICE_URL}/tables/waiting-time/${partySize}`)
};

// Menu API
export const menuAPI = {
  getAllMenuItems: () => axios.get(`${MENU_SERVICE_URL}/menu`),
  getAvailableMenuItems: () => axios.get(`${MENU_SERVICE_URL}/menu/available`),
  getMenuItemsByCategory: (category) => axios.get(`${MENU_SERVICE_URL}/menu/category/${category}`),
  getMenuItemById: (id) => axios.get(`${MENU_SERVICE_URL}/menu/${id}`),
  searchMenuItems: (keyword) => axios.get(`${MENU_SERVICE_URL}/menu/search?keyword=${keyword}`),
  getFilteredMenuItems: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return axios.get(`${MENU_SERVICE_URL}/menu/filter?${params}`);
  },
  createMenuItem: (menuItem) => axios.post(`${MENU_SERVICE_URL}/menu`, menuItem),
  updateMenuItem: (id, menuItem) => axios.put(`${MENU_SERVICE_URL}/menu/${id}`, menuItem),
  deleteMenuItem: (id) => axios.delete(`${MENU_SERVICE_URL}/menu/${id}`),
  toggleAvailability: (id) => axios.put(`${MENU_SERVICE_URL}/menu/${id}/toggle-availability`)
};

// Feedback API
export const feedbackAPI = {
  getAllFeedback: () => axios.get(`${FEEDBACK_SERVICE_URL}/feedback`),
  getFeedbackByType: (type) => axios.get(`${FEEDBACK_SERVICE_URL}/feedback/type/${type}`),
  getPositiveFeedback: () => axios.get(`${FEEDBACK_SERVICE_URL}/feedback/positive`),
  getRecentFeedback: (days) => axios.get(`${FEEDBACK_SERVICE_URL}/feedback/recent/${days}`),
  createFeedback: (feedback) => axios.post(`${FEEDBACK_SERVICE_URL}/feedback`, feedback),
  deleteFeedback: (id) => axios.delete(`${FEEDBACK_SERVICE_URL}/feedback/${id}`),
  
  // Analytics API
  getFeedbackAnalytics: () => axios.get(`${FEEDBACK_SERVICE_URL}/feedback/analytics`),
  getFeedbackCountByType: () => axios.get(`${FEEDBACK_SERVICE_URL}/feedback/analytics/by-type`),
  getFeedbackCountByRating: () => axios.get(`${FEEDBACK_SERVICE_URL}/feedback/analytics/by-rating`)
};

// Error handling interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
