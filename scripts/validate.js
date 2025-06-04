#!/usr/bin/env node
// Validate YAML files in workflows/, themes/, and keysets/
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const TARGETS = [
  { dir: 'workflows', name: 'Workflow' },
  { dir: 'themes', name: 'Theme' },
  { dir: 'keysets', name: 'Keyset' },
];

let hasError = false;

function walk(dir, ext = '.yaml') {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(walk(fullPath, ext));
    } else if (file.endsWith(ext)) {
      results.push(fullPath);
    }
  });
  return results;
}

for (const { dir, name } of TARGETS) {
  if (!fs.existsSync(dir)) continue;
  const yamls = walk(dir);
  for (const file of yamls) {
    try {
      const doc = yaml.load(fs.readFileSync(file, 'utf8'));
      if (!doc || typeof doc !== 'object') throw new Error('Invalid YAML root');
    } catch (e) {
      hasError = true;
      console.error(`[ERROR] ${name} YAML invalid: ${file}\n  ${e.message}`);
    }
  }
}
if (hasError) {
  process.exit(1);
} else {
  console.log('All YAML files are valid!');
}
