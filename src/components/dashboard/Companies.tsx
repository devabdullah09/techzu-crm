import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Building2,
  Globe,
  Phone,
} from "lucide-react";

const Companies = () => {
  const [companies] = useState([
    {
      id: 1,
      name: "TechCorp Inc",
      industry: "Technology",
      website: "www.techcorp.com",
      phone: "+1 (555) 123-4567",
      employees: "50-100",
      status: "Active",
      revenue: "$1M - $5M",
    },
    {
      id: 2,
      name: "Innovation Labs",
      industry: "Research",
      website: "www.innovationlabs.com",
      phone: "+1 (555) 234-5678",
      employees: "10-50",
      status: "Active",
      revenue: "$500K - $1M",
    },
    {
      id: 3,
      name: "Global Solutions",
      industry: "Consulting",
      website: "www.globalsolutions.com",
      phone: "+1 (555) 345-6789",
      employees: "100-500",
      status: "Inactive",
      revenue: "$5M - $10M",
    },
    {
      id: 4,
      name: "Future Tech",
      industry: "Technology",
      website: "www.futuretech.com",
      phone: "+1 (555) 456-7890",
      employees: "50-100",
      status: "Active",
      revenue: "$1M - $5M",
    },
    {
      id: 5,
      name: "Digital Dynamics",
      industry: "Marketing",
      website: "www.digitaldynamics.com",
      phone: "+1 (555) 567-8901",
      employees: "10-50",
      status: "Active",
      revenue: "$500K - $1M",
    },
  ]);

  const getStatusColor = (status: string) => {
    return status === "Active" ? "status-active" : "status-inactive";
  };

  return (
    <div className="companies">
      <div className="page-header">
        <div className="header-content">
          <h1>Companies</h1>
          <p>Manage company information and relationships</p>
        </div>
        <button className="add-button">
          <Plus size={20} />
          Add Company
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search companies..."
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Technology</button>
          <button className="filter-btn">Consulting</button>
          <button className="filter-btn">Marketing</button>
        </div>
      </div>

      {/* Companies Table */}
      <div className="table-container">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Website</th>
              <th>Phone</th>
              <th>Employees</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  <div className="company-name">
                    <div className="company-avatar">
                      <Building2 size={20} />
                    </div>
                    <span>{company.name}</span>
                  </div>
                </td>
                <td>{company.industry}</td>
                <td>
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    <Globe size={16} />
                    {company.website}
                  </a>
                </td>
                <td>
                  <div className="phone-info">
                    <Phone size={16} />
                    {company.phone}
                  </div>
                </td>
                <td>{company.employees}</td>
                <td>{company.revenue}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(company.status)}`}
                  >
                    {company.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="action-btn" title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <button className="action-btn" title="More">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn" disabled>
          Previous
        </button>
        <div className="page-numbers">
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
        </div>
        <button className="pagination-btn">Next</button>
      </div>
    </div>
  );
};

export default Companies;
