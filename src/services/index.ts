export { authService } from './authService';
export { leadsService } from './leadsService';
export { analyticsService } from './analyticsService';
export { campaignsService } from './campaignsService';
export { calendarService } from './calendarService';
export { databaseService } from './databaseService';
export { knowledgeBaseService } from './knowledgeBaseService';
export { targetingService } from './targetingService';
export { whatsappService } from './whatsappService';
export { apiStatusService } from './apiStatusService';

// Re-export types
export type { LoginRequest, SignUpRequest, AuthResponse } from './authService';
export type { Lead, LeadSearchRequest, LeadAugmentRequest } from './leadsService';
export type { AnalyticsData } from './analyticsService';
export type { EmailSendRequest, Campaign } from './campaignsService';
export type { CalendarEvent, CreateEventRequest, BusySlot } from './calendarService';
export type { StoreKBRequest, KnowledgeBase } from './knowledgeBaseService';
export type { TargetingProfile } from './targetingService';
export type { WhatsAppWebhookData } from './whatsappService';
export type { EndpointStatus, ApiStatusReport } from './apiStatusService';