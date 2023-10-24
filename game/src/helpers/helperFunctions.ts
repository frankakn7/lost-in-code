/**
 * Format the time duration in milliseconds to a human-readable format.
 * @param {number} milliseconds - The time duration in milliseconds.
 * @returns {string} - The formatted time string in the format "Xh Ym Zs Ms" or "0s" if the input is invalid or less than 1 millisecond.
 */
export function formatTimeFromMilliseconds(milliseconds) {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return "Invalid time";
    }

    let timeString = "";

    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const remainingMilliseconds = milliseconds % 1000;

    if (hours > 0) {
        timeString += `${hours}h `;
    }

    if (minutes > 0) {
        timeString += `${minutes}m `;
    }

    if (seconds > 0) {
        timeString += `${seconds}s `;
    }

    if (remainingMilliseconds > 0) {
        timeString += `${remainingMilliseconds}ms`;
    }

    if (timeString == "") return "0s";
    return timeString.trim();
}
