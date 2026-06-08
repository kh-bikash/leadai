<div align="center">

```
██╗     ███████╗ █████╗ ██████╗  █████╗ ██╗
██║     ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║
██║     █████╗  ███████║██║  ██║███████║██║
██║     ██╔══╝  ██╔══██║██║  ██║██╔══██║██║
███████╗███████╗██║  ██║██████╔╝██║  ██║██║
╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝
```

**Automated B2B Outreach — From One Domain to Booked Meetings**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app)
[![Status](https://img.shields.io/badge/Pipeline-4_Stages-FF6B35?style=flat-square)]()

<br/>

> *Drop one domain. Get a fully qualified, emailed prospect list — automatically.*

</div>

---

## How It Works

LeadAI runs a tight, deterministic 4-stage pipeline the moment you input a seed domain. No manual steps. No babysitting.

```
  stripe.com
      │
      ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  01  LOOKALIKE  │────▶│  02  SCRAPING   │────▶│  03  ENRICHMENT │────▶│  04  OUTREACH   │
│                 │     │                 │     │                 │     │                 │
│  Ocean.io AI    │     │  Prospeo API    │     │  Verified email │     │  Brevo SMTP     │
│  finds 10 ICP-  │     │  pulls C-Suite  │     │  + LinkedIn URL │     │  queues & fires │
│  matched firms  │     │  & VP contacts  │     │  per executive  │     │  personalized   │
│                 │     │                 │     │                 │     │  sequences      │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
      Ocean.io               Prospeo                  Prospeo                 Brevo
```

---

## Features

| | |
|---|---|
| **ICP-Matched Lookalikes** | Ocean.io surfaces 10 B2B companies with tight fit to your seed domain — not random results, model-selected matches |
| **C-Suite & VP Contacts** | Prospeo scrapes decision-makers by seniority level — you only get people who can actually say yes |
| **Verified Email + LinkedIn** | Each profile is enriched with a deliverable email address and LinkedIn URL before a single send |
| **Personalized Sequences** | Brevo fires transactional emails tailored per contact — not blasts, not templates |
| **CLI + Web Dashboard** | Run the full pipeline from a single terminal command, or use the glassmorphism web UI |

---

## Stack

```
Frontend    Vanilla JS + CSS (Glassmorphism UI)
Backend     Node.js + Express
Sources     Ocean.io  ·  Prospeo
Delivery    Brevo (SMTP + Transactional API)
Infra       Railway (containerized, live)
```

---

## Quickstart

### 1. Clone

```bash
git clone https://github.com/kh-bikash/leadai.git
cd leadai
```

### 2. Install

```bash
npm install
```

### 3. Configure

Create a `.env` file in the root:

```env
OCEAN_API_KEY=your_ocean_key
PROSPEO_API_KEY=your_prospeo_key
BREVO_API_KEY=your_brevo_key
SENDER_EMAIL=you@yourdomain.com
SENDER_NAME=Your Name
PORT=3000
```

> Get your keys: [Ocean.io](https://ocean.io) · [Prospeo](https://prospeo.io) · [Brevo](https://brevo.com)

### 4. Run

**Option A — CLI**

The fastest way to run a campaign. Outputs clean tabular results straight to your terminal.

```bash
node src/cli.js stripe.com
```

**Option B — Web Dashboard**

Fire up the server and use the UI.

```bash
npm start
# → http://localhost:3000
```

---

## Pipeline Output (Sample)

```
Seed domain: stripe.com
────────────────────────────────────────────────────────────────────────
Stage 1  ✓  Found 10 lookalike companies        [2.1s]
Stage 2  ✓  Scraped 34 decision-makers          [4.8s]
Stage 3  ✓  Enriched 31 verified contacts       [6.3s]
Stage 4  ✓  Queued 31 personalized outreach     [1.2s]
────────────────────────────────────────────────────────────────────────
Total runtime: 14.4s   ·   Deliverable contacts: 31   ·   Emails sent: 31
```

---

## Project Structure

```
leadai/
├── src/
│   ├── cli.js              # Terminal pipeline runner
│   ├── server.js           # Express API + web server
│   ├── pipeline/
│   │   ├── lookalike.js    # Stage 1 — Ocean.io integration
│   │   ├── scraper.js      # Stage 2 — Prospeo people search
│   │   ├── enrichment.js   # Stage 3 — Email + LinkedIn enrichment
│   │   └── outreach.js     # Stage 4 — Brevo email dispatch
│   └── public/
│       ├── index.html      # Glassmorphism dashboard
│       └── app.js          # Frontend pipeline orchestration
├── .env.example
└── package.json
```

---

## Live Demo

The application is containerized and deployed live on Railway.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

---

## Roadmap

- [ ] CRM export (HubSpot, Salesforce)
- [ ] Multi-sequence A/B email variants
- [ ] Reply detection + follow-up automation
- [ ] Webhook support for pipeline events
- [ ] Rate-limit management + retry queues

---

<div align="center">

Built by [Bikash](https://github.com/kh-bikash) · MIT License

*One input. Four stages. Fully automated.*

</div>
