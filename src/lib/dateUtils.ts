/**
 * Utility functions for consistent date formatting across the application.
 * All formatting enforces the 'Asia/Jakarta' timezone and 'id-ID' locale.
 */

/**
 * Formats a Date object and a time string into "05 Juli 2026 - 07:00"
 */
export function formatSessionDateTime(date: Date, timeStr: string): string {
    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    const datePart = dateFormatter.format(date);
    const timePart = timeStr.slice(0, 5); // Extracts "07:00" from "07:00:00"
    return `${datePart} - ${timePart}`;
}

/**
 * Formats a Date object into "05 Juli 2026 - 07:00"
 */
export function formatAttendanceTime(date: Date): string {
    const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    const timeFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    const datePart = dateFormatter.format(date);
    const timePart = timeFormatter.format(date).replace('.', ':');
    return `${datePart} - ${timePart}`;
}

/**
 * Constructs a Date object from a date and a time string,
 * strictly mapped to local time for validation.
 */
export function getSessionDateObj(date: Date, timeStr: string): Date {
    const dateStr = date.toISOString().split('T')[0];
    const [year, month, day] = dateStr.split('-');
    const [hour, min, sec] = timeStr.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(min), Number(sec || 0));
}
