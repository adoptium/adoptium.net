import { encode } from 'html-entities';

/**
 * Safely serializes a JSON object for use in a script tag
 * This function:
 * 1. Stringifies the JSON object
 * 2. HTML-encodes the result to prevent any HTML/JS from executing
 * 3. Ensures that the </script> sequence cannot be injected
 * 
 * @param obj The object to serialize
 * @returns A safely encoded JSON string
 */
export function safeJsonLd(obj: unknown): string {
  // First stringify the object
  const jsonString = JSON.stringify(obj);
  
  // Then encode any HTML entities that might be in the string
  // This prevents any HTML or JS from executing if injected in the JSON
  let encoded = encode(jsonString);
  
  // Further protect against script tag closing sequence
  encoded = encoded.replace(/<\/script/gi, '<\\/script');
  
  return encoded;
}
