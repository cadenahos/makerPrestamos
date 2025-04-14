import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/Dashboard";
import LoanApplication from "./components/loans/LoanApplication";
import LoanStatus from "./components/loans/LoanStatus";
import AdminDashboard from "./components/admin/AdminDashboard";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard isAuthenticated={isAuthenticated} user={user} />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/apply"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <LoanApplication user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/status"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <LoanStatus user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute isAuthenticated={isAuthenticated} user={user}>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
