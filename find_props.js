const fs = require('fs');

const d = fs.readFileSync('reference/desktop_structure.html', 'utf-8');
const m = fs.readFileSync('reference/mobile_structure.html', 'utf-8');

const placeholdersD = [...d.matchAll(/\{\{([^}]+)\}\}/g)].map(x => x[1]);
const placeholdersM = [...m.matchAll(/\{\{([^}]+)\}\}/g)].map(x => x[1]);

console.log('Placeholders Desktop:', [...new Set(placeholdersD)]);
console.log('Placeholders Mobile:', [...new Set(placeholdersM)]);

// Check template variables or props in desktop.html
const dRaw = fs.readFileSync('reference/desktop.html', 'utf-8');
const propMatch = dRaw.match(/data-props=["']([^"']+)["']/);
console.log('Data props:', propMatch ? propMatch[1] : 'No data-props attribute');

// Look for accent color definitions in script or html
const accentMatches = [...dRaw.matchAll(/accent[^,;}]*/gi)].map(m => m[0]);
console.log('Accent occurrences:', accentMatches.slice(0, 10));
