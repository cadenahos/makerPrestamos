import loanTypes from "./loanTypes";

/**
 * Mock loan service for development and testing
 * This service simulates API calls to the backend
 */

// Helper function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to calculate loan payments
const calculateLoanPayments = (amount, term, interestRate) => {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
    (Math.pow(1 + monthlyRate, term) - 1);
  const totalAmount = monthlyPayment * term;
  const totalInterest = totalAmount - amount;

  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    interestRate: interestRate,
  };
};

// Mock loan service
const mockLoanService = {
  /**
   * Get all loan types
   * @returns {Promise} - Response with loan types
   */
  getLoanTypes: async () => {
    await delay(500); // Simulate network delay
    return loanTypes;
  },

  /**
   * Get a specific loan type by ID
   * @param {number} id - Loan type ID
   * @returns {Promise} - Response with loan type
   */
  getLoanTypeById: async (id) => {
    await delay(300);
    const loanType = loanTypes.find((loan) => loan.id === id);
    if (!loanType) {
      throw new Error("Loan type not found");
    }
    return loanType;
  },

  /**
   * Calculate monthly payment
   * @param {number} amount - Loan amount
   * @param {number} term - Loan term in months
   * @param {number} interestRate - Loan interest rate
   * @returns {Promise} - Response with monthly payment
   */
  calculateMonthlyPayment: async (amount, term, interestRate) => {
    await delay(200);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return Math.round(monthlyPayment * 100) / 100;
  },

  /**
   * Submit a loan application
   * @param {Object} applicationData - Loan application data
   * @returns {Promise} - Response with loan application details
   */
  submitLoanApplication: async (applicationData) => {
    await delay(1000);
    // Simulate validation
    if (
      !applicationData.loanTypeId ||
      !applicationData.amount ||
      !applicationData.term
    ) {
      throw new Error("Missing required fields");
    }

    const loanType = loanTypes.find(
      (loan) => loan.id === applicationData.loanTypeId
    );
    if (!loanType) {
      throw new Error("Invalid loan type");
    }

    if (
      applicationData.amount < loanType.minAmount ||
      applicationData.amount > loanType.maxAmount
    ) {
      throw new Error("Amount is outside the allowed range");
    }

    if (
      applicationData.term < loanType.minTerm ||
      applicationData.term > loanType.maxTerm
    ) {
      throw new Error("Term is outside the allowed range");
    }

    // Simulate successful application
    return {
      applicationId: `APP-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
      ...applicationData,
    };
  },

  /**
   * Get application status
   * @param {string} applicationId - Loan application ID
   * @returns {Promise} - Response with application status
   */
  getApplicationStatus: async (applicationId) => {
    await delay(500);
    // Simulate random status for demo purposes
    const statuses = ["pending", "approved", "rejected"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      applicationId,
      status: randomStatus,
      lastUpdated: new Date().toISOString(),
    };
  },

  /**
   * Calculate loan payments
   * @param {Object} calculationData - Loan calculation parameters
   * @returns {Promise} - Response with payment calculations
   */
  calculateLoan: async (calculationData) => {
    await delay(500);

    const { loanType, amount, term } = calculationData;
    const selectedLoanType = loanTypes.find(
      (type) => type.id === parseInt(loanType)
    );

    if (!selectedLoanType) {
      throw new Error("Tipo de préstamo no encontrado");
    }

    return calculateLoanPayments(
      parseFloat(amount),
      parseInt(term),
      selectedLoanType.interestRate
    );
  },

  /**
   * Apply for a loan
   * @param {Object} loanData - Loan application data
   * @returns {Promise} - Response with loan application details
   */
  applyForLoan: async (loanData) => {
    await delay(1200);

    // Simulate validation
    if (!loanData.loanType || !loanData.amount || !loanData.term) {
      throw new Error("Faltan datos requeridos para la solicitud");
    }

    const selectedLoanType = loanTypes.find(
      (type) => type.id === parseInt(loanData.loanType)
    );

    if (!selectedLoanType) {
      throw new Error("Tipo de préstamo no válido");
    }

    // Generate a random loan ID
    const loanId = Math.floor(Math.random() * 10000) + 1000;

    // Calculate loan details
    const calculations = calculateLoanPayments(
      parseFloat(loanData.amount),
      parseInt(loanData.term),
      selectedLoanType.interestRate
    );

    return {
      id: loanId,
      userId: loanData.userId,
      type: selectedLoanType.name,
      amount: parseFloat(loanData.amount),
      term: parseInt(loanData.term),
      purpose: loanData.purpose,
      employmentStatus: loanData.employmentStatus,
      monthlyIncome: parseFloat(loanData.monthlyIncome),
      otherDebts: parseFloat(loanData.otherDebts),
      status: "pending",
      applicationDate: new Date().toISOString(),
      monthlyPayment: calculations.monthlyPayment,
      totalAmount: calculations.totalAmount,
      interestRate: selectedLoanType.interestRate,
    };
  },

  /**
   * Get loan status by ID
   * @param {string} loanId - Loan ID
   * @returns {Promise} - Response with loan status
   */
  getLoanStatus: async (loanId) => {
    await delay(600);

    // In a real app, this would fetch from the backend
    // For mock purposes, we'll return a random status
    const statuses = ["pending", "approved", "rejected"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: loanId,
      status: randomStatus,
      lastUpdated: new Date().toISOString(),
    };
  },

  /**
   * Get all loans for current user
   * @returns {Promise} - Response with user's loans
   */
  getUserLoans: async () => {
    await delay(1000);

    // Generate 0-3 random loans for the user
    const numLoans = Math.floor(Math.random() * 4);
    const loans = [];

    for (let i = 0; i < numLoans; i++) {
      const randomLoanType =
        loanTypes[Math.floor(Math.random() * loanTypes.length)];
      const randomAmount =
        Math.floor(
          Math.random() *
            (randomLoanType.maxAmount - randomLoanType.minAmount + 1)
        ) + randomLoanType.minAmount;
      const randomTerm =
        Math.floor(
          Math.random() * (randomLoanType.maxTerm - randomLoanType.minTerm + 1)
        ) + randomLoanType.minTerm;

      const calculations = calculateLoanPayments(
        randomAmount,
        randomTerm,
        randomLoanType.interestRate
      );

      const statuses = ["pending", "approved", "rejected"];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      // Generate a random date within the last 3 months
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

      // Generate a random next payment date (only for approved loans)
      let nextPaymentDate = null;
      if (randomStatus === "approved") {
        nextPaymentDate = new Date();
        nextPaymentDate.setDate(
          nextPaymentDate.getDate() + Math.floor(Math.random() * 30) + 1
        );
      }

      loans.push({
        id: Math.floor(Math.random() * 10000) + 1000,
        type: randomLoanType.name,
        amount: randomAmount,
        term: randomTerm,
        status: randomStatus,
        applicationDate: randomDate.toISOString(),
        monthlyPayment: calculations.monthlyPayment,
        nextPaymentDate: nextPaymentDate ? nextPaymentDate.toISOString() : null,
      });
    }

    return loans;
  },

  /**
   * Get all loans (admin only)
   * @returns {Promise} - Response with all loans
   */
  getAllLoans: async () => {
    await delay(1200);

    // Generate 5-15 random loans
    const numLoans = Math.floor(Math.random() * 11) + 5;
    const loans = [];

    const userNames = [
      "Juan Pérez",
      "María García",
      "Carlos López",
      "Ana Martínez",
      "Roberto Sánchez",
      "Laura Rodríguez",
      "Miguel Torres",
      "Sofía Flores",
      "José Ramírez",
      "Carmen Ortiz",
      "David Vargas",
      "Elena Castro",
    ];

    for (let i = 0; i < numLoans; i++) {
      const randomLoanType =
        loanTypes[Math.floor(Math.random() * loanTypes.length)];
      const randomAmount =
        Math.floor(
          Math.random() *
            (randomLoanType.maxAmount - randomLoanType.minAmount + 1)
        ) + randomLoanType.minAmount;
      const randomTerm =
        Math.floor(
          Math.random() * (randomLoanType.maxTerm - randomLoanType.minTerm + 1)
        ) + randomLoanType.minTerm;

      const statuses = ["pending", "approved", "rejected"];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      // Generate a random date within the last 6 months
      const randomDate = new Date();
      randomDate.setDate(
        randomDate.getDate() - Math.floor(Math.random() * 180)
      );

      loans.push({
        id: Math.floor(Math.random() * 10000) + 1000,
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        type: randomLoanType.name,
        amount: randomAmount,
        term: randomTerm,
        status: randomStatus,
        applicationDate: randomDate.toISOString(),
        monthlyIncome: Math.floor(Math.random() * 10000) + 2000,
        otherDebts: Math.floor(Math.random() * 2000),
        purpose:
          "Financiamiento para " +
          [
            "viaje",
            "educación",
            "emergencia",
            "mejoras en el hogar",
            "negocio",
          ][Math.floor(Math.random() * 5)],
      });
    }

    return loans;
  },

  /**
   * Update loan status (admin only)
   * @param {string} loanId - Loan ID
   * @param {string} status - New status
   * @returns {Promise} - Response with updated loan
   */
  updateLoanStatus: async (loanId, status) => {
    await delay(800);

    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new Error("Estado no válido");
    }

    return {
      id: loanId,
      status: status,
      lastUpdated: new Date().toISOString(),
    };
  },

  /**
   * Get dashboard statistics (admin only)
   * @returns {Promise} - Response with dashboard stats
   */
  getDashboardStats: async () => {
    await delay(1000);

    // Generate random stats
    const pendingLoans = Math.floor(Math.random() * 20) + 5;
    const approvedLoans = Math.floor(Math.random() * 30) + 10;
    const rejectedLoans = Math.floor(Math.random() * 15) + 3;
    const totalLoans = pendingLoans + approvedLoans + rejectedLoans;

    // Calculate total loan amount (sum of all approved loans)
    let totalLoanAmount = 0;
    for (let i = 0; i < approvedLoans; i++) {
      const randomLoanType =
        loanTypes[Math.floor(Math.random() * loanTypes.length)];
      const randomAmount =
        Math.floor(
          Math.random() *
            (randomLoanType.maxAmount - randomLoanType.minAmount + 1)
        ) + randomLoanType.minAmount;
      totalLoanAmount += randomAmount;
    }

    // Calculate approval rate
    const approvalRate = Math.round((approvedLoans / totalLoans) * 100);

    return {
      pendingLoans,
      approvedLoans,
      rejectedLoans,
      totalLoans,
      totalLoanAmount,
      approvalRate,
    };
  },
};

export default mockLoanService;
