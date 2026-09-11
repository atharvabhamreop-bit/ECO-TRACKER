import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  function handleSignup(event) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="signup-page">
      <div className="signup-box">

        <div className="signup-logo">🌱</div>

        <h1>Create Account</h1>

        <p className="signup-subtitle">
          Join ECO-TRACKER and start your green journey.
        </p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            required
          />

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;