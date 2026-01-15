/**
 * Input validation utilities
 */

const MAX_INPUT_LENGTH = 1000;

/**
 * Sanitize user input - trim and limit length
 */
export const sanitizeInput = (input: string, maxLength = MAX_INPUT_LENGTH): string => {
  return input.trim().slice(0, maxLength);
};

/**
 * Check if string is not empty after trimming
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate required field
 */
export const isRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};
