#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OPENCODE_CONFIG = process.env.XDG_CONFIG_HOME ||
  path.join(process.env.HOME || '/root', '.config', 'opencode');
const OPENCODE_SKILL_DIR = path.join(OPENCODE_CONFIG, 'skill');
const CITADEL_ROOT = path.resolve(__dirname, '..');
const CITADEL_SKILLS_DIR = path.join(CITADEL_ROOT, 'skills');
const OPENCODE_CONFIG_FILE = path.join(OPENCODE_CONFIG, 'opencode.json');

const SKILL_PREFIX = 'citadel-';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getInstalledSkills() {
  const entries = fs.readdirSync(CITADEL_SKILLS_DIR, { withFileTypes: true });
  return entries
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(CITADEL_SKILLS_DIR, d.name, 'SKILL.md')))
    .map((d) => d.name);
}

function symlinkSkills(skills) {
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const skill of skills) {
    const linkName = path.join(OPENCODE_SKILL_DIR, `${SKILL_PREFIX}${skill}`);
    const target = path.join(CITADEL_SKILLS_DIR, skill);

    if (fs.existsSync(linkName)) {
      const existing = fs.readlinkSync(linkName);
      if (existing === target) {
        skipped++;
        continue;
      }
      fs.unlinkSync(linkName);
    }

    try {
      fs.symlinkSync(target, linkName, 'junction');
      created++;
    } catch (err) {
      console.error(`  FAIL: ${skill}: ${err.message}`);
      failed++;
    }
  }

  return { created, skipped, failed };
}

function updateOpenCodeConfig() {
  if (!fs.existsSync(OPENCODE_CONFIG_FILE)) {
    console.log('  SKIP: opencode.json not found (create it first)');
    return;
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(OPENCODE_CONFIG_FILE, 'utf8'));
  } catch (err) {
    console.error(`  FAIL: Could not parse opencode.json: ${err.message}`);
    return;
  }

  const instructionPath = path.join(
    CITADEL_ROOT, 'runtimes', 'opencode', 'guidance', 'instructions.md'
  );
  const expandedPath = instructionPath
    .replace(process.env.HOME || '/root', '~');

  if (!config.instructions) {
    config.instructions = [];
  }

  const alreadyHas = config.instructions.some((instr) => {
    const expanded = instr.replace('~', process.env.HOME || '/root');
    return expanded === instructionPath || instr.includes('Citadel/runtimes/opencode');
  });

  if (alreadyHas) {
    console.log('  SKIP: Instructions already registered in opencode.json');
    return;
  }

  config.instructions.push(expandedPath);

  fs.writeFileSync(OPENCODE_CONFIG_FILE, JSON.stringify(config, null, 2) + '\n');
  console.log(`  OK: Added Citadel instructions to opencode.json`);
}

function main() {
  console.log('');
  console.log('=== Citadel OpenCode Installer ===');
  console.log('');

  console.log(`Citadel root: ${CITADEL_ROOT}`);
  console.log(`Skill dir:    ${OPENCODE_SKILL_DIR}`);
  console.log('');

  ensureDir(OPENCODE_SKILL_DIR);

  const skills = getInstalledSkills();
  console.log(`Found ${skills.length} Citadel skills`);

  console.log('');
  console.log('Installing skill symlinks...');
  const result = symlinkSkills(skills);
  console.log(`  Created: ${result.created}`);
  console.log(`  Skipped: ${result.skipped} (already exist)`);
  if (result.failed > 0) {
    console.log(`  Failed:  ${result.failed}`);
  }

  console.log('');
  console.log('Registering instructions...');
  updateOpenCodeConfig();

  console.log('');
  console.log('=== Installation Complete ===');
  console.log('');
  console.log(`${skills.length} Citadel skills registered with prefix "${SKILL_PREFIX}"`);
  console.log('');
  console.log('NEXT STEPS:');
  console.log('  1. Restart OpenCode');
  console.log('  2. Use skill tool to list skills and verify Citadel skills appear');
  console.log('  3. Load the citadel-do skill to start routing tasks');
  console.log('  4. Or load citadel-setup for first-run configuration');
  console.log('');

  if (result.failed > 0) {
    process.exit(1);
  }
}

main();
