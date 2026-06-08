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
          // Prospeo uses custom reset headers instead of standard retry-after
          const secondReset = error.response.headers['x-second-reset-seconds'];
          const minuteReset = error.response.headers['x-minute-reset-seconds'];
          const retryAfterHeader = error.response.headers['retry-after'];

          let resetSeconds = 2; // default
          if (minuteReset) resetSeconds = parseInt(minuteReset, 10) + 1;
          else if (secondReset) resetSeconds = parseInt(secondReset, 10) + 1;
          else if (retryAfterHeader) resetSeconds = parseInt(retryAfterHeader, 10);

          const delayMs = resetSeconds * 1000;
          console.warn(`[Rate Limited] Waiting ${delayMs}ms for quota reset (Attempt ${attempt}/${maxRetries})...`);
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
