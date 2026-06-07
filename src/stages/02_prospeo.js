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

  for (const domain of domains) {
    try {
      // Endpoint from Prospeo docs: https://api.prospeo.io/search-person
      const payload = {
        filters: {
          person_search: {
            company_domain: domain
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

      // Log the actual response to see what Prospeo is giving us
      console.log("[Prospeo DEBUG]:", JSON.stringify(data, null, 2));

      const persons = data.response?.data || [];

      // We only care about people who have a LinkedIn URL available to pass to Stage 3
      const contacts = persons
        .filter(person => person.linkedin)
        .map(person => ({
          domain: domain,
          firstName: person.first_name || '',
          lastName: person.last_name || '',
          title: person.job_title || '',
          linkedinUrl: person.linkedin
        }));

      allContacts.push(...contacts);

    } catch (error) {
      console.warn(`[Prospeo] Failed to fetch decision-makers for ${domain}: ${error.message}. Skipping domain.`);
      // Partial failure handling: skip this domain and continue with the rest.
    }
  }

  return allContacts;
}
