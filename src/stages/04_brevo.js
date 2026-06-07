import { fetchWithRetry } from '../utils/http.js';

/**
 * Stage 4: Outreach Execution via Brevo
 * 
 * Takes an array of verified contacts and sends a personalized email.
 */
export async function sendEmails(contacts) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;
  const senderName = process.env.SENDER_NAME;

  if (!apiKey || !senderEmail || !senderName) {
    throw new Error("BREVO_API_KEY, SENDER_EMAIL, or SENDER_NAME is missing in .env");
  }

  const results = {
    successful: 0,
    failed: 0,
    errors: []
  };

  for (const contact of contacts) {
    try {
      // Sharp, personalized copy
      const subject = `Question about ${contact.domain}'s infrastructure`;
      const htmlContent = `
        <p>Hi ${contact.firstName},</p>
        <p>I noticed ${contact.domain} is scaling rapidly and wanted to reach out. I'm building a system that automates top-of-funnel outbound without human intervention.</p>
        <p>Given your role as ${contact.title}, I thought you might be interested in seeing how we bypass rate limits and messy data to deliver verified leads directly into the CRM.</p>
        <p>Are you open to a 5-minute live demo this week?</p>
        <p>Best,<br/>${senderName}</p>
      `;

      const payload = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: contact.email, name: `${contact.firstName} ${contact.lastName}`.trim() }],
        subject: subject,
        htmlContent: htmlContent
      };

      await fetchWithRetry({
        method: 'POST',
        url: 'https://api.brevo.com/v3/smtp/email',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        },
        data: payload
      });

      console.log(`[Brevo] Success: Email sent to ${contact.email}`);
      results.successful++;

    } catch (error) {
      console.error(`[Brevo] Failed to send email to ${contact.email}:`, error.message);
      results.failed++;
      results.errors.push({ email: contact.email, error: error.message });
    }
  }

  return results;
}
