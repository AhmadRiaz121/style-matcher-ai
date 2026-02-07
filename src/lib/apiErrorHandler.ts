/**
 * Maps API errors to user-friendly messages without exposing internal details
 */
export function mapApiErrorToUserMessage(statusCode?: number): string {
  if (statusCode === 401 || statusCode === 403) {
    return 'Please check your API key settings and try again.';
  }
  if (statusCode === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (statusCode && statusCode >= 500) {
    return 'The AI service is temporarily unavailable. Please try again later.';
  }
  if (statusCode === 400) {
    return 'Unable to process your request. Please try rephrasing.';
  }
  return 'Something went wrong. Please try again.';
}
