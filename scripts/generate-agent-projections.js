#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { projectAgentToCodex } = require(path.join(__dirname, '..', 'core', 'agents', 'project-agent'));

const CITADEL_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  return {
    projectRoot: argv.find((arg, index) => argv[index - 1] === '--project-root')
      ? path.resolve(argv[argv.indexOf('--project-root') + 1])
      : process.cwd(),
    agentName: argv.find((arg, index) => argv[index - 1] === '--agent') || null,
    dryRun: argv.includes('--dry-run'),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceBase = path.join(CITADEL_ROOT, 'agents');
  const targetBase = path.join(args.projectRoot, '.codex', 'agents');

  const agentFiles = args.agentName
    ? [`${args.agentName}.md`]
    : fs.readdirSync(sourceBase).filter((name) => name.endsWith('.md'));

  for (const agentFile of agentFiles) {
    const agentPath = path.join(sourceBase, agentFile);
    const result = projectAgentToCodex(agentPath, targetBase, { dryRun: args.dryRun });
    const verb = args.dryRun ? 'would project' : 'projected';
    console.log(`[${verb}] ${result.parsedAgent.frontmatter.name || result.parsedAgent.name}`);
  }
}

main();
