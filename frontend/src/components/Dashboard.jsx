import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ isAuthenticated, user }) => {
  return (
    <div className="dashboard">
      <section className="hero">
        {isAuthenticated ? (
          <>
            <h1>Welcome back, {user?.name || "User"}!</h1>
            <p>Ready to explore our loan options or check your applications?</p>
            <div className="hero-buttons">
              <Link to="/loans">
                <button className="primary-button">View My Loans</button>
              </Link>
              <Link to="/calculator">
                <button className="secondary-button">Loan Calculator</button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to Makers Loans</h1>
            <p>
              Your trusted partner for personal, mortgage, automotive, and
              business loans.
            </p>
            <div className="hero-buttons">
              <Link to="/register">
                <button className="primary-button">Get Started</button>
              </Link>
              <Link to="/login">
                <button className="secondary-button">Sign In</button>
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="services">
        <h2>Our Loan Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Personal Loans</h3>
            <p>
              Flexible loans for your personal needs with competitive interest
              rates.
            </p>
            <Link to="/loans/personal">
              <button>Learn More</button>
            </Link>
          </div>
          <div className="service-card">
            <h3>Mortgage Loans</h3>
            <p>Make your dream home a reality with our mortgage solutions.</p>
            <Link to="/loans/mortgage">
              <button>Learn More</button>
            </Link>
          </div>
          <div className="service-card">
            <h3>Automotive Loans</h3>
            <p>
              Drive home in your new vehicle with our auto financing options.
            </p>
            <Link to="/loans/automotive">
              <button>Learn More</button>
            </Link>
          </div>
          <div className="service-card">
            <h3>Business Loans</h3>
            <p>Grow your business with our tailored financing solutions.</p>
            <Link to="/loans/business">
              <button>Learn More</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your account in minutes</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Apply</h3>
            <p>Fill out a simple loan application</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Approved</h3>
            <p>Quick approval process</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Receive Money</h3>
            <p>Get your funds deposited directly</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
