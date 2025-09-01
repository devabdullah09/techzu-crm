const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface AnalyticsData {
  revenue: number;
  customers: number;
  conversion_rate: number;
  avg_deal_size: number;
  growth_rate: number;
  top_customers: Array<{
    name: string;
    revenue: number;
    deals: number;
    status: string;
  }>;
  insights: Array<{
    title: string;
    description: string;
  }>;
}

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/get_analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch analytics');
    }

    return response.json();
  },

  // Mock data for development - replace with real API calls
  async getMockAnalytics(): Promise<AnalyticsData> {
    return {
      revenue: 45678,
      customers: 1234,
      conversion_rate: 23,
      avg_deal_size: 12450,
      growth_rate: 18,
      top_customers: [
        { name: "TechCorp Inc", revenue: 8500, deals: 3, status: "Active" },
        { name: "Innovation Labs", revenue: 6200, deals: 2, status: "Active" },
        { name: "Global Solutions", revenue: 5800, deals: 2, status: "Active" },
        { name: "Future Tech", revenue: 4900, deals: 1, status: "Active" },
        { name: "Digital Dynamics", revenue: 4200, deals: 1, status: "Active" },
      ],
      insights: [
        {
          title: "Revenue Growth",
          description: "Your revenue has grown by 18% compared to last month, driven by increased customer acquisition."
        },
        {
          title: "Customer Retention",
          description: "Customer retention rate is at 85%, which is above industry average of 75%."
        },
        {
          title: "Conversion Optimization",
          description: "Lead conversion rate improved by 2% due to recent marketing campaign optimizations."
        }
      ]
    };
  }
};