const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface StoreKBRequest {
  kb_content: string;
  kb_id?: string;
}

export interface KnowledgeBase {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const knowledgeBaseService = {
  async storeKnowledgeBase(kbData: StoreKBRequest): Promise<any> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/store_knowledge_base`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(kbData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to store knowledge base');
    }

    return response.json();
  },

  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/get_knowledge_bases`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

          if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch knowledge bases');
      }

      return response.json();
    }
  };
