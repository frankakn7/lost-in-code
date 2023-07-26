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

/**
 * Format the time duration in seconds to a human-readable format.
 * @param {number} seconds - The time duration in seconds.
 * @returns {string} - The formatted time string in the format "Xh Ym Zs" or "0s" if the input is invalid or less than 1 second.
 */
export function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid time";
    }

    let timeString = "";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        timeString += `${hours}h `;
    }

    if (minutes > 0) {
        timeString += `${minutes}m `;
    }

    if (remainingSeconds > 0) {
        timeString += `${remainingSeconds}s`;
    }

    if (timeString == "") return "0s";
    return timeString.trim();
}
