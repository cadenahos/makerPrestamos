import React, { useState, useEffect } from "react";
import mockLoanService from "../mock/mockLoanService";
import "./LoanCalculator.css";

const LoanCalculator = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedLoanType, setSelectedLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const types = await mockLoanService.getLoanTypes();
        setLoanTypes(types);
      } catch (error) {
        setError("Failed to load loan types. Please try again later.");
        console.error("Error fetching loan types:", error);
      }
    };
    fetchLoanTypes();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loanType = loanTypes.find((type) => type.id === selectedLoanType);
      if (!loanType) {
        throw new Error("Please select a loan type");
      }

      const payment = await mockLoanService.calculateMonthlyPayment(
        Number(amount),
        Number(term),
        loanType.interestRate
      );
      setMonthlyPayment(payment);
    } catch (err) {
      setError(err.message);
      setMonthlyPayment(null);
    } finally {
      setLoading(false);
    }
  };

  const selectedLoan = loanTypes.find((type) => type.id === selectedLoanType);

  return (
    <div className="loan-calculator">
      <h2>Loan Calculator</h2>
      <form onSubmit={handleCalculate}>
        <div className="form-group">
          <label htmlFor="loanType">Loan Type</label>
          <select
            id="loanType"
            value={selectedLoanType}
            onChange={(e) => setSelectedLoanType(e.target.value)}
            required
          >
            <option value="">Select a loan type</option>
            {loanTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.interestRate}% APR)
              </option>
            ))}
          </select>
        </div>

        {selectedLoan && (
          <div className="loan-details">
            <p>
              Amount Range: ${selectedLoan.minAmount.toLocaleString()} - $
              {selectedLoan.maxAmount.toLocaleString()}
            </p>
            <p>
              Term Range: {selectedLoan.minTerm} - {selectedLoan.maxTerm} months
            </p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="amount">Loan Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={selectedLoan?.minAmount || 0}
            max={selectedLoan?.maxAmount || 1000000}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="term">Loan Term (months)</label>
          <input
            type="number"
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            min={selectedLoan?.minTerm || 1}
            max={selectedLoan?.maxTerm || 360}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate Payment"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {monthlyPayment && (
        <div className="result">
          <h3>Estimated Monthly Payment</h3>
          <p className="payment-amount">${monthlyPayment.toLocaleString()}</p>
          <p className="disclaimer">
            * This is an estimate. Actual payments may vary based on your credit
            score and other factors.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
