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

  // Filter out tenders that have already been processed (have interactions)
  const interactedTenderIds = new Set(interactions.map(i => i.tenderId));
  const availableTenders = tenders.filter(t => !interactedTenderIds.has(t.id));
  
  // Apply pagination to available tenders
  const results = availableTenders.slice(skip, skip + take);
  
  res.json({ 
    pagination: { skip, take }, 
    results,
    totalCount: availableTenders.length,
    remainingCount: availableTenders.length - skip
  });
});

app.post('/interactions/decisionStatus', (req, res) => {
  const { tenderId, decisionStatus } = req.body;
  if (typeof tenderId !== 'number' || !['TO_ANALYZE', 'REJECTED'].includes(decisionStatus)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  
  // Check if tender exists
  const tender = tenders.find(t => t.id === tenderId);
  if (!tender) {
    return res.status(404).json({ error: 'Tender not found' });
  }
  
  // Check if tender already has a decision
  const existingInteraction = interactions.find(i => i.tenderId === tenderId);
  if (existingInteraction) {
    return res.status(409).json({ error: 'Tender already processed' });
  }
  
  // Record the decision
  interactions.push({ tenderId, decisionStatus });
  console.log('Decision recorded:', { tenderId, decisionStatus });
  console.log('Total interactions:', interactions.length);
  
  res.status(200).json({ 
    success: true, 
    message: 'Decision recorded successfully',
    tenderId,
    decisionStatus
  });
});

app.get('/tenders/pipeline', (req, res) => {
  // Get tenders that have been marked as TO_ANALYZE
  const toAnalyzeTenderIds = interactions
    .filter(i => i.decisionStatus === 'TO_ANALYZE')
    .map(i => i.tenderId);
  
  const pipelineTenders = tenders.filter(t => toAnalyzeTenderIds.includes(t.id));
  
  res.json({
    pagination: { skip: 0, take: pipelineTenders.length },
    results: pipelineTenders,
    totalCount: pipelineTenders.length,
    remainingCount: pipelineTenders.length
  });
});

app.get('/tenders/:id', (req, res) => {
  const tenderId = parseInt(req.params.id);
  
  if (isNaN(tenderId)) {
    return res.status(400).json({ error: 'Invalid tender ID' });
  }
  
  const tender = tenders.find(t => t.id === tenderId);
  
  if (!tender) {
    return res.status(404).json({ error: 'Tender not found' });
  }
  
  // Check if tender has been processed
  const interaction = interactions.find(i => i.tenderId === tenderId);
  
  res.json({
    ...tender,
    decisionStatus: interaction?.decisionStatus || null,
    processed: !!interaction
  });
});

app.listen(3000, () => {
  console.log('Mock API server running on http://localhost:3000');
});
