import { EventEmitter } from 'events';
import {time} from "html2canvas/dist/types/css/types/time";

/**
 * A custom GlobalEventBus class that extends EventEmitter.
 * This class is used for handling global event communication between different parts of the application.
 * @class
 */
class GlobalEventBus extends EventEmitter {}

// Export a single instance of GlobalEventBus
export const globalEventBus = new GlobalEventBus();