import { getLookalikes } from './stages/01_ocean.js';
import { getDecisionMakers } from './stages/02_prospeo.js';
import { resolveEmails } from './stages/03_prospeo_enrich.js';
import { sendEmails } from './stages/04_brevo.js';

export class Pipeline {
  /**
   * Run stages 1 to 3 to gather the data for the safety checkpoint.
   */
  static async runToCheckpoint(seedDomain) {
    console.log(`\n[Stage 1] Finding lookalikes for ${seedDomain}...`);
    let lookalikes = await getLookalikes(seedDomain);
    
    // Deduplication
    lookalikes = [...new Set(lookalikes)];
    
    if (lookalikes.length === 0) {
      throw new Error(`Pipeline stopped: No lookalike domains found for ${seedDomain}.`);
    }
    
    console.log(`\n[Stage 2] Sourcing decision-makers from ${lookalikes.length} domains...`);
    const allContacts = await getDecisionMakers(lookalikes);
    
    if (allContacts.length === 0) {
      throw new Error(`Pipeline stopped: No decision-makers found across the lookalike domains.`);
    }

    // Deduplication of contacts by linkedin URL just in case
    const uniqueContactsMap = new Map();
    for (const contact of allContacts) {
      if (contact.linkedinUrl) {
         uniqueContactsMap.set(contact.linkedinUrl, contact);
      }
    }
    const uniqueContacts = Array.from(uniqueContactsMap.values());

    console.log(`\n[Stage 3] Resolving work emails for ${uniqueContacts.length} contacts...`);
    const verifiedContacts = await resolveEmails(uniqueContacts);
    
    return {
      lookalikesCount: lookalikes.length,
      contactsFound: uniqueContacts.length,
      verifiedContacts: verifiedContacts
    };
  }

  /**
   * Run stage 4 after manual approval.
   */
  static async executeOutreach(verifiedContacts) {
    console.log(`\n[Stage 4] Sending personalized outreach to ${verifiedContacts.length} verified emails...`);
    return await sendEmails(verifiedContacts);
  }
}
