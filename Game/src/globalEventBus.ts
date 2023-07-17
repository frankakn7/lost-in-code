import { EventEmitter } from 'events';

class GlobalEventBus extends EventEmitter {}

// Export a single instance of GlobalEventBus
export const globalEventBus = new GlobalEventBus();
