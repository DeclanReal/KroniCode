export function parseDuration(duration) {
    const [hours, minutes] = duration.split(':').map(Number);
    return (hours * 60 + minutes) * 60;
}

export function getCurrentDateTime() {
    const now = new Date();
    now.setSeconds(0, 0); // strip seconds and ms

    const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // offset for UTC +2 South Africa TimeZone

    return offsetDate.toISOString().slice(0, 16);
}