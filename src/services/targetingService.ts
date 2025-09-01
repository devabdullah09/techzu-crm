const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface TargetingProfile {
  target_industries: string[];
  employee_size_min: number;
  employee_size_max: number;
  target_locations: string[];
  [key: string]: any; // Allow additional properties
}

export const targetingService = {
  async saveTargetingProfile(profile: TargetingProfile): Promise<any> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/owners/targeting_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to save targeting profile');
    }

    return response.json();
  }
};
