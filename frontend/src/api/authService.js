import api from "./axiosConfig";

/**
 * Authentication service for handling user authentication
 */
const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} - Response with user data and token
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise} - Response with success message
   */
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise} - Response with user data
   */
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Logout user (clear local storage)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
