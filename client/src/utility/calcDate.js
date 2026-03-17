export const calcDate = (timestamp) => {
    const date1 = new Date(parseInt(timestamp) * 1000);
    const date2 = new Date();

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return `${diffDays} days ago`;
    if (diffHours > 1) return `${diffHours} hours ago`;
    if (diffMinutes > 1) return `${diffMinutes} minutes ago`;
    return `few seconds ago`;
};
