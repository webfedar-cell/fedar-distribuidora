const fs = require('fs');

const origHtml = fs.readFileSync('reference/FEDAR — Home rediseño - nueva pagina.html', 'utf-8');

// Look for data-props or JSON strings
const jsonMatches = [...origHtml.matchAll(/\{[^{}]*"num"[^{}]*\}/gi)].map(m => m[0]);
console.log('JSON matches with num:', jsonMatches);

// Let's search for words like "Terminales", "Arandelas", "Grampas", "Tornillos", etc.
const productWords = ['Terminales', 'Conectores', 'Orings', 'Abrazaderas', 'Bulones', 'Arandelas', 'Fusibles', 'Precintos', 'Cables'];
productWords.forEach(word => {
  const found = origHtml.includes(word);
  console.log(`Word "${word}": ${found}`);
});

// Let's print the category section from desktop_structure.html
const d = fs.readFileSync('reference/desktop_structure.html', 'utf-8');
const catSection = d.slice(d.indexOf('id="productos"'), d.indexOf('id="como-trabajamos"'));
console.log('\n--- Category Section in HTML ---');
console.log(catSection);
