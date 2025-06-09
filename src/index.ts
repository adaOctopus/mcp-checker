import express, { Request, Response, Router, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import { checkRepo, CheckResult } from './checker';

const app = express();
const router = Router();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

interface CheckRequest {
  repoUrl: string;
}

const checkHandler: RequestHandler<{}, any, CheckRequest> = async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    res.status(400).json({ error: 'Invalid or missing repoUrl' });
    return;
  }

  try {
    const result: CheckResult = await checkRepo(repoUrl);
    printSummary(result);
    res.json(result);
  } catch (err) {
    console.error(chalk.red('❌ MCP Checker failed:'), err);
    res.status(500).json({ error: 'Internal server error during repo check' });
  }
};

router.post('/check', checkHandler);
app.use(router);

app.listen(PORT, () => {
  console.log(chalk.green(`🚀 MCP Checker server running at http://localhost:${PORT}`));
});

// =========================
// 🖨️ Summary Printer (CLI)
// =========================

function printSummary(result: CheckResult) {
  console.log(chalk.cyan('\n🧪 MCP SERVER CHECK REPORT'));
  console.log(chalk.gray('------------------------------------'));

  console.log(chalk.bold('\n🧠 Quality:'));
  console.log(`  🟦 TypeScript: ${emoji(result.quality.typescript)} (${result.quality.typescript})`);
  console.log(`  🎨 ESLint:     ${emoji(result.quality.lint)} (${result.quality.lint})`);

  console.log(chalk.bold('\n🔐 Security:'));
  console.log(`  🧪 npm audit:  ${emoji(result.security.npmAudit)} (${result.security.npmAudit})`);

  console.log(chalk.bold('\n📜 License:'));
  console.log(`  📄 Summary:    ${emoji(result.license.status)} (${result.license.status})`);
  if (result.license.status === 'PASS') {
    console.log(chalk.gray(`\n${result.license.details?.summary}`));
  }

  console.log(chalk.yellow.bold(`\n⭐ Final Score: ${result.score}/5`));
  console.log(chalk.gray('------------------------------------\n'));
}

function emoji(status: string): string {
  return status === 'PASS' ? '✅' : '❌';
}