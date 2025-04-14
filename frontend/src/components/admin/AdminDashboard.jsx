import { useState, useEffect } from "react";
import { loanService } from "../../api";
import "./Admin.css";

const AdminDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansData, statsData] = await Promise.all([
          loanService.getAllLoans(),
          loanService.getDashboardStats(),
        ]);

        setLoans(loansData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      await loanService.updateLoanStatus(loanId, newStatus);

      // Update local state
      setLoans(
        loans.map((loan) =>
          loan.id === loanId ? { ...loan, status: newStatus } : loan
        )
      );

      // Close modal
      setSelectedLoan(null);
    } catch (error) {
      console.error("Error updating loan status:", error);
      setError("Error al actualizar el estado del préstamo");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="admin-dashboard loading">Cargando...</div>;
  }

  if (error) {
    return <div className="admin-dashboard error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Préstamos Pendientes</h3>
            <div className="stat-value">{stats.pendingLoans}</div>
          </div>
          <div className="stat-card">
            <h3>Préstamos Aprobados</h3>
            <div className="stat-value">{stats.approvedLoans}</div>
          </div>
          <div className="stat-card">
            <h3>Total Prestado</h3>
            <div className="stat-value">
              {formatCurrency(stats.totalLoanAmount)}
            </div>
          </div>
          <div className="stat-card">
            <h3>Tasa de Aprobación</h3>
            <div className="stat-value">{stats.approvalRate}%</div>
          </div>
        </div>
      )}

      <div className="loans-section">
        <h3>Solicitudes de Préstamos</h3>

        <div className="loans-table-container">
          <table className="loans-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Plazo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.userName}</td>
                  <td>{loan.type}</td>
                  <td>{formatCurrency(loan.amount)}</td>
                  <td>{loan.term} meses</td>
                  <td>{formatDate(loan.applicationDate)}</td>
                  <td>
                    <span
                      className={`status-badge ${loan.status.toLowerCase()}`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => setSelectedLoan(loan)}
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLoan && (
        <div className="modal">
          <div className="modal-content">
            <h3>Gestionar Préstamo</h3>
            <div className="loan-details">
              <p>
                <strong>Cliente:</strong> {selectedLoan.userName}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedLoan.type}
              </p>
              <p>
                <strong>Monto:</strong> {formatCurrency(selectedLoan.amount)}
              </p>
              <p>
                <strong>Plazo:</strong> {selectedLoan.term} meses
              </p>
              <p>
                <strong>Ingreso Mensual:</strong>{" "}
                {formatCurrency(selectedLoan.monthlyIncome)}
              </p>
              <p>
                <strong>Otras Deudas:</strong>{" "}
                {formatCurrency(selectedLoan.otherDebts)}
              </p>
              <p>
                <strong>Propósito:</strong> {selectedLoan.purpose}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="approve-btn"
                onClick={() => handleStatusChange(selectedLoan.id, "approved")}
                disabled={selectedLoan.status === "approved"}
              >
                Aprobar
              </button>
              <button
                className="reject-btn"
                onClick={() => handleStatusChange(selectedLoan.id, "rejected")}
                disabled={selectedLoan.status === "rejected"}
              >
                Rechazar
              </button>
              <button
                className="close-btn"
                onClick={() => setSelectedLoan(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
