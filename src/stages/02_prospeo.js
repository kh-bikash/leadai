import { fetchWithRetry } from '../utils/http.js';

/**
 * Stage 2: Decision-Maker Search via Prospeo
 * 
 * Takes an array of domains and returns a list of contacts with their LinkedIn URLs.
 */
export async function getDecisionMakers(domains) {
  const apiKey = process.env.PROSPEO_API_KEY;
  if (!apiKey) throw new Error("PROSPEO_API_KEY is missing in .env");

  const allContacts = [];

  try {
    // Prospeo allows searching multiple domains at once in the include array!
    // This uses 1 API call instead of 10, completely avoiding rate limits.
    const payload = {
      filters: {
        company: {
          websites: {
            include: domains
          }
        }
      }
    };

    const data = await fetchWithRetry({
      method: 'POST',
      url: 'https://api.prospeo.io/search-person',
      headers: {
        'X-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      data: payload
    });

    console.log("[Prospeo DEBUG]:", JSON.stringify(data, null, 2));

    const persons = data.response?.data || data.results || [];

    // Extract people who have a LinkedIn URL and map them
    const contacts = persons
      .filter(person => person.linkedin || (person.person && person.person.linkedin_url))
      .map(item => {
        // Handle both possible response structures (from API docs vs actual)
        const p = item.person ? item.person : item;
        const c = item.company ? item.company : {};
        
        return {
          domain: c.website || c.domain || p.company_domain || 'unknown_domain', // Best effort mapping
          firstName: p.first_name || '',
          lastName: p.last_name || '',
          title: p.job_title || p.current_job_title || '',
          linkedinUrl: p.linkedin || p.linkedin_url
        };
      });

    allContacts.push(...contacts);

  } catch (error) {
    console.error(`[Prospeo] Failed to fetch decision-makers: ${error.message}`);
  }

  return allContacts;
}
