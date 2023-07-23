import { EventEmitter } from 'events';
import {time} from "html2canvas/dist/types/css/types/time";

class GlobalEventBus extends EventEmitter {}

// Export a single instance of GlobalEventBus
export const globalEventBus = new GlobalEventBus();

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
