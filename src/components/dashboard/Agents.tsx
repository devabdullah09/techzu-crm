import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  FileText,
  Globe,
  Settings,
  Play,
  Pause,
  TestTube,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Bot,
  Mail,
  Brain,
  Activity
} from "lucide-react";

interface KnowledgeBase {
  id: string;
  name: string;
  type: "PDF" | "Website" | "Text";
  url?: string;
  size?: string;
  lastUpdated: string;
}

interface Agent {
  id: string;
  name: string;
  persona: string;
  status: "Draft" | "Test" | "Published" | "Paused";
  knowledgeBases: KnowledgeBase[];
  emailSignature: string;
  mode: "Test" | "Published";
  supervisorReview: boolean;
  campaignsAssigned: number;
  emailsSent: number;
  responseRate: number;
  createdAt: string;
  lastActive?: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Sales Pro AI",
      persona: "A professional sales assistant specializing in B2B technology sales. Experienced in consultative selling and building relationships with technical decision makers.",
      status: "Published",
      knowledgeBases: [
        { id: "kb1", name: "Product Brochure.pdf", type: "PDF", size: "2.3 MB", lastUpdated: "2024-01-15" },
        { id: "kb2", name: "Company Website", type: "Website", url: "https://techzu.com", lastUpdated: "2024-01-14" }
      ],
      emailSignature: "Best regards,\nSales Pro AI\nTechZu Sales Team\nsales@techzu.com",
      mode: "Published",
      supervisorReview: true,
      campaignsAssigned: 5,
      emailsSent: 247,
      responseRate: 23.5,
      createdAt: "2024-01-10",
      lastActive: "2024-01-15"
    },
    {
      id: "2",
      name: "Healthcare Specialist",
      persona: "Healthcare industry specialist focused on helping medical practices improve their operations. Understands HIPAA compliance and healthcare workflows.",
      status: "Test",
      knowledgeBases: [
        { id: "kb3", name: "Healthcare Solutions.pdf", type: "PDF", size: "1.8 MB", lastUpdated: "2024-01-12" }
      ],
      emailSignature: "Best regards,\nHealthcare Specialist\nTechZu Healthcare Solutions\nhealthcare@techzu.com",
      mode: "Test",
      supervisorReview: true,
      campaignsAssigned: 2,
      emailsSent: 45,
      responseRate: 31.1,
      createdAt: "2024-01-12"
    },
    {
      id: "3",
      name: "Startup Outreach Bot",
      persona: "Energetic and casual AI agent perfect for reaching out to startups and small businesses. Speaks their language and understands their challenges.",
      status: "Draft",
      knowledgeBases: [],
      emailSignature: "Cheers,\nStartup Outreach Bot\nTechZu Growth Team\ngrowth@techzu.com",
      mode: "Test",
      supervisorReview: false,
      campaignsAssigned: 0,
      emailsSent: 0,
      responseRate: 0,
      createdAt: "2024-01-14"
    }
  ]);

  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [agentForm, setAgentForm] = useState({
    name: "",
    persona: "",
    emailSignature: "",
    mode: "Test" as "Test" | "Published",
    supervisorReview: true
  });

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Test": return "bg-yellow-100 text-yellow-800";
      case "Published": return "bg-green-100 text-green-800";
      case "Paused": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "Draft": return <Edit size={16} />;
      case "Test": return <TestTube size={16} />;
      case "Published": return <CheckCircle size={16} />;
      case "Paused": return <Pause size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setAgentForm({
      name: "",
      persona: "",
      emailSignature: "",
      mode: "Test",
      supervisorReview: true
    });
    setShowAgentModal(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentForm({
      name: agent.name,
      persona: agent.persona,
      emailSignature: agent.emailSignature,
      mode: agent.mode,
      supervisorReview: agent.supervisorReview
    });
    setShowAgentModal(true);
  };

  const handleSaveAgent = () => {
    if (selectedAgent) {
      // Update existing agent
      setAgents(prev => prev.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, ...agentForm }
          : agent
      ));
    } else {
      // Create new agent
      const newAgent: Agent = {
        id: Date.now().toString(),
        ...agentForm,
        status: "Draft",
        knowledgeBases: [],
        campaignsAssigned: 0,
        emailsSent: 0,
        responseRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAgents(prev => [...prev, newAgent]);
    }
    setShowAgentModal(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    }
  };

  const handleToggleStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        let newStatus: Agent["status"];
        switch (agent.status) {
          case "Draft": newStatus = "Test"; break;
          case "Test": newStatus = "Published"; break;
          case "Published": newStatus = "Paused"; break;
          case "Paused": newStatus = "Published"; break;
          default: newStatus = "Draft";
        }
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  return (
    <div className="agents">
      <div className="page-header">
        <div className="header-content">
          <h1>AI Agents</h1>
          <p>Configure and manage your AI sales agents</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary" onClick={handleCreateAgent}>
            <Plus size={20} />
            Create Agent
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div className="agent-info">
                <div className="agent-avatar">
                  <Bot size={24} />
                </div>
                <div className="agent-details">
                  <h3>{agent.name}</h3>
                  <span className={`status-badge ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    {agent.status}
                  </span>
                </div>
              </div>
              <div className="agent-actions">
                <button
                  className="action-icon"
                  onClick={() => handleEditAgent(agent)}
                  title="Edit Agent"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="action-icon"
                  onClick={() => setSelectedAgent(agent)}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="action-icon danger"
                  onClick={() => handleDeleteAgent(agent.id)}
                  title="Delete Agent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="agent-persona">
              <p>{agent.persona}</p>
            </div>

            <div className="agent-stats">
              <div className="stat-item">
                <span className="stat-label">Campaigns</span>
                <span className="stat-value">{agent.campaignsAssigned}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Emails Sent</span>
                <span className="stat-value">{agent.emailsSent}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Response Rate</span>
                <span className="stat-value">{agent.responseRate}%</span>
              </div>
            </div>

            <div className="agent-knowledge">
              <h4>Knowledge Base ({agent.knowledgeBases.length})</h4>
              <div className="knowledge-items">
                {agent.knowledgeBases.slice(0, 2).map((kb) => (
                  <div key={kb.id} className="knowledge-item">
                    {kb.type === "PDF" ? <FileText size={14} /> : <Globe size={14} />}
                    <span>{kb.name}</span>
                  </div>
                ))}
                {agent.knowledgeBases.length > 2 && (
                  <span className="more-items">+{agent.knowledgeBases.length - 2} more</span>
                )}
              </div>
            </div>

            <div className="agent-footer">
              <div className="agent-mode">
                <span className={`mode-badge ${agent.mode === "Published" ? "published" : "test"}`}>
                  {agent.mode === "Published" ? <Activity size={12} /> : <TestTube size={12} />}
                  {agent.mode} Mode
                </span>
                {agent.supervisorReview && (
                  <span className="review-badge">
                    <Eye size={12} />
                    Supervised
                  </span>
                )}
              </div>
              <button
                className={`toggle-btn ${agent.status === "Published" ? "active" : ""}`}
                onClick={() => handleToggleStatus(agent.id)}
              >
                {agent.status === "Published" ? <Pause size={16} /> : <Play size={16} />}
                {agent.status === "Published" ? "Pause" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Modal */}
      {showAgentModal && (
        <div className="modal-overlay" onClick={() => setShowAgentModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedAgent ? "Edit Agent" : "Create New Agent"}</h3>
              <button onClick={() => setShowAgentModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="agent-form">
                <div className="form-group">
                  <label>Agent Name</label>
                  <input
                    type="text"
                    value={agentForm.name}
                    onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                    placeholder="e.g., Sales Pro AI"
                  />
                </div>

                <div className="form-group">
                  <label>Persona & Bio</label>
                  <textarea
                    rows={4}
                    value={agentForm.persona}
                    onChange={(e) => setAgentForm({...agentForm, persona: e.target.value})}
                    placeholder="Describe the agent's personality, expertise, and communication style..."
                  />
                </div>

                <div className="form-group">
                  <label>Email Signature</label>
                  <textarea
                    rows={3}
                    value={agentForm.emailSignature}
                    onChange={(e) => setAgentForm({...agentForm, emailSignature: e.target.value})}
                    placeholder="Best regards,&#10;Agent Name&#10;Company Name&#10;email@company.com"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mode</label>
                    <select
                      value={agentForm.mode}
                      onChange={(e) => setAgentForm({...agentForm, mode: e.target.value as "Test" | "Published"})}
                    >
                      <option value="Test">Test Mode (Sandbox)</option>
                      <option value="Published">Published Mode (Live)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={agentForm.supervisorReview}
                        onChange={(e) => setAgentForm({...agentForm, supervisorReview: e.target.checked})}
                      />
                      Require supervisor review before sending
                    </label>
                  </div>
                </div>

                <div className="knowledge-section">
                  <div className="section-header">
                    <h4>Knowledge Base</h4>
                    <button
                      className="action-btn secondary small"
                      onClick={() => setShowKnowledgeModal(true)}
                    >
                      <Plus size={16} />
                      Add Knowledge
                    </button>
                  </div>
                  <div className="knowledge-list">
                    {selectedAgent?.knowledgeBases.map((kb) => (
                      <div key={kb.id} className="knowledge-item-large">
                        <div className="kb-icon">
                          {kb.type === "PDF" ? <FileText size={20} /> : <Globe size={20} />}
                        </div>
                        <div className="kb-info">
                          <h5>{kb.name}</h5>
                          <p>{kb.type} • {kb.size || "Web page"} • Updated {kb.lastUpdated}</p>
                        </div>
                        <button className="action-icon danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {(!selectedAgent?.knowledgeBases.length) && (
                      <div className="empty-state">
                        <Brain size={48} />
                        <p>No knowledge base items yet</p>
                        <span>Add documents or web pages to train your agent</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowAgentModal(false)}>
                Cancel
              </button>
              <button className="action-btn primary" onClick={handleSaveAgent}>
                <Save size={16} />
                {selectedAgent ? "Update Agent" : "Create Agent"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Modal */}
      {showKnowledgeModal && (
        <div className="modal-overlay" onClick={() => setShowKnowledgeModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Knowledge Base</h3>
              <button onClick={() => setShowKnowledgeModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="knowledge-options">
                <div className="knowledge-option">
                  <div className="option-icon">
                    <FileText size={32} />
                  </div>
                  <h4>Upload Documents</h4>
                  <p>Upload PDFs, brochures, pitch decks, or case studies</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    style={{ display: "none" }}
                    id="doc-upload"
                  />
                  <label htmlFor="doc-upload" className="upload-btn">
                    <Upload size={16} />
                    Choose Files
                  </label>
                </div>

                <div className="knowledge-option">
                  <div className="option-icon">
                    <Globe size={32} />
                  </div>
                  <h4>Web Pages</h4>
                  <p>Add company website, product pages, or documentation</p>
                  <div className="url-input">
                    <input
                      type="url"
                      placeholder="https://example.com"
                    />
                    <button className="action-btn primary small">Add</button>
                  </div>
                </div>

                <div className="knowledge-option">
                  <div className="option-icon">
                    <Edit size={32} />
                  </div>
                  <h4>Text Content</h4>
                  <p>Add custom text, FAQs, or product information</p>
                  <textarea
                    rows={4}
                    placeholder="Enter your custom knowledge content..."
                  />
                  <button className="action-btn primary small">
                    <Save size={16} />
                    Save Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail View */}
      {selectedAgent && !showAgentModal && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedAgent.name} - Details</h3>
              <button onClick={() => setSelectedAgent(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="agent-detail-view">
                <div className="detail-section">
                  <h4>Performance Metrics</h4>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon">
                        <Mail size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{selectedAgent.emailsSent}</h3>
                        <p>Emails Sent</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <Activity size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{selectedAgent.responseRate}%</h3>
                        <p>Response Rate</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <Settings size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{selectedAgent.campaignsAssigned}</h3>
                        <p>Active Campaigns</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Agent Configuration</h4>
                  <div className="config-grid">
                    <div className="config-item">
                      <span className="label">Status:</span>
                      <span className={`status-badge ${getStatusColor(selectedAgent.status)}`}>
                        {selectedAgent.status}
                      </span>
                    </div>
                    <div className="config-item">
                      <span className="label">Mode:</span>
                      <span className={`mode-badge ${selectedAgent.mode === "Published" ? "published" : "test"}`}>
                        {selectedAgent.mode}
                      </span>
                    </div>
                    <div className="config-item">
                      <span className="label">Supervisor Review:</span>
                      <span>{selectedAgent.supervisorReview ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div className="config-item">
                      <span className="label">Created:</span>
                      <span>{selectedAgent.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Persona</h4>
                  <p className="persona-text">{selectedAgent.persona}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
