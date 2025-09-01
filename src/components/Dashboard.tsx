import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  UserCircle,
  MessageSquare,
  Target,
  Bot,
  Mail,
  Calendar,
  Settings as SettingsIcon,
  BarChart3,
  Database
} from "lucide-react";
import { authService } from "../services";
import { testApiService } from "../services/test-api";
import Overview from "./dashboard/Overview";
import Customers from "./dashboard/Customers";
import MyProfile from "./dashboard/MyProfile";
import Onboarding from "./dashboard/Onboarding";
import WhatsAppQR from "./dashboard/WhatsAppQR";
import Leads from "./dashboard/Leads";
import Agents from "./dashboard/Agents";
import Campaigns from "./dashboard/Campaigns";
import Followups from "./dashboard/Followups";
import CalendarBooking from "./dashboard/CalendarBooking";
import Settings from "./dashboard/Settings";
import Analytics from "./dashboard/Analytics";
import DatabaseManager from "./DatabaseManager";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const location = useLocation();

  const userEmail = localStorage.getItem("userEmail") || "User";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
    }
  };

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { path: "/dashboard/leads", icon: Target, label: "Leads" },
    { path: "/dashboard/campaigns", icon: Mail, label: "Campaigns" },
    { path: "/dashboard/followups", icon: MessageSquare, label: "Follow-ups" },
    { path: "/dashboard/agents", icon: Bot, label: "Agents" },
    { path: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
    { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/dashboard/customers", icon: Users, label: "Customers" },
    { path: "/dashboard/whatsapp-qr", icon: MessageSquare, label: "WhatsApp QR" },
    { path: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
    { path: "/dashboard/profile", icon: UserCircle, label: "My Profile" },
    { path: "/dashboard/database", icon: Database, label: "Database Manager" },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  // Check API connection status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const isConnected = await testApiService.testConnection();
        setApiStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkApiStatus();
  }, []);

  // Onboarding modal: only show when user first lands on dashboard and onboarding is not completed
  // TEMPORARILY DISABLED - Uncomment below to re-enable onboarding modal
  useEffect(() => {
    // const isCompleted = localStorage.getItem("onboardingCompleted") === "true";

    // if (!isCompleted) {
    //   // Only show blocking modal when on dashboard overview page
    //   if (location.pathname === "/dashboard") {
    //     setShowOnboardingModal(true);
    //   } else {
    //     setShowOnboardingModal(false);
    //   }
    // } else {
    //   setShowOnboardingModal(false);
    // }
    
    // Always hide modal for now
    setShowOnboardingModal(false);
  }, [location.pathname]);

  return (
    <div className={`dashboard ${showOnboardingModal ? 'dashboard-blurred' : ''}`}>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>TechZu CRM</h2>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActiveRoute(item.path) ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="header-right">
            <div className="api-status" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginRight: '16px',
              fontSize: '12px',
              color: apiStatus === 'connected' ? '#10b981' : apiStatus === 'disconnected' ? '#ef4444' : '#6b7280'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: apiStatus === 'connected' ? '#10b981' : apiStatus === 'disconnected' ? '#ef4444' : '#6b7280'
              }}></div>
              API {apiStatus}
            </div>
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{userEmail}</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/followups" element={<Followups />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/calendar" element={<CalendarBooking />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/whatsapp-qr" element={<WhatsAppQR />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/database" element={<DatabaseManager />} />
          </Routes>
        </div>
      </main>

      {showOnboardingModal && (
        <div className="onboarding-modal-overlay">
          <div className="onboarding-modal">
            <h3>Please complete all the onboarding steps</h3>
            <div className="onboarding-actions">
              <Link to="/dashboard/onboarding" className="onboarding-btn">
                Move forward
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
