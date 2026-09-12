const fs = require('fs');

let appSrc = fs.readFileSync('src/App.jsx', 'utf8');

// The TRANSLATIONS object is huge. We just want to wipe out all other languages.
const TRANSLATIONS_REGEX = /const TRANSLATIONS = \{([\s\S]*?)\};\n/m;
const match = appSrc.match(TRANSLATIONS_REGEX);

if (match) {
  const fullObj = match[1];
  const enMatch = fullObj.match(/"en":\s*\{([\s\S]*?)\},\s*"/);
  
  if (enMatch) {
    const enContent = enMatch[1];
    appSrc = appSrc.replace(TRANSLATIONS_REGEX, `const TRANSLATIONS = {\n  "en": {\n${enContent}\n  }\n};\n`);
  }
}

// Ensure there are no other syntax errors from mangled strings elsewhere:
// I'll leave the rest of the file untouched, but write back.
fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
console.log('App.jsx TRANSLATIONS fixed');
