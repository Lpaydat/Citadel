#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { projectSkillToCodex } = require(path.join(__dirname, '..', 'core', 'skills', 'project-skill'));

const CITADEL_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  return {
    projectRoot: argv.find((arg, index) => argv[index - 1] === '--project-root')
      ? path.resolve(argv[argv.indexOf('--project-root') + 1])
      : process.cwd(),
    skillName: argv.find((arg, index) => argv[index - 1] === '--skill') || null,
    dryRun: argv.includes('--dry-run'),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceBase = path.join(CITADEL_ROOT, 'skills');
  const targetBase = path.join(args.projectRoot, '.agents', 'skills');

  const skillNames = args.skillName
    ? [args.skillName]
    : fs.readdirSync(sourceBase).filter((name) => fs.existsSync(path.join(sourceBase, name, 'SKILL.md')));

  for (const skillName of skillNames) {
    const sourceDir = path.join(sourceBase, skillName);
    const result = projectSkillToCodex(sourceDir, targetBase, skillName, { dryRun: args.dryRun });
    const verb = args.dryRun ? 'would project' : 'projected';
    console.log(`[${verb}] ${result.skillName}`);
  }
}

main();
