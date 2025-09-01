

export interface CalendarEvent {
  id: string;
  title: string;
  start_iso: string;
  end_iso: string;
  calendar_id?: string;
}

export interface CreateEventRequest {
  calendar_id?: string;
  title: string;
  start_iso: string;
  end_iso: string;
}

export interface BusySlot {
  start: string;
  end: string;
}

export const calendarService = {
  // Note: Calendar endpoints don't exist in your backend yet
  // Using mock data for development
  async getBusySlots(): Promise<BusySlot[]> {
    // Mock implementation since backend doesn't have calendar endpoints
    console.warn('Calendar endpoints not implemented in backend, using mock data');
    return [
      { start: '2024-01-20T09:00:00Z', end: '2024-01-20T10:00:00Z' },
      { start: '2024-01-20T14:00:00Z', end: '2024-01-20T15:00:00Z' },
    ];
  },

  async createEvent(eventData: CreateEventRequest): Promise<CalendarEvent> {
    // Mock implementation since backend doesn't have calendar endpoints
    console.warn('Calendar endpoints not implemented in backend, using mock data');
    return {
      id: `mock_${Date.now()}`,
      title: eventData.title,
      start_iso: eventData.start_iso,
      end_iso: eventData.end_iso,
      calendar_id: eventData.calendar_id,
    };
  },

  // Mock data for development
  async getMockMeetings(): Promise<any[]> {
    return [
      {
        id: "1",
        title: "Client Meeting - TechCorp",
        start: "2024-01-20T10:00:00Z",
        end: "2024-01-20T11:00:00Z",
        type: "client",
        contact: "John Smith",
        location: "Zoom",
        status: "confirmed"
      },
      {
        id: "2",
        title: "Product Demo - Innovation Labs",
        start: "2024-01-20T14:00:00Z",
        end: "2024-01-20T15:30:00Z",
        type: "demo",
        contact: "Sarah Johnson",
        location: "Google Meet",
        status: "confirmed"
      },
      {
        id: "3",
        title: "Follow-up Call - Global Health",
        start: "2024-01-21T09:00:00Z",
        end: "2024-01-21T09:30:00Z",
        type: "followup",
        contact: "Michael Brown",
        location: "Phone",
        status: "pending"
      }
    ];
  }
};