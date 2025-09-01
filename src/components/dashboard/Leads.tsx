import { useState, useEffect } from "react";
import {
  Upload,
  Search,
  Plus,
  Download,
  Trash2,
  Eye,
  Building,
  Mail,
  MapPin,
  Phone,
  Globe,
  X,
  RefreshCw
} from "lucide-react";
import { leadsService, type Lead } from "../../services";

// Lead interface is now imported from services

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);


  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    location: "",
    source: "",
    status: ""
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [showScrapingModal, setShowScrapingModal] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState<Lead | null>(null);
  const [importType, setImportType] = useState<"csv" | "crm" | "scraping">("csv");

  // Load leads on component mount
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const leadsData = await leadsService.getLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error('Failed to load leads:', error);
      }
    };

    loadLeads();
  }, []);

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.industry || lead.industry === filters.industry) &&
      (!filters.companySize || lead.companySize === filters.companySize) &&
      (!filters.location || lead.location.includes(filters.location)) &&
      (!filters.source || lead.source === filters.source) &&
      (!filters.status || lead.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleBulkAction = (action: "delete" | "export" | "campaign") => {
    if (action === "delete") {
      setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)));
      setSelectedLeads([]);
    }
    // Add other bulk actions as needed
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle CSV/XLSX upload
      console.log("Uploading file:", file.name);
      setShowImportModal(false);
    }
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Interested": return "bg-green-100 text-green-800";
      case "Not Interested": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: Lead["source"]) => {
    switch (source) {
      case "Manual": return "bg-purple-100 text-purple-800";
      case "Scraped": return "bg-orange-100 text-orange-800";
      case "CRM Sync": return "bg-indigo-100 text-indigo-800";
      case "CSV Upload": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="leads">
      <div className="page-header">
        <div className="header-content">
          <h1>Leads Management</h1>
          <p>Import, scrape, and manage your sales leads</p>
        </div>
        <div className="header-actions">
          <button
            className="action-btn secondary"
            onClick={() => setShowScrapingModal(true)}
          >
            <Globe size={20} />
            Web Scraping
          </button>
          <button
            className="action-btn secondary"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={20} />
            Import Leads
          </button>
          <button className="action-btn primary">
            <Plus size={20} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-row">
          <select
            value={filters.industry}
            onChange={(e) => setFilters({...filters, industry: e.target.value})}
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>

          <select
            value={filters.companySize}
            onChange={(e) => setFilters({...filters, companySize: e.target.value})}
          >
            <option value="">All Company Sizes</option>
            <option value="1-10">1-10 employees</option>
            <option value="10-50">10-50 employees</option>
            <option value="50-100">50-100 employees</option>
            <option value="100-500">100-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>

          <select
            value={filters.source}
            onChange={(e) => setFilters({...filters, source: e.target.value})}
          >
            <option value="">All Sources</option>
            <option value="Manual">Manual</option>
            <option value="Scraped">Web Scraped</option>
            <option value="CRM Sync">CRM Sync</option>
            <option value="CSV Upload">CSV Upload</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
          </select>

          <button
            className="filter-btn"
            onClick={() => setFilters({industry: "", companySize: "", location: "", source: "", status: ""})}
          >
            <X size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedLeads.length} leads selected</span>
          <div className="bulk-buttons">
            <button onClick={() => handleBulkAction("campaign")} className="bulk-btn primary">
              Add to Campaign
            </button>
            <button onClick={() => handleBulkAction("export")} className="bulk-btn secondary">
              <Download size={16} />
              Export
            </button>
            <button onClick={() => handleBulkAction("delete")} className="bulk-btn danger">
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Industry</th>
              <th>Company Size</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                  />
                </td>
                <td>
                  <div className="lead-name">
                    <strong>{lead.name}</strong>
                    {lead.tags.length > 0 && (
                      <div className="lead-tags">
                        {lead.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <Mail size={14} />
                    {lead.email}
                  </div>
                </td>
                <td>
                  <div className="company-info">
                    <Building size={14} />
                    {lead.company}
                  </div>
                </td>
                <td>{lead.role}</td>
                <td>{lead.industry}</td>
                <td>{lead.companySize}</td>
                <td>
                  <span className={`status-badge ${getSourceColor(lead.source)}`}>
                    {lead.source}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-icon"
                      onClick={() => setShowLeadDetail(lead)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Import Leads</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="import-options">
                <div
                  className={`import-option ${importType === "csv" ? "active" : ""}`}
                  onClick={() => setImportType("csv")}
                >
                  <Upload size={24} />
                  <h4>CSV/Excel Upload</h4>
                  <p>Upload a CSV or Excel file with your leads</p>
                </div>
                <div
                  className={`import-option ${importType === "crm" ? "active" : ""}`}
                  onClick={() => setImportType("crm")}
                >
                  <RefreshCw size={24} />
                  <h4>CRM Sync</h4>
                  <p>Connect with HubSpot, Salesforce, or other CRMs</p>
                </div>
              </div>

              {importType === "csv" && (
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    id="file-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload" className="upload-area">
                    <Upload size={48} />
                    <p>Click to upload or drag and drop</p>
                    <span>CSV, Excel files up to 10MB</span>
                  </label>
                </div>
              )}

              {importType === "crm" && (
                <div className="crm-options">
                  <button className="crm-btn">
                    Connect HubSpot
                  </button>
                  <button className="crm-btn">
                    Connect Salesforce
                  </button>
                  <button className="crm-btn">
                    Connect Pipedrive
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Web Scraping Modal */}
      {showScrapingModal && (
        <div className="modal-overlay" onClick={() => setShowScrapingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Web Scraping Tool</h3>
              <button onClick={() => setShowScrapingModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="scraping-form">
                <div className="form-group">
                  <label>Website URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn Company Page</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/example"
                  />
                </div>
                <div className="form-group">
                  <label>Target Roles</label>
                  <input
                    type="text"
                    placeholder="CEO, CTO, VP Sales (comma separated)"
                  />
                </div>
                <div className="form-group">
                  <label>Company Size Filter</label>
                  <select>
                    <option value="">Any size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="10-50">10-50 employees</option>
                    <option value="50-200">50-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>
                <button className="action-btn primary">
                  <Search size={20} />
                  Start Scraping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Panel */}
      {showLeadDetail && (
        <div className="modal-overlay" onClick={() => setShowLeadDetail(null)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Lead Details</h3>
              <button onClick={() => setShowLeadDetail(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="lead-detail">
                <div className="lead-info">
                  <h2>{showLeadDetail.name}</h2>
                  <p className="lead-title">{showLeadDetail.role} at {showLeadDetail.company}</p>
                  
                  <div className="contact-details">
                    <div className="contact-item">
                      <Mail size={16} />
                      <span>{showLeadDetail.email}</span>
                    </div>
                    {showLeadDetail.phone && (
                      <div className="contact-item">
                        <Phone size={16} />
                        <span>{showLeadDetail.phone}</span>
                      </div>
                    )}
                    <div className="contact-item">
                      <MapPin size={16} />
                      <span>{showLeadDetail.location}</span>
                    </div>
                    {showLeadDetail.website && (
                      <div className="contact-item">
                        <Globe size={16} />
                        <a href={showLeadDetail.website} target="_blank" rel="noopener noreferrer">
                          {showLeadDetail.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="lead-meta">
                    <div className="meta-item">
                      <span className="label">Industry:</span>
                      <span>{showLeadDetail.industry}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Company Size:</span>
                      <span>{showLeadDetail.companySize}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Source:</span>
                      <span className={`status-badge ${getSourceColor(showLeadDetail.source)}`}>
                        {showLeadDetail.source}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Status:</span>
                      <span className={`status-badge ${getStatusColor(showLeadDetail.status)}`}>
                        {showLeadDetail.status}
                      </span>
                    </div>
                  </div>

                  <div className="lead-tags">
                    {showLeadDetail.tags.map((tag, index) => (
                      <span key={index} className="tag large">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="lead-actions">
                  <button className="action-btn primary">
                    Add to Campaign
                  </button>
                  <button className="action-btn secondary">
                    Send Email
                  </button>
                  <button className="action-btn secondary">
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
