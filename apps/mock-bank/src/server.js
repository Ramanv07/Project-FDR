import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();
const PORT = process.env.MOCK_BANK_PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/bank-api', routes);

app.listen(PORT, () => {
  console.log(`[Simulated Bank Server] Running on http://localhost:${PORT}`);
  console.log(`[Disclaimer] This is a mock service for demonstration only.`);
});
