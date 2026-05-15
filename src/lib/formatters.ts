export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso));

export const estimateDropTime = (iso: string, minutes = 92) => formatTime(new Date(new Date(iso).getTime() + minutes * 60000).toISOString());

export const getDriverOtp = (bookingId: string) => {
  const total = bookingId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return String((total * 37) % 10000).padStart(4, '0');
};
