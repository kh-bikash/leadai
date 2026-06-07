import 'dotenv/config';
import express from 'express';
import { Pipeline } from './pipeline.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve simple static frontend if needed

// In-memory cache for the checkpoint state (simplified for demo)
const checkpointCache = new Map();

// Endpoint to run Stages 1-3
app.post('/api/pipeline/generate', async (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "Domain is required" });

  try {
    const summary = await Pipeline.runToCheckpoint(domain);
    const runId = Date.now().toString();
    checkpointCache.set(runId, summary.verifiedContacts);
    
    res.json({
      runId,
      summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to run Stage 4
app.post('/api/pipeline/send', async (req, res) => {
  const { runId } = req.body;
  if (!runId || !checkpointCache.has(runId)) {
    return res.status(400).json({ error: "Invalid or expired runId" });
  }

  try {
    const contacts = checkpointCache.get(runId);
    const results = await Pipeline.executeOutreach(contacts);
    
    // Clear cache after execution
    checkpointCache.delete(runId);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`You can build a frontend in the /public folder to interact with the API.`);
});
