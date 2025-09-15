import express from 'express';
import cors from 'cors';
// In memory database for the purpose of this case
// Interactions is the table that will store the decisions user took
import { tenders, interactions } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/tenders/search', (req, res) => {
  const { skip = 0, take = 10 } = req.body;

  const interactedTenderIds = new Set(interactions.map(i => i.tenderId));
  const filteredTenders = tenders.filter(t => !interactedTenderIds.has(t.id));
  const results = filteredTenders.slice(skip, skip + take);
  res.json({ pagination: { skip, take }, results });
});

app.post('/interactions/decisionStatus', (req, res) => {
  const { tenderId, decisionStatus } = req.body;
  if (typeof tenderId !== 'number' || !['TO_ANALYZE', 'REJECTED'].includes(decisionStatus)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  interactions.push({ tenderId, decisionStatus });
  console.log('interactions', interactions);
  res.status(200).json({});
});

app.listen(3000, () => {
  console.log('Mock API server running on http://localhost:3000');
});
