import { useState } from "react";
import {
  Search,
  Mail,
  Calendar,
  Phone,
  Eye,
  Reply,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  X,
  Send,
  User,
  Building
} from "lucide-react";

interface EmailThread {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  status: "sent" | "opened" | "replied";
  response?: string;
  respondedAt?: string;
}

interface FollowUp {
  id: string;
  contactName: string;
  contactEmail: string;
  company: string;
  campaignName: string;
  lastEmailSent: string;
  lastEmailSubject: string;
  response?: string;
  intent: "Interested" | "Neutral" | "Not Interested" | "Need Info" | "No Response";
  nextStep: "Follow-up Email" | "Schedule Call" | "Send Proposal" | "Close" | "Wait";
  priority: "High" | "Medium" | "Low";
  emailThread: EmailThread[];
  tags: string[];
  agentName: string;
  createdAt: string;
}

const Followups = () => {
  const [followups, setFollowups] = useState<FollowUp[]>([
    {
      id: "1",
      contactName: "John Smith",
      contactEmail: "john.smith@techcorp.com",
      company: "TechCorp Inc",
      campaignName: "Q1 SaaS Outreach",
      lastEmailSent: "2024-01-15",
      lastEmailSubject: "Following up - TechCorp operational efficiency",
      response: "Hi there! This looks interesting. Can you send me more details about pricing and implementation timeline?",
      intent: "Interested",
      nextStep: "Send Proposal",
      priority: "High",
      emailThread: [
        {
          id: "e1",
          subject: "Quick question about TechCorp tech stack",
          body: "Hi John,\n\nI noticed TechCorp is growing fast in the technology space...",
          sentAt: "2024-01-12",
          status: "opened"
        },
        {
          id: "e2",
          subject: "Following up - TechCorp operational efficiency",
          body: "Hi John,\n\nI wanted to follow up on my previous email...",
          sentAt: "2024-01-15",
          status: "replied",
          response: "Hi there! This looks interesting. Can you send me more details about pricing and implementation timeline?",
          respondedAt: "2024-01-15"
        }
      ],
      tags: ["Hot Lead", "Enterprise"],
      agentName: "Sales Pro AI",
      createdAt: "2024-01-12"
    },
    {
      id: "2",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.j@innovate.io",
      company: "Innovate Labs",
      campaignName: "Q1 SaaS Outreach",
      lastEmailSent: "2024-01-14",
      lastEmailSubject: "Quick question about Innovate Labs tech stack",
      response: "Thanks for reaching out, but we're not looking for new solutions right now.",
      intent: "Not Interested",
      nextStep: "Close",
      priority: "Low",
      emailThread: [
        {
          id: "e3",
          subject: "Quick question about Innovate Labs tech stack",
          body: "Hi Sarah,\n\nI noticed Innovate Labs is growing fast...",
          sentAt: "2024-01-14",
          status: "replied",
          response: "Thanks for reaching out, but we're not looking for new solutions right now.",
          respondedAt: "2024-01-14"
        }
      ],
      tags: ["Not Interested"],
      agentName: "Sales Pro AI",
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      contactName: "Michael Brown",
      contactEmail: "m.brown@globalhealth.com",
      company: "Global Health Solutions",
      campaignName: "Healthcare Follow-up",
      lastEmailSent: "2024-01-13",
      lastEmailSubject: "Great meeting you at HealthTech Conference",
      intent: "No Response",
      nextStep: "Follow-up Email",
      priority: "Medium",
      emailThread: [
        {
          id: "e4",
          subject: "Great meeting you at HealthTech Conference",
          body: "Hi Michael,\n\nIt was great meeting you at the HealthTech Conference...",
          sentAt: "2024-01-13",
          status: "opened"
        }
      ],
      tags: ["Healthcare", "Conference Lead"],
      agentName: "Healthcare Specialist",
      createdAt: "2024-01-13"
    }
  ]);

  const [selectedFollowup, setSelectedFollowup] = useState<FollowUp | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({
    intent: "",
    priority: "",
    nextStep: "",
    campaign: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [emailDraft, setEmailDraft] = useState({
    subject: "",
    body: ""
  });

  // Filter followups based on search and filters
  const filteredFollowups = followups.filter(followup => {
    const matchesSearch = 
      followup.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followup.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followup.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.intent || followup.intent === filters.intent) &&
      (!filters.priority || followup.priority === filters.priority) &&
      (!filters.nextStep || followup.nextStep === filters.nextStep) &&
      (!filters.campaign || followup.campaignName === filters.campaign);

    return matchesSearch && matchesFilters;
  });

  const getIntentColor = (intent: FollowUp["intent"]) => {
    switch (intent) {
      case "Interested": return "bg-green-100 text-green-800";
      case "Neutral": return "bg-yellow-100 text-yellow-800";
      case "Not Interested": return "bg-red-100 text-red-800";
      case "Need Info": return "bg-blue-100 text-blue-800";
      case "No Response": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIntentIcon = (intent: FollowUp["intent"]) => {
    switch (intent) {
      case "Interested": return <ThumbsUp size={14} />;
      case "Neutral": return <Minus size={14} />;
      case "Not Interested": return <ThumbsDown size={14} />;
      case "Need Info": return <AlertCircle size={14} />;
      case "No Response": return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getPriorityColor = (priority: FollowUp["priority"]) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getNextStepIcon = (nextStep: FollowUp["nextStep"]) => {
    switch (nextStep) {
      case "Follow-up Email": return <Mail size={14} />;
      case "Schedule Call": return <Calendar size={14} />;
      case "Send Proposal": return <Send size={14} />;
      case "Close": return <CheckCircle size={14} />;
      case "Wait": return <Clock size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const handleComposeEmail = (followup: FollowUp) => {
    setSelectedFollowup(followup);
    setEmailDraft({
      subject: `Re: ${followup.lastEmailSubject}`,
      body: `Hi ${followup.contactName.split(" ")[0]},\n\n`
    });
    setShowComposeModal(true);
  };

  const handleBookMeeting = (followup: FollowUp) => {
    setSelectedFollowup(followup);
    setShowBookingModal(true);
  };

  const handleSendEmail = () => {
    if (selectedFollowup) {
      // Add new email to thread
      const newEmail: EmailThread = {
        id: Date.now().toString(),
        subject: emailDraft.subject,
        body: emailDraft.body,
        sentAt: new Date().toISOString().split('T')[0],
        status: "sent"
      };

      setFollowups(prev => prev.map(f => 
        f.id === selectedFollowup.id 
          ? { 
              ...f, 
              emailThread: [...f.emailThread, newEmail],
              lastEmailSent: newEmail.sentAt,
              lastEmailSubject: newEmail.subject
            }
          : f
      ));
    }
    setShowComposeModal(false);
  };

  const handleUpdateIntent = (followupId: string, newIntent: FollowUp["intent"]) => {
    setFollowups(prev => prev.map(f => 
      f.id === followupId ? { ...f, intent: newIntent } : f
    ));
  };

  const handleUpdateNextStep = (followupId: string, newNextStep: FollowUp["nextStep"]) => {
    setFollowups(prev => prev.map(f => 
      f.id === followupId ? { ...f, nextStep: newNextStep } : f
    ));
  };

  return (
    <div className="followups">
      <div className="page-header">
        <div className="header-content">
          <h1>Follow-ups</h1>
          <p>Manage ongoing conversations and follow-up sequences</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search contacts, companies, or campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-row">
          <select
            value={filters.intent}
            onChange={(e) => setFilters({...filters, intent: e.target.value})}
          >
            <option value="">All Intent</option>
            <option value="Interested">Interested</option>
            <option value="Neutral">Neutral</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Need Info">Need Info</option>
            <option value="No Response">No Response</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
          >
            <option value="">All Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={filters.nextStep}
            onChange={(e) => setFilters({...filters, nextStep: e.target.value})}
          >
            <option value="">All Next Steps</option>
            <option value="Follow-up Email">Follow-up Email</option>
            <option value="Schedule Call">Schedule Call</option>
            <option value="Send Proposal">Send Proposal</option>
            <option value="Close">Close</option>
            <option value="Wait">Wait</option>
          </select>

          <select
            value={filters.campaign}
            onChange={(e) => setFilters({...filters, campaign: e.target.value})}
          >
            <option value="">All Campaigns</option>
            <option value="Q1 SaaS Outreach">Q1 SaaS Outreach</option>
            <option value="Healthcare Follow-up">Healthcare Follow-up</option>
          </select>

          <button
            className="filter-btn"
            onClick={() => setFilters({intent: "", priority: "", nextStep: "", campaign: ""})}
          >
            <X size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Follow-ups Table */}
      <div className="table-container">
        <table className="followups-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Last Email</th>
              <th>Response</th>
              <th>Intent</th>
              <th>Next Step</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFollowups.map((followup) => (
              <tr key={followup.id}>
                <td>
                  <div className="contact-info">
                    <div className="contact-details">
                      <strong>{followup.contactName}</strong>
                      <div className="contact-meta">
                        <span className="email">{followup.contactEmail}</span>
                        <span className="company">
                          <Building size={12} />
                          {followup.company}
                        </span>
                      </div>
                    </div>
                    <div className="contact-tags">
                      {followup.tags.map((tag, index) => (
                        <span key={index} className="tag small">{tag}</span>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="email-info">
                    <div className="email-subject">{followup.lastEmailSubject}</div>
                    <div className="email-meta">
                      <span>{followup.lastEmailSent}</span>
                      <span className="agent">by {followup.agentName}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="response-info">
                    {followup.response ? (
                      <div className="response-preview">
                        <p>"{followup.response.substring(0, 80)}..."</p>
                      </div>
                    ) : (
                      <span className="no-response">No response yet</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="intent-cell">
                    <span className={`status-badge ${getIntentColor(followup.intent)}`}>
                      {getIntentIcon(followup.intent)}
                      {followup.intent}
                    </span>
                    <select
                      value={followup.intent}
                      onChange={(e) => handleUpdateIntent(followup.id, e.target.value as FollowUp["intent"])}
                      className="intent-selector"
                    >
                      <option value="Interested">Interested</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Need Info">Need Info</option>
                      <option value="No Response">No Response</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div className="next-step-cell">
                    <span className="next-step-badge">
                      {getNextStepIcon(followup.nextStep)}
                      {followup.nextStep}
                    </span>
                    <select
                      value={followup.nextStep}
                      onChange={(e) => handleUpdateNextStep(followup.id, e.target.value as FollowUp["nextStep"])}
                      className="next-step-selector"
                    >
                      <option value="Follow-up Email">Follow-up Email</option>
                      <option value="Schedule Call">Schedule Call</option>
                      <option value="Send Proposal">Send Proposal</option>
                      <option value="Close">Close</option>
                      <option value="Wait">Wait</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div className="priority-indicator">
                    <div className={`priority-dot ${getPriorityColor(followup.priority)}`}></div>
                    <span>{followup.priority}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-icon"
                      onClick={() => setSelectedFollowup(followup)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => handleComposeEmail(followup)}
                      title="Send Email"
                    >
                      <Reply size={16} />
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => handleBookMeeting(followup)}
                      title="Book Meeting"
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Compose Modal */}
      {showComposeModal && selectedFollowup && (
        <div className="modal-overlay" onClick={() => setShowComposeModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Compose Follow-up Email</h3>
              <button onClick={() => setShowComposeModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="compose-form">
                <div className="form-group">
                  <label>To</label>
                  <div className="recipient-info">
                    <User size={16} />
                    <span>{selectedFollowup.contactName} ({selectedFollowup.contactEmail})</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={emailDraft.subject}
                    onChange={(e) => setEmailDraft({...emailDraft, subject: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={10}
                    value={emailDraft.body}
                    onChange={(e) => setEmailDraft({...emailDraft, body: e.target.value})}
                    placeholder="Compose your follow-up email..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowComposeModal(false)}>
                Cancel
              </button>
              <button className="action-btn primary" onClick={handleSendEmail}>
                <Send size={16} />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Booking Modal */}
      {showBookingModal && selectedFollowup && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Meeting</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="booking-form">
                <div className="form-group">
                  <label>Contact</label>
                  <div className="contact-display">
                    <User size={16} />
                    <span>{selectedFollowup.contactName} - {selectedFollowup.company}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Meeting Title</label>
                  <input
                    type="text"
                    placeholder="Discovery Call with TechCorp"
                  />
                </div>
                <div className="form-group">
                  <label>Meeting Type</label>
                  <select>
                    <option>Discovery Call</option>
                    <option>Demo</option>
                    <option>Follow-up</option>
                    <option>Proposal Review</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration</label>
                    <select>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Time Zone</label>
                    <select>
                      <option>EST (Eastern)</option>
                      <option>PST (Pacific)</option>
                      <option>CST (Central)</option>
                      <option>MST (Mountain)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Suggested Times</label>
                  <textarea
                    rows={3}
                    placeholder="I'm available on Tuesday at 2 PM or Wednesday at 10 AM. What works best for you?"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-btn secondary" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button className="action-btn primary">
                <Calendar size={16} />
                Send Meeting Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Detail View */}
      {selectedFollowup && !showComposeModal && !showBookingModal && (
        <div className="modal-overlay" onClick={() => setSelectedFollowup(null)}>
          <div className="modal extra-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Conversation with {selectedFollowup.contactName}</h3>
              <button onClick={() => setSelectedFollowup(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="followup-detail-view">
                <div className="contact-overview">
                  <div className="contact-info-large">
                    <h2>{selectedFollowup.contactName}</h2>
                    <p>{selectedFollowup.company}</p>
                    <div className="contact-meta-large">
                      <span>{selectedFollowup.contactEmail}</span>
                      <span className="campaign-ref">from {selectedFollowup.campaignName}</span>
                    </div>
                  </div>
                  <div className="status-overview">
                    <div className="status-item">
                      <span className="label">Intent:</span>
                      <span className={`status-badge ${getIntentColor(selectedFollowup.intent)}`}>
                        {getIntentIcon(selectedFollowup.intent)}
                        {selectedFollowup.intent}
                      </span>
                    </div>
                    <div className="status-item">
                      <span className="label">Next Step:</span>
                      <span className="next-step-badge">
                        {getNextStepIcon(selectedFollowup.nextStep)}
                        {selectedFollowup.nextStep}
                      </span>
                    </div>
                    <div className="status-item">
                      <span className="label">Priority:</span>
                      <div className="priority-indicator">
                        <div className={`priority-dot ${getPriorityColor(selectedFollowup.priority)}`}></div>
                        <span>{selectedFollowup.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="email-thread">
                  <h4>Email Conversation</h4>
                  <div className="thread-list">
                    {selectedFollowup.emailThread.map((email) => (
                      <div key={email.id} className="thread-item">
                        <div className="thread-header">
                          <div className="thread-meta">
                            <strong>{email.subject}</strong>
                            <span className="timestamp">{email.sentAt}</span>
                          </div>
                          <span className={`email-status ${email.status}`}>
                            {email.status === "sent" && <Clock size={14} />}
                            {email.status === "opened" && <Eye size={14} />}
                            {email.status === "replied" && <Reply size={14} />}
                            {email.status}
                          </span>
                        </div>
                        <div className="thread-body">
                          <div className="sent-email">
                            <div className="email-sender">
                              <strong>{selectedFollowup.agentName}</strong>
                              <span>to {selectedFollowup.contactName}</span>
                            </div>
                            <div className="email-content">
                              {email.body}
                            </div>
                          </div>
                          {email.response && (
                            <div className="reply-email">
                              <div className="email-sender">
                                <strong>{selectedFollowup.contactName}</strong>
                                <span>{email.respondedAt}</span>
                              </div>
                              <div className="email-content">
                                {email.response}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="quick-actions-section">
                  <h4>Quick Actions</h4>
                  <div className="action-buttons-large">
                    <button
                      className="action-btn primary"
                      onClick={() => handleComposeEmail(selectedFollowup)}
                    >
                      <Reply size={16} />
                      Send Follow-up
                    </button>
                    <button
                      className="action-btn secondary"
                      onClick={() => handleBookMeeting(selectedFollowup)}
                    >
                      <Calendar size={16} />
                      Book Meeting
                    </button>
                    <button className="action-btn secondary">
                      <Phone size={16} />
                      Schedule Call
                    </button>
                    <button className="action-btn secondary">
                      <Send size={16} />
                      Send Proposal
                    </button>
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

export default Followups;
