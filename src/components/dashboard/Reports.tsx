import { useState } from "react";
import {
  Plus,
  Download,
  Eye,
  Trash2,
  Calendar,
  FileText,
  BarChart3,
} from "lucide-react";

const Reports = () => {
  const [reports] = useState([
    {
      id: 1,
      name: "Monthly Sales Report",
      type: "Sales",
      status: "Generated",
      lastGenerated: "2024-01-15",
      size: "2.3 MB",
      format: "PDF",
    },
    {
      id: 2,
      name: "Customer Analytics Q4",
      type: "Analytics",
      status: "Scheduled",
      lastGenerated: "2024-01-10",
      size: "1.8 MB",
      format: "Excel",
    },
    {
      id: 3,
      name: "Revenue Summary 2023",
      type: "Financial",
      status: "Generated",
      lastGenerated: "2024-01-01",
      size: "3.1 MB",
      format: "PDF",
    },
    {
      id: 4,
      name: "Lead Conversion Report",
      type: "Marketing",
      status: "Processing",
      lastGenerated: "2024-01-14",
      size: "1.2 MB",
      format: "Excel",
    },
    {
      id: 5,
      name: "Customer Satisfaction Survey",
      type: "Feedback",
      status: "Generated",
      lastGenerated: "2024-01-12",
      size: "0.9 MB",
      format: "PDF",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated":
        return "status-success";
      case "Processing":
        return "status-warning";
      case "Scheduled":
        return "status-info";
      default:
        return "status-default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Sales":
        return <BarChart3 size={16} />;
      case "Analytics":
        return <BarChart3 size={16} />;
      case "Financial":
        return <BarChart3 size={16} />;
      case "Marketing":
        return <BarChart3 size={16} />;
      case "Feedback":
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="reports">
      <div className="page-header">
        <div className="header-content">
          <h1>Reports</h1>
          <p>Generate and manage your business reports</p>
        </div>
        <button className="add-button">
          <Plus size={20} />
          Generate Report
        </button>
      </div>

      {/* Report Types */}
      <div className="report-types">
        <h2>Quick Reports</h2>
        <div className="types-grid">
          <button className="type-card">
            <BarChart3 size={24} />
            <span>Sales Report</span>
          </button>
          <button className="type-card">
            <BarChart3 size={24} />
            <span>Customer Analytics</span>
          </button>
          <button className="type-card">
            <BarChart3 size={24} />
            <span>Revenue Summary</span>
          </button>
          <button className="type-card">
            <FileText size={24} />
            <span>Custom Report</span>
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="table-container">
        <h2>Recent Reports</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Last Generated</th>
              <th>Size</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <div className="report-name">
                    {getTypeIcon(report.type)}
                    <span>{report.name}</span>
                  </div>
                </td>
                <td>{report.type}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(report.status)}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <Calendar size={16} />
                    {report.lastGenerated}
                  </div>
                </td>
                <td>{report.size}</td>
                <td>{report.format}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="action-btn" title="Download">
                      <Download size={16} />
                    </button>
                    <button className="action-btn" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scheduled Reports */}
      <div className="scheduled-reports">
        <h2>Scheduled Reports</h2>
        <div className="scheduled-list">
          <div className="scheduled-item">
            <div className="scheduled-info">
              <h4>Weekly Sales Summary</h4>
              <p>Every Monday at 9:00 AM</p>
            </div>
            <div className="scheduled-actions">
              <button className="btn-secondary">Edit</button>
              <button className="btn-danger">Cancel</button>
            </div>
          </div>
          <div className="scheduled-item">
            <div className="scheduled-info">
              <h4>Monthly Customer Report</h4>
              <p>1st of every month at 8:00 AM</p>
            </div>
            <div className="scheduled-actions">
              <button className="btn-secondary">Edit</button>
              <button className="btn-danger">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
