import { useState } from "react";
import {
  User,
  Mail,
  Key,
  Shield,
  CreditCard,
  Users,
  Settings as SettingsIcon,
  Save,
  Eye,
  Plus,
  Trash2,
  Edit,
  X,
  RefreshCw,
  Calendar,
  Database,
  Zap,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "email" | "calendar" | "crm" | "other";
  status: "connected" | "disconnected" | "error";
  description: string;
  icon: React.ReactNode;
  lastSync?: string;
  settings?: Record<string, any>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Agent" | "Analyst" | "Viewer";
  status: "Active" | "Pending" | "Disabled";
  lastActive: string;
  permissions: string[];
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "integrations" | "team" | "billing" | "security">("profile");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showNewMember, setShowNewMember] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@techzu.com",
    company: "TechZu Solutions",
    website: "https://techzu.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    role: "Agent" as TeamMember["role"]
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "gmail",
      name: "Gmail",
      type: "email",
      status: "connected",
      description: "Send and receive emails through Gmail",
      icon: <Mail size={24} />,
      lastSync: "2024-01-15 10:30 AM"
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      type: "calendar",
      status: "connected",
      description: "Sync meetings and events with Google Calendar",
      icon: <Calendar size={24} />,
      lastSync: "2024-01-15 09:15 AM"
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      type: "email",
      status: "disconnected",
      description: "Connect Outlook for email functionality",
      icon: <Mail size={24} />
    },
    {
      id: "hubspot",
      name: "HubSpot CRM",
      type: "crm",
      status: "error",
      description: "Sync leads and contacts with HubSpot",
      icon: <Database size={24} />,
      lastSync: "2024-01-14 02:45 PM"
    },
    {
      id: "salesforce",
      name: "Salesforce",
      type: "crm",
      status: "disconnected",
      description: "Integrate with Salesforce CRM",
      icon: <Database size={24} />
    },
    {
      id: "zapier",
      name: "Zapier",
      type: "other",
      status: "connected",
      description: "Automate workflows with 3000+ apps",
      icon: <Zap size={24} />,
      lastSync: "2024-01-15 08:20 AM"
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@techzu.com",
      role: "Admin",
      status: "Active",
      lastActive: "2024-01-15 11:30 AM",
      permissions: ["all"]
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@techzu.com",
      role: "Agent",
      status: "Active",
      lastActive: "2024-01-15 10:15 AM",
      permissions: ["leads", "campaigns", "calendar"]
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@techzu.com",
      role: "Analyst",
      status: "Active",
      lastActive: "2024-01-14 04:45 PM",
      permissions: ["analytics", "reports"]
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@techzu.com",
      role: "Agent",
      status: "Pending",
      lastActive: "Never",
      permissions: ["leads", "campaigns"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "Active": return "bg-green-100 text-green-800";
      case "disconnected":
      case "Disabled": return "bg-gray-100 text-gray-800";
      case "error": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "Active": return <CheckCircle size={14} />;
      case "error": return <AlertCircle size={14} />;
      case "Pending": return <Clock size={14} />;
      default: return <X size={14} />;
    }
  };

  const handleIntegrationToggle = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const newStatus = integration.status === "connected" ? "disconnected" : "connected";
        return { 
          ...integration, 
          status: newStatus,
          lastSync: newStatus === "connected" ? new Date().toLocaleString() : undefined
        };
      }
      return integration;
    }));
  };

  const handleSaveProfile = () => {
    // Save profile changes
    console.log("Profile saved:", profileForm);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Change password logic
    console.log("Password changed");
    setShowPasswordChange(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...newMemberForm,
      status: "Pending",
      lastActive: "Never",
      permissions: getRolePermissions(newMemberForm.role)
    };
    setTeamMembers(prev => [...prev, newMember]);
    setShowNewMember(false);
    setNewMemberForm({ name: "", email: "", role: "Agent" });
  };

  const getRolePermissions = (role: TeamMember["role"]) => {
    switch (role) {
      case "Admin": return ["all"];
      case "Agent": return ["leads", "campaigns", "calendar", "followups"];
      case "Analyst": return ["analytics", "reports"];
      case "Viewer": return ["view"];
      default: return [];
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "integrations", label: "Integrations", icon: <RefreshCw size={20} /> },
    { id: "team", label: "Team", icon: <Users size={20} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={20} /> },
    { id: "security", label: "Security", icon: <Shield size={20} /> }
  ];

  return (
    <div className="settings">
      <div className="page-header">
        <div className="header-content">
          <h1>Settings</h1>
          <p>Manage your account, integrations, and team settings</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Update your personal and company information</p>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({...profileForm, company: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({...profileForm, timezone: e.target.value})}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({...profileForm, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="action-btn primary" onClick={handleSaveProfile}>
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>

                <div className="password-section">
                  <h3>Password</h3>
                  <p>Keep your account secure with a strong password</p>
                  <button
                    className="action-btn secondary"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                  >
                    <Key size={16} />
                    Change Password
                  </button>

                  {showPasswordChange && (
                    <div className="password-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        />
                      </div>
                      <div className="form-actions">
                        <button className="action-btn secondary" onClick={() => setShowPasswordChange(false)}>
                          Cancel
                        </button>
                        <button className="action-btn primary" onClick={handleChangePassword}>
                          Update Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Integrations</h2>
                <p>Connect your favorite tools and platforms</p>
              </div>

              <div className="integrations-grid">
                {integrations.map((integration) => (
                  <div key={integration.id} className="integration-card">
                    <div className="integration-header">
                      <div className="integration-info">
                        <div className="integration-icon">
                          {integration.icon}
                        </div>
                        <div className="integration-details">
                          <h3>{integration.name}</h3>
                          <p>{integration.description}</p>
                        </div>
                      </div>
                      <span className={`status-badge ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        {integration.status}
                      </span>
                    </div>
                    
                    {integration.lastSync && (
                      <div className="integration-sync">
                        <span>Last sync: {integration.lastSync}</span>
                      </div>
                    )}

                    <div className="integration-actions">
                      {integration.status === "connected" ? (
                        <>
                          <button
                            className="action-btn secondary small"
                            onClick={() => handleIntegrationToggle(integration.id)}
                          >
                            Disconnect
                          </button>
                          <button className="action-btn primary small">
                            <SettingsIcon size={14} />
                            Configure
                          </button>
                        </>
                      ) : (
                        <button
                          className="action-btn primary small"
                          onClick={() => handleIntegrationToggle(integration.id)}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="api-section">
                <h3>API Access</h3>
                <p>Generate API keys for custom integrations</p>
                <div className="api-key-card">
                  <div className="api-key-info">
                    <label>API Key</label>
                    <div className="api-key-display">
                      <input
                        type="password"
                        value="sk_live_1234567890abcdef"
                        readOnly
                      />
                      <button className="action-btn secondary small">
                        <Eye size={14} />
                        Show
                      </button>
                      <button className="action-btn secondary small">
                        <RefreshCw size={14} />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="settings-section">
              <div className="section-header">
                <div className="header-content">
                  <h2>Team Management</h2>
                  <p>Manage team members and their permissions</p>
                </div>
                <button
                  className="action-btn primary"
                  onClick={() => setShowNewMember(true)}
                >
                  <Plus size={16} />
                  Add Member
                </button>
              </div>

              <div className="team-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div className="member-info">
                            <div className="member-avatar">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span>{member.name}</span>
                          </div>
                        </td>
                        <td>{member.email}</td>
                        <td>
                          <span className="role-badge">{member.role}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(member.status)}`}>
                            {getStatusIcon(member.status)}
                            {member.status}
                          </span>
                        </td>
                        <td>{member.lastActive}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-icon" title="Edit">
                              <Edit size={14} />
                            </button>
                            <button
                              className="action-icon danger"
                              onClick={() => handleRemoveTeamMember(member.id)}
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Member Modal */}
              {showNewMember && (
                <div className="modal-overlay" onClick={() => setShowNewMember(false)}>
                  <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Add Team Member</h3>
                      <button onClick={() => setShowNewMember(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    <div className="modal-content">
                      <div className="member-form">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            value={newMemberForm.name}
                            onChange={(e) => setNewMemberForm({...newMemberForm, name: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={newMemberForm.email}
                            onChange={(e) => setNewMemberForm({...newMemberForm, email: e.target.value})}
                            placeholder="john@company.com"
                          />
                        </div>
                        <div className="form-group">
                          <label>Role</label>
                          <select
                            value={newMemberForm.role}
                            onChange={(e) => setNewMemberForm({...newMemberForm, role: e.target.value as TeamMember["role"]})}
                          >
                            <option value="Agent">Agent</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Viewer">Viewer</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="action-btn secondary" onClick={() => setShowNewMember(false)}>
                        Cancel
                      </button>
                      <button className="action-btn primary" onClick={handleAddTeamMember}>
                        <Plus size={16} />
                        Add Member
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Billing & Subscription</h2>
                <p>Manage your subscription and billing information</p>
              </div>

              <div className="billing-overview">
                <div className="plan-card">
                  <h3>Current Plan</h3>
                  <div className="plan-info">
                    <h2>Professional Plan</h2>
                    <p className="plan-price">$99/month</p>
                    <p className="plan-description">Up to 5 agents, 10,000 emails/month</p>
                  </div>
                  <button className="action-btn primary">
                    Upgrade Plan
                  </button>
                </div>

                <div className="usage-card">
                  <h3>Usage This Month</h3>
                  <div className="usage-metrics">
                    <div className="usage-item">
                      <span className="usage-label">Emails Sent</span>
                      <span className="usage-value">3,247 / 10,000</span>
                      <div className="usage-bar">
                        <div className="usage-fill" style={{width: "32%"}}></div>
                      </div>
                    </div>
                    <div className="usage-item">
                      <span className="usage-label">Active Agents</span>
                      <span className="usage-value">3 / 5</span>
                      <div className="usage-bar">
                        <div className="usage-fill" style={{width: "60%"}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="billing-history">
                <h3>Billing History</h3>
                <div className="history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jan 1, 2024</td>
                        <td>Professional Plan - Monthly</td>
                        <td>$99.00</td>
                        <td><span className="status-badge bg-green-100 text-green-800">Paid</span></td>
                        <td><button className="action-btn secondary small">Download</button></td>
                      </tr>
                      <tr>
                        <td>Dec 1, 2023</td>
                        <td>Professional Plan - Monthly</td>
                        <td>$99.00</td>
                        <td><span className="status-badge bg-green-100 text-green-800">Paid</span></td>
                        <td><button className="action-btn secondary small">Download</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Security Settings</h2>
                <p>Manage your account security and privacy settings</p>
              </div>

              <div className="security-options">
                <div className="security-card">
                  <div className="security-header">
                    <Lock size={24} />
                    <div>
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button className="action-btn primary">
                    Enable 2FA
                  </button>
                </div>

                <div className="security-card">
                  <div className="security-header">
                    <Shield size={24} />
                    <div>
                      <h3>Login Sessions</h3>
                      <p>Manage active sessions across devices</p>
                    </div>
                  </div>
                  <button className="action-btn secondary">
                    View Sessions
                  </button>
                </div>

                <div className="security-card">
                  <div className="security-header">
                    <AlertCircle size={24} />
                    <div>
                      <h3>Data Export</h3>
                      <p>Download your data for backup or migration</p>
                    </div>
                  </div>
                  <button className="action-btn secondary">
                    Request Export
                  </button>
                </div>

                <div className="security-card danger">
                  <div className="security-header">
                    <Trash2 size={24} />
                    <div>
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <button className="action-btn danger">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
