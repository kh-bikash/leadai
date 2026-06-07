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

  for (const contact of contacts) {
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
      console.warn(`[Prospeo Enrich] Failed to enrich ${contact.firstName} ${contact.lastName}: ${error.message}`);
      
      // DEMO FALLBACK
      if (contact.firstName === 'Demo' && contact.lastName === 'User') {
        console.log(`[Demo Fallback] Using your sender email as the target so you receive the demo email!`);
        resolvedContacts.push({
          ...contact,
          email: process.env.SENDER_EMAIL || 'demo@lead-ai.online'
        });
      }
    }
  }

  return resolvedContacts;
}
