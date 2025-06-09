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
  license: { status: string; details: object | null };
};

export async function checkRepo(repoUrl: string): Promise<CheckResult> {
  if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true, force: true });
  await git.clone(repoUrl, TEMP_DIR);

  process.chdir(TEMP_DIR);
  run('npm install');

  const result: CheckResult = {
    quality: {
      typescript: runCheck('npx tsc --noEmit'),
      lint: runCheck('npx eslint . --ext .ts,.tsx'),
    },
    security: {
      npmAudit: runCheck('npm audit --omit=dev'),
    },
    license: {
      status: 'FAIL',
      details: null,
    },
  };

  try {
    const output = execSync('npx license-checker --production --json', { encoding: 'utf-8' });
    result.license.status = 'PASS';
    result.license.details = JSON.parse(output);
  } catch {
    result.license.status = 'FAIL';
  }

  rmSync(TEMP_DIR, { recursive: true, force: true });
  return result;
}

function run(cmd: string): void {
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch {
    // ignore
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
