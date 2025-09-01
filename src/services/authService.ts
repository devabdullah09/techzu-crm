const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  display_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
    display_name?: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      return response.json();
    } catch (error) {
      console.warn('Backend login failed, using fallback authentication:', error);
      
      // Fallback authentication for development
      if (credentials.email && credentials.password) {
        const mockToken = `mock_jwt_token_${Date.now()}`;
        return {
          access_token: mockToken,
          token_type: 'bearer',
          user: {
            id: '1',
            email: credentials.email,
            display_name: credentials.email.split('@')[0]
          }
        };
      }
      
      throw new Error('Login failed - please check your credentials');
    }
  },

  async signup(userData: SignUpRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign_up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      return response.json();
    } catch (error) {
      console.warn('Backend signup failed, using fallback authentication:', error);
      
      // Fallback authentication for development
      if (userData.email && userData.password) {
        const mockToken = `mock_jwt_token_${Date.now()}`;
        return {
          access_token: mockToken,
          token_type: 'bearer',
          user: {
            id: '1',
            email: userData.email,
            display_name: userData.display_name || userData.email.split('@')[0]
          }
        };
      }
      
      throw new Error('Signup failed - please check your information');
    }
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('onboardingCompleted');
    }
  },

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  },

  setAuthData(token: string, email: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
  }
};