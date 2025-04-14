import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Makers Préstamos</Link>
      </div>

      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <Link to="/" className="navbar-item">
              Inicio
            </Link>
            <Link to="/apply" className="navbar-item">
              Solicitar Préstamo
            </Link>
            <Link to="/status" className="navbar-item">
              Estado de Solicitudes
            </Link>
            {user && user.role === "admin" && (
              <Link to="/admin" className="navbar-item">
                Panel de Administración
              </Link>
            )}
            <div className="navbar-item user-info">
              <span>Hola, {user.name}</span>
              <button onClick={onLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="navbar-item">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
