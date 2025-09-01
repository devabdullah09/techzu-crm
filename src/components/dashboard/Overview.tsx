import { Users, Building2, TrendingUp, DollarSign } from "lucide-react";

const Overview = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Companies",
      value: "89",
      change: "+5%",
      changeType: "positive",
      icon: Building2,
      color: "green",
    },
    {
      title: "Revenue",
      value: "$45,678",
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Growth Rate",
      value: "23%",
      change: "+2%",
      changeType: "positive",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New customer added",
      customer: "John Doe",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Company updated",
      company: "TechCorp Inc",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "Report generated",
      report: "Monthly Sales",
      time: "6 hours ago",
    },
    {
      id: 4,
      action: "Meeting scheduled",
      customer: "Jane Smith",
      time: "1 day ago",
    },
    { id: 5, action: "Deal closed", amount: "$12,000", time: "2 days ago" },
  ];

  return (
    <div className="overview">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className={`stat-change ${stat.changeType}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-details">
                  {activity.customer && `Customer: ${activity.customer}`}
                  {activity.company && `Company: ${activity.company}`}
                  {activity.report && `Report: ${activity.report}`}
                  {activity.amount && `Amount: ${activity.amount}`}
                </p>
              </div>
              <span className="activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <Users size={20} />
            <span>Add Customer</span>
          </button>
          <button className="action-btn">
            <Building2 size={20} />
            <span>Add Company</span>
          </button>
          <button className="action-btn">
            <TrendingUp size={20} />
            <span>Generate Report</span>
          </button>
          <button className="action-btn">
            <DollarSign size={20} />
            <span>New Deal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
