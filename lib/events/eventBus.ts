export interface APCEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  payload: unknown;
}

class EventBus {
  private events: APCEvent[] = [];

  publish(event: APCEvent) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }

  clear() {
    this.events = [];
  }
}

export const eventBus = new EventBus();
