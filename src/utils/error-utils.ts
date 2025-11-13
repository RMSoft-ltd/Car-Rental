/**
 * Utility functions for error handling
 * Provides type-safe error message extraction from unknown error types
 */

/**
 * Extracts error message from unknown error type
 * Handles various error formats including Axios errors, standard Error objects, and API response errors
 *
 * @param error - The error object of unknown type
 * @param defaultMessage - Optional default message to return if error message cannot be extracted
 * @returns A string error message
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred. Please try again."
): string {
  // Handle Axios-style errors with response.data.message
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Return default message for unknown error types
  return defaultMessage;
}

