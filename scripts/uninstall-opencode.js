#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const OPENCODE_CONFIG = process.env.XDG_CONFIG_HOME ||
  path.join(process.env.HOME || '/root', '.config', 'opencode');
const OPENCODE_SKILL_DIR = path.join(OPENCODE_CONFIG, 'skill');
const OPENCODE_COMMAND_DIR = path.join(OPENCODE_CONFIG, 'commands');
const OPENCODE_CONFIG_FILE = path.join(OPENCODE_CONFIG, 'opencode.json');
const SKILL_PREFIX = 'citadel-';
const CITADEL_SKILLS = [
  'architect','archon','ascii-diagram','autopilot','cost','create-app',
  'create-skill','daemon','dashboard','design','do','doc-gen','experiment',
  'fleet','houseclean','improve','infra-audit','learn','live-preview','map',
  'marshal','merge-review','organize','postmortem','pr-watch','prd','qa',
  'refactor','research','research-fleet','review','scaffold','schedule',
  'session-handoff','setup','systematic-debugging','telemetry','test-gen',
  'triage','verify','watch','wiki','workspace',
];

function main() {
  console.log('');
  console.log('=== Citadel OpenCode Uninstaller ===');
  console.log('');

  const entries = fs.readdirSync(OPENCODE_SKILL_DIR);
  const citadelSkills = entries.filter((e) => e.startsWith(SKILL_PREFIX));

  for (const skill of citadelSkills) {
    const linkPath = path.join(OPENCODE_SKILL_DIR, skill);
    try {
      fs.unlinkSync(linkPath);
      console.log(`  Removed: ${skill}`);
    } catch (err) {
      console.error(`  FAIL: ${skill}: ${err.message}`);
    }
  }

  console.log(`Removed ${citadelSkills.length} Citadel skill symlinks`);

  console.log('');
  console.log('Removing slash commands...');
  let cmdsRemoved = 0;
  for (const skill of CITADEL_SKILLS) {
    const cmdPath = path.join(OPENCODE_COMMAND_DIR, skill + '.md');
    if (fs.existsSync(cmdPath)) {
      try {
        fs.unlinkSync(cmdPath);
        cmdsRemoved++;
      } catch (err) {
        console.error(`  FAIL: ${skill}.md: ${err.message}`);
      }
    }
  }
  console.log(`Removed ${cmdsRemoved} Citadel slash commands`);

  if (fs.existsSync(OPENCODE_CONFIG_FILE)) {
    const config = JSON.parse(fs.readFileSync(OPENCODE_CONFIG_FILE, 'utf8'));
    if (config.instructions) {
      const before = config.instructions.length;
      config.instructions = config.instructions.filter(
        (i) => !i.includes('Citadel/runtimes/opencode')
      );
      if (config.instructions.length < before) {
        fs.writeFileSync(OPENCODE_CONFIG_FILE, JSON.stringify(config, null, 2) + '\n');
        console.log('Removed Citadel instructions from opencode.json');
      }
    }
  }

  console.log('');
  console.log('Uninstall complete. Restart OpenCode to apply.');
  console.log('');
}

main();
