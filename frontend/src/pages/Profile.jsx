import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">

          <div className="profile-icon">👤</div>

          <h1>My Profile</h1>
          <p>Manage your ECO-TRACKER profile</p>

          <div className="profile-info">

            <div className="info-row">
              <span>Name</span>
              <strong>Eco User</strong>
            </div>

            <div className="info-row">
              <span>Email</span>
              <strong>user@example.com</strong>
            </div>

            <div className="info-row">
              <span>Eco Points</span>
              <strong>0 Points</strong>
            </div>

            <div className="info-row">
              <span>Badges</span>
              <strong>0 Badges</strong>
            </div>

          </div>

          <Link to="/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Profile;