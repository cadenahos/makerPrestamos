/**
 * Mock data for loan types
 * This file provides sample loan types for development and testing
 */

const loanTypes = [
  {
    id: "personal",
    name: "Personal Loan",
    description:
      "Flexible loans for personal expenses, education, or debt consolidation.",
    minAmount: 1000,
    maxAmount: 50000,
    minTerm: 12,
    maxTerm: 60,
    interestRate: 8.5,
    requirements: [
      "Valid ID",
      "Proof of income",
      "Bank statements",
      "Credit history",
    ],
  },
  {
    id: "mortgage",
    name: "Mortgage Loan",
    description:
      "Home loans with competitive interest rates and flexible terms.",
    minAmount: 50000,
    maxAmount: 500000,
    minTerm: 120,
    maxTerm: 360,
    interestRate: 5.5,
    requirements: [
      "Valid ID",
      "Proof of income",
      "Property appraisal",
      "Down payment",
      "Credit history",
    ],
  },
  {
    id: "automotive",
    name: "Automotive Loan",
    description: "Loans for new or used vehicles with competitive rates.",
    minAmount: 5000,
    maxAmount: 100000,
    minTerm: 12,
    maxTerm: 84,
    interestRate: 6.5,
    requirements: [
      "Valid ID",
      "Proof of income",
      "Vehicle information",
      "Insurance proof",
      "Credit history",
    ],
  },
  {
    id: "business",
    name: "Business Loan",
    description: "Loans to help start or expand your business.",
    minAmount: 10000,
    maxAmount: 200000,
    minTerm: 12,
    maxTerm: 60,
    interestRate: 7.5,
    requirements: [
      "Valid ID",
      "Business plan",
      "Financial statements",
      "Tax returns",
      "Credit history",
    ],
  },
];

export default loanTypes;
