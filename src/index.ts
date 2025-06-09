import express from 'express';
import { Request, Response, Router, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import { checkRepo } from './checker';

const app = express();
const router = Router();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

interface CheckRequest {
  repoUrl: string;
}

const checkHandler: RequestHandler<{}, any, CheckRequest> = (req, res) => {
  const { repoUrl } = req.body;
  if (!repoUrl || typeof repoUrl !== 'string') {
    res.status(400).json({ error: 'Invalid repoUrl' });
    return;
  }

  checkRepo(repoUrl)
    .then(result => res.json(result))
    .catch(err => {
      console.error('❌ Checker failed:', err);
      res.status(500).json({ error: 'Check failed' });
    });
};

router.post('/check', checkHandler);

app.use(router);

app.listen(PORT, () => {
  console.log(`✅ MCP Checker API running at http://localhost:${PORT}`);
});
