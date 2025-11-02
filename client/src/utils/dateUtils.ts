export const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // If today, show time
    if (days === 0) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    // If yesterday
    if (days === 1) {
        return 'Yesterday';
    }

    // If within a week
    if (days < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Otherwise, show date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};
