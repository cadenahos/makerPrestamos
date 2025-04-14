import { useState, useEffect } from "react";
import { loanService } from "../../api";
import "./Loans.css";

const LoanStatus = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const userLoans = await loanService.getUserLoans();
        setLoans(userLoans);
      } catch (error) {
        console.error("Error fetching loans:", error);
        setError("No se pudieron cargar los préstamos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="loan-status loading">Cargando...</div>;
  }

  if (error) {
    return <div className="loan-status error">{error}</div>;
  }

  return (
    <div className="loan-status">
      <h2>Estado de tus Préstamos</h2>

      {loans.length === 0 ? (
        <div className="no-loans">
          <p>No tienes préstamos activos</p>
          <a href="/apply" className="btn btn-primary">
            Solicitar un Préstamo
          </a>
        </div>
      ) : (
        <div className="loans-grid">
          {loans.map((loan) => (
            <div key={loan.id} className="loan-card">
              <div className="loan-header">
                <h3>{loan.type}</h3>
                <span className={`status-badge ${getStatusColor(loan.status)}`}>
                  {loan.status}
                </span>
              </div>

              <div className="loan-details">
                <div className="detail-row">
                  <span className="label">Monto:</span>
                  <span className="value">${loan.amount}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Plazo:</span>
                  <span className="value">{loan.term} meses</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fecha de Solicitud:</span>
                  <span className="value">
                    {formatDate(loan.applicationDate)}
                  </span>
                </div>
                {loan.status === "approved" && (
                  <>
                    <div className="detail-row">
                      <span className="label">Pago Mensual:</span>
                      <span className="value">${loan.monthlyPayment}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Próximo Pago:</span>
                      <span className="value">
                        {formatDate(loan.nextPaymentDate)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {loan.status === "pending" && (
                <div className="loan-message pending">
                  Tu solicitud está siendo revisada. Te notificaremos cuando
                  haya una actualización.
                </div>
              )}
              {loan.status === "approved" && (
                <div className="loan-message approved">
                  ¡Felicidades! Tu préstamo ha sido aprobado.
                </div>
              )}
              {loan.status === "rejected" && (
                <div className="loan-message rejected">
                  Lo sentimos, tu solicitud no ha sido aprobada en esta ocasión.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanStatus;
