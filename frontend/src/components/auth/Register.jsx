import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { authService } from "../../api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // Call the API to register
      await authService.register(userData);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Error al registrarse. Por favor, inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registro</h2>

        {apiError && <div className="error-message">{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
