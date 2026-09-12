const fs = require('fs');

let appSrc = fs.readFileSync('src/App.jsx', 'utf8');

// Replace localhost references
appSrc = appSrc.replace(/http:\/\/localhost:5000/g, '/api');

// Remove mangled translation dictionaries completely except for English
// We will replace "mr": { ... }, "hi": { ... }, "te": { ... }, "ta": { ... } with empty objects or just english fallback.
// Since they are JSON-like objects in the code, let's just use a regex to replace them with English copies.
const enMatch = appSrc.match(/"en":\s*\{([\s\S]*?)\},\s*"mr":/);
if (enMatch) {
  const enContent = enMatch[1];
  appSrc = appSrc.replace(/"mr":\s*\{[\s\S]*?\},\s*"hi":\s*\{[\s\S]*?\},\s*"te":\s*\{[\s\S]*?\},\s*"ta":\s*\{[\s\S]*?\}/, `"mr": {${enContent}}, "hi": {${enContent}}, "te": {${enContent}}, "ta": {${enContent}}`);
}

// Also fix any stray mojibake like â€”
appSrc = appSrc.replace(/â€"/g, '—');
appSrc = appSrc.replace(/â€”/g, '—');
appSrc = appSrc.replace(/â€™/g, "'");
appSrc = appSrc.replace(/â€œ/g, '"');
appSrc = appSrc.replace(/â€/g, '"');
appSrc = appSrc.replace(/a\^/g, ''); // Just in case there is literally a^

fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
console.log('App.jsx fixed');

let indexSrc = fs.readFileSync('index.html', 'utf8');
indexSrc = indexSrc.replace(/â€"/g, '—');
indexSrc = indexSrc.replace(/â€”/g, '—');
// Update favicon/logo
indexSrc = indexSrc.replace('</title>', '</title>\n    <link rel="icon" href="/logo.jpg" />');
fs.writeFileSync('index.html', indexSrc, 'utf8');
console.log('index.html fixed');

