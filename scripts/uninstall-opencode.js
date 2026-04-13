#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const OPENCODE_CONFIG = process.env.XDG_CONFIG_HOME ||
  path.join(process.env.HOME || '/root', '.config', 'opencode');
const OPENCODE_SKILL_DIR = path.join(OPENCODE_CONFIG, 'skill');
const OPENCODE_CONFIG_FILE = path.join(OPENCODE_CONFIG, 'opencode.json');
const SKILL_PREFIX = 'citadel-';

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
