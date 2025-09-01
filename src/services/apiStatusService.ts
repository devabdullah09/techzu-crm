const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface EndpointStatus {
  endpoint: string;
  method: string;
  status: 'working' | 'error' | 'not_implemented';
  response?: any;
  error?: string;
}

export interface ApiStatusReport {
  overall: 'healthy' | 'partial' | 'unhealthy';
  endpoints: EndpointStatus[];
  summary: string;
}

export const apiStatusService = {
  async checkAllEndpoints(): Promise<ApiStatusReport> {
    const endpoints = [
      { path: '/health', method: 'GET', name: 'Health Check' },
      { path: '/auth/login', method: 'POST', name: 'Login' },
      { path: '/auth/sign_up', method: 'POST', name: 'Sign Up' },
      { path: '/auth/logout', method: 'POST', name: 'Logout' },
      { path: '/owners/onboarding', method: 'POST', name: 'Onboarding' },
      { path: '/search_leads', method: 'POST', name: 'Search Leads' },
      { path: '/augment_lead', method: 'POST', name: 'Augment Lead' },
      { path: '/send_email', method: 'POST', name: 'Send Email' },
      { path: '/get_analytics', method: 'GET', name: 'Get Analytics' },
      { path: '/store_knowledge_base', method: 'POST', name: 'Store Knowledge Base' },
      { path: '/get_knowledge_bases', method: 'GET', name: 'Get Knowledge Bases' },
      { path: '/owners/targeting_profile', method: 'POST', name: 'Targeting Profile' },
      { path: '/webhooks/whatsapp', method: 'POST', name: 'WhatsApp Webhook' },
      { path: '/init-db', method: 'POST', name: 'Initialize Database' },
      { path: '/test-db', method: 'GET', name: 'Test Database' },
    ];

    const results: EndpointStatus[] = [];
    let workingCount = 0;
    let errorCount = 0;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: endpoint.method !== 'GET' ? JSON.stringify({ test: true }) : undefined,
        });

        if (response.ok) {
          results.push({
            endpoint: endpoint.name,
            method: endpoint.method,
            status: 'working',
            response: { status: response.status, statusText: response.statusText }
          });
          workingCount++;
        } else {
          results.push({
            endpoint: endpoint.name,
            method: endpoint.method,
            status: 'error',
            error: `HTTP ${response.status}: ${response.statusText}`
          });
          errorCount++;
        }
      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          method: endpoint.method,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }
    }

    // Determine overall status
    let overall: 'healthy' | 'partial' | 'unhealthy';
    if (errorCount === 0) {
      overall = 'healthy';
    } else if (workingCount > errorCount) {
      overall = 'partial';
    } else {
      overall = 'unhealthy';
    }

    // Generate summary
    const summary = `API Status: ${workingCount} working, ${errorCount} errors. Overall: ${overall}`;

    return {
      overall,
      endpoints: results,
      summary
    };
  },

  async testSpecificEndpoint(path: string, method: string = 'GET', body?: any): Promise<EndpointStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        return {
          endpoint: path,
          method,
          status: 'working',
          response: { status: response.status, statusText: response.statusText }
        };
      } else {
        return {
          endpoint: path,
          method,
          status: 'error',
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        endpoint: path,
        method,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};
