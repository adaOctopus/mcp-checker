import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';
import path from 'path';
import os from 'os';
import simpleGit from 'simple-git';

const TEMP_DIR = path.join(os.tmpdir(), 'mcp-checker-temp');
const git = simpleGit();

export type CheckResult = {
  quality: { typescript: string; lint: string };
  security: { npmAudit: string };
  license: { status: string; details: { summary: string } | null };
  score: number;
};

export async function checkRepo(repoUrl: string): Promise<CheckResult> {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  await git.clone(repoUrl, TEMP_DIR);
  process.chdir(TEMP_DIR);
  run('npm install');

  const resultWithoutScore = {
    quality: {
      typescript: runCheck('npx tsc --noEmit'),
      lint: runCheck('npx eslint . --ext .ts,.tsx'),
    },
    security: {
      npmAudit: runCheck('npm audit --omit=dev'),
    },
    license: {
      status: 'FAIL',
      details: null as { summary: string } | null,
    },
  };

  try {
    const output = execSync('npx license-checker-rseidelsohn --production --summary', { encoding: 'utf-8' });
    resultWithoutScore.license.status = 'PASS';
    resultWithoutScore.license.details = {
      summary: output.split('\n').slice(0, 10).join('\n'),
    };
  } catch {
    resultWithoutScore.license.status = 'FAIL';
  }

  rmSync(TEMP_DIR, { recursive: true, force: true });

  const score = getScore(resultWithoutScore);

  return { ...resultWithoutScore, score };
}

function run(cmd: string): void {
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch {
    // ignore errors here (for silent install failures)
  }
}

function runCheck(cmd: string): string {
  try {
    execSync(cmd, { stdio: 'pipe' });
    return 'PASS';
  } catch {
    return 'FAIL';
  }
}

function getScore(result: Omit<CheckResult, 'score'>): number {
  let score = 0;

  if (result.quality.typescript === 'PASS') score += 1;
  if (result.quality.lint === 'PASS') score += 1;
  if (result.security.npmAudit === 'PASS') score += 1.5;
  if (result.license.status === 'PASS') score += 1.5;

  return Math.round(score * 10) / 10; // e.g. 3.5
}
