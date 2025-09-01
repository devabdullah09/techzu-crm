const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export const testApiService = {
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Check if the API is responding but database has issues
        if (data.status === 'healthy' && data.database) {
          return true; // API is up, even if database has issues
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  },

  async testAuth(): Promise<boolean> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/test-db`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Auth test failed:', error);
      return false;
    }
  }
};