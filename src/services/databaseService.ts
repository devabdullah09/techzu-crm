const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export const databaseService = {
  async initializeDatabase(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/init-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.ok) {
        console.log('Database initialized successfully');
        return true;
      } else {
        const error = await response.json();
        console.error('Database initialization failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  },

  async resetDatabase(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.ok) {
        console.log('Database reset successfully');
        return true;
      } else {
        const error = await response.json();
        console.error('Database reset failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Database reset error:', error);
      return false;
    }
  },

  async checkDatabaseStatus(): Promise<{ status: string; message: string }> {
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
        return {
          status: data.status || 'unknown',
          message: data.database?.message || 'Database status unknown'
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to check database status'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Database check failed: ${error}`
      };
    }
  }
};
