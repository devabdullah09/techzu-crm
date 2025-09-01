const API_BASE_URL = 'https://513ef456804f.ngrok-free.app';

export interface WhatsAppWebhookData {
  message: string;
  from: string;
  timestamp: string;
  [key: string]: any; // Allow additional properties
}

export const whatsappService = {
  async sendWebhook(webhookData: WhatsAppWebhookData, signature?: string): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    if (signature) {
      headers['x-signature'] = signature;
    }

    const response = await fetch(`${API_BASE_URL}/webhooks/whatsapp`, {
      method: 'POST',
      headers,
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send WhatsApp webhook');
    }

    return response.json();
  }
};
