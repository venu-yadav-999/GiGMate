
import { AnalyticsEvent } from '../types';

/**
 * AnalyticsService - Handles tracking of user interactions.
 * In production, this would integrate with Firebase Analytics or Mixpanel.
 */
class AnalyticsService {
  private static instance: AnalyticsService;
  private queue: AnalyticsEvent[] = [];

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  logEvent(eventName: string, params?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventName,
      params,
      timestamp: new Date().toISOString()
    };
    
    // Log to console for development visibility
    console.debug('[Analytics]', event);
    
    this.queue.push(event);
    
    // Simulate periodic batch sync to backend
    if (this.queue.length >= 5) {
      this.syncEvents();
    }
  }

  private async syncEvents() {
    try {
      // Simulate network call
      console.log('Syncing analytics events...', this.queue);
      this.queue = [];
    } catch (error) {
      console.error('Failed to sync analytics events:', error);
    }
  }
}

export const analytics = AnalyticsService.getInstance();
