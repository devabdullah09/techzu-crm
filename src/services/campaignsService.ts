const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface EmailSendRequest {
  lead_data: Record<string, any>;
  kb_id: string;
  sales_approach: string;
  to_email?: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: "Draft" | "Active" | "Paused" | "Completed";
  agentId: string;
  agentName: string;
  leadCount: number;
  emailSequence: any[];
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

export const campaignsService = {
  async sendEmail(emailData: EmailSendRequest): Promise<any> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/send_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send email');
    }

    return response.json();
  },

  // Mock data for development - replace with real API calls
  async getCampaigns(): Promise<Campaign[]> {
    return [
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
      }
    ];
  }
};