const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  companySize: string;
  location: string;
  industry: string;
  phone?: string;
  website?: string;
  source: "Manual" | "Scraped" | "CRM Sync" | "CSV Upload";
  tags: string[];
  status: "New" | "Contacted" | "Interested" | "Not Interested";
  lastContact?: string;
}

export interface LeadSearchRequest {
  query: string;
}

export interface LeadAugmentRequest {
  uen: string;
}

export const leadsService = {
  async searchLeads(query: string): Promise<Lead[]> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/search_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to search leads');
    }

    return response.json();
  },

  async augmentLead(uen: string): Promise<any> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/augment_lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ uen }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to augment lead');
    }

    return response.json();
  },

  // Mock data for development - replace with real API calls
  async getLeads(): Promise<Lead[]> {
    // For now, return mock data. Replace with actual API call when available
    return [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@techcorp.com",
        company: "TechCorp Inc",
        role: "CEO",
        companySize: "50-100",
        location: "San Francisco, CA",
        industry: "Technology",
        phone: "+1 (555) 123-4567",
        website: "https://techcorp.com",
        source: "Manual",
        tags: ["High Priority", "Enterprise"],
        status: "New"
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@innovate.io",
        company: "Innovate Labs",
        role: "CTO",
        companySize: "10-50",
        location: "Austin, TX",
        industry: "Technology",
        source: "Scraped",
        tags: ["Tech Startup"],
        status: "Contacted",
        lastContact: "2024-01-15"
      },
      {
        id: "3",
        name: "Michael Brown",
        email: "m.brown@globalhealth.com",
        company: "Global Health Solutions",
        role: "VP Sales",
        companySize: "200-500",
        location: "Boston, MA",
        industry: "Healthcare",
        source: "CRM Sync",
        tags: ["Healthcare", "Enterprise"],
        status: "Interested",
        lastContact: "2024-01-12"
      }
    ];
  }
};