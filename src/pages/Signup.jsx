import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000";

function Signup() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${name.trim()} ${lastName.trim()}`,
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully! Please log in.",
        },
      });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card signup-card" onSubmit={handleSubmit}>
        <div className="signup-logo" aria-hidden="true">
          <span>✳</span>
        </div>

        <h1>Create an account</h1>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <div className="signup-name-row">
          <div className="auth-field">
            <label htmlFor="signup-name">First Name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="e.g. Sanu"
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-lastname">Last Name</label>
            <input
              id="signup-lastname"
              type="text"
              placeholder="e.g. Lowanshi"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            placeholder="e.g. sanu@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>

          <div className="password-wrapper">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye with slash: password is visible
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A11 11 0 0121 12a11.7 11.7 0 01-4 4.5" />
                  <path d="M6.2 6.2A12 12 0 003 12s3.3 7 9 7a9 9 0 003-.5" />
                </svg>
              ) : (
                // Normal eye: password is hidden
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="auth-footer">
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;
