import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loanService } from "../../api";
import "./Loans.css";

// Custom loan types
const customLoanTypes = [
  {
    id: "car",
    name: "Préstamo para Carro",
    description:
      "Préstamos especializados para la compra de vehículos nuevos o usados con tasas competitivas.",
    minAmount: 3000,
    maxAmount: 80000,
    minTerm: 12,
    maxTerm: 72,
    interestRate: 5.8,
    requirements: [
      "Documento de identidad válido",
      "Comprobante de ingresos",
      "Información del vehículo",
      "Prueba de seguro",
      "Historial crediticio",
      "Cotización del vehículo",
    ],
  },
  {
    id: "vivienda",
    name: "Préstamo para Vivienda",
    description:
      "Préstamos hipotecarios con tasas de interés preferenciales para la compra, construcción o remodelación de vivienda.",
    minAmount: 30000,
    maxAmount: 300000,
    minTerm: 60,
    maxTerm: 360,
    interestRate: 4.8,
    requirements: [
      "Documento de identidad válido",
      "Comprobante de ingresos",
      "Avalúo de la propiedad",
      "Enganche",
      "Historial crediticio",
      "Documentos de la propiedad",
      "Certificado de libertad de gravamen",
    ],
  },
  {
    id: "estudio",
    name: "Préstamo para Estudios",
    description:
      "Préstamos educativos con condiciones especiales para estudiantes, con períodos de gracia y tasas preferenciales.",
    minAmount: 2000,
    maxAmount: 40000,
    minTerm: 24,
    maxTerm: 120,
    interestRate: 6.2,
    requirements: [
      "Documento de identidad válido",
      "Comprobante de ingresos",
      "Carta de aceptación de la institución educativa",
      "Historial académico",
      "Aval (si aplica)",
      "Presupuesto detallado de costos educativos",
    ],
  },
];

const LoanApplication = ({ user }) => {
  const navigate = useNavigate();
  const [loanTypes, setLoanTypes] = useState([]);
  const [calculations, setCalculations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState(null);

  const [formData, setFormData] = useState({
    loanType: "",
    amount: "",
    term: "",
    purpose: "",
    employmentStatus: "",
    monthlyIncome: "",
    otherDebts: "",
  });

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const types = await loanService.getLoanTypes();
        // Combine API loan types with custom loan types
        setLoanTypes([...types, ...customLoanTypes]);
      } catch (error) {
        console.error("Error fetching loan types:", error);
        setError("No se pudieron cargar los tipos de préstamos");
        // If API fails, use only custom loan types
        setLoanTypes(customLoanTypes);
      }
    };

    fetchLoanTypes();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update selected loan type when loan type changes
    if (name === "loanType") {
      const selected = loanTypes.find((type) => type.id === value);
      setSelectedLoanType(selected);
    }

    // Calculate loan payments when amount or term changes
    if ((name === "amount" || name === "term") && formData.loanType) {
      try {
        const calculationData = {
          loanType: formData.loanType,
          amount: name === "amount" ? value : formData.amount,
          term: name === "term" ? value : formData.term,
        };

        if (calculationData.amount && calculationData.term) {
          const result = await loanService.calculateLoan(calculationData);
          setCalculations(result);
        }
      } catch (error) {
        console.error("Error calculating loan:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loanService.applyForLoan({
        ...formData,
        userId: user.id,
      });

      navigate("/status");
    } catch (error) {
      console.error("Error submitting loan application:", error);
      setError(
        error.response?.data?.message ||
          "Error al enviar la solicitud. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loan-application">
      <h2>Solicitud de Préstamo</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loanType">Tipo de Préstamo</label>
          <select
            id="loanType"
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            {loanTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {selectedLoanType && (
          <div className="loan-type-details">
            <h3>{selectedLoanType.name}</h3>
            <p>{selectedLoanType.description}</p>
            <div className="loan-type-info">
              <div className="info-item">
                <span className="info-label">Monto mínimo:</span>
                <span className="info-value">
                  ${selectedLoanType.minAmount.toLocaleString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Monto máximo:</span>
                <span className="info-value">
                  ${selectedLoanType.maxAmount.toLocaleString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Plazo mínimo:</span>
                <span className="info-value">
                  {selectedLoanType.minTerm} meses
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Plazo máximo:</span>
                <span className="info-value">
                  {selectedLoanType.maxTerm} meses
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Tasa de interés:</span>
                <span className="info-value">
                  {selectedLoanType.interestRate}%
                </span>
              </div>
            </div>
            <div className="requirements-section">
              <h4>Requisitos:</h4>
              <ul>
                {selectedLoanType.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="amount">Monto del Préstamo</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min={selectedLoanType ? selectedLoanType.minAmount : "1000"}
            max={selectedLoanType ? selectedLoanType.maxAmount : "1000000"}
            required
          />
          {selectedLoanType && (
            <small className="form-hint">
              Monto entre ${selectedLoanType.minAmount.toLocaleString()} y $
              {selectedLoanType.maxAmount.toLocaleString()}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="term">Plazo (meses)</label>
          <input
            type="number"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleChange}
            min={selectedLoanType ? selectedLoanType.minTerm : "6"}
            max={selectedLoanType ? selectedLoanType.maxTerm : "60"}
            required
          />
          {selectedLoanType && (
            <small className="form-hint">
              Plazo entre {selectedLoanType.minTerm} y{" "}
              {selectedLoanType.maxTerm} meses
            </small>
          )}
        </div>

        {calculations && (
          <div className="loan-calculations">
            <h3>Detalles del Préstamo</h3>
            <p>Pago Mensual: ${calculations.monthlyPayment}</p>
            <p>Tasa de Interés: {calculations.interestRate}%</p>
            <p>Total a Pagar: ${calculations.totalAmount}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="purpose">Propósito del Préstamo</label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="employmentStatus">Situación Laboral</label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="employed">Empleado</option>
            <option value="self-employed">Autónomo</option>
            <option value="business-owner">Dueño de Negocio</option>
            <option value="retired">Jubilado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="monthlyIncome">Ingreso Mensual</label>
          <input
            type="number"
            id="monthlyIncome"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="otherDebts">Otras Deudas Mensuales</label>
          <input
            type="number"
            id="otherDebts"
            name="otherDebts"
            value={formData.otherDebts}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>
    </div>
  );
};

export default LoanApplication;
