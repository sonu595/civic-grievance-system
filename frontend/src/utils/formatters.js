// Date & Time formatting helpers (Indian style)

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase(); // e.g. 10:32 am
};

export const formatDateTime = (dateStr) => {
  return `${formatDate(dateStr)} • ${formatTime(dateStr)}`;
};

// Text helpers
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Status display (अगर backend अलग नाम भेजता है तो map कर सकते हो)
export const getStatusDisplay = (status) => {
  const map = {
    'in-progress': 'In Progress',
    'in_progress': 'In Progress',
    pending: 'Pending',
    completed: 'Completed',
  };
  return map[status?.toLowerCase()] || status;
}; 