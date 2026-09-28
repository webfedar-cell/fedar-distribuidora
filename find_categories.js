const fs = require('fs');

const js = fs.readFileSync('reference/desktop_app.js', 'utf-8');
const lines = js.split('\n');
console.log('Total lines:', lines.length);

// Search for categories or default props in js
const matches = [...js.matchAll(/categories[\s\S]{0,500}/gi)].map(m => m[0]);
console.log('Categories occurrences:', matches.slice(0, 5));

const dataProps = [...js.matchAll(/props\s*=\s*\{[\s\S]{0,1000}\}/gi)].map(m => m[0]);
console.log('Props objects:', dataProps.slice(0, 5));
