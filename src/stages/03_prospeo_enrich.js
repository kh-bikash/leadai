import { fetchWithRetry } from '../utils/http.js';

/**
 * Stage 3: Email Resolution via Prospeo (Replacing Eazyreach)
 * 
 * Takes an array of contacts (which have linkedinUrls) and resolves them to verified emails.
 */
export async function resolveEmails(contacts) {
  const apiKey = process.env.PROSPEO_API_KEY;
  if (!apiKey) throw new Error("PROSPEO_API_KEY is missing in .env");

  const resolvedContacts = [];

  // OPTIMIZATION: Prospeo's Free Tier has a strict 20 req/minute and 50 req/day limit.
  // We cap the enrichment to the top 10 executives to ensure we never hit the minute burst 
  // limit, and to heavily conserve daily API credits for subsequent pipeline runs.
  const targetContacts = contacts.slice(0, 10);
  console.log(`[Stage 3] Optimizing enrichment: Selected top ${targetContacts.length} executives to conserve daily Prospeo API limits.`);

  for (const contact of targetContacts) {
    try {
      const payload = {
        data: {
          linkedin_url: contact.linkedinUrl
        }
      };

      const data = await fetchWithRetry({
        method: 'POST',
        url: 'https://api.prospeo.io/enrich-person',
        headers: {
          'X-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        data: payload
      });

      // Based on Prospeo docs, the response contains the email
      const email = data?.response?.email?.email_address || data?.response?.data?.email || data?.email;

      if (email) {
        resolvedContacts.push({
          ...contact,
          email: email
        });
      } else {
        console.warn(`[Prospeo Enrich] No verified email found for ${contact.linkedinUrl}. Skipping.`);
      }

    } catch (error) {
      console.warn(`[Prospeo Enrich] Failed to resolve email for ${contact.linkedinUrl}: ${error.message}. Skipping.`);
    }
  }

  return resolvedContacts;
}
