import { useState } from "react";
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";

const Customers = () => {
  const [customers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      company: "TechCorp Inc",
      status: "Active",
      lastContact: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 234-5678",
      company: "Innovation Labs",
      status: "Active",
      lastContact: "2024-01-14",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 (555) 345-6789",
      company: "Global Solutions",
      status: "Inactive",
      lastContact: "2024-01-10",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+1 (555) 456-7890",
      company: "Future Tech",
      status: "Active",
      lastContact: "2024-01-12",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 (555) 567-8901",
      company: "Digital Dynamics",
      status: "Active",
      lastContact: "2024-01-13",
    },
  ]);

  const getStatusColor = (status: string) => {
    return status === "Active" ? "status-active" : "status-inactive";
  };

  return (
    <div className="customers">
      <div className="page-header">
        <div className="header-content">
          <h1>Customers</h1>
          <p>Manage your customer relationships and information</p>
        </div>
        <button className="add-button">
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Active</button>
          <button className="filter-btn">Inactive</button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Last Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-name">
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <span>{customer.name}</span>
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.company}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(
                      customer.status
                    )}`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td>{customer.lastContact}</td>
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

export default Customers;
