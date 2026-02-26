/**
 * Formats a bigint nanosecond timestamp into a human-readable date/time string.
 * e.g. "Jan 15, 2024 at 3:45 PM"
 */
export function formatDate(timestampNs: bigint): string {
    // Convert nanoseconds to milliseconds
    const ms = Number(timestampNs / BigInt(1_000_000));
    const date = new Date(ms);

    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).replace(',', ' at').replace(' at ', ' at ');
}

/**
 * Returns a relative time string like "2 hours ago", "just now", etc.
 */
export function formatRelativeTime(timestampNs: bigint): string {
    const ms = Number(timestampNs / BigInt(1_000_000));
    const now = Date.now();
    const diffMs = now - ms;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    return formatDate(timestampNs);
}
