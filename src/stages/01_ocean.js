import { fetchWithRetry } from '../utils/http.js';

/**
 * Stage 1: Lookalike Sourcing via Ocean.io
 * 
 * Takes a seed domain and returns a list of lookalike company domains.
 */
export async function getLookalikes(seedDomain) {
  const apiKey = process.env.OCEAN_API_KEY;
  if (!apiKey) throw new Error("OCEAN_API_KEY is missing in .env");

  try {
    const payload = {
      size: 10, // Let's keep it manageable for the pipeline
      companiesFilters: {
        lookalikeDomains: [seedDomain],
        excludeDomains: [seedDomain] // Don't return the seed domain itself
      }
    };

    const data = await fetchWithRetry({
      method: 'POST',
      url: 'https://api.ocean.io/v3/search/companies',
      headers: {
        'X-Api-Token': apiKey,
        'Content-Type': 'application/json'
      },
      data: payload
    });

    // Assume the response contains an array of companies
    const lookalikes = data.companies || [];
    
    // Extract just the domains and remove any empty ones
    const domains = lookalikes
      .map(company => company.domain)
      .filter(domain => domain);

    return domains;
  } catch (error) {
    console.error(`[Ocean.io] Failed to fetch lookalikes for ${seedDomain}:`, error.message);
    // Return empty array instead of crashing, allowing partial pipeline execution if needed
    return [];
  }
}
