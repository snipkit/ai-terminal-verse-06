#!/usr/bin/env node
// Generate SVG previews for themes and Markdown summaries for workflows
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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

// THEME SVG PREVIEWS + INDEX
const themeDir = 'themes';
const themeOut = 'static/previews/themes';
if (!fs.existsSync(themeOut)) fs.mkdirSync(themeOut, { recursive: true });
let themeIndex = [];
for (const file of walk(themeDir)) {
  try {
    const theme = yaml.load(fs.readFileSync(file, 'utf8'));
    if (!theme.colors) continue;
    const colors = Object.values(theme.colors).slice(0, 8); // first 8 colors
    const svg = `<svg width='240' height='40' xmlns='http://www.w3.org/2000/svg'>\n${colors.map((c, i) => `<rect x='${i*30}' y='0' width='30' height='40' fill='${c}'/>`).join('')}\n</svg>`;
    const outName = path.basename(file, '.yaml') + '.svg';
    fs.writeFileSync(path.join(themeOut, outName), svg);
    themeIndex.push({
      name: theme.name || path.basename(file, '.yaml'),
      file: outName
    });
  } catch (e) { /* ignore */ }
}
fs.writeFileSync(path.join(themeOut, 'index.json'), JSON.stringify(themeIndex, null, 2));

// WORKFLOW MARKDOWN SUMMARIES + INDEX
const workflowDir = 'workflows';
const workflowOut = 'static/previews/workflows';
if (!fs.existsSync(workflowOut)) fs.mkdirSync(workflowOut, { recursive: true });
let workflowIndex = [];
for (const file of walk(workflowDir)) {
  try {
    const wf = yaml.load(fs.readFileSync(file, 'utf8'));
    let md = `# ${wf.name || path.basename(file)}\n\n`;
    if (wf.description) md += `**Description:** ${wf.description}\n\n`;
    if (wf.steps) {
      md += '## Steps\n';
      wf.steps.forEach((s, i) => {
        md += `- ${s.name || 'Step ' + (i+1)}: ${s.description || ''}\n`;
      });
    }
    const outName = path.basename(file, '.yaml') + '.md';
    fs.writeFileSync(path.join(workflowOut, outName), md);
    workflowIndex.push({
      name: wf.name || path.basename(file, '.yaml'),
      description: wf.description || '',
      file: outName
    });
  } catch (e) { /* ignore */ }
}
fs.writeFileSync(path.join(workflowOut, 'index.json'), JSON.stringify(workflowIndex, null, 2));

console.log('Theme SVGs, workflow summaries, and index.json files generated!');
