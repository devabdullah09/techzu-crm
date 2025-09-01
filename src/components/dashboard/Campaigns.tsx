import { useState } from "react";
import {
  Plus,
  Play,
  Pause,
  Edit,
  Eye,
  Trash2,
  Users,
  Mail,
  BarChart3,
  Clock,
  Target,
  Send,
  X,
  Save,
  ArrowDown,
  Copy,
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface EmailStep {
  id: string;
  type: "email" | "delay" | "condition";
  subject?: string;
  body?: string;
  delayAmount?: number;
  delayUnit?: "minutes" | "hours" | "days";
  conditionType?: "response" | "open" | "click";
}

interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: "Draft" | "Active" | "Paused" | "Completed";
  agentId: string;
  agentName: string;
  leadCount: number;
  emailSequence: EmailStep[];
  metrics: {
    sent: number;
    opened: number;
    replied: number;
    clicked: number;
    bounced: number;
  };
  createdAt: string;
  launchedAt?: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Q1 SaaS Outreach",
      objective: "Generate leads for our SaaS platform targeting tech companies",
      status: "Active",
      agentId: "agent1",
      agentName: "Sales Pro AI",
      leadCount: 150,
      emailSequence: [
        {
          id: "e1",
          type: "email",
          subject: "Quick question about {{company}} tech stack",
          body: "Hi {{firstName}},\n\nI noticed {{company}} is growing fast in the {{industry}} space. We help similar companies streamline their operations with our platform.\n\nWould you be interested in a quick 15-minute call to see how we could help {{company}}?\n\nBest regards,\n{{agentName}}"
        },
        {
          id: "d1",
          type: "delay",
          delayAmount: 3,
          delayUnit: "days"
        },
        {
          id: "e2",
          type: "email",
          subject: "Following up - {{company}} operational efficiency",
          body: "Hi {{firstName}},\n\nI wanted to follow up on my previous email about helping {{company}} improve operational efficiency.\n\nWe've helped companies like yours reduce manual work by 40%. Here's a quick case study: [link]\n\nWould you like to schedule a brief call?\n\nBest,\n{{agentName}}"
        }
      ],
      metrics: {
        sent: 150,
        opened: 89,
        replied: 23,
        clicked: 12,
        bounced: 3
      },
      createdAt: "2024-01-10",
      launchedAt: "2024-01-12"
    },
    {
      id: "2",
      name: "Healthcare Follow-up",
      objective: "Follow up with healthcare prospects from conference",
      status: "Paused",
      agentId: "agent2",
      agentName: "Healthcare Specialist",
      leadCount: 45,
      emailSequence: [
        {
          id: "e1",
          type: "email",
          subject: "Great meeting you at HealthTech Conference",
          body: "Hi {{firstName}},\n\nIt was great meeting you at the HealthTech Conference last week. As promised, I'm following up about how we can help {{company}} with your patient management challenges.\n\nBest regards,\n{{agentName}}"
        }
      ],
      metrics: {
        sent: 45,
        opened: 31,
        replied: 8,
        clicked: 5,
        bounced: 1
      },
      createdAt: "2024-01-08",
      launchedAt: "2024-01-09"
    },
    {
      id: "3",
      name: "Startup Outreach 2024",
      objective: "Target early-stage startups for growth package",
      status: "Draft",
      agentId: "agent3",
      agentName: "Startup Outreach Bot",
      leadCount: 0,
      emailSequence: [],
      metrics: {
        sent: 0,
        opened: 0,
        replied: 0,
        clicked: 0,
        bounced: 0
      },
      createdAt: "2024-01-14"
    }
  ]);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showSequenceBuilder, setShowSequenceBuilder] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    objective: "",
    agentId: "",
    leadIds: [] as string[]
  });

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Active": return "bg-green-100 text-green-800";
      case "Paused": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "Draft": return <Edit size={16} />;
      case "Active": return <Play size={16} />;
      case "Paused": return <Pause size={16} />;
      case "Completed": return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const calculateMetrics = (campaign: Campaign) => {
    const { sent, opened, replied, clicked } = campaign.metrics;
    return {
      openRate: sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0",
      replyRate: sent > 0 ? ((replied / sent) * 100).toFixed(1) : "0",
      clickRate: sent > 0 ? ((clicked / sent) * 100).toFixed(1) : "0"
    };
  };

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setCampaignForm({
      name: "",
      objective: "",
      agentId: "",
      leadIds: []
    });
    setShowCampaignModal(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCampaignForm({
      name: campaign.name,
      objective: campaign.objective,
      agentId: campaign.agentId,
      leadIds: []
    });
    setShowCampaignModal(true);
  };

  const handleToggleStatus = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        let newStatus: Campaign["status"];
        switch (campaign.status) {
          case "Draft": newStatus = "Active"; break;
          case "Active": newStatus = "Paused"; break;
          case "Paused": newStatus = "Active"; break;
          default: newStatus = campaign.status;
        }
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    }
  };

  const renderEmailSequence = (sequence: EmailStep[]) => {
    return (
      <div className="sequence-flow">
        {sequence.map((step, index) => (
          <div key={step.id} className="sequence-step">
            {step.type === "email" && (
              <div className="email-step">
                <div className="step-icon">
                  <Mail size={16} />
                </div>
                <div className="step-content">
                  <h4>Email {Math.floor(index / 2) + 1}</h4>
                  <p>{step.subject}</p>
                </div>
              </div>
            )}
            {step.type === "delay" && (
              <div className="delay-step">
                <div className="step-icon">
                  <Clock size={16} />
                </div>
                <div className="step-content">
                  <span>Wait {step.delayAmount} {step.delayUnit}</span>
                </div>
              </div>
            )}
            {index < sequence.length - 1 && (
              <div className="sequence-arrow">
                <ArrowDown size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="campaigns">
      <div className="page-header">
        <div className="header-content">
          <h1>Campaigns</h1>
          <p>Create and manage your email outreach campaigns</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary" onClick={handleCreateCampaign}>
            <Plus size={20} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="campaigns-grid">
        {campaigns.map((campaign) => {
          const metrics = calculateMetrics(campaign);
          return (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <div className="campaign-info">
                  <h3>{campaign.name}</h3>
                  <span className={`status-badge ${getStatusColor(campaign.status)}`}>
                    {getStatusIcon(campaign.status)}
                    {campaign.status}
                  </span>
                </div>
                <div className="campaign-actions">
                  <button
                    className="action-icon"
                    onClick={() => handleEditCampaign(campaign)}
                    title="Edit Campaign"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-icon"
                    onClick={() => setSelectedCampaign(campaign)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="action-icon danger"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    title="Delete Campaign"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="campaign-objective">
                <p>{campaign.objective}</p>
              </div>

              <div className="campaign-meta">
                <div className="meta-item">
                  <Users size={14} />
                  <span>{campaign.leadCount} leads</span>
                </div>
                <div className="meta-item">
                  <Target size={14} />
                  <span>{campaign.agentName}</span>
                </div>
                <div className="meta-item">
                  <Mail size={14} />
                  <span>{campaign.emailSequence.filter(s => s.type === "email").length} emails</span>
                </div>
              </div>

              {campaign.status !== "Draft" && (
                <div className="campaign-metrics">
                  <div className="metric-row">
                    <div className="metric-item">
                      <span className="metric-label">Sent</span>
                      <span className="metric-value">{campaign.metrics.sent}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Open Rate</span>
                      <span className="metric-value">{metrics.openRate}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Reply Rate</span>
                      <span className="metric-value">{metrics.replyRate}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="campaign-footer">
                <div className="campaign-dates">
                  <span>Created: {campaign.createdAt}</span>
                  {campaign.launchedAt && (
                    <span>Launched: {campaign.launchedAt}</span>
                  )}
                </div>
                <button
                  className={`toggle-btn ${campaign.status === "Active" ? "active" : ""}`}
                  onClick={() => handleToggleStatus(campaign.id)}
                  disabled={campaign.status === "Completed"}
                >
                  {campaign.status === "Active" ? <Pause size={16} /> : <Play size={16} />}
                  {campaign.status === "Active" ? "Pause" : "Start"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <div className="modal-overlay" onClick={() => setShowCampaignModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCampaign ? "Edit Campaign" : "Create New Campaign"}</h3>
              <button onClick={() => setShowCampaignModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="campaign-wizard">
                <div className="wizard-step">
                  <h4>Campaign Details</h4>
                  <div className="form-group">
                    <label>Campaign Name</label>
                    <input
                      type="text"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                      placeholder="e.g., Q1 SaaS Outreach"
                    />
                  </div>
                  <div className="form-group">
                    <label>Objective</label>
                    <textarea
                      rows={3}
                      value={campaignForm.objective}
                      onChange={(e) => setCampaignForm({...campaignForm, objective: e.target.value})}
                      placeholder="Describe the goal of this campaign..."
                    />
                  </div>
                </div>

                <div className="wizard-step">
                  <h4>Assign Agent</h4>
                  <div className="agent-selection">
                    <select
                      value={campaignForm.agentId}
                      onChange={(e) => setCampaignForm({...campaignForm, agentId: e.target.value})}
                    >
                      <option value="">Select an agent</option>
                      <option value="agent1">Sales Pro AI</option>
                      <option value="agent2">Healthcare Specialist</option>
                      <option value="agent3">Startup Outreach Bot</option>
                    </select>
                  </div>
                </div>

                <div className="wizard-step">
                  <h4>Assign Leads</h4>
                  <div className="lead-selection">
                    <button className="action-btn secondary">
                      <Users size={16} />
                      Select from Leads ({campaignForm.leadIds.length} selected)
                    </button>
                    <p className="help-text">Choose leads from your leads database to target with this campaign</p>
                  </div>
                </div>

                <div className="wizard-step">
                  <h4>Email Sequence</h4>
                  <div className="sequence-preview">
                    {selectedCampaign && selectedCampaign.emailSequence.length > 0 ? (
                      renderEmailSequence(selectedCampaign.emailSequence)
                    ) : (
                      <div className="empty-sequence">
                        <Mail size={48} />
                        <p>No email sequence created yet</p>
                        <button
                          className="action-btn primary"
                          onClick={() => setShowSequenceBuilder(true)}
                        >
                          <Plus size={16} />
                          Build Email Sequence
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowCampaignModal(false)}>
                Cancel
              </button>
              <button className="action-btn primary">
                <Save size={16} />
                {selectedCampaign ? "Update Campaign" : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Sequence Builder Modal */}
      {showSequenceBuilder && (
        <div className="modal-overlay" onClick={() => setShowSequenceBuilder(false)}>
          <div className="modal extra-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Email Sequence Builder</h3>
              <button onClick={() => setShowSequenceBuilder(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="sequence-builder">
                <div className="builder-toolbar">
                  <button className="tool-btn">
                    <Mail size={16} />
                    Add Email
                  </button>
                  <button className="tool-btn">
                    <Clock size={16} />
                    Add Delay
                  </button>
                  <button className="tool-btn">
                    <Settings size={16} />
                    Add Condition
                  </button>
                </div>

                <div className="sequence-canvas">
                  <div className="canvas-step">
                    <div className="step-card">
                      <div className="step-header">
                        <Mail size={20} />
                        <h4>Email 1 - Initial Outreach</h4>
                        <button className="action-icon">
                          <Edit size={16} />
                        </button>
                      </div>
                      <div className="step-content">
                        <div className="form-group">
                          <label>Subject Line</label>
                          <input
                            type="text"
                            placeholder="Quick question about {{company}} tech stack"
                          />
                        </div>
                        <div className="form-group">
                          <label>Email Body</label>
                          <textarea
                            rows={8}
                            placeholder="Hi {{firstName}},&#10;&#10;I noticed {{company}} is growing fast..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="canvas-connector">
                    <ArrowDown size={24} />
                  </div>

                  <div className="canvas-step">
                    <div className="step-card delay">
                      <div className="step-header">
                        <Clock size={20} />
                        <h4>Wait Period</h4>
                        <button className="action-icon">
                          <Edit size={16} />
                        </button>
                      </div>
                      <div className="step-content">
                        <div className="delay-controls">
                          <input type="number" value={3} min={1} />
                          <select>
                            <option value="days">Days</option>
                            <option value="hours">Hours</option>
                            <option value="minutes">Minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="add-step">
                    <button className="add-step-btn">
                      <Plus size={20} />
                      Add Next Step
                    </button>
                  </div>
                </div>

                <div className="builder-sidebar">
                  <h4>Available Variables</h4>
                  <div className="variables-list">
                    <div className="variable-item" title="Contact's first name">
                      <code>{"{{firstName}}"}</code>
                      <span>First Name</span>
                    </div>
                    <div className="variable-item" title="Contact's last name">
                      <code>{"{{lastName}}"}</code>
                      <span>Last Name</span>
                    </div>
                    <div className="variable-item" title="Company name">
                      <code>{"{{company}}"}</code>
                      <span>Company</span>
                    </div>
                    <div className="variable-item" title="Contact's role/title">
                      <code>{"{{role}}"}</code>
                      <span>Role</span>
                    </div>
                    <div className="variable-item" title="Industry">
                      <code>{"{{industry}}"}</code>
                      <span>Industry</span>
                    </div>
                    <div className="variable-item" title="Agent name">
                      <code>{"{{agentName}}"}</code>
                      <span>Agent Name</span>
                    </div>
                  </div>

                  <h4 style={{marginTop: "2rem"}}>Email Templates</h4>
                  <div className="templates-list">
                    <button className="template-item">
                      <Copy size={16} />
                      Cold Outreach
                    </button>
                    <button className="template-item">
                      <Copy size={16} />
                      Follow-up
                    </button>
                    <button className="template-item">
                      <Copy size={16} />
                      Meeting Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowSequenceBuilder(false)}>
                Cancel
              </button>
              <button className="action-btn primary">
                <Save size={16} />
                Save Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail View */}
      {selectedCampaign && !showCampaignModal && (
        <div className="modal-overlay" onClick={() => setSelectedCampaign(null)}>
          <div className="modal extra-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCampaign.name} - Campaign Details</h3>
              <button onClick={() => setSelectedCampaign(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="campaign-detail-view">
                <div className="detail-section">
                  <h4>Performance Overview</h4>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon">
                        <Send size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{selectedCampaign.metrics.sent}</h3>
                        <p>Emails Sent</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <Eye size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{calculateMetrics(selectedCampaign).openRate}%</h3>
                        <p>Open Rate</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <Mail size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{calculateMetrics(selectedCampaign).replyRate}%</h3>
                        <p>Reply Rate</p>
                      </div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">
                        <BarChart3 size={24} />
                      </div>
                      <div className="metric-content">
                        <h3>{calculateMetrics(selectedCampaign).clickRate}%</h3>
                        <p>Click Rate</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Email Sequence</h4>
                  {renderEmailSequence(selectedCampaign.emailSequence)}
                </div>

                <div className="detail-section">
                  <h4>Campaign Timeline</h4>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <Plus size={16} />
                      </div>
                      <div className="timeline-content">
                        <h5>Campaign Created</h5>
                        <p>{selectedCampaign.createdAt}</p>
                      </div>
                    </div>
                    {selectedCampaign.launchedAt && (
                      <div className="timeline-item">
                        <div className="timeline-icon">
                          <Play size={16} />
                        </div>
                        <div className="timeline-content">
                          <h5>Campaign Launched</h5>
                          <p>{selectedCampaign.launchedAt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
