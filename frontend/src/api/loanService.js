import api from "./axiosConfig";

/**
 * Loan service for handling loan-related operations
 */
const loanService = {
  /**
   * Apply for a new loan
   * @param {Object} loanData - Loan application data
   * @returns {Promise} - Response with loan application details
   */
  applyForLoan: async (loanData) => {
    const response = await api.post("/loans", loanData);
    return response.data;
  },

  /**
   * Get loan status by ID
   * @param {string} loanId - Loan ID
   * @returns {Promise} - Response with loan status
   */
  getLoanStatus: async (loanId) => {
    const response = await api.get(`/loans/${loanId}/status`);
    return response.data;
  },

  /**
   * Get all loans for current user
   * @returns {Promise} - Response with user's loans
   */
  getUserLoans: async () => {
    const response = await api.get("/loans/user");
    return response.data;
  },

  /**
   * Get loan types and their details
   * @returns {Promise} - Response with loan types
   */
  getLoanTypes: async () => {
    const response = await api.get("/loans/types");
    return response.data;
  },

  /**
   * Calculate loan payments
   * @param {Object} calculationData - Loan calculation parameters
   * @returns {Promise} - Response with payment calculations
   */
  calculateLoan: async (calculationData) => {
    const response = await api.post("/loans/calculate", calculationData);
    return response.data;
  },
};

export default loanService;
