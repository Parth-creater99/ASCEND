const fs = require('fs');

let appSrc = fs.readFileSync('src/App.jsx', 'utf8');

const startIndex = appSrc.indexOf('const TRANSLATIONS = {');
const endIndex = appSrc.indexOf('// ==========================================', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const enMatch = appSrc.match(/"en":\s*\{([\s\S]*?)\},\s*"/);
  if (enMatch) {
    const enContent = enMatch[1];
    const newTranslations = "const TRANSLATIONS = {\n  \"en\": {\n" + enContent + "\n  }\n};\n";
    appSrc = appSrc.substring(0, startIndex) + newTranslations + appSrc.substring(endIndex);
    fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
    console.log('App.jsx TRANSLATIONS fixed using substring');
  } else {
    console.log('Could not find EN block');
  }
} else {
  console.log('Could not find start or end index');
}
