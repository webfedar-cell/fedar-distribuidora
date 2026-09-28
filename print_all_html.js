const fs = require('fs');

const d = fs.readFileSync('reference/desktop_structure.html', 'utf-8');
const m = fs.readFileSync('reference/mobile_structure.html', 'utf-8');

console.log('=== DESKTOP HTML ===');
console.log(d);

console.log('\n=== MOBILE HTML ===');
console.log(m);
