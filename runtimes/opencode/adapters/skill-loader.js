#!/usr/bin/env node

'use strict';

const path = require('path');

const CITADEL_ROOT = path.resolve(__dirname, '../../..');

function getSkillPath(skillName) {
  return path.join(CITADEL_ROOT, 'skills', skillName, 'SKILL.md');
}

function listSkills() {
  const fs = require('fs');
  const skillsDir = path.join(CITADEL_ROOT, 'skills');
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function getScriptPath(scriptName) {
  return path.join(CITADEL_ROOT, 'scripts', scriptName);
}

function getGuidanceDir() {
  return path.join(CITADEL_ROOT, 'runtimes', 'opencode', 'guidance');
}

module.exports = Object.freeze({
  id: 'opencode',
  CITADEL_ROOT,
  getSkillPath,
  listSkills,
  getScriptPath,
  getGuidanceDir,
});
