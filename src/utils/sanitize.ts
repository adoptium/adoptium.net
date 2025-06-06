/**
 * Utility functions for sanitizing user-generated content to prevent XSS attacks
 */
import { encode } from 'html-entities';

/**
 * Sanitizes a string by escaping HTML special characters
 * @param str The string to sanitize
 * @returns A sanitized string safe for inclusion in HTML
 */
export function sanitizeString(str: string | undefined | null): string {
  if (str === undefined || str === null) {
    return '';
  }
  
  return encode(str);
}

/**
 * Recursively sanitizes all string values in an object
 * @param obj The object to sanitize
 * @returns A new object with all string values sanitized
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      result[key] = sanitizeObject(value);
    }
    
    return result as T;
  }
  
  // For numbers, booleans, etc., return as is
  return obj;
}
