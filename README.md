<div align="center">
  <h1>🚀 LeadAI - Automated Outreach Engine</h1>
  <p><b>One input. Four stages. Fully automated.</b></p>
</div>

<br />

LeadAI is a powerful, fully-automated B2B lead generation and outreach pipeline. Simply input a single target company domain, and LeadAI will seamlessly execute a 4-stage pipeline to find lookalike companies, scrape decision-makers, enrich their verified contact information, and automatically queue personalized email outreach.

## ✨ Features

- **Stage 1: Lookalike Sourcing** — Uses Ocean.io AI to identify 10 high-quality B2B companies that are highly similar to your seed domain.
- **Stage 2: Decision-Maker Scraping** — Leverages Prospeo to scrape C-Suite and VP-level executives at the identified lookalike domains.
- **Stage 3: Deep Enrichment** — Enriches executive profiles to extract verified professional email addresses and LinkedIn URLs.
- **Stage 4: Automated Outreach** — Automatically queues and sends personalized outreach emails using the Brevo transactional email API.

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** Vanilla JS, CSS (Glassmorphism UI)
- **Data APIs:** Ocean.io (Company Intelligence), Prospeo (People Search & Enrichment)
- **Email Delivery:** Brevo (SMTP & API)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kh-bikash/leadai.git
cd leadai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on the `.env.example` file and add your API keys:
```env
OCEAN_API_KEY=your_ocean_key
PROSPEO_API_KEY=your_prospeo_key
BREVO_API_KEY=your_brevo_key
SENDER_EMAIL=you@yourdomain.com
SENDER_NAME="Your Name"
PORT=3000
```

### 4. Run the Application

**Option A: Command Line Interface (CLI)**
Run the entire pipeline directly from your terminal and view beautiful tabular outputs.
```bash
node src/cli.js stripe.com
```

**Option B: Web Dashboard**
Start the web server and use the sleek user interface to launch campaigns.
```bash
npm start
# Open http://localhost:3000 in your browser
```

## 🌐 Live Demo
The application is fully containerized and currently deployed live on Railway!

---
<div align="center">
  <i>Built with ❤️ for automated growth.</i>
</div>
