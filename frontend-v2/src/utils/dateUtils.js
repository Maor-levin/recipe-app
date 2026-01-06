/**
 * Format a date string for display
 * @param {string} dateString - ISO date string
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "Unknown date";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    // Default formatting options
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    };

    return date.toLocaleDateString("en-US", defaultOptions);
  } catch {
    return "Unknown date";
  }
};

/**
 * Format date with short month name
 */
export const formatDateShort = (dateString) => {
  return formatDate(dateString, { month: "short" });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
