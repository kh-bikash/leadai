import axios from 'axios';

/**
 * A robust HTTP client wrapper that handles retries for rate limits (429)
 * and other transient errors.
 */
export async function fetchWithRetry(config, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      attempt++;
      
      if (error.response) {
        const status = error.response.status;
        
        // Handle Rate Limit (429)
        if (status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 2; // Default to 2 seconds
          const delayMs = parseInt(retryAfter, 10) * 1000 * attempt;
          console.warn(`[Rate Limited] Waiting ${delayMs}ms before retry ${attempt}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        
        // Don't retry on client errors like 400, 401, 403, 404
        if (status >= 400 && status < 500) {
           throw new Error(`API Error ${status}: ${JSON.stringify(error.response.data)}`);
        }
      }
      
      // If it's a network error or 5xx, retry with exponential backoff
      const backoffMs = 1000 * Math.pow(2, attempt);
      console.warn(`[Network/Server Error] Retrying in ${backoffMs}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts.`);
}
