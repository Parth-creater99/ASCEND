const fs = require('fs');
let appSrc = fs.readFileSync('src/App.jsx', 'utf8');
// Fix all instances of ` "¢ ` or similar syntax errors from bad encoding
appSrc = appSrc.replace(/" "¢ "/g, '" — "');
appSrc = appSrc.replace(/"¢/g, '"');
fs.writeFileSync('src/App.jsx', appSrc, 'utf8');
console.log('Fixed syntax error');
