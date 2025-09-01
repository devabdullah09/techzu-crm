import { UserCircle, Building2, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  return (
    <div className="profile">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your personal information and onboarding</p>
        </div>
        <Link to="/dashboard/onboarding" className="add-button">
          Complete Onboarding
        </Link>
      </div>

      <div className="table-container" style={{ maxWidth: 720 }}>
        <h2>Account</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <UserCircle />
            <div>
              <div style={{ fontWeight: 600 }}>Email</div>
              <div style={{ color: "#6b7280" }}>{userEmail}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Building2 />
            <div>
              <div style={{ fontWeight: 600 }}>Company</div>
              <div style={{ color: "#6b7280" }}>Not set</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CalendarDays />
            <div>
              <div style={{ fontWeight: 600 }}>Member since</div>
              <div style={{ color: "#6b7280" }}>2025</div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ maxWidth: 720 }}>
        <h2>Onboarding Status</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>Completion</div>
            <div style={{ color: "#6b7280" }}>
              {localStorage.getItem("onboardingCompleted") === "true"
                ? "Completed"
                : "Not completed"}
            </div>
          </div>
          <Link to="/dashboard/onboarding" className="add-button">
            Complete Onboarding
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
